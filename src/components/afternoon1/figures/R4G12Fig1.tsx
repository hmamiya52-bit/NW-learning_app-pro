import { Box, Callout, Cap, Ell, FigSvg, Poly, Ring, Route, RouteTag, SolidFrame, Wire } from './primitives'
import { LOGICAL, MUTED, TONE } from './tokens'
import type { ExamFigureProps } from './tokens'

/**
 * 図1 N 社の現行のネットワーク構成（抜粋）— R4 午後Ⅰ 問2
 *
 * 原図は本社と営業所を横に並べ、インターネットを上から右へ回り込む角丸のパイプで描き、
 * IPsec VPN の線がそのパイプを横切る（横切っている部分だけ破線）形で
 * 「トンネルはインターネットを越えている」ことを表している。
 * 375px では横に入らないので、拠点を縦に積み、インターネットを右の縦長の雲にした。
 * トンネルが雲を通る（雲の中だけ破線）という原図の描き方はそのまま残してある。
 *
 * 色は役割だけで決めている。FW も L3SW も IPsec ルータも N 社の装置なので device、
 * サーバと PC は host、インターネットと P 社営業支援サービスは outside。
 *
 * 設問1(1)は「本社の FW で NAPT されるので P 社から見える送信元は a.b.c.d」、
 * 設問1(4)は「営業所の PC 宛ての戻りではなく、外向きは 65000:2 のデフォルトルート」が答え。
 * どちらも「営業所の PC からの通信が本社を通ってインターネットに出る」という道筋が前提なので、
 * 解説を開いたときはその道筋そのものを赤くなぞる。
 */

/** 営業所の PC から P 社営業支援サービスまでの道筋（設問1(1)(4)の前提） */
const FLOW: [number, number][] = [
  [112, 292],
  [114, 270],
  [120, 261],
  [176, 261],
  [234, 261],
  [294, 261],
  [294, 133],
  [234, 133],
  [180, 120],
  [160, 110],
  [132, 96],
  [122, 76],
  [118, 66],
  [268, 66],
  [268, 26],
]

export default function R4G12Fig1({ highlight = false }: ExamFigureProps) {
  return (
    <FigSvg w={340} h={392} title="図1 N 社の現行のネットワーク構成（抜粋）">
      {/* ── 囲み ───────────────────────────────────── */}
      <rect
        x={254}
        y={40}
        width={80}
        height={280}
        rx={26}
        fill={TONE.outside.fill}
        stroke={TONE.outside.stroke}
        strokeWidth={1.2}
      />
      <SolidFrame x={6} y={44} w={240} h={176} label="本社" />
      <SolidFrame x={6} y={234} w={240} h={94} label="営業所" />

      {/* ── 線 ─────────────────────────────────────── */}
      <Wire x1={268} y1={34} x2={268} y2={40} /> {/* P社営業支援サービス ── インターネット */}
      <Wire x1={140} y1={66} x2={254} y2={66} /> {/* FW ── インターネット */}
      <Wire x1={122} y1={76} x2={132} y2={96} /> {/* FW ── L3SW */}
      <Wire x1={108} y1={76} x2={44} y2={126} /> {/* FW ── L2SW（サーバ側） */}
      <Wire x1={130} y1={116} x2={110} y2={126} /> {/* L3SW ── L2SW（PC側） */}
      <Wire x1={160} y1={110} x2={180} y2={120} /> {/* L3SW ── IPsecルータ */}
      <Wire x1={32} y1={144} x2={28} y2={162} /> {/* L2SW ── サーバ */}
      <Wire x1={100} y1={144} x2={98} y2={162} /> {/* L2SW ── PC */}
      <Wire x1={176} y1={261} x2={142} y2={261} /> {/* 営業所 IPsecルータ ── L2SW */}
      <Wire x1={114} y1={270} x2={112} y2={292} /> {/* L2SW ── PC */}

      {/* IPsec VPN。インターネットの中（雲の内側）だけ破線にする */}
      <Wire x1={234} y1={133} x2={254} y2={133} color={LOGICAL} width={1.6} />
      <Wire x1={234} y1={261} x2={254} y2={261} color={LOGICAL} width={1.6} />
      <Poly
        points={[
          [254, 133],
          [294, 133],
          [294, 261],
          [254, 261],
        ]}
        color={LOGICAL}
        width={1.6}
        dash="5 3"
      />

      {/* ── 強調：営業所の PC からインターネットへ出るまでの道筋 ── */}
      {highlight && (
        <g>
          <Route points={FLOW} />
          <Ring x={96} y={56} w={44} h={20} />
        </g>
      )}

      {/* ── ノード ───────────────────────────────────── */}
      <Ell cx={268} cy={20} rx={68} ry={14} tone="outside" lines={['P社営業支援サービス']} size={7.5} />
      <text
        x={318}
        y={180}
        textAnchor="middle"
        fontSize={9.6}
        fontWeight={700}
        fill={TONE.outside.text}
        transform="rotate(-90 318 180)"
      >
        インターネット
      </text>

      <Box x={96} y={56} w={44} h={20} tone="device" lines={['FW']} size={8} />
      <Box x={112} y={96} w={48} h={20} tone="device" lines={['L3SW']} size={7.5} />
      <Box x={18} y={126} w={44} h={18} tone="device" lines={['L2SW']} size={7.5} />
      <Box x={84} y={126} w={44} h={18} tone="device" lines={['L2SW']} size={7.5} />
      <Box x={176} y={119} w={58} h={28} tone="device" lines={['IPsec', 'ルータ']} size={7.5} />
      {/* サーバと PC は原図どおり重ね書きで複数台を表す */}
      <rect x={20} y={168} width={46} height={18} rx={2} fill={TONE.host.fill} stroke={TONE.host.stroke} strokeWidth={1.2} />
      <Box x={14} y={162} w={46} h={18} tone="host" lines={['サーバ']} size={7.5} />
      <Cap x={68} y={166} text="⋰" size={8} color={MUTED} />
      <rect x={88} y={168} width={42} height={18} rx={2} fill={TONE.host.fill} stroke={TONE.host.stroke} strokeWidth={1.2} />
      <Box x={82} y={162} w={42} h={18} tone="host" lines={['PC']} size={7.5} />
      <Cap x={132} y={166} text="⋰" size={8} color={MUTED} />

      <Box x={176} y={247} w={58} h={28} tone="device" lines={['IPsec', 'ルータ']} size={7.5} />
      <Box x={98} y={252} w={44} h={18} tone="device" lines={['L2SW']} size={7.5} />
      <rect x={102} y={298} width={42} height={18} rx={2} fill={TONE.host.fill} stroke={TONE.host.stroke} strokeWidth={1.2} />
      <Box x={96} y={292} w={42} h={18} tone="host" lines={['PC']} size={7.5} />
      <Cap x={146} y={296} text="⋰" size={8} color={MUTED} />

      {/* ── 強調の文字（空いている場所にだけ置く）── */}
      {highlight && (
        <g>
          <RouteTag cx={270} cy={261} text="IPsec VPN" />
          <Callout
            x={8}
            y={4}
            w={118}
            lines={['FW が NAPT する。P 社に', '見える送信元は a.b.c.d']}
            leader={[
              [126, 26],
              [118, 52],
            ]}
          />
        </g>
      )}

      {/* ── 凡例 ─────────────────────────────────────── */}
      <Cap x={6} y={346} text="FW：ファイアウォール" color={MUTED} />
      <Cap x={128} y={346} text="L2SW：レイヤ2スイッチ" color={MUTED} />
      <Cap x={6} y={364} text="L3SW：レイヤ3スイッチ" color={MUTED} />
      <Cap x={128} y={364} text="IPsecルータ：IPsec VPN ルータ" color={MUTED} />
      <Wire x1={8} y1={378} x2={44} y2={378} color={LOGICAL} width={1.6} dash="5 3" />
      <Cap x={50} y={381} text="：IPsec VPN（インターネット経由）" color={MUTED} />
    </FigSvg>
  )
}
