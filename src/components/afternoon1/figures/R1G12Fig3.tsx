import { Callout, FigSvg, Ring, Route } from './primitives'
import R1G12Base from './R1G12Base'
import { layout } from './r1g12Layout'
import type { ExamFigureProps } from './tokens'

/**
 * 図3 構成変更後の Web システム（抜粋）— R1 午後Ⅰ 問2
 *
 * 下絵は R1G12Base（図1 と共通）。図1 の Web サーバ1 の所に LB（199.α.β.2、shop.asha.com）が入り、
 * その先の L2SW に Web サーバ1（192.168.1.1）〜 Web サーバ8（192.168.1.8）がつながる。
 * インターネットの上に T 社 WAF サービス（waf-asha.tsha.net）がある。凡例は原図に無い（図1 と同じ略語）。
 *
 * 解説を開いたときは、利用者 → WAF サービス → インターネット → FW → LB の道筋をなぞり（設問2(2)）、
 * LB と FW に輪を付ける（設問2(3)・3(1)）。
 */

const L = layout(true)
const MID = L.Y0 + 30

/** 利用者の Web ブラウザ → インターネット → T 社 WAF サービス（IP-w1） */
const TO_WAF: [number, number][] = [
  [25, MID],
  [66, MID],
  [106, MID],
  [106, 20],
  [106, 11],
]
/** T 社 WAF サービス → インターネット → FW → L2SW → LB（送信元は IP-w2） */
const TO_LB: [number, number][] = [
  [106, 11],
  [106, MID],
  [202, MID],
  [308, MID],
  [308, L.FT + 46],
  [290, L.FT + 50],
  [240, L.FT + 74],
  [220, L.FT + 74],
]

export default function R1G12Fig3({ highlight = false }: ExamFigureProps) {
  return (
    <FigSvg w={340} h={240} title="図3 構成変更後の Web システム（抜粋）">
      <R1G12Base
        changed
        underlay={
          highlight && (
            <g>
              <Ring {...L.fw} />
              <Ring {...L.lb} />
              <Route points={TO_WAF} />
              <Route points={TO_LB} />
            </g>
          )
        }
        overlay={highlight && <Callout x={220} y={L.Y0 + 38} w={82} lines={['LB に届く送信元は', 'すべて IP-w2']} />}
      />
    </FigSvg>
  )
}
