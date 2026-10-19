const SELECTION_KEY = 'alfa-ecs27-selection'

export function loadSelection() {
  if (typeof localStorage === 'undefined') return []
  try {
    const parsed = JSON.parse(localStorage.getItem(SELECTION_KEY) || '[]')
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === 'string') : []
  } catch {
    return []
  }
}

export function saveSelection(ids) {
  if (typeof localStorage === 'undefined') return
  try {
    localStorage.setItem(SELECTION_KEY, JSON.stringify(ids))
  } catch {
    /* The shortlist stays in memory if the device rejects storage. */
  }
}

export function toggleId(ids, id) {
  return ids.includes(id) ? ids.filter((item) => item !== id) : [...ids, id]
}

export function clearSelectionStorage() {
  if (typeof localStorage === 'undefined') return
  localStorage.removeItem(SELECTION_KEY)
}
