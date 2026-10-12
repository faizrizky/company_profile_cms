// Runs after `npm install` / `npm ci` (package.json "postinstall").
//
// Two small fixes to Payload 3.90.1's upload field, made in the one place that
// builds the "Edit image" (crop) dialog:
//
// 1. Replacing the file of an existing upload and opening "Edit image" before
//    saving showed the OLD saved image in the dialog, with the old pixel size
//    (Width / Height). Applying that crop to the new file cut it to the old
//    size: a 1920×910 upload ended up 1440×772. The dialog was given
//    `fileSrc: data?.url || fileSrc`; once the saved file has been removed
//    (`removedFile`) it must use the new file's preview instead, and without
//    the cache-busting `?updatedAt` suffix, which breaks a blob: URL.
//
// 2. The dialog title was the stored (random) file name; media have a readable
//    `displayName`, so use that when there is one.
//
// Fails loudly when Payload's code no longer looks like this, so an upgrade
// that fixes (or moves) it is noticed: then remove the step, or this script and
// the "postinstall" entry from package.json.
import { existsSync, readFileSync, writeFileSync } from 'node:fs'

const ui = 'node_modules/@payloadcms/ui/dist'
const id = '[\\w$]+'

// Same code in two forms: the readable module, and the minified client bundle
// (the one Next.js actually loads). Each step: is it already applied, and how
// to apply it (null = the code is not what we expect).
const targets = [
  {
    file: `${ui}/elements/Upload/index.js`,
    steps: [
      {
        isPatched: (code) =>
          code.includes('imageCacheTag: removedFile ? undefined : imageCacheTag'),
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
        isPatched: (code) =>
          code.includes('fileName: value?.name || data?.displayName || data?.filename,'),
        apply: (code) => {
          const before = 'fileName: value?.name || data?.filename,'
          if (!code.includes(before)) return null
          return code.replace(
            before,
            'fileName: value?.name || data?.displayName || data?.filename,',
          )
        },
      },
    ],
  },
  {
    file: `${ui}/exports/client/index.js`,
    steps: [
      {
        isPatched: (code) =>
          new RegExp(
            `fileSrc:!${id}&&${id}\\?\\.url\\|\\|${id},imageCacheTag:${id}\\?void 0:`,
          ).test(code),
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
      {
        isPatched: (code) =>
          new RegExp(
            `fileName:${id}\\?\\.name\\|\\|${id}\\?\\.displayName\\|\\|${id}\\?\\.filename,fileSrc:`,
          ).test(code),
        apply: (code) => {
          // fileName:<file>?.name||<data>?.filename,fileSrc:
          const call = new RegExp(
            `fileName:(${id})\\?\\.name\\|\\|(${id})\\?\\.filename,fileSrc:`,
          ).exec(code)
          if (!call) return null
          const [text, file, data] = call
          return code.replace(
            text,
            `fileName:${file}?.name||${data}?.displayName||${data}?.filename,fileSrc:`,
          )
        },
      },
    ],
  },
]

let failed = false
for (const { file, steps } of targets) {
  if (!existsSync(file)) {
    console.error(`patch-payload-upload: ${file} not found`)
    failed = true
    continue
  }
  let code = readFileSync(file, 'utf8')
  let changed = false
  for (const { isPatched, apply } of steps) {
    if (isPatched(code)) continue
    const next = apply(code)
    if (next === null) {
      console.error(
        `patch-payload-upload: ${file} does not look like Payload 3.90.1 any more — review scripts/patch-payload-upload.mjs`,
      )
      failed = true
      continue
    }
    code = next
    changed = true
  }
  if (changed) {
    writeFileSync(file, code)
    console.log(`patch-payload-upload: patched ${file}`)
  }
}
process.exit(failed ? 1 : 0)
