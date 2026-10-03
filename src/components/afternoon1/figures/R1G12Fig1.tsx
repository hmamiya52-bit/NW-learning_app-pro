import { Cap, FigSvg, Ring } from './primitives'
import R1G12Base from './R1G12Base'
import { layout } from './r1g12Layout'
import { MUTED } from './tokens'
import type { ExamFigureProps } from './tokens'

/**
 * 図1 現行の Web システム（抜粋）— R1 午後Ⅰ 問2
 *
 * 下絵は R1G12Base（図3 と共通）。原図は横一列なので、Web システムを下の段に置き、
 * 中は FW から下りた所の L2SW から左へ DNS サーバ・Web サーバ1 と並べた（IP アドレスは線の端の近く、FQDN は箱の下）。
 * 注記1・2 は文だけなので examFigures の note に置く。
 *
 * 解説を開いたときは、DNS と HTTPS だけを通している FW と、199.α.β.2（shop.asha.com）の Web サーバ1 に輪を付ける
 * （設問3(1)(2) の前提）。
 */

const L = layout(false)

export default function R1G12Fig1({ highlight = false }: ExamFigureProps) {
  return (
    <FigSvg w={340} h={212} title="図1 現行の Web システム（抜粋）">
      <R1G12Base
        underlay={
          highlight && (
            <g>
              <Ring {...L.fw} />
              <Ring {...L.web1} />
            </g>
          )
        }
      />

      {/* ── 凡例 ─────────────────────────────────────── */}
      <Cap x={6} y={206} text="L2SW：レイヤ2スイッチ" size={7} color={MUTED} />
      <Cap x={120} y={206} text="FW：ファイアウォール" size={7} color={MUTED} />
    </FigSvg>
  )
}
