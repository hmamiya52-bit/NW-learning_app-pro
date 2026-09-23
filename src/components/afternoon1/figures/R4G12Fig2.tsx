import { ArrowDefs, Box, Callout, Cap, Ell, FigSvg, Poly, Ring, Route, SolidFrame, Wire } from './primitives'
import { LOGICAL, MUTED, TONE, useFigureId } from './tokens'
import type { ExamFigureProps } from './tokens'

/**
 * 図2 R 主任が考えた新規ネットワーク構成と通信の流れ（抜粋）— R4 午後Ⅰ 問2
 *
 * 原図は上段に Q 社 SGW サービス・Q 社 PaaS・P 社営業支援サービスを横一列に並べるが、
 * 375px では入らないので Q 社 PaaS と P 社営業支援サービスを右に縦に重ねた。
 * 下段の3拠点（本社・営業所・テレワーク拠点）は原図どおり横並び。
 * ノード・流れ・点線（インターネットとの接続）・凡例は原図どおり。
 *
 * 色は役割だけで決めている。FW 機能も POP も Q 社の持ち物なので outside。
 * 図1 では N 社の FW が device（青）だったのが、ここでは他社側に移っていることが
 * 色の違いとして見える。
 *
 * 設問3(2)は「応答時間が現行より長くなる要因」を答えさせるので、
 * 解説を開いたときは PC から P 社営業支援サービスまでの道筋をなぞり、
 * Q 社 SGW を必ず通ることを示す。
 */

/** PC から Q 社 SGW の POP・FW 機能を経て P 社営業支援サービスまで */
const FLOW_TO_P: [number, number][] = [
  [72, 249],
  [72, 120],
  [32, 120],
  [32, 42],
  [120, 42],
  [120, 104],
  [300, 104],
  [300, 76],
]

/** 拠点（本社・営業所・テレワーク拠点）の枠の左端 */
const SITES = [
  { x: 6, label: '本社', device: true },
  { x: 118, label: '営業所', device: true },
  { x: 230, label: 'テレワーク拠点', device: false },
]

/** 通信の流れの始点（PC・TPC）の x */
const SRC_X = [72, 184, 288]

export default function R4G12Fig2({ highlight = false }: ExamFigureProps) {
  const fid = useFigureId('r4g12f2')
  const arrow = `url(#${fid}-arrow-0)`

  return (
    <FigSvg w={340} h={358} title="図2 R 主任が考えた新規ネットワーク構成と通信の流れ（抜粋）">
      <ArrowDefs figureId={fid} colors={[LOGICAL]} />

      {/* ── 囲み ───────────────────────────────────── */}
      <rect
        x={6}
        y={14}
        width={180}
        height={46}
        rx={10}
        fill="none"
        stroke={TONE.outside.stroke}
        strokeWidth={1.3}
      />
      <Cap x={10} y={26} text="Q社SGWサービス" color={TONE.outside.text} bold size={8} />
      {SITES.map((s) => (
        <SolidFrame key={s.label} x={s.x} y={186} w={104} h={92} label={s.label} />
      ))}

      {/* ── 線 ─────────────────────────────────────── */}
      <Wire x1={178} y1={40} x2={210} y2={32} /> {/* FW機能 ── Q社PaaS */}

      {/* 点線：インターネットとの接続 */}
      {[
        [90, 60, 90, 89],
        [150, 60, 150, 88],
        [240, 77, 240, 88],
        [90, 135, 90, 196],
        [200, 135, 200, 196],
        [302, 128, 302, 240],
      ].map(([x1, y1, x2, y2], i) => (
        <Wire key={`dot-${i}`} x1={x1} y1={y1} x2={x2} y2={y2} color={MUTED} width={1} dash="1.5 2.5" />
      ))}

      {/* 通信の流れ（太線。始点に丸、終点に矢印） */}
      {SRC_X.map((x, i) => (
        <Poly key={`src-${i}`} points={[[x, 249], [x, 120]]} color={LOGICAL} width={2.4} />
      ))}
      <Poly
        points={[
          [288, 120],
          [32, 120],
          [32, 42],
          [178, 42],
          [210, 32],
        ]}
        color={LOGICAL}
        width={2.4}
        markerEnd={arrow}
      />
      <Poly
        points={[
          [120, 52],
          [120, 104],
          [300, 104],
          [300, 76],
        ]}
        color={LOGICAL}
        width={2.4}
        markerEnd={arrow}
      />
      {SRC_X.map((x, i) => (
        <circle key={`dt-${i}`} cx={x} cy={249} r={2.6} fill={LOGICAL} />
      ))}

      {/* ── 強調：PC から P 社営業支援サービスまでの道筋 ── */}
      {highlight && (
        <g>
          <Route points={FLOW_TO_P} />
          <Ring x={62} y={32} w={116} h={20} />
        </g>
      )}

      {/* ── ノード ───────────────────────────────────── */}
      <Box x={14} y={32} w={42} h={20} tone="outside" lines={['POP']} size={7.5} />
      <Box x={62} y={32} w={116} h={20} tone="outside" lines={['FW機能']} size={7.5} />
      <Ell cx={262} cy={24} rx={58} ry={14} tone="outside" lines={['Q社PaaS']} size={8} />
      <Ell cx={262} cy={62} rx={72} ry={15} tone="outside" lines={['P社営業支援サービス']} size={7.5} />
      <Ell cx={170} cy={112} rx={164} ry={26} tone="outside" lines={['インターネット']} size={9} />

      <Box x={46} y={196} w={58} h={27} tone="device" lines={['新IPsec', 'ルータ']} size={7} />
      <Box x={158} y={196} w={58} h={27} tone="device" lines={['新IPsec', 'ルータ']} size={7} />
      <Box x={52} y={240} w={40} h={18} tone="host" lines={['PC']} size={7.5} />
      <Box x={164} y={240} w={40} h={18} tone="host" lines={['PC']} size={7.5} />
      <Box x={268} y={240} w={40} h={18} tone="host" lines={['TPC']} size={7.5} />

      {/* ── 強調の文字（インターネットと拠点のあいだの空き帯に置く）── */}
      {highlight && (
        <Callout
          x={96}
          y={146}
          w={102}
          lines={['Q 社 SGW を必ず通る', '経由が増えて遅くなる']}
        />
      )}

      {/* ── 凡例 ─────────────────────────────────────── */}
      <Cap x={6} y={296} text="TPC：従業員がテレワーク拠点で利用する PC" color={MUTED} size={8} />
      <Cap x={210} y={296} text="POP：Point of Presence" color={MUTED} size={8} />
      <circle cx={10} cy={314} r={2.6} fill={LOGICAL} />
      <Poly
        points={[
          [12, 314],
          [44, 314],
        ]}
        color={LOGICAL}
        width={2.4}
        markerEnd={arrow}
      />
      <Cap
        x={50}
        y={317}
        text="：PC 及び TPC から，Q 社 PaaS 及び P 社営業支援システムを"
        color={MUTED}
        size={8}
      />
      <Cap x={50} y={332} text="利用する際に発生する通信の流れ" color={MUTED} size={8} />
      <Wire x1={8} y1={347} x2={44} y2={347} color={MUTED} width={1} dash="1.5 2.5" />
      <Cap x={50} y={350} text="：インターネットとの接続" color={MUTED} size={8} />
    </FigSvg>
  )
}
