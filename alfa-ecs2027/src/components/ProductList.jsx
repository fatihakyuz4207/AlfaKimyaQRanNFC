import { productsFor } from '../data/products.js'
import { hrefFor } from '../lib/route.js'
import { Icon } from './Icons.jsx'

export function ProductList({ family, application }) {
  const products = productsFor(family.id, application.id)

  return (
    <div className="px-5 pb-8">
      <a
        href={hrefFor({ name: 'application', family: family.id })}
        className="inline-flex items-center gap-1 text-sm font-medium text-alfa"
      >
        <Icon name="back" className="h-4 w-4" />
        Application lines
      </a>
      <p className="mt-4 text-[11px] font-medium uppercase tracking-[0.16em] text-slate-500">Step 3 of 4</p>
      <h1 className="mt-2 text-[30px] font-semibold leading-tight tracking-tight">Matching resins</h1>
      <p className="mt-2 text-sm text-slate-600">
        {family.title} · {application.title}
      </p>
      <div className="mt-5 grid gap-3">
        {products.map((product) => (
          <a
            key={product.id}
            href={hrefFor({
              name: 'detail',
              family: family.id,
              application: application.id,
              product: product.id,
            })}
            className="flex items-center gap-3 rounded-[22px] bg-white p-4 shadow-card"
          >
            <span className="min-w-0 flex-1">
              <span className="block text-[11px] font-medium uppercase tracking-[0.14em] text-alfa">{product.oil}</span>
              <span className="mt-1 block text-lg font-semibold tracking-tight">{product.name}</span>
              <span className="mt-1 block text-sm text-slate-500">{product.card}</span>
            </span>
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-mist text-ink">
              <Icon name="arrow" className="h-4 w-4" />
            </span>
          </a>
        ))}
      </div>
    </div>
  )
}
