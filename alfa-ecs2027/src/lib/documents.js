import { PREVIEW_NOTE, supplyLine } from '../data/products.js'

export function wrapLine(text, width = 86) {
  const words = String(text).split(/\s+/).filter(Boolean)
  const lines = []
  let current = ''
  for (const word of words) {
    const next = current ? `${current} ${word}` : word
    if (next.length > width && current) {
      lines.push(current)
      current = word
    } else {
      current = next
    }
  }
  if (current) lines.push(current)
  return lines
}

function textLines(text, size = 11, gap = 15) {
  return wrapLine(text).map((line) => ({ text: line, size, gap }))
}

export function tdsDocument(product) {
  const lines = [
    { text: 'ALFA KIMYA  ·  ECS 2027', size: 10, gap: 14 },
    { text: product.name, size: 18, gap: 22 },
    { text: 'STAND SHEET SUMMARY  ·  NOT A CONTROLLED TDS', size: 10, gap: 18 },
    ...textLines(PREVIEW_NOTE),
    { text: '', gap: 8 },
    { text: `Resin type: ${product.oil}`, size: 12, gap: 16 },
    { text: `Oil type: ${product.oilType || '-'}`, size: 12, gap: 16 },
    { text: `Supply form: ${supplyLine(product)}`, size: 12, gap: 16 },
    { text: `Acid value, mgKOH/g: ${product.acid || '-'}`, size: 12, gap: 16 },
    { text: `Viscosity: ${product.viscosity}`, size: 12, gap: 16 },
    { text: `Color, Gardner 50%: ${product.color || '-'}`, size: 12, gap: 18 },
    { text: 'Why formulators stop here', size: 12, gap: 16 },
    ...product.advantages.flatMap((item) => textLines(`- ${item}`)),
    { text: '', gap: 10 },
    ...textLines('European Coatings Show 2027, Nuremberg. Alfa Kimya / Nippon Paint stand.'),
    ...textLines('Inspired by You.'),
  ]
  return {
    filename: `${product.name.replace(/[^A-Za-z0-9]+/g, '_')}_ECS2027_preview.pdf`,
    lines,
  }
}

export function catalogDocument(products) {
  const lines = [
    { text: 'ALFA KIMYA  ·  PERSONAL MINI CATALOG', size: 10, gap: 14 },
    { text: 'ECS 2027 shortlist', size: 18, gap: 22 },
    ...textLines(PREVIEW_NOTE),
    { text: '', gap: 8 },
  ]
  products.forEach((product, index) => {
    lines.push({ text: `${index + 1}. ${product.name}`, size: 13, gap: 16 })
    lines.push({ text: `${product.oil}  ·  ${supplyLine(product)}`, size: 11, gap: 14 })
    lines.push({ text: `Viscosity: ${product.viscosity}`, size: 11, gap: 14 })
    lines.push(...textLines(product.advantages[0]))
    lines.push({ text: '', gap: 8 })
  })
  lines.push(...textLines('Prepared on the Alfa stand microsite after consent to email this shortlist.'))
  return { filename: 'Alfa_ECS2027_Mini_Catalog.pdf', lines }
}
