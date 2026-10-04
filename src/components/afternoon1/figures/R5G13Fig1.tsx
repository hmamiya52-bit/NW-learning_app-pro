import { Box, Callout, Cap, Ell, FigSvg, Poly, Ring, Route, Wire } from './primitives'
import { FONT_SCALE, FRAME, LINE, MUTED, SEGMENT, TONE } from './tokens'
import type { ExamFigureProps, ToneName } from './tokens'

/**
 * 図1 新校舎ビルの LAN システム提案構成（抜粋）— R5 午後Ⅰ 問3
 *
 * 原図は左にマシン室（3F）、右にフロア L2SW（5F・2F・1F）と各階の3教室を並べ、インターネットを左の外に置く（縦横比 1.7:1）。
 * マシン室の下の段（動画コンテンツサーバ・DHCP サーバ・RADIUS サーバ・WLC を横一列）と右の教室の列を並べると、
 * 箱の文字を size 7.5 にしたとき幅が 400 近くになり 340 に入らない。そこで次のように組み直した。
 *   - インターネットを FW の真上（ビルの枠の上の外）へ移す
 *   - マシン室の下の段を2段に分ける。上の段に動画コンテンツサーバ（左）と WLC（右）、そのあいだの下の段に
 *     DHCP サーバと RADIUS サーバを置き、細線（1GbE）はあいだを通して下ろす
 * 各階のフロア L2SW と教室の並び（5F・⋮・2F・1F、教室の3つは横並び）、太線と細線の区別、どの機器とどの機器が
 * つながるか、重ね書きの枚数（動画コンテンツサーバ4枚・WLC 2枚）、区間 (i)〜(v) の点線の楕円は原図どおり。
 * 区間の記号の文字は線の束の上に来るので、白の縁取りを付けて線を文字の所だけ隠す（R4-G1-3 図2 の Label と同じ）。
 *
 * 色は役割だけで決めている。FW・基幹 L3SW・サーバ L2SW・フロア L2SW・AP・WLC は device、動画コンテンツサーバ・DHCP サーバ・
 * RADIUS サーバは host、インターネットは outside。線の太さで 10GbE（太線）と 1GbE（細線）を分ける（色は変えない）。
 *
 * 解説を開いたときは、区間 (ii) の4本をなぞって全教室の動画が集まることを示し（設問3(2)）、職員が保守する動画コンテンツサーバに
 * 輪を付け、フロア L2SW と AP も職員の保守だと吹き出しで添える（設問3(3)）。DHCP サーバにも輪を付ける（設問1 h）。
 */

const SIZE = 7.5
const SMALL = 7
const TEXT = '#334155'
/** 10GbE（原図の太線） */
const THICK = 2.6
/** 1GbE（原図の細線） */
const THIN = 1.1

type Rect = { x: number; y: number; w: number; h: number }
type Pt = [number, number]

const INET = { cx: 38, cy: 16, rx: 35, ry: 11.5 }
const BLDG: Rect = { x: 2, y: 30, w: 336, h: 290 }
const ROOM: Rect = { x: 5, y: 36, w: 158, h: 280 }

const FW: Rect = { x: 16, y: 42, w: 26, h: 18 }
const L3: Rect[] = [
  { x: 72, y: 66, w: 41, h: 30 },
  { x: 118, y: 66, w: 41, h: 30 },
]
const L2: Rect[] = [
  { x: 31, y: 150, w: 41, h: 30 },
  { x: 77, y: 150, w: 41, h: 30 },
]
/** 動画コンテンツサーバ（前の箱）と、後ろの3枚のずらし幅 */
const VIDEO: Rect = { x: 8, y: 224, w: 43, h: 42 }
const VIDEO_STEP = 2.5
const WLC: Rect = { x: 91, y: 224, w: 32, h: 18 }
const WLC_STEP = 3
const DHCP: Rect = { x: 31, y: 282, w: 36, h: 30 }
const RADIUS: Rect = { x: 71, y: 282, w: 46, h: 30 }

/** フロア L2SW（左端の x）と各階の段の上端 */
const FL_X = 170
const FL_W = 36
const FL_H = 42
const FLOORS = [
  { f: '5', top: 112 },
  { f: '2', top: 190 },
  { f: '1', top: 258 },
]
/** 教室の破線の枠（左端の x）。AP の箱は枠の中の上寄り */
const ROOM_XS = [211, 252, 293]
const ROOM_W = 38
const ROOM_H = 52
const AP_W = 34
const AP_DY = 15

const mid = (r: Rect) => r.x + r.w / 2
const bottom = (r: Rect) => r.y + r.h

/** 基幹 L3SW から各階のフロア L2SW へ（区間 (iii)）。L3SW2 は左辺の上寄り、L3SW1 は下寄りに入る */
function uplinks(): [Pt, Pt][] {
  const out: [Pt, Pt][] = []
  FLOORS.forEach(({ top }, i) => {
    out.push([[102 + 4 * i, bottom(L3[0])], [FL_X, top + 30]])
    out.push([[147 + 4 * i, bottom(L3[1])], [FL_X, top + 12]])
  })
  return out
}

/** 基幹 L3SW からサーバ L2SW へ（区間 (ii)。たすき掛けの4本） */
const CORE: [Pt, Pt][] = [
  [[78, 96], [48, 150]],
  [[88, 96], [92, 150]],
  [[122, 96], [60, 150]],
  [[130, 96], [104, 150]],
]

/** 名前を枠の内側の上の隅に置く囲み（新校舎ビルは実線、マシン室は破線。どちらも右上。原図どおり） */
function Frame({ rect, label, solid = false }: { rect: Rect; label: string; solid?: boolean }) {
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
      <text x={x + w - 5} y={y + 4 + fs} textAnchor="end" fontSize={fs} fill={TEXT}>
        {label}
      </text>
    </g>
  )
}

/** 教室の破線の枠。名前は枠の内側の下に置く（原図どおり） */
function Classroom({ x, y, label }: { x: number; y: number; label: string }) {
  const fs = SIZE * FONT_SCALE
  return (
    <g>
      <rect x={x} y={y} width={ROOM_W} height={ROOM_H} fill="none" stroke={SEGMENT} strokeWidth={1.1} strokeDasharray="4 2.5" />
      <text x={x + ROOM_W / 2} y={y + ROOM_H - 6} textAnchor="middle" fontSize={fs} fill={TEXT}>
        {label}
      </text>
    </g>
  )
}

/** 重ね書きの機器（原図どおり、後ろの枚数ぶん右下にずらして複数台を表す） */
function Stack({ rect, tone, lines, behind, step }: { rect: Rect; tone: ToneName; lines: string[]; behind: number; step: number }) {
  const t = TONE[tone]
  return (
    <g>
      <g>
        {Array.from({ length: behind }, (_, i) => behind - i).map((k) => (
          <rect key={k} x={rect.x + step * k} y={rect.y + step * k} width={rect.w} height={rect.h} rx={2} fill={t.fill} stroke={t.stroke} strokeWidth={1.2} />
        ))}
      </g>
      <Box {...rect} tone={tone} lines={lines} size={SIZE} />
    </g>
  )
}

/**
 * 区間の記号（原図の点線の楕円）。楕円だけを1つの `<g>` に入れ、文字は SecLabel で後から置く
 * （楕円を図の直下に置くと、§5.4 の検査2 が同じ階層の文字をすべてこの楕円で測ってしまう。
 * 傾けた楕円は検査2 が正しく測れないので、文字が楕円の中に収まることは置く前に計算で確かめた）
 */
function Section({ cx, cy, rx, ry, rotate = 0 }: { cx: number; cy: number; rx: number; ry: number; rotate?: number }) {
  return (
    <g>
      <ellipse
        cx={cx}
        cy={cy}
        rx={rx}
        ry={ry}
        fill="none"
        stroke={TEXT}
        strokeWidth={1}
        strokeDasharray="1.6 1.6"
        transform={rotate ? `rotate(${rotate} ${cx} ${cy})` : undefined}
      />
    </g>
  )
}

/** 区間の記号の文字。線の束の上に来るので、白の縁取りで線を文字の所だけ隠す */
function SecLabel({ x, y, text }: { x: number; y: number; text: string }) {
  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      fontSize={SIZE * FONT_SCALE}
      fill={TEXT}
      stroke="#ffffff"
      strokeWidth={3}
      paintOrder="stroke"
      strokeLinejoin="round"
    >
      {text}
    </text>
  )
}

/** 縦の「⋮」（原図の 5F と 2F のあいだの省略） */
function VDots({ x, y }: { x: number; y: number }) {
  return (
    <g>
      {[0, 5, 10].map((d) => (
        <circle key={d} cx={x} cy={y + d} r={0.9} fill={MUTED} />
      ))}
    </g>
  )
}

export default function R5G13Fig1({ highlight = false }: ExamFigureProps) {
  const ups = uplinks()
  return (
    <FigSvg w={340} h={370} title="図1 新校舎ビルの LAN システム提案構成（抜粋）">
      {/* ── 囲み ───────────────────────────────────── */}
      <Frame rect={BLDG} label="A 専門学校 新校舎ビル" solid />
      <Frame rect={ROOM} label="マシン室（3F）" />
      {FLOORS.map(({ f, top }) =>
        ROOM_XS.map((x, k) => <Classroom key={`${f}-${k}`} x={x} y={top} label={`教室${f}${k + 1}`} />),
      )}

      {/* ── 線 ─────────────────────────────────────── */}
      {/* インターネット ― FW ― 基幹 L3SW（区間 (i)） */}
      <Wire x1={mid(FW)} y1={INET.cy + INET.ry - 2} x2={mid(FW)} y2={FW.y} width={THICK} />
      <Wire x1={FW.x + FW.w} y1={47} x2={134} y2={L3[1].y} width={THICK} />
      <Wire x1={FW.x + FW.w} y1={55} x2={86} y2={L3[0].y} width={THICK} />
      <Wire x1={L3[0].x + L3[0].w} y1={81} x2={L3[1].x} y2={81} width={THICK} />
      {/* 基幹 L3SW ― サーバ L2SW（区間 (ii)）、基幹 L3SW ― フロア L2SW（区間 (iii)） */}
      {CORE.map(([a, b]) => (
        <Wire key={`${a}`} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} width={THICK} />
      ))}
      {ups.map(([a, b]) => (
        <Wire key={`${a}`} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} width={THICK} />
      ))}
      <Wire x1={L2[0].x + L2[0].w} y1={165} x2={L2[1].x} y2={165} width={THICK} />
      {/* サーバ L2SW ― 動画コンテンツサーバ（区間 (iv)）・WLC（区間 (v)） */}
      <Wire x1={36} y1={bottom(L2[0])} x2={18} y2={VIDEO.y} width={THICK} />
      <Wire x1={82} y1={bottom(L2[1])} x2={42} y2={VIDEO.y} width={THICK} />
      <Wire x1={67} y1={bottom(L2[0])} x2={99} y2={WLC.y} width={THICK} />
      <Wire x1={113} y1={bottom(L2[1])} x2={116} y2={WLC.y} width={THICK} />
      {/* サーバ L2SW ― DHCP サーバ・RADIUS サーバ（細線。動画コンテンツサーバと WLC のあいだを通す） */}
      <Wire x1={63} y1={bottom(L2[0])} x2={63} y2={DHCP.y} width={THIN} />
      <Wire x1={81} y1={bottom(L2[1])} x2={66} y2={DHCP.y} width={THIN} />
      <Wire x1={68} y1={bottom(L2[0])} x2={80} y2={RADIUS.y} width={THIN} />
      <Wire x1={87} y1={bottom(L2[1])} x2={87} y2={RADIUS.y} width={THIN} />
      {/* フロア L2SW ― 各教室の AP（細線。上の線ほど遠くの教室へ） */}
      {FLOORS.map(({ f, top }) =>
        ROOM_XS.map((x, k) => {
          const y = top + 12 - 4 * k
          const ax = x + ROOM_W / 2
          return (
            <Poly
              key={`${f}-${k}`}
              points={[
                [FL_X + FL_W, y],
                [ax, y],
                [ax, top + AP_DY],
              ]}
              width={THIN}
            />
          )
        }),
      )}

      {/* ── 区間 (i)〜(v) の点線の楕円 ───────────────────── */}
      <Section cx={56} cy={62.5} rx={10} ry={18} />
      <Section cx={71} cy={135} rx={47} ry={12} />
      <Section cx={145} cy={130} rx={25} ry={17} rotate={-45} />
      <Section cx={41} cy={205} rx={21} ry={10.5} rotate={25} />
      <Section cx={106} cy={211} rx={15} ry={11} />

      {/* ── 強調：区間 (ii)、職員が保守する動画コンテンツサーバ、DHCP サーバ ── */}
      {highlight && (
        <g>
          <Ring x={VIDEO.x} y={VIDEO.y} w={VIDEO.w + VIDEO_STEP * 3} h={VIDEO.h + VIDEO_STEP * 3} />
          <Ring {...DHCP} />
          {CORE.map(([a, b]) => (
            <Route key={`${a}`} points={[a, b]} />
          ))}
        </g>
      )}

      {/* ── ノード ───────────────────────────────────── */}
      <Ell {...INET} tone="outside" lines={['インターネット']} size={SIZE} />
      <Box {...FW} tone="device" lines={['FW']} size={SIZE} />
      {L3.map((r, i) => (
        <Box key={i} {...r} tone="device" lines={['基幹', `L3SW${i + 1}`]} size={SIZE} />
      ))}
      {L2.map((r, i) => (
        <Box key={i} {...r} tone="device" lines={['サーバ', `L2SW${i + 1}`]} size={SIZE} />
      ))}
      <Stack rect={VIDEO} tone="host" lines={['動画', 'コンテンツ', 'サーバ']} behind={3} step={VIDEO_STEP} />
      <Box {...DHCP} tone="host" lines={['DHCP', 'サーバ']} size={SIZE} />
      <Box {...RADIUS} tone="host" lines={['RADIUS', 'サーバ']} size={SIZE} />
      <Stack rect={WLC} tone="device" lines={['WLC']} behind={1} step={WLC_STEP} />
      {FLOORS.map(({ f, top }) => (
        <g key={f}>
          <Box x={FL_X} y={top} w={FL_W} h={FL_H} tone="device" lines={['フロア', 'L2SW', `(${f}F)`]} size={SIZE} />
          {ROOM_XS.map((x, k) => (
            <Box key={k} x={x + (ROOM_W - AP_W) / 2} y={top + AP_DY} w={AP_W} h={18} tone="device" lines={[`AP${f}${k + 1}`]} size={SIZE} />
          ))}
        </g>
      ))}
      <VDots x={FL_X + FL_W / 2} y={FLOORS[0].top + FL_H + 13} />

      {/* ── 区間の記号の文字 ─────────────────────────────── */}
      <SecLabel x={56} y={73} text="(i)" />
      <SecLabel x={40} y={139} text="(ii)" />
      <SecLabel x={143} y={142} text="(iii)" />
      <SecLabel x={40} y={209} text="(iv)" />
      <SecLabel x={104} y={214} text="(v)" />

      {/* ── 凡例と注記（原図どおり図の下） ─────────────────── */}
      <Wire x1={6} y1={329} x2={24} y2={329} width={THICK} color={LINE} />
      <Cap x={26} y={332} text="：10 G ビットイーサネット（10 GbE）" size={SMALL} color={MUTED} />
      <Wire x1={170} y1={329} x2={188} y2={329} width={THIN} color={LINE} />
      <Cap x={190} y={332} text="：1 G ビットイーサネット（1 GbE）" size={SMALL} color={MUTED} />
      <Cap x={6} y={346} text="WLC：無線 LAN コントローラ" size={SMALL} color={MUTED} />
      <Cap x={6} y={362} text="注記1" size={SMALL} color={MUTED} />
      <Section cx={41} cy={359} rx={9} ry={6} />
      <Cap x={41} y={362} text="(i)" anchor="middle" size={SMALL} color={MUTED} />
      <Cap x={56} y={362} text="〜" anchor="middle" size={SMALL} color={MUTED} />
      <Section cx={71} cy={359} rx={9} ry={6} />
      <Cap x={71} y={362} text="(v)" anchor="middle" size={SMALL} color={MUTED} />
      <Cap x={84} y={362} text="は，接続の区間を表す。設問 3 で使用する。" size={SMALL} color={MUTED} />

      {/* ── 強調の文字 ─────────────────────────────────── */}
      {highlight && (
        <g>
          <Callout
            x={6}
            y={84}
            w={53}
            lines={['全教室の', '動画が通る']}
            leader={[
              [44, 114.6],
              [60.2, 128],
            ]}
          />
          <Callout x={206} y={58} w={98} lines={['フロア L2SW と AP は', '職員が保守する']} />
        </g>
      )}
    </FigSvg>
  )
}
