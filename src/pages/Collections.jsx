import { useState } from 'react'
import { Trash2, Pencil } from 'lucide-react'
import EmptyState from '../components/EmptyState'
import ConfirmDialog from '../components/ConfirmDialog'
import { useLibrary } from '../hooks/useLibrary'
import { collectionStats } from '../utils/stats'

export default function Collections() {
  const { resources, collections, addCollection, renameCollection, deleteCollection, setCollection, openResource } = useLibrary()
  const [name, setName] = useState('')
  const [openId, setOpenId] = useState(null)
  const [toDelete, setToDelete] = useState(null)
  const open = collections.find((c) => c.id === openId)
  const items = open ? resources.filter((r) => r.collectionId === open.id) : []
  const available = open ? resources.filter((r) => r.collectionId !== open.id) : []

  return (
    <>
      <h1 className="text-xl font-bold">Collections</h1>
      <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); addCollection(name); setName('') }}>
        <input aria-label="New collection name" className="input" placeholder="e.g. Semester 5" value={name} onChange={(e) => setName(e.target.value)} /><button className="btn">Create</button>
      </form>
      {collections.length === 0 ? <EmptyState title="No collections yet." text="Group related resources, like “Semester 5” or “Project Ideas”." /> : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((c) => { const s = collectionStats(resources, c.id); return (
            <div key={c.id} className={`card ${openId === c.id ? 'ring-2 ring-indigo-500' : ''}`}>
              <button className="text-left font-semibold hover:underline" onClick={() => setOpenId(openId === c.id ? null : c.id)}>{c.name}</button>
              <p className="text-sm text-slate-500">{s.total} resources</p>
              <p className="text-xs">🟢 {s.completed} completed · 🔵 {s.inProgress} in progress · 🟡 {s.toRead} to read</p>
              <div className="mt-2 flex gap-1">
                <button aria-label="Rename" className="btn-ghost !p-1.5" onClick={() => { const n = window.prompt('Rename collection', c.name); if (n) renameCollection(c.id, n) }}><Pencil size={14} /></button>
                <button aria-label="Delete" className="btn-ghost !p-1.5" onClick={() => setToDelete(c)}><Trash2 size={14} /></button>
              </div>
            </div>) })}
        </div>
      )}
      {open && (
        <section className="card space-y-3">
          <h2 className="font-semibold">{open.name}</h2>
          {items.length === 0 ? <p className="text-sm text-slate-500">This collection is empty. Add a resource below.</p> : (
            <ul className="divide-y divide-slate-100 dark:divide-slate-800">{items.map((r) => (
              <li key={r.id} className="flex items-center justify-between gap-2 py-2 text-sm">
                <button className="truncate text-left hover:underline" onClick={() => openResource(r)}>{r.title}</button>
                <button className="btn-ghost !py-1 text-xs" onClick={() => setCollection(r.id, '')}>Remove</button></li>))}</ul>)}
          {available.length > 0 && <select aria-label="Add a resource" className="input" value="" onChange={(e) => e.target.value && setCollection(e.target.value, open.id)}>
            <option value="">+ Add a resource…</option>{available.map((r) => <option key={r.id} value={r.id}>{r.title}</option>)}</select>}
        </section>
      )}
      {toDelete && <ConfirmDialog message={`Delete collection “${toDelete.name}”? Its resources stay in your library.`} onCancel={() => setToDelete(null)}
        onConfirm={() => { deleteCollection(toDelete.id); if (openId === toDelete.id) setOpenId(null); setToDelete(null) }} />}
    </>
  )
}
