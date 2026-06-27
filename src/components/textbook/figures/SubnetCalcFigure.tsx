import type { SubnetCalcFigure as SubnetCalcFigureData } from '../../../data/textbook/types'
import FigureFrame from './FigureFrame'
import StepperControls from './StepperControls'
import { useStepper } from './useStepper'

// IPの「ネットワーク部（緑）／ホスト部（グレー）」をビットで色分け。
// オクテットを縦4行に並べ（横スクロール回避）、プレフィックス位置に境界線。下に算出結果。

function toDotted(n: number): string {
  return [24, 16, 8, 0].map((s) => (n >>> s) & 255).join('.')
}

export default function SubnetCalcFigure({ figure }: { figure: SubnetCalcFigureData }) {
  const { index, next, prev, count } = useStepper(figure.steps.length)
  const step = figure.steps[index]
  const prefix = step.prefix

  const octets = figure.ip.split('.').map((s) => parseInt(s, 10))
  const ipInt = octets.reduce((acc, o) => ((acc << 8) | o) >>> 0, 0)
  const mask = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0
  const network = (ipInt & mask) >>> 0
  const broadcast = (network | (~mask >>> 0)) >>> 0
  const total = 2 ** (32 - prefix)
  const usable = total > 2 ? total - 2 : total
  const firstHost = toDotted((network + 1) >>> 0)
  const lastHost = toDotted((broadcast - 1) >>> 0)

  return (
    <FigureFrame title={figure.title} caption={figure.caption} takeaway={figure.takeaway}>
      {/* ヘッダ: IP/プレフィックスとマスク */}
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 rounded-lg bg-slate-50 px-3 py-2">
        <span className="text-sm font-black text-slate-800">
          {figure.ip} <span className="text-blue-700">/{prefix}</span>
        </span>
        <span className="text-[11px] font-bold text-slate-500">マスク {toDotted(mask)}</span>
      </div>

      {/* 凡例 */}
      <div className="mt-2 flex items-center gap-4 text-[11px] font-bold">
        <span className="flex items-center gap-1.5 text-emerald-700">
          <span className="inline-block h-3 w-3 rounded-sm border border-emerald-300 bg-emerald-100" />
          ネットワーク部
        </span>
        <span className="flex items-center gap-1.5 text-slate-500">
          <span className="inline-block h-3 w-3 rounded-sm border border-slate-300 bg-slate-100" />
          ホスト部
        </span>
      </div>

      {/* 4オクテット × 8ビット */}
      <div className="mt-2 space-y-1">
        {octets.map((o, oi) => {
          const bits = o.toString(2).padStart(8, '0').split('')
          return (
            <div key={oi} className="flex items-center gap-2">
              <span className="w-9 flex-shrink-0 text-right text-sm font-black tabular-nums text-slate-700">{o}</span>
              <div className="flex flex-1 gap-0.5">
                {bits.map((b, bi) => {
                  const gi = oi * 8 + bi
                  const isNet = gi < prefix
                  const isBoundary = gi === prefix // ホスト部の先頭＝境界
                  return (
                    <span
                      key={bi}
                      className={`flex h-7 flex-1 items-center justify-center rounded text-xs font-bold tabular-nums ${
                        isNet ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-400'
                      } ${isBoundary ? 'border-l-2 border-blue-500' : ''}`}
                    >
                      {b}
                    </span>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* 算出結果 */}
      <dl className="mt-3 space-y-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs">
        <div className="flex gap-2">
          <dt className="w-[7.5rem] flex-shrink-0 font-bold text-slate-400">ネットワークアドレス</dt>
          <dd className="font-black text-slate-800 tabular-nums">{toDotted(network)}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="w-[7.5rem] flex-shrink-0 font-bold text-slate-400">ブロードキャスト</dt>
          <dd className="font-black text-slate-800 tabular-nums">{toDotted(broadcast)}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="w-[7.5rem] flex-shrink-0 font-bold text-slate-400">使えるホスト</dt>
          <dd className="font-black text-blue-800 tabular-nums">
            {firstHost} 〜 {lastHost}（{usable}台）
          </dd>
        </div>
      </dl>

      <p className="mt-2 flex h-10 items-start text-sm leading-relaxed text-slate-700">{step.note}</p>

      <div className="mt-2">
        <StepperControls index={index} count={count} onPrev={prev} onNext={next} />
      </div>
    </FigureFrame>
  )
}
