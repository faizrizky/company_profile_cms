import { randomUUID } from 'node:crypto'

import createDOMPurify from 'dompurify'
import { fileTypeFromBuffer } from 'file-type'
import { JSDOM } from 'jsdom'
import { APIError, type CollectionBeforeOperationHook } from 'payload'

import { MAX_FILE_BYTES, MAX_UPLOAD_BYTES, MAX_VIDEO_BYTES } from '@/lib/uploadLimits'

export { MAX_FILE_BYTES, MAX_UPLOAD_BYTES, MAX_VIDEO_BYTES } from '@/lib/uploadLimits'

/** Binary formats, verified by magic bytes — the extension and the browser-sent MIME are ignored. */
const BINARY_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
  'image/gif': 'gif',
  'application/pdf': 'pdf',
  'video/mp4': 'mp4',
  'video/webm': 'webm',
}

export const VIDEO_MIME_TYPES = ['video/mp4', 'video/webm']

export const ALLOWED_MIME_TYPES = [...Object.keys(BINARY_TYPES), 'image/svg+xml']

const purify = createDOMPurify(new JSDOM('').window)

/**
 * SVG is XML and can carry <script>, event handlers and external references.
 * Strip everything that isn't pure vector markup.
 */
function sanitizeSvg(raw: string): string {
  return purify.sanitize(raw, {
    USE_PROFILES: { svg: true, svgFilters: true },
    FORBID_TAGS: ['script', 'foreignObject', 'iframe', 'embed', 'object', 'use', 'a'],
    FORBID_ATTR: ['href', 'xlink:href'],
  })
}

const reject = (message: string) => new APIError(message, 400, undefined, true)

/**
 * Runs before Payload writes an upload anywhere:
 * - enforces the size limit,
 * - identifies the real type from file content (blocks polyglots / renamed executables),
 * - sanitizes SVG,
 * - replaces the client filename with a random one (no path tricks, no guessable names).
 */
export const secureUpload: CollectionBeforeOperationHook = async ({ args, operation, req }) => {
  if (operation !== 'create' && operation !== 'update') return args

  const file = req.file
  if (!file) return args

  if (file.size > MAX_UPLOAD_BYTES) {
    throw reject(`Ukuran file maksimal ${MAX_UPLOAD_BYTES / 1024 / 1024} MB.`)
  }

  const detected = await fileTypeFromBuffer(file.data)
  let extension: string

  if (detected) {
    const ext = BINARY_TYPES[detected.mime]
    if (!ext) throw reject(`Tipe file tidak diizinkan (${detected.mime}).`)
    const isVideo = VIDEO_MIME_TYPES.includes(detected.mime)
    const limit = isVideo ? MAX_VIDEO_BYTES : MAX_FILE_BYTES
    if (file.size > limit) {
      throw reject(`Ukuran ${isVideo ? 'video' : 'file'} maksimal ${limit / 1024 / 1024} MB.`)
    }
    file.mimetype = detected.mime
    extension = ext
  } else {
    const text = file.data.toString('utf8')
    if (!/<svg[\s>]/i.test(text)) {
      throw reject(
        'Tipe file tidak dikenali. Gunakan JPG, PNG, WebP, AVIF, GIF, SVG, PDF, MP4, atau WebM.',
      )
    }
    if (file.size > MAX_FILE_BYTES) {
      throw reject(`Ukuran file maksimal ${MAX_FILE_BYTES / 1024 / 1024} MB.`)
    }
    const clean = sanitizeSvg(text)
    const root = /<svg\b[^>]*>/i.exec(clean)?.[0]
    if (!root) throw reject('File SVG tidak valid.')
    if (!/\sviewBox=/i.test(root) && !(/\swidth=/i.test(root) && /\sheight=/i.test(root))) {
      throw reject('SVG harus memiliki atribut viewBox atau width & height.')
    }

    file.data = Buffer.from(clean, 'utf8')
    file.size = file.data.byteLength
    file.mimetype = 'image/svg+xml'
    extension = 'svg'
  }

  // The stored name stays random; the name the editor uploaded is kept for the
  // admin (see hooks/mediaDisplayName.ts).
  req.context = { ...req.context, uploadOriginalName: file.name, uploadExtension: extension }
  file.name = `${randomUUID()}.${extension}`
  return args
}
