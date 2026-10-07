import { Box, Cap, FigSvg, Poly, Ring, Route, Wire } from './primitives'
import { FONT_SCALE, FRAME, LOGICAL, MUTED, SEGMENT, useFigureId } from './tokens'
import type { ExamFigureProps } from './tokens'

/**
 * 図2 K 社 NW と L 社クラウドサービスとの経路情報の交換の概要 — H29 午後Ⅰ 問3
 *
 * 原図どおり左に K 社、右に L 社クラウドサービスを並べた（組み直していない。縦横比 3.7:1）。2つの枠のあいだを
 * 「eBGP」の札が入る幅まで狭め、VPN ルータの箱を短くして 340 の幅に収めた。並びは原図どおり: K 社は左から L3SW、
 * 縦の VPN セグメントの線、VPNa1（上）・VPNb1（下）。2台のあいだに iBGP の両矢印、それぞれの下に「OSPF⟺BGP」。
 * L 社は VPNa2・VPNb2 と、右の縦のサーバセグメントの線。VPN トンネル（太い破線）の上に eBGP の両矢印を引き、
 * OSPF エリア（破線の角丸）は、VPN セグメントの周りと、2本のトンネルの周りの3つ。凡例（BGP ピアと OSPF エリアの見本）も
 * 原図どおり注記1 の右に描く。
 *
 * 色は役割だけで決めている。L3SW・VPNa1・VPNb1 は device、L 社クラウドサービスが提供する VPNa2・VPNb2 は outside。
 * BGP ピアの両矢印とトンネルは物理の線ではないので LOGICAL。
 *
 * 解説を開いたときは、L3SW から VPNa1・トンネル・VPNa2 を通ってサーバセグメントへ向かう道筋（平常時のアクティブ側。設問3(3)）を
 * なぞり、スタンバイの VPNb1 に輪を付ける。
 */

type Rect = { x: number; y: number; w: number; h: number }

const SIZE = 7.5
const SMALL = 7
const TEXT = '#334155'
const TUNNEL_W = 2.4
const TUNNEL_DASH = '5 3'
/** BGP ピアの両矢印の太さ（原図の太い黒の矢印） */
const PEER_W = 2

const KF: Rect = { x: 2, y: 4, w: 178, h: 152 }
const LF: Rect = { x: 210, y: 4, w: 128, h: 152 }
const L3: Rect = { x: 8, y: 70, w: 36, h: 18 }
/** VPN セグメント（縦の線）と、つながる高さ */
const BUS_X = 56
const A_Y = 47
const B_Y = 107
const L3_Y = 79
const VPNA1: Rect = { x: 96, y: 34, w: 64, h: 26 }
const VPNB1: Rect = { x: 96, y: 94, w: 64, h: 26 }
const VPNA2: Rect = { x: 230, y: 34, w: 64, h: 26 }
const VPNB2: Rect = { x: 230, y: 94, w: 64, h: 26 }
/** L 社のサーバセグメント（縦の線） */
const SBUS_X = 330
/** OSPF エリア（破線の角丸）：VPN セグメントの周りと、2本のトンネルの周り */
const AREA_K: Rect = { x: 34, y: 24, w: 70, h: 104 }
const AREA_A: Rect = { x: 150, y: 22, w: 90, h: 42 }
const AREA_B: Rect = { x: 150, y: 82, w: 90, h: 42 }
/** eBGP の両矢印とトンネルの高さ（ルータの箱の右端・左端に、矢印が上、トンネルが下で入る） */
const PEER_A_Y = 38
const TUN_A_Y = 52
const PEER_B_Y = 98
const TUN_B_Y = 112
const PEER_X1 = 178
const PEER_X2 = 212

const mid = (r: Rect) => r.x + r.w / 2

/** L3SW → VPN セグメント → VPNa1 → トンネル → VPNa2 → サーバセグメント（平常時のアクティブ側） */
const ACTIVE: [number, number][] = [
  [mid(L3), L3_Y],
  [BUS_X, L3_Y],
  [BUS_X, A_Y],
  [VPNA1.x, A_Y],
  [mid(VPNA1), A_Y],
  [AREA_A.x, TUN_A_Y],
  [AREA_A.x + AREA_A.w, TUN_A_Y],
  [mid(VPNA2), A_Y],
  [VPNA2.x + VPNA2.w, A_Y],
  [SBUS_X, A_Y],
  [SBUS_X, 70],
]

/** 名前を枠の内側の左上に置く囲み */
function Frame({ rect, label }: { rect: Rect; label: string }) {
  const { x, y, w, h } = rect
  const fs = SIZE * FONT_SCALE
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill="none" stroke={FRAME} strokeWidth={1.3} />
      <text x={x + 4} y={y + 3.5 + fs} fontSize={fs} fill={TEXT}>
        {label}
      </text>
    </g>
  )
}

/** OSPF エリア（破線の角丸） */
function Area({ rect }: { rect: Rect }) {
  return (
    <g>
      <rect x={rect.x} y={rect.y} width={rect.w} height={rect.h} rx={6} fill="none" stroke={SEGMENT} strokeWidth={1.1} strokeDasharray="4 2.5" />
    </g>
  )
}

/** 縦のセグメントの線と、黒い四角の接続点 */
function VBus({ x, y1, y2, taps }: { x: number; y1: number; y2: number; taps: number[] }) {
  return (
    <g>
      <Wire x1={x} y1={y1} x2={x} y2={y2} width={2} />
      {[y1, ...taps, y2].map((y) => (
        <rect key={y} x={x - 2.5} y={y - 2.5} width={5} height={5} fill={MUTED} />
      ))}
    </g>
  )
}

/** 「OSPF⟺BGP」（原図の白抜きの両矢印。再配布を示す） */
function Redist({ x, y }: { x: number; y: number }) {
  const ax = x + 25
  const bx = ax + 18
  const cy = y - 3
  return (
    <g>
      <Cap x={x} y={y} text="OSPF" size={SMALL} color={TEXT} />
      <polygon
        points={[
          [ax, cy],
          [ax + 4, cy - 3],
          [ax + 4, cy - 1.2],
          [bx - 4, cy - 1.2],
          [bx - 4, cy - 3],
          [bx, cy],
          [bx - 4, cy + 3],
          [bx - 4, cy + 1.2],
          [ax + 4, cy + 1.2],
          [ax + 4, cy + 3],
        ]
          .map(([px, py]) => `${px},${py}`)
          .join(' ')}
        fill="#ffffff"
        stroke={LOGICAL}
        strokeWidth={0.9}
      />
      <Cap x={bx + 3} y={y} text="BGP" size={SMALL} color={TEXT} />
    </g>
  )
}

export default function H29G13Fig2({ highlight = false }: ExamFigureProps) {
  const arrow = useFigureId('h29g13-peer')
  const peer = (x1: number, y1: number, x2: number, y2: number, key: string) => (
    <line key={key} x1={x1} y1={y1} x2={x2} y2={y2} stroke={LOGICAL} strokeWidth={PEER_W} markerStart={`url(#${arrow})`} markerEnd={`url(#${arrow})`} />
  )
  return (
    <FigSvg w={340} h={178} title="図2 K 社 NW と L 社クラウドサービスとの経路情報の交換の概要">
      <defs>
        {/* 線が太いので、共通の矢頭より小さくする（R5-G1-2 と同じ考え方） */}
        <marker id={arrow} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="3.2" markerHeight="3.2" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill={LOGICAL} />
        </marker>
      </defs>

      {/* ── 囲み ───────────────────────────────────── */}
      <Frame rect={KF} label="K社" />
      <Frame rect={LF} label="L社クラウドサービス" />
      <Area rect={AREA_K} />
      <Area rect={AREA_A} />
      <Area rect={AREA_B} />

      {/* ── 線 ─────────────────────────────────────── */}
      <Wire x1={L3.x + L3.w} y1={L3_Y} x2={BUS_X} y2={L3_Y} />
      <Wire x1={BUS_X} y1={A_Y} x2={VPNA1.x} y2={A_Y} />
      <Wire x1={BUS_X} y1={B_Y} x2={VPNB1.x} y2={B_Y} />
      <Wire x1={VPNA2.x + VPNA2.w} y1={A_Y} x2={SBUS_X} y2={A_Y} />
      <Wire x1={VPNB2.x + VPNB2.w} y1={B_Y} x2={SBUS_X} y2={B_Y} />
      {/* VPN トンネル（太い破線。端は VPN ルータの箱の中） */}
      <Poly
        points={[
          [AREA_A.x, TUN_A_Y],
          [AREA_A.x + AREA_A.w, TUN_A_Y],
        ]}
        color={LOGICAL}
        width={TUNNEL_W}
        dash={TUNNEL_DASH}
      />
      <Poly
        points={[
          [AREA_B.x, TUN_B_Y],
          [AREA_B.x + AREA_B.w, TUN_B_Y],
        ]}
        color={LOGICAL}
        width={TUNNEL_W}
        dash={TUNNEL_DASH}
      />
      {/* BGP ピア（両矢印）：iBGP は VPNa1 と VPNb1 のあいだ、eBGP はトンネルの上 */}
      {peer(86, A_Y + 4, 86, B_Y - 4, 'ibgp')}
      {peer(PEER_X1, PEER_A_Y, PEER_X2, PEER_A_Y, 'ebgp-a')}
      {peer(PEER_X1, PEER_B_Y, PEER_X2, PEER_B_Y, 'ebgp-b')}

      {/* ── 強調：平常時のアクティブ側の道筋と、スタンバイの VPNb1 ── */}
      {highlight && (
        <g>
          <Ring {...VPNB1} pad={2.5} />
          <Route points={ACTIVE} />
        </g>
      )}

      {/* ── ノード ───────────────────────────────────── */}
      <Box {...L3} tone="device" lines={['L3SW']} size={SIZE} />
      <VBus x={BUS_X} y1={28} y2={124} taps={[A_Y, L3_Y, B_Y]} />
      <Box {...VPNA1} tone="device" lines={['VPNa1']} size={SIZE} />
      <Box {...VPNB1} tone="device" lines={['VPNb1']} size={SIZE} />
      <Box {...VPNA2} tone="outside" lines={['VPNa2']} size={SIZE} />
      <Box {...VPNB2} tone="outside" lines={['VPNb2']} size={SIZE} />
      <VBus x={SBUS_X} y1={28} y2={124} taps={[A_Y, B_Y]} />

      {/* ── 札 ───────────────────────────────────────── */}
      <Cap x={90} y={44} text="(a)" anchor="end" size={SMALL} color={TEXT} />
      <Cap x={90} y={117} text="(b)" anchor="end" size={SMALL} color={TEXT} />
      <Cap x={82} y={80} text="iBGP" anchor="end" size={SIZE} color={TEXT} />
      <Redist x={106} y={76} />
      <Redist x={106} y={136} />
      <Cap x={195} y={32} text="eBGP" anchor="middle" size={SMALL} color={TEXT} />
      <Cap x={195} y={92} text="eBGP" anchor="middle" size={SMALL} color={TEXT} />
      <Cap x={164} y={41} text="(c)" size={SMALL} color={TEXT} />
      <Cap x={214} y={41} text="(e)" size={SMALL} color={TEXT} />
      <Cap x={164} y={101} text="(d)" size={SMALL} color={TEXT} />
      <Cap x={214} y={101} text="(f)" size={SMALL} color={TEXT} />
      <Cap x={326} y={44} text="(g)" anchor="end" size={SMALL} color={TEXT} />
      <Cap x={326} y={104} text="(h)" anchor="end" size={SMALL} color={TEXT} />
      <Cap x={8} y={150} text="VPNセグメント" size={SMALL} color={TEXT} />
      <Cap x={334} y={150} text="サーバセグメント" anchor="end" size={SMALL} color={TEXT} />

      {/* ── 注記1 と凡例（原図どおり見本の記号ごと） ─────────────── */}
      <Cap x={4} y={170} text="注記1 太い破線は，VPNトンネルを示す。" size={SMALL} color={MUTED} />
      {peer(156, 167, 176, 167, 'legend')}
      <Cap x={178} y={170} text="：BGPピア" size={SMALL} color={MUTED} />
      <rect x={226} y={162} width={18} height={10} rx={3} fill="none" stroke={SEGMENT} strokeWidth={1.1} strokeDasharray="3 2" />
      <Cap x={247} y={170} text="：OSPFエリア" size={SMALL} color={MUTED} />
    </FigSvg>
  )
}
