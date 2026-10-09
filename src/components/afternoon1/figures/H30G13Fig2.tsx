import { Box, Ell, FigSvg, Poly, Ring, Route, Wire } from './primitives'
import { DmzFrame, Dots, Frame, HatchBox, HatchPattern, ServerStack } from './H30G13Parts'
import { SIZE, stackFeeds } from './h30g13Layout'
import type { Pt, Rect } from './h30g13Layout'
import { FONT_SCALE, LOGICAL, TONE, useFigureId } from './tokens'
import type { ExamFigureProps } from './tokens'

/**
 * 図2 E さんが考えた D 社のネットワーク構成（抜粋）— H30 午後Ⅰ 問3
 *
 * 原図の並び（左上に本社、右にインターネットの大きな楕円、本社の下に IP-VPN、下の段に左の大阪支店と右の名古屋支店）は
 * 組み直していない。本社の中は図1 からルータ1 を外したもので、L3SW1 から IP-VPN へ下りる。名古屋支店の名前は、原図どおり
 * IP-VPN からの線と FW3 への線のあいだに置いた。
 * IPsec トンネル（原図の破線）は3本で、どれもインターネットの中を通る（FW1 → FW3 は楕円の中の上を回り、FW1 → FW2 は楕円の中の左で折り返し、
 * FW2 → FW3 は楕円の中の下を通る）。原図どおり楕円の中に破線が見えるよう、楕円を囲みと同じく先に描き、実線は楕円の縁で止める。
 * 注記1・2（破線と網掛け）は見本の記号を持たないので examFigures の note に置く。
 *
 * 色は役割だけで決めている。L2SW・L3SW・FW は device、プロキシサーバ・業務サーバ・PC は host、インターネットと IP-VPN は outside。
 * 網掛け（追加された FW2・FW3）は役割の色の上に斜線を重ね、IPsec トンネルは論理の線なので LOGICAL の破線にする。
 *
 * 解説を開いたときは、正常時の拠点間の道（大阪支店の L3SW2 → IP-VPN → 名古屋支店の L3SW3）をなぞり、予備の FW2 → FW3 のトンネルを
 * 薄くなぞり（設問4 の S-S トンネル）、スポークになる FW2・FW3 に輪を付ける（設問4(3)）。
 */

/** 本社 */
const HQ: Rect = { x: 2, y: 4, w: 200, h: 146 }
const DMZ: Rect = { x: 128, y: 10, w: 70, h: 66 }
const PROXY: Rect = { x: 154, y: 14, w: 40, h: 30 }
const L2SW2: Rect = { x: 153, y: 52, w: 42, h: 18 }
const L2SW1: Rect = { x: 8, y: 83, w: 42, h: 18 }
const L3SW1: Rect = { x: 60, y: 83, w: 76, h: 18 }
const FW1: Rect = { x: 159, y: 83, w: 30, h: 18 }
const ROW_Y = 92
const HQ_PC: Rect[] = [
  { x: 5, y: 112, w: 22, h: 18 },
  { x: 41, y: 112, w: 22, h: 18 },
]
const HQ_STACK: Rect = { x: 62, y: 116, w: 34, h: 30 }

/** IP-VPN と インターネット */
const IPVPN = { cx: 112, cy: 168, rx: 28, ry: 10 }
const INET = { cx: 276, cy: 120, rx: 58, ry: 42 }

/** 大阪支店 */
const OSAKA: Rect = { x: 2, y: 196, w: 166, h: 100 }
const L2SW3: Rect = { x: 10, y: 224, w: 42, h: 18 }
const L3SW2: Rect = { x: 66, y: 224, w: 42, h: 18 }
const FW2: Rect = { x: 122, y: 224, w: 32, h: 18 }
const OS_PC: Rect[] = [
  { x: 4, y: 258, w: 22, h: 18 },
  { x: 40, y: 258, w: 22, h: 18 },
]
const OS_STACK: Rect = { x: 64, y: 262, w: 32, h: 30 }

/** 名古屋支店（名前は原図どおり、IP-VPN からの線と FW3 への線のあいだに置く） */
const NAGOYA: Rect = { x: 194, y: 196, w: 144, h: 100 }
const L2SW4: Rect = { x: 200, y: 224, w: 42, h: 18 }
const L3SW3: Rect = { x: 252, y: 224, w: 42, h: 18 }
const FW3: Rect = { x: 302, y: 224, w: 32, h: 18 }
const NG_PC: Rect[] = [
  { x: 200, y: 258, w: 22, h: 18 },
  { x: 236, y: 258, w: 22, h: 18 },
]
const NG_STACK: Rect = { x: 262, y: 262, w: 32, h: 30 }
const BR_ROW_Y = 233

/** インターネットの楕円の縁の点（実線はここで止める） */
const onInet = (deg: number): Pt => {
  const r = (deg * Math.PI) / 180
  return [+(INET.cx + INET.rx * Math.cos(r)).toFixed(1), +(INET.cy - INET.ry * Math.sin(r)).toFixed(1)]
}
const inetBottomAt = (x: number) => +(INET.cy + INET.ry * Math.sqrt(1 - ((x - INET.cx) / INET.rx) ** 2)).toFixed(1)
const inetLeftAt = (y: number) => +(INET.cx - INET.rx * Math.sqrt(1 - ((y - INET.cy) / INET.ry) ** 2)).toFixed(1)

/** 実線（インターネットへのアクセス回線と、IP-VPN へのアクセス回線） */
const FW2_UP: Pt[] = [[FW2.x + FW2.w - 2, FW2.y], onInet(215)]
const FW3_UP_X = 318
const IPVPN_TO_L3SW3: Pt[] = [
  [138, 168],
  [276, 224],
]

/** IPsec トンネル（破線）。どれもインターネットの楕円の中を通る */
const T13: Pt[] = [
  [FW1.x + FW1.w, 87],
  [300, 86],
  [322, 100],
  [326, 132],
  [330, FW3.y],
]
const T12: Pt[] = [
  [FW1.x + FW1.w, 97],
  [238, 102],
  [248, 112],
  [240, 126],
  [130, FW2.y],
]
const T23: Pt[] = [
  [FW2.x + FW2.w, 233],
  [240, 140],
  [286, 150],
  [306, FW3.y],
]

const mid = (r: Rect) => r.x + r.w / 2
const bottom = (r: Rect) => r.y + r.h

/** L2SW から PC の組への2本 */
function pcLegs(sw: Rect, pcs: Rect[]): Pt[][] {
  return pcs.map((pc, i) => [
    [mid(sw) + (i === 0 ? -6 : 6), bottom(sw)],
    [mid(pc), pc.y],
  ])
}

/** インターネットの楕円（先に描く）。名前はトンネルを避けて楕円の中の右寄りに置く */
function Internet() {
  const t = TONE.outside
  const fs = SIZE * FONT_SCALE
  return (
    <g>
      <ellipse cx={INET.cx} cy={INET.cy} rx={INET.rx} ry={INET.ry} fill={t.fill} stroke={t.stroke} strokeWidth={1.2} />
      <text x={285} y={126} textAnchor="middle" fontSize={fs} fontWeight={700} fill={t.text}>
        インターネット
      </text>
    </g>
  )
}

export default function H30G13Fig2({ highlight = false }: ExamFigureProps) {
  const hatch = useFigureId('h30g13-hatch')
  const legs = [
    ...pcLegs(L2SW1, HQ_PC),
    ...pcLegs(L2SW3, OS_PC),
    ...pcLegs(L2SW4, NG_PC),
    ...stackFeeds(HQ_STACK, bottom(L3SW1)),
    ...stackFeeds(OS_STACK, bottom(L3SW2)),
    ...stackFeeds(NG_STACK, bottom(L3SW3)),
  ]
  return (
    <FigSvg w={340} h={300} title="図2 E さんが考えた D 社のネットワーク構成（抜粋）">
      <HatchPattern id={hatch} />

      {/* ── 囲みとインターネット（破線を楕円の上に見せるため先に描く） ───── */}
      <Frame rect={HQ} label="本社" />
      <DmzFrame rect={DMZ} />
      <Frame rect={OSAKA} label="大阪支店" />
      <Frame rect={NAGOYA} label="名古屋支店" labelX={249} />
      <Internet />

      {/* ── 線（実線） ───────────────────────────────── */}
      <Wire x1={mid(PROXY)} y1={bottom(PROXY)} x2={mid(L2SW2)} y2={L2SW2.y} />
      <Wire x1={mid(L2SW2)} y1={bottom(L2SW2)} x2={mid(FW1)} y2={FW1.y} />
      <Wire x1={L2SW1.x + L2SW1.w} y1={ROW_Y} x2={L3SW1.x} y2={ROW_Y} />
      <Wire x1={L3SW1.x + L3SW1.w} y1={ROW_Y} x2={FW1.x} y2={ROW_Y} />
      <Wire x1={FW1.x + FW1.w} y1={ROW_Y} x2={inetLeftAt(ROW_Y)} y2={ROW_Y} />
      <Wire x1={120} y1={bottom(L3SW1)} x2={120} y2={161} />
      <Wire x1={92} y1={172} x2={92} y2={L3SW2.y} />
      <Wire x1={IPVPN_TO_L3SW3[0][0]} y1={IPVPN_TO_L3SW3[0][1]} x2={IPVPN_TO_L3SW3[1][0]} y2={IPVPN_TO_L3SW3[1][1]} />
      <Wire x1={FW2_UP[0][0]} y1={FW2_UP[0][1]} x2={FW2_UP[1][0]} y2={FW2_UP[1][1]} />
      <Wire x1={FW3_UP_X} y1={FW3.y} x2={FW3_UP_X} y2={inetBottomAt(FW3_UP_X)} />
      <Wire x1={L2SW3.x + L2SW3.w} y1={BR_ROW_Y} x2={L3SW2.x} y2={BR_ROW_Y} />
      <Wire x1={L3SW2.x + L3SW2.w} y1={BR_ROW_Y} x2={FW2.x} y2={BR_ROW_Y} />
      <Wire x1={L2SW4.x + L2SW4.w} y1={BR_ROW_Y} x2={L3SW3.x} y2={BR_ROW_Y} />
      <Wire x1={L3SW3.x + L3SW3.w} y1={BR_ROW_Y} x2={FW3.x} y2={BR_ROW_Y} />
      {legs.map(([a, b], i) => (
        <Wire key={i} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} />
      ))}

      {/* ── IPsec トンネル（破線） ─────────────────────────── */}
      {[T13, T12, T23].map((pts, i) => (
        <Poly key={i} points={pts} color={LOGICAL} width={1.3} dash="4 3" />
      ))}

      {/* ── 強調：正常時の道、予備の S-S トンネル、スポークの FW2・FW3 ── */}
      {highlight && (
        <g>
          <Ring {...FW2} />
          <Ring {...FW3} />
          <Route points={T23} soft />
          <Route
            points={[
              [92, BR_ROW_Y],
              [92, L3SW2.y],
              [92, 172],
              IPVPN_TO_L3SW3[0],
              IPVPN_TO_L3SW3[1],
              [276, BR_ROW_Y],
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
      {HQ_PC.map((r) => (
        <Box key={r.x} {...r} tone="host" lines={['PC']} size={SIZE} />
      ))}
      <Dots x={34} y={124} />
      <ServerStack front={HQ_STACK} />
      <Ell {...IPVPN} tone="outside" lines={['IP-VPN']} size={SIZE} />
      {/* 大阪支店 */}
      <Box {...L2SW3} tone="device" lines={['L2SW3']} size={SIZE} />
      <Box {...L3SW2} tone="device" lines={['L3SW2']} size={SIZE} />
      <HatchBox rect={FW2} tone="device" label="FW2" patternId={hatch} />
      {OS_PC.map((r) => (
        <Box key={r.x} {...r} tone="host" lines={['PC']} size={SIZE} />
      ))}
      <Dots x={33} y={270} />
      <ServerStack front={OS_STACK} />
      {/* 名古屋支店 */}
      <Box {...L2SW4} tone="device" lines={['L2SW4']} size={SIZE} />
      <Box {...L3SW3} tone="device" lines={['L3SW3']} size={SIZE} />
      <HatchBox rect={FW3} tone="device" label="FW3" patternId={hatch} />
      {NG_PC.map((r) => (
        <Box key={r.x} {...r} tone="host" lines={['PC']} size={SIZE} />
      ))}
      <Dots x={229} y={270} />
      <ServerStack front={NG_STACK} />
    </FigSvg>
  )
}
