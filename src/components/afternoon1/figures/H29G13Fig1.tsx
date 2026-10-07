import { Box, Cap, Ell, FigSvg, Poly, Ring, Route, Wire } from './primitives'
import { FONT_SCALE, FRAME, LOGICAL, MUTED, TONE, useFigureId } from './tokens'
import type { ExamFigureProps, ToneName } from './tokens'

/**
 * 図1 L 社クラウドサービスとのネットワーク接続構成（抜粋）— H29 午後Ⅰ 問3
 *
 * 原図は上に L 社クラウドサービス、真ん中にインターネット、下に K 社を縦に並べ、略語と注記を図の右に置く（図だけなら縦長）。
 * 375px に合わせて略語の説明を図の下へ移し、注記1〜5 は図の下の注記（note）に回した。L 社クラウドサービスの枠は原図どおり
 * K 社の枠より右から始め、右端は K 社の枠にそろえた。2本の VPN トンネル（太い破線）は、原図では右上へ斜めに引くが、
 * VPN ルータの真上に相手の VPN ルータを置いたので、ほぼ縦の線になる。
 * K 社の中（FW から左へ延びて下りる FW セグメントの線、DMZ・VPN セグメント・サーバセグメント・クライアントセグメントの横線と
 * 黒い四角の接続点、太枠の VPNa1・VPNb1、網掛けの販売管理サーバ・販売管理 DB）の並びと、(a)〜(h) の位置は原図どおり。
 *
 * 色は役割だけで決めている。K 社の FW・L3SW・VPNa1・VPNb1 は device、サーバと PC は host（L 社クラウドサービスの中の
 * 販売管理サーバ・販売管理 DB も host）、インターネットと、L 社クラウドサービスが提供する VPNa2・VPNb2 は outside。
 * 網掛け（クラウドへ移る予定の機器）は役割の色の上に斜線を重ね、太枠（新たに置く機器）は線を太くして残す。
 *
 * 解説を開いたときは、監視サーバから (e)・(f) への ping の道筋を2本なぞり（トンネルごとに別の VPN ルータを通る。設問4）、
 * FW（NAPT。設問1 ア）と監視サーバに輪を付ける。
 */

type Rect = { x: number; y: number; w: number; h: number }

const SIZE = 7.5
const SMALL = 7
const TEXT = '#334155'
const HATCH = '#94a3b8'
/** VPN トンネル（原図の太い破線） */
const TUNNEL_W = 2.4
const TUNNEL_DASH = '5 3'

/** L 社クラウドサービス */
const LF: Rect = { x: 64, y: 4, w: 272, h: 92 }
const L_SRV: Rect = { x: 80, y: 10, w: 46, h: 30 }
const L_DB: Rect = { x: 140, y: 10, w: 46, h: 30 }
const LS_Y = 52
const VPNA2: Rect = { x: 104, y: 64, w: 44, h: 18 }
const VPNB2: Rect = { x: 190, y: 64, w: 44, h: 18 }
const INET = { cx: 160, cy: 112, rx: 84, ry: 12 }

/** K 社 */
const KF: Rect = { x: 2, y: 132, w: 336, h: 220 }
const FW: Rect = { x: 147, y: 140, w: 26, h: 18 }
/** FW セグメントの線（FW の左から左へ延び、x 20 で下りて L3SW を貫き、クライアントセグメントへ） */
const FWSEG_Y = 149
const FWSEG_X = 20
const D_Y = 174
const VPNA1: Rect = { x: 72, y: 191, w: 44, h: 20 }
const VPNB1: Rect = { x: 176, y: 191, w: 44, h: 20 }
const V_Y = 228
const L3: Rect = { x: 8, y: 246, w: 40, h: 18 }
/** L3SW から VPN セグメント・サーバセグメントへの線の x */
const L3_TAP = 40
const DNS: Rect = { x: 60, y: 240, w: 36, h: 30 }
const K_SRV: Rect = { x: 108, y: 240, w: 48, h: 30 }
const K_DB: Rect = { x: 168, y: 240, w: 48, h: 30 }
const MON: Rect = { x: 228, y: 240, w: 36, h: 30 }
const S_Y = 284
const C_Y = 300
const PC1: Rect = { x: 52, y: 310, w: 24, h: 18 }
const PC2: Rect = { x: 110, y: 310, w: 24, h: 18 }

const mid = (r: Rect) => r.x + r.w / 2
const bottom = (r: Rect) => r.y + r.h

/** 2本の VPN トンネル（端は VPN ルータの箱の中） */
const TUN_A: [number, number][] = [
  [110, 205],
  [112, 70],
]
const TUN_B: [number, number][] = [
  [214, 205],
  [228, 70],
]

/** 監視サーバ → サーバセグメント → L3SW → VPN セグメント（ここまで共通） */
const MON_TO_VPNSEG: [number, number][] = [
  [mid(MON), MON.y + 15],
  [mid(MON), S_Y],
  [L3_TAP, S_Y],
  [L3_TAP, L3.y + 9],
  [L3_TAP, V_Y],
]
/** (e) への ping：VPNa1 からトンネルを通って VPNa2 へ */
const PING_E: [number, number][] = [...MON_TO_VPNSEG, [mid(VPNA1), V_Y], [mid(VPNA1), VPNA1.y + 9], TUN_A[0], TUN_A[1]]
/** (f) への ping：VPNb1 からトンネルを通って VPNb2 へ */
const PING_F: [number, number][] = [...MON_TO_VPNSEG, [mid(VPNB1), V_Y], [mid(VPNB1), VPNB1.y + 9], TUN_B[0], TUN_B[1]]

/** 名前を枠の内側の右上に置く囲み */
function Frame({ rect, label }: { rect: Rect; label: string }) {
  const { x, y, w, h } = rect
  const fs = SIZE * FONT_SCALE
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill="none" stroke={FRAME} strokeWidth={1.3} />
      <text x={x + w - 4} y={y + 3.5 + fs} textAnchor="end" fontSize={fs} fill={TEXT}>
        {label}
      </text>
    </g>
  )
}

/** セグメントの横線（原図の太い線）と、機器がつながる所の黒い四角 */
function Bus({ x1, x2, y, taps }: { x1: number; x2: number; y: number; taps: number[] }) {
  return (
    <g>
      <Wire x1={x1} y1={y} x2={x2} y2={y} width={2} />
      {[x1, ...taps, x2].map((x) => (
        <rect key={x} x={x - 2.5} y={y - 2.5} width={5} height={5} fill={MUTED} />
      ))}
    </g>
  )
}

/** 太枠の箱（原図の、K 社内に新たに置く VPN ルータ） */
function ThickBox({ rect, tone, label }: { rect: Rect; tone: ToneName; label: string }) {
  const { x, y, w, h } = rect
  const t = TONE[tone]
  const fs = SIZE * FONT_SCALE
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={2} fill={t.fill} stroke={t.stroke} strokeWidth={2.4} />
      <text x={x + w / 2} y={y + h / 2 + fs * 0.44} textAnchor="middle" fontSize={fs} fontWeight={700} fill={t.text}>
        {label}
      </text>
    </g>
  )
}

/** 網掛けの箱（原図の、クラウドへ移る予定の機器）。役割の色の上に斜線を重ね、その上に文字を置く */
function HatchBox({ rect, tone, lines, patternId }: { rect: Rect; tone: ToneName; lines: string[]; patternId: string }) {
  const { x, y, w, h } = rect
  const t = TONE[tone]
  const fs = SIZE * FONT_SCALE
  const lh = fs + 2.5
  const cx = x + w / 2
  const startY = y + h / 2 + fs * 0.44 - ((lines.length - 1) * lh) / 2
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={2} fill={t.fill} stroke={t.stroke} strokeWidth={1.2} />
      <rect x={x + 0.8} y={y + 0.8} width={w - 1.6} height={h - 1.6} rx={2} fill={`url(#${patternId})`} />
      <text x={cx} y={startY} textAnchor="middle" fontSize={fs} fontWeight={700} fill={t.text}>
        {lines.map((ln, i) => (
          <tspan key={i} x={cx} dy={i === 0 ? 0 : lh}>
            {ln}
          </tspan>
        ))}
      </text>
    </g>
  )
}

export default function H29G13Fig1({ highlight = false }: ExamFigureProps) {
  const hatch = useFigureId('h29g13-hatch')
  return (
    <FigSvg w={340} h={388} title="図1 L 社クラウドサービスとのネットワーク接続構成（抜粋）">
      <defs>
        <pattern id={hatch} width={4} height={4} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1={0} y1={0} x2={0} y2={4} stroke={HATCH} strokeWidth={1} />
        </pattern>
      </defs>

      {/* ── 囲み ───────────────────────────────────── */}
      <Frame rect={LF} label="L社クラウドサービス" />
      <Frame rect={KF} label="K社" />

      {/* ── 線 ─────────────────────────────────────── */}
      {/* L 社クラウドサービス */}
      <Wire x1={mid(L_SRV)} y1={bottom(L_SRV)} x2={mid(L_SRV)} y2={LS_Y} />
      <Wire x1={mid(L_DB)} y1={bottom(L_DB)} x2={mid(L_DB)} y2={LS_Y} />
      <Wire x1={mid(VPNA2)} y1={LS_Y} x2={mid(VPNA2)} y2={VPNA2.y} />
      <Wire x1={mid(VPNB2)} y1={LS_Y} x2={mid(VPNB2)} y2={VPNB2.y} />
      <Wire x1={mid(VPNA2)} y1={bottom(VPNA2)} x2={mid(VPNA2)} y2={INET.cy - 6} />
      <Wire x1={mid(VPNB2)} y1={bottom(VPNB2)} x2={mid(VPNB2)} y2={INET.cy - 6} />
      {/* K 社 */}
      <Wire x1={mid(FW)} y1={INET.cy + 6} x2={mid(FW)} y2={FW.y} />
      <Poly
        points={[
          [FW.x, FWSEG_Y],
          [FWSEG_X, FWSEG_Y],
          [FWSEG_X, C_Y],
        ]}
      />
      <Wire x1={mid(FW)} y1={bottom(FW)} x2={mid(FW)} y2={D_Y} />
      <Wire x1={mid(VPNA1)} y1={D_Y} x2={mid(VPNA1)} y2={VPNA1.y} />
      <Wire x1={mid(VPNB1)} y1={D_Y} x2={mid(VPNB1)} y2={VPNB1.y} />
      <Wire x1={mid(VPNA1)} y1={bottom(VPNA1)} x2={mid(VPNA1)} y2={V_Y} />
      <Wire x1={mid(VPNB1)} y1={bottom(VPNB1)} x2={mid(VPNB1)} y2={V_Y} />
      <Wire x1={L3_TAP} y1={V_Y} x2={L3_TAP} y2={L3.y} />
      <Wire x1={L3_TAP} y1={bottom(L3)} x2={L3_TAP} y2={S_Y} />
      {[DNS, K_SRV, K_DB, MON].map((r) => (
        <Wire key={r.x} x1={mid(r)} y1={bottom(r)} x2={mid(r)} y2={S_Y} />
      ))}
      <Wire x1={mid(PC1)} y1={C_Y} x2={mid(PC1)} y2={PC1.y} />
      <Wire x1={mid(PC2)} y1={C_Y} x2={mid(PC2)} y2={PC2.y} />
      {/* VPN トンネル（太い破線） */}
      <Poly points={TUN_A} color={LOGICAL} width={TUNNEL_W} dash={TUNNEL_DASH} />
      <Poly points={TUN_B} color={LOGICAL} width={TUNNEL_W} dash={TUNNEL_DASH} />

      {/* ── 強調：(e)・(f) への ping の道筋、FW と監視サーバ ── */}
      {highlight && (
        <g>
          <Ring {...FW} />
          <Ring {...MON} />
          <Route points={PING_E} />
          <Route points={PING_F} />
        </g>
      )}

      {/* ── ノード ───────────────────────────────────── */}
      <Box {...L_SRV} tone="host" lines={['販売管理', 'サーバ']} size={SIZE} />
      <Box {...L_DB} tone="host" lines={['販売管理', 'DB']} size={SIZE} />
      <Bus x1={72} x2={300} y={LS_Y} taps={[mid(L_SRV), mid(VPNA2), mid(L_DB), mid(VPNB2)]} />
      <Box {...VPNA2} tone="outside" lines={['VPNa2']} size={SIZE} />
      <Box {...VPNB2} tone="outside" lines={['VPNb2']} size={SIZE} />
      <Ell {...INET} tone="outside" lines={['インターネット']} size={SIZE} />
      <Box {...FW} tone="device" lines={['FW']} size={SIZE} />
      <Bus x1={40} x2={290} y={D_Y} taps={[mid(VPNA1), mid(FW), mid(VPNB1)]} />
      <ThickBox rect={VPNA1} tone="device" label="VPNa1" />
      <ThickBox rect={VPNB1} tone="device" label="VPNb1" />
      <Bus x1={30} x2={290} y={V_Y} taps={[L3_TAP, mid(VPNA1), mid(VPNB1)]} />
      <Box {...L3} tone="device" lines={['L3SW']} size={SIZE} />
      <Box {...DNS} tone="host" lines={['DNS', 'サーバ']} size={SIZE} />
      <HatchBox rect={K_SRV} tone="host" lines={['販売管理', 'サーバ']} patternId={hatch} />
      <HatchBox rect={K_DB} tone="host" lines={['販売管理', 'DB']} patternId={hatch} />
      <Box {...MON} tone="host" lines={['監視', 'サーバ']} size={SIZE} />
      <Bus x1={30} x2={300} y={S_Y} taps={[L3_TAP, ...[DNS, K_SRV, K_DB, MON].map(mid)]} />
      <Bus x1={8} x2={170} y={C_Y} taps={[FWSEG_X, mid(PC1), mid(PC2)]} />
      <Box {...PC1} tone="host" lines={['PC']} size={SIZE} />
      <Box {...PC2} tone="host" lines={['PC']} size={SIZE} />
      <Cap x={93} y={322} text="⋯" anchor="middle" size={SMALL} color={TEXT} />

      {/* ── 札（セグメントの名前と (a)〜(h)） ─────────────────── */}
      <Cap x={236} y={LS_Y - 4} text="サーバセグメント" size={SMALL} color={TEXT} />
      <Cap x={130} y={61} text="(g)" size={SMALL} color={TEXT} />
      <Cap x={208} y={61} text="(h)" anchor="end" size={SMALL} color={TEXT} />
      <Cap x={108.5} y={92} text="(e)" anchor="end" size={SMALL} color={TEXT} />
      <Cap x={229} y={92} text="(f)" size={SMALL} color={TEXT} />
      <Cap x={24} y={161} text="FWセグメント" size={SMALL} color={TEXT} />
      <Cap x={114.5} y={186} text="(c)" size={SMALL} color={TEXT} />
      <Cap x={131} y={186} text="DMZ" size={SMALL} color={TEXT} />
      <Cap x={219.5} y={186} text="(d)" size={SMALL} color={TEXT} />
      <Cap x={91} y={224} text="(a)" anchor="end" size={SMALL} color={TEXT} />
      <Cap x={110} y={224} text="VPNセグメント" size={SMALL} color={TEXT} />
      <Cap x={201} y={224} text="(b)" size={SMALL} color={TEXT} />
      <Cap x={200} y={299} text="サーバセグメント" size={SMALL} color={TEXT} />
      <Cap x={8} y={344} text="クライアントセグメント" size={SMALL} color={TEXT} />

      {/* ── 略語の説明（原図は図の右。375px に合わせて図の下へ） ─────── */}
      <Cap x={6} y={366} text="DB：データベース" size={SMALL} color={MUTED} />
      <Cap x={74} y={366} text="FW：ファイアウォール" size={SMALL} color={MUTED} />
      <Cap x={152} y={366} text="L3SW：レイヤ3スイッチ" size={SMALL} color={MUTED} />
      <Cap x={6} y={380} text="VPNa1，VPNa2，VPNb1，VPNb2：VPNルータ" size={SMALL} color={MUTED} />
    </FigSvg>
  )
}
