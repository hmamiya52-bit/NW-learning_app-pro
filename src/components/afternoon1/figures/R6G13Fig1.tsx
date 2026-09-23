import { Callout, Cap, FigSvg, Poly, Ring, Route } from './primitives'
import R6G13Topology from './R6G13Topology'
import { A, LANE } from './r6g13Layout'
import { LOGICAL, MUTED } from './tokens'
import type { ExamFigureProps } from './tokens'

/**
 * 図1 現在の A 社のネットワーク構成（抜粋）— R6 午後Ⅰ 問3
 *
 * 下絵は R6G13Topology（図3 と共通）。この図で足すのは本社 UTM と支社 UTM を結ぶ
 * IPsec トンネルと凡例だけ。
 *
 * 設問1(1)は「本社をハブ，各支社をスポークとする ア 型の VPN」を答えさせるので、
 * トンネルが本社に集まっている形が読み取れることが要る。
 * 解説を開いたときは、そのトンネルと両端の UTM を強調する。
 */

/** 本社 UTM ── 支社 UTM の IPsec トンネル（インターネットの中を通す） */
const TUNNEL: [number, number][] = [
  [236, 80],
  [LANE.ipsec, 80],
  [LANE.ipsec, 278],
  [236, 278],
]

export default function R6G13Fig1({ highlight = false }: ExamFigureProps) {
  return (
    <FigSvg w={340} h={444} title="図1 現在の A 社のネットワーク構成（抜粋）">
      <R6G13Topology
        flows={<Poly points={TUNNEL} color={LOGICAL} width={3} />}
        underlay={
          highlight ? (
            <g>
              <Route points={TUNNEL} />
              <Ring {...A.hqUtm} />
              <Ring {...A.brUtm} />
            </g>
          ) : undefined
        }
        overlay={
          highlight ? (
            <Callout
              x={8}
              y={4}
              w={106}
              lines={['ハブは本社の UTM', 'スポークは支社の UTM']}
              leader={[
                [114, 24],
                [200, 72],
              ]}
            />
          ) : undefined
        }
      />

      {/* ── 凡例 ─────────────────────────────────────── */}
      <Poly
        points={[
          [8, 392],
          [44, 392],
        ]}
        color={LOGICAL}
        width={3}
      />
      <Cap x={50} y={395} text="：IPsec トンネル" color={MUTED} />
      <Cap x={8} y={415} text="L2SW：レイヤー2スイッチ" color={MUTED} />
      <Cap x={140} y={415} text="L3SW：レイヤー3スイッチ" color={MUTED} />
      <Cap x={8} y={433} text="UTM：統合脅威管理装置" color={MUTED} />
    </FigSvg>
  )
}
