import { Callout, Cap, FigSvg, Ring, Route } from './primitives'
import R3G12Base from './R3G12Base'
import { FW, ROUTER, SMALL } from './r3g12Layout'
import { MUTED } from './tokens'
import type { ExamFigureProps } from './tokens'

/**
 * 図1 D 社の現行のネットワーク構成 — R3 午後Ⅰ 問2
 *
 * 下絵は R3G12Base.tsx（図2 と共通）。原図の上の段（支社1〜3 と G 社 VPC）は 340 の幅に入らないので、
 * G 社 VPC とインターネットを広域イーサ網の右に下ろした（examFigures の note に明記）。
 * 凡例の「L2SW：レイヤ2スイッチ」は原図どおり図の下に置き、文だけの注記1・2 は note に置く。
 *
 * 解説を開いたときは、ルータ（エリア境界ルータ。支社の経路を集約する。設問3(2)）と
 * FW（静的デフォルト経路を OSPF に流す。設問2）に輪を付け、ルータと FW の間の行き来（設問3(3)）を
 * L2SW7 を通る道筋と吹き出しで示す。
 */
export default function R3G12Fig1({ highlight = false }: ExamFigureProps) {
  return (
    <FigSvg w={340} h={460} title="図1 D 社の現行のネットワーク構成">
      <R3G12Base
        underlay={
          highlight && (
            <g>
              <Route
                points={[
                  [132, 300],
                  [132, 314],
                  [132, 323],
                  [275, 323],
                  [275, 314],
                  [275, 300],
                ]}
              />
              <Ring {...ROUTER} />
              <Ring {...FW} />
            </g>
          )
        }
        overlay={
          highlight && (
            <g>
              <Callout
                x={40}
                y={226}
                w={80}
                lines={['ここで /16 に集約']}
                leader={[
                  [100, 244.8],
                  [116, 279],
                ]}
              />
              <Callout x={154} y={282} w={99} lines={['宛先の無い通信が往復']} />
            </g>
          )
        }
      />
      <Cap x={4} y={454} text="L2SW：レイヤ2スイッチ" size={SMALL} color={MUTED} />
    </FigSvg>
  )
}
