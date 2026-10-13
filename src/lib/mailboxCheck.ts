import { promises as dns } from 'node:dns'
import net from 'node:net'

import { env } from '@/lib/env'
import { DEFAULT_FROM_ADDRESS } from '@/lib/mail'

/**
 * Does this mailbox exist? Asks the recipient's mail server ("RCPT TO") and
 * hangs up before any message is sent. Only a definite "no such user" counts
 * as `no-mailbox`; everything else — a server that accepts every address, one
 * that postpones (greylisting) or blocks such questions, a timeout — is
 * `unknown`, and nobody is turned away for it. So it catches made-up
 * addresses at real domains, not every fake one; confirming by email is the
 * only complete proof.
 *
 * Needs outbound port 25. When that is blocked (every connection times out),
 * it switches itself off for a while instead of slowing every visitor.
 */

export type MailboxCheck = 'unknown' | 'no-mailbox'

export type ProbeOptions = {
  resolveMx?: (domain: string) => Promise<{ exchange: string; priority: number }[]>
  port?: number
  /** Whole check, DNS included. */
  timeoutMs?: number
  ehlo?: string
  from?: string
}

/** 5.1.x: the address (or its domain) is wrong — never "try later" or "blocked". */
const ADDRESS_STATUS = /\b5\.1\.(0|1|2|3|10)\b/
/** Without an enhanced status code, the wording has to say so. */
const NO_SUCH_USER =
  /user unknown|unknown user|no such (user|recipient|mailbox)|recipient (address )?rejected|does not exist|doesn't exist|invalid (recipient|mailbox|address)|mailbox (unavailable|not found)|unknown recipient|no mailbox here/i
/** …and these mean "we are refused", not "no such mailbox". */
const POLICY =
  /spam|block|blacklist|blocklist|reputation|denied|policy|relay|not allowed|rbl|spamhaus|sender|dnsbl|\b5\.7\./i

const TTL_MS = 60 * 60 * 1000
const cache = new Map<string, { result: MailboxCheck; until: number }>()

// Port 25 closed from here? Three connection failures in a row, to different
// servers, with no success in between: stop trying for a while.
const BREAKER_AFTER = 3
const BREAKER_PAUSE_MS = 10 * 60 * 1000
let failures = 0
let pausedUntil = 0

type Reply = { code: number; text: string }

/** Classifies the answer to "RCPT TO". */
export function classifyRcpt({ code, text }: Reply): MailboxCheck {
  if (code !== 550 && code !== 551 && code !== 553) return 'unknown'
  if (ADDRESS_STATUS.test(text)) return 'no-mailbox'
  if (POLICY.test(text)) return 'unknown'
  return NO_SUCH_USER.test(text) ? 'no-mailbox' : 'unknown'
}

/** One SMTP conversation up to RCPT TO. Resolves with that reply, or null when the server can't be asked. */
function ask(
  host: string,
  port: number,
  ehlo: string,
  from: string,
  rcpt: string,
  timeoutMs: number,
): Promise<Reply | null | 'unreachable'> {
  return new Promise((resolve) => {
    const socket = net.connect({ host, port })
    let settled = false
    let connected = false
    let buffer = ''
    let step = 0
    const finish = (value: Reply | null | 'unreachable') => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      socket.destroy()
      resolve(value)
    }
    const timer = setTimeout(() => finish(connected ? null : 'unreachable'), timeoutMs)
    socket.on('connect', () => {
      connected = true
    })
    socket.on('error', () => finish(connected ? null : 'unreachable'))
    socket.on('close', () => finish(null))
    socket.on('data', (chunk) => {
      buffer += chunk.toString('utf8')
      const lines = buffer.split(/\r?\n/)
      // A reply is complete at a line like "250 text" (not "250-text").
      const doneAt = lines.findIndex((line, i) => i < lines.length - 1 && /^\d{3}( |$)/.test(line))
      if (doneAt === -1) return
      const reply = lines.slice(0, doneAt + 1)
      buffer = ''
      const code = Number(reply[reply.length - 1].slice(0, 3))
      const text = reply.map((line) => line.slice(4)).join(' ')
      const commands = [`EHLO ${ehlo}`, `MAIL FROM:<${from}>`, `RCPT TO:<${rcpt}>`]
      if (step === 0 && code !== 220) return finish(null)
      if (step >= 1 && step <= 2 && code !== 250) return finish(null) // refused before RCPT: not an answer about the mailbox
      if (step === 3) {
        socket.write('QUIT\r\n')
        return finish({ code, text })
      }
      socket.write(`${commands[step]}\r\n`)
      step += 1
    })
  })
}

export async function checkMailbox(
  email: string,
  options: ProbeOptions = {},
): Promise<MailboxCheck> {
  const address = email.trim().toLowerCase()
  const cached = cache.get(address)
  if (cached && cached.until > Date.now()) return cached.result
  if (pausedUntil > Date.now()) return 'unknown'

  const deadline = Date.now() + (options.timeoutMs ?? 5000)
  const domain = address.slice(address.lastIndexOf('@') + 1)
  let result: MailboxCheck = 'unknown'
  try {
    const resolveMx = options.resolveMx ?? ((d: string) => dns.resolveMx(d))
    const mx = (await resolveMx(domain)).sort((a, b) => a.priority - b.priority)
    const hosts = mx.length ? mx.map((m) => m.exchange).filter(Boolean) : [domain]
    const ehlo =
      options.ehlo ??
      (URL.canParse(env.SERVER_URL) ? new URL(env.SERVER_URL).hostname : 'localhost')
    for (const host of hosts.slice(0, 2)) {
      const left = deadline - Date.now()
      if (left < 300) break
      const answer = await ask(
        host,
        options.port ?? 25,
        ehlo,
        options.from ?? DEFAULT_FROM_ADDRESS,
        address,
        left,
      )
      if (answer === 'unreachable') {
        failures += 1
        if (failures >= BREAKER_AFTER) pausedUntil = Date.now() + BREAKER_PAUSE_MS
        continue
      }
      failures = 0
      if (answer) result = classifyRcpt(answer)
      break
    }
  } catch {
    // DNS trouble: not an answer about the mailbox either.
  }
  if (result === 'no-mailbox') {
    cache.set(address, { result, until: Date.now() + TTL_MS })
    if (cache.size > 2000) cache.clear()
  }
  return result
}

/** For tests. */
export function resetMailboxCheck() {
  cache.clear()
  failures = 0
  pausedUntil = 0
}
