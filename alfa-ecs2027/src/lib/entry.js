const SOURCE_MAP = {
  wall_hs: { touchpoint: 'wall', familyHint: 'high-solid', label: 'High Solid wall' },
  wall_wd: { touchpoint: 'wall', familyHint: 'water', label: 'Water Dilutable wall' },
  totem_hs: { touchpoint: 'totem', familyHint: 'high-solid', label: 'High Solid totem' },
  totem_wd: { touchpoint: 'totem', familyHint: 'water', label: 'Water Dilutable totem' },
}

export const ENTRY_POINTS = [
  { src: 'wall_hs', ch: 'nfc', label: 'Wall · High Solid · NFC' },
  { src: 'wall_hs', ch: 'qr', label: 'Wall · High Solid · QR' },
  { src: 'wall_wd', ch: 'nfc', label: 'Wall · Water Dilutable · NFC' },
  { src: 'wall_wd', ch: 'qr', label: 'Wall · Water Dilutable · QR' },
  { src: 'totem_hs', ch: 'nfc', label: 'Totem · High Solid · NFC' },
  { src: 'totem_hs', ch: 'qr', label: 'Totem · High Solid · QR' },
  { src: 'totem_wd', ch: 'nfc', label: 'Totem · Water Dilutable · NFC' },
  { src: 'totem_wd', ch: 'qr', label: 'Totem · Water Dilutable · QR' },
]

export function publicBase() {
  const configured = import.meta.env?.VITE_PUBLIC_BASE
  return configured || 'https://exp.alfakimya.com/ecs27'
}

export function parseEntry(search = '') {
  const query = String(search).startsWith('?') ? String(search).slice(1) : String(search)
  const params = new URLSearchParams(query)
  const src = (params.get('src') || 'direct').trim().toLowerCase() || 'direct'
  const known = SOURCE_MAP[src]
  const medium = (params.get('ch') || params.get('utm_medium') || '').trim().toLowerCase()
  const channel = medium === 'nfc' || medium === 'qr' ? medium : 'unspecified'
  let touchpoint = 'direct'
  if (known) touchpoint = known.touchpoint
  else if (src.startsWith('wall')) touchpoint = 'wall'
  else if (src.startsWith('totem')) touchpoint = 'totem'
  else if (src !== 'direct') touchpoint = 'other'

  return {
    src,
    channel,
    touchpoint,
    familyHint: known?.familyHint || null,
    label: known?.label || (src === 'direct' ? 'Direct open' : src),
    utm_source: params.get('utm_source') || '',
    utm_medium: params.get('utm_medium') || '',
    utm_campaign: params.get('utm_campaign') || '',
    utm_content: params.get('utm_content') || '',
    replay: params.get('replay') || '',
  }
}

export function entryUrl(point, base) {
  const url = new URL(base)
  url.searchParams.set('src', point.src)
  url.searchParams.set('ch', point.ch)
  url.searchParams.set('utm_source', 'ecs2027')
  url.searchParams.set('utm_medium', point.ch)
  url.searchParams.set('utm_campaign', point.src)
  return url.toString()
}
