import { ArrowDefs, Box, Cap, Ell, FigSvg, Poly, SolidFrame, Wire } from './primitives'
import { FLOW, MUTED, useFigureId } from './tokens'

/**
 * 図3 E 社 POP の概要（抜粋）— R6 午後Ⅰ 問1
 *
 * 原図は LB → FW → ルータ → BGP ルータ → ISP → インターネットの横並びで、
 * そこに「DDoS 検知サーバ ── L2SW」の系統と、各 BGP ルータから DDoS 検知サーバへの
 * NetFlow（破線矢印）が重なる。375px では線が潰れるので、
 *   ・NetFlow の4本は上部のレーンに分けて通す（本数・向き・始点終点は原図どおり）
 *   ・インターネットは右端の縦長の雲にして4つの ISP を接する
 * という配置に組み直している。ノード・リンク・本数・向き・凡例は原図どおり。
 *
 * 設問3(1)は「インターネット → BGP ルータ1 → …→ LB11」の攻撃経路上で、
 * FW1 で止めるのと BGP ルータで止めるのとの違いを問うので、
 * BGP ルータ1 と LB11・FW1 の位置関係が読み取れることが要る。
 */

const BGP_Y = [100, 146, 192, 238] // BGPルータ1〜4 の箱の上端
const BGP_H = 32
const BGP_X = 192
const BGP_W = 48
const LB_LEFT = [108, 134, 160] // LB11/12/13
const LB_RIGHT = [210, 236, 262] // LB21/22/23

// NetFlow の折れ返し位置。4本が重ならないようにレーンを分ける
const FLOW_DROP_X = [184, 178, 172, 166] // BGPルータ側で下りる縦の位置
const FLOW_LANE_Y = [58, 68, 78, 88] // 左へ渡る横のレーン
const FLOW_RISE_X = [84, 66, 48, 30] // DDoS検知サーバへ上がる縦の位置

export default function R6G11Fig3() {
  const fid = useFigureId('r6g11f3')
  const flowArrow = `url(#${fid}-arrow-0)`

  const cy = (i: number) => BGP_Y[i] + BGP_H / 2

  return (
    <FigSvg w={340} h={338} title="図3 E 社 POP の概要（抜粋）">
      <ArrowDefs figureId={fid} colors={[FLOW]} />

      {/* E社POP */}
      <SolidFrame x={2} y={4} w={250} h={292} label="E社POP" />

      {/* ── 実線：装置どうしの接続 ───────────────────────── */}
      {/* DDoS検知サーバ ── L2SW */}
      <Wire x1={96} y1={36} x2={150} y2={35} />

      {/* L2SW ── 各BGPルータ */}
      {BGP_Y.map((y, i) => (
        <Wire key={`l2-${i}`} x1={172} y1={46} x2={BGP_X} y2={y + 8} />
      ))}

      {/* LB11〜13 ── FW1 ／ LB21〜23 ── FW2 */}
      {LB_LEFT.map((y, i) => (
        <Wire key={`lbl-${i}`} x1={50} y1={y + 10} x2={64} y2={138 + i * 6} />
      ))}
      {LB_RIGHT.map((y, i) => (
        <Wire key={`lbr-${i}`} x1={50} y1={y + 10} x2={64} y2={240 + i * 6} />
      ))}

      {/* FW ── ルータ */}
      <Wire x1={104} y1={150} x2={112} y2={188} />
      <Wire x1={104} y1={240} x2={112} y2={202} />

      {/* ルータ ── 各BGPルータ */}
      {BGP_Y.map((_, i) => (
        <Wire key={`rt-${i}`} x1={156} y1={195} x2={BGP_X} y2={cy(i)} />
      ))}

      {/* 各BGPルータ ── ISP（POPの外へ） */}
      {BGP_Y.map((_, i) => (
        <Wire key={`isp-${i}`} x1={BGP_X + BGP_W} y1={cy(i)} x2={254} y2={cy(i)} />
      ))}

      {/* ── 破線矢印：NetFlow パケットの送信方向（各BGPルータ → DDoS検知サーバ）── */}
      {BGP_Y.map((y, i) => (
        <Poly
          key={`nf-${i}`}
          points={[
            [BGP_X, y + 6],
            [FLOW_DROP_X[i], y + 6],
            [FLOW_DROP_X[i], FLOW_LANE_Y[i]],
            [FLOW_RISE_X[i], FLOW_LANE_Y[i]],
            [FLOW_RISE_X[i], 50],
          ]}
          color={FLOW}
          dash="4 3"
          markerEnd={flowArrow}
        />
      ))}

      {/* ── ノード ───────────────────────────────────── */}
      <Box x={8} y={24} w={88} h={24} tone="rose" lines={['DDoS検知サーバ']} size={8.5} />
      <Box x={150} y={24} w={44} h={22} tone="emerald" lines={['L2SW']} size={9} />

      {LB_LEFT.map((y, i) => (
        <Box key={`bl-${i}`} x={8} y={y} w={42} h={20} tone="blue" lines={[`LB1${i + 1}`]} size={8.5} />
      ))}
      <Box x={64} y={132} w={40} h={24} tone="rose" lines={['FW1']} size={9} />

      {LB_RIGHT.map((y, i) => (
        <Box key={`br-${i}`} x={8} y={y} w={42} h={20} tone="blue" lines={[`LB2${i + 1}`]} size={8.5} />
      ))}
      <Box x={64} y={234} w={40} h={24} tone="rose" lines={['FW2']} size={9} />

      <Box x={112} y={182} w={44} h={26} tone="sky" lines={['ルータ']} size={9} />

      {BGP_Y.map((y, i) => (
        <Box
          key={`bgp-${i}`}
          x={BGP_X}
          y={y}
          w={BGP_W}
          h={BGP_H}
          tone="violet"
          lines={['BGP', `ルータ${i + 1}`]}
          size={8.5}
        />
      ))}

      {/* インターネット（4つのISPが接する） */}
      <Ell
        cx={314}
        cy={185}
        rx={24}
        ry={100}
        tone="slate"
        lines={['インターネット']}
        size={9}
        rotate={-90}
      />
      {BGP_Y.map((_, i) => (
        <Ell
          key={`ispn-${i}`}
          cx={276}
          cy={cy(i)}
          rx={22}
          ry={13}
          tone="slate"
          lines={['ISP']}
          size={8.5}
        />
      ))}

      {/* ── 凡例 ─────────────────────────────────────── */}
      <Poly
        points={[
          [44, 314],
          [8, 314],
        ]}
        color={FLOW}
        dash="4 3"
        markerEnd={flowArrow}
      />
      <Cap x={50} y={317} text="：NetFlow パケットの送信方向" color={MUTED} />
      <Cap x={8} y={333} text="FW：ファイアウォール" color={MUTED} />
    </FigSvg>
  )
}
