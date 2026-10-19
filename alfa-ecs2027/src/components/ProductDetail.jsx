import { useEffect } from 'react'
import { PREVIEW_NOTE } from '../data/products.js'
import { track } from '../lib/analytics.js'
import { hrefFor } from '../lib/route.js'
import { useStand } from '../stand.jsx'
import { Icon } from './Icons.jsx'
import { VideoLoop } from './VideoLoop.jsx'

export function ProductDetail({ product, family, application }) {
  const { selection, toggleProduct, downloadTds, setContactId } = useStand()
  const selected = selection.includes(product.id)

  useEffect(() => {
    track('product_view', { product: product.id, key: `view:${product.id}` })
  }, [product.id])

  const specs = [
    ['Resin type', product.oil],
    ['Oil type', product.oilType],
    ['Supply form', product.supply || product.card],
    ['Acid value', product.acid],
    ['Viscosity', product.viscosity],
    ['Color', product.color],
  ].filter(([, value]) => value)

  return (
    <div className="px-5 pb-8">
      <a
        href={hrefFor({ name: 'products', family: family.id, application: application.id })}
        className="inline-flex items-center gap-1 text-sm font-medium text-alfa"
      >
        <Icon name="back" className="h-4 w-4" />
        Matching resins
      </a>
      <p className="mt-4 text-[11px] font-medium uppercase tracking-[0.16em] text-slate-500">Step 4 of 4</p>
      <p className="mt-2 text-xs font-medium uppercase tracking-[0.14em] text-alfa">{family.title}</p>
      <h1 className="mt-1 text-[30px] font-semibold leading-tight tracking-tight">{product.name}</h1>
      <p className="mt-2 text-sm text-slate-600">{product.card}</p>

      <dl className="mt-5 grid grid-cols-2 gap-2">
        {specs.map(([label, value]) => (
          <div key={label} className="rounded-2xl bg-white p-3 shadow-card">
            <dt className="text-[11px] uppercase tracking-[0.12em] text-slate-500">{label}</dt>
            <dd className="mt-1 text-sm font-semibold leading-snug">{value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-3 text-xs leading-relaxed text-slate-500">{PREVIEW_NOTE}</p>

      <h2 className="mt-6 text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">On the line</h2>
      <ul className="mt-2 grid gap-2">
        {product.advantages.map((item) => (
          <li key={item} className="rounded-2xl bg-white px-3 py-3 text-sm leading-relaxed shadow-card">
            {item}
          </li>
        ))}
      </ul>

      <h2 className="mt-6 text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">Application</h2>
      <div className="mt-2">
        <VideoLoop productId={product.id} tone={family.id} />
      </div>

      <div className="mt-5 grid gap-2">
        <button
          type="button"
          onClick={() => downloadTds(product)}
          className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-white text-sm font-semibold shadow-card"
        >
          <Icon name="download" className="h-4 w-4" />
          Download TDS
        </button>
        <button
          type="button"
          onClick={() => toggleProduct(product)}
          className={`flex min-h-12 items-center justify-center gap-2 rounded-2xl px-3 py-3 text-center text-sm font-semibold text-white ${
            selected ? 'bg-eco' : 'bg-nippon'
          }`}
        >
          <Icon name={selected ? 'check' : 'cart'} className="h-4 w-4" />
          {selected ? 'In My Alfa Selection' : '+ Add to My Alfa Selection'}
        </button>
        <button
          type="button"
          onClick={() => setContactId(product.id)}
          className="flex h-12 items-center justify-center rounded-2xl border border-alfa/20 bg-alfa/5 text-sm font-semibold text-alfa"
        >
          Contact Alfa
        </button>
      </div>
    </div>
  )
}
