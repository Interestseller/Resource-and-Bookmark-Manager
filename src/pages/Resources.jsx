import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { LayoutGrid, List } from 'lucide-react'
import ResourceList from '../components/ResourceList'
import EmptyState from '../components/EmptyState'
import { useLibrary } from '../hooks/useLibrary'
import { CATEGORIES, TYPES, STATUSES, PRIORITIES } from '../utils/constants'

const PRIORITY_RANK = { High: 3, Medium: 2, Low: 1 }
const SORTS = {
  recent: ['Recently Added', (a, b) => b.createdAt.localeCompare(a.createdAt)],
  oldest: ['Oldest Added', (a, b) => a.createdAt.localeCompare(b.createdAt)],
  alpha: ['Alphabetical', (a, b) => a.title.localeCompare(b.title)],
  updated: ['Recently Updated', (a, b) => b.updatedAt.localeCompare(a.updatedAt)],
  priority: ['Priority', (a, b) => PRIORITY_RANK[b.priority] - PRIORITY_RANK[a.priority]],
  views: ['Most Viewed', (a, b) => b.views - a.views],
  favorites: ['Favorites first', (a, b) => Number(b.favorite) - Number(a.favorite)],
}
const NONE = { category: '', type: '', status: '', priority: '', tag: '', favorite: false }

export default function Resources({ favoritesOnly = false }) {
  const { resources, showForm } = useLibrary()
  const [params] = useSearchParams()
  const q = (params.get('q') || '').trim().toLowerCase()
  const [f, setF] = useState(NONE)
  const [sort, setSort] = useState('recent')
  const [view, setView] = useState('grid')
  const set = (k) => (e) => setF({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value })
  const allTags = [...new Set(resources.flatMap((r) => r.tags))].sort()

  const shown = resources
    .filter((r) => !favoritesOnly || r.favorite)
    .filter((r) => { // every search word must appear somewhere
      const hay = [r.title, r.url, r.description, r.category, r.type, r.notes, ...r.tags].join(' ').toLowerCase()
      return q.split(/\s+/).every((w) => hay.includes(w))
    })
    .filter((r) => (!f.category || r.category === f.category) && (!f.type || r.type === f.type) && (!f.status || r.status === f.status)
      && (!f.priority || r.priority === f.priority) && (!f.tag || r.tags.includes(f.tag)) && (!f.favorite || r.favorite))
    .sort(SORTS[sort][1])

  const Sel = ({ k, label, options }) => <select aria-label={label} className="input" value={f[k]} onChange={set(k)}><option value="">{label}</option>{options.map((o) => <option key={o}>{o}</option>)}</select>
  const filtered = Object.values(f).some(Boolean) || q

  return (
    <>
      <div className="flex items-center justify-between"><h1 className="text-xl font-bold">{favoritesOnly ? 'Favorites' : 'My Resources'} <span className="text-sm font-normal text-slate-500">({shown.length})</span></h1>
        <div className="flex gap-1"><button aria-label="Grid view" className={`btn-ghost !p-2 ${view === 'grid' ? 'bg-slate-200 dark:bg-slate-700' : ''}`} onClick={() => setView('grid')}><LayoutGrid size={16} /></button>
          <button aria-label="List view" className={`btn-ghost !p-2 ${view === 'list' ? 'bg-slate-200 dark:bg-slate-700' : ''}`} onClick={() => setView('list')}><List size={16} /></button></div></div>
      <div className="card grid grid-cols-2 gap-2 md:grid-cols-4">
        <Sel k="category" label="All categories" options={CATEGORIES} /><Sel k="type" label="All types" options={TYPES} />
        <Sel k="status" label="All statuses" options={STATUSES} /><Sel k="priority" label="All priorities" options={PRIORITIES} />
        <Sel k="tag" label="All tags" options={allTags} />
        <select aria-label="Sort" className="input" value={sort} onChange={(e) => setSort(e.target.value)}>{Object.entries(SORTS).map(([k, [l]]) => <option key={k} value={k}>{l}</option>)}</select>
        {!favoritesOnly && <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={f.favorite} onChange={set('favorite')} /> Favorites only</label>}
        <button className="btn-ghost" onClick={() => setF(NONE)}>Clear Filters</button>
      </div>
      {shown.length > 0 ? <ResourceList items={shown} view={view} />
        : resources.length === 0 ? <EmptyState title="No resources yet." text="Save your first useful resource and build your personal knowledge library." action="+ Add Your First Resource" onAction={() => showForm()} />
        : favoritesOnly && !filtered ? <EmptyState title="No favorites yet." text="Tap the star on any resource to keep it here." />
        : <EmptyState title="No matching resources" text="Try a different search or clear your filters." />}
    </>
  )
}
