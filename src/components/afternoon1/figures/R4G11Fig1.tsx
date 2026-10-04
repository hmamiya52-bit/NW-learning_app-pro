import { Callout, Cap, FigSvg, Ring, Route } from './primitives'
import R4G11Base from './R4G11Base'
import { CTRL_SRV, LDAP, SMALL } from './r4g11Layout'
import { MUTED } from './tokens'
import type { ExamFigureProps } from './tokens'

/**
 * 図1 A 社ネットワークの構成（抜粋）— R4 午後Ⅰ 問1
 *
 * 下絵は R4G11Base（図2 と共通）。原図は工場（左）と事務所（右）の横並びで、事務所を上、工場を下に積んだ。
 * 略語の説明は原図では図の下に1行。375px に合わせて2行にした。
 *
 * 解説を開いたときは、DMZ の2台のサーバから FW を通って OA の L2SW へ進む道筋をなぞり（設問1(2)）、
 * LDAP サーバ（設問1(1)・設問2(1)）と、2つのセグメントにまたがる制御サーバに輪を付ける。
 */

/** DMZ の外部メールサーバ・プロキシサーバ → L2SW → FW → OA の L2SW */
const FROM_MAIL: [number, number][] = [
  [300, 58],
  [274, 58],
  [238, 58],
  [220, 58],
]
const FROM_PROXY: [number, number][] = [
  [293, 96],
  [274, 96],
  [238, 64],
  [220, 58],
]
const DMZ_TO_OA: [number, number][] = [
  [220, 58],
  [202, 58],
  [178, 58],
  [164, 58],
  [164, 67],
  [164, 136],
  [164, 145],
]

export default function R4G11Fig1({ highlight = false }: ExamFigureProps) {
  return (
    <FigSvg w={340} h={497} title="図1 A 社ネットワークの構成（抜粋）">
      <R4G11Base
        underlay={
          highlight && (
            <g>
              <Ring {...LDAP} />
              <Ring {...CTRL_SRV} />
              <Route points={FROM_MAIL} />
              <Route points={FROM_PROXY} />
              <Route points={DMZ_TO_OA} />
            </g>
          )
        }
        overlay={
          highlight && (
            <Callout
              x={58}
              y={86}
              w={88}
              lines={['OA へは FW を通る']}
              leader={[
                [146, 95],
                [164, 95],
              ]}
            />
          )
        }
      />

      {/* ── 略語の説明（原図どおり図の下） ─────────────── */}
      <Cap x={4} y={479} text="FW：ファイアウォール" size={SMALL} color={MUTED} />
      <Cap x={90} y={479} text="L2SW：レイヤ2スイッチ" size={SMALL} color={MUTED} />
      <Cap x={4} y={492} text="LDAP：Lightweight Directory Access Protocol" size={SMALL} color={MUTED} />
    </FigSvg>
  )
}
