import { useEffect, useMemo, useRef } from 'react'
import { ArrowDown, ArrowUp } from 'lucide-react'
import type { EncapFigure as EncapFigureData } from '../../../data/textbook/types'
import FigureFrame from './FigureFrame'
import StepperControls from './StepperControls'
import { TONE } from './figureTokens'
import { useIsNarrow } from './useIsNarrow'
import { useStepper } from './useStepper'

type Level = EncapFigureData['levels'][number]

interface EncapStep {
  depth: number
  phase: 'send' | 'receive'
  action: string
  desc: string
}

function buildSteps(levels: Level[]): EncapStep[] {
  const n = levels.length
  const steps: EncapStep[] = [
    { depth: 0, phase: 'send', action: 'アプリのデータ', desc: 'まだ何も包まれていない、送りたい中身そのものです。' },
  ]
  for (let d = 1; d <= n; d++) {
    const lv = levels[n - d] // 新しく外側に付く層
    steps.push({
      depth: d,
      phase: 'send',
      action: `${lv.header}を付ける`,
      desc: `${lv.layerLabel}で包むと、${lv.unit}になります。${lv.trailer ? `末尾に${lv.trailer}も付きます。` : ''}`,
    })
  }
  for (let d = n - 1; d >= 0; d--) {
    const removed = levels[n - 1 - d] // 外した層
    const nowOuter = d > 0 ? levels[n - d] : null
    steps.push({
      depth: d,
      phase: 'receive',
      action: `${removed.header}を外す`,
      desc:
        nowOuter !== null
          ? `外側の${removed.layerLabel}を外すと、中から${nowOuter.unit}が出てきます。`
          : `最後に${removed.layerLabel}を外し、中のデータをアプリへ渡します。`,
    })
  }
  return steps
}

function Nest({ levels, idx, dataLabel, activeIdx, narrow }: { levels: Level[]; idx: number; dataLabel: string; activeIdx: number; narrow: boolean }) {
  const lv = levels[idx]
  const t = TONE[lv.tone]
  const active = idx === activeIdx
  const inner =
    idx < levels.length - 1 ? (
      <Nest levels={levels} idx={idx + 1} dataLabel={dataLabel} activeIdx={activeIdx} narrow={narrow} />
    ) : (
      <div className={`flex ${narrow ? '' : 'flex-1'} items-center justify-center rounded-md border border-slate-300 bg-slate-50 px-2 py-3 text-center text-[11px] font-black text-slate-600`}>
        {dataLabel}
      </div>
    )
  return (
    <div className={`rounded-lg border-2 ${t.border} ${t.fill} p-2 ${!narrow ? 'flex-1 min-w-0' : ''} ${active ? 'ring-2 ring-blue-400 ring-offset-1' : ''}`}>
      <div className={`mb-1.5 text-[11px] font-black ${t.text}`}>
        {lv.unit} <span className="font-bold opacity-70">（{lv.layerLabel}）</span>
      </div>
      <div className={`flex gap-1.5 ${narrow ? 'flex-col' : 'flex-row items-stretch'}`}>
        <div className={`flex flex-shrink-0 items-center justify-center rounded-md border ${t.border} bg-white px-2 py-2 text-center text-[11px] font-black ${t.text}`}>
          {lv.header}
        </div>
        {inner}
        {lv.trailer && (
          <div className={`flex flex-shrink-0 items-center justify-center rounded-md border ${t.border} bg-white px-2 py-2 text-center text-[11px] font-black ${t.text}`}>
            {lv.trailer}
          </div>
        )}
      </div>
    </div>
  )
}

export default function EncapFigure({ figure }: { figure: EncapFigureData }) {
  const narrow = useIsNarrow(480)
  const steps = useMemo(() => buildSteps(figure.levels), [figure.levels])
  const { index, next, prev, count } = useStepper(steps.length)
  const step = steps[index]
  const n = figure.levels.length
  const startIdx = n - step.depth // 現在の最も外側の層

  const stageRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = stageRef.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    el.animate(
      [
        { opacity: 0.45, transform: step.phase === 'send' ? 'scale(0.96)' : 'scale(1.04)' },
        { opacity: 1, transform: 'scale(1)' },
      ],
      { duration: 320, easing: 'ease' },
    )
  }, [index, step.phase])

  return (
    <FigureFrame title={figure.title} caption={figure.caption} takeaway={figure.takeaway}>
      {/* 送受信フェーズ */}
      <div
        className={`mb-2 inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-black ${
          step.phase === 'send' ? 'bg-blue-50 text-blue-800' : 'bg-emerald-50 text-emerald-800'
        }`}
      >
        {step.phase === 'send' ? <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" /> : <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />}
        {step.phase === 'send' ? '送信側：包んでいく（カプセル化）' : '受信側：外していく（デカプセル化）'}
      </div>

      <div className="flex min-h-[150px] items-center rounded-lg border border-slate-200 bg-slate-50/60 p-3">
        <div ref={stageRef} key={index} className="w-full">
          {step.depth === 0 ? (
            <div className="mx-auto flex max-w-[180px] items-center justify-center rounded-md border border-slate-300 bg-white px-3 py-4 text-center text-[11px] font-black text-slate-600">
              {figure.dataLabel}
            </div>
          ) : (
            <Nest levels={figure.levels} idx={startIdx} dataLabel={figure.dataLabel} activeIdx={startIdx} narrow={narrow} />
          )}
        </div>
      </div>

      <p className="mt-3 text-sm font-black text-slate-800">{step.action}</p>
      <p className="mt-0.5 min-h-[2.5rem] text-xs leading-relaxed text-slate-600">{step.desc}</p>

      <div className="mt-2">
        <StepperControls index={index} count={count} onPrev={prev} onNext={next} />
      </div>
    </FigureFrame>
  )
}
