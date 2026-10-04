import { Box, Callout, Cap, FigSvg, Poly, Ring, Route, Wire } from './primitives'
import { FONT_SCALE, FRAME, MUTED, SEGMENT, TONE, useFigureId } from './tokens'
import type { ExamFigureProps, ToneName } from './tokens'

/**
 * 図1 N 主任が考えた K 市のネットワーク構成（抜粋）— R5 午後Ⅰ 問2
 *
 * 原図は左に K 市庁舎、右に 河川・沿岸 を横に並べる（縦横比 2.3:1）。横のままだと 375px で文字が 5px 台になるので、
 * 河川・沿岸 を左へ 90 度回して上の段に置いた。L2SW91〜L2SW95 の縦の列は左から右への横の列になり、原図で列の右にあった
 * IP カメラ（11〜14・31〜34・51〜54）は上、左にあったもの（21〜24・41〜44）は下に来る。2台の箱と「…」で4台を表すのは原図どおり。
 * FW01 から L2SW91 への線は、L2SW91 から下りて2つの枠のあいだを通り、上から FW01 に入れた。
 * K 市庁舎の中（左上にサーバ室、上の真ん中に FW01、下に執務エリア 1・2 を横に並べる）は原図どおり。
 *
 * 色は役割だけで決めている。FW01・L2SW・L3SW は device、カメラ管理サーバ・PC・IP カメラ・レシーバ・大型モニターは host
 * （ネットワークの装置ではない端の機器）。原図の網掛け（新設機器）は色ではなく斜線で残し、凡例の見本も描く。
 *
 * 解説を開いたときは、IP カメラの映像が L2SW95 から L2SW91 を通って FW01 に入る道筋をなぞり（設問2(2)）、
 * カメラ管理サーバ（表1 の Ⅰ。設問3(3)）と、PC だけがつながる L2SW11・L2SW21（設問4(1)）に輪を付ける。
 */

const SIZE = 7.5
const SMALL = 7
const TEXT = '#334155'
const HATCH = '#94a3b8'

type Rect = { x: number; y: number; w: number; h: number }

/** 河川・沿岸（上の段） */
const RIVER: Rect = { x: 3, y: 4, w: 334, h: 130 }
/** L2SW91〜L2SW95 の中心の x（左から） */
const CHAIN_X = [62, 116, 170, 224, 278]
const SW_W = 47
const CHAIN_Y = 66
const CAM_W = 40
const CAM_H = 30
/** 上（L2SW91・93・95）と下（L2SW92・94）のカメラの箱の上端 */
const CAM_UP_Y = 22
const CAM_DOWN_Y = 98
const CAMS: [string, string][] = [
  ['11', '14'],
  ['21', '24'],
  ['31', '34'],
  ['41', '44'],
  ['51', '54'],
]

/** K 市庁舎（下の段） */
const CITY: Rect = { x: 3, y: 146, w: 334, h: 214 }
const SERVER_ROOM: Rect = { x: 5, y: 152, w: 108, h: 58 }
const CAM_MGR: Rect = { x: 9, y: 174, w: 47, h: 30 }
const L2SW01: Rect = { x: 63, y: 180, w: 47, h: 18 }
const FW01: Rect = { x: 152, y: 180, w: 36, h: 18 }
/** FW01 と L2SW91 をつなぐ線が2つの枠のあいだを通る高さ */
const GAP_Y = 140
const UPLINK_X = 50

/** 執務エリア 1・2（左端の x のずれ） */
const AREAS = [
  { ox: 0, n: '1', l3: 'L3SW11', l2: ['L2SW11', 'L2SW12'], rcv: ['レシーバ11', 'レシーバ13'] },
  { ox: 166, n: '2', l3: 'L3SW21', l2: ['L2SW21', 'L2SW22'], rcv: ['レシーバ21', 'レシーバ23'] },
]
const AREA_Y = 216
const AREA_H = 140

function area(ox: number) {
  return {
    frame: { x: 6 + ox, y: AREA_Y, w: 162, h: AREA_H },
    l3: { x: 63.5 + ox, y: 222, w: SW_W, h: 18 },
    l2: [
      { x: 38 + ox, y: 255, w: SW_W, h: 18 },
      { x: 89 + ox, y: 255, w: SW_W, h: 18 },
    ],
    pcL: [
      { x: 9 + ox, y: 238, w: 21, h: 18 },
      { x: 9 + ox, y: 272, w: 21, h: 18 },
    ],
    pcR: [
      { x: 144 + ox, y: 238, w: 21, h: 18 },
      { x: 144 + ox, y: 272, w: 21, h: 18 },
    ],
    rcv: [
      { x: 25 + ox, y: 302, w: 50, h: 18 },
      { x: 99 + ox, y: 302, w: 50, h: 18 },
    ],
    mon: [
      { x: 22 + ox, y: 332, w: 56, h: 18 },
      { x: 96 + ox, y: 332, w: 56, h: 18 },
    ],
  }
}

const mid = (r: Rect) => r.x + r.w / 2

/** 名前を枠の内側の上の隅に置く囲み（K 市庁舎は右上、ほかは左上。原図どおり） */
function Frame({ rect, label, corner, solid = false }: { rect: Rect; label: string; corner: 'tl' | 'tr'; solid?: boolean }) {
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
      <text x={corner === 'tl' ? x + 4.5 : x + w - 5} y={y + 4 + fs} textAnchor={corner === 'tl' ? 'start' : 'end'} fontSize={fs} fill={TEXT}>
        {label}
      </text>
    </g>
  )
}

/** 網掛けの箱（原図の新設機器）。役割の色の上に斜線を重ね、その上に文字を置く */
function HatchBox({ rect, tone, lines, patternId }: { rect: Rect; tone: ToneName; lines: string[]; patternId: string }) {
  const { x, y, w, h } = rect
  const t = TONE[tone]
  const fs = SIZE * FONT_SCALE
  const lh = fs + 2.5
  const cx = x + w / 2
  const startY = y + h / 2 + fs * 0.44 - ((lines.length - 1) * lh) / 2
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={2} fill={t.fill} stroke={t.stroke} strokeWidth={1.2} />
      <rect x={x + 0.6} y={y + 0.6} width={w - 1.2} height={h - 1.2} rx={2} fill={`url(#${patternId})`} />
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

/** カメラの2台の箱の左端（グループの中心 c から） */
const camXs = (c: number) => [c - 47.5, c + 7.5]

/** L2SW95 → L2SW91 → FW01（線の折れ点をなぞる） */
const INFLOW: [number, number][] = [
  [CHAIN_X[4], CHAIN_Y + 9],
  [UPLINK_X, CHAIN_Y + 9],
  [UPLINK_X, GAP_Y],
  [mid(FW01), GAP_Y],
  [mid(FW01), FW01.y + 9],
]

export default function R5G12Fig1({ highlight = false }: ExamFigureProps) {
  const hatch = useFigureId('r5g12-hatch')
  const A = AREAS.map((a) => ({ ...a, g: area(a.ox) }))
  return (
    <FigSvg w={340} h={390} title="図1 N 主任が考えた K 市のネットワーク構成（抜粋）">
      <defs>
        <pattern id={hatch} width={4} height={4} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1={0} y1={0} x2={0} y2={4} stroke={HATCH} strokeWidth={1} />
        </pattern>
      </defs>

      {/* ── 囲み ───────────────────────────────────── */}
      <Frame rect={RIVER} label="河川・沿岸" corner="tl" />
      <Frame rect={CITY} label="K 市庁舎" corner="tr" solid />
      <Frame rect={SERVER_ROOM} label="サーバ室" corner="tl" />
      {A.map((a) => (
        <Frame key={a.n} rect={a.g.frame} label={`執務エリア ${a.n}`} corner="tl" />
      ))}

      {/* ── 線 ─────────────────────────────────────── */}
      {/* L2SW91〜L2SW95 の列と、各 L2SW から IP カメラ2台へ（上か下） */}
      {CHAIN_X.slice(0, -1).map((c, i) => (
        <Wire key={c} x1={c + SW_W / 2} y1={CHAIN_Y + 9} x2={CHAIN_X[i + 1] - SW_W / 2} y2={CHAIN_Y + 9} />
      ))}
      {CHAIN_X.map((c, i) => {
        const up = i % 2 === 0
        const [x1, x2] = camXs(c)
        const swY = up ? CHAIN_Y : CHAIN_Y + 18
        const camY = up ? CAM_UP_Y + CAM_H : CAM_DOWN_Y
        return (
          <g key={c}>
            <Wire x1={c - 8} y1={swY} x2={x1 + CAM_W / 2} y2={camY} />
            <Wire x1={c + 8} y1={swY} x2={x2 + CAM_W / 2} y2={camY} />
          </g>
        )
      })}
      {/* L2SW91 ― FW01（2つの枠のあいだを通る） */}
      <Poly
        points={[
          [UPLINK_X, CHAIN_Y + 18],
          [UPLINK_X, GAP_Y],
          [mid(FW01), GAP_Y],
          [mid(FW01), FW01.y],
        ]}
      />
      {/* サーバ室 ― FW01 ― 執務エリアの L3SW */}
      <Wire x1={CAM_MGR.x + CAM_MGR.w} y1={189} x2={L2SW01.x} y2={189} />
      <Wire x1={L2SW01.x + L2SW01.w} y1={189} x2={FW01.x} y2={189} />
      <Wire x1={158} y1={FW01.y + FW01.h} x2={mid(A[0].g.l3)} y2={A[0].g.l3.y} />
      <Wire x1={182} y1={FW01.y + FW01.h} x2={mid(A[1].g.l3)} y2={A[1].g.l3.y} />
      {/* 執務エリアの中（L3SW ― L2SW 2台 ― PC、L2SW12・22 ― レシーバ ― 大型モニター） */}
      {A.map(({ n, g }) => {
        const [sa, sb] = g.l2
        return (
          <g key={n}>
            <Wire x1={mid(g.l3) - 8} y1={g.l3.y + 18} x2={mid(sa)} y2={sa.y} />
            <Wire x1={mid(g.l3) + 8} y1={g.l3.y + 18} x2={mid(sb)} y2={sb.y} />
            <Wire x1={sa.x} y1={sa.y + 4} x2={g.pcL[0].x + 21} y2={g.pcL[0].y + 9} />
            <Wire x1={sa.x} y1={sa.y + 14} x2={g.pcL[1].x + 21} y2={g.pcL[1].y + 9} />
            <Wire x1={sb.x + SW_W} y1={sb.y + 4} x2={g.pcR[0].x} y2={g.pcR[0].y + 9} />
            <Wire x1={sb.x + SW_W} y1={sb.y + 14} x2={g.pcR[1].x} y2={g.pcR[1].y + 9} />
            <Wire x1={sb.x + 9} y1={sb.y + 18} x2={mid(g.rcv[0])} y2={g.rcv[0].y} />
            <Wire x1={mid(g.rcv[1])} y1={sb.y + 18} x2={mid(g.rcv[1])} y2={g.rcv[1].y} />
            {g.rcv.map((r, k) => (
              <Wire key={k} x1={mid(r)} y1={r.y + 18} x2={mid(g.mon[k])} y2={g.mon[k].y} />
            ))}
          </g>
        )
      })}

      {/* ── 強調：映像が L2SW91 から FW01 へ入る道筋、表1 の Ⅰ、PC だけの L2SW ── */}
      {highlight && (
        <g>
          <Ring {...CAM_MGR} />
          <Ring {...A[0].g.l2[0]} />
          <Ring {...A[1].g.l2[0]} />
          <Route points={INFLOW} />
        </g>
      )}

      {/* ── ノード ───────────────────────────────────── */}
      {CHAIN_X.map((c, i) => {
        const up = i % 2 === 0
        const [x1, x2] = camXs(c)
        const y = up ? CAM_UP_Y : CAM_DOWN_Y
        return (
          <g key={c}>
            <HatchBox rect={{ x: c - SW_W / 2, y: CHAIN_Y, w: SW_W, h: 18 }} tone="device" lines={[`L2SW9${i + 1}`]} patternId={hatch} />
            <HatchBox rect={{ x: x1, y, w: CAM_W, h: CAM_H }} tone="host" lines={['IPカメラ', CAMS[i][0]]} patternId={hatch} />
            <HatchBox rect={{ x: x2, y, w: CAM_W, h: CAM_H }} tone="host" lines={['IPカメラ', CAMS[i][1]]} patternId={hatch} />
            <Cap x={c} y={y + 18} text="…" anchor="middle" color={MUTED} />
          </g>
        )
      })}
      <HatchBox rect={CAM_MGR} tone="host" lines={['カメラ管理', 'サーバ']} patternId={hatch} />
      <Box {...L2SW01} tone="device" lines={['L2SW01']} size={SIZE} />
      <Box {...FW01} tone="device" lines={['FW01']} size={SIZE} />
      {A.map(({ n, l3, l2, rcv, g }) => (
        <g key={n}>
          <Box {...g.l3} tone="device" lines={[l3]} size={SIZE} />
          {g.l2.map((r, k) => (
            <Box key={k} {...r} tone="device" lines={[l2[k]]} size={SIZE} />
          ))}
          {[...g.pcL, ...g.pcR].map((r) => (
            <Box key={`${r.x}-${r.y}`} {...r} tone="host" lines={['PC']} size={SIZE} />
          ))}
          <Cap x={mid(g.pcL[0])} y={268} text="⋮" anchor="middle" color={MUTED} />
          <Cap x={mid(g.pcR[0])} y={268} text="⋮" anchor="middle" color={MUTED} />
          {g.rcv.map((r, k) => (
            <HatchBox key={k} rect={r} tone="host" lines={[rcv[k]]} patternId={hatch} />
          ))}
          <Cap x={87 + (n === '2' ? 166 : 0)} y={314} text="…" anchor="middle" color={MUTED} />
          {g.mon.map((r, k) => (
            <HatchBox key={k} rect={r} tone="host" lines={['大型モニター']} patternId={hatch} />
          ))}
          <Cap x={87 + (n === '2' ? 166 : 0)} y={344} text="…" anchor="middle" color={MUTED} />
        </g>
      ))}

      {/* ── 略語の説明と凡例（原図どおり図の下） ─────────────── */}
      <Cap x={6} y={372} text="FW：ファイアウォール" size={SMALL} color={MUTED} />
      <Cap x={86} y={372} text="L2SW：レイヤー2スイッチ" size={SMALL} color={MUTED} />
      <Cap x={184} y={372} text="L3SW：レイヤー3スイッチ" size={SMALL} color={MUTED} />
      <rect x={6} y={378} width={18} height={9} fill={`url(#${hatch})`} stroke={MUTED} strokeWidth={1} />
      <Cap x={27} y={386} text="：新設機器" size={SMALL} color={MUTED} />

      {/* ── 強調の文字 ─────────────────────────────────── */}
      {highlight && (
        <Callout
          x={196}
          y={160}
          w={76}
          lines={['カメラ 20 台分が', 'すべてここを通る']}
          leader={[
            [196, 168],
            [mid(FW01), 160],
          ]}
        />
      )}
    </FigSvg>
  )
}
