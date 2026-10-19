import { useEffect, useState } from 'react'
import { useStand } from '../stand.jsx'

export function ContactModal() {
  const { contactProduct, setContactId, notifyStand } = useStand()
  const [pinged, setPinged] = useState(false)

  useEffect(() => {
    setPinged(false)
  }, [contactProduct?.id])

  useEffect(() => {
    if (!contactProduct) return undefined
    const onKey = (event) => {
      if (event.key === 'Escape') setContactId(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [contactProduct, setContactId])

  if (!contactProduct) return null

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-ink/50 sm:items-center" onClick={() => setContactId(null)}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-title"
        className="w-full max-w-[430px] rounded-t-[28px] bg-white p-5 sm:rounded-[28px]"
        onClick={(event) => event.stopPropagation()}
      >
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-500">On the stand</p>
        <h2 id="contact-title" className="mt-2 text-2xl font-semibold tracking-tight">
          Contact Alfa
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          Ask for {contactProduct.name} at the Alfa Kimya / Nippon Paint stand, European Coatings Show 2027, Nuremberg. A specialist can walk the preview sheet with you.
        </p>
        {pinged ? (
          <p className="mt-4 rounded-2xl bg-eco/10 px-3 py-3 text-sm leading-relaxed text-eco">
            The stand board counted this request. No name or email was stored.
          </p>
        ) : (
          <button
            type="button"
            className="mt-4 h-12 w-full rounded-2xl bg-alfa text-sm font-semibold text-white"
            onClick={() => {
              notifyStand(contactProduct)
              setPinged(true)
            }}
          >
            Notify the stand team
          </button>
        )}
        <button type="button" className="mt-2 h-12 w-full rounded-2xl text-sm font-semibold text-slate-500" onClick={() => setContactId(null)}>
          Close
        </button>
      </div>
    </div>
  )
}
