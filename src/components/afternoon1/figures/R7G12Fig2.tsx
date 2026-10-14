import { Cap, FigSvg, Poly, Route } from './primitives'
import { LOGICAL, useFigureId } from './tokens'
import type { ExamFigureProps } from './tokens'

/**
 * 図2 インターネット通信量（ダウンロード）— R7 午後Ⅰ 問2
 *
 * 原図の折れ線グラフ（横軸は時刻 7:00〜15:00、縦軸は M ビット／秒で 0・100・200）を、原図の曲線を読み取った点
 * （時刻と通信量の組）から描き直した。点のあいだは Catmull-Rom の曲線でなめらかにつなぎ、細かい折れ線にして描く。
 * 軸・目盛りの数字・単位の書き方は原図どおり。
 *
 * 解説を開いたときは、約 200 M ビット／秒で頭打ちになった区間（8:00 過ぎ〜8:30 過ぎ）を赤でなぞる。
 */

type Pt = [number, number]

const SMALL = 7
const TEXT = '#334155'
/** 曲線の色（原図の黒い線。物理の線ではないので LOGICAL の濃さ） */
const CURVE = LOGICAL

/** 軸（y 軸の x、x 軸の y）と目盛り */
const X0 = 58
const Y0 = 150
const T0 = 6.4
const PX_PER_H = 26
const PX_PER_M = 0.55
const tx = (t: number) => +(X0 + (t - T0) * PX_PER_H).toFixed(2)
const vy = (v: number) => +(Y0 - v * PX_PER_M).toFixed(2)
const X_END = tx(16)
const HOURS = [7, 8, 9, 10, 11, 12, 13, 14, 15]

/** 原図の曲線から読み取った点（時刻, M ビット／秒） */
const DATA: Pt[] = [
  [6.45, 5],
  [7.0, 5],
  [7.42, 6],
  [7.71, 8],
  [7.85, 16],
  [7.93, 30],
  [7.98, 120],
  [8.02, 196],
  [8.08, 200],
  [8.45, 200],
  [8.55, 196],
  [8.71, 176],
  [8.86, 156],
  [9.0, 135],
  [9.14, 112],
  [9.29, 94],
  [9.43, 84],
  [9.57, 76],
  [9.72, 69],
  [9.86, 63],
  [10.01, 60],
  [10.15, 62],
  [10.29, 65],
  [10.44, 67],
  [10.72, 67],
  [11.01, 66],
  [11.16, 66],
  [11.3, 68],
  [11.44, 73],
  [11.59, 79],
  [11.73, 82],
  [11.87, 76],
  [12.02, 53],
  [12.16, 30],
  [12.31, 16],
  [12.45, 9],
  [12.59, 6],
  [12.74, 16],
  [12.88, 48],
  [13.02, 101],
  [13.17, 119],
  [13.31, 122],
  [13.46, 119],
  [13.6, 109],
  [13.74, 109],
  [13.89, 112],
  [14.03, 118],
  [14.17, 118],
  [14.32, 116],
  [14.46, 111],
  [14.61, 111],
  [14.75, 116],
  [14.89, 116],
  [15.04, 105],
  [15.18, 84],
  [15.32, 52],
  [15.47, 34],
  [15.61, 25],
  [15.76, 18],
  [15.9, 10],
]

/** Catmull-Rom の曲線を細かい折れ線にする（各区間を n 等分） */
function smooth(pts: Pt[], n: number): Pt[] {
  const out: Pt[] = []
  for (let i = 0; i + 1 < pts.length; i++) {
    const p0 = pts[Math.max(0, i - 1)]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[Math.min(pts.length - 1, i + 2)]
    for (let k = 0; k < n; k++) {
      const s = k / n
      const s2 = s * s
      const s3 = s2 * s
      const f = (a: number, b: number, c: number, d: number) =>
        0.5 * (2 * b + (-a + c) * s + (2 * a - 5 * b + 4 * c - d) * s2 + (-a + 3 * b - 3 * c + d) * s3)
      out.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])])
    }
  }
  out.push(pts[pts.length - 1])
  return out
}

/** 曲線（なめらかにしたときの行き過ぎを 0〜200 に収める） */
const CURVE_PTS: Pt[] = smooth(DATA, 6).map(([t, v]) => [tx(t), vy(Math.min(200, Math.max(0, v)))])
/** 頭打ちの区間（8:00 過ぎ〜8:30 過ぎ） */
const PLATEAU: Pt[] = smooth(DATA, 6)
  .filter(([t]) => t >= 8.04 && t <= 8.5)
  .map(([t, v]) => [tx(t), vy(Math.min(200, v))])

export default function R7G12Fig2({ highlight = false }: ExamFigureProps) {
  const arrow = useFigureId('r7g12-axis')
  return (
    <FigSvg w={340} h={172} title="図2 インターネット通信量（ダウンロード）">
      <defs>
        <marker id={arrow} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10" fill="none" stroke={TEXT} strokeWidth={1.4} />
        </marker>
      </defs>

      {/* ── 軸 ─────────────────────────────────────── */}
      <line x1={X0} y1={Y0} x2={X_END} y2={Y0} stroke={TEXT} strokeWidth={1} markerEnd={`url(#${arrow})`} />
      <line x1={X0} y1={Y0} x2={X0} y2={18} stroke={TEXT} strokeWidth={1} markerEnd={`url(#${arrow})`} />
      <Cap x={X0 - 4} y={30} text="(M ビット／秒)" anchor="end" size={SMALL} color={TEXT} />
      <Cap x={X0 - 4} y={vy(200) + 3} text="200" anchor="end" size={SMALL} color={TEXT} />
      <Cap x={X0 - 4} y={vy(100) + 3} text="100" anchor="end" size={SMALL} color={TEXT} />
      <Cap x={X0 - 6} y={Y0 + 10} text="0" anchor="end" size={SMALL} color={TEXT} />
      {HOURS.map((h) => (
        <Cap key={h} x={tx(h)} y={Y0 + 12} text={`${h}:00`} anchor="middle" size={SMALL} color={TEXT} />
      ))}
      <Cap x={X_END + 4} y={Y0 + 12} text="(時刻)" size={SMALL} color={TEXT} />

      {/* ── 強調：頭打ちの区間 ── */}
      {highlight && <Route points={PLATEAU} width={3.4} />}

      {/* ── 曲線 ───────────────────────────────────── */}
      <Poly points={CURVE_PTS} color={CURVE} width={1.6} />
    </FigSvg>
  )
}
