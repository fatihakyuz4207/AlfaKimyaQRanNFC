import { productsFor } from '../data/products.js'
import { isValidEmail } from './lead.js'

const STORE_KEY = 'alfa-ecs27-analytics'
export const SESSION_KEY = 'alfa-ecs27-session'
export const SESSION_SIG_KEY = 'alfa-ecs27-session-sig'
export const LAST_LEAD_KEY = 'alfa-ecs27-last-lead'

export function emptyStore() {
  return { sessions: [], events: [], leads: [] }
}

function cap(list, max) {
  return list.length > max ? list.slice(list.length - max) : list
}

export function loadStore() {
  if (typeof localStorage === 'undefined') return emptyStore()
  try {
    const parsed = JSON.parse(localStorage.getItem(STORE_KEY) || '')
    return {
      sessions: Array.isArray(parsed.sessions) ? parsed.sessions : [],
      events: Array.isArray(parsed.events) ? parsed.events : [],
      leads: Array.isArray(parsed.leads) ? parsed.leads : [],
    }
  } catch {
    return emptyStore()
  }
}

export function saveStore(store) {
  if (typeof localStorage === 'undefined') return
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(store))
  } catch {
    /* Anonymous metrics are best-effort on a full device. */
  }
}

export function appendSession(store, session) {
  if (store.sessions.some((item) => item.id === session.id)) return store
  return { ...store, sessions: cap([...store.sessions, session], 1000) }
}

export function appendEvent(store, event) {
  for (let index = store.events.length - 1; index >= 0; index -= 1) {
    const item = store.events[index]
    if (event.ts - item.ts >= 800) break
    if (item.type === event.type && item.key === event.key) return store
  }
  return { ...store, events: cap([...store.events, event], 3000) }
}

export function appendLead(store, lead) {
  if (!lead?.consent || !isValidEmail(lead.email) || !lead.productIds?.length) return store
  return { ...store, leads: cap([...store.leads, lead], 500) }
}

export function eraseLeads(store) {
  return { ...store, leads: [] }
}

function countBy(items, keyFn) {
  const counts = {}
  for (const item of items) {
    const key = keyFn(item)
    counts[key] = (counts[key] || 0) + 1
  }
  return counts
}

export function summarize(store) {
  const { sessions, events, leads } = store
  const views = events.filter((event) => event.type === 'product_view')
  const completes = events.filter((event) => event.type === 'video_complete')
  const adds = events.filter((event) => event.type === 'selection_add')
  const sessionsWithAdd = new Set(adds.map((event) => event.sessionId)).size
  return {
    sessions: sessions.length,
    nfc: sessions.filter((session) => session.channel === 'nfc').length,
    qr: sessions.filter((session) => session.channel === 'qr').length,
    unspecified: sessions.filter((session) => session.channel === 'unspecified').length,
    wall: sessions.filter((session) => session.touchpoint === 'wall').length,
    totem: sessions.filter((session) => session.touchpoint === 'totem').length,
    direct: sessions.filter((session) => session.touchpoint === 'direct').length,
    bySrc: countBy(sessions, (session) => session.src),
    families: countBy(
      events.filter((event) => event.type === 'family_select'),
      (event) => event.family,
    ),
    applications: countBy(
      events.filter((event) => event.type === 'application_select'),
      (event) => event.application,
    ),
    productViews: countBy(views, (event) => event.product),
    viewTotal: views.length,
    videoStarts: events.filter((event) => event.type === 'video_start').length,
    videoCompletes: completes.length,
    videoRate: views.length ? completes.length / views.length : null,
    tdsTotal: events.filter((event) => event.type === 'tds_download').length,
    tdsByProduct: countBy(
      events.filter((event) => event.type === 'tds_download'),
      (event) => event.product,
    ),
    adds: adds.length,
    addRate: sessions.length ? sessionsWithAdd / sessions.length : null,
    leads: leads.length,
    contacts: events.filter((event) => event.type === 'stand_contact').length,
  }
}

function mulberry32(seed) {
  let state = seed
  return () => {
    state += 0x6d2b79f5
    let next = state
    next = Math.imul(next ^ (next >>> 15), next | 1)
    next ^= next + Math.imul(next ^ (next >>> 7), next | 61)
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296
  }
}

export function sampleStandDay(now = Date.now()) {
  const rand = mulberry32(2027)
  const pick = (list) => list[Math.floor(rand() * list.length)]
  const sources = [
    { src: 'wall_hs', channel: 'nfc', touchpoint: 'wall' },
    { src: 'wall_wd', channel: 'nfc', touchpoint: 'wall' },
    { src: 'totem_hs', channel: 'qr', touchpoint: 'totem' },
    { src: 'totem_wd', channel: 'qr', touchpoint: 'totem' },
    { src: 'wall_hs', channel: 'qr', touchpoint: 'wall' },
  ]
  const applications = ['industrial', 'architectural', 'wood', 'primers']
  const sessions = []
  const events = []
  const leads = []

  for (let index = 0; index < 40; index += 1) {
    const source = pick(sources)
    const id = `demo-${index}`
    const ts = now - (40 - index) * 60000
    sessions.push({
      id,
      ts,
      ...source,
      familyHint: null,
      label: source.src,
      utm_source: 'ecs2027',
      utm_medium: source.channel,
      utm_campaign: source.src,
      utm_content: '',
    })
    const family = rand() > 0.42 ? 'high-solid' : 'water'
    events.push({ type: 'family_select', ts, sessionId: id, key: `family:${family}:${id}`, family })
    let application = pick(applications)
    let options = productsFor(family, application)
    if (!options.length) {
      application = 'industrial'
      options = productsFor(family, application)
    }
    events.push({
      type: 'application_select',
      ts,
      sessionId: id,
      key: `app:${application}:${id}`,
      application,
    })
    const product = pick(options).id
    events.push({ type: 'product_view', ts, sessionId: id, key: `view:${product}:${id}`, product })
    if (rand() > 0.2) {
      events.push({ type: 'video_start', ts, sessionId: id, key: `vstart:${product}:${id}`, product })
      if (rand() > 0.25) {
        events.push({ type: 'video_complete', ts, sessionId: id, key: `vdone:${product}:${id}`, product })
      }
    }
    if (rand() > 0.4) {
      events.push({ type: 'tds_download', ts, sessionId: id, key: `tds:${product}:${id}`, product })
    }
    if (rand() > 0.45) {
      events.push({ type: 'selection_add', ts, sessionId: id, key: `add:${product}:${id}`, product })
    }
    if (rand() > 0.8) {
      leads.push({
        id: `lead-demo-${index}`,
        ts,
        email: `visitor.${index}@example.com`,
        consent: true,
        consentText: 'demo',
        productIds: [product],
        src: source.src,
        channel: source.channel,
        touchpoint: source.touchpoint,
      })
    }
  }

  return { sessions, events, leads }
}

export function mergeSample(store, sample) {
  let next = store
  for (const session of sample.sessions) next = appendSession(next, session)
  for (const event of sample.events) next = appendEvent(next, event)
  for (const lead of sample.leads) next = appendLead(next, lead)
  return next
}

export function ensureSession(entry) {
  if (typeof sessionStorage === 'undefined') return 'server'
  const signature = `${entry.src}|${entry.channel}|${entry.touchpoint}|${entry.replay || ''}`
  let id = sessionStorage.getItem(SESSION_KEY)
  const previous = sessionStorage.getItem(SESSION_SIG_KEY)
  if (!id || previous !== signature) {
    id = crypto.randomUUID?.() || `s-${Date.now()}`
    sessionStorage.setItem(SESSION_KEY, id)
    sessionStorage.setItem(SESSION_SIG_KEY, signature)
  }
  const store = loadStore()
  if (!store.sessions.some((session) => session.id === id)) {
    saveStore(
      appendSession(store, {
        id,
        ts: Date.now(),
        src: entry.src,
        channel: entry.channel,
        touchpoint: entry.touchpoint,
        familyHint: entry.familyHint,
        label: entry.label,
        utm_source: entry.utm_source,
        utm_medium: entry.utm_medium,
        utm_campaign: entry.utm_campaign,
        utm_content: entry.utm_content,
      }),
    )
  }
  return id
}

export function track(type, meta = {}) {
  const sessionId = typeof sessionStorage === 'undefined' ? 'server' : sessionStorage.getItem(SESSION_KEY) || 'unknown'
  const event = {
    type,
    ts: Date.now(),
    sessionId,
    key: meta.key || type,
    ...meta,
  }
  saveStore(appendEvent(loadStore(), event))
}

export function rememberLead(lead) {
  saveStore(appendLead(loadStore(), lead))
  if (typeof sessionStorage !== 'undefined') {
    sessionStorage.setItem(LAST_LEAD_KEY, JSON.stringify(lead))
  }
}

export function loadLastLead() {
  if (typeof sessionStorage === 'undefined') return null
  try {
    return JSON.parse(sessionStorage.getItem(LAST_LEAD_KEY) || 'null')
  } catch {
    return null
  }
}

export function resetDevice() {
  saveStore(emptyStore())
  if (typeof localStorage !== 'undefined') localStorage.removeItem('alfa-ecs27-selection')
  if (typeof sessionStorage !== 'undefined') {
    sessionStorage.removeItem(SESSION_KEY)
    sessionStorage.removeItem(SESSION_SIG_KEY)
    sessionStorage.removeItem(LAST_LEAD_KEY)
  }
}
