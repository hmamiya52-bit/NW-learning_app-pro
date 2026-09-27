import { Box, Callout, Cap, DashFrame, Ell, FigSvg, Ring, Route, SolidFrame, Wire } from './primitives'
import { MUTED } from './tokens'
import type { ExamFigureProps } from './tokens'

/**
 * 図2 見直し後の営業支援システムのネットワーク構成案（抜粋）— H27 午後Ⅰ 問3
 *
 * 図1 と同じく、インターネットとモバイル端末を F 社の上に移し、F 社を全幅にした
 * （原図は F 社の左の外に縦に並べる）。F 社の中の並び（上にルータ・SW1・FW、右上に DMZ、
 * 左下に内部 LAN、右下に管理用 LAN）、「F社」の文字が左上にあることは原図どおり。
 * 線も原図どおりで、IDS は SW1・SW2・SW3・SW4 の4台に、IPS は FW・SW2・SW4 の3台につながる。
 * SW1 から IDS への線が FW から SW3 への線と交わる所、IPS から SW4 への線が
 * IDS から SW2 への線と交わる所も原図のまま残した。
 *
 * 色は役割だけで決めている。ルータ・SW・FW・IDS・IPS は device、サーバ・PC・モバイル端末は host、
 * インターネットは outside。
 *
 * 解説を開いたときは、FW から IPS・SW2 を通って RP サーバへ届く道筋を赤でなぞり（IPS が直列に入っていること。
 * 設問3(2)）、IPS・IDS・管理用 PC に輪を付け、管理用 PC で両方のログを解析することを吹き出しで示す（設問3(3)）。
 */

/** 箱の文字の大きさ（Box の size） */
const SIZE = 7.5

/** FW → IPS → SW2 → RP サーバ（DMZ に入る通信はすべて IPS を通る） */
const THROUGH_IPS: [number, number][] = [
  [168, 73],
  [184, 73],
  [204, 73],
  [236, 73],
  [248, 73],
  [264, 73],
  [280, 78],
  [290, 104],
  [300, 107],
]

export default function H27G13Fig2({ highlight = false }: ExamFigureProps) {
  return (
    <FigSvg w={340} h={244} title="図2 見直し後の営業支援システムのネットワーク構成案（抜粋）">
      {/* ── 囲み ───────────────────────────────────── */}
      <SolidFrame x={4} y={36} w={332} h={178} label="F社" />
      <DashFrame x={196} y={41} w={136} h={89} label="DMZ" />
      <DashFrame x={8} y={114} w={180} h={96} label="内部 LAN" />
      <DashFrame x={244} y={138} w={88} h={72} label="管理用 LAN" labelAnchor="end" />

      {/* ── 線 ─────────────────────────────────────── */}
      <Wire x1={100} y1={17} x2={114} y2={17} />
      <Wire x1={56} y1={28} x2={56} y2={64} />
      <Wire x1={74} y1={73} x2={98} y2={73} />
      <Wire x1={130} y1={73} x2={152} y2={73} />
      {/* FW から IPS（DMZ）と SW3（内部 LAN）へ */}
      <Wire x1={184} y1={73} x2={204} y2={73} />
      <Wire x1={164} y1={82} x2={132} y2={142} />
      {/* DMZ */}
      <Wire x1={236} y1={73} x2={248} y2={73} />
      <Wire x1={280} y1={68} x2={290} y2={62} />
      <Wire x1={280} y1={78} x2={290} y2={104} />
      {/* IDS は SW1・SW2・SW3・SW4 へ */}
      <Wire x1={114} y1={82} x2={204} y2={111} />
      <Wire x1={236} y1={110} x2={266} y2={82} />
      <Wire x1={142} y1={150} x2={206} y2={119} />
      <Wire x1={220} y1={120} x2={252} y2={178} />
      {/* IPS は SW4 へ */}
      <Wire x1={234} y1={82} x2={272} y2={172} />
      {/* 内部 LAN */}
      <Wire x1={56} y1={151} x2={108} y2={149} />
      <Wire x1={56} y1={189} x2={108} y2={157} />
      <Wire x1={118} y1={160} x2={98} y2={182} />
      <Wire x1={132} y1={160} x2={154} y2={182} />
      {/* 管理用 LAN */}
      <Wire x1={284} y1={181} x2={294} y2={181} />

      {/* ── 強調：輪と、IPS を通って DMZ に入る道筋（ノードより先）── */}
      {highlight && (
        <g>
          <Ring x={204} y={64} w={32} h={18} />
          <Ring x={204} y={102} w={32} h={18} />
          <Ring x={294} y={166} w={34} h={30} />
          <Route points={THROUGH_IPS} />
        </g>
      )}

      {/* ── ノード ───────────────────────────────────── */}
      <Ell cx={56} cy={17} rx={44} ry={11} tone="outside" lines={['インターネット']} size={SIZE} />
      <Box x={114} y={8} w={60} h={18} tone="host" lines={['モバイル端末']} size={SIZE} />
      <Box x={38} y={64} w={36} h={18} tone="device" lines={['ルータ']} size={SIZE} />
      <Box x={98} y={64} w={32} h={18} tone="device" lines={['SW1']} size={SIZE} />
      <Box x={152} y={64} w={32} h={18} tone="device" lines={['FW']} size={SIZE} />

      {/* DMZ */}
      <Box x={204} y={64} w={32} h={18} tone="device" lines={['IPS']} size={SIZE} />
      <Box x={248} y={64} w={32} h={18} tone="device" lines={['SW2']} size={SIZE} />
      <Box x={290} y={50} w={38} h={30} tone="host" lines={['DNS', 'サーバ']} size={SIZE} />
      <Box x={290} y={92} w={38} h={30} tone="host" lines={['RP', 'サーバ']} size={SIZE} />
      <Box x={204} y={102} w={32} h={18} tone="device" lines={['IDS']} size={SIZE} />

      {/* 内部 LAN */}
      <Box x={16} y={136} w={40} h={30} tone="host" lines={['Web', 'サーバ']} size={SIZE} />
      <Box x={16} y={174} w={40} h={30} tone="host" lines={['DB', 'サーバ']} size={SIZE} />
      <Box x={108} y={142} w={34} h={18} tone="device" lines={['SW3']} size={SIZE} />
      <Box x={84} y={182} w={28} h={18} tone="host" lines={['PC']} size={SIZE} />
      <Cap x={126} y={194} text="…" anchor="middle" color={MUTED} />
      <Box x={140} y={182} w={28} h={18} tone="host" lines={['PC']} size={SIZE} />

      {/* 管理用 LAN */}
      <Box x={252} y={172} w={32} h={18} tone="device" lines={['SW4']} size={SIZE} />
      <Box x={294} y={166} w={34} h={30} tone="host" lines={['管理用', 'PC']} size={SIZE} />

      {/* ── 強調の文字 ─────────────────────────────────── */}
      {highlight && (
        <g>
          <Callout
            x={190}
            y={6}
            w={134}
            lines={['IPS が止まると DMZ に届かない']}
            leader={[
              [228, 24.8],
              [228, 64],
            ]}
          />
          <Callout
            x={206}
            y={220}
            w={124}
            lines={['IDS・IPS のログを集めて解析']}
            leader={[
              [311, 220],
              [311, 196],
            ]}
          />
        </g>
      )}
    </FigSvg>
  )
}
