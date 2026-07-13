import { useEffect, useRef } from 'react'
import type { PriorityQueueFigure as PriorityQueueFigureData } from '../../../data/textbook/types'
import FigureFrame from './FigureFrame'
import StepperControls from './StepperControls'
import { useStepper } from './useStepper'

// QoS 優先制御（第18章）。3ゾーン（到着／優先キュー／送出順）を常に描画し、現在の段だけ青リングで強調する。
// レイアウトは全ステップ不変（強調が下へ流れるだけ）＝操作ボタン不動。送出段では音声チップを青くして「先に出る」を示す。

type Arrival = PriorityQueueFigureData['arrivals'][number]

function Chip({ label, kind, variant }: { label: string; kind: 'voice' | 'data'; variant: 'base' | 'sent' | 'waiting' }) {
  const cls =
    variant === 'sent'
      ? 'border-blue-400 bg-blue-100 text-blue-800'
      : variant === 'waiting'
        ? 'border-slate-300 bg-slate-100 text-slate-400'
        : kind === 'voice'
          ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
          : 'border-slate-300 bg-slate-100 text-slate-600'
  return <span className={`rounded-md border-[1.5px] px-2 py-1 text-center text-[10px] font-black ${cls}`}>{label}</span>
}

function Divider({ text }: { text: string }) {
  return <div className="my-1.5 text-center text-[9px] font-bold text-slate-400">▼ {text}</div>
}

export default function PriorityQueueFigure({ figure }: { figure: PriorityQueueFigureData }) {
  const { index, setIndex, next, prev, count } = useStepper(figure.steps.length)
  const stage = figure.steps[index].stage
  const voice = figure.arrivals.filter((a) => a.kind === 'voice')
  const data = figure.arrivals.filter((a) => a.kind === 'data')
  const sendOrder: Arrival[] = [...voice, ...data]

  const zoneCls = (own: string) =>
    `rounded-lg p-2 ${stage === own ? 'ring-2 ring-blue-400' : ''}`
  const labelCls = (own: string) =>
    `mb-1.5 text-[10px] font-black ${stage === own ? 'text-blue-700' : 'text-slate-500'}`

  const stageRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = stageRef.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    el.animate([{ opacity: 0.6 }, { opacity: 1 }], { duration: 240, easing: 'ease' })
  }, [index])

  return (
    <FigureFrame title={figure.title} caption={figure.caption} takeaway={figure.takeaway}>
      <div className="rounded-lg border border-slate-200 bg-slate-50/60 px-2 py-2.5 sm:px-3">
        <div ref={stageRef} key={index}>
          {/* ① 到着（届いた順・混雑） */}
          <div className={zoneCls('arrive')}>
            <div className={labelCls('arrive')}>① 届いた順（混雑）</div>
            <div className="flex gap-1.5">
              {figure.arrivals.map((a) => (
                <span key={a.id} className="min-w-0 flex-1">
                  <Chip label={a.label} kind={a.kind} variant="base" />
                </span>
              ))}
            </div>
          </div>

          <Divider text="優先度の印（マーキング）で仕分け" />

          {/* ② 優先キュー（2レーン） */}
          <div className={zoneCls('sort')}>
            <div className={labelCls('sort')}>② 優先キュー</div>
            <div className="mb-1.5 flex items-center gap-2">
              <span className="w-16 flex-shrink-0 text-[9px] font-black text-emerald-700">{figure.laneLabels.priority}</span>
              <div className="flex flex-wrap gap-1.5">
                {voice.map((a) => (
                  <Chip key={a.id} label={a.label} kind="voice" variant="base" />
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-16 flex-shrink-0 text-[9px] font-black text-slate-500">{figure.laneLabels.normal}</span>
              <div className="flex flex-wrap gap-1.5">
                {data.map((a) => (
                  <Chip key={a.id} label={a.label} kind="data" variant="base" />
                ))}
              </div>
            </div>
          </div>

          <Divider text="回線が空くたび、優先レーンから先に" />

          {/* ③ 回線へ送る順 */}
          <div className={zoneCls('send')}>
            <div className={labelCls('send')}>③ 回線へ送る順</div>
            <div className="flex items-center gap-1.5">
              {sendOrder.map((a) => (
                <Chip
                  key={a.id}
                  label={a.label}
                  kind={a.kind}
                  variant={stage === 'send' ? (a.kind === 'voice' ? 'sent' : 'waiting') : 'base'}
                />
              ))}
              <span className="flex-shrink-0 text-sm font-black text-blue-500">→</span>
            </div>
          </div>
        </div>
      </div>

      <p aria-live="polite" className="mt-3 flex h-12 items-start text-sm leading-relaxed text-slate-700">{figure.steps[index].explanation}</p>

      <div className="mt-2">
        <StepperControls index={index} count={count} onPrev={prev} onNext={next} onSelect={setIndex} />
      </div>
    </FigureFrame>
  )
}
