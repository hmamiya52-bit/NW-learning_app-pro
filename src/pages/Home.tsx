import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { categories } from '../data/categories'
import { questions } from '../data/questions'
import { getAllProgress, getStudySessions } from '../lib/storage'
import CategoryCard from '../components/CategoryCard'
import type { StudySession } from '../types'

// ----------------------------------------------------------------
// Helper functions
// ----------------------------------------------------------------

function formatSessionDate(iso: string): string {
  if (!iso) return '—'
  const d = new Date(iso)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  if (diffDays === 0) return '今日'
  if (diffDays === 1) return '昨日'
  if (diffDays < 7) return `${diffDays}日前`
  return `${d.getMonth() + 1}/${d.getDate()}`
}

function modeLabel(mode: StudySession['mode']): string {
  switch (mode) {
    case 'important': return '重要問題'
    case 'weakness': return '弱点克服'
    case 'random': return 'ランダム'
    case 'topic': return 'カテゴリ別'
    default: return mode
  }
}

function sessionRate(s: StudySession): number | null {
  if (s.questionCount === 0) return null
  return Math.round((s.correctCount / s.questionCount) * 100)
}

function rateTextColor(rate: number): string {
  if (rate >= 80) return 'text-emerald-600'
  if (rate >= 50) return 'text-amber-600'
  return 'text-red-500'
}

// ----------------------------------------------------------------
// Menu card data
// ----------------------------------------------------------------

interface MenuCard {
  to: string
  title: string
  description: string
  iconBg: string
  icon: React.ReactNode
}

function IconStar({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className ?? 'w-6 h-6'} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  )
}

function IconGrid({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className ?? 'w-6 h-6'} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  )
}

function IconChart({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className ?? 'w-6 h-6'} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
    </svg>
  )
}

function IconShuffle({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className ?? 'w-6 h-6'} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4h5l3 8h5m0 0l-3 3m3-3l-3-3" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 20h5l7-8" />
    </svg>
  )
}

function IconList({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className ?? 'w-6 h-6'} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  )
}

function IconBook({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className ?? 'w-6 h-6'} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  )
}

function IconArrowRight() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  )
}

const MENU_CARDS: MenuCard[] = [
  {
    to: '/quiz?mode=important',
    title: '重要問題モード',
    description: '厳選問題を集中学習',
    iconBg: 'bg-amber-50',
    icon: <IconStar className="w-6 h-6 text-amber-500" />,
  },
  {
    to: '/#categories',
    title: 'カテゴリ別学習',
    description: '分野を選んで学習',
    iconBg: 'bg-blue-50',
    icon: <IconGrid className="w-6 h-6 text-blue-600" />,
  },
  {
    to: '/quiz?mode=weakness',
    title: '弱点克服モード',
    description: '正答率の低い問題',
    iconBg: 'bg-red-50',
    icon: <IconChart className="w-6 h-6 text-red-500" />,
  },
  {
    to: '/quiz?mode=random',
    title: 'ランダム出題',
    description: '全問からランダムに',
    iconBg: 'bg-emerald-50',
    icon: <IconShuffle className="w-6 h-6 text-emerald-600" />,
  },
  {
    to: '/protocols',
    title: 'プロトコル一覧',
    description: 'ポート番号・レイヤ一覧',
    iconBg: 'bg-purple-50',
    icon: <IconList className="w-6 h-6 text-purple-600" />,
  },
  {
    to: '/notes',
    title: 'ノートモード',
    description: '分野別の重要知識まとめ',
    iconBg: 'bg-teal-50',
    icon: <IconBook className="w-6 h-6 text-teal-600" />,
  },
]

// ----------------------------------------------------------------
// Home
// ----------------------------------------------------------------

export default function Home() {
  // --- Data ---
  const allProgress = useMemo(() => getAllProgress(), [])
  const sessions = useMemo(
    () =>
      getStudySessions()
        .filter((s) => s.endedAt)
        .sort((a, b) => (b.startedAt > a.startedAt ? 1 : -1))
        .slice(0, 5),
    []
  )

  const totalQuestions = questions.length
  const importantCount = questions.filter((q) => q.isImportant).length

  const studiedTopicIds = useMemo(
    () => new Set(allProgress.filter((p) => p.totalAttempts > 0).map((p) => p.topicId)),
    [allProgress]
  )

  const studiedCount = useMemo(
    () => questions.filter((q) => studiedTopicIds.has(q.topicId)).length,
    [studiedTopicIds]
  )

  const globalRate = useMemo(() => {
    const total = allProgress.reduce((s, p) => s + p.totalAttempts, 0)
    const correct = allProgress.reduce((s, p) => s + p.correctCount, 0)
    if (total === 0) return null
    return Math.round((correct / total) * 100)
  }, [allProgress])

  const progressPct = totalQuestions > 0 ? Math.round((studiedCount / totalQuestions) * 100) : 0

  const categoryStats = useMemo(() => {
    return categories.map((cat) => {
      const catQuestions = questions.filter((q) => q.topicId === cat.id)
      const catProgress = allProgress.filter((p) => p.topicId === cat.id)
      const total = catProgress.reduce((s, p) => s + p.totalAttempts, 0)
      const correct = catProgress.reduce((s, p) => s + p.correctCount, 0)
      const rate = total > 0 ? Math.round((correct / total) * 100) : null
      const lastStudied =
        catProgress
          .filter((p) => p.lastStudiedAt)
          .sort((a, b) => (b.lastStudiedAt > a.lastStudiedAt ? 1 : -1))[0]
          ?.lastStudiedAt ?? ''
      return { category: cat, questionCount: catQuestions.length, correctRate: rate, lastStudiedAt: lastStudied }
    })
  }, [allProgress])

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8fafc' }}>
      <div className="max-w-4xl mx-auto px-4 pb-16 space-y-8 pt-6">

        {/* ===== Welcome Banner ===== */}
        <section aria-label="ようこそバナー">
          <div className="rounded-2xl bg-green-600 text-white px-6 py-5 shadow-md">
            <p className="text-xs font-semibold uppercase tracking-wider text-green-100 mb-1">Welcome!</p>
            <h1 className="text-xl font-black leading-snug">
              ようこそ、NWスペシャリスト学習へ！
            </h1>
            <p className="text-sm text-green-100 mt-1">
              19分野 · {totalQuestions}問 · 重要問題{importantCount}問
            </p>
          </div>
        </section>

        {/* ===== 学習メニュー ===== */}
        <section aria-labelledby="menu-heading">
          <h2
            id="menu-heading"
            className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3"
          >
            学習メニュー
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {MENU_CARDS.map((card) => (
              <Link
                key={card.to}
                to={card.to}
                className="group flex flex-col gap-3 bg-white rounded-xl border border-slate-200 p-4 hover:border-blue-400 hover:shadow-md transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              >
                {/* Icon area */}
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${card.iconBg}`}>
                  {card.icon}
                </div>
                {/* Text */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-800 leading-snug group-hover:text-blue-700 transition-colors">
                    {card.title}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5 leading-snug">{card.description}</p>
                </div>
                {/* Arrow */}
                <div className="text-slate-300 group-hover:text-blue-400 transition-colors self-end">
                  <IconArrowRight />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ===== 全体の学習進捗 ===== */}
        <section aria-labelledby="progress-heading">
          <h2
            id="progress-heading"
            className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3"
          >
            全体の学習進捗
          </h2>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
            <div className="grid grid-cols-3 divide-x divide-slate-100">
              {/* 正答率 */}
              <div className="flex flex-col items-center gap-1 pr-4">
                <span className="text-3xl font-black tabular-nums leading-none" style={{ color: '#1a3a5c' }}>
                  {globalRate !== null ? `${globalRate}` : '—'}
                  {globalRate !== null && <span className="text-lg font-semibold text-blue-400">%</span>}
                </span>
                <span className="text-[11px] text-slate-500">正答率</span>
              </div>
              {/* 学習済み問題数 */}
              <div className="flex flex-col items-center gap-1 px-4">
                <span className="text-3xl font-black tabular-nums leading-none" style={{ color: '#1a3a5c' }}>
                  {studiedCount}
                  <span className="text-base font-normal text-slate-400">/{totalQuestions}</span>
                </span>
                <span className="text-[11px] text-slate-500">学習済み問題</span>
              </div>
              {/* 重要問題数 */}
              <div className="flex flex-col items-center gap-1 pl-4">
                <span className="text-3xl font-black tabular-nums text-amber-500 leading-none">
                  {importantCount}
                </span>
                <span className="text-[11px] text-slate-500">重要問題数</span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-5">
              <div className="flex justify-between text-[11px] text-slate-400 mb-1.5">
                <span>学習進捗</span>
                <span>{progressPct}%</span>
              </div>
              <div
                className="h-2 bg-slate-100 rounded-full overflow-hidden"
                role="progressbar"
                aria-valuenow={studiedCount}
                aria-valuemin={0}
                aria-valuemax={totalQuestions}
                aria-label={`学習進捗 ${progressPct}%`}
              >
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPct}%`, backgroundColor: '#0066cc' }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ===== カテゴリ一覧 ===== */}
        <section aria-labelledby="categories-heading" id="categories">
          <h2
            id="categories-heading"
            className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3"
          >
            カテゴリ一覧（{categories.length}分野）
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {categoryStats.map(({ category, questionCount, correctRate, lastStudiedAt }) => (
              <CategoryCard
                key={category.id}
                category={category}
                questionCount={questionCount}
                correctRate={correctRate}
                lastStudiedAt={lastStudiedAt}
              />
            ))}
          </div>
        </section>

        {/* ===== 最近の学習履歴 ===== */}
        <section aria-labelledby="history-heading">
          <h2
            id="history-heading"
            className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3"
          >
            最近の学習履歴
          </h2>
          {sessions.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-6 text-center">
              <p className="text-slate-400 text-sm">まだ学習履歴がありません</p>
              <p className="text-slate-300 text-xs mt-1">上のモードから学習を始めましょう</p>
            </div>
          ) : (
            <ul className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-100 overflow-hidden">
              {sessions.map((s) => {
                const rate = sessionRate(s)
                return (
                  <li key={s.id} className="flex items-center gap-3 px-4 py-3">
                    <span
                      className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-base flex-shrink-0"
                      aria-hidden="true"
                    >
                      {s.mode === 'important' ? '★' : s.mode === 'weakness' ? '📉' : s.mode === 'topic' ? '📂' : '🎲'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-700 truncate">{modeLabel(s.mode)}</p>
                      <p className="text-xs text-slate-400">
                        {formatSessionDate(s.startedAt)} · {s.questionCount}問
                      </p>
                    </div>
                    {rate !== null && (
                      <span className={`text-sm font-bold tabular-nums flex-shrink-0 ${rateTextColor(rate)}`}>
                        {rate}%
                      </span>
                    )}
                  </li>
                )
              })}
            </ul>
          )}
        </section>

      </div>
    </div>
  )
}
