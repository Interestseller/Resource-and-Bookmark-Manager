// Pure helper functions used by the dashboard, analytics and recommendations.
export function countBy(list, fn) {
  const o = {}
  list.forEach((x) => { const k = fn(x); o[k] = (o[k] || 0) + 1 })
  return Object.entries(o).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value)
}
export function weeklyAdded(list, weeks = 8) {
  const W = 7 * 864e5, now = Date.now()
  const arr = Array.from({ length: weeks }, (_, i) => ({ name: i === weeks - 1 ? 'This week' : `${weeks - 1 - i}w ago`, value: 0 }))
  list.forEach((r) => {
    const i = weeks - 1 - Math.floor((now - new Date(r.createdAt)) / W)
    if (i >= 0 && i < weeks) arr[i].value++
  })
  return arr
}
export function collectionStats(resources, id) {
  const items = resources.filter((r) => r.collectionId === id)
  const n = (s) => items.filter((r) => r.status === s).length
  return { total: items.length, completed: n('Completed'), inProgress: n('In Progress'), toRead: n('To Read') }
}
// "You May Also Like": unread resources that share tags/categories with what you engage with most.
export function recommend(resources, limit = 4) {
  const weight = {}
  resources.filter((r) => r.favorite || r.status === 'Completed' || r.status === 'In Progress').forEach((r) => {
    ;[...r.tags, r.category].forEach((k) => (weight[k] = (weight[k] || 0) + 1))
  })
  return resources
    .filter((r) => r.status === 'To Read' && !r.favorite)
    .map((r) => ({ r, score: [...r.tags, r.category].reduce((s, k) => s + (weight[k] || 0), 0) }))
    .filter((x) => x.score > 0).sort((a, b) => b.score - a.score).slice(0, limit).map((x) => x.r)
}
