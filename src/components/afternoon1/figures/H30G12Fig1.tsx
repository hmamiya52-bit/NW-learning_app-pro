import { Box, Cap, FigSvg, Ring, Route, Wire } from './primitives'
import { FONT_SCALE, FRAME, LINE, MUTED } from './tokens'
import type { ExamFigureProps } from './tokens'

/**
 * 図1 A 社 LAN の構成（抜粋）— H30 午後Ⅰ 問2
 *
 * 原図の並び（上にサーバルーム、下の段に左のフロアラック1・右のフロアラック2、その下に SW の4組と PC）は組み直さずに 340 の幅へ入れた。
 * 下の段の SW（8台）がいちばん幅を取るので、1桁の SW（SW1・SW8・SW9）の箱を 30、2桁の SW を 36 にし、PC の組は左の SW の左の端にそろえた
 * （原図は左の SW の真下に組の真ん中を置く）。コア SW2 からフロア SW2 への縦の線は、原図どおり、コア SW1 からフロア SW3 への斜めの線と交わる所で
 * 小さな半円で跨ぐ。VLAN200・VLAN300 の札は、原図どおり VLAN300 を斜めの線の上に重ね（白の縁取りで線を隠す）、VLAN200 は縦の線の脇に置いた。
 * 注記1〜4 は記号を持たないので examFigures の note に置き、略語の説明だけを図の下に描く。
 *
 * 色は役割だけで決めている。コア SW・サーバ SW・フロア SW・SW は device、ファイルサーバ・監視サーバ・PC は host。
 *
 * 解説を開いたときは、VRRP の組のコア SW1・コア SW2 と、SNMP マネージャになる監視サーバに輪を付け（設問2(1)・設問4(1)）、
 * 3つの VLAN を運ぶ p4 のトランクをなぞる（設問2(3)）。
 */

type Rect = { x: number; y: number; w: number; h: number }
type Pt = [number, number]

const SIZE = 7.5
const SMALL = 7
const TEXT = '#334155'

/** サーバルーム */
const SR: Rect = { x: 36, y: 4, w: 236, h: 158 }
const SSW: Rect = { x: 150, y: 14, w: 48, h: 18 }
const FS: Rect = { x: 226, y: 8, w: 38, h: 30 }
const MON: Rect = { x: 212, y: 50, w: 52, h: 18 }
const C1: Rect = { x: 52, y: 84, w: 44, h: 18 }
const C2: Rect = { x: 120, y: 84, w: 44, h: 18 }
/** コア SW どうしの p4（トランク）の高さ */
const P4_Y = 93
/** サーバ SW からコア SW への p1 の線（VLAN100） */
const C1_P1: Pt[] = [
  [160, 32],
  [88, 84],
]
const C2_P1: Pt[] = [
  [174, 32],
  [152, 84],
]
/** コア SW からフロア SW への p2 の縦の線（VLAN200）の x と、p3 の斜めの線（VLAN300） */
const C1_P2_X = 60
const C2_P2_X = 132
const C1_P3: Pt[] = [
  [88, 102],
  [204, 190],
]
const C2_P3: Pt[] = [
  [156, 102],
  [272, 190],
]
/** コア SW2 の p2 の縦の線が、コア SW1 の p3 の斜めの線を跨ぐ高さ（原図の半円） */
const HOP_Y = C1_P3[0][1] + ((C2_P2_X - C1_P3[0][0]) * (C1_P3[1][1] - C1_P3[0][1])) / (C1_P3[1][0] - C1_P3[0][0])
const HOP_R = 3

/** フロアラックとフロア SW */
const FR1: Rect = { x: 4, y: 172, w: 154, h: 40 }
const FR2: Rect = { x: 166, y: 172, w: 170, h: 40 }
const FSW: Rect[] = [
  { x: 26, y: 190, w: 52, h: 18 },
  { x: 100, y: 190, w: 52, h: 18 },
  { x: 180, y: 190, w: 52, h: 18 },
  { x: 262, y: 190, w: 52, h: 18 },
]
const FSW_Y = 199
/** SW の段（各フロア SW の下に2台。あいだに「⋯」） */
const SW_Y = 226
const SW: { x: number; w: number; name: string }[] = [
  { x: 5, w: 30, name: 'SW1' },
  { x: 47, w: 30, name: 'SW8' },
  { x: 81, w: 30, name: 'SW9' },
  { x: 123, w: 36, name: 'SW16' },
  { x: 163, w: 36, name: 'SW17' },
  { x: 211, w: 36, name: 'SW24' },
  { x: 251, w: 36, name: 'SW25' },
  { x: 299, w: 36, name: 'SW32' },
]
/** フロア SW から SW への線（左は斜め、右は縦。原図どおり） */
const FSW_TO_SW: Pt[][] = [
  [[36, 208], [20, SW_Y]],
  [[62, 208], [62, SW_Y]],
  [[106, 208], [96, SW_Y]],
  [[141, 208], [141, SW_Y]],
  [[186, 208], [181, SW_Y]],
  [[226, 208], [229, SW_Y]],
  [[269, 208], [269, SW_Y]],
  [[308, 208], [317, SW_Y]],
]
/** PC の段（SW1・SW9・SW17・SW25 の下に2台。組は左の SW の左の端にそろえる） */
const PC_Y = 262
const PC_X = [5, 41, 81, 117, 163, 199, 251, 287]
const PC_W = 22
const SW_TO_PC: Pt[][] = [
  [[16, 244], [16, PC_Y]],
  [[26, 244], [52, PC_Y]],
  [[92, 244], [92, PC_Y]],
  [[102, 244], [128, PC_Y]],
  [[176, 244], [174, PC_Y]],
  [[186, 244], [210, PC_Y]],
  [[264, 244], [262, PC_Y]],
  [[274, 244], [298, PC_Y]],
]

const mid = (r: Rect) => r.x + r.w / 2

/** 名前を枠の内側の左上か右上に置く囲み（名前は枠と同じ `<g>` に入れ、§5.4 の検査2 で余白を測れるようにする） */
function Frame({ rect, label, at }: { rect: Rect; label: string; at: 'tl' | 'tr' }) {
  const { x, y, w, h } = rect
  const fs = SIZE * FONT_SCALE
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill="none" stroke={FRAME} strokeWidth={1.3} />
      <text x={at === 'tl' ? x + 4 : x + w - 4} y={y + 3.5 + fs} textAnchor={at === 'tl' ? 'start' : 'end'} fontSize={fs} fill={TEXT}>
        {label}
      </text>
    </g>
  )
}

/** ポート名・VLAN の札。onLine を付けると白の縁取りで下の線を隠す（原図の、線の上に重ねた札） */
function Tag({ x, y, text, anchor = 'start', onLine = false }: { x: number; y: number; text: string; anchor?: 'start' | 'middle' | 'end'; onLine?: boolean }) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      fontSize={SMALL * FONT_SCALE}
      fill={TEXT}
      stroke={onLine ? '#ffffff' : undefined}
      strokeWidth={onLine ? 3 : undefined}
      strokeLinejoin={onLine ? 'round' : undefined}
      paintOrder={onLine ? 'stroke' : undefined}
    >
      {text}
    </text>
  )
}

/** PC・SW の列の「⋯」 */
function Dots({ x, y }: { x: number; y: number }) {
  return <Cap x={x} y={y} text="⋯" anchor="middle" size={SMALL} color={TEXT} />
}

export default function H30G12Fig1({ highlight = false }: ExamFigureProps) {
  return (
    <FigSvg w={340} h={302} title="図1 A 社 LAN の構成（抜粋）">
      {/* ── 囲み ───────────────────────────────────── */}
      <Frame rect={SR} label="サーバルーム" at="tl" />
      <Frame rect={FR1} label="フロアラック1" at="tl" />
      <Frame rect={FR2} label="フロアラック2" at="tr" />

      {/* ── 線 ─────────────────────────────────────── */}
      {/* サーバルームの中 */}
      <Wire x1={SSW.x + SSW.w} y1={23} x2={FS.x} y2={23} />
      <Wire x1={192} y1={SSW.y + SSW.h} x2={228} y2={MON.y} />
      <Wire x1={C1_P1[0][0]} y1={C1_P1[0][1]} x2={C1_P1[1][0]} y2={C1_P1[1][1]} />
      <Wire x1={C2_P1[0][0]} y1={C2_P1[0][1]} x2={C2_P1[1][0]} y2={C2_P1[1][1]} />
      <Wire x1={C1.x + C1.w} y1={P4_Y} x2={C2.x} y2={P4_Y} />
      {/* コア SW からフロア SW へ（p2 は縦、p3 は斜め。コア SW2 の p2 は半円で跨ぐ） */}
      <Wire x1={C1_P2_X} y1={C1.y + C1.h} x2={C1_P2_X} y2={FSW[0].y} />
      <Wire x1={C2_P2_X} y1={C2.y + C2.h} x2={C2_P2_X} y2={HOP_Y - HOP_R} />
      <path
        d={`M${C2_P2_X},${HOP_Y - HOP_R} A${HOP_R},${HOP_R} 0 0 0 ${C2_P2_X},${HOP_Y + HOP_R}`}
        fill="none"
        stroke={LINE}
        strokeWidth={1.2}
      />
      <Wire x1={C2_P2_X} y1={HOP_Y + HOP_R} x2={C2_P2_X} y2={FSW[1].y} />
      <Wire x1={C1_P3[0][0]} y1={C1_P3[0][1]} x2={C1_P3[1][0]} y2={C1_P3[1][1]} />
      <Wire x1={C2_P3[0][0]} y1={C2_P3[0][1]} x2={C2_P3[1][0]} y2={C2_P3[1][1]} />
      {/* フロアラックの中と、その下 */}
      <Wire x1={FSW[0].x + FSW[0].w} y1={FSW_Y} x2={FSW[1].x} y2={FSW_Y} />
      <Wire x1={FSW[2].x + FSW[2].w} y1={FSW_Y} x2={FSW[3].x} y2={FSW_Y} />
      {[...FSW_TO_SW, ...SW_TO_PC].map(([a, b], i) => (
        <Wire key={i} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} />
      ))}

      {/* ── 強調：VRRP の組と監視サーバの輪、p4 のトランク ─────── */}
      {highlight && (
        <g>
          <Ring {...C1} pad={2.5} />
          <Ring {...C2} pad={2.5} />
          <Ring {...MON} />
          <Route
            points={[
              [mid(C1), P4_Y],
              [C1.x + C1.w, P4_Y],
              [C2.x, P4_Y],
              [mid(C2), P4_Y],
            ]}
          />
        </g>
      )}

      {/* ── ノード ───────────────────────────────────── */}
      <Box {...SSW} tone="device" lines={['サーバSW']} size={SIZE} />
      <Box {...FS} tone="host" lines={['ファイル', 'サーバ']} size={SIZE} />
      <Box {...MON} tone="host" lines={['監視サーバ']} size={SIZE} />
      <Box {...C1} tone="device" lines={['コアSW1']} size={SIZE} />
      <Box {...C2} tone="device" lines={['コアSW2']} size={SIZE} />
      {FSW.map((r, i) => (
        <Box key={r.x} {...r} tone="device" lines={[`フロアSW${i + 1}`]} size={SIZE} />
      ))}
      {SW.map((s) => (
        <Box key={s.x} x={s.x} y={SW_Y} w={s.w} h={18} tone="device" lines={[s.name]} size={SIZE} />
      ))}
      {[41, 117, 205, 293].map((x) => (
        <Dots key={x} x={x} y={SW_Y + 12} />
      ))}
      {PC_X.map((x) => (
        <Box key={x} x={x} y={PC_Y} w={PC_W} h={18} tone="host" lines={['PC']} size={SIZE} />
      ))}
      {[34, 110, 192, 280].map((x) => (
        <Dots key={x} x={x} y={PC_Y + 12} />
      ))}

      {/* ── 札（ポート名と VLAN） ───────────────────────── */}
      <Tag x={84.5} y={78.5} text="p1" anchor="end" />
      <Tag x={70} y={64} text="VLAN100" />
      <Tag x={142.5} y={78.5} text="p1" anchor="end" />
      <Tag x={168} y={64} text="VLAN100" />
      <Tag x={100} y={87.5} text="p4" />
      <Tag x={116.5} y={104} text="p4" anchor="end" />
      <Tag x={57} y={114} text="p2" anchor="end" />
      <Tag x={64} y={114} text="p3" />
      <Tag x={63} y={132} text="VLAN200" />
      <Tag x={129} y={114} text="p2" anchor="end" />
      <Tag x={136} y={114} text="p3" />
      <Tag x={129} y={150} text="VLAN200" anchor="end" />
      <Tag x={153.9} y={155.2} text="VLAN300" anchor="middle" onLine />
      <Tag x={182.4} y={125.2} text="VLAN300" anchor="middle" onLine />

      {/* ── 略語の説明（注記1〜4 は図の下の注記） ─────────────── */}
      <Cap x={6} y={296} text="SW：スイッチ" size={SMALL} color={MUTED} />
    </FigSvg>
  )
}
