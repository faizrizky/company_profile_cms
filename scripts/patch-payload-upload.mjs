// Runs after `npm install` / `npm ci` (package.json "postinstall").
//
// Payload 3.90.1 bug: replacing the file of an existing upload and opening
// "Edit image" before saving shows the OLD saved image in the crop dialog, with
// the old pixel size (Width / Height). Applying that crop to the new file cuts
// it to the old size: a 1920×910 upload ends up 1440×772.
//
// The dialog is given `fileSrc: data?.url || fileSrc`. Once the saved file has
// been removed (`removedFile`) it must use the new file's preview instead, and
// without the cache-busting `?updatedAt` suffix, which breaks a blob: URL.
//
// Fails loudly when Payload's code no longer looks like this, so an upgrade
// that fixes (or moves) it is noticed: then remove this script and the
// "postinstall" entry from package.json.
import { existsSync, readFileSync, writeFileSync } from 'node:fs'

const ui = 'node_modules/@payloadcms/ui/dist'
const id = '[\\w$]+'

// Same code in two forms: the readable module, and the minified client bundle
// (the one Next.js actually loads).
const targets = [
  {
    file: `${ui}/elements/Upload/index.js`,
    isPatched: (code) => code.includes('imageCacheTag: removedFile ? undefined : imageCacheTag'),
    apply: (code) => {
      const before = 'fileSrc: data?.url || fileSrc,\n          imageCacheTag: imageCacheTag,'
      if (!code.includes(before)) return null
      return code.replace(
        before,
        'fileSrc: !removedFile && data?.url || fileSrc,\n          imageCacheTag: removedFile ? undefined : imageCacheTag,',
      )
    },
  },
  {
    file: `${ui}/exports/client/index.js`,
    isPatched: (code) =>
      new RegExp(`fileSrc:!${id}&&${id}\\?\\.url\\|\\|${id},imageCacheTag:${id}\\?void 0:`).test(
        code,
      ),
    apply: (code) => {
      // fileSrc:<data>?.url||<preview>,imageCacheTag:<tag>,initialCrop …
      // … enablePreviewSizes:x&&<data>?.filename&&!<removed>
      const call = new RegExp(
        `fileSrc:(${id})\\?\\.url\\|\\|(${id}),imageCacheTag:(${id}),initialCrop`,
      ).exec(code)
      if (!call) return null
      const [text, data, preview, tag] = call
      const removed = new RegExp(
        `enablePreviewSizes:${id}&&${data.replaceAll('$', '\\$')}\\?\\.filename&&!(${id})`,
      ).exec(code)
      if (!removed) return null
      return code.replace(
        text,
        `fileSrc:!${removed[1]}&&${data}?.url||${preview},imageCacheTag:${removed[1]}?void 0:${tag},initialCrop`,
      )
    },
  },
]

let failed = false
for (const { file, isPatched, apply } of targets) {
  if (!existsSync(file)) {
    console.error(`patch-payload-upload: ${file} not found`)
    failed = true
    continue
  }
  const code = readFileSync(file, 'utf8')
  if (isPatched(code)) continue
  const next = apply(code)
  if (next === null) {
    console.error(
      `patch-payload-upload: ${file} does not look like Payload 3.90.1 any more — review scripts/patch-payload-upload.mjs`,
    )
    failed = true
    continue
  }
  writeFileSync(file, next)
  console.log(`patch-payload-upload: patched ${file}`)
}
process.exit(failed ? 1 : 0)
