import { ArrowDown, ArrowUp } from 'lucide-react'
import type { EncapFigure as EncapFigureData } from '../../../data/textbook/types'
import FigureFrame from './FigureFrame'
import { TONE } from './figureTokens'
import { useIsNarrow } from './useIsNarrow'

function Cell({ label, tone }: { label: string; tone: keyof typeof TONE }) {
  const t = TONE[tone]
  return (
    <div className={`flex items-center justify-center rounded-md border ${t.border} bg-white px-2 py-2 text-center text-[11px] font-black ${t.text}`}>
      {label}
    </div>
  )
}

function Level({
  levels,
  idx,
  dataLabel,
  narrow,
}: {
  levels: EncapFigureData['levels']
  idx: number
  dataLabel: string
  narrow: boolean
}) {
  const lv = levels[idx]
  const t = TONE[lv.tone]
  const inner =
    idx < levels.length - 1 ? (
      <Level levels={levels} idx={idx + 1} dataLabel={dataLabel} narrow={narrow} />
    ) : (
      <div className="flex flex-1 items-center justify-center rounded-md border border-slate-300 bg-slate-50 px-2 py-2 text-center text-[11px] font-black text-slate-600">
        {dataLabel}
      </div>
    )

  return (
    <div className={`rounded-lg border-2 ${t.border} ${t.fill} p-2`}>
      <div className={`mb-1.5 text-[11px] font-black ${t.text}`}>
        {lv.unit} <span className="font-bold opacity-70">（{lv.layerLabel}）</span>
      </div>
      <div className={`flex gap-1.5 ${narrow ? 'flex-col' : 'flex-row items-stretch'}`}>
        <Cell label={lv.header} tone={lv.tone} />
        {inner}
        {lv.trailer && <Cell label={lv.trailer} tone={lv.tone} />}
      </div>
    </div>
  )
}

export default function EncapFigure({ figure }: { figure: EncapFigureData }) {
  // 入れ子は横でもコンパクト。狭い画面のみ縦に積む。
  const narrow = useIsNarrow(480)
  return (
    <FigureFrame title={figure.title} caption={figure.caption} takeaway={figure.takeaway}>
      <Level levels={figure.levels} idx={0} dataLabel={figure.dataLabel} narrow={narrow} />

      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
        <div className="flex items-start gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2">
          <ArrowDown className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600" aria-hidden="true" />
          <p className="text-xs leading-relaxed text-blue-900">
            <span className="font-black">送信側</span>：内側から外へ包んでいく（カプセル化）
          </p>
        </div>
        <div className="flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2">
          <ArrowUp className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600" aria-hidden="true" />
          <p className="text-xs leading-relaxed text-emerald-900">
            <span className="font-black">受信側</span>：外側から外して中身を取り出す（デカプセル化）
          </p>
        </div>
      </div>
    </FigureFrame>
  )
}
