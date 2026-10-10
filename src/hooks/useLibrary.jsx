import { createContext, useContext, useEffect, useState } from 'react'
import { loadData, saveData } from '../utils/storage'
import { sampleData } from '../data/sampleData'
import { makeResource, uid } from '../utils/resource'
import { parseUrl, normalizeUrl, sameUrl } from '../services/metadataService'

// One place for all app data + actions. Components call these; storage happens automatically.
const Ctx = createContext(null)
export const useLibrary = () => useContext(Ctx)
const NEXT_STATUS = { 'To Read': 'In Progress', 'In Progress': 'Completed', Completed: 'To Read', Archived: 'To Read' }

export function LibraryProvider({ children }) {
  const [data, setData] = useState(() => loadData() || sampleData())
  const [form, setForm] = useState(null) // null = closed, otherwise { initial }
  const [toastMsg, setToastMsg] = useState('')
  const { resources, collections } = data

  useEffect(() => { saveData(data) }, [data])
  useEffect(() => {
    if (!toastMsg) return
    const t = setTimeout(() => setToastMsg(''), 2500)
    return () => clearTimeout(t)
  }, [toastMsg])

  const patch = (id, changes, touch = true) =>
    setData((d) => ({ ...d, resources: d.resources.map((r) => (r.id === id ? { ...r, ...changes, ...(touch && { updatedAt: new Date().toISOString() }) } : r)) }))

  const actions = {
    resources, collections, toast: setToastMsg, toastMsg,
    form, showForm: (initial = null) => setForm({ initial }), closeForm: () => setForm(null),

    saveResource(values) {
      const clean = makeResource({ ...values, url: normalizeUrl(values.url) })
      if (values.id && resources.some((r) => r.id === values.id)) {
        setData((d) => ({ ...d, resources: d.resources.map((r) => (r.id === values.id ? { ...r, ...clean, id: r.id, createdAt: r.createdAt, views: r.views, updatedAt: new Date().toISOString() } : r)) }))
        setToastMsg('Resource updated')
      } else {
        if (values.id) setToastMsg('That resource was deleted, so it was saved as new')
        else setToastMsg('Resource saved')
        setData((d) => ({ ...d, resources: [{ ...clean, id: uid() }, ...d.resources] }))
      }
    },
    deleteResource(id) { setData((d) => ({ ...d, resources: d.resources.filter((r) => r.id !== id) })); setToastMsg('Resource deleted') },
    updateResource: patch,
    toggleFavorite: (r) => patch(r.id, { favorite: !r.favorite }),
    cycleStatus: (r) => patch(r.id, { status: NEXT_STATUS[r.status] }),
    openResource(r) {
      patch(r.id, { views: r.views + 1, lastOpened: new Date().toISOString() }, false)
      window.open(r.url, '_blank', 'noopener,noreferrer')
    },
    findDuplicate: (url) => resources.find((r) => sameUrl(r.url, url)),

    addCollection(name) {
      if (!name.trim()) return setToastMsg('Collection name is required')
      setData((d) => ({ ...d, collections: [...d.collections, { id: uid(), name: name.trim() }] })); setToastMsg('Collection created')
    },
    renameCollection: (id, name) => name.trim() && setData((d) => ({ ...d, collections: d.collections.map((c) => (c.id === id ? { ...c, name: name.trim() } : c)) })),
    deleteCollection: (id) => setData((d) => ({ collections: d.collections.filter((c) => c.id !== id), resources: d.resources.map((r) => (r.collectionId === id ? { ...r, collectionId: '' } : r)) })),
    setCollection: (resId, collId) => patch(resId, { collectionId: collId }),

    // Accepts our JSON export ({resources, collections}) or a plain array of resources.
    importJson(text) {
      let parsed
      try { parsed = JSON.parse(text) } catch { throw new Error('This file is not valid JSON.') }
      const list = Array.isArray(parsed) ? parsed : parsed?.resources
      if (!Array.isArray(list)) throw new Error('No resources found in this file.')
      const incoming = list.filter((r) => r && parseUrl(String(r.url || '')) && String(r.title || '').trim())
        .map((r) => makeResource({ ...r, url: normalizeUrl(String(r.url)) }))
      const fresh = incoming.filter((r) => !resources.some((x) => sameUrl(x.url, r.url)))
      const newCols = (parsed.collections || []).filter((c) => c?.id && c?.name && !collections.some((x) => x.id === c.id))
      setData((d) => ({ collections: [...d.collections, ...newCols], resources: [...fresh, ...d.resources] }))
      return { added: fresh.length, skipped: list.length - fresh.length }
    },
    resetDemo() { setData(sampleData()); setToastMsg('Demo data restored') },
    clearAll() { setData({ resources: [], collections: [] }); setToastMsg('All data cleared') },
  }
  return <Ctx.Provider value={actions}>{children}</Ctx.Provider>
}
