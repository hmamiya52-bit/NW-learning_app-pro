import { Box, Cap, DashFrame, Ell, FigSvg, SolidFrame, Wire } from './primitives'
import { MUTED, SEGMENT, TONE } from './tokens'

/**
 * 図1 D社データセンターの構成（抜粋）— R6 午後Ⅰ 問1
 *
 * 原図は左から右へ「配信サーバ → L2SW → LB → ルータ → ISP → インターネット」と並ぶが、
 * 375px では横に入らないので、LB より先を下へ折り返している。
 * ノード・リンク・ラベル・凡例は原図どおりで、情報は落としていない。
 *
 * 設問1(3)「必ず入っていなければならない装置を一つだけ選び，図1中の字句で答えよ」が
 * この図の字句（LB／ルータ／L2SW／α配信サーバ／ISP）を参照する。
 */

const SEG = [
  { label: ['α配信', 'サーバ'], y: 36 },
  { label: ['β配信', 'サーバ'], y: 96 },
  { label: ['γ配信', 'サーバ'], y: 156 },
]

export default function R6G11Fig1() {
  return (
    <FigSvg w={340} h={336} title="図1 D社データセンターの構成（抜粋）">
      {/* D社データセンター */}
      <SolidFrame x={3} y={14} w={254} h={232} label="D社データセンター" labelAnchor="end" />

      {SEG.map((seg, i) => (
        <g key={i}>
          {/* セグメント（破線） */}
          <DashFrame x={9} y={seg.y} w={168} h={50} />

          {/* 配信サーバ（原図どおり複数台を重ね書きで表す） */}
          <rect
            x={21}
            y={seg.y + 12}
            width={54}
            height={30}
            rx={2}
            fill={TONE.amber.fill}
            stroke={TONE.amber.stroke}
            strokeWidth={1.2}
          />
          <Box x={16} y={seg.y + 7} w={54} h={30} tone="amber" lines={seg.label} size={9} />
          <Cap x={80} y={seg.y + 38} text="⋰" size={9} color={MUTED} />

          {/* 配信サーバ ── L2SW（原図どおり2本） */}
          <Wire x1={70} y1={seg.y + 14} x2={118} y2={seg.y + 19} />
          <Wire x1={75} y1={seg.y + 28} x2={118} y2={seg.y + 28} />

          <Box x={118} y={seg.y + 13} w={44} h={22} tone="emerald" lines={['L2SW']} size={9} />
        </g>
      ))}

      {/* L2SW ── LB */}
      <Wire x1={162} y1={60} x2={196} y2={114} />
      <Wire x1={162} y1={120} x2={196} y2={121} />
      <Wire x1={162} y1={180} x2={196} y2={128} />

      <Box x={196} y={108} w={46} h={26} tone="blue" lines={['LB']} size={10} />

      {/* LB ── ルータ */}
      <Wire x1={219} y1={134} x2={219} y2={176} />
      <Box x={195} y={176} w={48} h={26} tone="sky" lines={['ルータ']} size={9} />

      {/* ルータ ──（データセンターの外へ）── ISP ── インターネット */}
      <Wire x1={219} y1={202} x2={219} y2={258} />
      <Ell cx={120} cy={272} rx={76} ry={20} tone="slate" lines={['インターネット']} size={9} />
      <Ell cx={219} cy={272} rx={24} ry={14} tone="slate" lines={['ISP']} size={9} />

      {/* 凡例 */}
      <rect
        x={8}
        y={300}
        width={20}
        height={12}
        fill="none"
        stroke={SEGMENT}
        strokeWidth={1.1}
        strokeDasharray="4 2.5"
      />
      <Cap x={32} y={310} text="：セグメント" />
      <Cap x={104} y={310} text="L2SW：レイヤー2スイッチ" />
      <Cap x={8} y={326} text="LB：ロードバランサー" />
      <Cap x={122} y={326} text="ISP：インターネットサービスプロバイダ" />
    </FigSvg>
  )
}
