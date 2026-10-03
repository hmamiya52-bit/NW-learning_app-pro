import { Box, SolidFrame, Wire } from './primitives'
import { SHOP, SIZE, hqCore, shopCore } from './r3g11Layout'
import { FRAME, MUTED } from './tokens'

/**
 * R3 午後Ⅰ 問1 の図1・図3 で共通の部品
 *
 * 本社と店舗の在庫管理システム（L2SW・サーバ・端末）は2枚で同じ並びなので、線と箱をここに1つだけ持つ。
 * 描く順番（囲み → 線 → 強調の経路・輪 → ノード → 強調の文字）を守れるよう、線（Wires）と箱（Nodes）を分けてある。
 * 座標は r3g11Layout.ts。
 */

/** 縦の「⋮」（原図の、WAN から店舗へ向かう2本の線のあいだにある省略） */
export function VDots({ x, y }: { x: number; y: number }) {
  return (
    <g>
      {[0, 4.5, 9].map((d) => (
        <circle key={d} cx={x} cy={y + d} r={0.9} fill={MUTED} />
      ))}
    </g>
  )
}

/** 斜めの「⋱」（原図の、重ねた店舗の枠の角どうしを結ぶ点） */
function DiagDots({ x, y }: { x: number; y: number }) {
  return (
    <g>
      {[1.5, 3, 4.5].map((d) => (
        <circle key={d} cx={x + d} cy={y + d} r={0.6} fill={MUTED} />
      ))}
    </g>
  )
}

/** 店舗の枠（原図どおり2枚重ね。右上と左下の角に「⋱」） */
export function ShopFrame({ y, h }: { y: number; h: number }) {
  const { x, w, d } = SHOP
  return (
    <g>
      <rect x={x + d} y={y + d} width={w} height={h} fill="#ffffff" stroke={FRAME} strokeWidth={1.3} />
      <SolidFrame x={x} y={y} w={w} h={h} label="店舗" fill="#ffffff" />
      <DiagDots x={x + w} y={y} />
      <DiagDots x={x} y={y + h} />
    </g>
  )
}

/** 本社の在庫管理システムの線（L2SW から5台へ） */
export function HqCoreWires({ y0 }: { y0: number }) {
  return (
    <g>
      <Wire x1={68} y1={y0 + 10} x2={82} y2={y0 + 10} />
      <Wire x1={68} y1={y0 + 34} x2={85} y2={y0 + 20} />
      <Wire x1={66} y1={y0 + 54} x2={92} y2={y0 + 20} />
      <Wire x1={106} y1={y0 + 20} x2={106} y2={y0 + 54} />
      <Wire x1={124} y1={y0 + 20} x2={150} y2={y0 + 54} />
    </g>
  )
}

/** 本社の在庫管理システムの箱。図3 では L2SW と端末に番号が付く */
export function HqCoreNodes({ y0, numbered = false }: { y0: number; numbered?: boolean }) {
  const C = hqCore(y0)
  return (
    <g>
      <Box {...C.dhcp} tone="host" lines={['DHCPサーバ']} size={SIZE} />
      <Box {...C.dns} tone="host" lines={['DNSサーバ']} size={SIZE} />
      <Box {...C.srv} tone="host" lines={['在庫管理', 'サーバ']} size={SIZE} />
      <Box {...C.l2sw} tone="device" lines={[numbered ? 'L2SW00' : 'L2SW']} size={SIZE} />
      <Box {...C.pc1} tone="host" lines={['在庫管理', numbered ? '端末001' : '端末']} size={SIZE} />
      <Box {...C.pc2} tone="host" lines={['在庫管理', numbered ? '端末002' : '端末']} size={SIZE} />
    </g>
  )
}

/** 店舗の在庫管理システムの線（L2SW から端末2台へ） */
export function ShopCoreWires({ y0 }: { y0: number }) {
  return (
    <g>
      <Wire x1={229} y1={y0 + 20} x2={215} y2={y0 + 48} />
      <Wire x1={249} y1={y0 + 20} x2={263} y2={y0 + 48} />
    </g>
  )
}

/** 店舗の在庫管理システムの箱。図3 では L2SW と端末に番号が付く */
export function ShopCoreNodes({ y0, numbered = false }: { y0: number; numbered?: boolean }) {
  const C = shopCore(y0)
  return (
    <g>
      <Box {...C.l2sw} tone="device" lines={[numbered ? 'L2SW01' : 'L2SW']} size={SIZE} />
      <Box {...C.pc1} tone="host" lines={['在庫管理', numbered ? '端末011' : '端末']} size={SIZE} />
      <Box {...C.pc2} tone="host" lines={['在庫管理', numbered ? '端末012' : '端末']} size={SIZE} />
    </g>
  )
}
