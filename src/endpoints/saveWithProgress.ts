import { getTranslation } from '@payloadcms/translations'
import {
  createOperation,
  type Endpoint,
  formatErrors,
  headersWithCors,
  parseParams,
  type PayloadRequest,
  sanitizePopulateParam,
  sanitizeSelectParam,
  updateByIDOperation,
  updateOperationGlobal,
} from 'payload'

import { attachProgress, type SaveStage } from '@/lib/saveProgress'

type Body = {
  target: 'collection' | 'global'
  slug: string
  id?: string | number
  data: Record<string, unknown>
}

type Event =
  | { type: 'stage'; stage: 'received' | SaveStage }
  | { type: 'done'; status: number; body: unknown }

/**
 * POST /api/falah-save — the same save as Payload's REST API (same
 * operations, same query parameters: locale, draft, depth…, same response
 * body), streamed as NDJSON so the editor can show real progress:
 *   {"type":"stage","stage":"received"}      body read by the server
 *   {"type":"stage","stage":"preparing"}     beforeValidate hooks
 *   {"type":"stage","stage":"writing"}       field validation + database write
 *   {"type":"stage","stage":"saved"}         written (afterChange)
 *   {"type":"stage","stage":"revalidating"}  refreshing the website
 *   {"type":"done","status":200,"body":{…}}  exactly what REST would return
 */
async function save(req: PayloadRequest, body: Body): Promise<{ status: number; body: unknown }> {
  const params = parseParams(req.query)
  const { depth, draft, populate, publishAllLocales, select } = params
  const publishSpecificLocale = req.query.publishSpecificLocale as string | undefined

  if (body.target === 'global') {
    const globalConfig = req.payload.config.globals.find((g) => g.slug === body.slug)
    if (!globalConfig) return { status: 404, body: { errors: [{ message: 'Not Found' }] } }
    const result = await updateOperationGlobal({
      slug: globalConfig.slug,
      data: body.data,
      depth,
      draft,
      globalConfig,
      populate: sanitizePopulateParam(req.query.populate),
      publishAllLocales,
      publishSpecificLocale,
      req,
      select: sanitizeSelectParam(req.query.select),
      unpublishAllLocales: params.unpublishAllLocales,
    })
    const message = draft ? req.t('version:draftSavedSuccessfully') : req.t('general:updatedSuccessfully')
    return { status: 200, body: { message, result } }
  }

  const collection = req.payload.collections[body.slug as keyof typeof req.payload.collections]
  if (!collection) return { status: 404, body: { errors: [{ message: 'Not Found' }] } }

  if (body.id === undefined || body.id === null || body.id === '') {
    const doc = await createOperation({
      collection,
      data: body.data,
      depth,
      draft,
      populate,
      publishAllLocales,
      publishSpecificLocale,
      req,
      select,
    })
    const label = getTranslation(collection.config.labels.singular, req.i18n)
    return { status: 201, body: { doc, message: req.t('general:successfullyCreated', { label }) } }
  }

  const doc = await updateByIDOperation({
    id: body.id,
    collection,
    data: body.data,
    depth,
    draft,
    overrideLock: params.overrideLock ?? false,
    populate,
    publishAllLocales,
    publishSpecificLocale,
    req,
    select,
    unpublishAllLocales: params.unpublishAllLocales,
  })
  const message = draft ? req.t('version:draftSavedSuccessfully') : req.t('general:updatedSuccessfully')
  return { status: 200, body: { doc, message } }
}

export const saveWithProgress: Endpoint = {
  path: '/falah-save',
  method: 'post',
  handler: async (req) => {
    const headers = headersWithCors({
      headers: new Headers({
        'content-type': 'application/x-ndjson; charset=utf-8',
        'cache-control': 'no-cache, no-transform',
        // Don't let proxies hold the stream back.
        'x-accel-buffering': 'no',
      }),
      req,
    })
    if (!req.user) {
      headers.set('content-type', 'application/json')
      return Response.json({ errors: [{ message: req.t('error:unauthorized') }] }, { status: 401, headers })
    }

    let body: Body
    try {
      body = (await req.json?.()) as Body
    } catch {
      body = undefined as never
    }
    if (!body || typeof body.slug !== 'string' || !body.data || typeof body.data !== 'object') {
      headers.set('content-type', 'application/json')
      return Response.json({ errors: [{ message: 'Invalid request' }] }, { status: 400, headers })
    }

    const encoder = new TextEncoder()
    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        const send = (event: Event) => controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`))
        send({ type: 'stage', stage: 'received' })
        attachProgress(req, body.slug, (stage) => send({ type: 'stage', stage }))
        try {
          const result = await save(req, body)
          send({ type: 'done', ...result })
        } catch (error) {
          const err = error as { status?: number }
          send({
            type: 'done',
            status: typeof err.status === 'number' ? err.status : 500,
            body: formatErrors(error as Parameters<typeof formatErrors>[0]),
          })
        } finally {
          controller.close()
        }
      },
    })
    return new Response(stream, { status: 200, headers })
  },
}
