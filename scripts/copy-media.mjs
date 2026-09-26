// Copies every object from the local media bucket (MinIO, credentials in .env)
// to the cloud bucket (credentials in .env.cloud). Used by copy-to-cloud.sh;
// the MinIO client (mc) can't talk to endpoints with a path, e.g. Supabase's
// https://<ref>.storage.supabase.co/storage/v1/s3.
import { readFileSync } from 'node:fs'

import { GetObjectCommand, HeadObjectCommand, ListObjectsV2Command, S3Client } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'

function readEnv(file) {
  const vars = {}
  for (const line of readFileSync(file, 'utf8').split('\n')) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/)
    if (match) vars[match[1]] = match[2].replace(/^(['"])(.*)\1$/, '$2')
  }
  return vars
}

const local = readEnv('.env')
const cloud = readEnv('.env.cloud')

const client = (env) =>
  new S3Client({
    endpoint: env.S3_ENDPOINT,
    region: env.S3_REGION || 'us-east-1',
    forcePathStyle: true,
    credentials: { accessKeyId: env.S3_ACCESS_KEY_ID, secretAccessKey: env.S3_SECRET_ACCESS_KEY },
  })

const from = client(local)
const to = client(cloud)
const fromBucket = local.S3_BUCKET
const toBucket = cloud.S3_BUCKET || 'falah-media'

let copied = 0
let skipped = 0
let token
do {
  const page = await from.send(new ListObjectsV2Command({ Bucket: fromBucket, ContinuationToken: token }))
  for (const { Key, Size } of page.Contents ?? []) {
    const existing = await to.send(new HeadObjectCommand({ Bucket: toBucket, Key })).catch(() => null)
    if (existing?.ContentLength === Size) {
      skipped++
      continue
    }
    const object = await from.send(new GetObjectCommand({ Bucket: fromBucket, Key }))
    await new Upload({
      client: to,
      params: { Bucket: toBucket, Key, Body: object.Body, ContentType: object.ContentType },
    }).done()
    copied++
    process.stdout.write(`\r  ${copied} copied, ${skipped} already there — ${Key}`.padEnd(100))
  }
  token = page.NextContinuationToken
} while (token)

console.log(`\n  ${copied} copied, ${skipped} already there.`)
