// Local "metadata extraction". A browser can't read other sites' pages (CORS),
// so we infer from the URL. Later: call your backend, which fetches the page <title>/og tags.
export function parseUrl(raw) {
  try {
    const u = new URL(/^https?:\/\//i.test(raw.trim()) ? raw.trim() : 'https://' + raw.trim())
    return u.hostname.includes('.') ? u : null
  } catch { return null }
}
export const normalizeUrl = (raw) => parseUrl(raw)?.href ?? ''
export const domainOf = (url) => parseUrl(url)?.hostname.replace(/^www\./, '') ?? ''
export const faviconOf = (url) => `https://www.google.com/s2/favicons?sz=64&domain=${domainOf(url)}`
export const sameUrl = (a, b) => {
  const k = (x) => normalizeUrl(x).replace(/\/$/, '').toLowerCase()
  return k(a) !== '' && k(a) === k(b)
}

export function detectType(url) {
  const u = parseUrl(url); if (!u) return 'Website'
  const host = u.hostname.replace(/^www\./, ''), path = u.pathname.toLowerCase()
  if (/youtube\.com|youtu\.be/.test(host)) return 'YouTube Video'
  if (host === 'github.com') return 'GitHub Repository'
  if (path.endsWith('.pdf')) return 'PDF'
  if (/arxiv\.org|researchgate|scholar\.google/.test(host)) return 'Research Paper'
  if (/coursera|udemy|edx|nptel|udacity|khanacademy/.test(host)) return 'Course'
  if (/^docs\.|developer\.mozilla|readthedocs|devdocs/.test(host)) return 'Documentation'
  if (/medium\.com|dev\.to|geeksforgeeks|freecodecamp\.org\/news|hashnode/.test(host)) return 'Article'
  return 'Website'
}
function guessTitle(u) {
  const parts = u.pathname.split('/').filter(Boolean)
  if (u.hostname === 'github.com' && parts.length) return parts.slice(0, 2).join('/')
  const last = parts[parts.length - 1]
  if (!last) return u.hostname.replace(/^www\./, '')
  return decodeURIComponent(last).replace(/\.\w+$/, '').replace(/[-_]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}
export async function fetchMetadata(url) {
  const u = parseUrl(url)
  if (!u) throw new Error('Invalid URL')
  return { title: guessTitle(u), domain: domainOf(url), type: detectType(url), favicon: faviconOf(url) }
}
