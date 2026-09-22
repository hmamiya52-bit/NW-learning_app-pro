import { ArrowDefs, Box, Cap, DashFrame, Ell, FigSvg, Poly, Wire } from './primitives'
import { MUTED, PEER, useFigureId } from './tokens'

/**
 * 図2 BGP anycast 方式による E 社の経路広告イメージ — R6 午後Ⅰ 問1
 *
 * 実線＝装置どうしの接続（原図6本）、破線の双方向矢印＝BGP ピア（原図4本）。
 * BGP ピアだけ色を変えているのは、375px で実線と破線の区別が付きにくいため
 * （原図にある情報は落としていない。凡例も原図どおり）。
 *
 * 設問2(2)は AS-E 東京 POP から AS-G への経路を AS Path 長で選ばせる設問なので、
 * 「東京 POP ↔ AS-G が IX 経由で直接ピアを張っている」ことと
 * 「東京 POP ↔ AS-F ↔ AS-G」の対比が読み取れる配置にしてある。
 *
 * 線はノードより先に描くので、線の端がノードに少し入り込んでも隠れる。
 */

export default function R6G11Fig2() {
  const fid = useFigureId('r6g11f2')
  const peerArrow = `url(#${fid}-arrow-0)`

  return (
    <FigSvg w={340} h={250} title="図2 BGP anycast 方式による E 社の経路広告イメージ">
      <ArrowDefs figureId={fid} colors={[PEER]} />

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
        color={PEER}
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
        color={PEER}
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
        color={PEER}
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
        color={PEER}
        dash="4 3"
        markerStart={peerArrow}
        markerEnd={peerArrow}
      />

      {/* ── ノード ───────────────────────────────────── */}
      <Ell cx={67} cy={56} rx={52} ry={20} tone="violet" lines={['AS-E']} size={10} />
      <Cap x={67} y={86} text="シンガポールPOP" anchor="middle" />

      <Ell cx={67} cy={134} rx={52} ry={20} tone="violet" lines={['AS-E']} size={10} />
      <Cap x={67} y={164} text="東京POP" anchor="middle" />

      <Cap x={232} y={22} text="トランジットISP" anchor="middle" />
      <Ell cx={232} cy={52} rx={48} ry={19} tone="sky" lines={['AS-F']} size={10} />

      <Cap x={300} y={114} text="ISP" anchor="middle" />
      <Ell cx={266} cy={142} rx={48} ry={19} tone="emerald" lines={['AS-G']} size={10} />

      <Box x={152} y={148} w={40} h={22} tone="slate" lines={['IX']} size={10} />
      <Box x={268} y={210} w={66} h={24} tone="amber" lines={['ゲーム端末']} size={9} />

      {/* ── 凡例 ─────────────────────────────────────── */}
      <Cap x={6} y={244} text="IX：Internet Exchange" color={MUTED} />
      <Poly
        points={[
          [150, 241],
          [186, 241],
        ]}
        color={PEER}
        dash="4 3"
        markerStart={peerArrow}
        markerEnd={peerArrow}
      />
      <Cap x={192} y={244} text="：BGPピア" color={MUTED} />
    </FigSvg>
  )
}
