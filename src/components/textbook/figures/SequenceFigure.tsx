import type { SequenceFigure as SequenceFigureData } from '../../../data/textbook/types'
import FigureFrame from './FigureFrame'
import StepperControls from './StepperControls'
import { ROLE_ICON, ROLE_TONE, TONE } from './figureTokens'
import { useStepper } from './useStepper'

type Actor = SequenceFigureData['actors'][number]
type Message = SequenceFigureData['messages'][number]

const ROW_H = 54 // 1メッセージぶんの高さ（ラベル＋矢印）。固定なのでボタンは動かない。

function ActorHead({ actor }: { actor: Actor }) {
  const Icon = actor.role ? ROLE_ICON[actor.role] : null
  const tone = actor.role ? TONE[ROLE_TONE[actor.role]] : TONE.slate
  return (
    <div className="flex min-w-0 flex-col items-center text-center">
      {Icon && (
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg border ${tone.border} ${tone.fill}`}>
          <Icon className={`h-4 w-4 ${tone.text}`} />
        </div>
      )}
      <p className="mt-1 text-[11px] font-black leading-tight text-slate-800">{actor.label}</p>
      {actor.sub && <p className="text-[10px] leading-tight text-slate-500">{actor.sub}</p>}
    </div>
  )
}

function MessageRow({ m, fromX, toX, active }: { m: Message; fromX: number; toX: number; active: boolean }) {
  const rightward = toX >= fromX
  const left = Math.min(fromX, toX)
  const width = Math.abs(toX - fromX)
  const broadcast = m.style === 'broadcast'

  const lineColor = active ? 'bg-blue-500' : 'bg-slate-300'
  const headColor = active ? 'border-blue-500' : 'border-slate-300'

  return (
    <div className="absolute inset-x-0" style={{ height: ROW_H, top: 0 }}>
      {/* ラベル（白背景で生命線に重ならない） */}
      <div className="absolute left-1/2 top-1 -translate-x-1/2 whitespace-nowrap">
        <span
          className={`rounded bg-white px-1.5 text-[11px] font-bold ${active ? 'text-blue-700' : 'text-slate-500'}`}
        >
          {m.label}
        </span>
      </div>
      {/* 矢印の線 */}
      <div
        className={`absolute h-0.5 ${lineColor} ${broadcast ? 'opacity-70' : ''}`}
        style={{
          left: `${left}%`,
          width: `${width}%`,
          top: 34,
          backgroundImage: broadcast
            ? `repeating-linear-gradient(90deg, currentColor 0 5px, transparent 5px 9px)`
            : undefined,
          color: active ? 'rgb(59 130 246)' : 'rgb(203 213 225)',
          backgroundColor: broadcast ? 'transparent' : undefined,
        }}
      />
      {/* 矢印の先端 */}
      <div
        className={`absolute h-0 w-0 border-y-4 border-y-transparent ${headColor}`}
        style={
          rightward
            ? { left: `${toX}%`, top: 30, borderLeftWidth: 7, transform: 'translateX(-7px)' }
            : { left: `${toX}%`, top: 30, borderRightWidth: 7 }
        }
      />
    </div>
  )
}

export default function SequenceFigure({ figure }: { figure: SequenceFigureData }) {
  const { actors, messages } = figure
  const { index, next, prev, count } = useStepper(messages.length)
  const n = actors.length
  const indexOf = (id: string) => actors.findIndex((a) => a.id === id)
  const centerX = (i: number) => ((i + 0.5) / n) * 100

  return (
    <FigureFrame title={figure.title} caption={figure.caption} takeaway={figure.takeaway}>
      <div className="rounded-lg border border-slate-200 bg-slate-50/60 px-2 py-3 sm:px-3">
        {/* アクター見出し */}
        <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}>
          {actors.map((a) => (
            <ActorHead key={a.id} actor={a} />
          ))}
        </div>

        {/* ラダー（生命線＋全メッセージ。現在だけ強調） */}
        <div className="relative mt-2" style={{ height: messages.length * ROW_H }}>
          {actors.map((a, i) => (
            <div
              key={a.id}
              className="absolute bottom-0 top-0 w-px bg-slate-200"
              style={{ left: `${centerX(i)}%` }}
              aria-hidden="true"
            />
          ))}
          {messages.map((m, r) => (
            <div key={r} className="absolute inset-x-0" style={{ top: r * ROW_H, height: ROW_H }}>
              <MessageRow m={m} fromX={centerX(indexOf(m.from))} toX={centerX(indexOf(m.to))} active={r === index} />
            </div>
          ))}
        </div>
      </div>

      <p className="mt-2 flex h-12 items-start text-sm leading-relaxed text-slate-700">{messages[index].note}</p>

      <div className="mt-2">
        <StepperControls index={index} count={count} onPrev={prev} onNext={next} />
      </div>
    </FigureFrame>
  )
}
