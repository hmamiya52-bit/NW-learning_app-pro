import { Box, Cap, Ell, FigSvg, Ring, Route, Wire, Callout } from './primitives'
import { FONT_SCALE, FRAME, MUTED, SEGMENT, TONE, useFigureId } from './tokens'
import type { ExamFigureProps } from './tokens'

/**
 * 図1 本社のネットワーク構成（抜粋）— R4 午後Ⅰ 問3
 *
 * 原図の並び（左の列に インターネット・ルータ・FW・L3SW、右上に DMZ、下に内部 LAN の PC セグメントとサーバセグメント）は
 * 340 の幅にほぼそのまま入るので、組み直していない。DMZ の枠だけ、3台のサーバの名前が入るよう左へ広げた。
 * 略語の説明は原図では1行。375px に合わせて2行にした。原図の注記（網掛けは今後導入予定の機器）は examFigures の note に置く。
 *
 * 色は役割だけで決めている。ルータ・FW・L2SW・L3SW は device、サーバ・DS・PC は host、インターネットは outside。
 * 網掛け（DS1・DS2）は色ではなく斜線で残す。
 *
 * 解説を開いたときは、PC から L3SW を通って社内 DNS サーバへ向かう道筋をなぞり（PC はゲートウェイと DNS サーバを知る必要がある。
 * 設問1(2)）、表1 の空欄に入る外部 DNS サーバ・プロキシサーバ・社内 DNS サーバに輪を付ける（設問1(3)）。
 */

const SIZE = 7.5
const SMALL = 7
const TEXT = '#334155'
const HATCH = '#94a3b8'

type Rect = { x: number; y: number; w: number; h: number }

const INET = { cx: 72, cy: 15, rx: 36, ry: 11 }
const HQ: Rect = { x: 2, y: 32, w: 336, h: 288 }
const ROUTER: Rect = { x: 56, y: 44, w: 32, h: 18 }
const FW: Rect = { x: 58, y: 86, w: 28, h: 18 }

/** DMZ と、その中の機器 */
const DMZ: Rect = { x: 128, y: 38, w: 206, h: 84 }
const WEB: Rect = { x: 146, y: 44, w: 50, h: 30 }
const PROXY: Rect = { x: 202, y: 44, w: 40, h: 30 }
const EXT_DNS: Rect = { x: 248, y: 44, w: 52, h: 30 }
const DMZ_SW: Rect = { x: 204, y: 86, w: 36, h: 18 }

/** 内部 LAN と、その中の2つのセグメント */
const LAN: Rect = { x: 6, y: 130, w: 328, h: 184 }
const L3SW: Rect = { x: 54, y: 160, w: 36, h: 18 }
const PC_SEG: Rect = { x: 10, y: 194, w: 150, h: 114 }
const PC_SW = [
  { x: 30, y: 204, w: 36, h: 18 },
  { x: 104, y: 204, w: 36, h: 18 },
]
const PCS = [16, 56, 90, 130]
const PC_Y = 240
const SRV_SEG: Rect = { x: 168, y: 146, w: 162, h: 162 }
const SRV_SW: Rect = { x: 176, y: 160, w: 36, h: 18 }
const DS1: Rect = { x: 236, y: 152, w: 30, h: 18 }
const DS2: Rect = { x: 280, y: 170, w: 30, h: 18 }
const BIZ: Rect = { x: 236, y: 184, w: 34, h: 30 }
const SALES: Rect = { x: 236, y: 220, w: 44, h: 30 }
const INT_DNS: Rect = { x: 236, y: 256, w: 52, h: 30 }

/** 名前を枠の内側の隅に置く囲み（本社・内部 LAN は左上、DMZ と2つのセグメントは右下。原図どおり） */
function Frame({ rect, label, corner, solid = false }: { rect: Rect; label: string; corner: 'tl' | 'br'; solid?: boolean }) {
  const { x, y, w, h } = rect
  const fs = SIZE * FONT_SCALE
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        fill="none"
        stroke={solid ? FRAME : SEGMENT}
        strokeWidth={solid ? 1.3 : 1.1}
        strokeDasharray={solid ? undefined : '5 3'}
      />
      <text
        x={corner === 'tl' ? x + 4.5 : x + w - 5}
        y={corner === 'tl' ? y + 4 + fs : y + h - 6}
        textAnchor={corner === 'tl' ? 'start' : 'end'}
        fontSize={fs}
        fill={TEXT}
      >
        {label}
      </text>
    </g>
  )
}

/** 網掛けの箱（原図の網掛け＝今後導入予定の DS）。役割の色の上に斜線を重ね、その上に文字を置く */
function HatchBox({ rect, label, patternId }: { rect: Rect; label: string; patternId: string }) {
  const { x, y, w, h } = rect
  const t = TONE.host
  const fs = SIZE * FONT_SCALE
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={2} fill={t.fill} stroke={t.stroke} strokeWidth={1.2} />
      <rect x={x + 0.6} y={y + 0.6} width={w - 1.2} height={h - 1.2} rx={2} fill={`url(#${patternId})`} />
      <text x={x + w / 2} y={y + h / 2 + fs * 0.44} textAnchor="middle" fontSize={fs} fontWeight={700} fill={t.text}>
        {label}
      </text>
    </g>
  )
}

/** 箱の左辺の真ん中 */
const left = (r: Rect): [number, number] => [r.x, r.y + r.h / 2]

/** PC → L2SW → L3SW → サーバセグメントの L2SW → 社内 DNS サーバ */
const TO_DNS: [number, number][] = [
  [28, 249],
  [28, 240],
  [40, 222],
  [48, 213],
  [48, 204],
  [64, 178],
  [72, 169],
  [90, 169],
  [176, 169],
  [194, 169],
  [194, 178],
  [236, 271],
  [262, 271],
]

export default function R4G13Fig1({ highlight = false }: ExamFigureProps) {
  const hatch = useFigureId('r4g13-hatch')
  return (
    <FigSvg w={340} h={352} title="図1 本社のネットワーク構成（抜粋）">
      <defs>
        <pattern id={hatch} width={4} height={4} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1={0} y1={0} x2={0} y2={4} stroke={HATCH} strokeWidth={1} />
        </pattern>
      </defs>

      {/* ── 囲み ───────────────────────────────────── */}
      <Frame rect={HQ} label="本社" corner="tl" solid />
      <Frame rect={DMZ} label="DMZ" corner="br" />
      <Frame rect={LAN} label="内部 LAN" corner="tl" />
      <Frame rect={PC_SEG} label="PC セグメント" corner="br" />
      <Frame rect={SRV_SEG} label="サーバセグメント" corner="br" />

      {/* ── 線 ─────────────────────────────────────── */}
      {/* インターネット ― ルータ ― FW ― L3SW（左の縦の列） */}
      <Wire x1={72} y1={INET.cy + INET.ry} x2={72} y2={ROUTER.y} />
      <Wire x1={72} y1={ROUTER.y + ROUTER.h} x2={72} y2={FW.y} />
      <Wire x1={72} y1={FW.y + FW.h} x2={72} y2={L3SW.y} />
      {/* FW ― DMZ の L2SW ― 3台のサーバ */}
      <Wire x1={FW.x + FW.w} y1={95} x2={DMZ_SW.x} y2={95} />
      <Wire x1={171} y1={WEB.y + WEB.h} x2={212} y2={DMZ_SW.y} />
      <Wire x1={222} y1={PROXY.y + PROXY.h} x2={222} y2={DMZ_SW.y} />
      <Wire x1={274} y1={EXT_DNS.y + EXT_DNS.h} x2={232} y2={DMZ_SW.y} />
      {/* L3SW ― PC セグメントの L2SW 2台 ― PC */}
      <Wire x1={64} y1={L3SW.y + L3SW.h} x2={48} y2={PC_SW[0].y} />
      <Wire x1={80} y1={L3SW.y + L3SW.h} x2={118} y2={PC_SW[1].y} />
      <Wire x1={40} y1={222} x2={28} y2={PC_Y} />
      <Wire x1={56} y1={222} x2={68} y2={PC_Y} />
      <Wire x1={114} y1={222} x2={102} y2={PC_Y} />
      <Wire x1={130} y1={222} x2={142} y2={PC_Y} />
      {/* L3SW ― サーバセグメントの L2SW ― DS・サーバ */}
      <Wire x1={L3SW.x + L3SW.w} y1={169} x2={SRV_SW.x} y2={169} />
      <Wire x1={212} y1={163} x2={DS1.x} y2={left(DS1)[1]} />
      <Wire x1={212} y1={168} x2={DS2.x} y2={left(DS2)[1]} />
      <Wire x1={212} y1={174} x2={BIZ.x} y2={left(BIZ)[1]} />
      <Wire x1={204} y1={178} x2={SALES.x} y2={left(SALES)[1]} />
      <Wire x1={194} y1={178} x2={INT_DNS.x} y2={left(INT_DNS)[1]} />

      {/* ── 強調：PC から社内 DNS サーバへの道筋と、表1 の空欄に入る3台 ── */}
      {highlight && (
        <g>
          <Ring {...EXT_DNS} />
          <Ring {...PROXY} />
          <Ring {...INT_DNS} />
          <Route points={TO_DNS} />
        </g>
      )}

      {/* ── ノード ───────────────────────────────────── */}
      <Ell {...INET} tone="outside" lines={['インターネット']} size={SIZE} />
      <Box {...ROUTER} tone="device" lines={['ルータ']} size={SIZE} />
      <Box {...FW} tone="device" lines={['FW']} size={SIZE} />
      <Box {...WEB} tone="host" lines={['公開 Web', 'サーバ']} size={SIZE} />
      <Box {...PROXY} tone="host" lines={['プロキシ', 'サーバ']} size={SIZE} />
      <Box {...EXT_DNS} tone="host" lines={['外部 DNS', 'サーバ']} size={SIZE} />
      <Box {...DMZ_SW} tone="device" lines={['L2SW']} size={SIZE} />
      <Box {...L3SW} tone="device" lines={['L3SW']} size={SIZE} />
      {PC_SW.map((r) => (
        <Box key={r.x} {...r} tone="device" lines={['L2SW']} size={SIZE} />
      ))}
      {PCS.map((x) => (
        <Box key={x} x={x} y={PC_Y} w={24} h={18} tone="host" lines={['PC']} size={SIZE} />
      ))}
      <Cap x={48} y={253} text="…" anchor="middle" color={MUTED} />
      <Cap x={122} y={253} text="…" anchor="middle" color={MUTED} />
      <Box {...SRV_SW} tone="device" lines={['L2SW']} size={SIZE} />
      <HatchBox rect={DS1} label="DS1" patternId={hatch} />
      <HatchBox rect={DS2} label="DS2" patternId={hatch} />
      <Box {...BIZ} tone="host" lines={['業務', 'サーバ']} size={SIZE} />
      <Box {...SALES} tone="host" lines={['営業支援', 'サーバ']} size={SIZE} />
      <Box {...INT_DNS} tone="host" lines={['社内 DNS', 'サーバ']} size={SIZE} />

      {/* ── 略語の説明（原図どおり図の下） ─────────────── */}
      <Cap x={4} y={333} text="FW：ファイアウォール" size={SMALL} color={MUTED} />
      <Cap x={100} y={333} text="L2SW：レイヤ2スイッチ" size={SMALL} color={MUTED} />
      <Cap x={4} y={346} text="L3SW：レイヤ3スイッチ" size={SMALL} color={MUTED} />
      <Cap x={100} y={346} text="DS：ディレクトリサーバ" size={SMALL} color={MUTED} />

      {/* ── 強調の文字（L3SW がゲートウェイ） ─────────────── */}
      {highlight && (
        <Callout
          x={96}
          y={136}
          w={64}
          lines={['ゲートウェイ']}
          leader={[
            [96, 145],
            [80, 160],
          ]}
        />
      )}
    </FigSvg>
  )
}
