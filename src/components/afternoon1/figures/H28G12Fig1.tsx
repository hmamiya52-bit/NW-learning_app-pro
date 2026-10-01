import { ArrowDefs, Box, Callout, Cap, FigSvg, Poly, Ring, Route, SolidFrame, Wire } from './primitives'
import { FONT_SCALE, FRAME, LOGICAL, MUTED, TONE, useFigureId } from './tokens'
import type { ExamFigureProps } from './tokens'

/**
 * 図1 モバイルネットワーク構成案 — H28 午後Ⅰ 問2
 *
 * 原図は 顧客宅 → インターネット → E 社データセンタ を横一列に並べる（横に長く、375px では文字が読めない）。
 * 上の段に顧客宅とインターネット、下の段に E 社データセンタを置き、データセンタの中は
 * インターネットの真下のルータから左へ向かって ルータ → SW1 → VPN サーバ → SW2 → 販売管理サーバ と並べた。
 * つながり（SW1 と SW2 のあいだを VPN サーバと FW が並行してつなぐ、SW2 から3台のサーバへ）と、
 * (A)〜(E) の両矢印が指す範囲は原図どおり。無線 LAN と LTE 回線は原図と同じく稲妻の線で描く。
 * (C) はインターネットとデータセンタのあいだの縦の両矢印にした。
 *
 * 色は役割だけで決めている。モバイル Wi-Fi ルータ・ルータ・SW・FW・VPN サーバ（VPN の終端。
 * H25-G1-1 の SSL-VPN 装置と同じ扱い）は device、タブレット端末と各サーバは host、インターネットは outside。
 * セグメントの範囲を示す両矢印は、物理の線ではないので LOGICAL。
 *
 * インターネットの楕円は、中の外部 DNS サーバに輪を付けられるよう、囲みと同じく先に描く
 * （輪より後に描くと、楕円の塗りが輪を隠す）。
 *
 * 解説を開いたときは、重なってはいけない (A) と (E) の両矢印を赤でなぞり（設問2(3)）、
 * タブレット端末から VPN を通ってプロキシサーバと内部 DNS サーバへ向かう道筋をなぞり（設問3(2)）、
 * 外部 DNS サーバ・プロキシサーバ・内部 DNS サーバに輪を付ける。
 */

/** 箱の文字の大きさ（Box の size） */
const SIZE = 7.5
/** セグメントの記号の文字色 */
const TEXT = '#334155'

/** 稲妻の線（原図の無線 LAN・LTE 回線） */
function bolt(x1: number, x2: number, y: number): [number, number][] {
  const m = (x1 + x2) / 2
  return [
    [x1, y],
    [m - 6, y],
    [m - 2, y - 4],
    [m + 2, y + 4],
    [m + 6, y],
    [x2, y],
  ]
}

const WLAN = bolt(66, 116, 47)
const LTE = bolt(170, 226, 47)

/** セグメントの範囲を示す両矢印 */
function Span({ points, arrow }: { points: [number, number][]; arrow: string }) {
  return <Poly points={points} color={LOGICAL} width={1} markerStart={arrow} markerEnd={arrow} />
}

/** インターネット（楕円の上寄りに名前。中の外部 DNS サーバは後から重ねる） */
function Internet() {
  const t = TONE.outside
  return (
    <g>
      <ellipse cx={280} cy={46} rx={54} ry={40} fill={t.fill} stroke={t.stroke} strokeWidth={1.2} />
      <text x={280} y={33} textAnchor="middle" fontSize={SIZE * FONT_SCALE} fontWeight={700} fill={t.text}>
        インターネット
      </text>
    </g>
  )
}

/** タブレット端末 → 無線 LAN → Wi-Fi ルータ → LTE → インターネット → ルータ → SW1 → VPN サーバ → SW2 */
const TO_SW2: [number, number][] = [
  [39, 47],
  ...WLAN,
  [143, 47],
  ...LTE,
  // 楕円の左下の縁に沿って下りる（外部 DNS サーバの輪に触れないように）
  [236, 68],
  [250, 78],
  [280, 86],
  [280, 140],
  [280, 149],
  [262, 149],
  [244, 149],
  [212, 149],
  [192, 149],
  [152, 149],
  [124, 149],
  [108, 149],
]
/** SW2 → プロキシサーバ */
const TO_PROXY: [number, number][] = [...TO_SW2, [96, 158], [62, 187], [37, 187]]
/** SW2 → 内部 DNS サーバ */
const TO_DNS: [number, number][] = [
  [108, 149],
  [100, 158],
  [62, 225],
  [37, 225],
]

export default function H28G12Fig1({ highlight = false }: ExamFigureProps) {
  const fid = useFigureId('h28g12f1')
  const arrow = `url(#${fid}-arrow-0)`
  return (
    <FigSvg w={340} h={280} title="図1 モバイルネットワーク構成案">
      <ArrowDefs figureId={fid} colors={[LOGICAL]} />

      {/* ── 囲み（インターネットの楕円も先に描く）──────────── */}
      <SolidFrame x={4} y={4} w={174} h={82} />
      <SolidFrame x={4} y={112} w={332} h={136} />
      <Internet />

      {/* ── 線 ─────────────────────────────────────── */}
      <Poly points={WLAN} />
      <Poly points={LTE} />
      <Wire x1={280} y1={86} x2={280} y2={140} />
      {/* E 社データセンタ（右から左へ） */}
      <Wire x1={262} y1={149} x2={244} y2={149} />
      <Wire x1={212} y1={149} x2={192} y2={149} />
      <Wire x1={152} y1={149} x2={124} y2={149} />
      <Wire x1={92} y1={149} x2={62} y2={149} />
      <Wire x1={216} y1={158} x2={188} y2={184} />
      <Wire x1={156} y1={184} x2={120} y2={158} />
      <Wire x1={96} y1={158} x2={62} y2={187} />
      <Wire x1={100} y1={158} x2={62} y2={225} />

      {/* ── セグメント (A)〜(E) の範囲 ───────────────────── */}
      <Span
        arrow={arrow}
        points={[
          [70, 24],
          [112, 24],
        ]}
      />
      <Span
        arrow={arrow}
        points={[
          [180, 24],
          [224, 24],
        ]}
      />
      <Span
        arrow={arrow}
        points={[
          [296, 88],
          [296, 110],
        ]}
      />
      <Span
        arrow={arrow}
        points={[
          [194, 131],
          [260, 131],
        ]}
      />
      <Span
        arrow={arrow}
        points={[
          [64, 131],
          [150, 131],
        ]}
      />

      {/* ── 強調：輪、(A)・(E) の範囲、VPN を通る道筋（ノードより先）── */}
      {highlight && (
        <g>
          <Ring x={254} y={42} w={52} h={30} />
          <Ring x={12} y={172} w={50} h={30} />
          <Ring x={12} y={210} w={50} h={30} />
          <Route
            points={[
              [78, 24],
              [104, 24],
            ]}
          />
          <Route
            points={[
              [72, 131],
              [142, 131],
            ]}
          />
          <Route points={TO_PROXY} />
          <Route points={TO_DNS} />
        </g>
      )}

      {/* ── ノード ───────────────────────────────────── */}
      {/* 顧客宅 */}
      <Box x={12} y={32} w={54} h={30} tone="host" lines={['タブレット', '端末']} size={SIZE} />
      <Box x={116} y={26} w={54} h={42} tone="device" lines={['モバイル', 'Wi-Fi', 'ルータ']} size={SIZE} />
      <Cap x={91} y={62} text="無線" anchor="middle" size={SIZE} color={MUTED} />
      <Cap x={91} y={75.5} text="LAN" anchor="middle" size={SIZE} color={MUTED} />
      <Cap x={9} y={81} text="顧客宅" size={8.5} color={FRAME} bold />

      {/* インターネット */}
      <Cap x={200} y={62} text="LTE" anchor="middle" size={SIZE} color={MUTED} />
      <Cap x={200} y={75.5} text="回線" anchor="middle" size={SIZE} color={MUTED} />
      <Box x={254} y={42} w={52} h={30} tone="host" lines={['外部 DNS', 'サーバ']} size={SIZE} />

      {/* E 社データセンタ */}
      <Box x={262} y={140} w={36} h={18} tone="device" lines={['ルータ']} size={SIZE} />
      <Box x={212} y={140} w={32} h={18} tone="device" lines={['SW1']} size={SIZE} />
      <Box x={152} y={134} w={40} h={30} tone="device" lines={['VPN', 'サーバ']} size={SIZE} />
      <Box x={156} y={175} w={32} h={18} tone="device" lines={['FW']} size={SIZE} />
      <Box x={92} y={140} w={32} h={18} tone="device" lines={['SW2']} size={SIZE} />
      <Box x={12} y={134} w={50} h={30} tone="host" lines={['販売管理', 'サーバ']} size={SIZE} />
      <Box x={12} y={172} w={50} h={30} tone="host" lines={['プロキシ', 'サーバ']} size={SIZE} />
      <Box x={12} y={210} w={50} h={30} tone="host" lines={['内部 DNS', 'サーバ']} size={SIZE} />
      <Cap x={330} y={244} text="E社データセンタ" anchor="end" size={8.5} color={FRAME} bold />

      {/* セグメントの記号 */}
      <Cap x={91} y={17} text="(A)" anchor="middle" size={SIZE} color={TEXT} bold />
      <Cap x={202} y={17} text="(B)" anchor="middle" size={SIZE} color={TEXT} bold />
      <Cap x={302} y={103} text="(C)" size={SIZE} color={TEXT} bold />
      <Cap x={227} y={125} text="(D)" anchor="middle" size={SIZE} color={TEXT} bold />
      <Cap x={107} y={125} text="(E)" anchor="middle" size={SIZE} color={TEXT} bold />

      {/* ── 強調の文字 ─────────────────────────────────── */}
      {highlight && (
        <g>
          <Callout x={92} y={89} w={90} lines={['(A)・(E) は重ねない']} />
          <Callout
            x={72}
            y={213}
            w={128}
            lines={['VPN で通すのは2台への通信']}
            leader={[
              [72, 222.5],
              [62, 222.5],
            ]}
          />
        </g>
      )}

      {/* ── 凡例（原図は顧客宅の下）──────────────────────── */}
      <Cap x={6} y={262} text="SW1，SW2：スイッチングハブ" size={7} color={MUTED} />
      <Cap x={6} y={274} text="FW：ファイアウォール" size={7} color={MUTED} />
    </FigSvg>
  )
}
