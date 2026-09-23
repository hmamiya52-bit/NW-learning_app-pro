import { Box, Callout, Cap, DashFrame, Ell, FigSvg, Ring, Route, SolidFrame, Wire } from './primitives'
import { MUTED, SEGMENT, TONE } from './tokens'
import type { ExamFigureProps } from './tokens'

/**
 * 図1 G 社の現行ネットワーク構成（抜粋）— R6 午後Ⅰ 問2
 *
 * 原図は4つの拠点を横一列に並べ、上に L 社 MPLS VPN の雲を置く。
 * 375px では横に入らないので、拠点を縦に積み、L 社 MPLS VPN を右の縦長の雲にして
 * PE1〜4 を各拠点と同じ高さに置いた。ノード・リンク・ラベル・凡例は原図どおり。
 *
 * 色は役割だけで決めている。PE は L 社（キャリア）の装置なので outside、
 * 拠点の装置は device、PC とサーバは host。
 *
 * 設問3(2)は「支店 V の L3SW3 に届いた LSA を生成した機器を図1中の機器名で答えよ」なので、
 * 各拠点の ルータN と L3SWN の対応が読み取れることが要る。
 * 解説を開いたときは、支店 V の PC からプロキシサーバまでの道筋をなぞり、
 * 「外に出るには必ずデータセンターを通る」ことと ルータ3 ⇔ PE3 の対向を示す。
 *
 * 描く順番: 囲み → 線 → 強調（経路・輪）→ ノード → 強調の文字。
 * 強調はノードより先なので、箱の中の文字を隠しようがない。
 */

/** 拠点（データセンター以外）。frame の上端 y と名前・機器番号 */
const SITES = [
  { label: '本社', y: 184, n: 2 },
  { label: '支店V', y: 258, n: 3 },
  { label: '支店W', y: 332, n: 4 },
]

/** PE の箱の上端 y（各拠点のルータと同じ高さに置く） */
const PE_Y = [88, 196, 270, 344]

export default function R6G12Fig1({ highlight = false }: ExamFigureProps) {
  return (
    <FigSvg w={340} h={470} title="図1 G 社の現行ネットワーク構成（抜粋）">
      {/* ── 囲み ───────────────────────────────────── */}
      {/* L社 MPLS VPN（右の縦長の雲） */}
      <rect
        x={250}
        y={70}
        width={84}
        height={314}
        rx={26}
        fill={TONE.outside.fill}
        stroke={TONE.outside.stroke}
        strokeWidth={1.2}
      />
      <SolidFrame x={6} y={30} w={234} h={140} label="データセンター" labelAnchor="end" />
      <DashFrame x={12} y={44} w={104} h={56} label="DMZ" color={SEGMENT} />
      <DashFrame x={28} y={108} w={118} h={54} color={SEGMENT} />
      {SITES.map((site) => (
        <g key={`fr-${site.n}`}>
          <SolidFrame x={6} y={site.y} w={234} h={64} label={site.label} />
          <DashFrame x={12} y={site.y + 18} w={104} h={40} color={SEGMENT} />
        </g>
      ))}

      {/* ── 線 ─────────────────────────────────────── */}
      {/* PE どうしの接続（雲の中） */}
      {[0, 1, 2].map((i) => (
        <Wire key={`pe-${i}`} x1={292} y1={PE_Y[i] + 20} x2={292} y2={PE_Y[i + 1]} />
      ))}
      {/* インターネット ── FW */}
      <Wire x1={140} y1={28} x2={175} y2={52} />
      {/* DMZ 内 */}
      <Wire x1={86} y1={61} x2={158} y2={60} />
      <Wire x1={65} y1={70} x2={53} y2={80} />
      {/* FW ── L3SW1 ── ルータ1 */}
      <Wire x1={175} y1={70} x2={175} y2={88} />
      <Wire x1={198} y1={97} x2={206} y2={97} />
      <Wire x1={175} y1={106} x2={145} y2={116} />
      {/* サーバのサブネット内 */}
      <Wire x1={78} y1={132} x2={64} y2={140} />
      <Wire x1={94} y1={132} x2={110} y2={140} />
      {/* ルータ1 ── PE1 */}
      <Wire x1={240} y1={97} x2={262} y2={98} />
      {/* 各拠点内 ── PE */}
      {SITES.map((site) => {
        const cy = site.y + 32
        return (
          <g key={`wi-${site.n}`}>
            <Wire x1={34} y1={cy + 9} x2={30} y2={cy + 16} />
            <Wire x1={46} y1={cy + 9} x2={62} y2={cy + 16} />
            <Wire x1={60} y1={cy} x2={126} y2={cy} />
            <Wire x1={172} y1={cy} x2={206} y2={cy} />
            <Wire x1={240} y1={cy} x2={262} y2={PE_Y[site.n - 1] + 10} />
          </g>
        )
      })}

      {/* ── 強調：支店V の PC からプロキシサーバまでの道筋 ── */}
      {highlight && (
        <g>
          <Route
            points={[
              [30, 313],
              [39, 290],
              [240, 290],
              [292, 280],
              [292, 98],
              [240, 97],
              [175, 97],
              [175, 61],
              [86, 61],
              [65, 70],
              [53, 80],
              [53, 88],
            ]}
          />
          <Ring x={206} y={281} w={34} h={18} />
          <Ring x={262} y={270} w={60} h={20} />
          <Ring x={20} y={80} w={66} h={18} />
        </g>
      )}

      {/* ── ノード（強調より後に描くので、中の文字は隠れない）── */}
      <Cap x={292} y={64} text="L社 MPLS VPN" anchor="middle" color={TONE.outside.text} bold />
      <Ell cx={140} cy={16} rx={54} ry={12} tone="outside" lines={['インターネット']} size={8} />
      <Box x={44} y={52} w={42} h={18} tone="device" lines={['L2SW']} size={7.5} />
      <Box x={20} y={80} w={66} h={18} tone="host" lines={['プロキシサーバ']} size={7} />
      <Box x={158} y={52} w={34} h={18} tone="device" lines={['FW']} size={7.5} />
      <Box x={152} y={88} w={46} h={18} tone="device" lines={['L3SW1']} size={7.5} />
      <Box x={206} y={88} w={34} h={18} tone="device" lines={['ルータ1']} size={7} />
      <Box x={66} y={114} w={40} h={18} tone="device" lines={['L2SW']} size={7.5} />
      <Box x={34} y={140} w={40} h={16} tone="host" lines={['サーバ']} size={7} />
      <Cap x={86} y={152} text="…" anchor="middle" color={MUTED} />
      <Box x={98} y={140} w={40} h={16} tone="host" lines={['サーバ']} size={7} />

      {SITES.map((site) => {
        const cy = site.y + 32
        return (
          <g key={`nd-${site.n}`}>
            <Box x={18} y={cy - 9} w={42} h={18} tone="device" lines={['L2SW']} size={7.5} />
            <Box x={16} y={cy + 14} w={28} h={16} tone="host" lines={['PC']} size={7} />
            <Cap x={52} y={cy + 26} text="…" anchor="middle" color={MUTED} />
            <Box x={60} y={cy + 14} w={28} h={16} tone="host" lines={['PC']} size={7} />
            <Box x={126} y={cy - 9} w={46} h={18} tone="device" lines={[`L3SW${site.n}`]} size={7.5} />
            <Box x={206} y={cy - 9} w={34} h={18} tone="device" lines={[`ルータ${site.n}`]} size={7} />
          </g>
        )
      })}

      {PE_Y.map((y, i) => (
        <Box key={`peb-${i}`} x={262} y={y} w={60} h={20} tone="outside" lines={[`PE${i + 1}`]} size={8} />
      ))}

      {/* ── 強調の文字（空いている場所にだけ置く）── */}
      {highlight && (
        <g>
          <Callout
            x={150}
            y={118}
            w={88}
            lines={['インターネットへ', '出るのはここだけ']}
            leader={[
              [150, 130],
              [88, 90],
            ]}
          />
        </g>
      )}

      {/* ── 凡例 ─────────────────────────────────────── */}
      <Cap x={6} y={416} text="FW：ファイアウォール" />
      <Cap x={140} y={416} text="L2SW：レイヤー2スイッチ" />
      <Cap x={6} y={432} text="L3SW：レイヤー3スイッチ" />
      <Cap x={140} y={432} text="PE：プロバイダエッジルータ" />
      <Cap x={6} y={448} text="MPLS VPN：MPLS VPN サービス網" />
      <rect
        x={176}
        y={438}
        width={20}
        height={12}
        fill="none"
        stroke={SEGMENT}
        strokeWidth={1.1}
        strokeDasharray="4 2.5"
      />
      <Cap x={200} y={448} text="：サブネット" />
    </FigSvg>
  )
}
