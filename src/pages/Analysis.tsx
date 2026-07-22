import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { buildCategoryAnalysis, priorityReason, type CategoryAnalysis } from '../lib/studyFocus'

// ----------------------------------------------------------------
// 部品
// ----------------------------------------------------------------

/** 午後Ⅰ出題数のバー（最大 7問 を全幅とする） */
function FrequencyBar({ count, max }: { count: number; max: number }) {
  const pct = max > 0 ? (count / max) * 100 : 0
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-12 sm:w-16 h-1.5 rounded-full bg-slate-100 overflow-hidden">
        <div className="h-full rounded-full bg-indigo-500" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[10px] text-slate-500 tabular-nums whitespace-nowrap">
        午後Ⅰ {count}問
      </span>
    </div>
  )
}

function rateColor(rate: number | null): string {
  if (rate === null) return 'text-slate-400'
  if (rate < 60) return 'text-red-600'
  if (rate < 80) return 'text-amber-600'
  return 'text-emerald-600'
}

function ActionLinks({ row }: { row: CategoryAnalysis }) {
  const base =
    'text-[10px] font-bold rounded-md px-2 py-1 border transition-colors whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500'
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {row.questionCount > 0 && (
        <Link
          to={`/quiz?mode=topic&category=${row.categoryId}`}
          className={`${base} bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100`}
        >
          演習
        </Link>
      )}
      <Link
        to={`/notes/${row.categoryId}`}
        className={`${base} bg-teal-50 border-teal-200 text-teal-700 hover:bg-teal-100`}
      >
        ノート
      </Link>
      {row.textbookChapterId && (
        <Link
          to={`/textbook/${row.textbookChapterId}`}
          className={`${base} bg-sky-50 border-sky-200 text-sky-700 hover:bg-sky-100`}
        >
          教科書
        </Link>
      )}
    </div>
  )
}

function AnalysisRow({
  row,
  rank,
  maxG1,
}: {
  row: CategoryAnalysis
  rank: number | null
  maxG1: number
}) {
  return (
    <li className="bg-white rounded-xl border border-slate-200 px-3 py-2.5">
      <div className="flex items-start gap-2.5">
        {rank !== null && (
          <span
            className={`flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-black tabular-nums ${
              rank <= 3 ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-500'
            }`}
            aria-label={`優先度${rank}位`}
          >
            {rank}
          </span>
        )}
        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="flex items-baseline justify-between gap-2">
            <p className="text-[13px] sm:text-sm font-bold text-slate-800 leading-tight truncate">
              {row.name}
            </p>
            <span className={`text-[13px] font-black tabular-nums leading-none ${rateColor(row.rate)}`}>
              {row.rate === null ? '未挑戦' : `${row.rate}%`}
            </span>
          </div>

          <div className="flex items-center justify-between gap-2 flex-wrap">
            <FrequencyBar count={row.g1Count} max={maxG1} />
            <span className="text-[10px] text-slate-400 tabular-nums">
              {row.attempts > 0 ? `${row.correct}/${row.attempts}問正解` : `全${row.questionCount}問`}
            </span>
          </div>

          <p className="text-[10px] text-slate-500 leading-tight">{priorityReason(row)}</p>

          <ActionLinks row={row} />
        </div>
      </div>
    </li>
  )
}

// ----------------------------------------------------------------
// ページ
// ----------------------------------------------------------------

export default function Analysis() {
  const navigate = useNavigate()
  const rows = useMemo(() => buildCategoryAnalysis(), [])

  const maxG1 = useMemo(() => Math.max(1, ...rows.map((r) => r.g1Count)), [rows])

  // 午後Ⅰでの出題実績がある分野＝優先度ランキングの対象
  const ranked = rows.filter((r) => r.g1Count > 0)
  const others = rows.filter((r) => r.g1Count === 0)

  const totalAttempts = rows.reduce((s, r) => s + r.attempts, 0)
  const totalCorrect = rows.reduce((s, r) => s + r.correct, 0)
  const overallRate = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : null
  const untouched = ranked.filter((r) => r.rate === null).length

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8fafc' }}>
      <div className="max-w-2xl mx-auto px-4 pb-16 pt-4 space-y-4">

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="戻る"
          >
            <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-base font-black text-slate-800">分野別 弱点分析</h1>
        </div>

        {/* 概要 */}
        <div className="bg-white rounded-xl border border-slate-200 px-4 py-3 space-y-2">
          <p className="text-[11px] text-slate-500 leading-relaxed">
            午後Ⅰでの出題数と、あなたの正答率から復習の優先度を出しています。
            <span className="font-bold text-slate-700">よく出るのに正答率が低い分野</span>ほど上位です。
          </p>
          <div className="flex items-center gap-4 pt-1 border-t border-slate-100">
            <div>
              <p className="text-[10px] text-slate-400 leading-none mb-1">全体正答率</p>
              <p className={`text-xl font-black tabular-nums leading-none ${rateColor(overallRate)}`}>
                {overallRate === null ? '—' : `${overallRate}%`}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 leading-none mb-1">未挑戦の頻出分野</p>
              <p className="text-xl font-black tabular-nums leading-none text-slate-700">
                {untouched}<span className="text-xs font-bold text-slate-400 ml-0.5">分野</span>
              </p>
            </div>
          </div>
        </div>

        {totalAttempts === 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
            <p className="text-[11px] text-amber-800 leading-relaxed">
              まだ問題を解いていないため、正答率は反映されていません。
              現在は午後Ⅰでの出題数の多い順に並んでいます。
            </p>
          </div>
        )}

        {/* 優先度ランキング */}
        <div className="space-y-2">
          <h2 className="text-xs font-black text-slate-600 px-1">復習の優先順位</h2>
          <ul className="space-y-2">
            {ranked.map((row, i) => (
              <AnalysisRow key={row.categoryId} row={row} rank={i + 1} maxG1={maxG1} />
            ))}
          </ul>
        </div>

        {/* 出題実績なし */}
        {others.length > 0 && (
          <div className="space-y-2">
            <h2 className="text-xs font-black text-slate-600 px-1">そのほかの分野</h2>
            <ul className="space-y-2">
              {others.map((row) => (
                <AnalysisRow key={row.categoryId} row={row} rank={null} maxG1={maxG1} />
              ))}
            </ul>
          </div>
        )}

        <p className="text-[10px] text-slate-400 leading-relaxed px-1">
          午後Ⅰの出題数は、このアプリに収録している過去問（H25〜R7）のキーワードから集計しています。
        </p>

      </div>
    </div>
  )
}
