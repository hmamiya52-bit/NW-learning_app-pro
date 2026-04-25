import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { categories } from '../data/categories'
import { NOTE_CATEGORY_IDS, NOTE_SECTION_INDEX } from './NoteDetail'

const NOTE_AVAILABLE = new Set(NOTE_CATEGORY_IDS)

// Category icon colors for visual variety
const CARD_COLORS: string[] = [
  'bg-blue-50 text-blue-600',
  'bg-emerald-50 text-emerald-600',
  'bg-amber-50 text-amber-600',
  'bg-purple-50 text-purple-600',
  'bg-red-50 text-red-600',
  'bg-teal-50 text-teal-600',
  'bg-orange-50 text-orange-600',
  'bg-indigo-50 text-indigo-600',
  'bg-pink-50 text-pink-600',
]

function BookIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className ?? 'w-6 h-6'} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  )
}

function ArrowRightIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 103.5 9.5a7.5 7.5 0 0013.15 7.15z" />
    </svg>
  )
}

// マッチした部分をハイライト表示
function highlight(text: string, query: string) {
  if (!query) return text
  const idx = text.toLowerCase().indexOf(query.toLowerCase())
  if (idx === -1) return text
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-yellow-200 text-slate-900 px-0.5 rounded">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  )
}

export default function Notes() {
  const [query, setQuery] = useState('')
  const trimmed = query.trim()

  // 表示用のカテゴリ一覧（ノート未収録は除外）
  const availableCategories = useMemo(
    () => categories.filter((cat) => NOTE_AVAILABLE.has(cat.id)),
    [],
  )

  // 検索結果：カテゴリごとにマッチした見出しを集める
  const searchResults = useMemo(() => {
    if (!trimmed) return null
    const q = trimmed.toLowerCase()

    // セクション見出しにマッチしたエントリ
    const matchedEntries = NOTE_SECTION_INDEX.filter((e) =>
      e.heading.toLowerCase().includes(q),
    )

    // カテゴリ ID → マッチ見出しリスト
    const byCat = new Map<string, { sectionIndex: number; heading: string }[]>()
    for (const e of matchedEntries) {
      const arr = byCat.get(e.categoryId) ?? []
      arr.push({ sectionIndex: e.sectionIndex, heading: e.heading })
      byCat.set(e.categoryId, arr)
    }

    // カテゴリ名 / 説明文にもマッチさせる（見出しヒット無しでもカテゴリは表示）
    const result = availableCategories
      .map((cat) => {
        const headings = byCat.get(cat.id) ?? []
        const nameHit = cat.name.toLowerCase().includes(q)
        const descHit = (cat.description ?? '').toLowerCase().includes(q)
        if (headings.length === 0 && !nameHit && !descHit) return null
        return { cat, headings, nameHit, descHit }
      })
      .filter((x): x is NonNullable<typeof x> => x !== null)

    return result
  }, [trimmed, availableCategories])

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8fafc' }}>
      <div className="max-w-4xl mx-auto px-4 pb-16 pt-6">

        {/* Page header */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            <BookIcon className="w-6 h-6 text-teal-600" />
            <h1 className="text-2xl font-black text-slate-800">ノートモード</h1>
          </div>
          <p className="text-sm text-slate-500">各分野の重要知識を1ページで確認</p>
        </div>

        {/* Search box */}
        <div className="mb-5">
          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 pointer-events-none">
              <SearchIcon />
            </span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="セクション見出しを検索（例: SYNフラッド、SLAAC、SSL-VPN）"
              className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              aria-label="ノート内のセクション見出しを検索"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute inset-y-0 right-2 flex items-center text-slate-400 hover:text-slate-600 px-1.5"
                aria-label="検索をクリア"
              >
                ×
              </button>
            )}
          </div>
          {trimmed && (
            <p className="mt-2 text-xs text-slate-500">
              「<span className="font-bold text-slate-700">{trimmed}</span>」の検索結果：
              {searchResults && searchResults.length > 0
                ? `${searchResults.length}カテゴリ・${searchResults.reduce((s, r) => s + r.headings.length, 0)}見出し`
                : '一致なし'}
            </p>
          )}
        </div>

        {/* 通常モード：カテゴリ一覧 */}
        {!trimmed && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {availableCategories.map((cat, idx) => {
              const colorClass = CARD_COLORS[idx % CARD_COLORS.length]
              return (
                <Link
                  key={cat.id}
                  to={`/notes/${cat.id}`}
                  className="group flex items-center gap-4 bg-white rounded-xl border border-slate-200 px-4 py-4 hover:border-blue-400 hover:shadow-md transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                  aria-label={`${cat.name}のノートを開く`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                    <BookIcon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-800 leading-snug group-hover:text-blue-700 transition-colors truncate">
                      {cat.name}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5 leading-snug line-clamp-1">
                      {cat.description}
                    </p>
                  </div>
                  <div className="text-slate-300 group-hover:text-blue-400 transition-colors flex-shrink-0">
                    <ArrowRightIcon />
                  </div>
                </Link>
              )
            })}
          </div>
        )}

        {/* 検索モード：マッチしたカテゴリ + 見出しリスト */}
        {trimmed && searchResults && searchResults.length === 0 && (
          <div className="bg-white rounded-xl border border-slate-200 px-4 py-10 text-center text-sm text-slate-500">
            一致するセクション見出しが見つかりませんでした
          </div>
        )}
        {trimmed && searchResults && searchResults.length > 0 && (
          <div className="space-y-3">
            {searchResults.map(({ cat, headings, nameHit, descHit }, idx) => {
              const colorClass = CARD_COLORS[idx % CARD_COLORS.length]
              return (
                <div
                  key={cat.id}
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden"
                >
                  {/* カテゴリヘッダ */}
                  <Link
                    to={`/notes/${cat.id}`}
                    className="flex items-center gap-3 px-4 py-3 border-b border-slate-100 hover:bg-slate-50 transition-colors"
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                      <BookIcon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-800 truncate">
                        {nameHit ? highlight(cat.name, trimmed) : cat.name}
                      </p>
                      <p className="text-[11px] text-slate-400 leading-snug line-clamp-1">
                        {descHit ? highlight(cat.description ?? '', trimmed) : cat.description}
                      </p>
                    </div>
                    <ArrowRightIcon />
                  </Link>

                  {/* マッチしたセクション見出し */}
                  {headings.length > 0 && (
                    <ul className="px-4 py-2 divide-y divide-slate-100">
                      {headings.map(({ sectionIndex, heading }) => (
                        <li key={sectionIndex}>
                          <Link
                            to={`/notes/${cat.id}#note-section-${sectionIndex}`}
                            className="flex items-center gap-2 py-2 text-sm text-slate-700 hover:text-blue-700 transition-colors"
                          >
                            <span className="text-slate-300 text-xs">▶</span>
                            <span className="flex-1 min-w-0 truncate">
                              {highlight(heading, trimmed)}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )
            })}
          </div>
        )}

      </div>
    </div>
  )
}
