import { Callout, Ell, FigSvg, Ring, SolidFrame, Wire } from './primitives'
import { HqCoreNodes, HqCoreWires, ShopCoreNodes, ShopCoreWires, ShopFrame, VDots } from './R3G11Parts'
import { HQ, SIZE, hqCore } from './r3g11Layout'
import type { ExamFigureProps } from './tokens'

/**
 * 図1 現状の在庫管理システムの構成（抜粋）— R3 午後Ⅰ 問1
 *
 * 原図は 本社 → 広域イーサ網 → 店舗 の横一列。そのままでは 340 の幅に入らない（箱の文字が size 7.5 で収まらない）ので、
 * 広域イーサ網を上の真ん中に置き、その左下に本社、右に店舗を並べた。図3（更改後）と同じ並びで、
 * 本社と店舗の在庫管理システムの部分は2枚で同じ位置にある（r3g11Layout.ts・R3G11Parts.tsx）。
 * 広域イーサ網から店舗へは原図どおり2本（手前の店舗の L2SW と、後ろの店舗）で、あいだに「⋮」。
 * 店舗の枠は原図どおり2枚重ね。
 *
 * 色は役割だけで決めている。L2SW は device、DHCP サーバ・DNS サーバ・在庫管理サーバ・在庫管理端末は host、
 * 広域イーサ網（通信事業者の網）は outside。
 *
 * 解説を開いたときは、DHCP サーバ（設問1(1)）と本社の L2SW（設問1(3)）に輪を付け、
 * 本社と店舗の機器の台数（設問1(2)）を吹き出しで示す。
 */

/** 本社の枠の上端と、L2SW の行の上端 */
const HQ_Y = 62
const HQ_CORE = 92
/** 店舗の枠の上端と、L2SW の行の上端 */
const SHOP_Y = 8
const SHOP_CORE = 30
const WAN = { cx: 150, cy: 40, rx: 34, ry: 14 }

export default function R3G11Fig1({ highlight = false }: ExamFigureProps) {
  const C = hqCore(HQ_CORE)
  return (
    <FigSvg w={340} h={188} title="図1 現状の在庫管理システムの構成（抜粋）">
      {/* ── 囲み ───────────────────────────────────── */}
      <SolidFrame x={HQ.x} y={HQ_Y} w={HQ.w} h={122} label="本社" />
      <ShopFrame y={SHOP_Y} h={108} />

      {/* ── 線 ─────────────────────────────────────── */}
      {/* 本社の L2SW ── 広域イーサ網 ── 店舗の L2SW。もう1本は後ろの店舗へ */}
      <Wire x1={118} y1={HQ_CORE} x2={138} y2={53} />
      <Wire x1={184} y1={40} x2={215} y2={40} />
      <Wire x1={178} y1={48} x2={188} y2={66} />
      <HqCoreWires y0={HQ_CORE} />
      <ShopCoreWires y0={SHOP_CORE} />

      {/* ── 強調：DHCP サーバと本社の L2SW の輪 ─────────── */}
      {highlight && (
        <g>
          <Ring {...C.dhcp} />
          <Ring {...C.l2sw} />
        </g>
      )}

      {/* ── ノード ───────────────────────────────────── */}
      <Ell {...WAN} tone="outside" lines={['広域イーサ網']} size={SIZE} />
      <VDots x={185} y={46} />
      <HqCoreNodes y0={HQ_CORE} />
      <ShopCoreNodes y0={SHOP_CORE} />

      {/* ── 強調の文字（どちらも枠の中の空いた所。台数は枠の中の箱全部のことなので引出し線は付けない）── */}
      {highlight && (
        <g>
          <Callout x={40} y={65} w={58} lines={['本社は 6 台']} />
          <Callout x={268} y={54} w={59} lines={['各店舗 3 台']} />
        </g>
      )}
    </FigSvg>
  )
}
