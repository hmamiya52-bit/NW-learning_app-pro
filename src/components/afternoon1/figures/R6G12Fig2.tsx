import { Box, Callout, Cap, DashFrame, FigSvg, Poly, Ring, Route, RouteTag, SolidFrame, Wire } from './primitives'
import { MUTED, SEGMENT, TONE } from './tokens'
import type { ExamFigureProps } from './tokens'

/**
 * 図2 G 社の SD-WAN 装置導入後のネットワーク構成（抜粋）— R6 午後Ⅰ 問2
 *
 * 図1 のルータ1〜4 が SD-WAN 装置1〜4 に置き換わり、各装置がインターネットと
 * L 社 MPLS VPN の両方につながる。上に K 社 SD-WAN コントローラー。
 * 原図は拠点が横一列だが、375px に合わせて図1 と同じ縦積みにし、
 * インターネットを左の縦長、L 社 MPLS VPN を右の縦長の雲にした。
 * 拠点名は原図どおり枠の左下に置く（図1 は左上）。
 *
 * データセンターは原図どおり FW ── SD-WAN 装置1 ── L3SW1 の並び。
 * 図1 では L3SW1 の横にぶら下がっていたルータ1 が、FW と L3SW1 の間に入っている。
 *
 * 色は役割だけで決めている。K 社コントローラーと PE は他社の持ち物なので outside。
 * 解説を開いたときは、本社の SD-WAN 装置2 の上りが2本あること（アンダーレイ2本立て）を示す。
 */

const SITES = [
  { label: '本社', y: 212, n: 2 },
  { label: '支店V', y: 304, n: 3 },
  { label: '支店W', y: 396, n: 4 },
]

/** PE の箱の上端 y（各拠点の SD-WAN 装置と同じ高さに置く） */
const PE_Y = [82, 216, 308, 400]

export default function R6G12Fig2({ highlight = false }: ExamFigureProps) {
  return (
    <FigSvg w={340} h={542} title="図2 G 社の SD-WAN 装置導入後のネットワーク構成（抜粋）">
      {/* ── 囲み ───────────────────────────────────── */}
      {/* インターネット（左の縦長の雲） */}
      <rect
        x={6}
        y={40}
        width={38}
        height={446}
        rx={18}
        fill={TONE.outside.fill}
        stroke={TONE.outside.stroke}
        strokeWidth={1.2}
      />
      {/* L社 MPLS VPN（右の縦長の雲） */}
      <rect
        x={250}
        y={70}
        width={84}
        height={358}
        rx={26}
        fill={TONE.outside.fill}
        stroke={TONE.outside.stroke}
        strokeWidth={1.2}
      />
      <SolidFrame x={52} y={54} w={190} h={150} />
      <DashFrame x={58} y={84} w={88} h={54} label="DMZ" color={SEGMENT} />
      <DashFrame x={58} y={142} w={124} h={42} color={SEGMENT} />
      {SITES.map((site) => (
        <g key={`fr-${site.n}`}>
          <SolidFrame x={52} y={site.y} w={190} h={84} />
          <DashFrame x={58} y={site.y + 28} w={88} h={40} color={SEGMENT} />
        </g>
      ))}

      {/* ── 線 ─────────────────────────────────────── */}
      <Wire x1={120} y1={30} x2={26} y2={42} /> {/* K社コントローラー ── インターネット */}
      {[0, 1, 2].map((i) => (
        <Wire key={`pe-${i}`} x1={292} y1={PE_Y[i] + 20} x2={292} y2={PE_Y[i + 1]} />
      ))}
      {/* データセンター */}
      <Wire x1={160} y1={66} x2={44} y2={66} /> {/* FW ── インターネット */}
      <Poly
        points={[
          [206, 82],
          [206, 48],
          [44, 48],
        ]}
      />
      <Wire x1={234} y1={92} x2={262} y2={92} /> {/* SD-WAN装置1 ── PE1 */}
      <Wire x1={176} y1={74} x2={186} y2={82} />
      <Wire x1={128} y1={106} x2={166} y2={74} />
      <Wire x1={109} y1={114} x2={107} y2={120} />
      <Wire x1={192} y1={102} x2={192} y2={110} />
      <Wire x1={170} y1={122} x2={130} y2={150} />
      <Wire x1={102} y1={162} x2={88} y2={166} />
      <Wire x1={118} y1={162} x2={132} y2={166} />
      {/* 各拠点 */}
      {SITES.map((site) => {
        const Y = site.y
        return (
          <g key={`wi-${site.n}`}>
            <Wire x1={150} y1={Y + 14} x2={44} y2={Y + 14} />
            <Wire x1={234} y1={Y + 14} x2={262} y2={Y + 14} />
            <Wire x1={192} y1={Y + 24} x2={192} y2={Y + 32} />
            <Wire x1={76} y1={Y + 48} x2={72} y2={Y + 52} />
            <Wire x1={92} y1={Y + 48} x2={110} y2={Y + 52} />
            <Wire x1={104} y1={Y + 40} x2={170} y2={Y + 40} />
          </g>
        )
      })}

      {/* ── 強調：SD-WAN装置2 の上りは2本（インターネットと L社VPN）── */}
      {highlight && (
        <g>
          <Route
            points={[
              [40, 226],
              [292, 226],
            ]}
          />
          <Ring x={150} y={216} w={84} h={20} />
        </g>
      )}

      {/* ── ノード（強調より後に描くので、中の文字は隠れない）── */}
      <Box
        x={90}
        y={8}
        w={146}
        h={22}
        tone="outside"
        lines={['K社 SD-WANコントローラー']}
        size={7.5}
      />
      <text
        x={25}
        y={264}
        textAnchor="middle"
        fontSize={9.6}
        fontWeight={700}
        fill={TONE.outside.text}
        transform="rotate(-90 25 264)"
      >
        インターネット
      </text>
      <Cap x={292} y={64} text="L社 MPLS VPN" anchor="middle" color={TONE.outside.text} bold />

      <Box x={160} y={58} w={32} h={16} tone="device" lines={['FW']} size={7} />
      <Box x={150} y={82} w={84} h={20} tone="device" lines={['SD-WAN装置1']} size={7.5} />
      <Box x={90} y={98} w={38} h={16} tone="device" lines={['L2SW']} size={7} />
      <Box x={70} y={120} w={64} h={16} tone="host" lines={['プロキシサーバ']} size={6.5} />
      <Box x={170} y={110} w={44} h={16} tone="device" lines={['L3SW1']} size={7} />
      <Box x={90} y={146} w={40} h={16} tone="device" lines={['L2SW']} size={7} />
      <Box x={62} y={166} w={36} h={15} tone="host" lines={['サーバ']} size={6.5} />
      <Cap x={110} y={178} text="…" anchor="middle" color={MUTED} />
      <Box x={122} y={166} w={36} h={15} tone="host" lines={['サーバ']} size={6.5} />
      <Cap x={58} y={198} text="データセンター" color={MUTED} bold />

      {SITES.map((site) => {
        const Y = site.y
        return (
          <g key={`nd-${site.n}`}>
            <Box
              x={150}
              y={Y + 4}
              w={84}
              h={20}
              tone="device"
              lines={[`SD-WAN装置${site.n}`]}
              size={7.5}
            />
            <Box x={64} y={Y + 32} w={40} h={16} tone="device" lines={['L2SW']} size={7} />
            <Box x={62} y={Y + 52} w={26} h={13} tone="host" lines={['PC']} size={6.5} />
            <Cap x={95} y={Y + 62} text="…" anchor="middle" color={MUTED} />
            <Box x={102} y={Y + 52} w={26} h={13} tone="host" lines={['PC']} size={6.5} />
            <Box x={170} y={Y + 32} w={44} h={16} tone="device" lines={[`L3SW${site.n}`]} size={7} />
            <Cap x={58} y={Y + 80} text={site.label} color={MUTED} bold />
          </g>
        )
      })}

      {PE_Y.map((y, i) => (
        <Box key={`peb-${i}`} x={262} y={y} w={60} h={20} tone="outside" lines={[`PE${i + 1}`]} size={8} />
      ))}

      {/* ── 強調の文字（空いている場所にだけ置く）── */}
      {highlight && (
        <g>
          <RouteTag cx={97} cy={226} text="インターネット側" />
          <Callout
            x={150}
            y={262}
            w={90}
            lines={['上りが2本ある。', 'これがアンダーレイ']}
            leader={[
              [222, 262],
              [222, 238],
            ]}
          />
        </g>
      )}

      {/* ── 凡例 ─────────────────────────────────────── */}
      <Cap x={6} y={504} text="FW：ファイアウォール" />
      <Cap x={112} y={504} text="L2SW：レイヤー2スイッチ" />
      <Cap x={6} y={520} text="L3SW：レイヤー3スイッチ" />
      <Cap x={124} y={520} text="PE：プロバイダエッジルータ" />
      <rect
        x={6}
        y={526}
        width={20}
        height={12}
        fill="none"
        stroke={SEGMENT}
        strokeWidth={1.1}
        strokeDasharray="4 2.5"
      />
      <Cap x={30} y={536} text="：サブネット" />
    </FigSvg>
  )
}
