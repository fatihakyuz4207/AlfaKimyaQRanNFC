import { useMemo, useState } from 'react'
import { APPLICATIONS, FAMILIES, PRODUCTS } from '../data/products.js'
import { summarize } from '../lib/analytics.js'
import { ENTRY_POINTS, entryUrl, publicBase } from '../lib/entry.js'
import { maskEmail } from '../lib/lead.js'
import { useStand } from '../stand.jsx'

function percent(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return '—'
  return `${Math.round(value * 100)}%`
}

function Bar({ label, value, max }) {
  const width = max > 0 && value > 0 ? Math.max(8, Math.round((value / max) * 100)) : 0
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 text-sm">
        <span>{label}</span>
        <span className="font-semibold tabular-nums">{value}</span>
      </div>
      <div className="mt-1 h-2 rounded-full bg-line">
        <div className="h-2 rounded-full bg-alfa" style={{ width: `${width}%` }} />
      </div>
    </div>
  )
}

function Stat({ label, value, note }) {
  return (
    <article className="rounded-2xl bg-white p-4 shadow-card">
      <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight tabular-nums">{value}</p>
      {note && <p className="mt-1 text-xs leading-relaxed text-slate-500">{note}</p>}
    </article>
  )
}

export function Insights() {
  const { storeVersion, readStore, loadSample, eraseEmails, clearDevice } = useStand()
  const [reveal, setReveal] = useState(false)
  const [copied, setCopied] = useState('')
  const store = useMemo(() => readStore(), [readStore, storeVersion])
  const stats = summarize(store)
  const webhook = import.meta.env.VITE_LEAD_WEBHOOK || ''
  const familyMax = Math.max(0, ...Object.values(stats.families))
  const appMax = Math.max(0, ...Object.values(stats.applications))
  const viewMax = Math.max(0, ...Object.values(stats.productViews))

  const copyLive = async (point) => {
    const url = new URL(window.location.href)
    url.hash = ''
    url.search = ''
    url.searchParams.set('src', point.src)
    url.searchParams.set('ch', point.ch)
    url.searchParams.set('utm_source', 'ecs2027')
    url.searchParams.set('utm_medium', point.ch)
    url.searchParams.set('utm_campaign', point.src)
    try {
      await navigator.clipboard.writeText(url.toString())
      setCopied(url.toString())
    } catch {
      setCopied('')
    }
  }

  return (
    <div className="px-5 pb-10">
      <a href="#/" className="text-sm font-semibold text-alfa">
        Back to the microsite
      </a>
      <p className="mt-4 text-[11px] font-medium uppercase tracking-[0.16em] text-slate-500">ECS 2027 stand board</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Insights</h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
        Anonymous totals on this device. Emails appear only after a visitor asks for a catalog and gives consent.
        {webhook ? ' Mail webhook is connected.' : ' Mail webhook is not set, so catalog requests stay in this browser.'}
      </p>

      <section className="mt-6">
        <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">Access</h2>
        <div className="mt-3 grid grid-cols-2 gap-2 lg:grid-cols-4">
          <Stat label="Unique sessions" value={stats.sessions} note="One session per browser visit" />
          <Stat label="NFC touches" value={stats.nfc} note="Sessions with ch=nfc" />
          <Stat label="QR scans" value={stats.qr} note="Sessions with ch=qr" />
          <Stat label="Unspecified" value={stats.unspecified} note="Opened without a channel" />
        </div>
        <div className="mt-2 grid grid-cols-3 gap-2">
          <Stat label="Wall" value={stats.wall} />
          <Stat label="Totem" value={stats.totem} />
          <Stat label="Direct" value={stats.direct} />
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">Resin family</h2>
          <div className="mt-3 grid gap-3 rounded-[24px] bg-white p-4 shadow-card">
            {FAMILIES.map((family) => (
              <Bar key={family.id} label={family.title} value={stats.families[family.id] || 0} max={familyMax} />
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">Application area</h2>
          <div className="mt-3 grid gap-3 rounded-[24px] bg-white p-4 shadow-card">
            {APPLICATIONS.map((application) => (
              <Bar key={application.id} label={application.title} value={stats.applications[application.id] || 0} max={appMax} />
            ))}
          </div>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">Content</h2>
        <div className="mt-3 grid grid-cols-2 gap-2 lg:grid-cols-4">
          <Stat label="Product views" value={stats.viewTotal} />
          <Stat label="Video watch rate" value={percent(stats.videoRate)} note="Finished loops ÷ product views" />
          <Stat label="TDS downloads" value={stats.tdsTotal} />
          <Stat label="Stand conversations" value={stats.contacts} note="Anonymous Contact Alfa pings" />
        </div>
        <div className="mt-3 grid gap-3 rounded-[24px] bg-white p-4 shadow-card">
          {PRODUCTS.map((product) => (
            <Bar key={product.id} label={product.name} value={stats.productViews[product.id] || 0} max={viewMax} />
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">Conversion</h2>
        <div className="mt-3 grid grid-cols-2 gap-2 lg:grid-cols-3">
          <Stat label="Shortlist adds" value={stats.adds} />
          <Stat label="Add rate" value={percent(stats.addRate)} note="Sessions with a shortlist ÷ sessions" />
          <Stat label="Qualified leads" value={stats.leads} note="Consented catalog emails" />
        </div>
      </section>

      <section className="mt-8">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">Qualified emails</h2>
          <button type="button" className="text-sm font-semibold text-alfa" onClick={() => setReveal((value) => !value)}>
            {reveal ? 'Hide addresses' : 'Reveal addresses'}
          </button>
        </div>
        {store.leads.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">No consented emails on this device.</p>
        ) : (
          <ul className="mt-3 grid gap-2">
            {[...store.leads].reverse().map((lead) => (
              <li key={lead.id} className="rounded-2xl bg-white px-3 py-3 text-sm shadow-card">
                <span className="font-semibold">{reveal ? lead.email : maskEmail(lead.email)}</span>
                <span className="mt-1 block text-slate-500">
                  {lead.productIds.length} {lead.productIds.length === 1 ? 'resin' : 'resins'} · {lead.touchpoint} · {lead.channel} · {lead.src}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">NFC and QR entry points</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          Program every chip and code to a dynamic URL. Copy uses this browser. Production host: {publicBase()}.
        </p>
        <ul className="mt-3 grid gap-2">
          {ENTRY_POINTS.map((point) => {
            const live = entryUrl(point, window.location.origin + window.location.pathname)
            return (
              <li key={`${point.src}-${point.ch}`} className="rounded-2xl bg-white p-3 shadow-card">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold">{point.label}</p>
                  <button type="button" className="text-sm font-semibold text-alfa" onClick={() => copyLive(point)}>
                    {copied && copied.includes(`src=${point.src}`) && copied.includes(`ch=${point.ch}`) ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <p className="mt-1 break-all text-xs text-slate-500">{live}</p>
                <a className="mt-2 inline-flex text-xs font-semibold text-alfa" href={live}>
                  Open this entry
                </a>
              </li>
            )
          })}
        </ul>
      </section>

      <div className="mt-8 grid gap-2 sm:grid-cols-3">
        <button type="button" className="h-11 rounded-2xl bg-alfa text-sm font-semibold text-white" onClick={loadSample}>
          Load sample stand day
        </button>
        <button type="button" className="h-11 rounded-2xl bg-white text-sm font-semibold shadow-card" onClick={eraseEmails}>
          Erase saved emails
        </button>
        <button type="button" className="h-11 rounded-2xl bg-white text-sm font-semibold text-nippon shadow-card" onClick={clearDevice}>
          Clear this device
        </button>
      </div>
      <p className="mt-4 text-xs leading-relaxed text-slate-500">
        Sample data uses visitor.n@example.com and is marked so the board can be shown before the hall opens. Clear this device removes sessions, events, emails and the shortlist.
      </p>
    </div>
  )
}
