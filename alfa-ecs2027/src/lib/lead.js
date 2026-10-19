import { supplyLine } from '../data/products.js'

export const CONSENT_TEXT =
  'I agree that Alfa Kimya may email me this mini catalog and may contact me after ECS 2027 about the resins I selected. I can withdraw this consent at any time. Ich willige ein, dass Alfa Kimya mir diesen Mini-Katalog per E-Mail zusendet und mich nach der ECS 2027 zu den ausgewählten Harzen kontaktieren darf. Diese Einwilligung kann ich jederzeit widerrufen.'

export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim())
}

export function maskEmail(email) {
  const [user, domain] = String(email || '').split('@')
  if (!user || !domain) return 'hidden'
  return `${user.slice(0, 1)}•••@${domain}`
}

export function validateLead({ email, consent, productIds, honeypot }) {
  if (honeypot) return { ok: false, error: 'This request could not be sent.' }
  if (!productIds?.length) return { ok: false, error: 'Add at least one resin to My Alfa Selection.' }
  if (!isValidEmail(email)) return { ok: false, error: 'Enter a valid email address.' }
  if (!consent) return { ok: false, error: 'Tick the consent box before Alfa can email you.' }
  return { ok: true }
}

export function buildCatalogText(lead, products) {
  const blocks = products.map((product, index) =>
    [
      `${index + 1}. ${product.name}`,
      `${product.oil} · ${supplyLine(product)}`,
      `Viscosity: ${product.viscosity}`,
      product.advantages[0],
    ].join('\n'),
  )
  return [
    'Alfa Kimya · Personalized Alkyd Resins Mini Catalog',
    'European Coatings Show 2027',
    '',
    'Your shortlist from the stand:',
    '',
    blocks.join('\n\n'),
    '',
    'Figures are from the Alfa stand sheet. Ask the team for the controlled TDS.',
    'You received this because you requested the catalog and gave consent.',
  ].join('\n')
}

export function buildCatalogHtml(lead, products) {
  const rows = products
    .map(
      (product) => `
        <tr>
          <td style="padding:16px 0;border-top:1px solid #E2E8EF">
            <div style="font-size:16px;font-weight:700;color:#122033">${product.name}</div>
            <div style="margin-top:4px;font-size:13px;color:#3E5166">${product.oil} · ${supplyLine(product)}</div>
            <div style="margin-top:4px;font-size:13px;color:#3E5166">Viscosity: ${product.viscosity}</div>
            <div style="margin-top:8px;font-size:14px;line-height:1.45;color:#122033">${product.advantages[0]}</div>
          </td>
        </tr>`,
    )
    .join('')

  return `<!doctype html>
<html>
  <body style="margin:0;background:#F3F6F8;font-family:Arial,sans-serif;color:#122033">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding:24px 12px">
          <table role="presentation" width="100%" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden">
            <tr>
              <td style="background:#0A3260;padding:24px;color:#ffffff">
                <div style="font-size:12px;letter-spacing:.14em;text-transform:uppercase">Alfa Kimya · Nippon Paint</div>
                <div style="margin-top:10px;font-size:24px;font-weight:700">Your alkyd mini catalog</div>
                <div style="margin-top:8px;font-size:14px;line-height:1.5;color:#D5E4F2">ECS 2027 shortlist prepared for ${lead.email}</div>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 24px 24px">
                <table role="presentation" width="100%">${rows}</table>
                <p style="font-size:12px;line-height:1.5;color:#5C7084">Figures are from the Alfa Kimya High Solid and Water Dilutable stand sheet. Ask Alfa for the controlled TDS before formulation work.</p>
                <p style="font-size:12px;line-height:1.5;color:#5C7084">You received this because you requested your shortlist and gave consent. Reply to this email to withdraw consent.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`
}

export function buildLeadPayload(lead, products) {
  return {
    event: 'ecs27.mini_catalog',
    to: lead.email,
    consent: true,
    consentText: lead.consentText,
    submittedAt: new Date(lead.ts).toISOString(),
    source: {
      src: lead.src,
      channel: lead.channel,
      touchpoint: lead.touchpoint,
      utm_source: lead.utm_source || '',
      utm_medium: lead.utm_medium || '',
      utm_campaign: lead.utm_campaign || '',
    },
    products: products.map((product) => ({
      id: product.id,
      name: product.name,
      oil: product.oil,
      supply: supplyLine(product),
      viscosity: product.viscosity,
    })),
    text: buildCatalogText(lead, products),
    html: buildCatalogHtml(lead, products),
    salesNotification: {
      role: 'ecs2027-stand-sales',
      subject: `ECS 2027 lead · ${products.length} resin${products.length === 1 ? '' : 's'}`,
      email: lead.email,
      products: products.map((product) => product.name),
      src: lead.src,
      channel: lead.channel,
      touchpoint: lead.touchpoint,
    },
  }
}

export async function postLead(webhook, payload) {
  const response = await fetch(webhook, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!response.ok) {
    throw new Error(`Mail webhook responded ${response.status}`)
  }
  return { mode: 'webhook' }
}
