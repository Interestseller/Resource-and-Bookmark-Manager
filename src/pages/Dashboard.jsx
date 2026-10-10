import { Link } from 'react-router-dom'
import StatsCard from '../components/StatsCard'
import ResourceList from '../components/ResourceList'
import EmptyState from '../components/EmptyState'
import { useLibrary } from '../hooks/useLibrary'
import { recommend } from '../utils/stats'

export default function Dashboard() {
  const { resources, collections, showForm, openResource, addCollection } = useLibrary()
  if (resources.length === 0) return <EmptyState title="No resources yet." text="Save your first useful resource and build your personal knowledge library." action="+ Add Your First Resource" onAction={() => showForm()} />

  const count = (s) => resources.filter((r) => r.status === s).length
  const week = resources.filter((r) => Date.now() - new Date(r.createdAt) < 7 * 864e5).length
  const done = Math.round((count('Completed') / resources.length) * 100)
  const recent = [...resources].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 6)
  const viewed = resources.filter((r) => r.lastOpened).sort((a, b) => b.lastOpened.localeCompare(a.lastOpened)).slice(0, 6)
  const picks = recommend(resources)

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <button className="btn" onClick={() => showForm()}>+ Add Resource</button>
        <button className="btn-ghost" onClick={() => { const n = window.prompt('Collection name?'); if (n !== null) addCollection(n) }}>Create Collection</button>
        <Link className="btn-ghost" to="/favorites">⭐ Favorites</Link>
        <Link className="btn-ghost" to="/resources">📚 My Resources</Link>
        <Link className="btn-ghost" to="/analytics">📊 Analytics</Link>
      </div>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        <StatsCard label="Total Resources" value={resources.length} />
        <StatsCard label="Favorites" value={resources.filter((r) => r.favorite).length} />
        <StatsCard label="To Read" value={count('To Read')} hint={`${count('In Progress')} in progress`} />
        <StatsCard label="Completed" value={count('Completed')} hint={`${done}% of library`} />
        <StatsCard label="Collections" value={collections.length} />
        <StatsCard label="Added this week" value={week} />
      </div>
      <section><h2 className="mb-2 font-semibold">Recently Added</h2><ResourceList items={recent} /></section>
      {viewed.length > 0 && (
        <section><h2 className="mb-2 font-semibold">Recently Viewed</h2>
          <div className="card divide-y divide-slate-100 !p-0 dark:divide-slate-800">
            {viewed.map((r) => <button key={r.id} onClick={() => openResource(r)} className="flex w-full justify-between gap-3 p-3 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-800">
              <span className="truncate">{r.title}</span><span className="shrink-0 text-xs text-slate-500">{new Date(r.lastOpened).toLocaleDateString()}</span></button>)}
          </div></section>
      )}
      {picks.length > 0 && <section><h2 className="mb-2 font-semibold">You May Also Like</h2><p className="mb-2 text-sm text-slate-500">Unread resources related to what you save and finish most.</p><ResourceList items={picks} /></section>}
    </>
  )
}
