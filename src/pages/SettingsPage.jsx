import { useRef, useState } from 'react'
import ConfirmDialog from '../components/ConfirmDialog'
import { useLibrary } from '../hooks/useLibrary'

function download(name, text, type) {
  const url = URL.createObjectURL(new Blob([text], { type }))
  const a = Object.assign(document.createElement('a'), { href: url, download: name })
  a.click(); URL.revokeObjectURL(url)
}
const csvCell = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`

export default function SettingsPage() {
  const { resources, collections, importJson, resetDemo, clearAll, toast } = useLibrary()
  const fileRef = useRef(null)
  const [error, setError] = useState('')
  const [confirmClear, setConfirmClear] = useState(false)

  const exportCsv = () => {
    const cols = ['title', 'url', 'category', 'type', 'tags', 'status', 'priority', 'favorite', 'notes', 'createdAt']
    const rows = resources.map((r) => cols.map((c) => csvCell(c === 'tags' ? r.tags.join('; ') : r[c])).join(','))
    download('resources.csv', [cols.join(','), ...rows].join('\n'), 'text/csv')
  }
  const onFile = async (e) => {
    const file = e.target.files?.[0]; e.target.value = ''
    if (!file) return
    setError('')
    try {
      const { added, skipped } = importJson(await file.text())
      toast(`Imported ${added} resources (${skipped} skipped)`)
    } catch (err) { setError(err.message || 'Import failed.') }
  }
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Settings</h1>
      <div className="card space-y-3">
        <h2 className="font-semibold">Export / Import</h2>
        <div className="flex flex-wrap gap-2">
          <button className="btn" onClick={() => download('resources.json', JSON.stringify({ resources, collections }, null, 2), 'application/json')}>Export JSON</button>
          <button className="btn-ghost" onClick={exportCsv}>Export CSV</button>
          <button className="btn-ghost" onClick={() => fileRef.current?.click()}>Import JSON</button>
          <input ref={fileRef} type="file" accept="application/json,.json" className="hidden" onChange={onFile} />
        </div>
        {error && <p role="alert" className="text-sm text-red-500">{error}</p>}
        <p className="text-xs text-slate-500">Imports skip resources whose URL is already saved. CSV import is not supported yet.</p>
      </div>
      <div className="card space-y-3">
        <h2 className="font-semibold">Data</h2>
        <p className="text-sm text-slate-500">Everything is stored only in this browser (localStorage).</p>
        <div className="flex gap-2"><button className="btn-ghost" onClick={resetDemo}>Reset to demo data</button><button className="btn !bg-red-600" onClick={() => setConfirmClear(true)}>Clear all data</button></div>
      </div>
      {confirmClear && <ConfirmDialog message="Delete ALL resources and collections?" onCancel={() => setConfirmClear(false)} onConfirm={() => { clearAll(); setConfirmClear(false) }} />}
    </div>
  )
}
