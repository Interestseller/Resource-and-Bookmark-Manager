import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import Modal from './Modal'
import TagBadge from './TagBadge'
import { useLibrary } from '../hooks/useLibrary'
import { makeResource } from '../utils/resource'
import { CATEGORIES, TYPES, STATUSES, PRIORITIES, DIFFICULTIES } from '../utils/constants'
import { parseUrl, fetchMetadata } from '../services/metadataService'
import { smartCategorize } from '../services/smartCategorize'

function Field({ id, label, error, children }) { // defined OUTSIDE the form so inputs keep focus
  return (
    <div><label htmlFor={id} className="mb-1 block text-sm font-medium">{label}</label>{children}
      {error && <p role="alert" className="mt-1 text-sm text-red-500">{error}</p>}</div>
  )
}
const Select = ({ id, value, onChange, options }) => <select id={id} className="input" value={value} onChange={onChange}>{options.map((o) => <option key={o}>{o}</option>)}</select>

export default function ResourceForm({ initial, onClose }) {
  const { collections, saveResource, findDuplicate, openResource } = useLibrary()
  const [f, setF] = useState(() => makeResource(initial || {}))
  const [tagText, setTagText] = useState('')
  const [errors, setErrors] = useState({})
  const [suggestion, setSuggestion] = useState(null)
  const [dup, setDup] = useState(null)
  const [busy, setBusy] = useState(false)
  const [note, setNote] = useState('')
  const set = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.value }))

  const addTag = (raw) => {
    const t = raw.trim().replace(/,$/, '').trim()
    if (t) setF((x) => ({ ...x, tags: [...new Set([...x.tags, t])] }))
    setTagText('')
  }
  const onUrlBlur = async () => { // auto-detect title/type from the URL
    if (!f.url.trim() || !parseUrl(f.url)) return
    try {
      const m = await fetchMetadata(f.url)
      setF((x) => ({ ...x, title: x.title || m.title, type: x.type === 'Website' ? m.type : x.type })); setNote('')
    } catch { setNote("Couldn't read details from this link. Fill them in manually.") }
  }
  const smart = async () => {
    setBusy(true)
    try { setSuggestion(await smartCategorize(f)) } catch { setNote('Smart Categorize failed. Choose manually.') }
    setBusy(false)
  }
  const apply = () => { setF((x) => ({ ...x, category: suggestion.category, type: suggestion.type, tags: [...new Set([...x.tags, ...suggestion.tags])] })); setSuggestion(null) }

  const submit = (e, skipDup = false) => {
    e?.preventDefault()
    const err = {}
    if (!parseUrl(f.url)) err.url = 'Please enter a valid URL.'
    if (!f.title.trim()) err.title = 'Title is required.'
    setErrors(err)
    if (Object.keys(err).length) return
    if (!initial && !skipDup) { const d = findDuplicate(f.url); if (d) return setDup(d) }
    const tags = tagText.trim() ? [...f.tags, tagText.trim()] : f.tags
    saveResource({ ...f, title: f.title.trim(), tags })
    onClose()
  }

  return (
    <Modal title={initial ? 'Edit resource' : 'Add resource'} wide onClose={onClose}>
      <form onSubmit={submit} className="grid gap-3 sm:grid-cols-2" noValidate>
        <div className="sm:col-span-2"><Field id="url" label="Resource URL *" error={errors.url}>
          <input id="url" className="input" placeholder="https://github.com/openai" value={f.url} onChange={set('url')} onBlur={onUrlBlur} /></Field></div>
        <div className="sm:col-span-2"><Field id="title" label="Title *" error={errors.title}><input id="title" className="input" value={f.title} onChange={set('title')} /></Field></div>
        {note && <p className="text-sm text-amber-600 sm:col-span-2">{note}</p>}
        {dup && (
          <div role="alert" className="rounded-lg border border-amber-400 bg-amber-50 p-3 text-sm text-amber-900 sm:col-span-2">
            ⚠️ This resource is already saved.
            <div className="mt-2 flex gap-2">
              <button type="button" className="btn-ghost" onClick={() => openResource(dup)}>Open Existing Resource</button>
              <button type="button" className="btn" onClick={() => submit(null, true)}>Save Anyway</button>
            </div>
          </div>
        )}
        <div className="sm:col-span-2"><Field id="description" label="Description"><textarea id="description" rows="2" className="input" value={f.description} onChange={set('description')} /></Field></div>
        <div className="sm:col-span-2">
          <button type="button" className="btn-ghost" onClick={smart} disabled={busy}><Sparkles size={14} /> {busy ? 'Analyzing…' : 'Smart Categorize'}</button>
          {suggestion && (
            <div className="mt-2 rounded-lg bg-indigo-50 p-3 text-sm text-slate-900 dark:bg-indigo-950 dark:text-slate-100">
              <p>Category: <b>{suggestion.category}</b> · Type: <b>{suggestion.type}</b></p>
              <p>Tags: {suggestion.tags.join(', ') || 'none found'}</p>
              <div className="mt-2 flex gap-2"><button type="button" className="btn !py-1" onClick={apply}>Apply</button><button type="button" className="btn-ghost !py-1" onClick={() => setSuggestion(null)}>Dismiss</button></div>
            </div>
          )}
        </div>
        <Field id="category" label="Category"><Select id="category" value={f.category} onChange={set('category')} options={CATEGORIES} /></Field>
        <Field id="type" label="Resource type"><Select id="type" value={f.type} onChange={set('type')} options={TYPES} /></Field>
        <Field id="collectionId" label="Collection">
          <select id="collectionId" className="input" value={f.collectionId} onChange={set('collectionId')}><option value="">None</option>{collections.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></Field>
        <Field id="status" label="Status"><Select id="status" value={f.status} onChange={set('status')} options={STATUSES} /></Field>
        <Field id="priority" label="Priority"><Select id="priority" value={f.priority} onChange={set('priority')} options={PRIORITIES} /></Field>
        <Field id="difficulty" label="Difficulty"><Select id="difficulty" value={f.difficulty} onChange={set('difficulty')} options={DIFFICULTIES} /></Field>
        <div className="sm:col-span-2"><Field id="tags" label="Tags (press Enter or comma)">
          <div className="flex flex-wrap gap-1 pb-1">{f.tags.map((t) => <TagBadge key={t} onClick={() => setF((x) => ({ ...x, tags: x.tags.filter((y) => y !== t) }))}>{t} ✕</TagBadge>)}</div>
          <input id="tags" className="input" value={tagText} onChange={(e) => setTagText(e.target.value)} onKeyDown={(e) => (e.key === 'Enter' || e.key === ',') && (e.preventDefault(), addTag(tagText))} /></Field></div>
        <div className="sm:col-span-2"><Field id="notes" label="Personal notes"><textarea id="notes" rows="2" className="input" value={f.notes} onChange={set('notes')} /></Field></div>
        <div className="flex justify-end gap-2 sm:col-span-2">
          <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button><button className="btn">{initial ? 'Save changes' : 'Save resource'}</button>
        </div>
      </form>
    </Modal>
  )
}
