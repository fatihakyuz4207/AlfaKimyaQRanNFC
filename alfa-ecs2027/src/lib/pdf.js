function escapePdf(text) {
  return String(text)
    .replace(/[^\x20-\x7E]/g, '?')
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')
}

function paginate(lines, size = 46) {
  if (!lines.length) return [[]]
  const pages = []
  for (let index = 0; index < lines.length; index += size) {
    pages.push(lines.slice(index, index + size))
  }
  return pages
}

function renderPage(lines) {
  let y = 800
  const commands = []
  for (const line of lines) {
    const gap = line.gap || 15
    if (line.text) {
      const size = line.size || 11
      commands.push(`BT /F1 ${size} Tf 48 ${y} Td (${escapePdf(line.text)}) Tj ET`)
    }
    y -= gap
  }
  return commands.join('\n')
}

export function buildPdfBytes(lines) {
  const pages = paginate(lines)
  const objects = new Map()
  objects.set(1, '<< /Type /Catalog /Pages 2 0 R >>')
  objects.set(3, '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>')

  const pageIds = []
  let nextId = 4
  for (const pageLines of pages) {
    const pageId = nextId
    const contentId = nextId + 1
    nextId += 2
    pageIds.push(pageId)
    const stream = renderPage(pageLines)
    const length = new TextEncoder().encode(stream).length
    objects.set(contentId, `<< /Length ${length} >> stream\n${stream}\nendstream`)
    objects.set(
      pageId,
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents ${contentId} 0 R /Resources << /Font << /F1 3 0 R >> >> >>`,
    )
  }
  objects.set(2, `<< /Type /Pages /Count ${pageIds.length} /Kids [${pageIds.map((id) => `${id} 0 R`).join(' ')}] >>`)

  const maxId = Math.max(...objects.keys())
  let body = '%PDF-1.4\n'
  const offsets = [0]
  for (let id = 1; id <= maxId; id += 1) {
    offsets[id] = body.length
    body += `${id} 0 obj ${objects.get(id)} endobj\n`
  }
  const xrefAt = body.length
  let xref = `xref\n0 ${maxId + 1}\n0000000000 65535 f \n`
  for (let id = 1; id <= maxId; id += 1) {
    xref += `${String(offsets[id]).padStart(10, '0')} 00000 n \n`
  }
  body += `${xref}trailer << /Size ${maxId + 1} /Root 1 0 R >>\nstartxref\n${xrefAt}\n%%EOF`
  return new TextEncoder().encode(body)
}

export function downloadPdf(filename, lines) {
  const bytes = buildPdfBytes(lines)
  const blob = new Blob([bytes], { type: 'application/pdf' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1500)
}
