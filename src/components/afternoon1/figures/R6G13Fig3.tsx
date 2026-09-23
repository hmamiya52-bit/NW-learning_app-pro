import { ArrowDefs, Callout, Cap, FigSvg, Poly, Ring, Route, RouteTag } from './primitives'
import R6G13Topology from './R6G13Topology'
import { A, LANE } from './r6g13Layout'
import { LOGICAL, MUTED, useFigureId } from './tokens'
import type { ExamFigureProps } from './tokens'

/**
 * 図3 各支社の PC から，C 社 SaaS 宛てとその他インターネット宛ての通信の流れ
 * — R6 午後Ⅰ 問3
 *
 * 下絵は図1 と同じ R6G13Topology。この図で足すのは
 *   ・大阪支社の UTM プロキシサーバ（UTM の機能なので破線の箱）
 *   ・C 社 SaaS 宛ての流れ（太い破線）… 支社の UTM プロキシサーバを通って直接インターネットへ
 *   ・その他インターネット宛ての流れ（細い破線）… 本社のプロキシサーバまで運んでから出る
 * の3つ。2本の流れの色は変えず、太さと破線の刻みで見分ける（凡例も原図どおり）。
 *
 * 設問2(4)・(5)はこの「直接出る／本社を通る」の対比が前提になるので、
 * 解説を開いたときは C 社 SaaS 宛ての流れを赤くなぞり、本社を通る側に吹き出しを付ける。
 */

/** C社SaaS 宛て：PC → L2SW → UTM → UTMプロキシサーバ → インターネット → C社SaaS */
const SAAS_FLOW: [number, number][] = [
  [144, 332],
  [130, 312],
  [135, 304],
  [200, 294],
  [213, 286],
  [168, 286],
  [116, 286],
  [116, 265],
  [LANE.saas, 265],
  [LANE.saas, 42],
]

/** その他インターネット宛て：PC → UTM → 本社UTM → プロキシサーバ → 本社UTM → インターネット */
const OTHER_FLOW: [number, number][] = [
  [98, 332],
  [114, 316],
  [135, 304],
  [200, 294],
  [213, 290],
  [236, 290],
  [LANE.other, 290],
  [LANE.other, 120],
  [236, 92],
  [213, 88],
  [190, 82],
  [122, 82],
  [122, 121],
  [132, 121],
  [132, 90],
  [213, 90],
  [213, 80],
  [220, 76],
  [220, 58],
  [284, 58],
  [284, 48],
]

/** 本社 UTM ── 支社 UTM の IPsec トンネル（図1 と同じ） */
const TUNNEL: [number, number][] = [
  [236, 80],
  [LANE.ipsec, 80],
  [LANE.ipsec, 278],
  [236, 278],
]

export default function R6G13Fig3({ highlight = false }: ExamFigureProps) {
  const fid = useFigureId('r6g13f3')
  const arrow = `url(#${fid}-arrow-0)`

  return (
    <FigSvg
      w={340}
      h={448}
      title="図3 各支社の PC から，C 社 SaaS 宛てとその他インターネット宛ての通信の流れ"
    >
      <ArrowDefs figureId={fid} colors={[LOGICAL]} />

      <R6G13Topology
        withUtmProxy
        flows={
          <g>
            <Poly points={TUNNEL} color={LOGICAL} width={3} />
            <Poly points={OTHER_FLOW} color={LOGICAL} width={1.3} dash="3 2.5" markerEnd={arrow} />
            <Poly points={SAAS_FLOW} color={LOGICAL} width={2.6} dash="7 4" markerEnd={arrow} />
          </g>
        }
        underlay={
          highlight ? (
            <g>
              <Route points={SAAS_FLOW} dash="7 4" />
              <Ring {...A.brProxy} rx={3} />
            </g>
          ) : undefined
        }
        overlay={
          highlight ? (
            <g>
              <RouteTag cx={230} cy={265} text="直接インターネットへ" />
              <Callout
                x={8}
                y={4}
                w={106}
                lines={['その他の通信は本社の', 'プロキシを通る']}
                leader={[
                  [114, 20],
                  [174, 20],
                  [174, 118],
                  [148, 121],
                ]}
              />
            </g>
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
        width={2.6}
        dash="7 4"
        markerEnd={arrow}
      />
      <Cap x={52} y={395} text="：C社SaaS 宛ての通信" color={MUTED} />
      <Poly
        points={[
          [8, 412],
          [44, 412],
        ]}
        color={LOGICAL}
        width={1.3}
        dash="3 2.5"
        markerEnd={arrow}
      />
      <Cap x={52} y={415} text="：その他インターネット宛ての通信" color={MUTED} />
      <Poly
        points={[
          [8, 432],
          [44, 432],
        ]}
        color={LOGICAL}
        width={3}
      />
      <Cap x={52} y={435} text="：IPsec トンネル" color={MUTED} />
    </FigSvg>
  )
}
