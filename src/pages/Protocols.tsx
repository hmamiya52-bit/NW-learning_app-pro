import { useState } from 'react'
import { protocols, protocolCategories } from '../data/protocols'

export default function Protocols() {
  const [selectedCategory, setSelectedCategory] = useState<string>('すべて')
  const [search, setSearch] = useState('')

  const filtered = protocols.filter((p) => {
    const matchCat = selectedCategory === 'すべて' || p.category === selectedCategory
    const q = search.toLowerCase()
    const matchSearch =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      (p.port ?? '').toLowerCase().includes(q)
    return matchCat && matchSearch
  })

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-2xl mx-auto px-4 py-4 pb-12">
        {/* ページタイトル */}
        <h1 className="text-lg font-black text-slate-800 mb-4">プロトコル一覧</h1>
        {/* 検索 */}
        <div className="relative mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            type="text"
            aria-label="プロトコルを検索"
            placeholder="プロトコル名・ポート番号で絞り込み"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* カテゴリタブ（横スクロール可） */}
        <div className="relative mb-4">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none" role="tablist" aria-label="カテゴリで絞り込み">
          {['すべて', ...protocolCategories].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`flex-shrink-0 text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                selectedCategory === cat
                  ? 'bg-blue-900 text-white border-blue-900'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-blue-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        {/* 右端フェードでスクロール可能であることを示す */}
        <div className="pointer-events-none absolute right-0 top-0 bottom-2 w-8 bg-gradient-to-l from-slate-50 to-transparent" aria-hidden="true" />
        </div>

        {/* 件数 */}
        <p className="text-xs text-slate-400 mb-3">{filtered.length} 件</p>

        {/* プロトコルカード */}
        <div className="space-y-2">
          {filtered.map((p) => (
            <div key={p.name} className="bg-white rounded-xl border border-slate-200 px-4 py-3 shadow-sm">
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-blue-900 text-sm">{p.name}</span>
                  <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{p.layer}</span>
                  {p.transport && (
                    <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">over {p.transport}</span>
                  )}
                </div>
                {p.port && (
                  <span className="flex-shrink-0 text-xs font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded-lg">
                    {p.port}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{p.description}</p>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-12 text-slate-400 text-sm">
              該当するプロトコルが見つかりません
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
