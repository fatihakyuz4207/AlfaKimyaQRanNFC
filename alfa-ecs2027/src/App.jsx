import { useEffect, useState } from 'react'
import { APPLICATIONS, FAMILIES, PRODUCTS } from './data/products.js'
import { Applications } from './components/Applications.jsx'
import { ContactModal } from './components/ContactModal.jsx'
import { Demo } from './components/Demo.jsx'
import { Discover } from './components/Discover.jsx'
import { Icon } from './components/Icons.jsx'
import { Insights } from './components/Insights.jsx'
import { ProductDetail } from './components/ProductDetail.jsx'
import { ProductList } from './components/ProductList.jsx'
import { SelectionDrawer } from './components/SelectionDrawer.jsx'
import { Sent } from './components/Sent.jsx'
import { parseRoute } from './lib/route.js'
import { StandProvider, useStand } from './stand.jsx'

function useHash() {
  const [hash, setHash] = useState(() => window.location.hash || '#/')
  useEffect(() => {
    const onChange = () => setHash(window.location.hash || '#/')
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return hash
}

function Missing() {
  return (
    <div className="px-5 pb-10">
      <h1 className="text-3xl font-semibold tracking-tight">This page is not on the stand</h1>
      <a href="#/" className="mt-4 inline-flex text-sm font-semibold text-alfa">
        Back to Discover
      </a>
    </div>
  )
}

function Screens({ route }) {
  if (route.name === 'insights') return <Insights />
  if (route.name === 'demo') return <Demo />
  if (route.name === 'sent') return <Sent />
  if (route.name === 'discover') return <Discover />

  const family = FAMILIES.find((item) => item.id === route.family)
  if (!family) return <Missing />
  if (route.name === 'application') return <Applications family={family} />

  const application = APPLICATIONS.find((item) => item.id === route.application)
  if (!application) return <Missing />
  if (route.name === 'products') return <ProductList family={family} application={application} />

  const product = PRODUCTS.find((item) => item.id === route.product)
  if (!product) return <Missing />
  return <ProductDetail product={product} family={family} application={application} />
}

function Frame() {
  const hash = useHash()
  const route = parseRoute(hash)
  const { selection, setCartOpen } = useStand()
  const wide = route.name === 'insights' || route.name === 'demo'

  useEffect(() => {
    const titles = {
      discover: 'Discover Alfa',
      application: 'Select an application',
      products: 'Matching resins',
      detail: 'Resin detail',
      sent: 'Mini catalog',
      insights: 'Stand insights',
      demo: 'Stand demosu',
    }
    document.title = `${titles[route.name] || 'Alfa'} · ECS 2027`
  }, [route.name])

  return (
    <div className="min-h-dvh bg-[#09131c] text-ink">
      <a href="#content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-white focus:px-3 focus:py-2">
        Skip to content
      </a>
      <div className={`mx-auto flex min-h-dvh w-full flex-col bg-mist ${wide ? 'max-w-5xl' : 'max-w-[430px]'}`}>
        <div className="h-1 bg-gradient-to-r from-alfa via-alfa-deep to-nippon" />
        <header className="sticky top-0 z-30 flex items-center justify-between bg-mist/95 px-5 py-3 backdrop-blur">
          <a href="#/" className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-alfa text-xs font-semibold text-white">AL</span>
            <span>
              <span className="block text-sm font-semibold leading-none">Alfa Kimya</span>
              <span className="mt-1 block text-[10px] uppercase tracking-[0.14em] text-slate-500">Nippon Paint</span>
            </span>
          </a>
          <button
            type="button"
            className="relative grid h-11 w-11 place-items-center rounded-full bg-white shadow-card"
            onClick={() => setCartOpen(true)}
            aria-label={`My Alfa Selection, ${selection.length} ${selection.length === 1 ? 'resin' : 'resins'}`}
          >
            <Icon name="cart" className="h-5 w-5" />
            {selection.length > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-nippon px-1 text-[11px] font-semibold text-white">
                {selection.length}
              </span>
            )}
          </button>
        </header>
        <main id="content">
          <Screens route={route} />
        </main>
      </div>
      <SelectionDrawer />
      <ContactModal />
    </div>
  )
}

export default function App() {
  return (
    <StandProvider>
      <Frame />
    </StandProvider>
  )
}
