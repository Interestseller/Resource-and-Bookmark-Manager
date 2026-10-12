import { useState } from 'react'
import { Maximize2, X } from 'lucide-react'
import { Pie, PieChart, Cell, Bar, BarChart, Line, LineChart, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from 'recharts'
import { COLORS } from '../utils/constants'

function renderChart(kind, data, total) {
  const axis = { tick: { fill: '#94a3b8', fontSize: 12 }, stroke: '#94a3b8' }
  const tip = (v, n) => [kind === 'donut' ? `${v} (${((v / total) * 100).toFixed(1)}%)` : v, n === 'value' ? 'Resources' : n]
  if (kind === 'donut') return (
    <PieChart><Pie data={data} dataKey="value" nameKey="name" innerRadius="45%" outerRadius="80%">
      {data.map((d, i) => <Cell key={d.name} fill={COLORS[i % COLORS.length]} stroke={COLORS[i % COLORS.length]} />)}</Pie><Tooltip formatter={tip} /><Legend /></PieChart>
  )
  if (kind === 'bar') return (
    <BarChart data={data}><CartesianGrid strokeDasharray="3 3" opacity={0.3} /><XAxis dataKey="name" {...axis} interval={0} angle={-25} textAnchor="end" height={70} /><YAxis allowDecimals={false} {...axis} width={30} /><Tooltip formatter={tip} /><Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} /></BarChart>
  )
  return (
    <LineChart data={data}><CartesianGrid strokeDasharray="3 3" opacity={0.3} /><XAxis dataKey="name" {...axis} /><YAxis allowDecimals={false} {...axis} width={30} /><Tooltip formatter={tip} /><Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} /></LineChart>
  )
}

// kind: 'donut' | 'bar' | 'line'. data: [{ name, value }]. Charts re-render whenever data changes.
export default function ResourceChart({ title, kind, data }) {
  const [expanded, setExpanded] = useState(false)
  const total = data.reduce((s, d) => s + d.value, 0)
  return (
    <>
      <div className="card">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="font-semibold">{title}</h2>
          {total > 0 && (
            <button
              aria-label={`Expand ${title}`}
              className="btn-ghost !border-0 !px-1 !py-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              onClick={() => setExpanded(true)}
            >
              <Maximize2 size={15} />
            </button>
          )}
        </div>
        <div className="h-64">
          {total === 0 ? <p className="grid h-full place-items-center text-sm text-slate-500">No data yet.</p> : (
            <ResponsiveContainer>{renderChart(kind, data, total)}</ResponsiveContainer>
          )}
        </div>
      </div>

      {expanded && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onMouseDown={(e) => e.target === e.currentTarget && setExpanded(false)}
        >
          <div className="card flex w-full max-w-3xl flex-col" style={{ maxHeight: '90vh' }}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">{title}</h2>
              <button aria-label="Close" className="btn-ghost !p-1" onClick={() => setExpanded(false)}><X size={16} /></button>
            </div>
            <div style={{ height: '60vh' }}>
              <ResponsiveContainer>{renderChart(kind, data, total)}</ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
