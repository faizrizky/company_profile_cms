import type { Endpoint, PayloadRequest } from 'payload'
import QRCode from 'qrcode'

import { hasRole } from '@/access'
import {
  isTwoFactorVerified,
  stateOf,
  type TwoFactorState,
  type TwoFactorUser,
} from '@/auth/twoFactorState'
import { writeAudit } from '@/hooks/auditLog'
import { jsonResponse } from '@/lib/http'
import { notifySecurity } from '@/lib/securityAlert'
import {
  decryptSecret,
  encryptSecret,
  findRecoveryCode,
  generateRecoveryCodes,
  generateSecret,
  otpauthUrl,
  verifyCode,
} from '@/lib/totp'

/**
 * Two-factor authentication (authenticator app), required for every CMS user.
 *
 * Password login still creates Payload's session as usual; that session only
 * counts as signed in (see `isTwoFactorVerified`, used by every access rule)
 * once a 6-digit code — or a recovery code — has been entered for it. The
 * admin shows the prompt (TwoFactorGate); the API enforces it.
 */

// ── Helpers ──────────────────────────────────────────────────────────────

const MAX_FAILURES = 5
const LOCK_MS = 15 * 60 * 1000

async function readBody(req: PayloadRequest): Promise<Record<string, unknown>> {
  try {
    return ((await req.json?.()) as Record<string, unknown>) ?? {}
  } catch {
    return {}
  }
}

/** The signed-in user with the fields the API hides (secret, sessions). */
async function loadUser(req: PayloadRequest): Promise<TwoFactorUser | null> {
  if (req.user?.collection !== 'users') return null
  const user = await req.payload.findByID({
    collection: 'users',
    id: req.user.id,
    depth: 0,
    overrideAccess: true,
    showHiddenFields: true,
  })
  return {
    ...(user as unknown as TwoFactorUser),
    _sid: (req.user as { _sid?: string })._sid,
    collection: 'users',
  }
}

async function save(
  req: PayloadRequest,
  id: TwoFactorUser['id'],
  data: { twoFactor: TwoFactorState; totpEnabled?: boolean },
) {
  await req.payload.update({
    collection: 'users',
    id,
    data: data as never,
    overrideAccess: true,
    req,
    // 2FA bookkeeping is audited by name below, not as a generic "update".
    context: { disableAudit: true },
  })
}

/** Keeps only sessions that still exist, plus the current one. */
function withVerifiedSession(user: TwoFactorUser, state: TwoFactorState): string[] {
  const live = new Set((user.sessions ?? []).map((s) => s.id))
  const kept = (state.verifiedSessions ?? []).filter((sid) => live.has(sid))
  return user._sid && !kept.includes(user._sid) ? [...kept, user._sid] : kept
}

function lockedFor(state: TwoFactorState): number {
  const until = state.lockedUntil ? Date.parse(state.lockedUntil) : 0
  return Math.max(0, Math.ceil((until - Date.now()) / 1000))
}

async function recordFailure(req: PayloadRequest, user: TwoFactorUser, state: TwoFactorState) {
  const failures = (state.failures ?? 0) + 1
  const locked = failures >= MAX_FAILURES
  await save(req, user.id, {
    twoFactor: {
      ...state,
      failures: locked ? 0 : failures,
      lockedUntil: locked ? new Date(Date.now() + LOCK_MS).toISOString() : state.lockedUntil,
    },
  })
  if (locked) {
    await writeAudit(req, {
      action: 'security',
      resource: 'users.2fa-locked',
      documentId: String(user.id),
    })
    await notifySecurity(
      req,
      `🔒 2FA dikunci 15 menit setelah ${MAX_FAILURES}x kode salah: ${user.email}`,
    )
  }
  return jsonResponse(
    { error: locked ? 'locked' : 'invalid', retryAfter: locked ? LOCK_MS / 1000 : undefined },
    locked ? 429 : 400,
  )
}

// ── Endpoints (mounted on the users collection: /api/users/2fa/…) ────────

/** Where the current session stands: needs setup, needs a code, or done. */
const status: Endpoint = {
  path: '/2fa/status',
  method: 'get',
  handler: async (req) => {
    const user = await loadUser(req)
    if (!user) return jsonResponse({ error: 'unauthorized' }, 401)
    const state = stateOf(user)
    const enabled = Boolean(user.totpEnabled && decryptSecret(state.secret))
    return jsonResponse({
      enabled,
      verified: enabled && isTwoFactorVerified(user),
      recoveryCodesLeft: state.recoveryCodes?.length ?? 0,
      lockedFor: lockedFor(state),
    })
  },
}

/** Starts (or restarts) setup: a new secret and its QR code. */
const setup: Endpoint = {
  path: '/2fa/setup',
  method: 'post',
  handler: async (req) => {
    const user = await loadUser(req)
    if (!user) return jsonResponse({ error: 'unauthorized' }, 401)
    const state = stateOf(user)
    // Replacing a working setup needs this session to be verified first.
    if (user.totpEnabled && decryptSecret(state.secret) && !isTwoFactorVerified(user)) {
      return jsonResponse({ error: 'verify-first' }, 403)
    }
    const secret = generateSecret()
    await save(req, user.id, { twoFactor: { ...state, pendingSecret: encryptSecret(secret) } })
    const url = otpauthUrl(secret, user.email ?? String(user.id))
    const qr = await QRCode.toString(url, { type: 'svg', margin: 1, errorCorrectionLevel: 'M' })
    return jsonResponse({ secret, qr })
  },
}

/** Confirms setup with the first code; returns the one-time recovery codes. */
const enable: Endpoint = {
  path: '/2fa/enable',
  method: 'post',
  handler: async (req) => {
    const user = await loadUser(req)
    if (!user) return jsonResponse({ error: 'unauthorized' }, 401)
    const state = stateOf(user)
    const wait = lockedFor(state)
    if (wait) return jsonResponse({ error: 'locked', retryAfter: wait }, 429)
    const pending = decryptSecret(state.pendingSecret)
    if (!pending) return jsonResponse({ error: 'no-setup' }, 400)

    const { code } = await readBody(req)
    const step = verifyCode(pending, String(code ?? ''))
    if (step === null) return recordFailure(req, user, state)

    const recovery = generateRecoveryCodes()
    await save(req, user.id, {
      totpEnabled: true,
      twoFactor: {
        secret: state.pendingSecret,
        recoveryCodes: recovery.hashes,
        verifiedSessions: withVerifiedSession(user, {}),
        lastStep: step,
        failures: 0,
      },
    })
    await writeAudit(req, {
      action: 'security',
      resource: 'users.2fa-enabled',
      documentId: String(user.id),
    })
    await notifySecurity(req, `🔐 2FA diaktifkan: ${user.email}`)
    return jsonResponse({ ok: true, recoveryCodes: recovery.codes })
  },
}

/** Second login step: a 6-digit code or a recovery code. */
const verify: Endpoint = {
  path: '/2fa/verify',
  method: 'post',
  handler: async (req) => {
    const user = await loadUser(req)
    if (!user) return jsonResponse({ error: 'unauthorized' }, 401)
    const state = stateOf(user)
    const secret = decryptSecret(state.secret)
    if (!user.totpEnabled || !secret) return jsonResponse({ error: 'not-enabled' }, 400)
    const wait = lockedFor(state)
    if (wait) return jsonResponse({ error: 'locked', retryAfter: wait }, 429)

    const { code, recoveryCode } = await readBody(req)
    let next: TwoFactorState | null = null

    if (typeof recoveryCode === 'string' && recoveryCode.trim()) {
      const index = findRecoveryCode(state.recoveryCodes ?? [], recoveryCode)
      if (index !== -1) {
        next = {
          ...state,
          recoveryCodes: (state.recoveryCodes ?? []).filter((_, i) => i !== index),
        }
        await writeAudit(req, {
          action: 'security',
          resource: 'users.2fa-recovery-used',
          documentId: String(user.id),
        })
        await notifySecurity(
          req,
          `⚠️ Recovery code 2FA dipakai: ${user.email} (sisa ${next.recoveryCodes!.length})`,
        )
      }
    } else {
      const step = verifyCode(secret, String(code ?? ''), state.lastStep)
      if (step !== null) next = { ...state, lastStep: step }
    }

    if (!next) return recordFailure(req, user, state)
    await save(req, user.id, {
      twoFactor: {
        ...next,
        verifiedSessions: withVerifiedSession(user, next),
        failures: 0,
        lockedUntil: undefined,
      },
    })
    return jsonResponse({ ok: true, recoveryCodesLeft: next.recoveryCodes?.length ?? 0 })
  },
}

/** Admin: clears a user's 2FA (lost phone); they set it up again at next login. */
const reset: Endpoint = {
  path: '/2fa/reset/:id',
  method: 'post',
  handler: async (req) => {
    if (!hasRole(req.user, 'admin')) return jsonResponse({ error: 'forbidden' }, 403)
    const id = req.routeParams?.id as string | undefined
    if (!id) return jsonResponse({ error: 'missing-id' }, 400)
    const target = await req.payload.findByID({
      collection: 'users',
      id,
      depth: 0,
      overrideAccess: true,
    })
    await save(req, target.id, { totpEnabled: false, twoFactor: {} })
    await writeAudit(req, {
      action: 'security',
      resource: 'users.2fa-reset',
      documentId: String(target.id),
    })
    await notifySecurity(req, `♻️ 2FA di-reset oleh ${req.user?.email}: ${target.email}`)
    return jsonResponse({ ok: true })
  },
}

export const twoFactorEndpoints: Endpoint[] = [status, setup, enable, verify, reset]
