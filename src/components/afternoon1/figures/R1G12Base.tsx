import type { ReactNode } from 'react'
import { Box, Cap, DashFrame, Ell, Poly, Wire } from './primitives'
import { SIZE, TEXT, layout } from './r1g12Layout'
import { MUTED } from './tokens'

/**
 * A 社の Web システム（R1 午後Ⅰ 問2 の図1・図3 で共通の下絵）
 *
 * 図3 は図1 の Web サーバ1 の所に LB を置き、その先に L2SW と Web サーバ1〜8 を足し、
 * インターネットの上に T 社 WAF サービスを足した図なので、下絵をここに1つだけ持つ。座標は r1g12Layout.ts。
 *
 * 色は役割だけで決めている。FW・L2SW・LB と内部LAN（自社の網）は device、Web ブラウザ（利用者の端末）・
 * DNS サーバ・Web サーバは host、インターネットと T 社 WAF サービス（SaaS）は outside。
 * 内部LAN と T 社 WAF サービスは、原図どおり破線の箱で描く。
 *
 * 描く順番: 囲み → 線 → underlay（強調の経路・輪）→ ノード → overlay（強調の文字）。
 */

/** 縦の「⋮」（原図の Web サーバ1 と Web サーバ8 のあいだの省略） */
function VDots({ x, y }: { x: number; y: number }) {
  return (
    <g>
      {[0, 5, 10].map((d) => (
        <circle key={d} cx={x} cy={y + d} r={0.9} fill={MUTED} />
      ))}
    </g>
  )
}

export default function R1G12Base({
  changed = false,
  underlay,
  overlay,
}: {
  /** 図3（構成変更後）。T 社 WAF サービス・LB・L2SW・Web サーバ1〜8 を足す */
  changed?: boolean
  /** 線とノードのあいだに差し込むもの（強調の経路・輪） */
  underlay?: ReactNode
  /** ノードの上に重ねるもの（強調の文字） */
  overlay?: ReactNode
}) {
  const L = layout(changed)
  const { Y0, FT } = L
  const mid = Y0 + 30
  return (
    <g>
      {/* ── 囲み ───────────────────────────────────── */}
      <DashFrame {...L.frame} label="Webシステム" />

      {/* ── 線 ─────────────────────────────────────── */}
      {changed && <Wire x1={106} y1={20} x2={106} y2={L.internet.cy - L.internet.ry} />}
      <Wire x1={46} y1={mid} x2={66} y2={mid} />
      <Wire x1={146} y1={mid} x2={170} y2={mid} />
      <Wire x1={186} y1={Y0 + 40} x2={186} y2={Y0 + 56} />
      {/* FW から下の段の L2SW へ */}
      <Poly
        points={[
          [202, mid],
          [308, mid],
          [308, FT + 36],
        ]}
      />
      <Wire x1={290} y1={FT + 42} x2={240} y2={FT + 30} />
      <Wire x1={290} y1={FT + 50} x2={240} y2={FT + 74} />
      {changed && (
        <g>
          <Wire x1={200} y1={FT + 74} x2={156} y2={FT + 74} />
          <Wire x1={120} y1={FT + 70} x2={70} y2={FT + 54} />
          <Wire x1={120} y1={FT + 78} x2={70} y2={FT + 100} />
        </g>
      )}

      {underlay}

      {/* ── ノード ───────────────────────────────────── */}
      {changed && <Box {...L.waf} tone="outside" lines={['T社WAFサービス']} size={SIZE} dash="3 2" />}
      <Cap x={25} y={Y0 + 11} text="利用者" anchor="middle" size={SIZE} color={TEXT} />
      <Box {...L.browser} tone="host" lines={['Web', 'ブラウザ']} size={SIZE} />
      <Ell {...L.internet} tone="outside" lines={['インターネット']} size={SIZE} />
      <Box {...L.fw} tone="device" lines={['FW']} size={SIZE} />
      <Box {...L.lan} tone="device" lines={['内部LAN']} size={SIZE} dash="3 2" />
      <Box {...L.l2swA} tone="device" lines={['L2SW']} size={SIZE} />
      <Box {...L.dns} tone="host" lines={['DNSサーバ']} size={SIZE} />
      {changed ? (
        <Box {...L.lb} tone="device" lines={['LB']} size={SIZE} />
      ) : (
        <Box {...L.web1} tone="host" lines={['Webサーバ1']} size={SIZE} />
      )}
      {changed && (
        <g>
          <Box {...L.l2swB} tone="device" lines={['L2SW']} size={SIZE} />
          <Box {...L.srv1} tone="host" lines={['Webサーバ1']} size={SIZE} />
          <VDots x={40} y={FT + 72} />
          <Box {...L.srv8} tone="host" lines={['Webサーバ8']} size={SIZE} />
        </g>
      )}

      {/* ── アドレスと FQDN（原図どおり、線の端の近くと箱の下）──── */}
      {changed && <Cap x={112} y={34} text="waf-asha.tsha.net" size={7} color={TEXT} />}
      <Cap x={244} y={FT + 26} text="199.α.β.1" size={7} color={TEXT} />
      <Cap x={240} y={FT + 52} text="ns.asha.com" anchor="end" size={7} color={TEXT} />
      <Cap x={244} y={FT + 86} text="199.α.β.2" size={7} color={TEXT} />
      <Cap x={240} y={FT + 96} text="shop.asha.com" anchor="end" size={7} color={TEXT} />
      {changed && (
        <g>
          <Cap x={73} y={FT + 50} text="192.168.1.1" size={7} color={TEXT} />
          <Cap x={73} y={FT + 112} text="192.168.1.8" size={7} color={TEXT} />
        </g>
      )}

      {overlay}
    </g>
  )
}
