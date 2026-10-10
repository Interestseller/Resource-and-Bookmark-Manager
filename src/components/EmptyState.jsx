export default function EmptyState({ title, text, action, onAction }) {
  return (
    <div className="card py-10 text-center">
      <p className="text-lg font-semibold">{title}</p>
      <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">{text}</p>
      {action && <button className="btn mt-4" onClick={onAction}>{action}</button>}
    </div>
  )
}
