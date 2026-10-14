import { Box, Cap, Ell, FigSvg, Ring, Route, Wire } from './primitives'
import { MUTED } from './tokens'
import type { ExamFigureProps } from './tokens'
import { Dots, Frame } from './R7G13Parts'

/**
 * 図1 現状の J 社のネットワーク構成 — R7 午後Ⅰ 問3
 *
 * 原図の並び（上の段に公開 NTP サーバ・インターネット・K 社 SaaS、J 社の中は左上に DMZ、真ん中に FW と L3SW、
 * 右にサーバセグメント、下に内部セグメント）のまま 340 の幅に入れた。略語の説明も原図どおり図の下に置く。
 * サーバセグメントの3台は2行の箱なので縦に長くなり、内部セグメントはその下から始める（原図も同じ上下の関係）。
 *
 * 色は役割だけで決めている。FW・L2SW・L3SW は device、NTP サーバ・プロキシサーバ・業務用サーバ・認証サーバ・
 * syslog サーバ・PC と、プロバイダの公開 NTP サーバは host（サーバは持ち主によらず host）、インターネットと K 社 SaaS は outside。
 *
 * 解説を開いたときは、PC から L3SW・FW を通って DMZ のプロキシサーバへ行き、FW からインターネットへ出る道筋をなぞり、
 * NTP サーバ・L3SW・syslog サーバに輪を付ける。
 */

type Rect = { x: number; y: number; w: number; h: number }

const SIZE = 7.5
const SMALL = 7

/** 上の段（J 社の外） */
const PUB_NTP: Rect = { x: 20, y: 4, w: 78, h: 18 }
const INET = { cx: 150, cy: 13, rx: 40, ry: 11 }
const KSAAS: Rect = { x: 218, y: 4, w: 56, h: 18 }

/** J 社と DMZ */
const JSHA: Rect = { x: 4, y: 34, w: 332, h: 248 }
const DMZ: Rect = { x: 8, y: 50, w: 110, h: 94 }
const NTP: Rect = { x: 14, y: 72, w: 40, h: 30 }
const PROXY: Rect = { x: 14, y: 108, w: 40, h: 30 }
const L2SW_D: Rect = { x: 76, y: 96, w: 36, h: 18 }

/** 真ん中の列（インターネットの真下に FW、その下に L3SW） */
const FW: Rect = { x: 134, y: 96, w: 32, h: 18 }
const L3: Rect = { x: 132, y: 126, w: 36, h: 18 }

/** サーバセグメント（L2SW から右の3台へ扇形に引く） */
const SRV_SEG: Rect = { x: 210, y: 79, w: 124, h: 112 }
const L2SW_S: Rect = { x: 218, y: 126, w: 36, h: 18 }
const SRV_X = 284
const SRV_W = 40
const SERVERS: { lines: string[]; y: number }[] = [
  { lines: ['業務用', 'サーバ'], y: 85 },
  { lines: ['認証', 'サーバ'], y: 120 },
  { lines: ['syslog', 'サーバ'], y: 155 },
]

/** 内部セグメント（L2SW 2台と、それぞれの下の「PC ⋯ PC」） */
const INNER: Rect = { x: 8, y: 198, w: 236, h: 76 }
const L2SW_L: Rect = { x: 72, y: 216, w: 36, h: 18 }
const L2SW_R: Rect = { x: 182, y: 216, w: 36, h: 18 }
const PC_Y = 248
const PC_W = 26
const PC_X = [56, 98, 166, 208]

const mid = (r: Rect) => r.x + r.w / 2
const midY = (r: Rect) => r.y + r.h / 2
const bottom = (r: Rect) => r.y + r.h
const right = (r: Rect) => r.x + r.w

/** L2SW の下の辺から PC の上の辺の真ん中へ（左の PC は左寄り、右の PC は右寄りから出す） */
const pcLink = (sw: Rect, k: 0 | 1, pcX: number): [number, number, number, number] => [
  mid(sw) + (k === 0 ? -6 : 6),
  bottom(sw),
  pcX + PC_W / 2,
  PC_Y,
]

export default function R7G13Fig1({ highlight = false }: ExamFigureProps) {
  return (
    <FigSvg w={340} h={302} title="図1 現状の J 社のネットワーク構成">
      {/* ── 囲み ───────────────────────────────────── */}
      <Frame rect={JSHA} lines={['J 社']} />
      <Frame rect={DMZ} lines={['DMZ']} dashed />
      <Frame rect={SRV_SEG} lines={['サーバセグメント']} dashed />
      <Frame rect={INNER} lines={['内部セグメント']} dashed />

      {/* ── 線 ─────────────────────────────────────── */}
      <Wire x1={right(PUB_NTP)} y1={INET.cy} x2={INET.cx - INET.rx} y2={INET.cy} />
      <Wire x1={INET.cx + INET.rx} y1={INET.cy} x2={KSAAS.x} y2={INET.cy} />
      <Wire x1={INET.cx} y1={INET.cy + INET.ry} x2={mid(FW)} y2={FW.y} />
      <Wire x1={right(NTP)} y1={midY(NTP)} x2={L2SW_D.x} y2={midY(L2SW_D) - 4} />
      <Wire x1={right(PROXY)} y1={midY(PROXY)} x2={L2SW_D.x} y2={midY(L2SW_D) + 4} />
      <Wire x1={right(L2SW_D)} y1={midY(L2SW_D)} x2={FW.x} y2={midY(FW)} />
      <Wire x1={mid(FW)} y1={bottom(FW)} x2={mid(L3)} y2={L3.y} />
      <Wire x1={right(L3)} y1={midY(L3)} x2={L2SW_S.x} y2={midY(L2SW_S)} />
      {SERVERS.map((s) => (
        <Wire key={s.y} x1={right(L2SW_S)} y1={midY(L2SW_S)} x2={SRV_X} y2={s.y + 15} />
      ))}
      <Wire x1={mid(L3) - 6} y1={bottom(L3)} x2={mid(L2SW_L)} y2={L2SW_L.y} />
      <Wire x1={mid(L3) + 6} y1={bottom(L3)} x2={mid(L2SW_R)} y2={L2SW_R.y} />
      {([L2SW_L, L2SW_R] as const).map((sw, g) =>
        ([0, 1] as const).map((k) => {
          const [x1, y1, x2, y2] = pcLink(sw, k, PC_X[g * 2 + k])
          return <Wire key={`${g}${k}`} x1={x1} y1={y1} x2={x2} y2={y2} />
        }),
      )}

      {/* ── 強調：PC → プロキシサーバ → インターネットの道筋、NTP サーバ・L3SW・syslog サーバの輪 ── */}
      {highlight && (
        <g>
          <Ring {...NTP} />
          <Ring {...L3} />
          <Ring x={SRV_X} y={SERVERS[2].y} w={SRV_W} h={30} />
          <Route
            points={[
              [PC_X[0] + PC_W / 2, PC_Y + 9],
              [PC_X[0] + PC_W / 2, PC_Y],
              [mid(L2SW_L) - 6, bottom(L2SW_L)],
              [mid(L2SW_L), midY(L2SW_L)],
              [mid(L2SW_L), L2SW_L.y],
              [mid(L3) - 6, bottom(L3)],
              [mid(L3), midY(L3)],
              [mid(L3), L3.y],
              [mid(FW), bottom(FW)],
              [mid(FW), midY(FW)],
              [FW.x, midY(FW)],
              [right(L2SW_D), midY(L2SW_D)],
              [mid(L2SW_D), midY(L2SW_D)],
              [L2SW_D.x, midY(L2SW_D) + 4],
              [right(PROXY), midY(PROXY)],
              [mid(PROXY), midY(PROXY)],
            ]}
          />
          <Route
            points={[
              [mid(PROXY), midY(PROXY)],
              [right(PROXY), midY(PROXY)],
              [L2SW_D.x, midY(L2SW_D) + 4],
              [mid(L2SW_D), midY(L2SW_D)],
              [right(L2SW_D), midY(L2SW_D)],
              [FW.x, midY(FW)],
              [mid(FW), midY(FW)],
              [mid(FW), FW.y],
              [INET.cx, INET.cy + INET.ry],
              [INET.cx, INET.cy],
            ]}
          />
        </g>
      )}

      {/* ── ノード ───────────────────────────────────── */}
      <Box {...PUB_NTP} tone="host" lines={['公開 NTP サーバ']} size={SIZE} />
      <Ell {...INET} tone="outside" lines={['インターネット']} size={SIZE} />
      <Box {...KSAAS} tone="outside" lines={['K 社 SaaS']} size={SIZE} />
      <Box {...NTP} tone="host" lines={['NTP', 'サーバ']} size={SIZE} />
      <Box {...PROXY} tone="host" lines={['プロキシ', 'サーバ']} size={SIZE} />
      <Box {...L2SW_D} tone="device" lines={['L2SW']} size={SIZE} />
      <Box {...FW} tone="device" lines={['FW']} size={SIZE} />
      <Box {...L3} tone="device" lines={['L3SW']} size={SIZE} />
      <Box {...L2SW_S} tone="device" lines={['L2SW']} size={SIZE} />
      {SERVERS.map((s) => (
        <Box key={s.y} x={SRV_X} y={s.y} w={SRV_W} h={30} tone="host" lines={s.lines} size={SIZE} />
      ))}
      <Box {...L2SW_L} tone="device" lines={['L2SW']} size={SIZE} />
      <Box {...L2SW_R} tone="device" lines={['L2SW']} size={SIZE} />
      {PC_X.map((x) => (
        <Box key={x} x={x} y={PC_Y} w={PC_W} h={18} tone="host" lines={['PC']} size={SIZE} />
      ))}
      <Dots x={mid(L2SW_L)} y={PC_Y + 12} />
      <Dots x={mid(L2SW_R)} y={PC_Y + 12} />

      {/* ── 略語の説明（原図どおり図の下） ─────────────────── */}
      <Cap x={6} y={296} text="L2SW：レイヤー2スイッチ" size={SMALL} color={MUTED} />
      <Cap x={106} y={296} text="L3SW：レイヤー3スイッチ" size={SMALL} color={MUTED} />
      <Cap x={206} y={296} text="FW：ファイアウォール" size={SMALL} color={MUTED} />
    </FigSvg>
  )
}
