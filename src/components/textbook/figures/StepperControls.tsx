import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'

interface Props {
  index: number
  count: number
  playing: boolean
  onPrev: () => void
  onNext: () => void
  onTogglePlay: () => void
}

export default function StepperControls({ index, count, playing, onPrev, onNext, onTogglePlay }: Props) {
  return (
    <div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onPrev}
          disabled={index === 0}
          className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          戻る
        </button>
        <button
          type="button"
          onClick={onTogglePlay}
          className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700 transition-colors hover:bg-blue-100"
        >
          {playing ? <Pause className="h-4 w-4" aria-hidden="true" /> : <Play className="h-4 w-4" aria-hidden="true" />}
          {playing ? '停止' : '再生'}
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={index >= count - 1}
          className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          次へ
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
      <div className="mt-3 flex items-center justify-center gap-1.5" aria-hidden="true">
        {Array.from({ length: count }).map((_, i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all ${i === index ? 'w-5 bg-blue-500' : 'w-1.5 bg-slate-300'}`}
          />
        ))}
      </div>
    </div>
  )
}
