import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { categories } from '../data/categories'
import { questions } from '../data/questions'
import { getAllProgress, getAnswerRecords, getStudySessions } from '../lib/storage'
import CategoryCard from '../components/CategoryCard'
import type { StudySession } from '../types'
import LevelWidget from '../components/gamification/LevelWidget'

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

function IconClipboard({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className ?? 'w-6 h-6'} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
  )
}

function IconPen({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className ?? 'w-6 h-6'} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  )
}

const MENU_CARDS: MenuCard[] = [
  // 左上：アプリの使い方（別ページ）
  {
    to: '/how-to-use',
    title: 'アプリの使い方',
    description: '3つのモードの活用方法',
    iconBg: 'bg-blue-50',
    icon: <IconBook className="w-6 h-6 text-blue-600" />,
  },
  // ノートモード（重要問題より前）
  {
    to: '/notes',
    title: 'ノートモード',
    description: '分野別の重要知識まとめ',
    iconBg: 'bg-teal-50',
    icon: <IconBook className="w-6 h-6 text-teal-600" />,
  },
  {
    to: '/quiz?mode=weakness',
    title: '弱点克服モード',
    description: '正答率の低い問題',
    iconBg: 'bg-red-50',
    icon: <IconChart className="w-6 h-6 text-red-500" />,
  },
  {
    to: '/afternoon',
    title: '午後問題演習補助',
    description: '問題一覧・過去問トラッカー',
    iconBg: 'bg-indigo-50',
    icon: <IconClipboard className="w-6 h-6 text-indigo-600" />,
  },
  {
    to: '/column',
    title: 'コラム：間宮塾勉強論',
    description: 'ネスペ合格への道筋と心構え',
    iconBg: 'bg-amber-50',
    icon: <IconPen className="w-6 h-6 text-amber-600" />,
  },
  // プロトコル一覧は最後
  {
    to: '/protocols',
    title: 'プロトコル一覧',
    description: 'ポート番号・レイヤ一覧',
    iconBg: 'bg-purple-50',
    icon: <IconList className="w-6 h-6 text-purple-600" />,
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

  // 「達成」した問題ID集合：1回でも正解した問題の questionId（重複は1つに集約）
  const achievedQuestionIds = useMemo(() => {
    const set = new Set<string>()
    for (const r of getAnswerRecords()) {
      if (r.isCorrect) set.add(r.questionId)
    }
    return set
  }, [])

  // 全体達成数 = 達成済みのうち、現在も questions に存在する ID の数
  const achievedCount = useMemo(
    () => questions.filter((q) => achievedQuestionIds.has(q.id)).length,
    [achievedQuestionIds],
  )

  // 弱点克服モードの非活性化判定用：1問でも回答していれば学習済みとみなす
  const studiedCount = useMemo(() => {
    const studiedTopicIds = new Set(
      allProgress.filter((p) => p.totalAttempts > 0).map((p) => p.topicId),
    )
    return questions.filter((q) => studiedTopicIds.has(q.topicId)).length
  }, [allProgress])

  // 4択／記述の正答率は分離して算出
  const globalMcRate = useMemo(() => {
    const total = allProgress.reduce((s, p) => s + p.mcAttempts, 0)
    const correct = allProgress.reduce((s, p) => s + p.mcCorrect, 0)
    if (total === 0) return null
    return Math.round((correct / total) * 100)
  }, [allProgress])

  const globalWrRate = useMemo(() => {
    const total = allProgress.reduce((s, p) => s + p.wrAttempts, 0)
    const correct = allProgress.reduce((s, p) => s + p.wrCorrect, 0)
    if (total === 0) return null
    return Math.round((correct / total) * 100)
  }, [allProgress])

  const categoryStats = useMemo(() => {
    return categories.map((cat) => {
      const catQuestions = questions.filter((q) => q.topicId === cat.id)
      const catProgress = allProgress.filter((p) => p.topicId === cat.id)
      const mcTotal = catProgress.reduce((s, p) => s + p.mcAttempts, 0)
      const mcCorrect = catProgress.reduce((s, p) => s + p.mcCorrect, 0)
      const wrTotal = catProgress.reduce((s, p) => s + p.wrAttempts, 0)
      const wrCorrect = catProgress.reduce((s, p) => s + p.wrCorrect, 0)
      const mcRate = mcTotal > 0 ? Math.round((mcCorrect / mcTotal) * 100) : null
      const wrRate = wrTotal > 0 ? Math.round((wrCorrect / wrTotal) * 100) : null
      // 達成数 = カテゴリ内の問題のうち1回でも正解した問題数
      const achieved = catQuestions.filter((q) => achievedQuestionIds.has(q.id)).length
      const achievementRate =
        catQuestions.length > 0
          ? Math.round((achieved / catQuestions.length) * 100)
          : null
      const lastStudied =
        catProgress
          .filter((p) => p.lastStudiedAt)
          .sort((a, b) => (b.lastStudiedAt > a.lastStudiedAt ? 1 : -1))[0]
          ?.lastStudiedAt ?? ''
      return {
        category: cat,
        questionCount: catQuestions.length,
        mcRate,
        wrRate,
        achieved,
        achievementRate,
        lastStudiedAt: lastStudied,
      }
    })
  }, [allProgress, achievedQuestionIds])

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8fafc' }}>
      <div className="max-w-4xl mx-auto px-4 pb-16 space-y-4 pt-4">

        {/* ===== タイトル ===== */}
        <h1
          className="text-center font-black leading-tight pt-2 pb-1"
          style={{ color: '#1a3a5c', fontSize: 'clamp(1.5rem, 4vw, 2rem)' }}
        >
          ネットワークスペシャリスト学習アプリ
        </h1>

        <LevelWidget />

        {/* ===== 学習メニュー ===== */}
        <section aria-labelledby="menu-heading">
          <h2
            id="menu-heading"
            className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3"
          >
            学習メニュー
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {MENU_CARDS.map((card) => {
              const isWeakness = card.to === '/quiz?mode=weakness'
              const weaknessDisabled = isWeakness && studiedCount === 0
              return weaknessDisabled ? (
                <div
                  key={card.to}
                  className="flex items-center gap-3 bg-slate-50 rounded-xl border border-slate-200 px-3 py-2.5 opacity-60 cursor-not-allowed"
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${card.iconBg}`}>
                    {card.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-500 leading-tight truncate">{card.title}</p>
                    <p className="text-[11px] text-slate-400 leading-tight">問題を解くと使えます</p>
                  </div>
                </div>
              ) : (
                <Link
                  key={card.to}
                  to={card.to}
                  className="group relative flex items-center gap-3 bg-white rounded-xl border border-slate-200 px-3 py-2.5 hover:border-blue-400 hover:shadow-md transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${card.iconBg}`}>
                    {card.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-800 leading-tight group-hover:text-blue-700 transition-colors truncate">
                      {card.title}
                    </p>
                    <p className="text-[11px] text-slate-400 leading-tight truncate">{card.description}</p>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        {/* ===== 全体の学習進捗 ===== */}
        <section aria-labelledby="progress-heading">
          <div className="flex items-center justify-between mb-3">
            <h2
              id="progress-heading"
              className="text-xs font-bold text-slate-500 uppercase tracking-wider"
            >
              全体の学習進捗
            </h2>
            <Link
              to="/quiz?mode=random"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 text-[11px] font-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              aria-label="ランダム出題で学習する"
            >
              <IconShuffle className="w-3.5 h-3.5" />
              ランダム出題
            </Link>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 px-4 py-3">
            {/* Stats row */}
            <div className="flex items-center gap-0 divide-x divide-slate-100 mb-3">
              <div className="flex items-baseline gap-1 pr-4">
                <span className="text-xl font-black tabular-nums leading-none" style={{ color: '#1a3a5c' }}>
                  {achievedCount}
                </span>
                <span className="text-xs font-normal text-slate-400">/{totalQuestions}</span>
                <span className="text-[11px] text-slate-400 ml-1">達成</span>
              </div>
              <div className="flex items-baseline gap-1 pl-4">
                <span className="text-xl font-black tabular-nums text-amber-500 leading-none">{importantCount}</span>
                <span className="text-[11px] text-slate-400 ml-1">重要問題</span>
              </div>
            </div>
            {/* Progress bars: 達成率 + 4択／記述 正答率 */}
            <div className="space-y-2">
              {/* 達成率：1問でも正解した問題 / 全問題 */}
              {(() => {
                const achievementRate =
                  totalQuestions > 0
                    ? Math.round((achievedCount / totalQuestions) * 100)
                    : 0
                return (
                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-500 font-bold">達成率</span>
                      <span className="tabular-nums" style={{ color: '#1a3a5c' }}>
                        {achievementRate}%
                      </span>
                    </div>
                    <div
                      className="h-1.5 bg-slate-100 rounded-full overflow-hidden"
                      role="progressbar"
                      aria-valuenow={achievementRate}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`達成率 ${achievementRate}%`}
                    >
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${achievementRate}%`, backgroundColor: '#10b981' }}
                      />
                    </div>
                  </div>
                )
              })()}
              {/* 4択 */}
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-500 font-bold">4択 正答率</span>
                  <span className="tabular-nums" style={{ color: '#1a3a5c' }}>
                    {globalMcRate !== null ? `${globalMcRate}%` : '—'}
                  </span>
                </div>
                <div
                  className="h-1.5 bg-slate-100 rounded-full overflow-hidden"
                  role="progressbar"
                  aria-valuenow={globalMcRate ?? 0}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`4択正答率 ${globalMcRate ?? 0}%`}
                >
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${globalMcRate ?? 0}%`, backgroundColor: '#0066cc' }}
                  />
                </div>
              </div>
              {/* 記述 */}
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-500 font-bold">記述 正答率</span>
                  <span className="tabular-nums" style={{ color: '#1a3a5c' }}>
                    {globalWrRate !== null ? `${globalWrRate}%` : '—'}
                  </span>
                </div>
                <div
                  className="h-1.5 bg-slate-100 rounded-full overflow-hidden"
                  role="progressbar"
                  aria-valuenow={globalWrRate ?? 0}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`記述正答率 ${globalWrRate ?? 0}%`}
                >
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${globalWrRate ?? 0}%`, backgroundColor: '#d97706' }}
                  />
                </div>
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
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {categoryStats.map(({ category, questionCount, mcRate, wrRate, achieved, achievementRate, lastStudiedAt }) => (
              <CategoryCard
                key={category.id}
                category={category}
                questionCount={questionCount}
                mcRate={mcRate}
                wrRate={wrRate}
                achieved={achieved}
                achievementRate={achievementRate}
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

        {/* フッター注記 */}
        <p className="mt-8 text-center text-[11px] text-slate-400 leading-relaxed">
          不具合報告、ご意見等は、LINEでお願いします。
        </p>

      </div>
    </div>
  )
}
