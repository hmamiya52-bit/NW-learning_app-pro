import { Link } from 'react-router-dom'
import type { Category } from '../types'

interface CategoryCardProps {
  category: Category
  questionCount: number
  /** 0–100 の正答率。null = 未学習 */
  correctRate: number | null
  /** 最終学習日時の ISO 文字列。未学習なら空文字 */
  lastStudiedAt: string
}

function formatDate(iso: string): string {
  if (!iso) return ''
  const d = new Date(iso)
  return `${d.getMonth() + 1}/${d.getDate()} 学習済`
}

function rateColor(rate: number): string {
  if (rate >= 80) return 'bg-emerald-500'
  if (rate >= 50) return 'bg-amber-400'
  return 'bg-red-500'
}

export default function CategoryCard({
  category,
  questionCount,
  correctRate,
  lastStudiedAt,
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
        <p className={`font-semibold text-sm leading-tight truncate ${isEmpty ? 'text-slate-400' : 'text-slate-800 group-hover:text-blue-700'} transition-colors`}>
          {category.name}
        </p>
        <span className={`text-[11px] flex-shrink-0 ${isEmpty ? 'text-slate-300' : 'text-slate-400'}`}>
          {questionCount}問
        </span>
      </div>

      {/* 2行目：正答率バー or 未学習 */}
      {isEmpty ? (
        <span className="text-[11px] text-slate-300">準備中</span>
      ) : correctRate !== null ? (
        <div className="flex items-center gap-2">
          <div
            className="flex-1 h-1 rounded-full bg-slate-100 overflow-hidden"
            role="progressbar"
            aria-valuenow={correctRate}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`正答率 ${correctRate}%`}
          >
            <div
              className={`h-full rounded-full transition-all ${rateColor(correctRate)}`}
              style={{ width: `${correctRate}%` }}
            />
          </div>
          <span className="text-[11px] font-medium text-slate-500 tabular-nums w-7 text-right flex-shrink-0">
            {correctRate}%
          </span>
        </div>
      ) : (
        <span className="text-[11px] text-slate-400">未学習</span>
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

  return (
    <Link
      to={`/quiz?mode=topic&category=${category.id}`}
      className={[
        'group relative flex flex-col gap-1.5 rounded-xl border px-3 py-2.5',
        'bg-white border-slate-200 hover:border-blue-400 hover:shadow-md',
        'transition-all duration-150',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
      ].join(' ')}
      aria-label={`${category.name}、問題数${questionCount}問${correctRate !== null ? `、正答率${correctRate}%` : '、未学習'}`}
    >
      {cardContent}
    </Link>
  )
}
