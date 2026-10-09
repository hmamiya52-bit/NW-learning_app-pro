import { Box, Cap, Ell, FigSvg, Ring, Route, Wire } from './primitives'
import { DmzFrame, Dots, Frame, ServerStack } from './H30G13Parts'
import { SIZE, SMALL, TEXT, stackFeeds } from './h30g13Layout'
import type { Pt, Rect } from './h30g13Layout'
import { MUTED } from './tokens'
import type { ExamFigureProps } from './tokens'

/**
 * 図1 D 社の現行ネットワーク構成（抜粋）— H30 午後Ⅰ 問3
 *
 * 原図の並び（上に本社とその右のインターネット、下の段に左の大阪支店と右の名古屋支店）は組み直さずに 340 の幅へ入れた。
 * ルータ1 から大阪支店のルータ2・名古屋支店のルータ3 への専用線と、ルータ2 とルータ3 のあいだの専用線は原図どおり。
 * 業務サーバは原図どおり3枚の重ね書きで、L3SW から3本の縦の線をそれぞれの箱へ下ろす。略語の説明は原図では図の右下にあるが、
 * 375px に合わせて図の下へ移した。
 *
 * 色は役割だけで決めている。L2SW・L3SW・FW・ルータは device、プロキシサーバ・業務サーバ・PC は host、インターネットは outside。
 *
 * 解説を開いたときは、3本の専用線をなぞり（見直しで IP-VPN とインターネット VPN に置き換える部分）、
 * 各拠点のインターネットの出口になる本社 DMZ のプロキシサーバに輪を付ける。
 */

/** 本社 */
const HQ: Rect = { x: 2, y: 4, w: 236, h: 146 }
const DMZ: Rect = { x: 158, y: 10, w: 76, h: 66 }
const PROXY: Rect = { x: 189, y: 14, w: 40, h: 30 }
const L2SW2: Rect = { x: 188, y: 52, w: 42, h: 18 }
const L2SW1: Rect = { x: 8, y: 83, w: 42, h: 18 }
const L3SW1: Rect = { x: 62, y: 83, w: 116, h: 18 }
const FW1: Rect = { x: 194, y: 83, w: 30, h: 18 }
const ROW_Y = 92
const HQ_PC: Rect[] = [
  { x: 5, y: 112, w: 22, h: 18 },
  { x: 41, y: 112, w: 22, h: 18 },
]
const HQ_STACK: Rect = { x: 70, y: 116, w: 34, h: 30 }
const R1: Rect = { x: 151, y: 112, w: 38, h: 18 }
const INET = { cx: 293, cy: 92, rx: 42, ry: 12 }

/** 大阪支店（ルータ2 は右上） */
const OSAKA: Rect = { x: 2, y: 170, w: 148, h: 104 }
const R2: Rect = { x: 104, y: 176, w: 38, h: 18 }
const L2SW3: Rect = { x: 12, y: 206, w: 42, h: 18 }
const L3SW2: Rect = { x: 90, y: 206, w: 42, h: 18 }
const OS_PC: Rect[] = [
  { x: 6, y: 240, w: 22, h: 18 },
  { x: 42, y: 240, w: 22, h: 18 },
]
const OS_STACK: Rect = { x: 88, y: 240, w: 32, h: 30 }

/** 名古屋支店（ルータ3 は左上。L3SW3 と L2SW4 の左右は原図どおり大阪支店と逆） */
const NAGOYA: Rect = { x: 190, y: 170, w: 148, h: 104 }
const R3: Rect = { x: 196, y: 176, w: 38, h: 18 }
const L3SW3: Rect = { x: 204, y: 206, w: 42, h: 18 }
const L2SW4: Rect = { x: 282, y: 206, w: 42, h: 18 }
const NG_STACK: Rect = { x: 204, y: 240, w: 32, h: 30 }
const NG_PC: Rect[] = [
  { x: 272, y: 240, w: 22, h: 18 },
  { x: 308, y: 240, w: 22, h: 18 },
]
const BR_ROW_Y = 215

/** 専用線（ルータ1 → ルータ2、ルータ1 → ルータ3、ルータ2 → ルータ3） */
const LL_R2: Pt[] = [
  [160, 130],
  [130, 176],
]
const LL_R3: Pt[] = [
  [180, 130],
  [210, 176],
]
const LL_Y = 185

const mid = (r: Rect) => r.x + r.w / 2
const bottom = (r: Rect) => r.y + r.h

/** L2SW から PC の組への2本 */
function pcLegs(sw: Rect, pcs: Rect[]): Pt[][] {
  return pcs.map((pc, i) => [
    [mid(sw) + (i === 0 ? -6 : 6), bottom(sw)],
    [mid(pc), pc.y],
  ])
}

export default function H30G13Fig1({ highlight = false }: ExamFigureProps) {
  const legs = [
    ...pcLegs(L2SW1, HQ_PC),
    ...pcLegs(L2SW3, OS_PC),
    ...pcLegs(L2SW4, NG_PC),
    ...stackFeeds(HQ_STACK, bottom(L3SW1)),
    ...stackFeeds(OS_STACK, bottom(L3SW2)),
    ...stackFeeds(NG_STACK, bottom(L3SW3)),
  ]
  return (
    <FigSvg w={340} h={298} title="図1 D 社の現行ネットワーク構成（抜粋）">
      {/* ── 囲み ───────────────────────────────────── */}
      <Frame rect={HQ} label="本社" />
      <DmzFrame rect={DMZ} />
      <Frame rect={OSAKA} label="大阪支店" />
      <Frame rect={NAGOYA} label="名古屋支店" at="tr" />

      {/* ── 線 ─────────────────────────────────────── */}
      <Wire x1={mid(PROXY)} y1={bottom(PROXY)} x2={mid(L2SW2)} y2={L2SW2.y} />
      <Wire x1={mid(L2SW2)} y1={bottom(L2SW2)} x2={mid(FW1)} y2={FW1.y} />
      <Wire x1={L2SW1.x + L2SW1.w} y1={ROW_Y} x2={L3SW1.x} y2={ROW_Y} />
      <Wire x1={L3SW1.x + L3SW1.w} y1={ROW_Y} x2={FW1.x} y2={ROW_Y} />
      <Wire x1={FW1.x + FW1.w} y1={ROW_Y} x2={INET.cx - INET.rx + 4} y2={ROW_Y} />
      <Wire x1={166} y1={bottom(L3SW1)} x2={166} y2={R1.y} />
      <Wire x1={LL_R2[0][0]} y1={LL_R2[0][1]} x2={LL_R2[1][0]} y2={LL_R2[1][1]} />
      <Wire x1={LL_R3[0][0]} y1={LL_R3[0][1]} x2={LL_R3[1][0]} y2={LL_R3[1][1]} />
      <Wire x1={R2.x + R2.w} y1={LL_Y} x2={R3.x} y2={LL_Y} />
      <Wire x1={116} y1={bottom(R2)} x2={116} y2={L3SW2.y} />
      <Wire x1={214} y1={bottom(R3)} x2={214} y2={L3SW3.y} />
      <Wire x1={L2SW3.x + L2SW3.w} y1={BR_ROW_Y} x2={L3SW2.x} y2={BR_ROW_Y} />
      <Wire x1={L3SW3.x + L3SW3.w} y1={BR_ROW_Y} x2={L2SW4.x} y2={BR_ROW_Y} />
      {legs.map(([a, b], i) => (
        <Wire key={i} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} />
      ))}

      {/* ── 強調：3本の専用線と、インターネットの出口のプロキシサーバ ── */}
      {highlight && (
        <g>
          <Ring {...PROXY} />
          <Route
            points={[
              [mid(R2), LL_Y],
              LL_R2[1],
              LL_R2[0],
              [mid(R1), 121],
              LL_R3[0],
              LL_R3[1],
              [mid(R3), LL_Y],
              [R3.x, LL_Y],
              [R2.x + R2.w, LL_Y],
              [mid(R2), LL_Y],
            ]}
          />
        </g>
      )}

      {/* ── ノード ───────────────────────────────────── */}
      <Box {...PROXY} tone="host" lines={['プロキシ', 'サーバ']} size={SIZE} />
      <Box {...L2SW2} tone="device" lines={['L2SW2']} size={SIZE} />
      <Box {...L2SW1} tone="device" lines={['L2SW1']} size={SIZE} />
      <Box {...L3SW1} tone="device" lines={['L3SW1']} size={SIZE} />
      <Box {...FW1} tone="device" lines={['FW1']} size={SIZE} />
      <Ell {...INET} tone="outside" lines={['インターネット']} size={SIZE} />
      {HQ_PC.map((r) => (
        <Box key={r.x} {...r} tone="host" lines={['PC']} size={SIZE} />
      ))}
      <Dots x={34} y={124} />
      <ServerStack front={HQ_STACK} />
      <Box {...R1} tone="device" lines={['ルータ1']} size={SIZE} />
      {/* 大阪支店 */}
      <Box {...R2} tone="device" lines={['ルータ2']} size={SIZE} />
      <Box {...L2SW3} tone="device" lines={['L2SW3']} size={SIZE} />
      <Box {...L3SW2} tone="device" lines={['L3SW2']} size={SIZE} />
      {OS_PC.map((r) => (
        <Box key={r.x} {...r} tone="host" lines={['PC']} size={SIZE} />
      ))}
      <Dots x={35} y={252} />
      <ServerStack front={OS_STACK} />
      {/* 名古屋支店 */}
      <Box {...R3} tone="device" lines={['ルータ3']} size={SIZE} />
      <Box {...L3SW3} tone="device" lines={['L3SW3']} size={SIZE} />
      <Box {...L2SW4} tone="device" lines={['L2SW4']} size={SIZE} />
      <ServerStack front={NG_STACK} />
      {NG_PC.map((r) => (
        <Box key={r.x} {...r} tone="host" lines={['PC']} size={SIZE} />
      ))}
      <Dots x={301} y={252} />

      {/* ── 札（専用線）と略語の説明（原図は図の右下。375px に合わせて図の下へ） ── */}
      <Cap x={133} y={163} text="専用線" anchor="end" size={SMALL} color={TEXT} />
      <Cap x={206} y={163} text="専用線" size={SMALL} color={TEXT} />
      <Cap x={169} y={180.5} text="専用線" anchor="middle" size={SMALL} color={TEXT} />
      <Cap x={6} y={292} text="L2SW：レイヤ2スイッチ" size={SMALL} color={MUTED} />
      <Cap x={94} y={292} text="L3SW：レイヤ3スイッチ" size={SMALL} color={MUTED} />
      <Cap x={182} y={292} text="FW：ファイアウォール" size={SMALL} color={MUTED} />
    </FigSvg>
  )
}
