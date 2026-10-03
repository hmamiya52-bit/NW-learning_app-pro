import type { ReactNode } from 'react'
import { Box, Cap, Ell, Poly, SolidFrame, Wire } from './primitives'
import {
  AREA,
  BR,
  BR_X,
  BUS,
  E_LAN,
  ESHA,
  FLOOR_LINK,
  FW,
  HQ,
  HQ_LAN,
  INET,
  ROUTER,
  SIZE,
  SMALL,
  TEXT,
  VPC,
  VPCGW,
  VSRV,
  WAN,
  branch,
  lan,
} from './r3g12Layout'
import { FONT_SCALE, FRAME, LINE, MUTED, TONE } from './tokens'

/**
 * D 社のネットワーク（R3 午後Ⅰ 問2 の図1・図2 で共通の下絵）
 *
 * 図2 は図1 の下に E 社を足し、OSPF エリアの網掛け（原図の灰色）とフロア間接続の破線を重ねた図なので、
 * 下絵をここに1つだけ持ち、`merged` で切り替える。座標は r3g12Layout.ts。
 * 図2 では原図どおり、セグメントの記号 m・n とグローバル IP アドレスを描かず、仮想サーバを2枚重ねにし、
 * 本社のラベルを右上に置く。
 *
 * 色は役割だけで決めている。L2SW・L3SW・ルータ・FW は device、PC と仮想サーバは host、
 * 広域イーサ網・インターネット・G 社 VPC と VPC GW（G 社が提供する仮想的な IPsec VPN サーバ）は outside。
 * OSPF エリアの網掛けは役割の色ではないので、灰色の塗り（`AREA`）にして `data-role="area"` を付ける
 * （§5.4 の検査5 が、網掛けを機器の箱と取り違えないように）。
 *
 * 描く順番: 網掛け → 囲み → 線 → underlay（強調の経路・輪）→ ノード → 記号 → overlay（強調の文字）。
 */

const fs = SIZE * FONT_SCALE

/** 「…」（原図の PC の並びの省略） */
function Dots({ x, y }: { x: number; y: number }) {
  return <Cap x={x} y={y} text="…" anchor="middle" color={MUTED} />
}

/** セグメントの記号・アドレス */
function Label({
  x,
  y,
  text,
  anchor = 'start',
  size = SIZE,
}: {
  x: number
  y: number
  text: string
  anchor?: 'start' | 'middle' | 'end'
  size?: number
}) {
  return <Cap x={x} y={y} text={text} anchor={anchor} size={size} color={TEXT} />
}

/** 広域イーサ網（楕円の中に名前と、その右にセグメントの記号 g） */
function Wan() {
  const t = TONE.outside
  const y = WAN.cy + fs * 0.44
  return (
    <g>
      <ellipse cx={WAN.cx} cy={WAN.cy} rx={WAN.rx} ry={WAN.ry} fill={t.fill} stroke={t.stroke} strokeWidth={1.2} />
      <text x={WAN.cx - 14} y={y} textAnchor="middle" fontSize={fs} fontWeight={700} fill={t.text}>
        広域イーサ網
      </text>
      <text x={WAN.cx + 46} y={y} textAnchor="middle" fontSize={fs} fill={TEXT}>
        g
      </text>
    </g>
  )
}

/** 横長の L2SW（本社の L2SW7 は右にセグメントの記号 h） */
function Bar({ x, y, w, h, name, seg }: { x: number; y: number; w: number; h: number; name: string; seg?: string }) {
  const t = TONE.device
  const ty = y + h / 2 + fs * 0.44
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={2} fill={t.fill} stroke={t.stroke} strokeWidth={1.2} />
      <text x={x + w / 2} y={ty} textAnchor="middle" fontSize={fs} fontWeight={700} fill={t.text}>
        {name}
      </text>
      {seg && (
        <text x={x + w / 2 + 40} y={ty} textAnchor="middle" fontSize={fs} fill={TEXT}>
          {seg}
        </text>
      )}
    </g>
  )
}

/** G 社 VPC の雲（角の丸い枠。左上に名前） */
function Cloud() {
  const t = TONE.outside
  return (
    <g>
      <rect x={VPC.x} y={VPC.y} width={VPC.w} height={VPC.h} rx={16} fill={t.fill} stroke={t.stroke} strokeWidth={1.2} />
      <text x={VPC.x + 6} y={VPC.y + 18} fontSize={fs} fill={t.text}>
        G社VPC
      </text>
    </g>
  )
}

/** 仮想セグメント（横線と、原図の黒い四角。幅の広い四角が VPC GW と仮想サーバのつなぎ目） */
function Bus() {
  return (
    <g>
      <line x1={BUS.x1} y1={BUS.y} x2={BUS.x2} y2={BUS.y} stroke={FRAME} strokeWidth={1.6} />
      {[BUS.x1, BUS.x2].map((x) => (
        <rect key={x} x={x - 2.5} y={BUS.y - 2.5} width={5} height={5} fill={FRAME} />
      ))}
      {[BUS.gw, BUS.srv].map((x) => (
        <rect key={x} x={x - 4.5} y={BUS.y - 2.5} width={9} height={5} fill={FRAME} />
      ))}
    </g>
  )
}

/** 本社・E 社の LAN の線（横長の L2SW から L3SW 2台、L2SW 4台、PC へ） */
function LanWires({ y0, wide }: { y0: number; wide: boolean }) {
  const L = lan(y0, wide)
  const top = L.sw[0].y
  return (
    <g>
      <Wire x1={100} y1={y0 + 18} x2={100} y2={y0 + 32} />
      <Wire x1={258} y1={y0 + 18} x2={258} y2={y0 + 32} />
      <Wire x1={90} y1={y0 + 50} x2={70} y2={top} />
      <Wire x1={110} y1={y0 + 50} x2={130} y2={top} />
      <Wire x1={248} y1={y0 + 50} x2={229} y2={top} />
      <Wire x1={268} y1={y0 + 50} x2={289} y2={top} />
      {L.cx.map((c) => (
        <Wire key={c} x1={c} y1={top + 18} x2={c} y2={top + 28} />
      ))}
    </g>
  )
}

/** 本社・E 社の LAN の箱 */
function LanNodes({ y0, wide, names }: { y0: number; wide: boolean; names: string[] }) {
  const L = lan(y0, wide)
  return (
    <g>
      <Bar {...L.bar} name={names[0]} seg={wide ? undefined : 'h'} />
      <Box {...L.l3[0]} tone="device" lines={[names[1]]} size={SIZE} />
      <Box {...L.l3[1]} tone="device" lines={[names[2]]} size={SIZE} />
      {L.sw.map((s, i) => (
        <Box key={i} {...s} tone="device" lines={[names[3 + i]]} size={SIZE} />
      ))}
      {L.pc.map((p, i) => (
        <Box key={i} {...p} tone="host" lines={['PC']} size={SIZE} />
      ))}
      <Dots x={100} y={L.pc[0].y + 13} />
      <Dots x={259} y={L.pc[0].y + 13} />
    </g>
  )
}

export default function R3G12Base({
  merged = false,
  underlay,
  overlay,
}: {
  /** 図2（統合後）。E 社・OSPF エリアの網掛け・フロア間接続を足し、m・n とアドレスを描かない */
  merged?: boolean
  /** 線とノードのあいだに差し込むもの（強調の経路・輪） */
  underlay?: ReactNode
  /** ノードの上に重ねるもの（強調の文字） */
  overlay?: ReactNode
}) {
  const HQ_H = merged ? 192 : 178
  return (
    <g>
      {/* ── OSPF エリアの網掛け（図2 だけ。原図の灰色。いちばん先に敷く）── */}
      {merged && (
        <g data-role="area">
          {/* エリア1: 支社1〜3 の中と広域イーサ網のまわり（支社1 の下の左は除く） */}
          <polygon points="6,24 334,24 334,112 240,112 240,173 30,173 30,112 6,112" fill={AREA} />
          {/* エリア1: 広域イーサ網からルータへの線 */}
          <line x1={WAN.cx} y1={WAN.cy + 10} x2={WAN.cx} y2={ROUTER.y} stroke={AREA} strokeWidth={10} />
          {/* エリア0: 本社と E 社の LAN、フロア間接続の新規サブネット */}
          <rect x={34} y={HQ_LAN - 8} width={300} height={144} fill={AREA} />
          <rect x={34} y={E_LAN - 8} width={300} height={144} fill={AREA} />
          <polyline
            points={FLOOR_LINK.map(([x, y]) => `${x},${y}`).join(' ')}
            fill="none"
            stroke={AREA}
            strokeWidth={10}
            strokeLinejoin="round"
          />
        </g>
      )}

      {/* ── 囲み ───────────────────────────────────── */}
      {BR_X.map((x, i) => (
        <SolidFrame key={x} x={x} y={BR.y} w={BR.w} h={BR.h} label={`支社${i + 1}`} />
      ))}
      <SolidFrame x={HQ.x} y={HQ.y} w={HQ.w} h={HQ_H} label="本社" labelAnchor={merged ? 'end' : 'start'} />
      {merged && <SolidFrame {...ESHA} label="E社" />}
      <Cloud />

      {/* ── 線 ─────────────────────────────────────── */}
      {BR_X.map((x0) => (
        <g key={x0}>
          <Wire x1={x0 + 27} y1={44} x2={x0 + 27} y2={54} />
          <Wire x1={x0 + 79} y1={44} x2={x0 + 79} y2={54} />
          <Wire x1={x0 + 27} y1={72} x2={x0 + 45} y2={90} />
          <Wire x1={x0 + 79} y1={72} x2={x0 + 61} y2={90} />
        </g>
      ))}
      {/* L3SW1〜3 ── 広域イーサ網 ── ルータ */}
      <Wire x1={55} y1={108} x2={88} y2={130} />
      <Wire x1={170} y1={108} x2={160} y2={128} />
      <Wire x1={285} y1={108} x2={196} y2={132} />
      <Wire x1={WAN.cx} y1={WAN.cy + WAN.ry} x2={WAN.cx} y2={ROUTER.y} />
      {/* 仮想サーバ ── 仮想セグメント ── VPC GW ── インターネット ── FW */}
      <Wire x1={BUS.srv} y1={VSRV.y + VSRV.h} x2={BUS.srv} y2={BUS.y} />
      <Wire x1={BUS.gw} y1={BUS.y} x2={BUS.gw} y2={VPCGW.y} />
      <Wire x1={BUS.gw} y1={VPCGW.y + VPCGW.h} x2={BUS.gw} y2={INET.cy - INET.ry} />
      <Wire x1={BUS.gw} y1={INET.cy + INET.ry} x2={BUS.gw} y2={FW.y} />
      {/* ルータ・FW ── L2SW7 */}
      <Wire x1={WAN.cx} y1={ROUTER.y + ROUTER.h} x2={WAN.cx} y2={HQ_LAN} />
      <Wire x1={BUS.gw} y1={FW.y + FW.h} x2={BUS.gw} y2={HQ_LAN} />
      <LanWires y0={HQ_LAN} wide={false} />
      {merged && <LanWires y0={E_LAN} wide />}
      {/* フロア間接続（原図どおり破線） */}
      {merged && <Poly points={FLOOR_LINK} color={LINE} width={1.4} dash="4 3" />}

      {underlay}

      {/* ── ノード ───────────────────────────────────── */}
      {BR_X.map((x0, i) => {
        const B = branch(x0)
        return (
          <g key={x0}>
            {B.pc.map((p, k) => (
              <Box key={k} {...p} tone="host" lines={['PC']} size={SIZE} />
            ))}
            <Dots x={x0 + 53} y={B.pc[0].y + 13} />
            {B.sw.map((s, k) => (
              <Box key={k} {...s} tone="device" lines={[`L2SW${i * 2 + k + 1}`]} size={SIZE} />
            ))}
            <Box {...B.l3} tone="device" lines={[`L3SW${i + 1}`]} size={SIZE} />
          </g>
        )
      })}
      <Wan />
      <Bus />
      {merged && (
        <rect
          x={VSRV.x + 3}
          y={VSRV.y - 3}
          width={VSRV.w}
          height={VSRV.h}
          rx={2}
          fill={TONE.host.fill}
          stroke={TONE.host.stroke}
          strokeWidth={1.2}
        />
      )}
      <Box {...VSRV} tone="host" lines={['仮想', 'サーバ']} size={SIZE} />
      <Box {...VPCGW} tone="outside" lines={['VPC GW']} size={SIZE} />
      <Ell {...INET} tone="outside" lines={['インターネット']} size={SIZE} />
      <Box {...ROUTER} tone="device" lines={['ルータ']} size={SIZE} />
      <Box {...FW} tone="device" lines={['FW']} size={SIZE} />
      <LanNodes
        y0={HQ_LAN}
        wide={false}
        names={['L2SW7', 'L3SW4', 'L3SW5', 'L2SW8', 'L2SW9', 'L2SW10', 'L2SW11']}
      />
      {merged && (
        <LanNodes
          y0={E_LAN}
          wide
          names={['L2SW12', 'L3SW6', 'L3SW7', 'L2SW13', 'L2SW14', 'L2SW15', 'L2SW16']}
        />
      )}

      {/* ── 記号・アドレス・エリアの名前 ──────────────── */}
      {BR_X.map((x0, i) => (
        <g key={x0}>
          <Label x={x0 + 27} y={86} text={'ace'[i]} anchor="end" />
          <Label x={x0 + 79} y={86} text={'bdf'[i]} />
        </g>
      ))}
      <Label x={77} y={379} text="i" anchor="end" />
      <Label x={123} y={379} text="j" />
      <Label x={236} y={379} text="k" anchor="end" />
      <Label x={282} y={379} text="l" />
      <Cap x={BUS.x2} y={BUS.y + 12} text="仮想セグメント" anchor="end" size={SMALL} color={TEXT} />
      {!merged && (
        <g>
          <Label x={BUS.x1 + 10} y={BUS.y - 5} text="n" />
          <Label x={BUS.gw + 4} y={VPCGW.y + VPCGW.h + 11} text="x.y.z.1" size={SMALL} />
          <Label x={BUS.gw + 4} y={HQ.y - 8} text="m" />
          <Label x={BUS.gw + 4} y={HQ.y + 12} text="t.u.v.5" size={SMALL} />
        </g>
      )}
      {merged && (
        <g>
          <Label x={36} y={154} text="OSPF" size={SMALL} />
          <Label x={36} y={167} text="エリア1" size={SMALL} />
          <Label x={184} y={HQ.y + HQ_H - 8} text="OSPFエリア0" anchor="middle" size={SMALL} />
          <Label x={184} y={ESHA.y + ESHA.h - 8} text="OSPFエリア0" anchor="middle" size={SMALL} />
        </g>
      )}

      {overlay}
    </g>
  )
}
