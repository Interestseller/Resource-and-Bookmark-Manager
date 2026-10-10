import { makeResource } from '../utils/resource'

const daysAgo = (n) => new Date(Date.now() - n * 864e5).toISOString()
// [title, url, category, type, tags, status, priority, favorite, daysAgo, collectionId, description]
const ROWS = [
  ['Python for Everybody', 'https://www.py4e.com/', 'Programming', 'Course', ['Python', 'Beginner'], 'Completed', 'High', true, 52, 'c-python', 'Free beginner-friendly Python course.'],
  ['Python Pandas Tutorial', 'https://www.youtube.com/watch?v=pandas101', 'Data Science', 'YouTube Video', ['Python', 'Pandas'], 'In Progress', 'High', true, 44, 'c-python', 'Important for Data Science.'],
  ['NumPy Quickstart', 'https://numpy.org/doc/stable/user/quickstart.html', 'Data Science', 'Documentation', ['Python', 'NumPy'], 'To Read', 'Medium', false, 40, 'c-python', 'Official NumPy quickstart guide.'],
  ['scikit-learn', 'https://github.com/scikit-learn/scikit-learn', 'AI / ML', 'GitHub Repository', ['Python', 'Machine Learning'], 'To Read', 'Medium', false, 36, '', 'Machine learning library for Python.'],
  ['Machine Learning Crash Course', 'https://developers.google.com/machine-learning/crash-course', 'AI / ML', 'Course', ['Machine Learning', 'Beginner'], 'In Progress', 'High', true, 33, '', 'Google’s fast-paced ML introduction.'],
  ['Attention Is All You Need', 'https://arxiv.org/abs/1706.03762', 'AI / ML', 'Research Paper', ['Transformers', 'Advanced'], 'To Read', 'Low', false, 30, '', 'The original transformer paper.'],
  ['Top 100 DSA Problems', 'https://www.geeksforgeeks.org/top-100-dsa-problems', 'DSA', 'Article', ['DSA', 'Interview'], 'In Progress', 'High', true, 27, 'c-dsa', 'Curated list for placement prep.'],
  ['NeetCode Roadmap', 'https://neetcode.io/roadmap', 'DSA', 'Website', ['DSA', 'LeetCode'], 'In Progress', 'High', false, 24, 'c-dsa', 'Structured DSA learning path.'],
  ['Big-O Cheat Sheet', 'https://www.bigocheatsheet.com/', 'DSA', 'Website', ['DSA', 'Complexity'], 'Completed', 'Medium', false, 21, 'c-dsa', ''],
  ['Striver’s DSA Playlist', 'https://www.youtube.com/@takeUforward', 'DSA', 'YouTube Video', ['DSA', 'Java'], 'Completed', 'High', false, 18, 'c-dsa', ''],
  ['MDN Web Docs: JavaScript', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript', 'Web Development', 'Documentation', ['JavaScript'], 'Completed', 'Medium', true, 16, 'c-web', 'The best JS reference.'],
  ['React Docs', 'https://react.dev/learn', 'Web Development', 'Documentation', ['React', 'JavaScript'], 'In Progress', 'High', false, 12, 'c-web', ''],
  ['Tailwind CSS Docs', 'https://tailwindcss.com/docs', 'Web Development', 'Documentation', ['CSS', 'Tailwind'], 'To Read', 'Low', false, 9, 'c-web', ''],
  ['Operating Systems Notes (Sem 5)', 'https://example.edu/os-notes.pdf', 'College', 'PDF', ['Semester 5', 'OS'], 'To Read', 'Medium', false, 7, '', 'Unit 3 and 4 are important for the exam.'],
  ['Linear Algebra – 3Blue1Brown', 'https://www.youtube.com/playlist?list=essence-of-linear-algebra', 'Mathematics', 'YouTube Video', ['Math', 'Machine Learning'], 'Completed', 'Medium', false, 6, '', ''],
  ['Resume Template for Freshers', 'https://www.overleaf.com/latex/templates/fresher-resume', 'Career', 'Tool', ['Resume', 'Placement'], 'Completed', 'High', false, 4, 'c-place', ''],
  ['System Design Primer', 'https://github.com/donnemartin/system-design-primer', 'Interview Preparation', 'GitHub Repository', ['System Design', 'Interview'], 'To Read', 'High', true, 2, 'c-place', 'Read after finishing DSA.'],
  ['Figma Basics', 'https://www.figma.com/resource-library/', 'Design', 'Tool', ['Design', 'Beginner'], 'Archived', 'Low', false, 1, '', ''],
]
export function sampleData() {
  return {
    collections: [
      { id: 'c-python', name: 'Python Learning' }, { id: 'c-dsa', name: 'DSA Roadmap' },
      { id: 'c-web', name: 'Web Development' }, { id: 'c-place', name: 'Placement Preparation' },
    ],
    resources: ROWS.map(([title, url, category, type, tags, status, priority, favorite, d, collectionId, description], i) =>
      makeResource({ id: 'sample-' + i, title, url, category, type, tags, status, priority, favorite, collectionId, description, createdAt: daysAgo(d), updatedAt: daysAgo(d), views: i % 4 })),
  }
}
