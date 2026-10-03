import { Callout, Cap, FigSvg, Poly, Ring, Route } from './primitives'
import R3G12Base from './R3G12Base'
import { AREA, ROUTER, SMALL, branch } from './r3g12Layout'
import { LINE, MUTED } from './tokens'
import type { ExamFigureProps } from './tokens'

/**
 * 図2 F さんの考えた統合後のネットワーク構成 — R3 午後Ⅰ 問2
 *
 * 下絵は R3G12Base.tsx（図1 と共通。`merged` で E 社・OSPF エリアの網掛け・フロア間接続を足す）。
 * 原図は E 社と本社を下の段に横に並べるが、340 の幅に入らないので E 社を本社の下に置き、
 * フロア間接続の破線は支社1 の L3SW1 から左の端を下りて E 社の L3SW6 へ入る形にした（examFigures の note に明記）。
 * 注記1（破線）と注記2（網掛け）は見本の記号ごと SVG の中に置き、文だけの注記3 は note に置く。
 *
 * 解説を開いたときは、L3SW1 とルータ（フロア間 OSPF 追加設定と集約の設定をする2台。設問4(2)・(3)）に輪を付け、
 * エリア1 を通る仮想リンクの道筋を赤の破線でなぞる。本社の LAN には、フロア間を接続しただけでは
 * E 社から届かないこと（設問4(1)）を吹き出しで示す。
 */
export default function R3G12Fig2({ highlight = false }: ExamFigureProps) {
  const L3SW1 = branch(2).l3
  return (
    <FigSvg w={340} h={668} title="図2 F さんの考えた統合後のネットワーク構成">
      <R3G12Base
        merged
        underlay={
          highlight && (
            <g>
              <Route
                points={[
                  [55, 108],
                  [88, 130],
                  [132, 140],
                  [132, 153],
                  [132, 282],
                ]}
                dash="6 4"
              />
              <Ring {...L3SW1} />
              <Ring {...ROUTER} />
            </g>
          )
        }
        overlay={
          highlight && (
            <g>
              <Callout
                x={150}
                y={190}
                w={64}
                lines={['エリア1 を通る', '仮想リンク']}
                leader={[
                  [150, 205],
                  [134, 205],
                ]}
              />
              <Callout x={146} y={338} w={73} lines={['接続だけでは', 'E社から届かない']} />
            </g>
          )
        }
      />

      {/* ── 凡例（原図の注記1・2。見本の記号ごと） ──────────── */}
      <Cap x={4} y={646} text="注記1" size={SMALL} color={MUTED} />
      <Poly
        points={[
          [32, 643],
          [52, 643],
        ]}
        color={LINE}
        width={1.4}
        dash="4 3"
      />
      <Cap x={56} y={646} text="は，フロア間接続を示す。" size={SMALL} color={MUTED} />
      <Cap x={4} y={660} text="注記2" size={SMALL} color={MUTED} />
      <rect x={32} y={653} width={20} height={9} fill={AREA} />
      <Cap x={56} y={660} text="は，OSPF エリアを示す。" size={SMALL} color={MUTED} />
    </FigSvg>
  )
}
