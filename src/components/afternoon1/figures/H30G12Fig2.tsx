import { Box, Cap, FigSvg, Ring, Route, Wire } from './primitives'
import { FONT_SCALE, FRAME } from './tokens'
import type { ExamFigureProps } from './tokens'

/**
 * 図2 ケーブルの断線による障害発生時の構成（抜粋）— H30 午後Ⅰ 問2
 *
 * 原図どおり、上にサーバルーム（コア SW1・コア SW2）、その下にフロアラック1（フロア SW1・フロア SW2）、さらに下に SW4 と PC を縦に並べる。
 * 原図は縦長なので組み直していない。断線したケーブル1・ケーブル2 は、原図どおり破線で描く。注記（破線は断線したケーブル）は
 * 見本の記号を持たないので examFigures の note に置く。
 *
 * 色は役割だけで決めている。コア SW・フロア SW・SW4 は device、PC は host。
 *
 * 解説を開いたときは、BPDU を受けなくなる（ポートの状態が変わる）フロア SW2 に輪を付け（設問3(1)）、
 * STP の作り直しが済んだあとにフロア SW1 からの通信が通る道（フロア SW2 → コア SW2）をなぞる（設問3(2)）。
 */

type Rect = { x: number; y: number; w: number; h: number }

const SIZE = 7.5
const SMALL = 7
const TEXT = '#334155'
/** 断線したケーブル（原図の破線） */
const BROKEN_DASH = '4 3'

/** サーバルーム */
const SR: Rect = { x: 70, y: 4, w: 200, h: 50 }
const C1: Rect = { x: 124, y: 18, w: 44, h: 18 }
const C2: Rect = { x: 206, y: 18, w: 44, h: 18 }
const P4_Y = 27
/** フロアラック1 */
const FR: Rect = { x: 70, y: 78, w: 200, h: 56 }
const FSW1: Rect = { x: 120, y: 100, w: 52, h: 18 }
const FSW2: Rect = { x: 206, y: 100, w: 52, h: 18 }
const FP2_Y = 109
/** ケーブル1・ケーブル2 の縦の線の x（コア SW1 の p2 → フロア SW1 の p1、フロア SW1 の p3 → SW4）と、コア SW2 の p2 → フロア SW2 の p1 の x */
const LEFT_X = 146
const RIGHT_X = 240
/** SW4 と PC */
const SW4: Rect = { x: 128, y: 154, w: 36, h: 18 }
const PC1: Rect = { x: 117, y: 190, w: 22, h: 18 }
const PC2: Rect = { x: 153, y: 190, w: 22, h: 18 }

/** 名前を枠の内側の左上に置く囲み（名前は枠と同じ `<g>` に入れ、§5.4 の検査2 で余白を測れるようにする） */
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

/** ポート名・ケーブル名の札 */
function Tag({ x, y, text, anchor = 'start' }: { x: number; y: number; text: string; anchor?: 'start' | 'end' }) {
  return <Cap x={x} y={y} text={text} anchor={anchor} size={SMALL} color={TEXT} />
}

export default function H30G12Fig2({ highlight = false }: ExamFigureProps) {
  return (
    <FigSvg w={340} h={214} title="図2 ケーブルの断線による障害発生時の構成（抜粋）">
      {/* ── 囲み ───────────────────────────────────── */}
      <Frame rect={SR} label="サーバルーム" />
      <Frame rect={FR} label="フロアラック1" />

      {/* ── 線（ケーブル1・ケーブル2 は破線） ─────────────────── */}
      <Wire x1={C1.x + C1.w} y1={P4_Y} x2={C2.x} y2={P4_Y} />
      <Wire x1={LEFT_X} y1={C1.y + C1.h} x2={LEFT_X} y2={FSW1.y} dash={BROKEN_DASH} />
      <Wire x1={RIGHT_X} y1={C2.y + C2.h} x2={RIGHT_X} y2={FSW2.y} />
      <Wire x1={FSW1.x + FSW1.w} y1={FP2_Y} x2={FSW2.x} y2={FP2_Y} />
      <Wire x1={LEFT_X} y1={FSW1.y + FSW1.h} x2={LEFT_X} y2={SW4.y} dash={BROKEN_DASH} />
      <Wire x1={140} y1={SW4.y + SW4.h} x2={PC1.x + PC1.w / 2} y2={PC1.y} />
      <Wire x1={152} y1={SW4.y + SW4.h} x2={PC2.x + PC2.w / 2} y2={PC2.y} />

      {/* ── 強調：フロア SW2 の輪と、作り直し後の道（フロア SW1 → フロア SW2 → コア SW2） ── */}
      {highlight && (
        <g>
          <Ring {...FSW2} />
          <Route
            points={[
              [LEFT_X, FP2_Y],
              [FSW1.x + FSW1.w, FP2_Y],
              [FSW2.x, FP2_Y],
              [RIGHT_X, FP2_Y],
              [RIGHT_X, FSW2.y],
              [RIGHT_X, C2.y + C2.h],
              [RIGHT_X, P4_Y],
            ]}
          />
        </g>
      )}

      {/* ── ノード ───────────────────────────────────── */}
      <Box {...C1} tone="device" lines={['コアSW1']} size={SIZE} />
      <Box {...C2} tone="device" lines={['コアSW2']} size={SIZE} />
      <Box {...FSW1} tone="device" lines={['フロアSW1']} size={SIZE} />
      <Box {...FSW2} tone="device" lines={['フロアSW2']} size={SIZE} />
      <Box {...SW4} tone="device" lines={['SW4']} size={SIZE} />
      <Box {...PC1} tone="host" lines={['PC']} size={SIZE} />
      <Box {...PC2} tone="host" lines={['PC']} size={SIZE} />
      <Cap x={146} y={202} text="⋯" anchor="middle" size={SMALL} color={TEXT} />

      {/* ── 札（ポート名とケーブル名） ─────────────────────── */}
      <Tag x={170} y={22} text="p4" />
      <Tag x={203} y={38} text="p4" anchor="end" />
      <Tag x={149} y={47} text="p2" />
      <Tag x={243} y={47} text="p2" />
      <Tag x={143} y={70} text="ケーブル1" anchor="end" />
      <Tag x={149} y={95} text="p1" />
      <Tag x={243} y={95} text="p1" />
      <Tag x={174} y={104} text="p2" />
      <Tag x={203} y={120.5} text="p2" anchor="end" />
      <Tag x={149} y={129} text="p3" />
      <Tag x={143} y={148} text="ケーブル2" anchor="end" />
    </FigSvg>
  )
}
