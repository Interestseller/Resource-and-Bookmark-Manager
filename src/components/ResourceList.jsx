import { useState } from 'react'
import ResourceCard from './ResourceCard'
import ConfirmDialog from './ConfirmDialog'
import Modal from './Modal'
import TagBadge from './TagBadge'
import { useLibrary } from '../hooks/useLibrary'
import { STATUS_ICON } from '../utils/constants'

// Renders cards + the details popup + delete confirmation. Used by several pages.
export default function ResourceList({ items, view = 'grid' }) {
  const { resources, collections, deleteResource, showForm, openResource, toggleFavorite, updateResource } = useLibrary()
  const [detailId, setDetailId] = useState(null)
  const [toDelete, setToDelete] = useState(null)
  const detail = resources.find((r) => r.id === detailId) // look up live so edits show instantly

  const Row = ({ k, v }) => <div className="flex justify-between gap-4 border-b border-slate-100 py-1.5 text-sm dark:border-slate-800"><span className="text-slate-500">{k}</span><span className="text-right">{v}</span></div>
  return (
    <>
      <div className={view === 'list' ? 'space-y-3' : 'grid gap-3 sm:grid-cols-2 xl:grid-cols-3'}>
        {items.map((r) => <ResourceCard key={r.id} r={r} view={view} onDetails={(x) => setDetailId(x.id)} onDelete={setToDelete} />)}
      </div>
      {detail && (
        <Modal title={detail.title} wide onClose={() => setDetailId(null)}>
          <a href={detail.url} target="_blank" rel="noopener noreferrer" className="break-all text-sm text-indigo-600 underline">{detail.url}</a>
          {detail.description && <p className="my-3 text-sm">{detail.description}</p>}
          <Row k="Category" v={detail.category} /><Row k="Type" v={detail.type} />
          <Row k="Collection" v={collections.find((c) => c.id === detail.collectionId)?.name || '—'} />
          <Row k="Status" v={`${STATUS_ICON[detail.status]} ${detail.status}`} /><Row k="Priority" v={detail.priority} />
          <Row k="Difficulty" v={detail.difficulty} /><Row k="Added" v={new Date(detail.createdAt).toLocaleDateString()} />
          <Row k="Opened" v={`${detail.views} times`} />
          <div className="my-3 flex flex-wrap gap-1">{detail.tags.map((t) => <TagBadge key={t}>{t}</TagBadge>)}</div>
          <label htmlFor="notes" className="text-sm font-medium">Personal notes</label>
          <textarea id="notes" rows="3" className="input mt-1" defaultValue={detail.notes} placeholder="Add a note…" onBlur={(e) => e.target.value !== detail.notes && updateResource(detail.id, { notes: e.target.value })} />
          <div className="mt-4 flex flex-wrap gap-2">
            <button className="btn" onClick={() => openResource(detail)}>Open Resource</button>
            <button className="btn-ghost" onClick={() => toggleFavorite(detail)}>{detail.favorite ? '★ Unfavorite' : '☆ Favorite'}</button>
            {detail.status !== 'Completed' && <button className="btn-ghost" onClick={() => updateResource(detail.id, { status: 'Completed' })}>Mark as Completed</button>}
            <button className="btn-ghost" onClick={() => { setDetailId(null); showForm(detail) }}>Edit</button>
            <button className="btn-ghost text-red-600" onClick={() => setToDelete(detail)}>Delete</button>
          </div>
        </Modal>
      )}
      {toDelete && <ConfirmDialog message={`Delete “${toDelete.title}”? This can't be undone.`} onCancel={() => setToDelete(null)}
        onConfirm={() => { deleteResource(toDelete.id); setToDelete(null); setDetailId(null) }} />}
    </>
  )
}
