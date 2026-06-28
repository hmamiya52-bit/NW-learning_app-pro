import type { SegmentMapFigure as SegmentMapFigureData } from '../../../data/textbook/types'
import FigureFrame from './FigureFrame'
import StepperControls from './StepperControls'
import { useStepper } from './useStepper'

// セグメント構成図（SVG）。ルータが2つのネットワークをつなぐ。
// ホストIPからネットワークアドレスをステップで導いて図に書き込み、ルータの両端IP（GW）も図中に表示。

const TONE_COLOR: Record<string, { fill: string; stroke: string; text: string }> = {
  emerald: { fill: '#ecfdf5', stroke: '#34d399', text: '#065f46' },
  violet: { fill: '#f5f3ff', stroke: '#a78bfa', text: '#5b21b6' },
  sky: { fill: '#eff6ff', stroke: '#60a5fa', text: '#1e40af' },
  amber: { fill: '#fffbeb', stroke: '#fbbf24', text: '#92400e' },
  rose: { fill: '#fff1f2', stroke: '#fb7185', text: '#9f1239' },
  slate: { fill: '#f1f5f9', stroke: '#94a3b8', text: '#334155' },
}
const ACCENT = '#2563eb'
const MUTED = '#94a3b8'

const W = 320
const SEG_H = 80
const ROUTER_H = 38
const GAP = 30
const SEG0_Y = 8
const ROUTER_Y = SEG0_Y + SEG_H + GAP // 118
const SEG1_Y = ROUTER_Y + ROUTER_H + GAP // 186
const HEIGHT = SEG1_Y + SEG_H + 8 // 282
const CX = W / 2

function Segment({
  y,
  seg,
  showNetwork,
  highlight,
}: {
  y: number
  seg: SegmentMapFigureData['segments'][number]
  showNetwork: boolean
  highlight: boolean
}) {
  const t = TONE_COLOR[seg.tone] ?? TONE_COLOR.sky
  return (
    <g>
      {/* セグメントの枠（ゾーン） */}
      <rect
        x={14}
        y={y}
        width={W - 28}
        height={SEG_H}
        rx={10}
        fill={t.fill}
        stroke={highlight ? ACCENT : t.stroke}
        strokeWidth={highlight ? 2.4 : 1.4}
        strokeDasharray="5 4"
      />
      <text x={26} y={y + 18} fontSize="11" fontWeight="700" fill={t.text}>
        {seg.label}
      </text>
      {/* PCノード */}
      <rect x={24} y={y + 28} width={86} height={42} rx={8} fill="#ffffff" stroke={t.stroke} strokeWidth={1.4} />
      <text x={67} y={y + 46} textAnchor="middle" fontSize="11" fontWeight="700" fill={t.text}>
        {seg.nodeLabel}
      </text>
      <text x={67} y={y + 60} textAnchor="middle" fontSize="9" fill="#64748b">
        端末
      </text>
      {/* ホスト／ネットワークアドレス */}
      <text x={122} y={y + 42} fontSize="10.5" fill="#334155">
        <tspan fontWeight="700" fill="#64748b">ホスト　</tspan>
        <tspan fontWeight="700">{seg.host}</tspan>
      </text>
      <text x={122} y={y + 62} fontSize="10.5">
        <tspan fontWeight="700" fill="#64748b">ネットワーク　</tspan>
        {showNetwork ? (
          <tspan fontWeight="700" fill={ACCENT}>{seg.network}</tspan>
        ) : (
          <tspan fontWeight="700" fill={MUTED}>？</tspan>
        )}
      </text>
    </g>
  )
}

export default function SegmentMapFigure({ figure }: { figure: SegmentMapFigureData }) {
  const { index, next, prev, count } = useStepper(figure.steps.length)
  const step = figure.steps[index]
  const segs = figure.segments
  const routerHi = step.highlight === segs.length

  return (
    <FigureFrame title={figure.title} caption={figure.caption} takeaway={figure.takeaway}>
      <div className="rounded-lg border border-slate-200 bg-slate-50/60 px-2 py-2.5 sm:px-3">
        <svg viewBox={`0 0 ${W} ${HEIGHT}`} style={{ width: '100%', maxWidth: 380, height: 'auto', display: 'block', margin: '0 auto' }} role="img">
          {/* 接続線（セグメント0→ルータ→セグメント1） */}
          <line x1={CX} y1={SEG0_Y + SEG_H} x2={CX} y2={ROUTER_Y} stroke={MUTED} strokeWidth={2} />
          <line x1={CX} y1={ROUTER_Y + ROUTER_H} x2={CX} y2={SEG1_Y} stroke={MUTED} strokeWidth={2} />

          {/* ルータ両端のIP（GW）。ステップで表示 */}
          {step.gateways && segs[0] && (
            <g>
              <rect x={CX + 6} y={ROUTER_Y - 23} width={108} height={16} rx={5} fill="#ffffff" stroke={ACCENT} strokeWidth={1} />
              <text x={CX + 12} y={ROUTER_Y - 11} fontSize="9.5" fontWeight="700" fill={ACCENT}>
                {segs[0].gw}
              </text>
            </g>
          )}
          {step.gateways && segs[1] && (
            <g>
              <rect x={CX + 6} y={ROUTER_Y + ROUTER_H + 7} width={108} height={16} rx={5} fill="#ffffff" stroke={ACCENT} strokeWidth={1} />
              <text x={CX + 12} y={ROUTER_Y + ROUTER_H + 19} fontSize="9.5" fontWeight="700" fill={ACCENT}>
                {segs[1].gw}
              </text>
            </g>
          )}

          {/* セグメント0 */}
          {segs[0] && (
            <Segment y={SEG0_Y} seg={segs[0]} showNetwork={step.networks >= 1} highlight={step.highlight === 0} />
          )}

          {/* ルータ */}
          <rect
            x={CX - 44}
            y={ROUTER_Y}
            width={88}
            height={ROUTER_H}
            rx={8}
            fill={routerHi ? ACCENT : TONE_COLOR.slate.fill}
            stroke={routerHi ? '#1d4ed8' : TONE_COLOR.slate.stroke}
            strokeWidth={routerHi ? 2.4 : 1.4}
          />
          <text x={CX} y={ROUTER_Y + 17} textAnchor="middle" fontSize="12" fontWeight="700" fill={routerHi ? '#ffffff' : TONE_COLOR.slate.text}>
            {figure.routerLabel}
          </text>
          <text x={CX} y={ROUTER_Y + 30} textAnchor="middle" fontSize="9" fill={routerHi ? '#dbeafe' : '#64748b'}>
            デフォルトGW
          </text>

          {/* セグメント1 */}
          {segs[1] && (
            <Segment y={SEG1_Y} seg={segs[1]} showNetwork={step.networks >= 2} highlight={step.highlight === 1} />
          )}
        </svg>
      </div>

      <p className="mt-2 flex h-12 items-start text-sm leading-relaxed text-slate-700">{step.note}</p>

      <div className="mt-2">
        <StepperControls index={index} count={count} onPrev={prev} onNext={next} />
      </div>
    </FigureFrame>
  )
}
