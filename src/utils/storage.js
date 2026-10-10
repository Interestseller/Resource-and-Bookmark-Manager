// The ONLY file that touches localStorage. Swap these for API calls later.
const KEY = 'rm_data_v1', THEME = 'rm_theme'

export function loadData() {
  try {
    const d = JSON.parse(localStorage.getItem(KEY))
    if (d && Array.isArray(d.resources) && Array.isArray(d.collections)) return d
  } catch { /* corrupted -> fall through */ }
  return null
}
export function saveData(data) { try { localStorage.setItem(KEY, JSON.stringify(data)) } catch { /* storage full */ } }
export const loadTheme = () => { try { return localStorage.getItem(THEME) === 'dark' } catch { return false } }
export const saveTheme = (dark) => { try { localStorage.setItem(THEME, dark ? 'dark' : 'light') } catch { /* ignore */ } }
