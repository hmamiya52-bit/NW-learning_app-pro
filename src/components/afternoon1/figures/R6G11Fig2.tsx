import { ArrowDefs, Box, Callout, Cap, DashFrame, Ell, FigSvg, Poly, RingEll, Route, Wire } from './primitives'
import { LOGICAL, MUTED, useFigureId } from './tokens'
import type { ExamFigureProps } from './tokens'

/**
 * 図2 BGP anycast 方式による E 社の経路広告イメージ — R6 午後Ⅰ 問1
 *
 * 実線＝装置どうしの接続（原図6本）、破線の双方向矢印＝BGP ピア（原図4本）。
 * BGP ピアは色相では区別せず、LOGICAL（接続線より濃い灰）＋破線＋両端の矢印で見分ける。
 *
 * 色は役割だけで決めている。AS-E は E 社（自社）なので device、
 * AS-F・AS-G・IX は他社なので outside、ゲーム端末は host。
 *
 * 設問2(2)は AS-E 東京 POP から AS-G への経路を AS Path 長で選ばせる設問なので、
 * 「東京 POP ↔ AS-G が IX 経由で直接ピアを張っている」ことと
 * 「東京 POP ↔ AS-F ↔ AS-G」の対比が読み取れる配置にしてある。
 * 解説を開いたときは、この2本を実線（選ばれる方）と薄い破線（選ばれない方）で描き分ける。
 *
 * 線はノードより先に描くので、線の端がノードに少し入り込んでも隠れる。
 */

export default function R6G11Fig2({ highlight = false }: ExamFigureProps) {
  const fid = useFigureId('r6g11f2')
  const peerArrow = `url(#${fid}-arrow-0)`

  return (
    <FigSvg w={340} h={250} title="図2 BGP anycast 方式による E 社の経路広告イメージ">
      <ArrowDefs figureId={fid} colors={[LOGICAL]} />

      {/* E社CDN（破線の囲み） */}
      <DashFrame x={4} y={16} w={126} h={170} label="E社CDN" />

      {/* ── 実線：装置どうしの接続 ───────────────────────── */}
      <Wire x1={110} y1={56} x2={200} y2={52} /> {/* シンガポールPOP ── AS-F */}
      <Wire x1={100} y1={124} x2={210} y2={64} /> {/* 東京POP ── AS-F */}
      <Wire x1={110} y1={142} x2={162} y2={158} /> {/* 東京POP ── IX */}
      <Wire x1={186} y1={160} x2={230} y2={148} /> {/* IX ── AS-G */}
      <Wire x1={246} y1={64} x2={256} y2={130} /> {/* AS-F ── AS-G */}
      <Wire x1={290} y1={152} x2={300} y2={210} /> {/* AS-G ── ゲーム端末 */}

      {/* ── 破線の双方向矢印：BGP ピア ───────────────────── */}
      {/* シンガポールPOP ↔ AS-F */}
      <Poly
        points={[
          [122, 36],
          [188, 32],
        ]}
        color={LOGICAL}
        dash="4 3"
        markerStart={peerArrow}
        markerEnd={peerArrow}
      />
      {/* 東京POP ↔ AS-F */}
      <Poly
        points={[
          [124, 133],
          [206, 78],
        ]}
        color={LOGICAL}
        dash="4 3"
        markerStart={peerArrow}
        markerEnd={peerArrow}
      />
      {/* AS-F ↔ AS-G */}
      <Poly
        points={[
          [276, 72],
          [262, 118],
        ]}
        color={LOGICAL}
        dash="4 3"
        markerStart={peerArrow}
        markerEnd={peerArrow}
      />
      {/* 東京POP ↔ AS-G（IX の下をくぐる） */}
      <Poly
        points={[
          [120, 158],
          [172, 190],
          [232, 166],
        ]}
        color={LOGICAL}
        dash="4 3"
        markerStart={peerArrow}
        markerEnd={peerArrow}
      />

      {/* ── 強調：東京POP から AS-G への2通りの経路（ノードより先に描く）── */}
      {highlight && (
        <g>
          {/* AS-F 経由（AS Path が長い方）は薄い破線 */}
          <Route
            points={[
              [100, 124],
              [210, 64],
              [246, 64],
              [256, 130],
            ]}
            dash="6 4"
            soft
          />
          {/* IX 経由（選ばれる方）は実線 */}
          <Route
            points={[
              [100, 140],
              [110, 142],
              [162, 158],
              [186, 160],
              [230, 148],
              [244, 146],
            ]}
          />
          <RingEll cx={67} cy={134} rx={52} ry={20} />
          <RingEll cx={266} cy={142} rx={48} ry={19} />
        </g>
      )}

      {/* ── ノード ───────────────────────────────────── */}
      <Ell cx={67} cy={56} rx={52} ry={20} tone="device" lines={['AS-E']} size={10} />
      <Cap x={67} y={86} text="シンガポールPOP" anchor="middle" />

      <Ell cx={67} cy={134} rx={52} ry={20} tone="device" lines={['AS-E']} size={10} />
      <Cap x={67} y={164} text="東京POP" anchor="middle" />

      <Cap x={232} y={22} text="トランジットISP" anchor="middle" />
      <Ell cx={232} cy={52} rx={48} ry={19} tone="outside" lines={['AS-F']} size={10} />

      <Cap x={300} y={114} text="ISP" anchor="middle" />
      <Ell cx={266} cy={142} rx={48} ry={19} tone="outside" lines={['AS-G']} size={10} />

      <Box x={152} y={148} w={40} h={22} tone="outside" lines={['IX']} size={10} />
      <Box x={268} y={210} w={66} h={24} tone="host" lines={['ゲーム端末']} size={9} />

      {/* ── 強調の文字（枠の下の空き帯に置く）── */}
      {highlight && (
        <Callout
          x={6}
          y={192}
          w={162}
          lines={['IX 経由：AS Path は AS-G の1つ', 'AS-F 経由：AS-F と AS-G の2つ']}
        />
      )}

      {/* ── 凡例 ─────────────────────────────────────── */}
      <Cap x={6} y={244} text="IX：Internet Exchange" color={MUTED} />
      <Poly
        points={[
          [150, 241],
          [186, 241],
        ]}
        color={LOGICAL}
        dash="4 3"
        markerStart={peerArrow}
        markerEnd={peerArrow}
      />
      <Cap x={192} y={244} text="：BGPピア" color={MUTED} />
    </FigSvg>
  )
}
