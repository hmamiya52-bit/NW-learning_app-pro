import type { ReactNode } from 'react'
import { Box, Cap, DashFrame, Ell, SolidFrame, Wire } from './primitives'
import { A, PC_H, PC_W } from './r6g13Layout'
import { MUTED, SEGMENT, TONE } from './tokens'

/**
 * A 社のネットワーク構成（R6 午後Ⅰ 問3 の図1・図3 で共通の下絵）
 *
 * 図3 は図1 と同じ構成に通信の流れを重ねた図なので、下絵をここに1つだけ持つ。
 * 座標は r6g13Layout.ts にあり、2枚が必ず同じ形になる。
 *
 * 描く順番: 囲み → 線 → underlay（強調の経路・輪）→ ノード → overlay（強調の文字）。
 * underlay をノードより前に差し込むので、箱の中の文字が隠れることはない。
 */
export default function R6G13Topology({
  withUtmProxy = false,
  underlay,
  overlay,
  flows,
}: {
  /** 図3 では大阪支社に UTM プロキシサーバ（UTM の機能）が加わる */
  withUtmProxy?: boolean
  /** 線とノードのあいだに差し込むもの（強調の経路・輪） */
  underlay?: ReactNode
  /** ノードの上に重ねるもの（強調の文字） */
  overlay?: ReactNode
  /** 原図の通信の流れ。線の一種なのでノードより先に描く */
  flows?: ReactNode
}) {
  return (
    <g>
      {/* ── 囲み ───────────────────────────────────── */}
      <rect
        x={A.cloud.x}
        y={A.cloud.y}
        width={A.cloud.w}
        height={A.cloud.h}
        rx={26}
        fill={TONE.outside.fill}
        stroke={TONE.outside.stroke}
        strokeWidth={1.2}
      />
      {/* 大阪支社は原図どおり4枚重ねで「4支社ある」ことを表す */}
      {[12, 8, 4].map((d) => (
        <rect
          key={d}
          x={A.br.x + d}
          y={A.br.y + d}
          width={A.br.w}
          height={A.br.h}
          fill="#ffffff"
          stroke="#64748b"
          strokeWidth={1.3}
        />
      ))}
      <SolidFrame {...A.br} fill="#ffffff" />
      <SolidFrame {...A.hq} label="東京本社" />
      <DashFrame {...A.dmz} label="DMZ" color={SEGMENT} />
      <DashFrame {...A.hqLan} color={SEGMENT} />
      <DashFrame {...A.brLan} color={SEGMENT} />

      {/* ── 線 ─────────────────────────────────────── */}
      {/* DMZ 内 */}
      <Wire x1={76} y1={91} x2={96} y2={85} />
      <Wire x1={76} y1={119} x2={96} y2={89} />
      <Wire x1={76} y1={147} x2={96} y2={93} />
      <Wire x1={117} y1={96} x2={117} y2={110} />
      {/* DMZ の L2SW ── UTM ── インターネット */}
      <Wire x1={138} y1={86} x2={190} y2={86} />
      <Wire x1={236} y1={88} x2={268} y2={88} />
      {/* UTM ── L3SW ── 内部ネットワーク */}
      <Wire x1={213} y1={96} x2={213} y2={116} />
      <Wire x1={200} y1={134} x2={76} y2={176} />
      <Wire x1={216} y1={134} x2={186} y2={176} />
      <Wire x1={66} y1={192} x2={54} y2={206} />
      <Wire x1={86} y1={192} x2={100} y2={206} />
      <Wire x1={176} y1={192} x2={164} y2={206} />
      <Wire x1={196} y1={192} x2={210} y2={206} />
      {/* 大阪支社 */}
      <Wire x1={236} y1={284} x2={268} y2={284} />
      <Wire x1={205} y1={294} x2={135} y2={304} />
      <Wire x1={120} y1={320} x2={98} y2={326} />
      <Wire x1={140} y1={320} x2={144} y2={326} />
      {withUtmProxy && <Wire x1={168} y1={286} x2={190} y2={286} />}

      {flows}
      {underlay}

      {/* ── ノード ───────────────────────────────────── */}
      <Ell {...A.saas} tone="outside" lines={['C社SaaS']} size={8} />
      <text
        x={A.cloudLabel.x}
        y={A.cloudLabel.y}
        textAnchor="middle"
        fontSize={9.6}
        fontWeight={700}
        fill={TONE.outside.text}
        transform={`rotate(-90 ${A.cloudLabel.x} ${A.cloudLabel.y})`}
      >
        インターネット
      </text>

      <Box {...A.dnsContent} tone="host" lines={['コンテンツ', 'DNSサーバ']} size={6.5} />
      <Box {...A.dnsCache} tone="host" lines={['キャッシュ', 'DNSサーバ']} size={6.5} />
      <Box {...A.web} tone="host" lines={['Web', 'サーバ']} size={6.5} />
      <Box {...A.dmzSw} tone="device" lines={['L2SW']} size={7} />
      <Box {...A.proxy} tone="host" lines={['プロキシ', 'サーバ']} size={6.5} />
      <Box {...A.hqUtm} tone="device" lines={['UTM']} size={7.5} />
      <Box {...A.l3sw} tone="device" lines={['L3SW']} size={7} />
      <Box {...A.hqSw1} tone="device" lines={['L2SW']} size={7} />
      <Box {...A.hqSw2} tone="device" lines={['L2SW']} size={7} />
      {A.hqPcX.map((x, i) => (
        <Box key={`hp-${i}`} x={x} y={A.hqPcY} w={PC_W} h={PC_H} tone="host" lines={['PC']} size={6.5} />
      ))}
      <Cap x={78} y={216} text="…" anchor="middle" color={MUTED} />
      <Cap x={188} y={216} text="…" anchor="middle" color={MUTED} />
      <Cap x={35} y={236} text="内部ネットワーク" color={SEGMENT} bold />

      <Box {...A.brUtm} tone="device" lines={['UTM']} size={7.5} />
      {withUtmProxy && (
        <Box {...A.brProxy} tone="device" lines={['UTMプロキシサーバ']} size={6.5} dash="4 2.5" />
      )}
      <Box {...A.brSw} tone="device" lines={['L2SW']} size={7} />
      {A.brPcX.map((x, i) => (
        <Box key={`bp-${i}`} x={x} y={A.brPcY} w={PC_W} h={PC_H} tone="host" lines={['PC']} size={6.5} />
      ))}
      <Cap x={122} y={336} text="…" anchor="middle" color={MUTED} />
      <Cap x={35} y={354} text="内部ネットワーク" color={SEGMENT} bold />
      <Cap x={248} y={354} text="大阪支社" anchor="end" color={MUTED} bold />

      {overlay}
    </g>
  )
}
