import { Box, Callout, Cap, DashFrame, Ell, FigSvg, Poly, Ring, Route, SolidFrame, Wire } from './primitives'
import { MUTED, SEGMENT } from './tokens'
import type { ExamFigureProps } from './tokens'

/**
 * 図1 A 予備校の新ネットワーク構成（抜粋）— H26 午後Ⅰ 問1
 *
 * 原図は 支部1 ─ 広域イーサ網 ─ 本部 を横一列に並べ、支部2〜5 を下に置く。
 * 375px では横に入らないので、上から 本部 → 広域イーサ網 → 支部2〜5 → 支部1 の縦並びにした。
 * 支部1 は右の設問が参照する詳細な拠点なので最後に大きく置き、
 * 広域イーサ網への2本は図の左右の余白を通してある（支部2〜5 の枠を横切らないため）。
 * ノード・リンク・ポート ID・コスト値・セグメントのアドレスは原図どおり。
 *
 * 原図は 業務系 L2SW と 動画系 L2SW が2台のルータそれぞれに交差して接続する形（X 字）。
 * ここでは同じ接続を「まっすぐ1本＋斜め1本」に描き分けている（本数・相手は原図どおり）。
 *
 * 色は役割だけで決めている。ルータ・L2SW・WAS は A 予備校の装置なので device、
 * FS・業務サーバ・動画サーバ・PC は host、広域イーサ網は通信事業者の網なので outside。
 *
 * 設問2(3)は「本部から支部1 への動画データの送信経路」を表1 で埋めさせるので、
 * 解説を開いたときは通常時の道筋（ルータ2 → 広域イーサ網2 → ルータ4）を赤くなぞる。
 */

/** 通常時の動画データ: 動画サーバ → L2SW → ルータ2 → 広域イーサ網2 → ルータ4 → L2SW → PC */
const VIDEO_FLOW: [number, number][] = [
  [204, 54],
  [204, 62],
  [242, 72],
  [252, 88],
  [252, 130],
  [252, 148],
  [252, 191],
  [290, 206],
  [331, 206],
  [331, 365],
  [274, 365],
  [252, 374],
  [252, 446],
  [252, 462],
  [256, 470],
  [256, 477],
]

/** 支部2〜5。枠の左端 x と、業務系／動画系セグメントのアドレス */
const BRANCHES = [
  { x: 28, name: '支部2', biz: '10.2.1.0/24', mov: '10.2.2.0/24', w1: 72, w2: 216 },
  { x: 104, name: '支部3', biz: '10.3.1.0/24', mov: '10.3.2.0/24', w1: 96, w2: 232 },
  { x: 180, name: '支部4', biz: '10.4.1.0/24', mov: '10.4.2.0/24', w1: 120, w2: 250 },
  { x: 256, name: '支部5', biz: '10.5.1.0/24', mov: '10.5.2.0/24', w1: 140, w2: 280 },
]

export default function H26G11Fig1({ highlight = false }: ExamFigureProps) {
  return (
    <FigSvg w={340} h={542} title="図1 A 予備校の新ネットワーク構成（抜粋）">
      {/* ── 囲み ───────────────────────────────────── */}
      <SolidFrame x={6} y={6} w={328} h={166} label="本部" />
      <DashFrame x={10} y={24} w={152} h={70} color={SEGMENT} />
      <DashFrame x={172} y={24} w={158} h={70} color={SEGMENT} />
      <SolidFrame x={26} y={338} w={288} h={158} label="支部1" />
      <DashFrame x={30} y={412} w={150} h={76} color={SEGMENT} />
      <DashFrame x={188} y={412} w={122} h={76} color={SEGMENT} />
      {BRANCHES.map((b) => (
        <g key={b.name}>
          <SolidFrame x={b.x} y={266} w={70} h={66} />
          <DashFrame x={b.x + 4} y={280} w={62} h={23} color={SEGMENT} />
          <DashFrame x={b.x + 4} y={306} w={62} h={23} color={SEGMENT} />
        </g>
      ))}

      {/* ── 線 ─────────────────────────────────────── */}
      {/* 本部内 */}
      <Wire x1={35} y1={62} x2={70} y2={72} />
      <Wire x1={82} y1={62} x2={78} y2={72} />
      <Wire x1={204} y1={62} x2={242} y2={72} />
      <Wire x1={268} y1={62} x2={262} y2={72} />
      <Wire x1={80} y1={88} x2={80} y2={130} />
      <Wire x1={96} y1={88} x2={240} y2={130} />
      <Wire x1={252} y1={88} x2={252} y2={130} />
      <Wire x1={236} y1={88} x2={96} y2={130} />
      <Wire x1={88} y1={117} x2={88} y2={130} />
      <Wire x1={112} y1={139} x2={228} y2={139} />
      <Wire x1={89} y1={148} x2={92} y2={191} />
      <Wire x1={251} y1={148} x2={252} y2={191} />
      {/* 支部2〜5 から広域イーサ網1・2 へ（各拠点から2本ずつ） */}
      {BRANCHES.map((b) => (
        <g key={`w-${b.name}`}>
          <Wire x1={b.x + 20} y1={266} x2={b.w1} y2={221} />
          <Wire x1={b.x + 48} y1={266} x2={b.w2} y2={221} />
        </g>
      ))}
      {/* 支部1 から広域イーサ網1・2 へ（図の左右の余白を通す） */}
      <Poly
        points={[
          [66, 365],
          [16, 365],
          [16, 206],
          [38, 206],
        ]}
      />
      <Poly
        points={[
          [274, 365],
          [331, 365],
          [331, 206],
          [306, 206],
        ]}
      />
      {/* 支部1内 */}
      <Wire x1={112} y1={365} x2={228} y2={365} />
      <Wire x1={88} y1={374} x2={88} y2={392} />
      <Wire x1={80} y1={374} x2={90} y2={446} />
      <Wire x1={96} y1={374} x2={240} y2={446} />
      <Wire x1={252} y1={374} x2={252} y2={446} />
      <Wire x1={240} y1={374} x2={104} y2={446} />
      <Wire x1={88} y1={462} x2={58} y2={470} />
      <Wire x1={100} y1={462} x2={96} y2={470} />
      <Wire x1={240} y1={462} x2={212} y2={470} />
      <Wire x1={252} y1={462} x2={256} y2={470} />

      {/* ── 強調：通常時の動画データの道筋（ノードより先に描く）── */}
      {highlight && (
        <g>
          <Route points={VIDEO_FLOW} />
          <Ring x={228} y={130} w={46} h={18} />
          <Ring x={228} y={356} w={46} h={18} />
        </g>
      )}

      {/* ── ノード ───────────────────────────────────── */}
      {/* 本部 */}
      <Cap x={15} y={38} text="業務系セグメント" color={SEGMENT} bold />
      <Cap x={157} y={38} text="10.0.1.0/24" color={SEGMENT} anchor="end" size={7} />
      <Cap x={177} y={38} text="動画系セグメント" color={SEGMENT} bold />
      <Cap x={325} y={38} text="10.0.2.0/24" color={SEGMENT} anchor="end" size={7} />
      <Box x={18} y={46} w={34} h={17} tone="host" lines={['FS']} size={7.5} />
      <Box x={58} y={46} w={48} h={17} tone="host" lines={['業務サーバ']} size={6.5} />
      <Box x={60} y={72} w={42} h={16} tone="device" lines={['L2SW']} size={7} />
      <Box x={180} y={46} w={48} h={17} tone="host" lines={['動画サーバ']} size={6.5} />
      <Cap x={236} y={58} text="…" anchor="middle" color={MUTED} />
      <Box x={244} y={46} w={48} h={17} tone="host" lines={['動画サーバ']} size={6.5} />
      <Box x={232} y={72} w={42} h={16} tone="device" lines={['L2SW']} size={7} />
      <Box x={68} y={102} w={40} h={16} tone="device" lines={['WAS']} size={7} />
      <Box x={66} y={130} w={46} h={18} tone="device" lines={['ルータ1']} size={7} />
      <Box x={228} y={130} w={46} h={18} tone="device" lines={['ルータ2']} size={7} />
      <Cap x={92} y={128} text="p1" color={MUTED} size={6} />
      <Cap x={116} y={136} text="p3" color={MUTED} size={6} />
      <Cap x={224} y={136} text="p4" anchor="end" color={MUTED} size={6} />
      <Cap x={170} y={152} text="cost 10" anchor="middle" color={MUTED} size={6.5} />
      <Cap x={84} y={164} text="p2" anchor="end" color={MUTED} size={6} />
      <Cap x={256} y={164} text="p5" color={MUTED} size={6} />

      {/* 広域イーサ網 */}
      <Cap x={130} y={186} text="cost 20" anchor="end" color={MUTED} size={6.5} />
      <Cap x={290} y={186} text="cost 20" anchor="end" color={MUTED} size={6.5} />
      <Ell cx={92} cy={206} rx={54} ry={15} tone="outside" lines={['広域イーサ網1']} size={7.5} />
      <Ell cx={252} cy={206} rx={54} ry={15} tone="outside" lines={['広域イーサ網2']} size={7.5} />

      {/* 支部2〜5 */}
      {BRANCHES.map((b) => (
        <g key={`n-${b.name}`}>
          <Cap x={b.x + 4} y={277} text={b.name} color={MUTED} bold size={7} />
          <Cap x={b.x + 8} y={289} text="業務系セグメント" color={SEGMENT} size={5.5} />
          <Cap x={b.x + 8} y={299} text={b.biz} color={SEGMENT} size={5.5} />
          <Cap x={b.x + 8} y={315} text="動画系セグメント" color={SEGMENT} size={5.5} />
          <Cap x={b.x + 8} y={325} text={b.mov} color={SEGMENT} size={5.5} />
        </g>
      ))}

      {/* 支部1 */}
      <Box x={66} y={356} w={46} h={18} tone="device" lines={['ルータ3']} size={7} />
      <Box x={228} y={356} w={46} h={18} tone="device" lines={['ルータ4']} size={7} />
      <Cap x={62} y={382} text="p7" anchor="end" color={MUTED} size={6} />
      <Cap x={278} y={352} text="p10" color={MUTED} size={6} />
      <Cap x={116} y={362} text="p8" color={MUTED} size={6} />
      <Cap x={224} y={362} text="p9" anchor="end" color={MUTED} size={6} />
      <Cap x={170} y={378} text="cost 10" anchor="middle" color={MUTED} size={6.5} />
      <Box x={68} y={392} w={40} h={16} tone="device" lines={['WAS']} size={7} />
      <Cap x={92} y={390} text="p6" color={MUTED} size={6} />
      <Cap x={35} y={426} text="業務系セグメント" color={SEGMENT} bold />
      <Cap x={35} y={440} text="10.1.1.0/24" color={SEGMENT} size={7} />
      <Cap x={193} y={426} text="動画系セグメント" color={SEGMENT} bold />
      <Cap x={193} y={440} text="10.1.2.0/24" color={SEGMENT} size={7} />
      <Box x={76} y={446} w={42} h={16} tone="device" lines={['L2SW']} size={7} />
      <Box x={38} y={470} w={32} h={16} tone="host" lines={['PC']} size={7} />
      <Cap x={76} y={480} text="…" anchor="middle" color={MUTED} />
      <Box x={82} y={470} w={32} h={16} tone="host" lines={['PC']} size={7} />
      <Box x={228} y={446} w={42} h={16} tone="device" lines={['L2SW']} size={7} />
      <Box x={196} y={470} w={32} h={16} tone="host" lines={['PC']} size={7} />
      <Cap x={234} y={480} text="…" anchor="middle" color={MUTED} />
      <Box x={240} y={470} w={32} h={16} tone="host" lines={['PC']} size={7} />

      {/* ── 強調の文字（本部の L2SW とルータのあいだの空き帯に置く）── */}
      {highlight && (
        <Callout
          x={116}
          y={95}
          w={118}
          lines={['通常時の動画データは', 'ルータ2→ルータ4 を通る']}
          leader={[
            [234, 120],
            [240, 126],
          ]}
        />
      )}

      {/* ── 凡例 ─────────────────────────────────────── */}
      <Cap x={6} y={512} text="L2SW：レイヤ2スイッチ" color={MUTED} />
      <Cap x={128} y={512} text="WAS：WAN高速化装置" color={MUTED} />
      <Cap x={6} y={530} text="広域イーサ網：広域イーサネットサービス網" color={MUTED} />
    </FigSvg>
  )
}
