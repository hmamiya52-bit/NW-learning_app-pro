import type { EncapFigure as EncapFigureData } from '../../../data/textbook/types'
import FigureFrame from './FigureFrame'
import StepperControls from './StepperControls'
import { TONE } from './figureTokens'
import { useStepper } from './useStepper'

export default function EncapFigure({ figure }: { figure: EncapFigureData }) {
  const { index, next, prev, playing, togglePlay, count } = useStepper(figure.steps.length, 1400)
  const step = figure.steps[index]

  return (
    <FigureFrame title={figure.title} caption={figure.caption} takeaway={figure.takeaway}>
      <div className="rounded-lg border border-slate-200 bg-slate-50/60 px-3 py-4">
        <div className="mb-3 flex items-center justify-between">
          <span className={`rounded-md ${TONE.slate.soft} px-2 py-0.5 text-[11px] font-black text-slate-600`}>
            {step.label}
          </span>
          <span className="text-[11px] font-black text-slate-400">
            {index + 1} / {count}
          </span>
        </div>

        {/* 現在のデータ構造（ヘッダが積み上がる） */}
        <div className="flex flex-wrap items-stretch gap-1">
          {step.parts.map((part, i) => {
            const tone = TONE[part.tone]
            return (
              <div
                key={`${part.label}-${i}`}
                className={`flex min-w-[52px] flex-1 items-center justify-center rounded-md border-2 ${tone.border} ${tone.fill} px-2 py-3 text-center text-[11px] font-black ${tone.text}`}
              >
                {part.label}
              </div>
            )
          })}
        </div>

        <p className="mt-3 text-sm font-black text-slate-800">{step.title}</p>
        <p className="mt-0.5 text-xs leading-relaxed text-slate-600">{step.desc}</p>
      </div>

      <div className="mt-3">
        <StepperControls index={index} count={count} playing={playing} onPrev={prev} onNext={next} onTogglePlay={togglePlay} />
      </div>
    </FigureFrame>
  )
}
