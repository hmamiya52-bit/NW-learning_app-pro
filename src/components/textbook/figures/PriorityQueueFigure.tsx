import { useEffect, useRef } from 'react'
import type { PriorityQueueFigure as PriorityQueueFigureData } from '../../../data/textbook/types'
import FigureFrame from './FigureFrame'
import StepperControls from './StepperControls'
import { useStepper } from './useStepper'

// QoS 優先制御（第18章）。待ち行列から、音声（優先）を先に送り出す様子を「動き」で見せる。
// 上=待ち行列／下=送出済みを N スロットで固定表示し、ステップごとにパケットが行列から抜けて送出側へ移る。
// スロット数は固定なので、レイアウトは不変＝操作ボタン不動。

type Arrival = PriorityQueueFigureData['arrivals'][number]

function SlotRow({ slots, highlightId }: { slots: (Arrival | null)[]; highlightId: string | null }) {
  return (
    <div className="flex gap-1.5">
      {slots.map((s, i) => (
        <div key={i} className="h-7 min-w-0 flex-1">
          {s ? (
            <span
              className={`flex h-full items-center justify-center rounded-md border-[1.5px] text-[10px] font-black ${
                s.kind === 'voice' ? 'border-emerald-300 bg-emerald-50 text-emerald-800' : 'border-slate-300 bg-slate-100 text-slate-600'
              } ${s.id === highlightId ? 'ring-2 ring-blue-500' : ''}`}
            >
              {s.label}
            </span>
          ) : (
            <div className="h-full rounded-md border border-dashed border-slate-200" />
          )}
        </div>
      ))}
    </div>
  )
}

export default function PriorityQueueFigure({ figure }: { figure: PriorityQueueFigureData }) {
  const { index, setIndex, next, prev, count } = useStepper(figure.steps.length)
  const sent = figure.steps[index].sent
  const n = figure.arrivals.length
  // 優先順＝音声が先、同一優先内は到着順。
  const order: Arrival[] = [
    ...figure.arrivals.filter((a) => a.kind === 'voice'),
    ...figure.arrivals.filter((a) => a.kind === 'data'),
  ]
  const sentList = order.slice(0, sent)
  const sentIds = new Set(sentList.map((a) => a.id))
  const remaining = figure.arrivals.filter((a) => !sentIds.has(a.id))
  const justSent = sent > 0 ? order[sent - 1].id : null
  const pad = (arr: Arrival[]): (Arrival | null)[] => [...arr, ...Array(n - arr.length).fill(null)]

  const stageRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = stageRef.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    el.animate([{ opacity: 0.55 }, { opacity: 1 }], { duration: 260, easing: 'ease' })
  }, [index])

  return (
    <FigureFrame title={figure.title} caption={figure.caption} takeaway={figure.takeaway}>
      <div className="rounded-lg border border-slate-200 bg-slate-50/60 px-2 py-3 sm:px-3">
        <div ref={stageRef} key={index}>
          {/* 待ち行列（届いた順・送出済みは抜ける） */}
          <div className="mb-1 text-[10px] font-black text-slate-500">{figure.queueLabel}</div>
          <SlotRow slots={pad(remaining)} highlightId={null} />

          {/* 優先ゲート */}
          <div className="my-2 flex items-center justify-center gap-1 text-[9px] font-black text-emerald-700">
            <span aria-hidden="true">▼</span>
            {figure.gateLabel}
          </div>

          {/* 回線へ送出（送った順・音声が先に埋まる） */}
          <div className="mb-1 text-[10px] font-black text-slate-500">{figure.sentLabel}</div>
          <SlotRow slots={pad(sentList)} highlightId={justSent} />
        </div>
      </div>

      <p aria-live="polite" className="mt-3 flex h-12 items-start text-sm leading-relaxed text-slate-700">{figure.steps[index].explanation}</p>

      <div className="mt-2">
        <StepperControls index={index} count={count} onPrev={prev} onNext={next} onSelect={setIndex} />
      </div>
    </FigureFrame>
  )
}
