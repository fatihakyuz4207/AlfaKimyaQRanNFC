import { useEffect, useState } from 'react'
import { CONSENT_TEXT } from '../lib/lead.js'
import { useStand } from '../stand.jsx'
import { Icon } from './Icons.jsx'
import { PrivacyDialog } from './PrivacyDialog.jsx'

export function SelectionDrawer() {
  const { cartOpen, setCartOpen, selectedProducts, removeProduct, downloadTds, submitLead } = useStand()
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [honeypot, setHoneypot] = useState('')
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)
  const [privacyOpen, setPrivacyOpen] = useState(false)

  useEffect(() => {
    if (!cartOpen) return undefined
    const onKey = (event) => {
      if (event.key === 'Escape') setCartOpen(false)
    }
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKey)
    }
  }, [cartOpen, setCartOpen])

  if (!cartOpen) return null

  const onSubmit = async (event) => {
    event.preventDefault()
    setSending(true)
    setError('')
    try {
      const result = await submitLead({ email, consent, honeypot })
      if (!result.ok) setError(result.error)
    } catch {
      setError('The mail service did not accept the catalog. Your email was not saved. Try again in a moment.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-ink/50" role="presentation" onClick={() => setCartOpen(false)}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="selection-title"
        className="max-h-[88dvh] w-full max-w-[430px] overflow-auto rounded-t-[28px] bg-mist px-5 pb-safe pt-4 shadow-card"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-line" />
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-500">Shortlist</p>
            <h2 id="selection-title" className="text-2xl font-semibold tracking-tight">
              My Alfa Selection
            </h2>
          </div>
          <button type="button" className="grid h-10 w-10 place-items-center rounded-full bg-white" onClick={() => setCartOpen(false)} aria-label="Close selection">
            <Icon name="close" className="h-4 w-4" />
          </button>
        </div>

        {selectedProducts.length === 0 ? (
          <p className="mt-6 rounded-2xl bg-white p-4 text-sm leading-relaxed text-slate-600">
            Your shortlist is empty. Open a resin and add it here. No email is required to keep browsing.
          </p>
        ) : (
          <>
            <ul className="mt-4 grid gap-2">
              {selectedProducts.map((product) => (
                <li key={product.id} className="rounded-2xl bg-white p-3 shadow-card">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold tracking-tight">{product.name}</p>
                      <p className="mt-1 text-sm text-slate-500">{product.card}</p>
                    </div>
                    <button type="button" className="text-xs font-semibold text-slate-400" onClick={() => removeProduct(product)}>
                      Remove
                    </button>
                  </div>
                  <button type="button" className="mt-2 text-sm font-semibold text-alfa" onClick={() => downloadTds(product)}>
                    Download TDS
                  </button>
                </li>
              ))}
            </ul>

            <form className="mt-5" onSubmit={onSubmit}>
              <h3 className="text-lg font-semibold tracking-tight">Get Your Personalized Mini Catalog</h3>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">
                Alfa emails this shortlist only after you ask for it and tick consent.
              </p>
              <label className="mt-4 block text-sm font-medium" htmlFor="catalog-email">
                Work email
              </label>
              <input
                id="catalog-email"
                type="email"
                inputMode="email"
                autoComplete="email"
                name="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="nina.v@example.com"
                className="mt-1 h-12 w-full rounded-2xl border border-line bg-white px-3 text-base outline-none"
              />
              <label className="mt-4 flex items-start gap-3 text-sm leading-relaxed">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(event) => setConsent(event.target.checked)}
                  className="mt-1 h-5 w-5 shrink-0 accent-alfa"
                />
                <span>
                  {CONSENT_TEXT}
                  <button type="button" className="mt-2 block font-semibold text-alfa" onClick={() => setPrivacyOpen(true)}>
                    Privacy notice
                  </button>
                </span>
              </label>
              <div className="absolute left-[-9999px] h-0 overflow-hidden" aria-hidden="true">
                <label>
                  Company website
                  <input tabIndex={-1} autoComplete="off" value={honeypot} onChange={(event) => setHoneypot(event.target.value)} />
                </label>
              </div>
              {error && (
                <p className="mt-3 text-sm font-medium text-nippon" role="alert">
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={sending}
                className="mt-4 flex h-12 w-full items-center justify-center rounded-2xl bg-alfa text-sm font-semibold text-white disabled:opacity-60"
              >
                {sending ? 'Sending…' : 'Send My Catalog'}
              </button>
            </form>
          </>
        )}
      </div>
      {privacyOpen && <PrivacyDialog onClose={() => setPrivacyOpen(false)} />}
    </div>
  )
}
