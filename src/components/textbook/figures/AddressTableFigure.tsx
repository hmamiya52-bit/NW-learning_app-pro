import type { AddressTableFigure as AddressTableFigureData } from '../../../data/textbook/types'
import FigureFrame from './FigureFrame'
import { TONE } from './figureTokens'

// スマホでも横スクロールしないよう、表ではなくカードの縦/グリッド配置にする。
export default function AddressTableFigure({ figure }: { figure: AddressTableFigureData }) {
  return (
    <FigureFrame title={figure.title} caption={figure.caption} takeaway={figure.takeaway}>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        {figure.rows.map((row) => {
          const tone = TONE[row.tone]
          return (
            <div key={row.name} className={`overflow-hidden rounded-lg border ${tone.border} bg-white`}>
              <div className={`flex items-center justify-between ${tone.fill} px-3 py-2`}>
                <p className={`text-sm font-black ${tone.text}`}>{row.name}</p>
                <span className={`rounded ${tone.soft} px-1.5 py-0.5 text-[10px] font-black ${tone.text}`}>{row.layer}</span>
              </div>
              <dl className="space-y-1.5 px-3 py-2.5">
                <div>
                  <dt className="text-[10px] font-bold text-slate-400">何を示すか</dt>
                  <dd className="text-xs font-bold text-slate-700">{row.carries}</dd>
                </div>
                <div>
                  <dt className="text-[10px] font-bold text-slate-400">届く範囲</dt>
                  <dd className="text-xs leading-relaxed text-slate-600">{row.scope}</dd>
                </div>
                <div>
                  <dt className="text-[10px] font-bold text-slate-400">例</dt>
                  <dd className="font-mono text-[11px] text-slate-600">{row.example}</dd>
                </div>
              </dl>
            </div>
          )
        })}
      </div>
    </FigureFrame>
  )
}
