import assert from 'node:assert/strict'
import test from 'node:test'
import { APPLICATIONS, FAMILIES, productsFor } from '../src/data/products.js'
import { appendEvent, appendLead, emptyStore, mergeSample, sampleStandDay, summarize } from '../src/lib/analytics.js'
import { entryUrl, parseEntry } from '../src/lib/entry.js'
import { buildCatalogText, maskEmail, validateLead } from '../src/lib/lead.js'
import { buildPdfBytes } from '../src/lib/pdf.js'
import { parseRoute } from '../src/lib/route.js'
import { toggleId } from '../src/lib/selection.js'

test('entry tags keep wall, totem, NFC and QR apart', () => {
  const wall = parseEntry('?src=wall_hs&ch=nfc&utm_campaign=ecs')
  assert.equal(wall.touchpoint, 'wall')
  assert.equal(wall.channel, 'nfc')
  assert.equal(wall.familyHint, 'high-solid')
  assert.equal(wall.utm_campaign, 'ecs')

  const totem = parseEntry('?src=totem_wd&utm_medium=qr')
  assert.equal(totem.touchpoint, 'totem')
  assert.equal(totem.channel, 'qr')
  assert.equal(totem.familyHint, 'water')

  const direct = parseEntry('')
  assert.equal(direct.src, 'direct')
  assert.equal(direct.channel, 'unspecified')
})

test('programmed entry URL carries source and channel', () => {
  const url = new URL(entryUrl({ src: 'totem_hs', ch: 'qr' }, 'https://exp.alfakimya.com/ecs27'))
  assert.equal(url.searchParams.get('src'), 'totem_hs')
  assert.equal(url.searchParams.get('ch'), 'qr')
  assert.equal(url.searchParams.get('utm_medium'), 'qr')
})

test('hash routes cover the five-step journey', () => {
  assert.equal(parseRoute('').name, 'discover')
  assert.deepEqual(parseRoute('#/family/high-solid'), { name: 'application', family: 'high-solid' })
  assert.equal(parseRoute('#/family/water/app/wood').name, 'products')
  assert.equal(parseRoute('#/family/water/app/wood/product/alfakyd-5801-bg75').product, 'alfakyd-5801-bg75')
  assert.equal(parseRoute('#/insights').name, 'insights')
  assert.equal(parseRoute('#/demo').name, 'demo')
})

test('every family and application pair has at least one resin', () => {
  for (const family of FAMILIES) {
    for (const application of APPLICATIONS) {
      assert.ok(productsFor(family.id, application.id).length > 0, `${family.id}/${application.id}`)
    }
  }
})

test('shortlist toggles without duplicates', () => {
  assert.deepEqual(toggleId([], 'a'), ['a'])
  assert.deepEqual(toggleId(['a'], 'a'), [])
})

test('catalog email is blocked until consent and a real address', () => {
  assert.equal(validateLead({ email: 'buyer@mill.com', consent: false, productIds: ['a'] }).ok, false)
  assert.equal(validateLead({ email: 'not-an-email', consent: true, productIds: ['a'] }).ok, false)
  assert.equal(validateLead({ email: 'buyer@mill.com', consent: true, productIds: [] }).ok, false)
  assert.equal(validateLead({ email: 'buyer@mill.com', consent: true, productIds: ['a'], honeypot: 'spam' }).ok, false)
  assert.equal(validateLead({ email: 'buyer@mill.com', consent: true, productIds: ['a'] }).ok, true)
  assert.equal(appendLead(emptyStore(), { email: 'buyer@mill.com', consent: false, productIds: ['a'] }).leads.length, 0)
})

test('insights math counts NFC, QR, wall and totem from sessions', () => {
  const store = mergeSample(emptyStore(), sampleStandDay(1_700_000_000_000))
  const stats = summarize(store)
  assert.equal(stats.sessions, 40)
  assert.equal(stats.nfc + stats.qr + stats.unspecified, stats.sessions)
  assert.equal(stats.wall + stats.totem + stats.direct, stats.sessions)
  assert.ok(stats.leads > 0)
  assert.ok(stats.viewTotal > 0)
  assert.equal(maskEmail(store.leads[0].email).includes('@example.com'), true)
  assert.match(buildCatalogText(store.leads[0], [{ name: 'ALFAKYD F37 X75', oil: 'Short-oil alkyd', carrier: 'Xylene', solids: '75%', viscosity: '1', advantages: ['Film'] }]), /ALFAKYD F37 X75/)
})

test('preview PDF is a real document', () => {
  const bytes = buildPdfBytes([
    { text: 'ALFAKYD F37 X75', size: 16, gap: 20 },
    { text: 'Stand preview', size: 11, gap: 14 },
  ])
  const source = new TextDecoder().decode(bytes)
  assert.match(source, /^%PDF-1\.4/)
  assert.match(source, /ALFAKYD F37 X75/)
  assert.match(source, /%%EOF/)
})

test('rapid duplicate events collapse once', () => {
  const first = appendEvent(emptyStore(), { type: 'product_view', key: 'view:a', ts: 1000, sessionId: 's' })
  const second = appendEvent(first, { type: 'product_view', key: 'view:a', ts: 1200, sessionId: 's' })
  assert.equal(second.events.length, 1)
})

test('interleaved view and video events do not double count', () => {
  let store = emptyStore()
  store = appendEvent(store, { type: 'video_start', key: 'vstart:a', ts: 1000, sessionId: 's' })
  store = appendEvent(store, { type: 'product_view', key: 'view:a', ts: 1001, sessionId: 's' })
  store = appendEvent(store, { type: 'video_start', key: 'vstart:a', ts: 1002, sessionId: 's' })
  store = appendEvent(store, { type: 'product_view', key: 'view:a', ts: 1002, sessionId: 's' })
  assert.equal(store.events.length, 2)
})
