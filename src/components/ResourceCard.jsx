import { useState } from 'react'
import { Star, ExternalLink, Pencil, Trash2, Globe } from 'lucide-react'
import TagBadge from './TagBadge'
import { useLibrary } from '../hooks/useLibrary'
import { domainOf, faviconOf } from '../services/metadataService'
import { STATUS_ICON } from '../utils/constants'

export default function ResourceCard({ r, view, onDetails, onDelete }) {
  const { toggleFavorite, cycleStatus, openResource, showForm } = useLibrary()
  const [iconOk, setIconOk] = useState(true)
  return (
    <article className={`card flex gap-3 ${view === 'list' ? 'flex-col sm:flex-row sm:items-center' : 'flex-col'}`}>
      <div className="flex min-w-0 flex-1 gap-3">
        {iconOk
          ? <img src={faviconOf(r.url)} alt="" width="32" height="32" className="h-8 w-8 shrink-0 rounded" onError={() => setIconOk(false)} />
          : <div className="grid h-8 w-8 shrink-0 place-items-center rounded bg-slate-200 dark:bg-slate-700"><Globe size={16} /></div>}
        <div className="min-w-0">
          <button className="block max-w-full truncate text-left font-semibold hover:underline" onClick={() => onDetails(r)}>{r.title}</button>
          <p className="truncate text-xs text-slate-500">{domainOf(r.url)} · {r.type} · {new Date(r.createdAt).toLocaleDateString()}</p>
          {r.description && <p className="mt-1 line-clamp-2 text-sm text-slate-600 dark:text-slate-300">{r.description}</p>}
          <div className="mt-2 flex flex-wrap gap-1">
            <TagBadge tone="cat">{r.category}</TagBadge>
            {r.tags.slice(0, 4).map((t) => <TagBadge key={t}>{t}</TagBadge>)}
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        <button className="btn-ghost !px-2 !py-1 text-xs" title="Click to change status" onClick={() => cycleStatus(r)}>{STATUS_ICON[r.status]} {r.status}</button>
        <span className="chip bg-slate-100 dark:bg-slate-800" title="Priority">{r.priority}</span>
        <button aria-label={r.favorite ? 'Remove favorite' : 'Add favorite'} title="Favorite" className="btn-ghost !p-1.5" onClick={() => toggleFavorite(r)}>
          <Star size={14} className={r.favorite ? 'fill-amber-400 text-amber-400' : ''} /></button>
        <button aria-label="Open resource" title="Open resource" className="btn-ghost !p-1.5" onClick={() => openResource(r)}><ExternalLink size={14} /></button>
        <button aria-label="Edit" title="Edit" className="btn-ghost !p-1.5" onClick={() => showForm(r)}><Pencil size={14} /></button>
        <button aria-label="Delete" title="Delete" className="btn-ghost !p-1.5" onClick={() => onDelete(r)}><Trash2 size={14} /></button>
      </div>
    </article>
  )
}
