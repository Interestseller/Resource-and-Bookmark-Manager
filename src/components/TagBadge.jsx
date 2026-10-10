export default function TagBadge({ children, tone, onClick }) {
  const color = tone === 'cat' ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
  const Tag = onClick ? 'button' : 'span'
  return <Tag onClick={onClick} className={`chip ${color}`}>{children}</Tag>
}
