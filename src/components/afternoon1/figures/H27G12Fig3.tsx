import { Box, Callout, Cap, DashFrame, Ell, FigSvg, Ring, Route, Wire } from './primitives'
import { MUTED, TONE } from './tokens'
import type { ExamFigureProps, ToneName } from './tokens'

/**
 * 図3 新 NW 構成案（抜粋）— H27 午後Ⅰ 問2
 *
 * 機器の並び（上に LB3・ルータ・インターネット・E 社、その下に FW 3台、左下に社内 NW、右下に DMZ）、
 * FW 3台と LB4・LB5 を結ぶ6本の線、重ね書きの枚数（Proxy・Web サーバは2枚）は原図どおり。
 * 原図と同じく、左の FW は LB4 の真上、右の FW は LB5 の真上に置いた。
 *
 * 色は役割だけで決めている。LB・FW・ルータ・L3SW は device、Proxy・Web サーバ・PC は host、
 * インターネットと E 社は outside。
 *
 * 解説を開いたときは、LB3・LB4・LB5 に輪を付け、社内の PC の通信が LB4 を Proxy 側と FW 側で
 * 2回通る道筋を赤でなぞり、表2 の あ・い の数え方を吹き出しで示す（設問3(2)）。
 */

/** 箱の文字の大きさ（Box の size） */
const SIZE = 7.5
/** 重ね書きの1枚ごとのずらし幅 */
const STEP = 3

/** 重ね書きの箱（原図どおり、後ろの1枚を右下にずらして複数台を表す） */
function Stack({ x, y, w, h, tone, lines }: { x: number; y: number; w: number; h: number; tone: ToneName; lines: string[] }) {
  const t = TONE[tone]
  return (
    <g>
      <rect x={x + STEP} y={y + STEP} width={w} height={h} rx={2} fill={t.fill} stroke={t.stroke} strokeWidth={1.2} />
      <Box x={x} y={y} w={w} h={h} tone={tone} lines={lines} size={SIZE} />
    </g>
  )
}

/** PC → L3SW → LB4 → Proxy（Proxy 側で LB4 を通る） */
const TO_PROXY: [number, number][] = [
  [56, 178],
  [70, 156],
  [78, 147],
  [78, 138],
  [78, 114],
  [68, 108],
  [62, 114],
  [50, 118],
  [30, 127],
]
/** LB4 → FW → LB3 → ルータ → インターネット（FW 側で LB4 を通る） */
const TO_NET: [number, number][] = [
  [78, 105],
  [78, 96],
  [78, 62],
  [78, 53],
  [84, 44],
  [140, 26],
  [148, 17],
  [166, 17],
  [178, 17],
  [198, 17],
  [218, 17],
  [224, 17],
  [250, 17],
]

export default function H27G12Fig3({ highlight = false }: ExamFigureProps) {
  return (
    <FigSvg w={340} h={208} title="図3 新 NW 構成案（抜粋）">
      {/* ── 囲み ───────────────────────────────────── */}
      <DashFrame x={4} y={78} w={178} h={126} label="社内 NW" />
      <DashFrame x={188} y={78} w={148} h={62} label="DMZ" labelAnchor="end" />

      {/* ── 線 ─────────────────────────────────────── */}
      <Wire x1={166} y1={17} x2={178} y2={17} />
      <Wire x1={218} y1={17} x2={224} y2={17} />
      <Wire x1={298} y1={23} x2={308} y2={40} />
      <Wire x1={140} y1={26} x2={84} y2={44} />
      <Wire x1={148} y1={26} x2={148} y2={44} />
      <Wire x1={156} y1={26} x2={212} y2={44} />
      {/* FW 3台から LB4・LB5 へ */}
      <Wire x1={78} y1={62} x2={78} y2={96} />
      <Wire x1={88} y1={62} x2={202} y2={96} />
      <Wire x1={142} y1={62} x2={88} y2={96} />
      <Wire x1={154} y1={62} x2={210} y2={96} />
      <Wire x1={208} y1={62} x2={94} y2={96} />
      <Wire x1={218} y1={62} x2={218} y2={96} />
      {/* 社内 NW */}
      <Wire x1={50} y1={118} x2={62} y2={114} />
      <Wire x1={78} y1={114} x2={78} y2={138} />
      <Wire x1={70} y1={156} x2={56} y2={178} />
      <Wire x1={86} y1={156} x2={108} y2={178} />
      {/* DMZ */}
      <Wire x1={238} y1={105} x2={252} y2={105} />

      {/* ── 強調：輪と、LB4 を2回通る道筋（ノードより先）── */}
      {highlight && (
        <g>
          <Ring x={130} y={8} w={36} h={18} />
          <Ring x={58} y={96} w={40} h={18} />
          <Ring x={198} y={96} w={40} h={18} />
          <Route points={TO_PROXY} />
          <Route points={TO_NET} />
        </g>
      )}

      {/* ── ノード ───────────────────────────────────── */}
      <Box x={130} y={8} w={36} h={18} tone="device" lines={['LB3']} size={SIZE} />
      <Box x={178} y={8} w={40} h={18} tone="device" lines={['ルータ']} size={SIZE} />
      <Ell cx={270} cy={17} rx={46} ry={11} tone="outside" lines={['インターネット']} size={SIZE} />
      <Box x={292} y={40} w={40} h={18} tone="outside" lines={['E社']} size={SIZE} />
      <Box x={62} y={44} w={32} h={18} tone="device" lines={['FW']} size={SIZE} />
      <Box x={132} y={44} w={32} h={18} tone="device" lines={['FW']} size={SIZE} />
      <Box x={202} y={44} w={32} h={18} tone="device" lines={['FW']} size={SIZE} />

      {/* 社内 NW */}
      <Box x={58} y={96} w={40} h={18} tone="device" lines={['LB4']} size={SIZE} />
      <Stack x={8} y={118} w={44} h={18} tone="host" lines={['Proxy']} />
      <Box x={58} y={138} w={40} h={18} tone="device" lines={['L3SW']} size={SIZE} />
      <Box x={38} y={178} w={32} h={18} tone="host" lines={['PC']} size={SIZE} />
      <Cap x={82} y={190} text="…" anchor="middle" color={MUTED} />
      <Box x={94} y={178} w={32} h={18} tone="host" lines={['PC']} size={SIZE} />

      {/* DMZ */}
      <Box x={198} y={96} w={40} h={18} tone="device" lines={['LB5']} size={SIZE} />
      <Stack x={252} y={100} w={52} h={30} tone="host" lines={['Web', 'サーバ']} />

      {/* ── 強調の文字 ─────────────────────────────────── */}
      {highlight && (
        <g>
          <Callout
            x={10}
            y={4}
            w={100}
            lines={['LB3 はインターネット側', '89 + 10 = 99']}
            leader={[
              [110, 17],
              [126.5, 17],
            ]}
          />
          <Callout
            x={112}
            y={120}
            w={66}
            lines={['FW 側 90', 'Proxy 側 90']}
            leader={[
              [112, 130],
              [101.5, 110],
            ]}
          />
        </g>
      )}
    </FigSvg>
  )
}
