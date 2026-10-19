export function parseRoute(hash = '') {
  const parts = String(hash).replace(/^#/, '').replace(/^\//, '').split('/').filter(Boolean)
  if (parts.length === 0) return { name: 'discover' }
  if (parts[0] === 'insights') return { name: 'insights' }
  if (parts[0] === 'demo') return { name: 'demo' }
  if (parts[0] === 'sent') return { name: 'sent' }
  if (parts[0] !== 'family' || !parts[1]) return { name: 'discover' }

  const family = parts[1]
  if (parts[2] === 'app' && parts[3] && parts[4] === 'product' && parts[5]) {
    return { name: 'detail', family, application: parts[3], product: parts[5] }
  }
  if (parts[2] === 'app' && parts[3]) {
    return { name: 'products', family, application: parts[3] }
  }
  return { name: 'application', family }
}

export function hrefFor(route) {
  if (route.name === 'insights') return '#/insights'
  if (route.name === 'demo') return '#/demo'
  if (route.name === 'sent') return '#/sent'
  if (route.name === 'application') return `#/family/${route.family}`
  if (route.name === 'products') return `#/family/${route.family}/app/${route.application}`
  if (route.name === 'detail') {
    return `#/family/${route.family}/app/${route.application}/product/${route.product}`
  }
  return '#/'
}
