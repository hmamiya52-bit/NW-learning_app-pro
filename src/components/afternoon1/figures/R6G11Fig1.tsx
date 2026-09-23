import { Box, Callout, Cap, DashFrame, Ell, FigSvg, Ring, Route, RouteTag, SolidFrame, Wire } from './primitives'
import { MUTED, SEGMENT, TONE } from './tokens'
import type { ExamFigureProps } from './tokens'

/**
 * 図1 D社データセンターの構成（抜粋）— R6 午後Ⅰ 問1
 *
 * 原図は左から右へ「配信サーバ → L2SW → LB → ルータ → ISP → インターネット」と並ぶが、
 * 375px では横に入らないので、LB より先を下へ折り返している。
 * ノード・リンク・ラベル・凡例は原図どおりで、情報は落としていない。
 *
 * 設問1(3)「必ず入っていなければならない装置を一つだけ選び，図1中の字句で答えよ」が
 * この図の字句（LB／ルータ／L2SW／α配信サーバ／ISP）を参照する。
 *
 * 解説を開いたとき（highlight）は、ゲーム端末から α 配信サーバまでの道筋をなぞり、
 * HTTPS と HTTP の変わり目が LB であることを示す。
 */

const SEG = [
  { label: ['α配信', 'サーバ'], y: 36 },
  { label: ['β配信', 'サーバ'], y: 96 },
  { label: ['γ配信', 'サーバ'], y: 156 },
]

export default function R6G11Fig1({ highlight = false }: ExamFigureProps) {
  return (
    <FigSvg w={340} h={336} title="図1 D社データセンターの構成（抜粋）">
      {/* D社データセンター */}
      <SolidFrame x={3} y={14} w={254} h={232} label="D社データセンター" labelAnchor="end" />

      {SEG.map((seg, i) => (
        <g key={i}>
          {/* セグメント（破線） */}
          <DashFrame x={9} y={seg.y} w={168} h={50} />

          <Cap x={80} y={seg.y + 38} text="⋰" size={9} color={MUTED} />

          {/* 配信サーバ ── L2SW（原図どおり2本） */}
          <Wire x1={70} y1={seg.y + 14} x2={130} y2={seg.y + 19} />
          <Wire x1={75} y1={seg.y + 28} x2={130} y2={seg.y + 28} />
        </g>
      ))}

      {/* L2SW ── LB */}
      <Wire x1={172} y1={60} x2={196} y2={114} />
      <Wire x1={172} y1={120} x2={196} y2={121} />
      <Wire x1={172} y1={180} x2={196} y2={128} />

      {/* LB ── ルータ ──（データセンターの外へ）── ISP */}
      <Wire x1={219} y1={134} x2={219} y2={176} />
      <Wire x1={219} y1={202} x2={219} y2={258} />

      {/* ── 強調：ゲーム端末 → α配信サーバ の道筋（ノードより先に描く）── */}
      {highlight && (
        <g>
          {/* ISP → ルータ → LB：ここまでが HTTPS */}
          <Route points={[[219, 286], [219, 121]]} />
          {/* LB → L2SW → α配信サーバ：ここから HTTP */}
          <Route points={[[219, 121], [196, 114], [172, 60], [130, 64], [68, 64]]} />
          <Ring x={196} y={108} w={46} h={26} />
        </g>
      )}

      {/* ── ノード（強調より後に描くので、中の文字は隠れない）── */}
      {SEG.map((seg, i) => (
        <g key={i}>
          {/* 配信サーバ（原図どおり複数台を重ね書きで表す） */}
          <rect
            x={21}
            y={seg.y + 12}
            width={54}
            height={33}
            rx={2}
            fill={TONE.host.fill}
            stroke={TONE.host.stroke}
            strokeWidth={1.2}
          />
          <Box x={16} y={seg.y + 7} w={54} h={33} tone="host" lines={seg.label} size={9} />
          <Box x={130} y={seg.y + 13} w={42} h={22} tone="device" lines={['L2SW']} size={9} />
        </g>
      ))}
      <Box x={196} y={108} w={46} h={26} tone="device" lines={['LB']} size={10} />
      <Box x={195} y={176} w={48} h={26} tone="device" lines={['ルータ']} size={9} />
      <Ell cx={120} cy={272} rx={76} ry={20} tone="outside" lines={['インターネット']} size={9} />
      <Ell cx={219} cy={272} rx={24} ry={14} tone="outside" lines={['ISP']} size={9} />

      {/* ── 強調の文字（空いている場所にだけ置く。実測で重なりなしを確認済み）── */}
      {highlight && (
        <g>
          <RouteTag cx={219} cy={232} text="HTTPS" />
          <RouteTag cx={110} cy={64} text="HTTP" />
          <Callout
            x={262}
            y={100}
            w={76}
            lines={['HTTPS を終端', 'サーバ証明書は', 'ここに置く']}
            leader={[
              [262, 120],
              [244, 121],
            ]}
          />
        </g>
      )}

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
