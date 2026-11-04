/**
 * Checks the Showcase tab <-> product sync (src/hooks/showcaseSync.ts) against
 * a LOCAL database: npx payload run scripts/check-showcase-sync.ts
 * Uses the second category, then removes its test products and tabs again.
 */
import assert from 'node:assert/strict'
import { getPayload } from 'payload'
import config from '../src/payload.config'
import { oneProductPerTab } from '../src/hooks/showcaseSync'

const host = new URL(process.env.DATABASE_URL ?? 'postgres://x').hostname
if (!['localhost', '127.0.0.1', '::1'].includes(host)) throw new Error('Local database only.')

const payload = await getPayload({ config })
const CAT = 2
const o = { locale: 'en' as const, draft: true as const, depth: 0, overrideAccess: true }
const cat = () => payload.findByID({ collection: 'solution-categories', id: CAT, ...o })
const products = async () =>
  (await payload.find({ collection: 'products', where: { category: { equals: CAT } }, pagination: false, ...o })).docs
type Tabs = NonNullable<NonNullable<Awaited<ReturnType<typeof cat>>['showcase']>['tabs']>
const setTabs = async (tabs: Tabs) => {
  const c = await cat()
  await payload.update({ collection: 'solution-categories', id: CAT, data: { showcase: { ...c.showcase, tabs } }, ...o })
}
const ok = (m: string) => console.log('OK -', m)

const initialTabs = (await cat()).showcase?.tabs ?? []

// 1. new tab -> new draft product
await setTabs([...initialTabs, { name: 'Flight Sim X' }])
let tabs = (await cat()).showcase!.tabs!
const tabX = tabs.find((t) => t.name === 'Flight Sim X')!
let p1 = (await products()).find((p) => p.showcaseTab === tabX.id)!
assert.ok(p1, 'product made for the tab'); assert.equal(p1.title, 'Flight Sim X'); assert.equal(p1._status, 'draft')
ok('tab baru -> produk draft "Flight Sim X"')

// 2. rename tab -> product renamed
await setTabs(tabs.map((t) => (t.id === tabX.id ? { ...t, name: 'Flight Sim Y' } : t)))
p1 = (await products()).find((p) => p.id === p1.id)!
assert.equal(p1.title, 'Flight Sim Y'); assert.equal(p1.showcaseTab, tabX.id)
ok('ganti nama tab -> judul produk "Flight Sim Y"')

// 3. new product -> new tab
const p2 = await payload.create({ collection: 'products', data: { title: 'Wind Tunnel X', slug: 'wind-tunnel-x-test', category: CAT, _status: 'draft' } as never, ...o })
assert.ok(p2.showcaseTab, 'product got a tab id')
tabs = (await cat()).showcase!.tabs!
assert.equal(tabs.find((t) => t.id === p2.showcaseTab)?.name, 'Wind Tunnel X')
ok('produk baru -> tab "Wind Tunnel X"')

// 4. rename product -> tab renamed
await payload.update({ collection: 'products', id: p2.id, data: { title: 'Wind Tunnel Y' }, ...o })
tabs = (await cat()).showcase!.tabs!
assert.equal(tabs.find((t) => t.id === p2.showcaseTab)?.name, 'Wind Tunnel Y')
ok('ganti judul produk -> nama tab "Wind Tunnel Y"')

// 5. remove tab -> product kept, unlinked
const before = (await products()).length
await setTabs(tabs.filter((t) => t.id !== tabX.id))
p1 = (await products()).find((p) => p.id === p1.id)!
assert.ok(p1, 'product kept'); assert.equal(p1.showcaseTab ?? null, null); assert.equal((await products()).length, before)
ok('hapus tab -> produk tetap ada, tidak terhubung')

// 6. tab with the unlinked product's name -> relinked, no new product
tabs = (await cat()).showcase!.tabs!
await setTabs([...tabs, { name: 'Flight Sim Y' }])
const tabY = (await cat()).showcase!.tabs!.find((t) => t.name === 'Flight Sim Y')!
p1 = (await products()).find((p) => p.id === p1.id)!
assert.equal(p1.showcaseTab, tabY.id); assert.equal((await products()).length, before)
ok('tab bernama sama -> tersambung lagi ke produk lama, tanpa produk ganda')

// 7. one product per tab
const res = await oneProductPerTab(tabY.id, { req: { payload } as never, data: { category: CAT }, id: p2.id })
assert.equal(typeof res, 'string'); console.log('   pesan:', res)
assert.equal(await oneProductPerTab(tabY.id, { req: { payload } as never, data: { category: CAT }, id: p1.id }), true)
ok('tab yang sudah dipakai produk lain -> ditolak')

// Clean up: the test products, then the category's tabs as they were.
for (const id of [p1.id, p2.id]) await payload.delete({ collection: 'products', id, overrideAccess: true })
await setTabs(initialTabs)

console.log('ALL PASSED')
process.exit(0)
