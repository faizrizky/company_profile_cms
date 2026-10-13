import { describe, expect, it } from 'vitest'

import { checkEmailDomain } from './emailCheck'

const code = (c: string) => Object.assign(new Error(c), { code: c })
const resolver = (over: Partial<Record<'mx' | 'a' | 'aaaa', () => Promise<unknown[]>>> = {}) =>
  ({
    resolveMx: over.mx ?? (async () => [{ exchange: 'mx.example.com', priority: 10 }]),
    resolve4:
      over.a ??
      (async () => {
        throw code('ENODATA')
      }),
    resolve6:
      over.aaaa ??
      (async () => {
        throw code('ENODATA')
      }),
  }) as never

describe('checkEmailDomain', () => {
  it('accepts a domain with an MX record', async () => {
    expect(await checkEmailDomain('a@ok-mx.test', resolver())).toBe('ok')
  })

  it('refuses a domain with only an address record: a website, not a mail server', async () => {
    const r = resolver({
      mx: async () => {
        throw code('ENODATA')
      },
      a: async () => ['54.215.31.113'],
    })
    expect(await checkEmailDomain('a@only-a.test', r)).toBe('no-mail')
  })

  it('refuses a domain that does not exist', async () => {
    const gone = async () => {
      throw code('ENOTFOUND')
    }
    expect(
      await checkEmailDomain('a@nxdomain.test', resolver({ mx: gone, a: gone, aaaa: gone })),
    ).toBe('no-mail')
  })

  it('refuses a domain that publishes a null MX', async () => {
    const r = resolver({ mx: async () => [{ exchange: '', priority: 0 }] })
    expect(await checkEmailDomain('a@null-mx.test', r)).toBe('no-mail')
  })

  it('refuses throwaway-mailbox services, subdomains included', async () => {
    expect(await checkEmailDomain('a@mailinator.com', resolver())).toBe('disposable')
    expect(await checkEmailDomain('a@x.YOPMAIL.com', resolver())).toBe('disposable')
  })

  it('refuses an address without a real domain', async () => {
    expect(await checkEmailDomain('a@localhost', resolver())).toBe('no-mail')
  })

  it('refuses names a big provider would never give out (Gmail: 6–30 characters…)', async () => {
    for (const email of [
      'asede@gmail.com', // 5 characters
      'a.b.c.d.e@gmail.com', // dots don't count
      'ab..cdef@gmail.com',
      '.abcdef@gmail.com',
      'abc_def@gmail.com',
      'abcd-efg@gmail.com',
      'abc@yahoo.com', // Yahoo: at least 4
      '1abcd@yahoo.co.id', // must start with a letter
      '9john@outlook.com',
      'john..doe@hotmail.com',
      'ab@icloud.com', // iCloud: at least 3
    ]) {
      expect(await checkEmailDomain(email, resolver()), email).toBe('bad-format')
    }
  })

  it('accepts real-looking names at the big providers', async () => {
    for (const email of [
      'faizrizky@gmail.com',
      'faiz.rizky@gmail.com',
      'faizrizky+falah@gmail.com',
      'Faiz.Rizky99@GMAIL.com',
      'john_doe@yahoo.co.id',
      'johndoe-news@yahoo.com',
      'john.doe-1@outlook.com',
      'jdoe@hotmail.co.id',
      'jdo@icloud.com',
      'a@company.co.id', // other domains: no name rule
    ]) {
      expect(await checkEmailDomain(email, resolver()), email).toBe('ok')
    }
  })

  it('does not refuse anybody when DNS fails or is slow', async () => {
    const down = async () => {
      throw code('ESERVFAIL')
    }
    expect(await checkEmailDomain('a@dns-down.test', resolver({ mx: down }))).toBe('ok')
    const slow = () => new Promise<never>(() => {})
    expect(await checkEmailDomain('a@dns-slow.test', resolver({ mx: slow }), 50)).toBe('ok')
  })
})
