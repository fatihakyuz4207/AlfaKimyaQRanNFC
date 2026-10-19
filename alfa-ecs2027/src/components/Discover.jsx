import { FAMILIES } from '../data/products.js'
import { hrefFor } from '../lib/route.js'
import { track } from '../lib/analytics.js'
import { useStand } from '../stand.jsx'
import { Icon } from './Icons.jsx'

export function Discover() {
  const { entry } = useStand()

  return (
    <div className="px-5 pb-8">
      {entry.familyHint && (
        <p className="mb-3 inline-flex rounded-full bg-white px-3 py-1 text-xs font-medium text-alfa shadow-card">
          Opened from the {entry.label}
          {entry.channel !== 'unspecified' ? ` · ${entry.channel.toUpperCase()}` : ''}
        </p>
      )}

      <section>
        <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-slate-500">
          <span className="h-1.5 w-1.5 rounded-full bg-nippon" />
          ECS 2027 · Nuremberg
        </p>
        <h1 className="mt-1 text-xl font-semibold tracking-tight">Discover Alfa</h1>
        <p className="mt-1 text-sm leading-snug text-slate-600">Choose a resin family first. Inspired by You.</p>
      </section>

      <div className="mt-4 grid gap-3">
        {FAMILIES.map((family) => {
          const highlighted = entry.familyHint === family.id
          const water = family.id === 'water'
          return (
            <a
              key={family.id}
              href={hrefFor({ name: 'application', family: family.id })}
              onClick={() => track('family_select', { family: family.id, key: `family:${family.id}` })}
              className={`block rounded-[24px] bg-white p-4 shadow-card ${highlighted ? 'ring-2 ring-alfa' : ''}`}
            >
              <div className="flex items-start justify-between gap-3">
                <p className={`text-[11px] font-medium uppercase tracking-[0.14em] ${water ? 'text-eco' : 'text-alfa'}`}>
                  {water ? 'Water reducible' : 'High solids'}
                  {highlighted ? ' · This tag' : ''}
                </p>
                <span
                  className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${
                    water ? 'bg-eco/10 text-eco' : 'bg-alfa/10 text-alfa'
                  }`}
                >
                  <Icon name="arrow" className="h-4 w-4" />
                </span>
              </div>
              <h2 className="mt-3 text-[22px] font-semibold leading-tight tracking-tight">{family.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{family.summary}</p>
              <p className="mt-3 text-xs font-medium text-slate-500">4 application lines inside</p>
            </a>
          )
        })}
      </div>

      <p className="mt-6 text-center text-xs leading-relaxed text-slate-500">
        Browse and download preview sheets without an email. An address is asked only if you request the mini catalog.
      </p>
      <p className="mt-3 text-center">
        <a href="#/demo" className="text-[11px] font-medium text-slate-400">
          Demo
        </a>
        <span className="mx-2 text-slate-300">·</span>
        <a href="#/insights" className="text-[11px] font-medium text-slate-400">
          Stand insights
        </a>
      </p>
    </div>
  )
}
