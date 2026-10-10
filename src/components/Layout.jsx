import { useEffect, useState } from 'react'
import { NavLink, Outlet, useNavigate, useSearchParams } from 'react-router-dom'
import { LayoutDashboard, Library, Star, Folder, BarChart3, Settings, Search, Plus, Sun, Moon, Bot } from 'lucide-react'
import ResourceForm from './ResourceForm'
import { useLibrary } from '../hooks/useLibrary'
import { loadTheme, saveTheme } from '../utils/storage'

const NAV = [['/', 'Dashboard', LayoutDashboard], ['/resources', 'My Resources', Library], ['/favorites', 'Favorites', Star],
  ['/collections', 'Collections', Folder], ['/analytics', 'Analytics', BarChart3], ['/omen', 'Omen', Bot], ['/settings', 'Settings', Settings]]

export default function Layout() {
  const { form, showForm, closeForm, toastMsg } = useLibrary()
  const [dark, setDark] = useState(loadTheme)
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const q = params.get('q') || ''
  useEffect(() => { document.documentElement.classList.toggle('dark', dark); saveTheme(dark) }, [dark])

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 md:flex">
      <nav aria-label="Main" className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 md:static md:h-screen md:w-56 md:shrink-0 md:border-r md:border-t-0 md:p-4">
        <p className="hidden px-2 pb-4 text-lg font-bold text-indigo-600 md:block">📚 Resource Manager</p>
        <ul className="flex justify-around md:flex-col md:justify-start md:gap-1">
          {NAV.map(([to, label, Icon]) => (
            <li key={to}><NavLink to={to} end={to === '/'} className={({ isActive }) => `flex flex-col items-center gap-0.5 p-2 text-[11px] md:flex-row md:gap-2 md:rounded-lg md:px-3 md:text-sm ${isActive ? 'text-indigo-600 md:bg-indigo-600 md:text-white' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
              <Icon size={18} /><span>{label}</span></NavLink></li>
          ))}
        </ul>
      </nav>
      <div className="flex-1 pb-20 md:pb-0">
        <header className="sticky top-0 z-30 flex items-center gap-2 border-b border-slate-200 bg-white/90 p-3 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
          <div className="relative flex-1"><Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
            <input aria-label="Search resources" type="search" placeholder="Search title, tags, notes, URL…" className="input !pl-9" value={q}
              onChange={(e) => navigate(e.target.value ? `/resources?q=${encodeURIComponent(e.target.value)}` : '/resources', { replace: true })} /></div>
          <button className="btn-ghost" aria-label="Toggle theme" onClick={() => setDark(!dark)}>{dark ? <Sun size={16} /> : <Moon size={16} />}</button>
          <button className="btn" onClick={() => showForm()}><Plus size={16} /> <span className="hidden sm:inline">Add Resource</span></button>
        </header>
        <main className="mx-auto max-w-6xl space-y-4 p-4 md:p-6"><Outlet /></main>
      </div>
      {form && <ResourceForm initial={form.initial} onClose={closeForm} />}
      {toastMsg && <div role="status" className="fixed bottom-24 right-4 z-50 rounded-lg bg-slate-900 px-4 py-2 text-sm text-white shadow-lg md:bottom-6">{toastMsg}</div>}
    </div>
  )
}
