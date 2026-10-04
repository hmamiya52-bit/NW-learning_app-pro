import { Callout, Ring, Route } from './primitives'
import R5G11Base from './R5G11Base'
import { BUS, DC_X_FIG4, LINE_Y, VLB, VROUTER, dc } from './r5g11Layout'
import type { ExamFigureProps } from './tokens'

/**
 * 図4 新 Web システム構成（抜粋）— R5 午後Ⅰ 問1
 *
 * 原図は左に J 社クラウド、右に G 社データセンターを横に並べ、上の真ん中のインターネットから仮想 LB とルータへ線を引く
 * （縦横比 3.3:1）。この並びと、仮想ルータから L3SW への横一本の専用線は原図どおり残し、データセンターの中を詰めて右に寄せた
 * （中の形は図1 と同じ。r5g11Layout.ts の `dc`）。仮想セグメントの横の太線と黒い四角、Web サーバの「…」、
 * 仮想 LB が VPC セグメントの枠の上辺にまたがる描き方も原図どおり。
 *
 * 解説を開いたときは、L3SW から専用線を通って仮想ルータ、VPC セグメントへ向かう道筋をなぞり（表1 の L3SW の行。設問4(1)）、
 * L3SW・仮想ルータ・仮想 LB に輪を付ける。VPC セグメントのアドレスと、専用線の両端のアドレスを吹き出しで示す。
 */

const D = dc(DC_X_FIG4)

/** L3SW → 専用線 → 仮想ルータ → 仮想セグメント（VPC セグメント）。線の折れ点をなぞる */
const TO_VPC: [number, number][] = [
  [D.cx, LINE_Y],
  [VROUTER.x + VROUTER.w, LINE_Y],
  [VROUTER.x + 16, LINE_Y],
  [VROUTER.x + 16, BUS.y],
  [BUS.x1, BUS.y],
]

export default function R5G11Fig4({ highlight = false }: ExamFigureProps) {
  return (
    <R5G11Base
      cloud
      title="図4 新 Web システム構成（抜粋）"
      h={238}
      underlay={
        highlight && (
          <g>
            <Ring {...D.l3sw} />
            <Ring {...VROUTER} />
            <Ring {...VLB} />
            <Route points={TO_VPC} />
          </g>
        )
      }
      overlay={
        highlight && (
          <g>
            <Callout
              x={4}
              y={4}
              w={86}
              lines={['172.21.10.0/24']}
              leader={[
                [60, 22.8],
                [60, BUS.y],
              ]}
            />
            <Callout
              x={20}
              y={164}
              w={118}
              lines={['専用線 172.21.11.0/24', 'L3SW .1 ⇔ 仮想ルータ .2']}
              leader={[
                [138, 172],
                [180, LINE_Y],
              ]}
            />
          </g>
        )
      }
    />
  )
}
