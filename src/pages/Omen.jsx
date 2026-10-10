import { useState, useRef, useEffect } from 'react'
import { Send, User, Loader2, ExternalLink } from 'lucide-react'

// Gemini API
const GEMINI_KEY = 'AQ.Ab8RN6LFDK4Nz_C5-zwZGz6BPKyKHA1ka0XKtnX-lXVCuGYNqg'
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${GEMINI_KEY}`
const SYSTEM_PROMPT = 'You are OMEN, a helpful AI assistant embedded in a bookmark & resource manager app. Help users organize their resources, suggest tags, summarize links, and answer any general questions.'

// Render markdown: bold, italic, [text](url) links, and bare URLs → React nodes
function renderText(text) {
  // Split on markdown links [label](url), bare URLs, **bold**, *italic*
  const pattern = /(\[([^\]]+)\]\((https?:\/\/[^)]+)\))|(https?:\/\/[^\s,)"'<>]+)|(\*\*(.+?)\*\*)|(\*(.+?)\*)/g
  const nodes = []
  let last = 0, match, key = 0
  while ((match = pattern.exec(text)) !== null) {
    if (match.index > last) nodes.push(text.slice(last, match.index))
    if (match[1]) {
      // [label](url)
      nodes.push(<a key={key++} href={match[3]} target="_blank" rel="noopener noreferrer" className="underline text-indigo-400 hover:text-indigo-300 break-all">{match[2]}</a>)
    } else if (match[4]) {
      // bare URL
      nodes.push(<a key={key++} href={match[4]} target="_blank" rel="noopener noreferrer" className="underline text-indigo-400 hover:text-indigo-300 break-all">{match[4]}</a>)
    } else if (match[5]) {
      // **bold**
      nodes.push(<strong key={key++}>{match[6]}</strong>)
    } else if (match[7]) {
      // *italic*
      nodes.push(<em key={key++}>{match[8]}</em>)
    }
    last = match.index + match[0].length
  }
  if (last < text.length) nodes.push(text.slice(last))
  return nodes
}

export default function Omen() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I'm Omen, your AI assistant with live Google Search. Ask me anything!" }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function send() {
    const text = input.trim()
    if (!text || loading) return

    const updatedMessages = [...messages, { role: 'user', content: text }]
    setMessages(updatedMessages)
    setInput('')
    setLoading(true)

    try {
      const history = updatedMessages.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }))

      const res = await fetch(GEMINI_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: history,
        }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err?.error?.message || `API error ${res.status}`)
      }

      const data = await res.json()
      const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '(no response)'

      setMessages(prev => [...prev, { role: 'assistant', content: replyText, sources: [] }])
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: `⚠️ Error: ${e.message}`, sources: [] }])
    } finally {
      setLoading(false)
    }
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-10 w-10 shrink-0 overflow-hidden rounded-full shadow">
          <img src="/omen-pfp.png" alt="OMEN" className="h-full w-full object-cover" />
        </div>
        <div>
          <h1 className="text-xl font-bold leading-none">OMEN</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">AI Assistant · powered by Gemini</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        {messages.map((m, i) => (
          <div key={i} className={`flex items-start gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white shadow overflow-hidden ${m.role === 'user' ? 'bg-emerald-500' : ''}`}>
              {m.role === 'user' ? <User size={15} /> : <img src="/omen-pfp.png" alt="OMEN" className="h-full w-full object-cover" />}
            </div>
            <div className={`text-sm leading-relaxed ${m.role === 'user' ? 'max-w-[80%] rounded-2xl rounded-tr-sm bg-emerald-500 px-4 py-2.5 text-white' : 'w-full max-w-[90%]'}`}>
              {m.role === 'user' ? (
                m.content
              ) : (
                <div className="space-y-3">
                  {/* Chat bubble */}
                  <div className="rounded-2xl rounded-tl-sm bg-slate-100 px-4 py-3 text-slate-800 whitespace-pre-wrap dark:bg-slate-800 dark:text-slate-100">
                    {renderText(m.content)}
                  </div>
                  {/* Google Search sources */}
                  {m.sources && m.sources.length > 0 && (
                    <div className="space-y-1.5">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Sources</p>
                      {m.sources.map((s, j) => (
                        <a key={j} href={s.url} target="_blank" rel="noreferrer"
                          className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs transition hover:border-indigo-300 hover:bg-indigo-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-indigo-600">
                          <span className="flex-1 truncate font-medium text-indigo-600 dark:text-indigo-400">{s.title || s.url}</span>
                          <ExternalLink size={11} className="shrink-0 opacity-50" />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 overflow-hidden rounded-full shadow">
              <img src="/omen-pfp.png" alt="OMEN" className="h-full w-full object-cover" />
            </div>
            <div className="rounded-2xl rounded-tl-sm bg-slate-100 px-4 py-3 dark:bg-slate-800">
              <Loader2 size={16} className="animate-spin text-indigo-500" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="mt-3 flex items-end gap-2">
        <textarea
          rows={1}
          className="input flex-1 resize-none leading-relaxed"
          placeholder="Ask OMEN anything…"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
        />
        <button
          className="btn h-10 w-10 shrink-0 !px-0 flex items-center justify-center"
          onClick={send}
          disabled={loading || !input.trim()}
          aria-label="Send"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  )
}
