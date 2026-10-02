import type { CollectionBeforeChangeHook } from 'payload'

/** A readable file name from what the editor uploaded: no path, no odd characters. */
function cleanBase(original: string): string {
  const base = original.split(/[\\/]/).pop() ?? ''
  const withoutExt = base.replace(/\.[^.]+$/, '')
  return (
    withoutExt
      // eslint-disable-next-line no-control-regex
      .replace(/[\u0000-\u001f<>:"|?*]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 120) || 'file'
  )
}

/** "name.png", then "name-1.png", "name-2.png"… — the first one not used yet. */
export async function uniqueDisplayName(
  req: Parameters<CollectionBeforeChangeHook>[0]['req'],
  base: string,
  extension: string,
  ownId?: number | string,
): Promise<string> {
  const taken = new Set(
    (
      await req.payload.find({
        collection: 'media',
        where: {
          and: [
            { displayName: { like: base } },
            ...(ownId !== undefined ? [{ id: { not_equals: ownId } }] : []),
          ],
        },
        limit: 1000,
        depth: 0,
        pagination: false,
        select: { displayName: true },
        req,
      })
    ).docs.map((d) => String(d.displayName ?? '').toLowerCase()),
  )
  let name = `${base}.${extension}`
  for (let n = 1; taken.has(name.toLowerCase()); n++) name = `${base}-${n}.${extension}`
  return name
}

/**
 * Names a new upload after the file the editor picked (the stored file keeps
 * its random name). Duplicates get -1, -2… A name already set (copying media
 * between environments) is kept, only made unique.
 */
export const setMediaDisplayName: CollectionBeforeChangeHook = async ({
  data,
  req,
  originalDoc,
}) => {
  const original = req.context?.uploadOriginalName
  const extension = req.context?.uploadExtension
  if (typeof original !== 'string' || typeof extension !== 'string') return data

  const wanted = typeof data.displayName === 'string' && data.displayName.trim() ? data.displayName : original
  const base = cleanBase(wanted)
  return {
    ...data,
    displayName: await uniqueDisplayName(req, base, extension, originalDoc?.id),
  }
}
