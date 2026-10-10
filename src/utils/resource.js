import { CATEGORIES, TYPES, STATUSES, PRIORITIES, DIFFICULTIES } from './constants'

export const uid = () => crypto.randomUUID?.() ?? String(Date.now() + Math.random())

// Builds a complete, safe resource object from partial/untrusted input.
export function makeResource(p = {}) {
  const now = new Date().toISOString()
  const pick = (v, list, fallback) => (list.includes(v) ? v : fallback)
  return {
    id: p.id || uid(),
    url: String(p.url || ''),
    title: String(p.title || ''),
    description: String(p.description || ''),
    category: pick(p.category, CATEGORIES, 'Other'),
    type: pick(p.type, TYPES, 'Website'),
    tags: Array.isArray(p.tags) ? [...new Set(p.tags.map((t) => String(t).trim()).filter(Boolean))] : [],
    collectionId: p.collectionId || '',
    notes: String(p.notes || ''),
    difficulty: pick(p.difficulty, DIFFICULTIES, 'Beginner'),
    priority: pick(p.priority, PRIORITIES, 'Medium'),
    status: pick(p.status, STATUSES, 'To Read'),
    favorite: !!p.favorite,
    views: Number(p.views) || 0,
    lastOpened: p.lastOpened || null,
    createdAt: p.createdAt || now,
    updatedAt: p.updatedAt || now,
  }
}
