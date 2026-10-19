import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { PRODUCTS, productById } from './data/products.js'
import { parseEntry } from './lib/entry.js'
import {
  ensureSession,
  eraseLeads,
  loadLastLead,
  loadStore,
  mergeSample,
  rememberLead,
  resetDevice,
  sampleStandDay,
  saveStore,
  track,
} from './lib/analytics.js'
import { catalogDocument, tdsDocument } from './lib/documents.js'
import { CONSENT_TEXT, buildCatalogHtml, buildCatalogText, buildLeadPayload, postLead, validateLead } from './lib/lead.js'
import { downloadPdf } from './lib/pdf.js'
import { loadSelection, saveSelection, toggleId } from './lib/selection.js'

const StandContext = createContext(null)

export function useStand() {
  const value = useContext(StandContext)
  if (!value) throw new Error('useStand must be used inside StandProvider')
  return value
}

export function StandProvider({ children }) {
  const entry = useMemo(() => parseEntry(window.location.search), [])
  const [selection, setSelection] = useState(loadSelection)
  const [cartOpen, setCartOpen] = useState(false)
  const [contactId, setContactId] = useState(null)
  const [storeVersion, setStoreVersion] = useState(0)

  useEffect(() => {
    ensureSession(entry)
  }, [entry])

  const refresh = () => setStoreVersion((version) => version + 1)
  const selectedProducts = selection.map(productById).filter(Boolean)

  const toggleProduct = (product) => {
    const exists = selection.includes(product.id)
    const next = toggleId(selection, product.id)
    setSelection(next)
    saveSelection(next)
    track(exists ? 'selection_remove' : 'selection_add', {
      product: product.id,
      key: `${exists ? 'remove' : 'add'}:${product.id}`,
    })
  }

  const removeProduct = (product) => {
    if (!selection.includes(product.id)) return
    toggleProduct(product)
  }

  const downloadTds = (product) => {
    const document = tdsDocument(product)
    downloadPdf(document.filename, document.lines)
    track('tds_download', { product: product.id, key: `tds:${product.id}` })
  }

  const downloadCatalog = () => {
    if (!selectedProducts.length) return
    const document = catalogDocument(selectedProducts)
    downloadPdf(document.filename, document.lines)
  }

  const submitLead = async ({ email, consent, honeypot }) => {
    const productIds = selectedProducts.map((product) => product.id)
    const validation = validateLead({ email, consent, productIds, honeypot })
    if (!validation.ok) return validation

    const lead = {
      id: `lead-${Date.now()}`,
      ts: Date.now(),
      email: email.trim(),
      consent: true,
      consentText: CONSENT_TEXT,
      productIds,
      src: entry.src,
      channel: entry.channel,
      touchpoint: entry.touchpoint,
      utm_source: entry.utm_source,
      utm_medium: entry.utm_medium,
      utm_campaign: entry.utm_campaign,
    }
    const payload = buildLeadPayload(lead, selectedProducts)
    const webhook = import.meta.env.VITE_LEAD_WEBHOOK || ''
    if (webhook) await postLead(webhook, payload)

    const stored = {
      ...lead,
      delivery: webhook ? 'webhook' : 'local',
      html: buildCatalogHtml(lead, selectedProducts),
      text: buildCatalogText(lead, selectedProducts),
    }
    rememberLead(stored)
    track('lead_submit', { key: lead.id, count: productIds.length })
    refresh()
    setCartOpen(false)
    window.location.hash = '#/sent'
    return { ok: true, delivery: stored.delivery }
  }

  const notifyStand = (product) => {
    track('stand_contact', { product: product.id, key: `contact:${product.id}` })
    refresh()
  }

  const value = {
    entry,
    selection,
    selectedProducts,
    cartOpen,
    setCartOpen,
    contactId,
    setContactId,
    contactProduct: productById(contactId),
    toggleProduct,
    removeProduct,
    downloadTds,
    downloadCatalog,
    submitLead,
    notifyStand,
    storeVersion,
    readStore: loadStore,
    readLastLead: loadLastLead,
    loadSample() {
      saveStore(mergeSample(loadStore(), sampleStandDay()))
      refresh()
    },
    eraseEmails() {
      saveStore(eraseLeads(loadStore()))
      refresh()
    },
    clearDevice() {
      resetDevice()
      setSelection([])
      refresh()
      window.location.hash = '#/insights'
      window.location.reload()
    },
    products: PRODUCTS,
  }

  return <StandContext.Provider value={value}>{children}</StandContext.Provider>
}
