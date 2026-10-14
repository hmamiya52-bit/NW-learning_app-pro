import { Box, Cap, Ell, FigSvg, Poly, Ring, Route, Wire } from './primitives'
import { FONT_SCALE, LOGICAL, MUTED, TONE, useFigureId } from './tokens'
import type { ExamFigureProps } from './tokens'
import { Dots, Frame } from './R7G13Parts'

/**
 * 図2 SWG サービス導入時のネットワーク構成 — R7 午後Ⅰ 問3
 *
 * 原図の並びのまま 340 の幅に入れた。上の段は、真ん中の上に (H)SWG サービス、その下にインターネット（2行）、
 * 左上に (A)ソフト E と (B) R-PC、左に (C)公開 NTP サーバ、右に (J)K 社 SaaS。J 社の中は図1 と同じ並びで、
 * 箱の名前に (D)〜(M) が付く。内部セグメントの PC は、原図どおりソフト E の楕円が PC の箱の上の縁に重なる組で描く。
 *
 * 破線の矢印（社内の PC から K 社 SaaS へのアクセス経路）は原図の要素。原図どおり (G)PC の中から (F)ソフト E の左を上り、
 * L2SW の上の縁に沿ってから L2SW—L3SW の線の右に並んで L3SW の中へ入り、L3SW・(I)FW・インターネットの楕円の右寄りを
 * 縦に上って (H) の箱の中で折り返し、楕円の中から (J) へ向かう。箱の中を通るので、ノードの後に描く。
 * 箱の文字に掛からないよう、L3SW を原図と同じく背の高い箱にし（下の余白を破線が通る）、FW と L3SW は文字の右に 7 以上の余白が
 * 残る幅にした。(F) の楕円と (G)PC の箱は、破線が文字の左を通る分だけほかの組より広い。破線は原図の線の太さを測って、
 * 実線の 1.5 倍にした。
 *
 * 色は役割だけで決めている。FW・L2SW・L3SW は device、サーバ・PC・R-PC と、PC に入れるソフト E は host、
 * インターネット・SWG サービス・K 社 SaaS は outside。破線の矢印は論理の経路なので LOGICAL。
 *
 * 解説を開いたときは、R-PC から業務用サーバへの経路（設問3(2)）を赤でなぞり、社内の PC から L3SW までの直接の道
 * （設問3(5)）を薄い赤で示し、(E)リバースプロキシサーバと (I)FW に輪を付ける。
 */

type Rect = { x: number; y: number; w: number; h: number }
type Pt = [number, number]

const SIZE = 7.5
const SMALL = 7
/** 破線の矢印の太さ（原図の実線の 1.5 倍） */
const ROUTE_W = 1.8

/** 上の段（J 社の外） */
const SWG: Rect = { x: 110, y: 2, w: 80, h: 28 }
const INET = { cx: 150, cy: 56, rx: 44, ry: 16 }
const SOFT_A = { cx: 42, cy: 14, rx: 34, ry: 10 }
const RPC: Rect = { x: 18, y: 16, w: 50, h: 26 }
const PUB_NTP: Rect = { x: 4, y: 47, w: 90, h: 18 }
const KSAAS: Rect = { x: 250, y: 41, w: 46, h: 30 }
/** (A) から インターネットへの線（両端は楕円の中） */
const A_INET: [number, number, number, number] = [74, 15, 128, 47]

/** J 社と DMZ */
const JSHA: Rect = { x: 4, y: 80, w: 332, h: 276 }
const DMZ: Rect = { x: 8, y: 98, w: 110, h: 108 }
const NTP: Rect = { x: 14, y: 120, w: 44, h: 30 }
const RPROXY: Rect = { x: 14, y: 156, w: 52, h: 42 }
const L2SW_D: Rect = { x: 78, y: 147, w: 36, h: 18 }

/** 真ん中の列。L3SW は原図と同じく背が高く、下の余白を破線が通る */
const FW: Rect = { x: 125, y: 147, w: 50, h: 18 }
const L3: Rect = { x: 125, y: 171, w: 50, h: 28 }

/** サーバセグメント */
const SRV_SEG: Rect = { x: 210, y: 125, w: 124, h: 116 }
const L2SW_S: Rect = { x: 218, y: 176, w: 36, h: 18 }
const SRV_X = 276
const SRV_W = 54
const SERVERS: { lines: string[]; y: number }[] = [
  { lines: ['(K)業務用', 'サーバ'], y: 135 },
  { lines: ['(L)認証', 'サーバ'], y: 170 },
  { lines: ['(M)syslog', 'サーバ'], y: 205 },
]

/** 内部セグメント（L2SW 2台と、ソフト E と PC の組が4つ） */
const INNER: Rect = { x: 8, y: 250, w: 302, h: 98 }
const L2SW_L: Rect = { x: 68, y: 270, w: 36, h: 18 }
const L2SW_R: Rect = { x: 216, y: 270, w: 36, h: 18 }
const SOFT_Y = 312
const SOFT_RY = 10
const PC_Y = 316
const PC_H = 24
/** 組の並び。左端の (F)・(G) だけ、破線が文字の左を通る分だけ広い */
const PAIRS: { cx: number; rx: number; pcW: number; soft: string; pc: string; textDx: number }[] = [
  { cx: 46, rx: 34, pcW: 44, soft: '(F)ソフト E', pc: '(G)PC', textDx: 3 },
  { cx: 126, rx: 30, pcW: 32, soft: 'ソフト E', pc: 'PC', textDx: 0 },
  { cx: 196, rx: 30, pcW: 32, soft: 'ソフト E', pc: 'PC', textDx: 0 },
  { cx: 272, rx: 30, pcW: 32, soft: 'ソフト E', pc: 'PC', textDx: 0 },
]

const mid = (r: Rect) => r.x + r.w / 2
const midY = (r: Rect) => r.y + r.h / 2
const bottom = (r: Rect) => r.y + r.h
const right = (r: Rect) => r.x + r.w

/** 破線の矢印（社内の PC から K 社 SaaS へ）。原図どおり、実線の脇を並んで通る */
const ACCESS: Pt[] = [
  [28, 334],
  [18, 318],
  [18, 296],
  [72, 266],
  [96, 266],
  [150, 195],
  [172, 195],
  [172, 26],
  [182, 26],
  [182, 48],
  [KSAAS.x, 48],
]

/**
 * ソフト E の楕円が上の縁に重なる PC の箱。楕円より先に描き、文字は楕円の下に見える所の真ん中に置く
 * （文字と箱を1つの `<g>` に入れ、§5.4 の検査2 で余白を測れるようにする）。
 */
function PcUnder({ x, y, w, h, label, textDx, visibleTop }: Rect & { label: string; textDx: number; visibleTop: number }) {
  const t = TONE.host
  const fs = SIZE * FONT_SCALE
  const cy = (visibleTop + y + h) / 2
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={2} fill={t.fill} stroke={t.stroke} strokeWidth={1.2} />
      <text x={x + w / 2 + textDx} y={cy + fs * 0.44} textAnchor="middle" fontSize={fs} fontWeight={700} fill={t.text}>
        {label}
      </text>
    </g>
  )
}

/** 文字を楕円の真ん中から横にずらせる楕円（(F) は破線が文字の左を通るので右へ寄せる） */
function SoftEll({ cx, cy, rx, ry, label, textDx }: { cx: number; cy: number; rx: number; ry: number; label: string; textDx: number }) {
  const t = TONE.host
  const fs = SIZE * FONT_SCALE
  return (
    <g>
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={t.fill} stroke={t.stroke} strokeWidth={1.2} />
      <text x={cx + textDx} y={cy + fs * 0.44} textAnchor="middle" fontSize={fs} fontWeight={700} fill={t.text}>
        {label}
      </text>
    </g>
  )
}

/** 楕円の下の縁の y（PC の箱の文字を、楕円の下に見える所に置くため） */
const ellBottomAt = (cx: number, rx: number, x: number) => SOFT_Y + SOFT_RY * Math.sqrt(Math.max(0, 1 - ((x - cx) / rx) ** 2))

export default function R7G13Fig2({ highlight = false }: ExamFigureProps) {
  const arrow = useFigureId('r7g13-arrow')
  const g = PAIRS[0]
  return (
    <FigSvg w={340} h={376} title="図2 SWG サービス導入時のネットワーク構成">
      <defs>
        <marker id={arrow} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="4.2" markerHeight="4.2" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10" fill="none" stroke={LOGICAL} strokeWidth={2} />
        </marker>
      </defs>

      {/* ── 囲み ───────────────────────────────────── */}
      <Frame rect={JSHA} lines={['J 社']} />
      <Frame rect={DMZ} lines={['DMZ']} dashed />
      <Frame rect={SRV_SEG} lines={['サーバ', 'セグメント']} dashed />
      <Frame rect={INNER} lines={['内部セグメント']} dashed />

      {/* ── 線 ─────────────────────────────────────── */}
      <Wire x1={A_INET[0]} y1={A_INET[1]} x2={A_INET[2]} y2={A_INET[3]} />
      <Wire x1={right(PUB_NTP)} y1={INET.cy} x2={INET.cx - INET.rx} y2={INET.cy} />
      <Wire x1={INET.cx + INET.rx - 4} y1={INET.cy + 4} x2={KSAAS.x} y2={INET.cy + 4} />
      <Wire x1={mid(SWG)} y1={bottom(SWG)} x2={INET.cx} y2={INET.cy - INET.ry} />
      <Wire x1={INET.cx} y1={INET.cy + INET.ry} x2={mid(FW)} y2={FW.y} />
      <Wire x1={right(NTP)} y1={midY(NTP)} x2={L2SW_D.x} y2={midY(L2SW_D) - 4} />
      <Wire x1={right(RPROXY)} y1={midY(RPROXY)} x2={L2SW_D.x} y2={midY(L2SW_D) + 4} />
      <Wire x1={right(L2SW_D)} y1={midY(L2SW_D)} x2={FW.x} y2={midY(FW)} />
      <Wire x1={mid(FW)} y1={bottom(FW)} x2={mid(L3)} y2={L3.y} />
      <Wire x1={right(L3)} y1={midY(L3)} x2={L2SW_S.x} y2={midY(L2SW_S)} />
      {SERVERS.map((s) => (
        <Wire key={s.y} x1={right(L2SW_S)} y1={midY(L2SW_S)} x2={SRV_X} y2={s.y + 15} />
      ))}
      <Wire x1={mid(L3) - 10} y1={bottom(L3)} x2={mid(L2SW_L)} y2={L2SW_L.y} />
      <Wire x1={mid(L3) + 10} y1={bottom(L3)} x2={mid(L2SW_R)} y2={L2SW_R.y} />
      {([L2SW_L, L2SW_R] as const).map((sw, k) =>
        ([0, 1] as const).map((j) => {
          const p = PAIRS[k * 2 + j]
          return <Wire key={`${k}${j}`} x1={mid(sw) + (j === 0 ? -6 : 6)} y1={bottom(sw)} x2={p.cx} y2={SOFT_Y - SOFT_RY} />
        }),
      )}

      {/* ── 強調：R-PC から業務用サーバへの経路（赤）、社内の PC から L3SW への直接の道（薄い赤）、(E)・(I) の輪 ── */}
      {highlight && (
        <g>
          <Ring {...RPROXY} />
          <Ring {...FW} />
          <Route
            soft
            points={[
              [g.cx, PC_Y + 14],
              [g.cx, SOFT_Y],
              [g.cx, SOFT_Y - SOFT_RY],
              [mid(L2SW_L) - 6, bottom(L2SW_L)],
              [mid(L2SW_L), midY(L2SW_L)],
              [mid(L2SW_L), L2SW_L.y],
              [mid(L3) - 10, bottom(L3)],
              [mid(L3), midY(L3)],
            ]}
          />
          <Route
            points={[
              [mid(RPC), 34],
              [SOFT_A.cx, SOFT_A.cy],
              [A_INET[0], A_INET[1]],
              [A_INET[2], A_INET[3]],
              [INET.cx, INET.cy],
              [INET.cx, INET.cy - INET.ry],
              [mid(SWG), bottom(SWG)],
              [mid(SWG), midY(SWG)],
              [mid(FW), FW.y],
              [mid(FW), midY(FW)],
              [FW.x, midY(FW)],
              [right(L2SW_D), midY(L2SW_D)],
              [mid(L2SW_D), midY(L2SW_D)],
              [L2SW_D.x, midY(L2SW_D) + 4],
              [right(RPROXY), midY(RPROXY)],
              [mid(RPROXY), midY(RPROXY)],
            ]}
          />
          <Route
            points={[
              [mid(RPROXY), midY(RPROXY)],
              [right(RPROXY), midY(RPROXY)],
              [L2SW_D.x, midY(L2SW_D) + 4],
              [mid(L2SW_D), midY(L2SW_D)],
              [right(L2SW_D), midY(L2SW_D)],
              [FW.x, midY(FW)],
              [mid(FW), midY(FW)],
              [mid(FW), bottom(FW)],
              [mid(L3), L3.y],
              [mid(L3), midY(L3)],
              [right(L3), midY(L3)],
              [L2SW_S.x, midY(L2SW_S)],
              [mid(L2SW_S), midY(L2SW_S)],
              [right(L2SW_S), midY(L2SW_S)],
              [SRV_X, SERVERS[0].y + 15],
              [SRV_X + SRV_W / 2, SERVERS[0].y + 15],
            ]}
          />
        </g>
      )}

      {/* ── ノード ───────────────────────────────────── */}
      <Box {...SWG} tone="outside" lines={['(H)SWG サービス']} size={SIZE} />
      <Ell {...INET} tone="outside" lines={['インター', 'ネット']} size={SIZE} />
      <PcUnder {...RPC} label="(B) R-PC" textDx={0} visibleTop={SOFT_A.cy + SOFT_A.ry} />
      <SoftEll {...SOFT_A} label="(A)ソフト E" textDx={0} />
      <Box {...PUB_NTP} tone="host" lines={['(C)公開 NTP サーバ']} size={SIZE} />
      <Box {...KSAAS} tone="outside" lines={['(J)K 社', 'SaaS']} size={SIZE} />
      <Box {...NTP} tone="host" lines={['(D)NTP', 'サーバ']} size={SIZE} />
      <Box {...RPROXY} tone="host" lines={['(E)リバース', 'プロキシ', 'サーバ']} size={SIZE} />
      <Box {...L2SW_D} tone="device" lines={['L2SW']} size={SIZE} />
      <Box {...FW} tone="device" lines={['(I)FW']} size={SIZE} />
      <Box {...L3} tone="device" lines={['L3SW']} size={SIZE} />
      <Box {...L2SW_S} tone="device" lines={['L2SW']} size={SIZE} />
      {SERVERS.map((s) => (
        <Box key={s.y} x={SRV_X} y={s.y} w={SRV_W} h={30} tone="host" lines={s.lines} size={SIZE} />
      ))}
      <Box {...L2SW_L} tone="device" lines={['L2SW']} size={SIZE} />
      <Box {...L2SW_R} tone="device" lines={['L2SW']} size={SIZE} />
      {PAIRS.map((p) => (
        <g key={p.cx}>
          <PcUnder
            x={p.cx - p.pcW / 2}
            y={PC_Y}
            w={p.pcW}
            h={PC_H}
            label={p.pc}
            textDx={p.textDx}
            visibleTop={ellBottomAt(p.cx, p.rx, p.cx - p.pcW / 2)}
          />
          <SoftEll cx={p.cx} cy={SOFT_Y} rx={p.rx} ry={SOFT_RY} label={p.soft} textDx={p.textDx} />
        </g>
      ))}
      <Dots x={mid(L2SW_L)} y={SOFT_Y + 3} />
      <Dots x={mid(L2SW_R)} y={SOFT_Y + 3} />

      {/* ── 破線の矢印（原図の要素。箱の中を通るのでノードの後） ─────── */}
      <Poly points={ACCESS} color={LOGICAL} width={ROUTE_W} dash="4 3" markerEnd={`url(#${arrow})`} />

      {/* ── 凡例 ───────────────────────────────────── */}
      <Poly points={[[8, 366], [30, 366]]} color={LOGICAL} width={ROUTE_W} dash="4 3" markerEnd={`url(#${arrow})`} />
      <Cap x={33} y={369} text="：社内の PC から K 社 SaaS へのアクセス経路" size={SMALL} color={MUTED} />
    </FigSvg>
  )
}
