import { Link } from 'react-router-dom'
import type { Category } from '../types'

interface CategoryCardProps {
  category: Category
  questionCount: number
  /** 4択モードの正答率。null = 未挑戦 */
  mcRate: number | null
  /** 記述モードの正答率。null = 未挑戦 */
  wrRate: number | null
  /** 最終学習日時の ISO 文字列。未学習なら空文字 */
  lastStudiedAt: string
}

function rateColor(rate: number): string {
  if (rate >= 80) return 'bg-emerald-500'
  if (rate >= 50) return 'bg-amber-400'
  return 'bg-red-500'
}

interface MiniBarProps {
  label: string
  rate: number | null
}
function MiniBar({ label, rate }: MiniBarProps) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[9px] font-bold text-slate-400 w-5 flex-shrink-0">{label}</span>
      {rate !== null ? (
        <>
          <div
            className="flex-1 h-1 rounded-full bg-slate-100 overflow-hidden"
            role="progressbar"
            aria-valuenow={rate}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${label}正答率 ${rate}%`}
          >
            <div
              className={`h-full rounded-full transition-all ${rateColor(rate)}`}
              style={{ width: `${rate}%` }}
            />
          </div>
          <span className="text-[10px] font-medium text-slate-500 tabular-nums w-7 text-right flex-shrink-0">
            {rate}%
          </span>
        </>
      ) : (
        <>
          <div className="flex-1 h-1 rounded-full bg-slate-100" aria-hidden="true" />
          <span className="text-[10px] text-slate-300 w-7 text-right flex-shrink-0">—</span>
        </>
      )}
    </div>
  )
}

export default function CategoryCard({
  category,
  questionCount,
  mcRate,
  wrRate,
  lastStudiedAt: _lastStudiedAt,
}: CategoryCardProps) {
  const isIot = category.id === 'iot'
  const isEmpty = questionCount === 0

  const cardContent = (
    <>
      {/* バッジ */}
      {(isEmpty || isIot) && (
        <span className="absolute top-2 right-2">
          {isEmpty ? (
            <span className="rounded-full bg-slate-100 text-slate-400 text-[10px] font-bold px-1.5 py-0.5 leading-tight">
              準備中
            </span>
          ) : (
            <span className="rounded-full bg-purple-100 text-purple-700 text-[10px] font-bold px-1.5 py-0.5 leading-tight">
              R7
            </span>
          )}
        </span>
      )}

      {/* 1行目：カテゴリ名 + 問題数 */}
      <div className="flex items-baseline justify-between gap-2 pr-8">
        <p
          className={`font-semibold text-sm leading-tight truncate ${
            isEmpty ? 'text-slate-400' : 'text-slate-800 group-hover:text-blue-700'
          } transition-colors`}
        >
          {category.name}
        </p>
        <span className={`text-[11px] flex-shrink-0 ${isEmpty ? 'text-slate-300' : 'text-slate-400'}`}>
          {questionCount}問
        </span>
      </div>

      {/* 2行目以降：4択／記述の2本バー */}
      {isEmpty ? (
        <span className="text-[11px] text-slate-300">準備中</span>
      ) : (
        <div className="space-y-1">
          <MiniBar label="4択" rate={mcRate} />
          <MiniBar label="記述" rate={wrRate} />
        </div>
      )}
    </>
  )

  if (isEmpty) {
    return (
      <div
        className="group relative flex flex-col gap-1.5 rounded-xl border px-3 py-2.5 bg-slate-50 border-slate-200 cursor-not-allowed opacity-60"
        aria-label={`${category.name}（準備中）`}
      >
        {cardContent}
      </div>
    )
  }

  const ariaLabel = (() => {
    const parts: string[] = [`${category.name}、問題数${questionCount}問`]
    parts.push(mcRate !== null ? `4択正答率${mcRate}%` : '4択未挑戦')
    parts.push(wrRate !== null ? `記述正答率${wrRate}%` : '記述未挑戦')
    return parts.join('、')
  })()

  return (
    <Link
      to={`/quiz?mode=topic&category=${category.id}`}
      className={[
        'group relative flex flex-col gap-1.5 rounded-xl border px-3 py-2.5',
        'bg-white border-slate-200 hover:border-blue-400 hover:shadow-md',
        'transition-all duration-150',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
      ].join(' ')}
      aria-label={ariaLabel}
    >
      {cardContent}
    </Link>
  )
}
