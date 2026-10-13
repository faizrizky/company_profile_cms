import net from 'node:net'

import { afterEach, describe, expect, it } from 'vitest'

import { checkMailbox, classifyRcpt, resetMailboxCheck } from './mailboxCheck'

/** A fake mail server: answers RCPT TO with `rcpt`, or says nothing when it is null. */
function server(rcpt: string | null) {
  const connections: string[] = []
  const srv = net.createServer((socket) => {
    connections.push('connect')
    // The client hangs up on purpose (and abruptly, on a timeout).
    socket.on('error', () => {})
    socket.write('220 fake ESMTP\r\n')
    socket.on('data', (data) => {
      for (const line of data.toString().split('\r\n').filter(Boolean)) {
        const cmd = line.slice(0, 4).toUpperCase()
        if (cmd === 'EHLO') socket.write('250-fake\r\n250 8BITMIME\r\n')
        else if (cmd === 'MAIL') socket.write('250 2.1.0 Ok\r\n')
        else if (cmd === 'RCPT') {
          connections.push(line)
          if (rcpt !== null) socket.write(rcpt + '\r\n')
        } else if (cmd === 'QUIT') socket.end('221 bye\r\n')
      }
    })
  })
  return new Promise<{ port: number; connections: string[]; close: () => void }>((resolve) =>
    srv.listen(0, '127.0.0.1', () =>
      resolve({
        port: (srv.address() as net.AddressInfo).port,
        connections,
        close: () => srv.close(),
      }),
    ),
  )
}

const mx = async () => [{ exchange: '127.0.0.1', priority: 10 }]
const open: { close: () => void }[] = []
afterEach(() => {
  open.splice(0).forEach((s) => s.close())
  resetMailboxCheck()
})

async function probe(rcpt: string | null, email = 'amba@example.test', timeoutMs = 2000) {
  const s = await server(rcpt)
  open.push(s)
  return { result: await checkMailbox(email, { resolveMx: mx, port: s.port, timeoutMs }), s }
}

describe('classifyRcpt', () => {
  it('refuses only a definite "no such user"', () => {
    expect(classifyRcpt({ code: 550, text: '5.1.1 User unknown' })).toBe('no-mailbox')
    expect(
      classifyRcpt({
        code: 550,
        text: '5.1.1 The email account that you tried to reach does not exist.',
      }),
    ).toBe('no-mailbox')
    expect(classifyRcpt({ code: 550, text: 'No such user here' })).toBe('no-mailbox')
    expect(classifyRcpt({ code: 553, text: '5.1.10 RESOLVER.ADR.RecipientNotFound' })).toBe(
      'no-mailbox',
    )
  })

  it('does not treat blocks, policy or temporary answers as a missing mailbox', () => {
    expect(classifyRcpt({ code: 250, text: 'OK' })).toBe('unknown')
    expect(classifyRcpt({ code: 450, text: '4.2.0 Greylisted, try later' })).toBe('unknown')
    expect(
      classifyRcpt({
        code: 550,
        text: '5.7.1 Service unavailable; client host blocked by spamhaus',
      }),
    ).toBe('unknown')
    expect(classifyRcpt({ code: 554, text: '5.7.1 Relay access denied' })).toBe('unknown')
    expect(
      classifyRcpt({ code: 550, text: 'Mailbox unavailable: sender rejected by policy' }),
    ).toBe('unknown')
    expect(classifyRcpt({ code: 552, text: '5.2.2 Mailbox full' })).toBe('unknown')
  })
})

describe('checkMailbox', () => {
  it('says no-mailbox for a user the server does not know', async () => {
    const { result, s } = await probe(
      '550 5.1.1 <amba@example.test>: Recipient address rejected: User unknown',
    )
    expect(result).toBe('no-mailbox')
    expect(s.connections).toContain('RCPT TO:<amba@example.test>')
  })

  it('reads a multi-line refusal (Gmail style)', async () => {
    const s = await server(
      '550-5.1.1 The email account that you tried to reach does not exist.\r\n550 5.1.1 Please try double-checking the recipient',
    )
    open.push(s)
    expect(await checkMailbox('x@example.test', { resolveMx: mx, port: s.port })).toBe('no-mailbox')
  })

  it("reads Gmail's real answer for a mailbox that doesn't exist (from the CMS server, 13 Oct 2026)", async () => {
    const s = await server(
      [
        '550-5.1.1 The email account that you tried to reach does not exist. Please try',
        "550-5.1.1 double-checking the recipient's email address for typos or",
        '550-5.1.1 unnecessary spaces. For more information, go to',
        '550 5.1.1  https://support.google.com/mail/?p=NoSuchUser d2e1a72fcca58-89c321614aesi4757973b3a.163 - gsmtp',
      ].join('\r\n'),
    )
    open.push(s)
    expect(await checkMailbox('john.smithgmail@gmail.com', { resolveMx: mx, port: s.port })).toBe(
      'no-mailbox',
    )
  })

  it('lets an accepted address through', async () => {
    expect((await probe('250 2.1.5 Ok')).result).toBe('unknown')
  })

  it('lets everyone through when the server is greylisting or blocks us', async () => {
    expect((await probe('450 4.7.1 Greylisted')).result).toBe('unknown')
    expect((await probe('554 5.7.1 blocked using zen.spamhaus.org')).result).toBe('unknown')
  })

  it('does not wait forever for a silent server', async () => {
    const t0 = Date.now()
    const { result } = await probe(null, 'a@example.test', 600)
    expect(result).toBe('unknown')
    expect(Date.now() - t0).toBeLessThan(2000)
  })

  it('remembers a missing mailbox instead of asking again', async () => {
    const s = await server('550 5.1.1 User unknown')
    open.push(s)
    await checkMailbox('gone@example.test', { resolveMx: mx, port: s.port })
    await checkMailbox('gone@example.test', { resolveMx: mx, port: s.port })
    expect(s.connections.filter((c) => c.startsWith('RCPT'))).toHaveLength(1)
  })

  it('switches itself off when no server can be reached (port 25 blocked)', async () => {
    const dead = await server('250 ok')
    const port = dead.port
    dead.close() // nothing listens there now
    for (const n of [1, 2, 3])
      await checkMailbox(`u${n}@example.test`, { resolveMx: mx, port, timeoutMs: 500 })
    // Now paused: even a working server isn't asked.
    const live = await server('550 5.1.1 User unknown')
    open.push(live)
    expect(await checkMailbox('v@example.test', { resolveMx: mx, port: live.port })).toBe('unknown')
    expect(live.connections).toHaveLength(0)
  })

  it('does not refuse anybody when DNS fails', async () => {
    const failing = async () => {
      throw new Error('ESERVFAIL')
    }
    expect(await checkMailbox('a@example.test', { resolveMx: failing })).toBe('unknown')
  })
})
