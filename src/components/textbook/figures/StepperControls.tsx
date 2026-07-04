import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Props {
  index: number
  count: number
  onPrev: () => void
  onNext: () => void
  // ドットをタップして任意のステップへジャンプ（長い図の復習用）。
  onSelect?: (index: number) => void
}

export default function StepperControls({ index, count, onPrev, onNext, onSelect }: Props) {
  return (
    <div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onPrev}
          disabled={index === 0}
          className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          戻る
        </button>
        <span className="flex-shrink-0 text-xs font-black text-slate-400">
          {index + 1} / {count}
        </span>
        <button
          type="button"
          onClick={onNext}
          disabled={index >= count - 1}
          className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700 transition-colors hover:bg-blue-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
        >
          次へ
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
      <div className="mt-2 flex items-center justify-center gap-1">
        {Array.from({ length: count }).map((_, i) =>
          onSelect ? (
            <button
              key={i}
              type="button"
              onClick={() => onSelect(i)}
              aria-label={`ステップ${i + 1}へ`}
              aria-current={i === index ? 'step' : undefined}
              className="flex h-6 items-center rounded px-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <span className={`h-1.5 rounded-full transition-all ${i === index ? 'w-5 bg-blue-500' : 'w-1.5 bg-slate-300 hover:bg-slate-400'}`} />
            </button>
          ) : (
            <span
              key={i}
              aria-hidden="true"
              className={`h-1.5 rounded-full transition-all ${i === index ? 'w-5 bg-blue-500' : 'w-1.5 bg-slate-300'}`}
            />
          ),
        )}
      </div>
    </div>
  )
}
