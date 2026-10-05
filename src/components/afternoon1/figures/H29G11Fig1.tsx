import { Box, Cap, Ell, FigSvg, Poly, Ring, Route, Wire } from './primitives'
import { FONT_SCALE, FRAME, MUTED, SEGMENT, TONE, useFigureId } from './tokens'
import type { ExamFigureProps, ToneName } from './tokens'
import { CUST_E, CUST_ROW_Y, INET, NET_W, NET_XS, custFrame, custLines } from './h29g11Layout'
import type { Rect } from './h29g11Layout'

/**
 * 図1 H 社の現行ネットワーク構成（抜粋）— H29 午後Ⅰ 問1
 *
 * 原図は左に顧客3社、右に H 社を並べる（縦横比 1.8:1）。H 社の下の段（3社の顧客システム構築ネットワークと開発 LAN）だけで
 * 340 の幅をほぼ使い切るので、インターネットと顧客3社を上の段に置き、H 社を下に全幅で置いた（`h29g11Layout.ts`）。
 * 顧客 E 社の中のルータ・FW・L2SW・PC の縦の列は、左へ 90 度回して横に並べた（インターネットからの線は左から入る）。
 * H 社の中（ルータ・FW・DMZ・SSL-VPN 装置・プロキシサーバ・内部 LAN の破線・L3SW・3社のネットワーク・開発 LAN）の並びは原図どおり。
 * サーバ機器の重ね書き（2枚）と、L3SW から2本ずつの線も原図どおり。網掛けの SSL-VPN 装置（追加予定）は斜線で残す。
 *
 * 色は役割だけで決めている。H 社のルータ・FW・L3SW・SSL-VPN 装置は device、サーバ機器・プロキシサーバ・PC は host、
 * インターネットと顧客のルータ・FW・L2SW（顧客の持ち物）は outside。
 *
 * 解説を開いたときは、開発 LAN の PC から L3SW を通って E 社の顧客システム構築ネットワークへ直接届く道筋をなぞり（問題1）、
 * SSL-VPN 装置に輪を付ける（設問3 ケ）。
 */

const SIZE = 7.5
const SMALL = 7
const TEXT = '#334155'
const HATCH = '#94a3b8'

/** H 社の枠と、中の機器 */
const HQ: Rect = { x: 2, y: 130, w: 336, h: 214 }
const ROUTER: Rect = { x: 34, y: 138, w: 32, h: 18 }
const FW: Rect = { x: 38, y: 178, w: 24, h: 18 }
const DMZ_Y = 168
const DMZ_X1 = 78
const DMZ_X2 = 334
const VPN: Rect = { x: 175, y: 188, w: 66, h: 18 }
const PROXY: Rect = { x: 276, y: 188, w: 40, h: 30 }
const L3: Rect = { x: 14, y: 216, w: 310, h: 18 }
/** 内部 LAN の破線（FW と SSL-VPN 装置が上の縁に乗り、プロキシサーバは外に出る） */
const LAN_TOP = 192
const LAN_STEP_X = 258
const LAN_STEP_Y = 224
const LAN_RIGHT = 332
const LAN_BOTTOM = 338
/** 3社の顧客システム構築ネットワーク（破線の囲み）とサーバ機器 */
const NET_Y = 242
const NET_H = 92
const SRV_W = 52
const SRV_H = 30
const SRV_DY = 16
const STEP = 4
/** 開発 LAN と PC */
const DEV: Rect = { x: 256, y: 250, w: 72, h: 30 }
const DEV_PC: Rect = { x: 278, y: 296, w: 28, h: 18 }

/** 顧客 E 社の横の列 */
const C_ROUTER: Rect = { x: 166, y: CUST_ROW_Y - 9, w: 32, h: 18 }
const C_FW: Rect = { x: 210, y: CUST_ROW_Y - 9, w: 24, h: 18 }
const C_L2: Rect = { x: 246, y: CUST_ROW_Y - 9, w: 36, h: 18 }
const C_PC: Rect = { x: 294, y: CUST_ROW_Y - 9, w: 22, h: 18 }

const mid = (r: Rect) => r.x + r.w / 2
const bottom = (r: Rect) => r.y + r.h

/** 名前を枠の内側に置く囲み（corner で左上・上の真ん中を選ぶ） */
function Frame({ rect, label, at, dashed = false, fill = 'none' }: { rect: Rect; label?: string; at: 'tl' | 'tc'; dashed?: boolean; fill?: string }) {
  const { x, y, w, h } = rect
  const fs = SIZE * FONT_SCALE
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        fill={fill}
        stroke={dashed ? SEGMENT : FRAME}
        strokeWidth={dashed ? 1.1 : 1.3}
        strokeDasharray={dashed ? '5 3' : undefined}
      />
      {label && (
        <text x={at === 'tl' ? x + 4 : x + w / 2} y={y + 3.5 + fs} textAnchor={at === 'tl' ? 'start' : 'middle'} fontSize={fs} fill={TEXT}>
          {label}
        </text>
      )}
    </g>
  )
}

/** 網掛けの箱（原図の追加予定の機器）。役割の色の上に斜線を重ね、その上に文字を置く */
function HatchBox({ rect, tone, lines, patternId }: { rect: Rect; tone: ToneName; lines: string[]; patternId: string }) {
  const { x, y, w, h } = rect
  const t = TONE[tone]
  const fs = SIZE * FONT_SCALE
  const lh = fs + 2.5
  const cx = x + w / 2
  const startY = y + h / 2 + fs * 0.44 - ((lines.length - 1) * lh) / 2
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={2} fill={t.fill} stroke={t.stroke} strokeWidth={1.6} />
      <rect x={x + 0.8} y={y + 0.8} width={w - 1.6} height={h - 1.6} rx={2} fill={`url(#${patternId})`} />
      <text x={cx} y={startY} textAnchor="middle" fontSize={fs} fontWeight={700} fill={t.text}>
        {lines.map((ln, i) => (
          <tspan key={i} x={cx} dy={i === 0 ? 0 : lh}>
            {ln}
          </tspan>
        ))}
      </text>
    </g>
  )
}

/** セグメントの線（原図の太い横線）と、機器がつながる所の黒い四角 */
function Bus({ x1, x2, y, taps }: { x1: number; x2: number; y: number; taps: number[] }) {
  return (
    <g>
      <Wire x1={x1} y1={y} x2={x2} y2={y} width={2} />
      {[x1, ...taps, x2].map((x) => (
        <rect key={x} x={x - 2.5} y={y - 2.5} width={5} height={5} fill={MUTED} />
      ))}
    </g>
  )
}

/** 角の丸い箱（開発 LAN）。1行目は太字の名前、2行目はアドレス */
function DevLan({ rect }: { rect: Rect }) {
  const { x, y, w, h } = rect
  const t = TONE.host
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={9} fill="#ffffff" stroke={t.stroke} strokeWidth={1.2} />
      <text x={x + w / 2} y={y + 12.5} textAnchor="middle" fontSize={SIZE * FONT_SCALE} fontWeight={700} fill={t.text}>
        開発LAN
      </text>
      <text x={x + w / 2} y={y + 24.5} textAnchor="middle" fontSize={SMALL * FONT_SCALE} fill={t.text}>
        172.16.10.0/24
      </text>
    </g>
  )
}

/** 3社の列の、手前のサーバ機器の箱 */
const srvFront = (nx: number): Rect => ({ x: nx + 8, y: NET_Y + SRV_DY, w: SRV_W, h: SRV_H })

const NETS = [
  { co: 'E', sub: '172.16.100.0/24' },
  { co: 'F', sub: '172.16.101.0/24' },
  { co: 'G', sub: '172.16.102.0/24' },
]

/** 開発 LAN の PC → 開発 LAN → L3SW → E 社のサーバ機器（今は直接届く道筋） */
const DIRECT: [number, number][] = [
  [mid(DEV_PC), DEV_PC.y + 4],
  [mid(DEV_PC), DEV.y],
  [300, bottom(L3)],
  [300, L3.y + 9],
  [NET_XS[0] + 30, L3.y + 9],
  [NET_XS[0] + 30, NET_Y + SRV_DY],
]

export default function H29G11Fig1({ highlight = false }: ExamFigureProps) {
  const hatch = useFigureId('h29g11-hatch')
  const lines = custLines(C_ROUTER.x)
  return (
    <FigSvg w={340} h={366} title="図1 H 社の現行ネットワーク構成（抜粋）">
      <defs>
        <pattern id={hatch} width={4} height={4} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1={0} y1={0} x2={0} y2={4} stroke={HATCH} strokeWidth={1} />
        </pattern>
      </defs>

      {/* ── 囲み ───────────────────────────────────── */}
      {/* 顧客3社（奥から描き、手前の枠を白で塗って重ねる） */}
      {[2, 1, 0].map((k) => (
        <Frame key={k} rect={custFrame(k)} label={`顧客${['E', 'F', 'G'][k]}社`} at="tl" fill="#ffffff" />
      ))}
      <Frame rect={HQ} label="H社" at="tc" />
      <Poly
        points={[
          [8, LAN_TOP],
          [LAN_STEP_X, LAN_TOP],
          [LAN_STEP_X, LAN_STEP_Y],
          [LAN_RIGHT, LAN_STEP_Y],
          [LAN_RIGHT, LAN_BOTTOM],
          [8, LAN_BOTTOM],
          [8, LAN_TOP],
        ]}
        color={SEGMENT}
        width={1.1}
        dash="5 3"
      />
      {NETS.map((n, i) => (
        <g key={n.co}>
          <rect x={NET_XS[i]} y={NET_Y} width={NET_W} height={NET_H} fill="none" stroke={SEGMENT} strokeWidth={1.1} strokeDasharray="4 2.5" />
          <text x={NET_XS[i] + NET_W / 2} y={NET_Y + NET_H - 20} textAnchor="middle" fontSize={SMALL * FONT_SCALE} fill={TEXT}>
            <tspan x={NET_XS[i] + NET_W / 2}>{`${n.co}社システム構築`}</tspan>
            <tspan x={NET_XS[i] + NET_W / 2} dy={13}>
              ネットワーク
            </tspan>
          </text>
        </g>
      ))}
      {/* サーバ機器の奥の1枚（線が手前の箱まで見えるよう、線より先に描く） */}
      {NETS.map((n, i) => {
        const f = srvFront(NET_XS[i])
        const t = TONE.host
        return <rect key={n.co} x={f.x + STEP} y={f.y - STEP} width={f.w} height={f.h} rx={2} fill={t.fill} stroke={t.stroke} strokeWidth={1.2} />
      })}

      {/* ── 線 ─────────────────────────────────────── */}
      {lines.map((pts, i) => (
        <Poly key={i} points={pts} />
      ))}
      <Wire x1={mid(C_ROUTER) + C_ROUTER.w / 2} y1={CUST_ROW_Y} x2={C_FW.x} y2={CUST_ROW_Y} />
      <Wire x1={C_FW.x + C_FW.w} y1={CUST_ROW_Y} x2={C_L2.x} y2={CUST_ROW_Y} />
      <Wire x1={C_L2.x + C_L2.w} y1={CUST_ROW_Y} x2={C_PC.x} y2={CUST_ROW_Y} />
      <Wire x1={mid(ROUTER)} y1={INET.cy + INET.ry - 1} x2={mid(ROUTER)} y2={ROUTER.y} />
      <Wire x1={mid(ROUTER)} y1={bottom(ROUTER)} x2={mid(FW)} y2={FW.y} />
      <Poly
        points={[
          [FW.x + FW.w, FW.y + 5],
          [94, FW.y + 5],
          [94, DMZ_Y],
        ]}
      />
      <Wire x1={208} y1={DMZ_Y} x2={208} y2={VPN.y} />
      <Wire x1={296} y1={DMZ_Y} x2={296} y2={PROXY.y} />
      <Wire x1={mid(FW)} y1={bottom(FW)} x2={mid(FW)} y2={L3.y} />
      <Wire x1={208} y1={bottom(VPN)} x2={208} y2={L3.y} />
      {NETS.map((n, i) => {
        const f = srvFront(NET_XS[i])
        return (
          <g key={n.co}>
            <Wire x1={f.x + 22} y1={bottom(L3)} x2={f.x + 22} y2={f.y} />
            <Wire x1={f.x + 32} y1={bottom(L3)} x2={f.x + 32} y2={f.y - STEP} />
          </g>
        )
      })}
      <Wire x1={300} y1={bottom(L3)} x2={mid(DEV)} y2={DEV.y} />
      <Wire x1={mid(DEV)} y1={bottom(DEV)} x2={mid(DEV_PC)} y2={DEV_PC.y} />

      {/* ── 強調：開発 LAN から顧客システム構築ネットワークへ直接届く道筋、SSL-VPN 装置 ── */}
      {highlight && (
        <g>
          <Ring {...VPN} />
          <Route points={DIRECT} />
        </g>
      )}

      {/* ── ノード ───────────────────────────────────── */}
      <Ell {...INET} tone="outside" lines={['インターネット']} size={SIZE} />
      <Box {...C_ROUTER} tone="outside" lines={['ルータ']} size={SIZE} />
      <Box {...C_FW} tone="outside" lines={['FW']} size={SIZE} />
      <Box {...C_L2} tone="outside" lines={['L2SW']} size={SIZE} />
      <Box {...C_PC} tone="host" lines={['PC']} size={SIZE} />
      <Box {...ROUTER} tone="device" lines={['ルータ']} size={SIZE} />
      <Box {...FW} tone="device" lines={['FW']} size={SIZE} />
      <Bus x1={DMZ_X1} x2={DMZ_X2} y={DMZ_Y} taps={[94, 208, 296]} />
      <HatchBox rect={VPN} tone="device" lines={['SSL-VPN装置']} patternId={hatch} />
      <Box {...PROXY} tone="host" lines={['プロキシ', 'サーバ']} size={SIZE} />
      <Box {...L3} tone="device" lines={['L3SW']} size={SIZE} />
      {NETS.map((n, i) => (
        <Box key={n.co} {...srvFront(NET_XS[i])} tone="host" lines={[`${n.co}社システム`, 'サーバ機器']} size={SIZE} />
      ))}
      <DevLan rect={DEV} />
      <Box {...DEV_PC} tone="host" lines={['PC']} size={SIZE} />

      {/* ── 札（アドレスとセグメントの名前） ─────────────────── */}
      <Cap x={124} y={CUST_ROW_Y + 12} text="199.x.1.5" size={SMALL} color={TEXT} />
      <Cap x={CUST_E.x + 4} y={CUST_E.y + CUST_E.h - 6} text="社内：192.168.0.0/16" size={SMALL} color={TEXT} />
      <Cap x={DMZ_X1} y={DMZ_Y - 5} text="DMZ" size={SMALL} color={TEXT} />
      <Cap x={106} y={DMZ_Y - 5} text="202.y.44.0/28" size={SMALL} color={TEXT} />
      <Cap x={205} y={VPN.y - 5} text="202.y.44.2" anchor="end" size={SMALL} color={TEXT} />
      <Cap x={293} y={PROXY.y - 5} text="202.y.44.1" anchor="end" size={SMALL} color={TEXT} />
      <Cap x={70} y={LAN_TOP + 14} text="内部LAN：172.16.0.0/16" size={SMALL} color={TEXT} />
      {NETS.map((n, i) => (
        <Cap key={n.co} x={NET_XS[i] + NET_W / 2} y={NET_Y + SRV_DY + SRV_H + 12} text={n.sub} anchor="middle" size={SMALL} color={TEXT} />
      ))}

      {/* ── 略語の説明（原図どおり図の下） ─────────────────── */}
      <Cap x={6} y={358} text="FW：ファイアウォール" size={SMALL} color={MUTED} />
      <Cap x={86} y={358} text="L2SW：レイヤ2スイッチ" size={SMALL} color={MUTED} />
      <Cap x={176} y={358} text="L3SW：レイヤ3スイッチ" size={SMALL} color={MUTED} />

    </FigSvg>
  )
}
