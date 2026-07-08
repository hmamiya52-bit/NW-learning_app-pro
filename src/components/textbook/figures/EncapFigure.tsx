import { useEffect, useMemo, useRef } from 'react'
import { ArrowDown, ArrowRight, ArrowUp } from 'lucide-react'
import type { EncapFigure as EncapFigureData } from '../../../data/textbook/types'
import FigureFrame from './FigureFrame'
import StepperControls from './StepperControls'
import { TONE } from './figureTokens'
import { useIsNarrow } from './useIsNarrow'
import { useStepper } from './useStepper'

type Level = EncapFigureData['levels'][number]

// 各ステップは「前（包む/外す前）」と「後」の2状態を持ち、増えた／外れた層を強調して見比べさせる。
interface EncapStep {
  phase: 'send' | 'receive'
  beforeDepth: number
  afterDepth: number
  changedIdx: number // levels の何番目の層が増えた（send）／外れた（receive）か
  action: string
  desc: string
}

function buildSteps(levels: Level[]): EncapStep[] {
  const n = levels.length
  const steps: EncapStep[] = []
  // 送信側：内側から1層ずつ包む（depth 1..n）。増える層は各ステップの最も外側。
  for (let d = 1; d <= n; d++) {
    const idx = n - d
    const lv = levels[idx]
    const beforeUnit = d === 1 ? 'データ' : levels[idx + 1].unit
    steps.push({
      phase: 'send',
      beforeDepth: d - 1,
      afterDepth: d,
      changedIdx: idx,
      action: `＋ ${lv.header}`,
      desc: `${beforeUnit}を${lv.layerLabel}で包むと、${lv.unit}になります。${lv.trailer ? `末尾に${lv.trailer}も付きます。` : ''}`,
    })
  }
  // 受信側：外側から1層ずつ外す（after depth n-1..0）。外れる層は「前」の最も外側。
  for (let d = n - 1; d >= 0; d--) {
    const idx = n - (d + 1)
    const lv = levels[idx]
    steps.push({
      phase: 'receive',
      beforeDepth: d + 1,
      afterDepth: d,
      changedIdx: idx,
      action: `− ${lv.header} を外す`,
      desc:
        d > 0
          ? `外側の${lv.layerLabel}を外すと、中から${levels[idx + 1].unit}が出てきます。`
          : `最後に${lv.layerLabel}を外し、中のデータをアプリへ渡します。`,
    })
  }
  return steps
}

function DataBox({ label }: { label: string }) {
  return (
    <div className="flex flex-1 items-center justify-center rounded-md border border-slate-300 bg-slate-50 px-1.5 py-2 text-center text-[10px] font-black leading-tight text-slate-600">
      {label}
    </div>
  )
}

// 入れ子（常に横方向＝背を低く保つ）。idx を最も外側として内側へ再帰。
// highlightIdx の層に、増（violet）／減（rose）の枠とバッジを付ける。
function Nest({
  levels,
  idx,
  dataLabel,
  highlightIdx,
  highlightStyle,
}: {
  levels: Level[]
  idx: number
  dataLabel: string
  highlightIdx: number
  highlightStyle: 'add' | 'remove' | null
}) {
  const lv = levels[idx]
  const t = TONE[lv.tone]
  const hl = idx === highlightIdx
  const ring = hl
    ? highlightStyle === 'remove'
      ? 'ring-2 ring-rose-400 ring-offset-1'
      : 'ring-2 ring-violet-500 ring-offset-1'
    : ''
  const inner =
    idx < levels.length - 1 ? (
      <Nest levels={levels} idx={idx + 1} dataLabel={dataLabel} highlightIdx={highlightIdx} highlightStyle={highlightStyle} />
    ) : (
      <DataBox label={dataLabel} />
    )
  return (
    <div className={`flex-1 rounded-lg border-2 ${t.border} ${t.fill} p-1 ${ring}`}>
      <div className={`mb-1 flex items-center gap-1 text-[9px] font-black leading-none ${t.text}`}>
        <span className="truncate">
          {lv.unit}
          <span className="font-bold opacity-70">（{lv.layerLabel}）</span>
        </span>
        {hl && (
          <span
            className={`flex-shrink-0 rounded px-1 py-px text-[9px] font-black ${
              highlightStyle === 'remove' ? 'bg-rose-100 text-rose-700' : 'bg-violet-100 text-violet-700'
            }`}
          >
            {highlightStyle === 'remove' ? '外す' : '＋増えた'}
          </span>
        )}
      </div>
      <div className="flex flex-row items-stretch gap-1">
        <div className={`flex flex-shrink-0 items-center justify-center rounded-md border ${t.border} bg-white px-1 py-1 text-center text-[9px] font-black leading-tight ${t.text}`}>
          {lv.header}
        </div>
        {inner}
        {lv.trailer && (
          <div className={`flex flex-shrink-0 items-center justify-center rounded-md border ${t.border} bg-white px-1 py-1 text-center text-[9px] font-black leading-tight ${t.text}`}>
            {lv.trailer}
          </div>
        )}
      </div>
    </div>
  )
}

function Panel({
  levels,
  depth,
  dataLabel,
  label,
  labelTone,
  highlightIdx,
  highlightStyle,
  narrow,
}: {
  levels: Level[]
  depth: number
  dataLabel: string
  label: string
  labelTone: string
  highlightIdx: number
  highlightStyle: 'add' | 'remove' | null
  narrow: boolean
}) {
  const n = levels.length
  const startIdx = n - depth
  return (
    <div className={`min-w-0 ${narrow ? 'w-full' : 'flex-1'}`}>
      <div className={`mb-1 text-[10px] font-black ${labelTone}`}>{label}</div>
      {depth === 0 ? (
        <div className="mx-auto max-w-[180px]">
          <DataBox label={dataLabel} />
        </div>
      ) : (
        <div className="flex">
          <Nest levels={levels} idx={startIdx} dataLabel={dataLabel} highlightIdx={highlightIdx} highlightStyle={highlightStyle} />
        </div>
      )}
    </div>
  )
}

export default function EncapFigure({ figure }: { figure: EncapFigureData }) {
  const narrow = useIsNarrow(560)
  const steps = useMemo(() => buildSteps(figure.levels), [figure.levels])
  const { index, setIndex, next, prev, count } = useStepper(steps.length)
  const step = steps[index]
  const isSend = step.phase === 'send'
  const hlStyle: 'add' | 'remove' = isSend ? 'add' : 'remove'
  // 増えた層は「後」に、外れる層は「前」にある。ハイライトはその側だけに出す。
  const beforeHl = isSend ? -1 : step.changedIdx
  const afterHl = isSend ? step.changedIdx : -1

  const stageRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = stageRef.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    el.animate([{ opacity: 0.5 }, { opacity: 1 }], { duration: 280, easing: 'ease' })
  }, [index])

  const Arrow = narrow ? ArrowDown : ArrowRight

  return (
    <FigureFrame title={figure.title} caption={figure.caption} takeaway={figure.takeaway}>
      {/* 送受信フェーズ */}
      <div
        className={`mb-2 inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-black ${
          isSend ? 'bg-violet-50 text-violet-800' : 'bg-emerald-50 text-emerald-800'
        }`}
      >
        {isSend ? <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" /> : <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />}
        {isSend ? '送信側：包んでいく（カプセル化）' : '受信側：外していく（デカプセル化）'}
      </div>

      <div className={`flex ${narrow ? 'h-[348px]' : 'h-[196px]'} items-center rounded-lg border border-slate-200 bg-slate-50/60 p-2.5`}>
        <div ref={stageRef} key={index} className={`flex w-full items-center justify-center gap-2 ${narrow ? 'flex-col' : 'flex-row'}`}>
          <Panel
            levels={figure.levels}
            depth={step.beforeDepth}
            dataLabel={figure.dataLabel}
            label="前"
            labelTone="text-slate-400"
            highlightIdx={beforeHl}
            highlightStyle={hlStyle}
            narrow={narrow}
          />
          <div className={`flex flex-shrink-0 items-center gap-1 ${narrow ? 'flex-row' : 'flex-col'} ${isSend ? 'text-violet-700' : 'text-rose-700'}`}>
            <Arrow className="h-4 w-4" aria-hidden="true" />
            <span className="whitespace-nowrap rounded bg-white px-1.5 py-0.5 text-[10px] font-black shadow-sm">{step.action}</span>
          </div>
          <Panel
            levels={figure.levels}
            depth={step.afterDepth}
            dataLabel={figure.dataLabel}
            label="後"
            labelTone={isSend ? 'text-violet-700' : 'text-emerald-700'}
            highlightIdx={afterHl}
            highlightStyle={hlStyle}
            narrow={narrow}
          />
        </div>
      </div>

      <p aria-live="polite" className="mt-3 flex h-10 items-start overflow-hidden text-xs leading-relaxed text-slate-600">{step.desc}</p>

      <div className="mt-2">
        <StepperControls index={index} count={count} onPrev={prev} onNext={next} onSelect={setIndex} />
      </div>
    </FigureFrame>
  )
}
