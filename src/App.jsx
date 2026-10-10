import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Resources from './pages/Resources'
import Collections from './pages/Collections'
import Analytics from './pages/Analytics'
import SettingsPage from './pages/SettingsPage'
import Omen from './pages/Omen'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="resources" element={<Resources />} />
        <Route path="favorites" element={<Resources favoritesOnly />} />
        <Route path="collections" element={<Collections />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="omen" element={<Omen />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
