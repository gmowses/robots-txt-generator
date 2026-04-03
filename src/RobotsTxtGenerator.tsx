import { useState } from 'react'
import { Copy, Sun, Moon, Languages, Bot, Plus, Trash2 } from 'lucide-react'

const translations = {
  en: {
    title: 'robots.txt Generator',
    subtitle: 'Generate robots.txt with a visual builder: user-agents, allow/disallow paths, sitemap URL and crawl delay.',
    addRule: 'Add Rule',
    userAgent: 'User-Agent',
    allow: 'Allow',
    disallow: 'Disallow',
    path: 'Path',
    crawlDelay: 'Crawl Delay (seconds)',
    sitemap: 'Sitemap URL',
    addPath: 'Add Path',
    output: 'Generated robots.txt',
    copy: 'Copy',
    copied: 'Copied!',
    removeRule: 'Remove rule',
    removePath: 'Remove path',
    type: 'Type',
    commonAgents: 'Common User-Agents',
    builtBy: 'Built by',
  },
  pt: {
    title: 'Gerador de robots.txt',
    subtitle: 'Gere robots.txt com um construtor visual: user-agents, caminhos allow/disallow, URL do sitemap e crawl delay.',
    addRule: 'Adicionar Regra',
    userAgent: 'User-Agent',
    allow: 'Permitir',
    disallow: 'Bloquear',
    path: 'Caminho',
    crawlDelay: 'Crawl Delay (segundos)',
    sitemap: 'URL do Sitemap',
    addPath: 'Adicionar Caminho',
    output: 'robots.txt Gerado',
    copy: 'Copiar',
    copied: 'Copiado!',
    removeRule: 'Remover regra',
    removePath: 'Remover caminho',
    type: 'Tipo',
    commonAgents: 'User-Agents Comuns',
    builtBy: 'Criado por',
  },
} as const

type Lang = keyof typeof translations

interface PathEntry { type: 'allow' | 'disallow'; path: string }
interface Rule { id: number; userAgent: string; paths: PathEntry[]; crawlDelay: string }

let nextId = 3

const COMMON_AGENTS = ['*', 'Googlebot', 'Googlebot-Image', 'Bingbot', 'Slurp', 'DuckDuckBot', 'Baiduspider', 'YandexBot', 'facebot', 'Twitterbot']

function generateRobots(rules: Rule[], sitemap: string): string {
  const blocks = rules.map(r => {
    const lines = [`User-agent: ${r.userAgent || '*'}`]
    for (const p of r.paths) {
      lines.push(`${p.type === 'allow' ? 'Allow' : 'Disallow'}: ${p.path || '/'}`)
    }
    if (r.crawlDelay) lines.push(`Crawl-delay: ${r.crawlDelay}`)
    return lines.join('\n')
  })
  if (sitemap) blocks.push(`Sitemap: ${sitemap}`)
  return blocks.join('\n\n')
}

export default function RobotsTxtGenerator() {
  const [lang, setLang] = useState<Lang>(() => navigator.language.startsWith('pt') ? 'pt' : 'en')
  const [dark, setDark] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches)
  const [sitemap, setSitemap] = useState('https://example.com/sitemap.xml')
  const [copied, setCopied] = useState(false)
  const [rules, setRules] = useState<Rule[]>([
    { id: 1, userAgent: '*', paths: [{ type: 'disallow', path: '/admin/' }, { type: 'allow', path: '/' }], crawlDelay: '' },
    { id: 2, userAgent: 'Googlebot', paths: [{ type: 'allow', path: '/' }], crawlDelay: '' },
  ])

  const t = translations[lang]

  const toggleDark = () => {
    setDark(d => {
      document.documentElement.classList.toggle('dark', !d)
      return !d
    })
  }

  const output = generateRobots(rules, sitemap)

  const addRule = () => {
    setRules(r => [...r, { id: nextId++, userAgent: '*', paths: [{ type: 'disallow', path: '' }], crawlDelay: '' }])
  }

  const removeRule = (id: number) => setRules(r => r.filter(rule => rule.id !== id))

  const updateRule = (id: number, field: keyof Omit<Rule, 'id' | 'paths'>, value: string) => {
    setRules(r => r.map(rule => rule.id === id ? { ...rule, [field]: value } : rule))
  }

  const addPath = (id: number) => {
    setRules(r => r.map(rule => rule.id === id ? { ...rule, paths: [...rule.paths, { type: 'disallow', path: '' }] } : rule))
  }

  const removePath = (id: number, idx: number) => {
    setRules(r => r.map(rule => rule.id === id ? { ...rule, paths: rule.paths.filter((_, i) => i !== idx) } : rule))
  }

  const updatePath = (id: number, idx: number, field: keyof PathEntry, value: string) => {
    setRules(r => r.map(rule => rule.id === id ? {
      ...rule,
      paths: rule.paths.map((p, i) => i === idx ? { ...p, [field]: value } : p)
    } : rule))
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 transition-colors">
      <header className="border-b border-zinc-200 dark:border-zinc-800 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <Bot size={18} className="text-white" />
            </div>
            <span className="font-semibold">robots.txt Generator</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setLang(l => l === 'en' ? 'pt' : 'en')} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              <Languages size={14} />
              {lang.toUpperCase()}
            </button>
            <button onClick={toggleDark} className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              {dark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <a href="https://github.com/gmowses/robots-txt-generator" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1 px-6 py-10">
        <div className="max-w-5xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold">{t.title}</h1>
            <p className="mt-2 text-zinc-500 dark:text-zinc-400">{t.subtitle}</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Builder */}
            <div className="space-y-4">
              {/* Sitemap */}
              <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 space-y-3">
                <label className="text-sm font-medium">{t.sitemap}</label>
                <input
                  value={sitemap}
                  onChange={e => setSitemap(e.target.value)}
                  placeholder="https://example.com/sitemap.xml"
                  className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* Rules */}
              {rules.map((rule, ri) => (
                <div key={rule.id} className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-orange-600 dark:text-orange-400">Rule #{ri + 1}</span>
                    <button onClick={() => removeRule(rule.id)} className="p-1 text-zinc-400 hover:text-red-500 transition-colors" title={t.removeRule}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-zinc-500">{t.userAgent}</label>
                    <div className="flex gap-2">
                      <input
                        value={rule.userAgent}
                        onChange={e => updateRule(rule.id, 'userAgent', e.target.value)}
                        className="flex-1 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {COMMON_AGENTS.slice(0, 5).map(a => (
                        <button key={a} onClick={() => updateRule(rule.id, 'userAgent', a)} className="px-2 py-0.5 text-xs rounded bg-zinc-100 dark:bg-zinc-800 hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors">
                          {a}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    {rule.paths.map((p, pi) => (
                      <div key={pi} className="flex gap-2 items-center">
                        <select
                          value={p.type}
                          onChange={e => updatePath(rule.id, pi, 'type', e.target.value)}
                          className="w-28 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                        >
                          <option value="allow">{t.allow}</option>
                          <option value="disallow">{t.disallow}</option>
                        </select>
                        <input
                          value={p.path}
                          onChange={e => updatePath(rule.id, pi, 'path', e.target.value)}
                          placeholder="/"
                          className="flex-1 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 px-3 py-1.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                        <button onClick={() => removePath(rule.id, pi)} className="p-1 text-zinc-400 hover:text-red-500 transition-colors" title={t.removePath}>
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                    <button onClick={() => addPath(rule.id)} className="flex items-center gap-1 text-xs text-orange-500 hover:text-orange-600 transition-colors">
                      <Plus size={12} />
                      {t.addPath}
                    </button>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-zinc-500">{t.crawlDelay}</label>
                    <input
                      type="number"
                      value={rule.crawlDelay}
                      onChange={e => updateRule(rule.id, 'crawlDelay', e.target.value)}
                      placeholder="0"
                      className="w-24 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>
              ))}

              <button
                onClick={addRule}
                className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 px-4 py-3 text-sm font-medium text-zinc-500 hover:border-orange-400 hover:text-orange-500 transition-colors"
              >
                <Plus size={16} />
                {t.addRule}
              </button>
            </div>

            {/* Output */}
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold">{t.output}</h2>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-500 text-white text-xs font-medium hover:bg-orange-600 transition-colors"
                >
                  <Copy size={12} />
                  {copied ? t.copied : t.copy}
                </button>
              </div>
              <pre className="min-h-[400px] rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 px-4 py-3 font-mono text-sm overflow-auto whitespace-pre text-zinc-700 dark:text-zinc-300 select-all">
                {output}
              </pre>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-zinc-200 dark:border-zinc-800 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between text-xs text-zinc-400">
          <span>{t.builtBy} <a href="https://github.com/gmowses" className="text-zinc-600 dark:text-zinc-300 hover:text-orange-500 transition-colors">Gabriel Mowses</a></span>
          <span>MIT License</span>
        </div>
      </footer>
    </div>
  )
}
