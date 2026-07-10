import type { RadioRangeFigure as RadioRangeFigureData } from '../../../data/textbook/types'
import FigureFrame from './FigureFrame'
import StepperControls from './StepperControls'
import { useStepper } from './useStepper'

// 電波の届く範囲を円で描く固定構図（第14章 隠れ端末）。
// 左右の端末はどちらも上中央のAPに届くのに、互いの円には入らない＝隠れ端末の位置関係。
// 円の縁は破線（無線リンクの破線と同じ文法）。円の外周が図の端で少し切れるのは「電波の広がり」として許容。

const W = 320
const H = 214
const A = { x: 96, y: 164 } // 左の端末（中心）
const B = { x: 224, y: 164 } // 右の端末
const AP = { x: 160, y: 84 } // 上中央のAP
const R = 110 // 電波の届く半径: A→AP≈102（届く）・A→B=128（届かない）

const LEAF = { w: 104, h: 44 }
const SW = { w: 92, h: 34 }

const SKY = { fill: '#eff6ff', stroke: '#60a5fa', text: '#1e40af' }
const CIRCLE_A = { fill: '#bae6fd', stroke: '#38bdf8', label: '#0369a1' }
const CIRCLE_B = { fill: '#a7f3d0', stroke: '#34d399', label: '#047857' }
const LINE_ACTIVE = '#2563eb'
const LINE_BLOCK = '#f43f5e'

function NodeBox({ cx, cy, w, h, label }: { cx: number; cy: number; w: number; h: number; label: string }) {
  return (
    <g>
      <rect x={cx - w / 2} y={cy - h / 2} width={w} height={h} rx={10} fill={SKY.fill} stroke={SKY.stroke} strokeWidth={1.6} />
      <text x={cx} y={cy + 4} textAnchor="middle" fontSize="12" fontWeight="800" fill={SKY.text}>
        {label}
      </text>
    </g>
  )
}

export default function RadioRangeFigure({ figure }: { figure: RadioRangeFigureData }) {
  const { index, setIndex, next, prev, count } = useStepper(figure.steps.length)
  const step = figure.steps[index]
  const showRight = step.show === 'both'

  return (
    <FigureFrame title={figure.title} caption={figure.caption} takeaway={figure.takeaway}>
      <div className="rounded-lg border border-slate-200 bg-slate-50/60 px-2 py-2.5 sm:px-3">
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: 360, height: 'auto', display: 'block', margin: '0 auto' }} role="img">
          {/* 電波の届く範囲（円）。縁は破線＝無線の文法 */}
          <circle cx={A.x} cy={A.y} r={R} fill={CIRCLE_A.fill} fillOpacity={0.4} stroke={CIRCLE_A.stroke} strokeWidth={1.6} strokeDasharray="4 4" />
          <text x={72} y={58} textAnchor="middle" fontSize="10" fontWeight="800" fill={CIRCLE_A.label}>
            {figure.leftLabel}の電波
          </text>
          {showRight && (
            <>
              <circle cx={B.x} cy={B.y} r={R} fill={CIRCLE_B.fill} fillOpacity={0.4} stroke={CIRCLE_B.stroke} strokeWidth={1.6} strokeDasharray="4 4" />
              <text x={248} y={58} textAnchor="middle" fontSize="10" fontWeight="800" fill={CIRCLE_B.label}>
                {figure.rightLabel}の電波
              </text>
            </>
          )}

          {/* 同時送信→APで衝突（✕） */}
          {step.collide && (
            <>
              <line x1={A.x} y1={A.y - LEAF.h / 2} x2={AP.x} y2={AP.y + SW.h / 2} stroke={LINE_ACTIVE} strokeWidth={3} />
              <line x1={B.x} y1={B.y - LEAF.h / 2} x2={AP.x} y2={AP.y + SW.h / 2} stroke={LINE_ACTIVE} strokeWidth={3} />
              <text x={AP.x} y={AP.y + SW.h / 2 + 24} textAnchor="middle" fontSize="20" fontWeight="700" fill={LINE_BLOCK}>
                ✕
              </text>
            </>
          )}

          <NodeBox cx={AP.x} cy={AP.y} w={SW.w} h={SW.h} label={figure.apLabel} />
          <NodeBox cx={A.x} cy={A.y} w={LEAF.w} h={LEAF.h} label={figure.leftLabel} />
          <NodeBox cx={B.x} cy={B.y} w={LEAF.w} h={LEAF.h} label={figure.rightLabel} />
        </svg>
      </div>

      <p aria-live="polite" className="mt-2 flex h-12 items-start text-sm leading-relaxed text-slate-700">{step.explanation}</p>

      <div className="mt-2">
        <StepperControls index={index} count={count} onPrev={prev} onNext={next} onSelect={setIndex} />
      </div>
    </FigureFrame>
  )
}
