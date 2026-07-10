import type { Ipv6AddressFigure as Ipv6AddressFigureData } from '../../../data/textbook/types'
import FigureFrame from './FigureFrame'
import StepperControls from './StepperControls'
import { useStepper } from './useStepper'

// IPv6アドレスの構造。8グループを4×2段（上段=前半64ビット・下段=後半64ビット）で固定表示し、
// ステップで「フル表記 → 省略 → 前半/後半の色分け」と見え方だけを変える（構造固定＝ボタン不動）。
// 配色は SubnetCalcFigure と同じ（ネットワーク=緑／ホスト=グレー）。

// 先頭の連続する0を薄く表示する（省略ステップ以降）。'0000' は全部薄くせず後続処理（amber）で扱う。
function GroupText({ text, dimLeadingZeros }: { text: string; dimLeadingZeros: boolean }) {
  if (!dimLeadingZeros) return <>{text}</>
  const m = text.match(/^(0+)(.+)$/)
  if (!m) return <>{text}</>
  return (
    <>
      <span className="text-slate-300">{m[1]}</span>
      {m[2]}
    </>
  )
}

export default function Ipv6AddressFigure({ figure }: { figure: Ipv6AddressFigureData }) {
  const { index, setIndex, next, prev, count } = useStepper(figure.steps.length)
  const step = figure.steps[index]
  const prefixGroups = figure.prefixGroups ?? 4
  const full = figure.groups.join(':')

  const cellClass = (gi: number) => {
    const isZero = figure.groups[gi] === '0000'
    if (step.mode === 'structure') {
      return gi < prefixGroups ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
    }
    if (step.mode === 'compressed' && isZero) {
      return 'bg-amber-100 text-amber-700'
    }
    return 'bg-slate-100 text-slate-700'
  }

  return (
    <FigureFrame title={figure.title} caption={figure.caption} takeaway={figure.takeaway}>
      {/* 凡例（常時表示＝高さ固定。色分け自体は最終ステップで適用） */}
      <div className="flex items-center gap-4 text-[11px] font-bold">
        <span className="flex items-center gap-1.5 text-emerald-700">
          <span className="inline-block h-3 w-3 rounded-sm border border-emerald-300 bg-emerald-100" />
          前半64ビット＝ネットワーク
        </span>
        <span className="flex items-center gap-1.5 text-slate-500">
          <span className="inline-block h-3 w-3 rounded-sm border border-slate-300 bg-slate-100" />
          後半＝ホスト
        </span>
      </div>

      {/* 8グループ（4×2段。上段=前半・下段=後半） */}
      <div className="mt-2 space-y-1">
        {[0, 1].map((row) => (
          <div key={row} className="grid grid-cols-4 gap-1">
            {figure.groups.slice(row * 4, row * 4 + 4).map((g, i) => {
              const gi = row * 4 + i
              return (
                <span
                  key={gi}
                  className={`flex h-9 items-center justify-center rounded font-mono text-sm font-bold tabular-nums ${cellClass(gi)}`}
                >
                  <GroupText text={g} dimLeadingZeros={step.mode !== 'full'} />
                </span>
              )
            })}
          </div>
        ))}
      </div>

      {/* いまの表記（ステップで フル → 省略 に変わる）。フル表記はスマホで2行になるため高さを固定。 */}
      <div className="mt-2 rounded-lg bg-slate-50 px-3 py-1.5">
        <p className="text-[10px] font-bold text-slate-400">いまの表記</p>
        <p className={`flex h-9 items-start break-all font-mono text-[11px] font-black leading-tight ${step.mode === 'full' ? 'text-slate-700' : 'text-blue-800'}`}>
          {step.mode === 'full' ? full : figure.compressed}
        </p>
      </div>

      <p aria-live="polite" className="mt-2 flex h-12 items-start text-sm leading-relaxed text-slate-700">{step.explanation}</p>

      <div className="mt-2">
        <StepperControls index={index} count={count} onPrev={prev} onNext={next} onSelect={setIndex} />
      </div>
    </FigureFrame>
  )
}
