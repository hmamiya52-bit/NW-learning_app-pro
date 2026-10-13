import { Box, Cap, Ell, FigSvg, Ring, Route, Wire } from './primitives'
import { FONT_SCALE, FRAME, LOGICAL, MUTED, SEGMENT, useFigureId } from './tokens'
import type { ExamFigureProps } from './tokens'

/**
 * 図1 現在の A 社 NW（抜粋）— R7 午後Ⅰ 問1
 *
 * 原図の並び（左上に L3SW10 の vlan の表、右上に C 社データセンター、真ん中の段にインターネット・広域イーサ網・IPsec VPN、
 * 下の段に左の大阪本社と右の東京支社）は組み直さずに 340 の幅へ入れた。略語の説明は原図どおり図の下。
 * C 社データセンターの名前は、原図では枠の右下にあるが、R31 から IPsec VPN への線と重なるので右上に置いた。
 * 注記1・2 は見本の記号を持たないので examFigures の note に置く。
 *
 * OSPF のエリアの範囲（原図の灰色の網掛け）は役割の色ではないので、R3-G1-2 図2 と同じ灰色の塗り（AREA）にして
 * `data-role="area"` を付け、いちばん先に敷く（§5.4 の検査5 が、網掛けを機器の箱と取り違えないように）。
 * 原図どおり、R30・R31 のまわり、C 社データセンターの下から2拠点の枠の上までの WAN の帯、FW10、R10・R11 と L3SW10、R20・R21 のまわりに敷く。
 *
 * eBGP のピア（原図の太い両矢印）は論理の線なので LOGICAL。原図どおり C 社 SaaS の楕円の中から L2SW30 の上を通って R30・R31 の箱の中へ
 * 下ろすので、矢頭が楕円と箱の塗りに隠れないよう、ノードの後に描く（線は箱の文字の左右を通す）。
 *
 * 色は役割だけで決めている。FW・L3SW・L2SW・ルータは device、PC は host、インターネット・広域イーサ網・IPsec VPN・C 社 SaaS は outside。
 *
 * 解説を開いたときは、R10 を通る2つの通信（大阪本社から (ウ) C 社 SaaS へ、東京支社の R20 から広域イーサ網を経て R10・L3SW10 へ）をなぞり、
 * AS_PATH を長くする R31 と、VRRP の組の R20・R21 に輪を付ける。
 */

type Rect = { x: number; y: number; w: number; h: number }
type Pt = [number, number]

const SIZE = 7.5
const SMALL = 7
const TEXT = '#334155'
/** OSPF のエリアの範囲（原図の灰色の網掛け）。R3-G1-2 図2 と同じ塗り */
const AREA = '#e8ecf1'
/** eBGP のピアの両矢印の太さ（原図の太い両矢印。H29-G1-3 図2 と同じ） */
const PEER_W = 2

/** L3SW10 の vlan と収容する機器名（原図の左上の表） */
const TBL = { x: 4, y: 16, c1: 36, c2: 88, row: 17 }
const VLANS: [string, string][] = [
  ['vlan10', 'FW10'],
  ['vlan20', 'R10，R11'],
  ['vlan30', 'L2SW10'],
  ['vlan40', 'L2SW11，L2SW12'],
]

/** C 社データセンター */
const DC: Rect = { x: 134, y: 2, w: 204, h: 102 }
const SAAS = { cx: 214, cy: 24, rx: 44, ry: 14 }
const L2SW30: Rect = { x: 174, y: 46, w: 80, h: 18 }
const R30: Rect = { x: 140, y: 78, w: 46, h: 18 }
const R31: Rect = { x: 242, y: 78, w: 46, h: 18 }
/** eBGP のピアの両矢印（楕円の中から R30・R31 の箱の中へ。箱の文字の外側を通す） */
const PEER_X = [180, 248]
const PEER_TOP = 25
const PEER_BOTTOM = 90

/** 真ん中の段の楕円 */
const MID_Y = 124
const INET = { cx: 50, cy: MID_Y, rx: 46, ry: 12 }
const WAN = { cx: 140, cy: MID_Y, rx: 36, ry: 12 }
const VPN = { cx: 265, cy: MID_Y, rx: 36, ry: 12 }

/** 大阪本社 */
const OS: Rect = { x: 2, y: 150, w: 212, h: 148 }
const ROUTER_Y = 157
const FW10: Rect = { x: 70, y: ROUTER_Y, w: 35, h: 18 }
const R10: Rect = { x: 126.5, y: ROUTER_Y, w: 27, h: 18 }
const R11: Rect = { x: 166, y: ROUTER_Y, w: 27, h: 18 }
const L3SW10: Rect = { x: 128.5, y: 191, w: 47, h: 18 }
/** (イ) サーバセグメント（破線の枠。左上に注記の2行、下に名前） */
const SEG: Rect = { x: 6, y: 185, w: 78, h: 70 }
const L2SW10: Rect = { x: 16, y: 215, w: 47, h: 18 }
/** 大阪本社の内部ネットワーク（破線の枠。名前は右下） */
const IN_OS: Rect = { x: 88, y: 217, w: 122, h: 74 }
const L2SW11: Rect = { x: 95.5, y: 223, w: 47, h: 18 }
const L2SW12: Rect = { x: 155.5, y: 223, w: 47, h: 18 }
const OS_PC_Y = 251

/** 東京支社 */
const TK: Rect = { x: 220, y: 150, w: 118, h: 134 }
const R20: Rect = { x: 232, y: ROUTER_Y, w: 27, h: 18 }
const R21: Rect = { x: 274, y: ROUTER_Y, w: 27, h: 18 }
const IN_TK: Rect = { x: 228, y: 187, w: 66, h: 84 }
const L2SW20: Rect = { x: 237.5, y: 195, w: 47, h: 18 }
const TK_PC_Y = 229

const PC_W = 20
const PC_H = 18

const mid = (r: Rect) => r.x + r.w / 2
const midY = (r: Rect) => r.y + r.h / 2
const bottom = (r: Rect) => r.y + r.h
/** 楕円の縁の点（x を決めて、上下どちらかの縁の y を出す） */
const onEll = (e: { cx: number; cy: number; rx: number; ry: number }, x: number, side: 'top' | 'bottom'): Pt => {
  const dy = e.ry * Math.sqrt(1 - ((x - e.cx) / e.rx) ** 2)
  return [x, +(side === 'top' ? e.cy - dy : e.cy + dy).toFixed(2)]
}

/** L2SW の下の PC の組（PC ⋯ PC。2台の真ん中が L2SW の真ん中） */
const pcPair = (sw: Rect, y: number): Rect[] => {
  const c = mid(sw)
  return [
    { x: c - 27, y, w: PC_W, h: PC_H },
    { x: c + 7, y, w: PC_W, h: PC_H },
  ]
}
const OS_PCS = [...pcPair(L2SW11, OS_PC_Y), ...pcPair(L2SW12, OS_PC_Y)]
const TK_PCS = pcPair(L2SW20, TK_PC_Y)
/** L2SW から PC の組への2本 */
const PC_GROUPS: [Rect, number][] = [
  [L2SW11, OS_PC_Y],
  [L2SW12, OS_PC_Y],
  [L2SW20, TK_PC_Y],
]
const LEGS: [Pt, Pt][] = PC_GROUPS.flatMap(([sw, y]): [Pt, Pt][] => {
  const [p1, p2] = pcPair(sw, y)
  return [
    [[mid(sw) - 6, bottom(sw)], [mid(p1), p1.y]],
    [[mid(sw) + 6, bottom(sw)], [mid(p2), p2.y]],
  ]
})

/** 線の端（楕円の縁の点は計算で出す） */
const R30_DOWN: [Pt, Pt] = [[160, bottom(R30)], onEll(WAN, 152, 'top')]
const R31_DOWN: [Pt, Pt] = [[mid(R31), bottom(R31)], onEll(VPN, mid(R31), 'top')]
const INET_FW: [Pt, Pt] = [onEll(INET, 80, 'bottom'), [90, ROUTER_Y]]
const WAN_R10: [Pt, Pt] = [onEll(WAN, mid(R10), 'bottom'), [mid(R10), ROUTER_Y]]
const WAN_R20: [Pt, Pt] = [onEll(WAN, 172, 'bottom'), [246, ROUTER_Y]]
const VPN_R11: [Pt, Pt] = [onEll(VPN, 241, 'bottom'), [186, ROUTER_Y]]
const VPN_R21: [Pt, Pt] = [onEll(VPN, 273, 'bottom'), [290, ROUTER_Y]]
const R10_L3: [Pt, Pt] = [[mid(R10), bottom(R10)], [146, L3SW10.y]]

/** 名前を枠の内側の隅に置く囲み（名前は枠と同じ `<g>` に入れ、§5.4 の検査2 で余白を測れるようにする） */
function Frame({
  rect,
  label,
  at,
  dashed = false,
  size = SIZE,
}: {
  rect: Rect
  label: string
  at: 'tl' | 'tr' | 'bl' | 'br'
  dashed?: boolean
  size?: number
}) {
  const { x, y, w, h } = rect
  const fs = size * FONT_SCALE
  const right = at === 'tr' || at === 'br'
  const top = at === 'tl' || at === 'tr'
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        fill="none"
        stroke={dashed ? SEGMENT : FRAME}
        strokeWidth={dashed ? 1.1 : 1.3}
        strokeDasharray={dashed ? '5 3' : undefined}
      />
      <text x={right ? x + w - 4 : x + 4} y={top ? y + 3.5 + fs : y + h - 6} textAnchor={right ? 'end' : 'start'} fontSize={fs} fill={TEXT}>
        {label}
      </text>
    </g>
  )
}

/** (イ) サーバセグメント（左上の注記の2行も枠と同じ `<g>` に入れる） */
function ServerSegment() {
  const { x, y, w, h } = SEG
  const fs = SMALL * FONT_SCALE
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill="none" stroke={SEGMENT} strokeWidth={1.1} strokeDasharray="5 3" />
      <text x={x + 3.5} y={y + 12} fontSize={fs} fill={TEXT}>
        <tspan x={x + 3.5}>サーバセグメント内の</tspan>
        <tspan x={x + 3.5} dy={10}>
          サーバ群は省略
        </tspan>
      </text>
      <text x={x + 3.5} y={y + h - 6} fontSize={fs} fill={TEXT}>
        (イ)サーバセグメント
      </text>
    </g>
  )
}

/** L3SW10 の vlan と収容する機器名（原図の左上の表。マスごとに枠と文字を1つの `<g>` にする） */
function VlanTable() {
  const fs = SMALL * FONT_SCALE
  const { x, y, c1, c2, row } = TBL
  const base = (r: number) => y + row * r + row / 2 + fs * 0.44
  const cell = (cx: number, cw: number, r: number, text: string, center: boolean) => (
    <g key={`${r}-${cx}`}>
      <rect x={cx} y={y + row * r} width={cw} height={row} fill="none" stroke={MUTED} strokeWidth={0.8} />
      <text x={center ? cx + cw / 2 : cx + 4} y={base(r)} textAnchor={center ? 'middle' : 'start'} fontSize={fs} fill={TEXT}>
        {text}
      </text>
    </g>
  )
  return (
    <g>
      <Cap x={x} y={11} text="L3SW10 の vlan と収容する機器名" size={SMALL} color={TEXT} />
      {cell(x, c1, 0, 'vlan', true)}
      {cell(x + c1, c2, 0, '収容する機器名', true)}
      {VLANS.map(([v, d], i) => [cell(x, c1, i + 1, v, false), cell(x + c1, c2, i + 1, d, false)])}
    </g>
  )
}

/** PC の組のあいだの「⋯」 */
function Dots({ sw, y }: { sw: Rect; y: number }) {
  return <Cap x={mid(sw)} y={y + PC_H / 2 + 3} text="⋯" anchor="middle" size={SMALL} color={TEXT} />
}

export default function R7G11Fig1({ highlight = false }: ExamFigureProps) {
  const arrow = useFigureId('r7g11-peer')
  const peer = (x1: number, y1: number, x2: number, y2: number, key: string) => (
    <line key={key} x1={x1} y1={y1} x2={x2} y2={y2} stroke={LOGICAL} strokeWidth={PEER_W} markerStart={`url(#${arrow})`} markerEnd={`url(#${arrow})`} />
  )
  const wire = ([a, b]: [Pt, Pt], key: string) => <Wire key={key} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} />
  return (
    <FigSvg w={340} h={330} title="図1 現在の A 社 NW（抜粋）">
      <defs>
        {/* 線が太いので、共通の矢頭より小さくする（H29-G1-3 図2 と同じ） */}
        <marker id={arrow} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="3.2" markerHeight="3.2" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill={LOGICAL} />
        </marker>
      </defs>

      {/* ── OSPF のエリアの範囲（原図の灰色。いちばん先に敷く）── */}
      <g data-role="area">
        {/* R30・R31 のまわり */}
        <rect x={R30.x - 6} y={R30.y - 6} width={R31.x + R31.w - R30.x + 12} height={R30.h + 12} fill={AREA} />
        {/* WAN の帯（広域イーサ網の左から IPsec VPN の右まで。2拠点のルータの段に届く） */}
        <rect x={WAN.cx - WAN.rx - 6} y={R30.y + R30.h + 6} width={VPN.cx + VPN.rx - (WAN.cx - WAN.rx) + 12} height={ROUTER_Y - 4 - (R30.y + R30.h + 6)} fill={AREA} />
        {/* FW10 */}
        <rect x={FW10.x - 6} y={ROUTER_Y - 6} width={FW10.w + 12} height={FW10.h + 12} fill={AREA} />
        {/* R10・R11 と L3SW10 */}
        <polygon
          points={[
            [R10.x - 6, ROUTER_Y - 6],
            [R11.x + R11.w + 6, ROUTER_Y - 6],
            [R11.x + R11.w + 6, bottom(R11) + 6],
            [L3SW10.x + L3SW10.w + 6, bottom(R11) + 6],
            [L3SW10.x + L3SW10.w + 6, bottom(L3SW10) + 6],
            [L3SW10.x - 6, bottom(L3SW10) + 6],
            [L3SW10.x - 6, bottom(R10) + 6],
            [R10.x - 6, bottom(R10) + 6],
          ]
            .map(([px, py]) => `${px},${py}`)
            .join(' ')}
          fill={AREA}
        />
        {/* R20・R21 */}
        <rect x={R20.x - 6} y={ROUTER_Y - 6} width={R21.x + R21.w - R20.x + 12} height={R20.h + 12} fill={AREA} />
      </g>

      {/* ── 囲み ───────────────────────────────────── */}
      <Frame rect={DC} label="C 社データセンター" at="tr" />
      <Frame rect={OS} label="大阪本社" at="bl" />
      <Frame rect={TK} label="東京支社" at="br" />
      <ServerSegment />
      <Frame rect={IN_OS} label="内部ネットワーク" at="br" dashed size={SMALL} />
      <Frame rect={IN_TK} label="内部ネットワーク" at="bl" dashed size={SMALL} />
      <VlanTable />

      {/* ── 線 ─────────────────────────────────────── */}
      <Wire x1={SAAS.cx} y1={SAAS.cy + SAAS.ry} x2={SAAS.cx} y2={L2SW30.y} />
      <Wire x1={L2SW30.x} y1={bottom(L2SW30)} x2={160} y2={R30.y} />
      <Wire x1={L2SW30.x + L2SW30.w} y1={bottom(L2SW30)} x2={268} y2={R31.y} />
      <Wire x1={R30.x + R30.w} y1={midY(R30)} x2={R31.x} y2={midY(R31)} />
      {wire(R30_DOWN, 'r30')}
      {wire(R31_DOWN, 'r31')}
      {wire(INET_FW, 'inet')}
      {wire(WAN_R10, 'wan-r10')}
      {wire(WAN_R20, 'wan-r20')}
      {wire(VPN_R11, 'vpn-r11')}
      {wire(VPN_R21, 'vpn-r21')}
      <Wire x1={R10.x + R10.w} y1={midY(R10)} x2={R11.x} y2={midY(R11)} />
      <Wire x1={R20.x + R20.w} y1={midY(R20)} x2={R21.x} y2={midY(R21)} />
      <Wire x1={mid(FW10)} y1={bottom(FW10)} x2={138} y2={L3SW10.y} />
      {wire(R10_L3, 'r10-l3')}
      <Wire x1={mid(R11)} y1={bottom(R11)} x2={166} y2={L3SW10.y} />
      <Wire x1={L3SW10.x} y1={midY(L3SW10)} x2={L2SW10.x + L2SW10.w} y2={midY(L2SW10)} />
      <Wire x1={146} y1={bottom(L3SW10)} x2={126} y2={L2SW11.y} />
      <Wire x1={160} y1={bottom(L3SW10)} x2={172} y2={L2SW12.y} />
      <Wire x1={mid(R20) + 4} y1={bottom(R20)} x2={255} y2={L2SW20.y} />
      <Wire x1={mid(R21) - 4} y1={bottom(R21)} x2={267} y2={L2SW20.y} />
      {LEGS.map((l, i) => wire(l, `leg-${i}`))}

      {/* ── 強調：R10 を通る2つの通信と、R31・R20/R21 の輪 ── */}
      {highlight && (
        <g>
          <Ring {...R31} />
          <Ring x={R20.x} y={R20.y} w={R21.x + R21.w - R20.x} h={R20.h} />
          {/* 大阪本社の L3SW10 → R10 → 広域イーサ網 → R30 → L2SW30 → (ウ) C 社 SaaS */}
          <Route
            points={[
              [mid(L3SW10), midY(L3SW10)],
              R10_L3[1],
              R10_L3[0],
              [mid(R10), midY(R10)],
              WAN_R10[1],
              WAN_R10[0],
              [WAN.cx, WAN.cy],
              R30_DOWN[1],
              R30_DOWN[0],
              [mid(R30), midY(R30)],
              [160, R30.y],
              [L2SW30.x, bottom(L2SW30)],
              [mid(L2SW30), midY(L2SW30)],
              [SAAS.cx, L2SW30.y],
              [SAAS.cx, SAAS.cy + SAAS.ry],
              [SAAS.cx, SAAS.cy + 4],
            ]}
          />
          {/* 東京支社の R20 → 広域イーサ網（ここから上の道筋に合流して R10・L3SW10 へ） */}
          <Route points={[[mid(R20), midY(R20)], WAN_R20[1], WAN_R20[0], [WAN.cx, WAN.cy]]} />
        </g>
      )}

      {/* ── ノード ───────────────────────────────────── */}
      <Ell {...SAAS} tone="outside" lines={['(ウ)C社SaaS']} size={SIZE} />
      <Box {...L2SW30} tone="device" lines={['L2SW30']} size={SIZE} />
      <Box {...R30} tone="device" lines={['R30']} size={SIZE} />
      <Box {...R31} tone="device" lines={['R31']} size={SIZE} />
      <Ell {...INET} tone="outside" lines={['(ア)インターネット']} size={SIZE} />
      <Ell {...WAN} tone="outside" lines={['広域イーサ網']} size={SIZE} />
      <Ell {...VPN} tone="outside" lines={['IPsec VPN']} size={SIZE} />
      <Box {...FW10} tone="device" lines={['FW10']} size={SIZE} />
      <Box {...R10} tone="device" lines={['R10']} size={SIZE} />
      <Box {...R11} tone="device" lines={['R11']} size={SIZE} />
      <Box {...L3SW10} tone="device" lines={['L3SW10']} size={SIZE} />
      <Box {...L2SW10} tone="device" lines={['L2SW10']} size={SIZE} />
      <Box {...L2SW11} tone="device" lines={['L2SW11']} size={SIZE} />
      <Box {...L2SW12} tone="device" lines={['L2SW12']} size={SIZE} />
      {OS_PCS.map((r) => (
        <Box key={r.x} {...r} tone="host" lines={['PC']} size={SIZE} />
      ))}
      <Dots sw={L2SW11} y={OS_PC_Y} />
      <Dots sw={L2SW12} y={OS_PC_Y} />
      <Box {...R20} tone="device" lines={['R20']} size={SIZE} />
      <Box {...R21} tone="device" lines={['R21']} size={SIZE} />
      <Box {...L2SW20} tone="device" lines={['L2SW20']} size={SIZE} />
      {TK_PCS.map((r) => (
        <Box key={r.x} {...r} tone="host" lines={['PC']} size={SIZE} />
      ))}
      <Dots sw={L2SW20} y={TK_PC_Y} />

      {/* ── eBGP のピア（楕円と箱の中に矢頭が見えるよう、ノードの後に描く）── */}
      {PEER_X.map((px, i) => peer(px, PEER_TOP, px, PEER_BOTTOM, `peer-${i}`))}

      {/* ── 略語と凡例（原図どおり図の下） ─────────────── */}
      <Cap x={4} y={310} text="L2SW：レイヤー2スイッチ" size={SMALL} color={MUTED} />
      <Cap x={98} y={310} text="L3SW：レイヤー3スイッチ" size={SMALL} color={MUTED} />
      <Cap x={192} y={310} text="FW：ファイアウォール" size={SMALL} color={MUTED} />
      <Cap x={270} y={310} text="R：ルータ" size={SMALL} color={MUTED} />
      <Cap x={4} y={324} text="広域イーサ網：広域イーサネットサービス網" size={SMALL} color={MUTED} />
      <rect x={153} y={316.5} width={15} height={9} fill={AREA} />
      <Cap x={170} y={324} text="：OSPF のエリアの範囲" size={SMALL} color={MUTED} />
      {peer(256, 321, 276, 321, 'legend')}
      <Cap x={279} y={324} text="：eBGP のピア" size={SMALL} color={MUTED} />
    </FigSvg>
  )
}
