import { productById } from '../data/products.js'
import { catalogDocument } from '../lib/documents.js'
import { downloadPdf } from '../lib/pdf.js'
import { useStand } from '../stand.jsx'

export function Sent() {
  const { readLastLead } = useStand()
  const lead = readLastLead()

  if (!lead) {
    return (
      <div className="px-5 pb-10">
        <h1 className="text-3xl font-semibold tracking-tight">No catalog yet</h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">Send a shortlist from My Alfa Selection to open the preview here.</p>
        <a href="#/" className="mt-6 inline-flex text-sm font-semibold text-alfa">
          Back to Discover
        </a>
      </div>
    )
  }

  const products = lead.productIds.map(productById).filter(Boolean)
  const local = lead.delivery !== 'webhook'

  return (
    <div className="px-5 pb-10">
      <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-eco">Catalog ready</p>
      <h1 className="mt-2 text-[32px] font-semibold leading-tight tracking-tight">Your mini catalog</h1>
      <p className="mt-3 text-sm leading-relaxed text-slate-600">
        {local
          ? 'Preview mode: no mail webhook is connected, so the message was prepared on this phone and stored for the stand board. Connect the webhook to deliver it.'
          : `The catalog was handed to the mail service for ${lead.email}.`}
      </p>
      <div className="mt-5 overflow-hidden rounded-[24px] bg-alfa-deep p-5 text-white">
        <p className="text-[11px] uppercase tracking-[0.16em] text-white/70">Personalized Alkyd Resins Mini Catalog</p>
        <p className="mt-3 text-lg font-semibold">{lead.email}</p>
        <ul className="mt-4 grid gap-3">
          {products.map((product) => (
            <li key={product.id}>
              <p className="font-semibold">{product.name}</p>
              <p className="text-sm text-white/80">{product.card}</p>
            </li>
          ))}
        </ul>
      </div>
      <button
        type="button"
        className="mt-4 h-12 w-full rounded-2xl bg-white text-sm font-semibold shadow-card"
        onClick={() => {
          const document = catalogDocument(products)
          downloadPdf(document.filename, document.lines)
        }}
      >
        Download mini catalog PDF
      </button>
      <a href="#/" className="mt-3 flex h-12 items-center justify-center text-sm font-semibold text-alfa">
        Keep browsing
      </a>
    </div>
  )
}
