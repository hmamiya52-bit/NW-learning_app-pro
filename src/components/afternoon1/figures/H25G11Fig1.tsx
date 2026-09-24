import { Box, Cap, DashFrame, Ell, FigSvg, Poly, Ring, Route, SolidFrame, Wire } from './primitives'
import { FONT_SCALE, MARK, MARK_FILL, MARK_TEXT, MUTED, SEGMENT, TONE, useFigureId } from './tokens'
import type { ExamFigureProps, ToneName } from './tokens'

/**
 * 図1 新ネットワークの構成（抜粋）— H25 午後Ⅰ 問1
 *
 * 原図は B 社を左、A 社を右に並べ、インターネットを左下に置く横長の図。
 * 375px に収めるため、A 社を上に、その下にインターネットと B 社を並べ直した。
 * A 社の中の並び（内部 LAN が上、FW が中、外部 LAN とルータが左下、DMZ が右下）は原図どおり。
 * 機器・アドレス・つながり・凡例・注記は落としていない。
 *
 * 色は役割だけで決めている。A 社のルータ・FW・SSL-VPN 装置は device、
 * PC・資産管理サーバ・テスト環境サーバ・DNS サーバは host、
 * B 社のルータ（他社の装置）とインターネットは outside。
 * 原図の網掛け（注記1: B 社からの接続のために追加した機器）は色ではなく斜線で残す。
 *
 * 解説を開いたときは、B 社の PC から SSL-VPN 装置までの道筋（TCP ①）と、
 * SSL-VPN 装置から資産管理サーバまでの道筋（TCP ②）を赤でなぞり、
 * SSL-VPN 装置と DNS サーバに輪を付ける（設問2(3)・設問3）。
 */

const TEXT = '#334155'
/** 網掛けの斜線の色（原図の網掛けを表す。役割の色ではない） */
const HATCH = '#94a3b8'

/** 網掛けの箱（今回追加した機器）。役割の色の上に斜線を重ね、その上に文字を置く */
function HatchBox({
  x,
  y,
  w,
  h,
  tone,
  lines,
  patternId,
}: {
  x: number
  y: number
  w: number
  h: number
  tone: ToneName
  lines: string[]
  patternId: string
}) {
  const t = TONE[tone]
  const fs = 7 * FONT_SCALE
  const lh = fs + 2.5
  const startY = y + h / 2 + fs * 0.44 - ((lines.length - 1) * lh) / 2
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={2} fill={t.fill} stroke={t.stroke} strokeWidth={1.2} />
      <rect x={x + 0.6} y={y + 0.6} width={w - 1.2} height={h - 1.2} rx={2} fill={`url(#${patternId})`} />
      <text x={x + w / 2} y={startY} textAnchor="middle" fontSize={fs} fontWeight={700} fill={t.text}>
        {lines.map((ln, i) => (
          <tspan key={i} x={x + w / 2} dy={i === 0 ? 0 : lh}>
            {ln}
          </tspan>
        ))}
      </text>
    </g>
  )
}

/**
 * 経路に添える札。共通の RouteTag（高さ fs+6）は Meiryo UI だと文字が枠に触るので、
 * 高さを 2 足して文字を上下の中央に置く（H25G13Fig2 の BitTag と同じ考え方）。
 */
function Tag({ cx, cy, text, w }: { cx: number; cy: number; text: string; w: number }) {
  const fs = 7.5 * FONT_SCALE
  const h = fs + 8
  return (
    <g>
      <rect x={cx - w / 2} y={cy - h / 2} width={w} height={h} rx={h / 2} fill={MARK_FILL} stroke={MARK} strokeWidth={1} />
      <text x={cx} y={cy + fs * 0.415} textAnchor="middle" fontSize={fs} fontWeight={700} fill={MARK_TEXT}>
        {text}
      </text>
    </g>
  )
}

/** セグメントの線（原図の太い横線）と、機器がつながる所の小さな四角 */
function Bus({ x1, x2, y, taps }: { x1: number; x2: number; y: number; taps: number[] }) {
  return (
    <g>
      <Wire x1={x1} y1={y} x2={x2} y2={y} width={2} />
      {[x1, ...taps, x2].map((x) => (
        <rect key={x} x={x - 1.8} y={y - 1.8} width={3.6} height={3.6} fill={MUTED} />
      ))}
    </g>
  )
}

/** TCP ①: B 社の PC → B 社のルータ → インターネット → A 社のルータ → FW → SSL-VPN 装置 */
const TCP1: [number, number][] = [
  [255, 273],
  [255, 296],
  [206, 296],
  [206, 321],
  [108, 321],
  [108, 153],
  [186, 153],
  [186, 226],
  [291, 226],
  [291, 200],
]
/** TCP ②: SSL-VPN 装置 → FW → 内部 LAN → 資産管理サーバ */
const TCP2: [number, number][] = [
  [291, 200],
  [291, 226],
  [186, 226],
  [186, 153],
  [108, 153],
  [108, 102],
  [170, 102],
  [170, 76],
]

export default function H25G11Fig1({ highlight = false }: ExamFigureProps) {
  const hatch = useFigureId('h25g11-hatch')
  return (
    <FigSvg w={340} h={372} title="図1 新ネットワークの構成（抜粋）">
      <defs>
        <pattern id={hatch} width={4} height={4} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1={0} y1={0} x2={0} y2={4} stroke={HATCH} strokeWidth={1} />
        </pattern>
      </defs>

      {/* ── 囲み ───────────────────────────────────── */}
      <SolidFrame x={2} y={2} w={336} h={248} label="A社" />
      <DashFrame x={8} y={22} w={324} h={110} label="内部LAN" color={SEGMENT} />
      <DashFrame x={8} y={172} w={150} h={46} label="外部LAN" color={SEGMENT} />
      <DashFrame x={166} y={144} w={166} h={100} label="DMZ" labelAnchor="end" color={SEGMENT} />
      <SolidFrame x={176} y={258} w={162} h={94} label="B社" />

      {/* 開発システム（2台のサーバをくくる波括弧） */}
      <Cap x={223} y={36} text="開発システム" anchor="middle" size={7.5} color={TEXT} bold />
      <path
        d="M120,50 Q120,45 125,45 L218,45 Q223,45 223,40 Q223,45 228,45 L321,45 Q326,45 326,50"
        fill="none"
        stroke={MUTED}
        strokeWidth={1}
      />

      {/* ── 線 ─────────────────────────────────────── */}
      {/* 内部 LAN */}
      <Wire x1={31} y1={86} x2={31} y2={102} />
      <Wire x1={77} y1={86} x2={77} y2={102} />
      <Wire x1={170} y1={90} x2={170} y2={102} />
      <Wire x1={278} y1={90} x2={278} y2={102} />
      <Bus x1={12} x2={328} y={102} taps={[31, 77, 108, 170, 278]} />
      {/* FW と内部 LAN・外部 LAN・DMZ */}
      <Wire x1={108} y1={102} x2={108} y2={144} />
      <Wire x1={108} y1={162} x2={108} y2={226} />
      <Poly
        points={[
          [130, 153],
          [186, 153],
          [186, 226],
        ]}
      />
      {/* DMZ */}
      <Wire x1={230} y1={214} x2={230} y2={226} />
      <Wire x1={291} y1={214} x2={291} y2={226} />
      <Bus x1={176} x2={326} y={226} taps={[186, 230, 291]} />
      {/* A 社のルータ → インターネット ← B 社のルータ */}
      <Wire x1={108} y1={244} x2={108} y2={307} />
      <Wire x1={158} y1={321} x2={184} y2={321} />
      {/* B 社 */}
      <Wire x1={255} y1={282} x2={255} y2={296} />
      <Wire x1={313} y1={282} x2={313} y2={296} />
      <Wire x1={206} y1={296} x2={206} y2={312} />
      <Bus x1={184} x2={332} y={296} taps={[206, 255, 313]} />

      {/* ── 強調：輪と、TCP ①・② の道筋（ノードより先）── */}
      {highlight && (
        <g>
          <Ring x={262} y={186} w={58} h={28} />
          <Ring x={210} y={186} w={40} h={28} />
          <Route points={TCP1} />
          <Route points={TCP2} />
        </g>
      )}

      {/* ── ノード ───────────────────────────────────── */}
      {/* 内部 LAN */}
      <Cap x={170} y={59} text="shisankanri.example.com" anchor="middle" size={6.5} color={TEXT} />
      <Cap x={278} y={59} text="testkankyo.example.com" anchor="middle" size={6.5} color={TEXT} />
      <Box x={16} y={68} w={30} h={18} tone="host" lines={['PC']} size={7} />
      <Cap x={54} y={80} text="…" anchor="middle" color={MUTED} />
      <Box x={62} y={68} w={30} h={18} tone="host" lines={['PC']} size={7} />
      <Box x={146} y={62} w={48} h={28} tone="host" lines={['資産管理', 'サーバ']} size={7} />
      <Box x={252} y={62} w={52} h={28} tone="host" lines={['テスト環境', 'サーバ']} size={7} />
      <Cap x={14} y={113} text="10.10.10.0/24" size={6.5} color={TEXT} />
      <Cap x={173} y={113} text="10.10.10.1" size={6.5} color={TEXT} />
      <Cap x={281} y={113} text="10.10.10.2" size={6.5} color={TEXT} />
      <Cap x={104} y={125} text="10.10.10.254" anchor="end" size={6.5} color={TEXT} />

      {/* FW・外部 LAN・ルータ */}
      <Box x={86} y={144} w={44} h={18} tone="device" lines={['FW']} size={7} />
      <Cap x={104} y={187} text="202.y.63.2" anchor="end" size={6.5} color={TEXT} />
      <Cap x={104} y={212} text="202.y.63.1" anchor="end" size={6.5} color={TEXT} />
      <Box x={86} y={226} w={44} h={18} tone="device" lines={['ルータ']} size={7} />

      {/* DMZ */}
      <Cap x={190} y={172} text="202.y.63.9" size={6.5} color={TEXT} />
      <HatchBox x={210} y={186} w={40} h={28} tone="host" lines={['DNS', 'サーバ']} patternId={hatch} />
      <HatchBox x={262} y={186} w={58} h={28} tone="device" lines={['SSL-VPN', '装置']} patternId={hatch} />
      <Cap x={230} y={237} text="202.y.63.10" anchor="middle" size={6.5} color={TEXT} />
      <Cap x={291} y={237} text="202.y.63.11" anchor="middle" size={6.5} color={TEXT} />

      {/* インターネット */}
      <Ell cx={108} cy={321} rx={50} ry={14} tone="outside" lines={['インターネット']} size={7} />

      {/* B 社 */}
      <Box x={240} y={264} w={30} h={18} tone="host" lines={['PC']} size={7} />
      <Cap x={284} y={276} text="…" anchor="middle" color={MUTED} />
      <Box x={298} y={264} w={30} h={18} tone="host" lines={['PC']} size={7} />
      <Cap x={332} y={307} text="192.168.1.0/24" anchor="end" size={6.5} color={TEXT} />
      <Cap x={210} y={307} text="192.168.1.254" size={6.5} color={TEXT} />
      <Box x={184} y={312} w={44} h={18} tone="outside" lines={['ルータ']} size={7} />
      <Cap x={184} y={342} text="61.x.42.94" size={6.5} color={TEXT} />

      {/* ── 強調の文字（線の上の空いた所に札を置く）── */}
      {highlight && (
        <g>
          <Tag cx={108} cy={276} text="TCP①" w={36} />
          <Tag cx={139} cy={102} text="TCP②" w={36} />
        </g>
      )}

      {/* ── 凡例 ─────────────────────────────────────── */}
      <Cap x={4} y={366} text="FW：ファイアウォール" color={MUTED} />
    </FigSvg>
  )
}
