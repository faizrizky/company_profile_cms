#!/usr/bin/env node
/**
 * Security smoke test against a running CMS.
 *
 *   CMS_URL=http://localhost:3001 \
 *   ADMIN_EMAIL=… ADMIN_PASSWORD=… CONTACT_API_KEY=… \
 *   node scripts/security-smoke.mjs
 *
 * Creates a temporary editor account and a few records, and removes them
 * afterwards. Uses 3 login requests (the auth rate limit is 10 / 15 min / IP).
 * Exit code 1 if any check fails.
 */
const BASE = process.env.CMS_URL ?? 'http://localhost:3001'
const { ADMIN_EMAIL, ADMIN_PASSWORD, CONTACT_API_KEY } = process.env
if (!ADMIN_EMAIL || !ADMIN_PASSWORD || !CONTACT_API_KEY) {
  console.error('Set ADMIN_EMAIL, ADMIN_PASSWORD and CONTACT_API_KEY')
  process.exit(2)
}

const results = []
const check = (name, ok, detail = '') => {
  results.push({ name, ok })
  console.log(`${ok ? '✅' : '❌'} ${name}${detail ? ` — ${detail}` : ''}`)
}

async function api(path, { token, json, form, method = 'GET', headers = {} } = {}) {
  const init = { method, headers: { ...headers } }
  if (token) init.headers.authorization = `JWT ${token}`
  if (json !== undefined) {
    init.headers['content-type'] = 'application/json'
    init.body = JSON.stringify(json)
  }
  if (form) init.body = form
  const res = await fetch(new URL(path, BASE), init)
  const text = await res.text()
  let body
  try {
    body = JSON.parse(text)
  } catch {
    body = text
  }
  return { status: res.status, body, headers: res.headers }
}

const errorMessage = (body) =>
  body?.errors?.[0]?.data?.errors?.[0]?.message ?? body?.errors?.[0]?.message ?? JSON.stringify(body)

async function login(email, password) {
  const { body } = await api('/api/users/login', { method: 'POST', json: { email, password } })
  return body?.token
}

function fileForm(name, content, type = 'application/octet-stream') {
  const form = new FormData()
  form.append('file', new Blob([content], { type }), name)
  form.append('_payload', JSON.stringify({ alt: 'smoke test' }))
  return form
}

const cleanup = []

try {
  // ── Anonymous visitor ────────────────────────────────────────────────
  const home = await api('/api/pages?where[slug][equals]=home&depth=0')
  check('anon can read published pages', home.status === 200 && home.body.docs?.[0]?._status === 'published')
  const homeId = home.body.docs?.[0]?.id

  for (const [label, path, method, json] of [
    ['anon cannot create pages', '/api/pages', 'POST', { title: 'x', slug: 'x', layout: [] }],
    ['anon cannot edit pages', `/api/pages/${homeId}`, 'PATCH', { title: 'hacked' }],
    ['anon cannot delete media', '/api/media/1', 'DELETE'],
    ['anon cannot edit site settings', '/api/globals/site-settings', 'POST', { siteName: 'hacked' }],
    ['anon cannot list users', '/api/users', 'GET'],
    ['anon cannot read audit logs', '/api/audit-logs', 'GET'],
    ['anon cannot read contact inbox', '/api/contact-submissions', 'GET'],
    ['anon cannot write contact inbox directly', '/api/contact-submissions', 'POST', { fullName: 'x' }],
    ['anon cannot read page versions', '/api/pages/versions', 'GET'],
    ['first-register is closed', '/api/users/first-register', 'POST', { email: 'evil@x.test', password: 'Aa1!aaaaaaaaaa' }],
  ]) {
    const res = await api(path, { method, json })
    check(label, res.status === 403, `HTTP ${res.status}`)
  }

  const gql = await api('/api/graphql', { method: 'POST', json: { query: '{__typename}' } })
  check('GraphQL is disabled', gql.status === 404, `HTTP ${gql.status}`)

  const adminHeaders = (await fetch(new URL('/admin/login', BASE))).headers
  check('admin sends CSP + frame-ancestors none', /frame-ancestors 'none'/.test(adminHeaders.get('content-security-policy') ?? ''))
  check('admin sends X-Frame-Options DENY', adminHeaders.get('x-frame-options') === 'DENY')
  check('admin is noindex', /noindex/.test(adminHeaders.get('x-robots-tag') ?? ''))

  // ── Contact endpoint ─────────────────────────────────────────────────
  const submission = {
    fullName: 'Smoke Test',
    organization: 'QA',
    email: 'qa@example.com',
    phone: '+62 812 0000',
    interest: 'Command Center',
    message: 'hello',
  }
  const client = { ip: '203.0.113.1', userAgent: 'security-smoke' }
  const noKey = await api('/api/contact-submissions/submit', { method: 'POST', json: { submission, client } })
  check('contact submit requires API key', noKey.status === 401, `HTTP ${noKey.status}`)
  const badKey = await api('/api/contact-submissions/submit', {
    method: 'POST',
    json: { submission, client },
    headers: { 'x-contact-key': `${CONTACT_API_KEY.slice(0, -1)}x` },
  })
  check('contact submit rejects wrong key', badKey.status === 401, `HTTP ${badKey.status}`)
  const invalid = await api('/api/contact-submissions/submit', {
    method: 'POST',
    json: { submission: { ...submission, email: 'nope' }, client },
    headers: { 'x-contact-key': CONTACT_API_KEY },
  })
  check('contact submit validates input', invalid.status === 400, `HTTP ${invalid.status}`)
  const ok = await api('/api/contact-submissions/submit', {
    method: 'POST',
    json: { submission, client },
    headers: { 'x-contact-key': CONTACT_API_KEY },
  })
  check('contact submit accepts valid input', ok.status === 201, `HTTP ${ok.status}`)

  // ── Admin ────────────────────────────────────────────────────────────
  const adminToken = await login(ADMIN_EMAIL, ADMIN_PASSWORD)
  check('admin can log in', Boolean(adminToken))
  if (!adminToken) throw new Error('Cannot continue without admin token')

  const inbox = await api('/api/contact-submissions?depth=0&limit=100', { token: adminToken })
  for (const doc of inbox.body.docs ?? []) {
    if (doc.email === submission.email) cleanup.push(() => api(`/api/contact-submissions/${doc.id}`, { method: 'DELETE', token: adminToken }))
  }

  for (const [label, name, content, type] of [
    ['rejects HTML disguised as PNG', 'evil.png', '<html><script>alert(1)</script></html>', 'image/png'],
    ['rejects PHP upload', 'shell.php', '<?php system($_GET["c"]); ?>', 'application/x-php'],
    ['rejects executable disguised as JPG', 'evil.jpg', new Uint8Array([0x4d, 0x5a, 0x90, 0, 3, 0, 0, 0, 4, 0, 0, 0]), 'image/jpeg'],
  ]) {
    const res = await api('/api/media', { method: 'POST', token: adminToken, form: fileForm(name, content, type) })
    check(`upload ${label}`, res.status === 400, errorMessage(res.body))
  }

  const evilSvg =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10" onload="alert(1)"><script>alert(2)</script>' +
    '<a href="javascript:alert(3)"><rect width="10" height="10"/></a><circle r="4"/></svg>'
  const svg = await api('/api/media', { method: 'POST', token: adminToken, form: fileForm('logo.svg', evilSvg, 'image/svg+xml') })
  if (svg.status === 201) {
    cleanup.push(() => api(`/api/media/${svg.body.doc.id}`, { method: 'DELETE', token: adminToken }))
    const stored = await (await fetch(svg.body.doc.url)).text()
    check(
      'SVG upload is sanitized',
      !/script|onload|javascript:/i.test(stored) && /<circle/.test(stored),
      stored.slice(0, 120),
    )
    check('upload filename is randomized', /^[0-9a-f-]{36}\.svg$/.test(svg.body.doc.filename), svg.body.doc.filename)
  } else {
    check('SVG upload is sanitized', false, `HTTP ${svg.status}: ${errorMessage(svg.body)}`)
  }

  const jsLink = await api('/api/globals/navigation', {
    method: 'POST',
    token: adminToken,
    json: { cta: { label: 'x', href: 'javascript:alert(1)' } },
  })
  check('javascript: links are rejected', jsLink.status === 400, errorMessage(jsLink.body))

  const weak = await api('/api/users', {
    method: 'POST',
    token: adminToken,
    json: { email: 'weak@falah.test', password: 'password123', roles: ['editor'] },
  })
  check('weak passwords are rejected', weak.status === 400, errorMessage(weak.body))

  // ── Editor (least privilege) ─────────────────────────────────────────
  const editorEmail = `smoke-${Date.now()}@falah.test`
  const editorPassword = `Qx7!${crypto.randomUUID()}`
  const created = await api('/api/users', {
    method: 'POST',
    token: adminToken,
    json: { email: editorEmail, password: editorPassword, roles: ['editor'] },
  })
  const editorId = created.body?.doc?.id
  check('admin can create an editor', created.status === 201, errorMessage(created.body))
  if (editorId) cleanup.push(() => api(`/api/users/${editorId}`, { method: 'DELETE', token: adminToken }))

  const editorToken = await login(editorEmail, editorPassword)
  check('editor can log in', Boolean(editorToken))

  if (editorToken) {
    await api(`/api/users/${editorId}`, { method: 'PATCH', token: editorToken, json: { roles: ['admin'] } })
    const after = await api(`/api/users/${editorId}`, { token: adminToken })
    check('editor cannot promote themselves', JSON.stringify(after.body.roles) === '["editor"]', JSON.stringify(after.body.roles))

    const users = await api('/api/users', { token: editorToken })
    check('editor only sees own account', users.body.totalDocs === 1, `sees ${users.body.totalDocs}`)

    for (const [label, path, method, json] of [
      ['editor cannot read audit logs', '/api/audit-logs', 'GET'],
      ['editor cannot delete pages', `/api/pages/${homeId}`, 'DELETE'],
      ['editor cannot change site settings', '/api/globals/site-settings', 'POST', { siteName: 'x' }],
      ['editor cannot create users', '/api/users', 'POST', { email: 'x@falah.test', password: 'Qx7!aaaaaaaaaaa', roles: ['admin'] }],
    ]) {
      const res = await api(path, { method, json, token: editorToken })
      check(label, res.status === 403, `HTTP ${res.status}`)
    }

    const draftTitle = `DRAFT ${Date.now()}`
    await api(`/api/pages/${homeId}?draft=true`, { method: 'PATCH', token: editorToken, json: { title: draftTitle } })
    const anon = await api(`/api/pages/${homeId}?depth=0&draft=true`)
    const editorView = await api(`/api/pages/${homeId}?depth=0&draft=true`, { token: editorToken })
    check('drafts are invisible to the public', anon.body.title !== draftTitle, `public sees "${anon.body.title}"`)
    check('drafts are visible to editors', editorView.body.title === draftTitle)
    // Discard the draft by re-publishing the live title.
    await api(`/api/pages/${homeId}`, { method: 'PATCH', token: adminToken, json: { title: anon.body.title, _status: 'published' } })
  }

  // ── Audit trail ──────────────────────────────────────────────────────
  const audit = await api('/api/audit-logs?limit=50&depth=0', { token: adminToken })
  const actions = new Set((audit.body.docs ?? []).map((d) => `${d.action}:${d.resource}`))
  check('logins are audited', actions.has('login:users'))
  check('changes are audited', actions.has('update:pages') && actions.has('create:users'))
  const firstAudit = audit.body.docs?.[0]?.id
  const delAudit = await api(`/api/audit-logs/${firstAudit}`, { method: 'DELETE', token: adminToken })
  check('audit log is append-only (even for admins)', delAudit.status === 403, `HTTP ${delAudit.status}`)
} finally {
  for (const fn of cleanup.reverse()) await fn()
}

const failed = results.filter((r) => !r.ok)
console.log(`\n${results.length - failed.length}/${results.length} checks passed`)
process.exit(failed.length ? 1 : 0)
