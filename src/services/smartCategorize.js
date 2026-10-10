// Keyword-based "Smart Categorize". It's async so you can later swap the body for an LLM API call.
import { detectType } from './metadataService'

// [category, keywords, tag to add]
const RULES = [
  ['AI / ML', ['machine learning', 'deep learning', 'neural', 'tensorflow', 'pytorch', 'llm', 'gpt', 'ai', 'ml', 'opencv'], 'Machine Learning'],
  ['Data Science', ['pandas', 'numpy', 'data science', 'data analysis', 'visualization', 'kaggle', 'statistics'], 'Data Science'],
  ['Web Development', ['react', 'html', 'css', 'javascript', 'frontend', 'backend', 'node', 'tailwind', 'web'], 'Web Development'],
  ['DSA', ['dsa', 'algorithm', 'algorithms', 'leetcode', 'data structure', 'data structures', 'dynamic programming', 'graph'], 'DSA'],
  ['Interview Preparation', ['interview', 'placement', 'mock'], 'Interview'],
  ['Career', ['career', 'resume', 'job', 'internship', 'roadmap'], 'Career'],
  ['Mathematics', ['math', 'calculus', 'algebra', 'probability'], 'Mathematics'],
  ['College', ['semester', 'syllabus', 'lecture', 'university', 'exam'], 'College'],
  ['Design', ['figma', 'design', 'ux', 'typography'], 'Design'],
  ['Productivity', ['productivity', 'notion', 'habit'], 'Productivity'],
  ['Finance', ['finance', 'stock', 'invest', 'budget'], 'Finance'],
  ['Programming', ['python', 'java', 'git', 'docker', 'sql', 'programming', 'coding', 'tutorial', 'code'], 'Programming'],
]
const KNOWN_TAGS = ['Python', 'Java', 'JavaScript', 'TypeScript', 'React', 'Node', 'SQL', 'Pandas', 'NumPy', 'OpenCV', 'Git', 'Docker', 'CSS', 'HTML', 'LeetCode', 'Tailwind']
const has = (text, w) => new RegExp(`\\b${w}\\b`, 'i').test(text)

export async function smartCategorize({ title = '', url = '', description = '', notes = '' }) {
  const text = [title, url, description, notes].join(' ').toLowerCase()
  let category = 'Other', best = 0, ruleTag = null
  for (const [cat, words, tag] of RULES) {
    const score = words.filter((w) => has(text, w)).length
    if (score > best) { best = score; category = cat; ruleTag = tag }
  }
  let type = detectType(url)
  if (type === 'Website') {
    if (/\b(course|tutorial)\b/.test(text)) type = 'Course'
    else if (/\b(documentation|docs)\b/.test(text)) type = 'Documentation'
    else if (/\b(paper|arxiv)\b/.test(text)) type = 'Research Paper'
    else if (/\b(book|ebook)\b/.test(text)) type = 'Book'
    else if (/\b(top|guide|blog|article|problems)\b/.test(text)) type = 'Article'
  }
  const tags = KNOWN_TAGS.filter((t) => has(text, t.toLowerCase()))
  if (ruleTag) tags.push(ruleTag)
  if (/\b(beginner|intro|introduction|basics)\b/.test(text)) tags.push('Beginner')
  if (/\b(advanced)\b/.test(text)) tags.push('Advanced')
  return { category, type, tags: [...new Set(tags)].slice(0, 6) }
}
