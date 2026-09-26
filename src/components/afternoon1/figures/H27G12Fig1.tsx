import { Box, Callout, Cap, DashFrame, Ell, FigSvg, Ring, Wire } from './primitives'
import { MUTED, TONE } from './tokens'
import type { ExamFigureProps, ToneName } from './tokens'

/**
 * 図1 D 社の現行の NW 構成（抜粋）— H27 午後Ⅰ 問2
 *
 * 機器の並び（上に L2SW・ルータ・インターネット、その下に FW 2台、左下に社内 NW、右下に DMZ）、
 * FW 2台から社内 NW と DMZ の L2SW への X 字の線、重ね書きの枚数（Proxy・社内メールサーバ・
 * 情報系サーバ・Web サーバは2枚、中継メールサーバは1枚）は原図どおり。
 * 原図は略語の説明を右の外に置くが、375px に収めるため DMZ の枠の下へ移した。
 *
 * 色は役割だけで決めている。L2SW・L3SW・ルータ・FW・LB は device、サーバ・Proxy・PC は host、
 * インターネットは outside。
 *
 * 解説を開いたときは、FW 2台の組（Active-Standby）と、現行の LB1・LB2 に輪を付け、
 * 一番上の L2SW が新構成（図3）で LB3 に置き換わることを吹き出しで示す。
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

const LEGEND = ['L2SW：レイヤ2スイッチ', 'L3SW：レイヤ3スイッチ', 'FW：ファイアウォール', 'LB：負荷分散装置', 'Proxy：プロキシサーバ']

export default function H27G12Fig1({ highlight = false }: ExamFigureProps) {
  return (
    <FigSvg w={340} h={240} title="図1 D 社の現行の NW 構成（抜粋）">
      {/* ── 囲み ───────────────────────────────────── */}
      <DashFrame x={4} y={72} w={182} h={144} label="社内 NW" />
      <DashFrame x={192} y={72} w={144} h={100} label="DMZ" labelAnchor="end" />

      {/* ── 強調：FW 2台の組を囲む輪（FW どうしの線を隠さないよう、線より先に敷く）── */}
      {highlight && <Ring x={104} y={40} w={88} h={18} />}

      {/* ── 線 ─────────────────────────────────────── */}
      <Wire x1={168} y1={15} x2={180} y2={15} />
      <Wire x1={220} y1={15} x2={228} y2={15} />
      <Wire x1={140} y1={24} x2={126} y2={40} />
      <Wire x1={156} y1={24} x2={170} y2={40} />
      <Wire x1={140} y1={49} x2={156} y2={49} />
      {/* FW 2台から社内 NW と DMZ の L2SW へ（X 字） */}
      <Wire x1={116} y1={58} x2={128} y2={94} />
      <Wire x1={130} y1={58} x2={218} y2={94} />
      <Wire x1={164} y1={58} x2={140} y2={94} />
      <Wire x1={180} y1={58} x2={232} y2={94} />
      {/* 社内 NW */}
      <Wire x1={56} y1={103} x2={68} y2={103} />
      <Wire x1={134} y1={112} x2={134} y2={134} />
      <Wire x1={90} y1={112} x2={118} y2={134} />
      <Wire x1={66} y1={142} x2={114} y2={142} />
      <Wire x1={58} y1={180} x2={118} y2={152} />
      <Wire x1={126} y1={152} x2={100} y2={190} />
      <Wire x1={144} y1={152} x2={152} y2={190} />
      {/* DMZ */}
      <Wire x1={246} y1={103} x2={258} y2={103} />
      <Wire x1={226} y1={112} x2={226} y2={134} />
      <Wire x1={246} y1={143} x2={258} y2={143} />

      {/* ── 強調：現行の LB に輪（ノードより先）── */}
      {highlight && (
        <g>
          <Ring x={68} y={94} w={34} h={18} />
          <Ring x={206} y={134} w={40} h={18} />
        </g>
      )}

      {/* ── ノード ───────────────────────────────────── */}
      <Box x={128} y={6} w={40} h={18} tone="device" lines={['L2SW']} size={SIZE} />
      <Box x={180} y={6} w={40} h={18} tone="device" lines={['ルータ']} size={SIZE} />
      <Ell cx={272} cy={15} rx={44} ry={11} tone="outside" lines={['インターネット']} size={SIZE} />
      <Box x={104} y={40} w={36} h={18} tone="device" lines={['FW']} size={SIZE} />
      <Box x={156} y={40} w={36} h={18} tone="device" lines={['FW']} size={SIZE} />

      {/* 社内 NW */}
      <Stack x={12} y={94} w={44} h={18} tone="host" lines={['Proxy']} />
      <Box x={68} y={94} w={34} h={18} tone="device" lines={['LB1']} size={SIZE} />
      <Box x={114} y={94} w={40} h={18} tone="device" lines={['L2SW']} size={SIZE} />
      <Box x={114} y={134} w={40} h={18} tone="device" lines={['L3SW']} size={SIZE} />
      <Stack x={12} y={128} w={54} h={30} tone="host" lines={['社内メール', 'サーバ']} />
      <Stack x={12} y={172} w={46} h={30} tone="host" lines={['情報系', 'サーバ']} />
      <Box x={80} y={190} w={32} h={18} tone="host" lines={['PC']} size={SIZE} />
      <Cap x={124} y={202} text="…" anchor="middle" color={MUTED} />
      <Box x={136} y={190} w={32} h={18} tone="host" lines={['PC']} size={SIZE} />

      {/* DMZ */}
      <Box x={206} y={94} w={40} h={18} tone="device" lines={['L2SW']} size={SIZE} />
      <Box x={258} y={96} w={66} h={30} tone="host" lines={['中継メール', 'サーバ']} size={SIZE} />
      <Box x={206} y={134} w={40} h={18} tone="device" lines={['LB2']} size={SIZE} />
      <Stack x={258} y={130} w={52} h={30} tone="host" lines={['Web', 'サーバ']} />

      {/* ── 強調の文字 ─────────────────────────────────── */}
      {highlight && (
        <Callout
          x={6}
          y={4}
          w={114}
          lines={['図3 では LB3 に置き換わる']}
          leader={[
            [120, 15],
            [128, 15],
          ]}
        />
      )}

      {/* ── 凡例（原図は右の外）─────────────────────────── */}
      {LEGEND.map((t, i) => (
        <Cap key={t} x={198} y={184 + i * 12.5} text={t} size={7} color={MUTED} />
      ))}
    </FigSvg>
  )
}
