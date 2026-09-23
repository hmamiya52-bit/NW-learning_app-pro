import { Box, Callout, Cap, DashFrame, FigSvg, Ring, Route, SolidFrame, Wire } from './primitives'
import { MUTED, SEGMENT } from './tokens'
import type { ExamFigureProps } from './tokens'

/**
 * 図1 NW 基盤の構成案 — H25 午後Ⅰ 問3
 *
 * 原図と同じく 2階・3階・4階を横に並べ、NW 基盤の実線の大枠がスイッチの段だけを
 * 横切る形にした。375px に収めるため箱を詰めたが、ノード・リンク・本数・つなぎ方
 * （L3SW の左は各階の左の L2SW、右は右の L2SW）・凡例は原図どおり。
 *
 * 各階の下の破線の箱は、同じ階の L2SW 2台に1本ずつつながる（真下の1本と、X 字の斜めの1本）。
 * 設問3(2)の「2本のケーブルを別々の筐体に接続する」はこの X 字の線のこと。
 *
 * 色は役割だけで決めている。FW・L3SW・L2SW は C 社の NW 基盤の装置なので device。
 * 下段の箱は端末・サーバ・顧客システム（通信の当事者）なので host。原図が破線の箱なので、
 * 1台の装置ではなくまとまりを表す破線の枠にしている。
 *
 * 解説を開いたときは、スタック（2台1組）とリンクアグリゲーション（組どうしの2本）を
 * L3SW の組と4階の L2SW の組で例示し、FW が1組しかないこと（設問3(3)）と、
 * 顧客システム1 の2本（設問3(2)）を示す。
 */

/** 各階の L2SW の組と、その下の2つの箱をつなぐ線（真下・X 字・X 字・真下） */
const DROPS: [number, number, number, number][] = [
  // 2階
  [30, 144, 30, 164],
  [42, 144, 74, 164],
  [74, 144, 40, 164],
  [86, 144, 86, 164],
  // 3階
  [140, 144, 140, 164],
  [156, 144, 184, 164],
  [184, 144, 150, 164],
  [200, 144, 200, 164],
  // 4階
  [254, 144, 254, 164],
  [266, 144, 298, 164],
  [298, 144, 264, 164],
  [310, 144, 310, 164],
]

/** L3SW の組から各階の L2SW へ。左の L3SW は左の L2SW、右は右へ */
const UPLINKS: [number, number, number, number][] = [
  [130, 100, 30, 128],
  [182, 100, 86, 128],
  [144, 100, 144, 128],
  [196, 100, 196, 128],
  [158, 100, 254, 128],
  [210, 100, 310, 128],
]

export default function H25G13Fig1({ highlight = false }: ExamFigureProps) {
  return (
    <FigSvg w={340} h={232} title="図1 NW 基盤の構成案">
      {/* ── 囲み ───────────────────────────────────── */}
      <SolidFrame x={2} y={2} w={336} h={150} label="NW基盤" />
      {/* 階の枠。「2階（運用監視エリア）」は既定の枠ラベルの大きさだと枠の幅いっぱいになるので、
          3つとも一段小さい文字で枠の内側に置く */}
      <DashFrame x={4} y={22} w={108} h={188} color={SEGMENT} />
      <DashFrame x={116} y={22} w={108} h={188} color={SEGMENT} />
      <DashFrame x={228} y={22} w={108} h={188} color={SEGMENT} />
      <Cap x={9} y={35} text="2階（運用監視エリア）" size={7.5} color={SEGMENT} bold />
      <Cap x={121} y={35} text="3階" size={7.5} color={SEGMENT} bold />
      <Cap x={233} y={35} text="4階" size={7.5} color={SEGMENT} bold />

      {/* ── 強調：2台1組を囲む輪（組を結ぶ横線を隠さないよう、線より先に敷く）── */}
      {highlight && (
        <g>
          <Ring x={124} y={42} w={92} h={28} />
          <Ring x={124} y={84} w={92} h={16} />
          <Ring x={234} y={128} w={96} h={16} />
        </g>
      )}

      {/* ── 線 ─────────────────────────────────────── */}
      {/* FW → L3SW、L3SW どうし */}
      <Wire x1={144} y1={70} x2={144} y2={84} />
      <Wire x1={196} y1={70} x2={196} y2={84} />
      <Wire x1={164} y1={92} x2={176} y2={92} />
      {/* L3SW → 各階の L2SW */}
      {UPLINKS.map(([x1, y1, x2, y2], i) => (
        <Wire key={`u${i}`} x1={x1} y1={y1} x2={x2} y2={y2} />
      ))}
      {/* 各階の L2SW どうし */}
      <Wire x1={50} y1={136} x2={66} y2={136} />
      <Wire x1={164} y1={136} x2={176} y2={136} />
      <Wire x1={274} y1={136} x2={290} y2={136} />
      {/* L2SW → 下の箱 */}
      {DROPS.map(([x1, y1, x2, y2], i) => (
        <Wire key={`d${i}`} x1={x1} y1={y1} x2={x2} y2={y2} />
      ))}

      {/* ── 強調：組どうしの2本（LAG）と、顧客システム1 の2本（設問3(2)）── */}
      {highlight && (
        <g>
          <Route
            points={[
              [158, 100],
              [254, 128],
            ]}
          />
          <Route
            points={[
              [210, 100],
              [310, 128],
            ]}
          />
          <Route
            points={[
              [254, 144],
              [254, 164],
            ]}
          />
          <Route
            points={[
              [298, 144],
              [264, 164],
            ]}
          />
        </g>
      )}

      {/* ── ノード ───────────────────────────────────── */}
      {/* 3階：FW と L3SW */}
      <Box x={124} y={42} w={40} h={28} tone="device" lines={['FW', '稼働系']} size={7} />
      <Box x={176} y={42} w={40} h={28} tone="device" lines={['FW', '待機系']} size={7} />
      <Box x={124} y={84} w={40} h={16} tone="device" lines={['L3SW']} size={7} />
      <Box x={176} y={84} w={40} h={16} tone="device" lines={['L3SW']} size={7} />

      {/* 各階の L2SW */}
      <Box x={10} y={128} w={40} h={16} tone="device" lines={['L2SW']} size={7} />
      <Box x={66} y={128} w={40} h={16} tone="device" lines={['L2SW']} size={7} />
      <Box x={124} y={128} w={40} h={16} tone="device" lines={['L2SW']} size={7} />
      <Box x={176} y={128} w={40} h={16} tone="device" lines={['L2SW']} size={7} />
      <Box x={234} y={128} w={40} h={16} tone="device" lines={['L2SW']} size={7} />
      <Box x={290} y={128} w={40} h={16} tone="device" lines={['L2SW']} size={7} />

      {/* 下段の箱（端末・サーバ・顧客システムのまとまり） */}
      <Box
        x={7}
        y={164}
        w={44}
        h={40}
        tone="host"
        lines={['監視端末', '運用端末', '群']}
        size={7}
        dash="3 2"
      />
      <Box
        x={56}
        y={164}
        w={52}
        h={40}
        tone="host"
        lines={['顧客', 'システムx¹⁾', '運用端末']}
        size={7}
        dash="3 2"
      />
      <Box x={120} y={164} w={36} h={40} tone="host" lines={['監視', 'サーバ']} size={7} dash="3 2" />
      <Box
        x={162}
        y={164}
        w={58}
        h={40}
        tone="host"
        lines={['大型', 'コンピュータ']}
        size={7}
        dash="3 2"
      />
      <Box x={231} y={164} w={44} h={40} tone="host" lines={['顧客', 'システム1']} size={7} dash="3 2" />
      <Cap x={282} y={187} text="…" anchor="middle" color={MUTED} />
      <Box x={289} y={164} w={44} h={40} tone="host" lines={['顧客', 'システムn']} size={7} dash="3 2" />

      {/* ── 強調の文字（2階・4階の上の空き場所に置く）── */}
      {highlight && (
        <g>
          <Callout
            x={16}
            y={47}
            w={86}
            lines={['FW はこの1組だけ']}
            leader={[
              [102, 56],
              [120.5, 56],
            ]}
          />
          <Callout
            x={240}
            y={44}
            w={84}
            lines={['スタックで1台', '2本は束ねて1本']}
            leader={[
              [282, 74.6],
              [282, 124.5],
            ]}
          />
        </g>
      )}

      {/* ── 凡例 ─────────────────────────────────────── */}
      <Cap x={4} y={224} text="L2SW：レイヤ2スイッチ" color={MUTED} />
      <Cap x={124} y={224} text="L3SW：レイヤ3スイッチ" color={MUTED} />
    </FigSvg>
  )
}
