import { Box, Cap, Ell, FigSvg, Poly, Ring, Route, Wire } from './primitives'
import { FONT_SCALE, FRAME, LINE, MUTED, SEGMENT } from './tokens'
import type { ExamFigureProps } from './tokens'

/**
 * 図1 U 校ネットワーク構成 — R7 午後Ⅰ 問2
 *
 * 原図の並び（上にインターネット、左にサーバ室、下の段に教室棟 1〜3 階、右に凡例）は保った。原図はサーバ室を左に寄せ、
 * 教室棟 3 つを右寄りに置いて、L3SW から3本の太線をすべて右下へ引く。340 の幅では教室棟 3 つで幅を使い切るので、
 * 教室棟を全幅に並べ、L3SW からの3本はいったん真下へ下ろしてサーバ室の下で各階へ振り分けた
 * （まっすぐ1階へ引くと、サーバ室のセグメントの中を横切るため）。
 *
 * 線の太さは原図の凡例どおり3種類（10GBASE-T・2.5GBASE-T・1000BASE-T）。動画サーバ—L2SW、L2SW—L3SW、L3SW—各階の L2SW が
 * 10GBASE-T、各階の L2SW—AP が 2.5GBASE-T、ほかが 1000BASE-T。AP と PC のあいだは原図どおり稲妻の線（無線 LAN）。
 *
 * 色は役割だけで決めている。L2SW・L3SW・ルータ・AP は device、認証・DHCP・syslog・動画の各サーバと PC は host、
 * インターネット・ISP・E サービスは outside。
 *
 * 解説を開いたときは、教室の PC から E サービスへの道（AP → L2SW → L3SW → ルータ → ISP）をなぞり、
 * 校内で完結する動画サーバと、DHCP リレーをする L3SW に輪を付ける。
 */

type Rect = { x: number; y: number; w: number; h: number }
type Pt = [number, number]

const SIZE = 7.5
const SMALL = 7
const TEXT = '#334155'
/** 線の太さ（原図の凡例の3種類） */
const W10G = 3.4
const W25G = 2.2
const W1G = 1.2

/** インターネット・ISP・E サービス（ISP は楕円の下の縁、E サービスは右の縁に掛かる） */
const INET = { cx: 164, cy: 21, rx: 84, ry: 19 }
const ISP = { cx: 164, cy: 40, rx: 18, ry: 9 }
const ESVC: Rect = { x: 230, y: 8, w: 48, h: 18 }

/** サーバ室（セグメントの中にサーバ4台と L2SW、外にルータと L3SW） */
const SR: Rect = { x: 2, y: 52, w: 186, h: 120 }
const SEG: Rect = { x: 6, y: 68, w: 134, h: 100 }
const SERVERS = ['認証サーバ', 'DHCP サーバ', 'syslog サーバ', '動画サーバ']
const SRV_X = 12
const SRV_W = 65
const srvY = (i: number) => 70 + 20 * i
const L2SW_S: Rect = { x: 100, y: 102, w: 36, h: 18 }
const RT: Rect = { x: 146, y: 74, w: 36, h: 18 }
const L3: Rect = { x: 146, y: 102, w: 36, h: 18 }

/** 教室棟（3つを全幅に並べる。中にセグメント、L2SW、AP の組、PC の組） */
const FLOOR_X = [2, 115, 228]
const FLOOR_Y = 198
const FLOOR_W = 109
const FLOOR_H = 135
const FLOOR_NET = ['192.168.10.0/24', '192.168.20.0/24', '192.168.30.0/24']
const floor = (i: number) => {
  const fx = FLOOR_X[i]
  const c = fx + 54.5
  return {
    frame: { x: fx, y: FLOOR_Y, w: FLOOR_W, h: FLOOR_H },
    seg: { x: fx + 11, y: 204, w: 87, h: 112 },
    c,
    sw: { x: c - 18, y: 210, w: 36, h: 18 },
    aps: [
      { x: c - 30, y: 242, w: 22, h: 18 },
      { x: c + 8, y: 242, w: 22, h: 18 },
    ],
    pcs: [
      { x: c - 29, y: 280, w: 20, h: 18 },
      { x: c + 9, y: 280, w: 20, h: 18 },
    ],
  }
}
const FLOORS = [0, 1, 2].map(floor)

/** L3SW から各階への 10GBASE-T（真下へ下ろしてから振り分ける） */
const DROP_X = [152, 164, 176]
const DROP_Y = 178
const floorLink = (i: number): Pt[] => [
  [DROP_X[i], L3.y + L3.h],
  [DROP_X[i], DROP_Y],
  [FLOORS[i].c, FLOORS[i].sw.y],
]

const mid = (r: Rect) => r.x + r.w / 2
const bottom = (r: Rect) => r.y + r.h

/** 稲妻の線（無線 LAN）。上から下へ、途中で1回折れる */
const bolt = (x: number, y1: number, y2: number): Pt[] => {
  const m = (y1 + y2) / 2
  return [
    [x + 2.5, y1],
    [x - 2, m + 1.5],
    [x + 2, m - 1.5],
    [x - 2.5, y2],
  ]
}

/** 名前を枠の内側の隅に置く囲み（名前は枠と同じ `<g>` に入れ、§5.4 の検査2 で余白を測れるようにする） */
function Frame({
  rect,
  label,
  at,
  dashed = false,
  size = SIZE,
}: {
  rect: Rect
  label: string
  at: 'tl' | 'bl'
  dashed?: boolean
  size?: number
}) {
  const { x, y, w, h } = rect
  const fs = size * FONT_SCALE
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        fill="none"
        stroke={dashed ? SEGMENT : FRAME}
        strokeWidth={dashed ? 1.1 : 1.3}
        strokeDasharray={dashed ? '5 3' : undefined}
      />
      <text x={x + 4} y={at === 'tl' ? y + 3.5 + fs : y + h - 6} fontSize={fs} fill={TEXT}>
        {label}
      </text>
    </g>
  )
}

/** 組のあいだの「⋯」 */
function Dots({ x, y }: { x: number; y: number }) {
  return <Cap x={x} y={y + 12} text="⋯" anchor="middle" size={SMALL} color={TEXT} />
}

export default function R7G12Fig1({ highlight = false }: ExamFigureProps) {
  const f2 = FLOORS[1]
  return (
    <FigSvg w={340} h={336} title="図1 U 校ネットワーク構成">
      {/* ── 囲み ───────────────────────────────────── */}
      <Frame rect={SR} label="サーバ室" at="tl" />
      <Frame rect={SEG} label="192.168.1.0/24" at="bl" dashed size={SMALL} />
      {FLOORS.map((f, i) => (
        <g key={i}>
          <Frame rect={f.frame} label={`教室棟 ${i + 1} 階`} at="bl" />
          <Frame rect={f.seg} label={FLOOR_NET[i]} at="bl" dashed size={SMALL} />
        </g>
      ))}

      {/* ── 線 ─────────────────────────────────────── */}
      <Wire x1={ISP.cx} y1={ISP.cy + ISP.ry} x2={mid(RT)} y2={RT.y} width={W1G} />
      <Wire x1={mid(RT)} y1={bottom(RT)} x2={mid(L3)} y2={L3.y} width={W1G} />
      <Wire x1={L2SW_S.x + L2SW_S.w} y1={L2SW_S.y + 9} x2={L3.x} y2={L3.y + 9} width={W10G} />
      {SERVERS.map((s, i) => (
        <Wire
          key={s}
          x1={SRV_X + SRV_W}
          y1={srvY(i) + 9}
          x2={L2SW_S.x}
          y2={L2SW_S.y + 4 + 3.3 * i}
          width={i === 3 ? W10G : W1G}
        />
      ))}
      {[0, 1, 2].map((i) => (
        <Poly key={i} points={floorLink(i)} width={W10G} />
      ))}
      {FLOORS.map((f, i) => (
        <g key={i}>
          {f.aps.map((ap, k) => (
            <Wire key={k} x1={f.c + (k === 0 ? -6 : 6)} y1={bottom(f.sw)} x2={mid(ap)} y2={ap.y} width={W25G} />
          ))}
          {f.aps.map((ap, k) => (
            <Poly key={`b${k}`} points={bolt(mid(ap), bottom(ap) + 3, f.pcs[k].y - 3)} />
          ))}
        </g>
      ))}

      {/* ── 強調：PC から E サービスへの道、動画サーバと L3SW の輪 ── */}
      {highlight && (
        <g>
          <Ring x={SRV_X} y={srvY(3)} w={SRV_W} h={18} />
          <Ring {...L3} />
          <Route
            points={[
              [mid(f2.pcs[0]), f2.pcs[0].y + 9],
              ...bolt(mid(f2.aps[0]), bottom(f2.aps[0]) + 3, f2.pcs[0].y - 3).reverse(),
              [mid(f2.aps[0]), f2.aps[0].y + 9],
              [mid(f2.aps[0]), f2.aps[0].y],
              [f2.c - 6, bottom(f2.sw)],
              [f2.c, f2.sw.y + 9],
              ...floorLink(1).reverse(),
              [mid(L3), L3.y + 9],
              [mid(RT), bottom(RT)],
              [mid(RT), RT.y],
              [ISP.cx, ISP.cy + ISP.ry],
              [ISP.cx, ISP.cy],
              [ESVC.x, INET.cy - 4],
              [mid(ESVC), ESVC.y + 9],
            ]}
          />
        </g>
      )}

      {/* ── ノード ───────────────────────────────────── */}
      <Ell {...INET} tone="outside" lines={['インターネット']} size={SIZE} />
      <Ell {...ISP} tone="outside" lines={['ISP']} size={SIZE} />
      <Box {...ESVC} tone="outside" lines={['E サービス']} size={SIZE} />
      {SERVERS.map((s, i) => (
        <Box key={s} x={SRV_X} y={srvY(i)} w={SRV_W} h={18} tone="host" lines={[s]} size={SIZE} />
      ))}
      <Box {...L2SW_S} tone="device" lines={['L2SW']} size={SIZE} />
      <Box {...RT} tone="device" lines={['ルータ']} size={SIZE} />
      <Box {...L3} tone="device" lines={['L3SW']} size={SIZE} />
      {FLOORS.map((f, i) => (
        <g key={i}>
          <Box {...f.sw} tone="device" lines={['L2SW']} size={SIZE} />
          {f.aps.map((ap) => (
            <Box key={ap.x} {...ap} tone="device" lines={['AP']} size={SIZE} />
          ))}
          <Dots x={f.c} y={f.aps[0].y} />
          {f.pcs.map((pc) => (
            <Box key={pc.x} {...pc} tone="host" lines={['PC']} size={SIZE} />
          ))}
          <Dots x={f.c} y={f.pcs[0].y} />
        </g>
      ))}

      {/* ── 凡例（原図どおりサーバ室の右） ─────────────── */}
      <Cap x={206} y={64} text="ISP：インターネットサービスプロバイダ" size={SMALL} color={MUTED} />
      <Cap x={206} y={76} text="L2SW：レイヤー2スイッチ" size={SMALL} color={MUTED} />
      <Cap x={206} y={88} text="L3SW：レイヤー3スイッチ" size={SMALL} color={MUTED} />
      <Cap x={206} y={100} text="AP：無線 LAN アクセスポイント" size={SMALL} color={MUTED} />
      <Wire x1={206} y1={109.5} x2={224} y2={109.5} width={W10G} color={LINE} />
      <Cap x={226} y={112} text="：10GBASE-T" size={SMALL} color={MUTED} />
      <Wire x1={206} y1={121.5} x2={224} y2={121.5} width={W25G} color={LINE} />
      <Cap x={226} y={124} text="：2.5GBASE-T" size={SMALL} color={MUTED} />
      <Wire x1={206} y1={133.5} x2={224} y2={133.5} width={W1G} color={LINE} />
      <Cap x={226} y={136} text="：1000BASE-T" size={SMALL} color={MUTED} />
      <Poly
        points={[
          [206, 145.5],
          [212, 145.5],
          [214, 142],
          [216, 149],
          [218, 145.5],
          [224, 145.5],
        ]}
      />
      <Cap x={226} y={148} text="：無線 LAN" size={SMALL} color={MUTED} />
      <rect x={207} y={153.5} width={16} height={8} fill="none" stroke={SEGMENT} strokeWidth={1.1} strokeDasharray="3 2" />
      <Cap x={226} y={160} text="：セグメント" size={SMALL} color={MUTED} />
    </FigSvg>
  )
}
