import { APPLICATIONS, productsFor } from '../data/products.js'
import { hrefFor } from '../lib/route.js'
import { track } from '../lib/analytics.js'
import { Icon } from './Icons.jsx'

export function Applications({ family }) {
  const water = family.id === 'water'

  return (
    <div className="px-5 pb-8">
      <a href="#/" className="inline-flex items-center gap-1 text-sm font-medium text-alfa">
        <Icon name="back" className="h-4 w-4" />
        Families
      </a>
      <p className={`mt-4 text-[11px] font-medium uppercase tracking-[0.16em] ${water ? 'text-eco' : 'text-alfa'}`}>
        {water ? 'Water reducible' : 'High solids'} · Step 2 of 4
      </p>
      <h1 className="mt-2 text-[30px] font-semibold leading-tight tracking-tight">{family.title}</h1>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">Choose an application line.</p>
      <div className="mt-5 grid gap-3">
        {APPLICATIONS.map((application) => {
          const count = productsFor(family.id, application.id).length
          return (
            <a
              key={application.id}
              href={hrefFor({ name: 'products', family: family.id, application: application.id })}
              onClick={() =>
                track('application_select', {
                  application: application.id,
                  family: family.id,
                  key: `app:${family.id}:${application.id}`,
                })
              }
              className="flex items-center gap-3 rounded-[22px] bg-white p-4 shadow-card"
            >
              <span
                className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${
                  water ? 'bg-eco/10 text-eco' : 'bg-alfa/10 text-alfa'
                }`}
              >
                <Icon name={application.icon} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-base font-semibold tracking-tight">{application.title}</span>
                <span className="mt-0.5 block text-sm text-slate-500">{application.hint}</span>
              </span>
              <span className="shrink-0 text-[11px] font-medium text-slate-400">
                {count} {count === 1 ? 'resin' : 'resins'}
              </span>
              <Icon name="arrow" className="h-4 w-4 shrink-0 text-slate-400" />
            </a>
          )
        })}
      </div>
    </div>
  )
}
