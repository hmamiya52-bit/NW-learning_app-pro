import { Link } from 'react-router-dom'
import { categories } from '../data/categories'
import { NOTE_CATEGORY_IDS } from './NoteDetail'

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

export default function Notes() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8fafc' }}>
      <div className="max-w-4xl mx-auto px-4 pb-16 pt-6">

        {/* Page header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <BookIcon className="w-6 h-6 text-teal-600" />
            <h1 className="text-2xl font-black text-slate-800">ノートモード</h1>
          </div>
          <p className="text-sm text-slate-500">各分野の重要知識を1ページで確認</p>
        </div>

        {/* Category grid（ノート未収録カテゴリは非表示） */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {categories.filter((cat) => NOTE_AVAILABLE.has(cat.id)).map((cat, idx) => {
            const colorClass = CARD_COLORS[idx % CARD_COLORS.length]
            return (
              <Link
                key={cat.id}
                to={`/notes/${cat.id}`}
                className="group flex items-center gap-4 bg-white rounded-xl border border-slate-200 px-4 py-4 hover:border-blue-400 hover:shadow-md transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                aria-label={`${cat.name}のノートを開く`}
              >
                {/* Icon */}
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                  <BookIcon className="w-5 h-5" />
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-800 leading-snug group-hover:text-blue-700 transition-colors truncate">
                    {cat.name}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5 leading-snug line-clamp-1">
                    {cat.description}
                  </p>
                </div>

                {/* Arrow */}
                <div className="text-slate-300 group-hover:text-blue-400 transition-colors flex-shrink-0">
                  <ArrowRightIcon />
                </div>
              </Link>
            )
          })}
        </div>

      </div>
    </div>
  )
}
