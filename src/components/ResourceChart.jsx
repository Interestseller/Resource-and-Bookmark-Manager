import { Pie, PieChart, Cell, Bar, BarChart, Line, LineChart, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from 'recharts'
import { COLORS } from '../utils/constants'

// kind: 'donut' | 'bar' | 'line'. data: [{ name, value }]. Charts re-render whenever data changes.
export default function ResourceChart({ title, kind, data }) {
  const total = data.reduce((s, d) => s + d.value, 0)
  const axis = { tick: { fill: '#94a3b8', fontSize: 12 }, stroke: '#94a3b8' }
  const tip = (v, n) => [kind === 'donut' ? `${v} (${((v / total) * 100).toFixed(1)}%)` : v, n === 'value' ? 'Resources' : n]
  return (
    <div className="card">
      <h2 className="mb-2 font-semibold">{title}</h2>
      <div className="h-64">
        {total === 0 ? <p className="grid h-full place-items-center text-sm text-slate-500">No data yet.</p> : (
          <ResponsiveContainer>
            {kind === 'donut' ? (
              <PieChart><Pie data={data} dataKey="value" nameKey="name" innerRadius="45%" outerRadius="80%">
                {data.map((d, i) => <Cell key={d.name} fill={COLORS[i % COLORS.length]} stroke={COLORS[i % COLORS.length]} />)}</Pie><Tooltip formatter={tip} /><Legend /></PieChart>
            ) : kind === 'bar' ? (
              <BarChart data={data}><CartesianGrid strokeDasharray="3 3" opacity={0.3} /><XAxis dataKey="name" {...axis} interval={0} angle={-25} textAnchor="end" height={70} /><YAxis allowDecimals={false} {...axis} width={30} /><Tooltip formatter={tip} /><Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} /></BarChart>
            ) : (
              <LineChart data={data}><CartesianGrid strokeDasharray="3 3" opacity={0.3} /><XAxis dataKey="name" {...axis} /><YAxis allowDecimals={false} {...axis} width={30} /><Tooltip formatter={tip} /><Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} /></LineChart>
            )}
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
