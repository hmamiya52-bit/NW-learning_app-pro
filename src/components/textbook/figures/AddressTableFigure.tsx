import type { AddressTableFigure as AddressTableFigureData } from '../../../data/textbook/types'
import FigureFrame from './FigureFrame'
import { TONE } from './figureTokens'

// スマホでも横スクロールしないよう、表ではなくカードの縦/グリッド配置にする。
export default function AddressTableFigure({ figure }: { figure: AddressTableFigureData }) {
  const labels = figure.fieldLabels ?? { carries: '何を示すか', scope: '届く範囲', example: '例' }
  // 2枚の対比は2カラムで幅いっぱいに（3カラムだと右1/3が空く）。「例」の等幅は既定軸（アドレス例示）のみ。
  const gridCols = figure.rows.length === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-3'
  const exampleClass = figure.fieldLabels ? 'text-xs leading-relaxed text-slate-600' : 'font-mono text-[11px] text-slate-600'
  return (
    <FigureFrame title={figure.title} caption={figure.caption} takeaway={figure.takeaway}>
      <div className={`grid grid-cols-1 gap-2 ${gridCols}`}>
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
                  <dt className="text-[10px] font-bold text-slate-400">{labels.carries}</dt>
                  <dd className="text-xs font-bold text-slate-700">{row.carries}</dd>
                </div>
                <div>
                  <dt className="text-[10px] font-bold text-slate-400">{labels.scope}</dt>
                  <dd className="text-xs leading-relaxed text-slate-600">{row.scope}</dd>
                </div>
                <div>
                  <dt className="text-[10px] font-bold text-slate-400">{labels.example}</dt>
                  <dd className={exampleClass}>{row.example}</dd>
                </div>
              </dl>
            </div>
          )
        })}
      </div>
    </FigureFrame>
  )
}
