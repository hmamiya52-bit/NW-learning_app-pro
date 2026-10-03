import { Box, Callout, Cap, FigSvg, Poly, Ring, Route, Wire } from './primitives'
import { FONT_SCALE, FRAME, MUTED, SEGMENT, TONE, useFigureId } from './tokens'
import type { ExamFigureProps } from './tokens'

/**
 * 図1 Z 社の現行ネットワーク構成と増強案（抜粋）— R1 午後Ⅰ 問1
 *
 * 原図はビル3階とビル4階を横に並べ、あいだを4組の M/C と稲妻の線（1000BASE-LX）でつなぐ（横に長く、375px では文字が読めない）。
 * ビル4階をビル3階の下に置き、コアルータからビル4階への4本は、ビル3階の右端を下りて M/C と稲妻の線を通り、
 * ビル4階の L3SW3・L3SW4 へ入る形にした。どの装置とどの装置がつながるか、ア〜ス の位置、実線（既設）と
 * 破線（増強で追加）の別、太線（10GBASE-SR）・細線（1000BASE-T）・稲妻の線の別は原図どおり。
 * コアルータ1 からの2本が線オと交わるのも原図どおり。
 *
 * 色は役割だけで決めている。コアルータ・L3SW・L2SW は device、監視装置 M は host。CR（顧客ルータ）と顧客セグメントは
 * 顧客が設置・管理するもの、ISP と ONU は回線事業者のものなので outside。M/C は原図どおり黒い四角（凡例どおり）。
 * 新規顧客の網掛けは、役割の色を変えずに細い斜線で残す（H25-G1-1 の HatchBox と同じ考え方）。
 *
 * 解説を開いたときは、VRRP の広告が通る キ → ケ → ク をなぞり（設問1(2)(3)）、M/C の4組と、
 * L3SW3 と L2SW3 のあいだの LAG に輪を付ける（設問1(4)(5)）。
 */

const SIZE = 7.5
/** 回線の記号（ア〜ス）とラベルの文字色 */
const TEXT = '#334155'
/** M/C（原図の黒い四角） */
const MC = '#334155'
/** 10GBASE-SR の太線 */
const THICK = 3.5
/** 増強で追加される回線（原図の破線） */
const ADDED = '4 3'
const HATCH = '#cbd5e1'

/** ビル間の4本が下りる位置（左から コアルータ1 の既設・追加、コアルータ2 の既設・追加） */
const X1 = 232
const X2 = 246
const X3 = 280
const X4 = 296

/** ビルの枠（ラベルは原図どおり左下） */
function Building({ y, h, label }: { y: number; h: number; label: string }) {
  return (
    <g>
      <rect x={4} y={y} width={332} height={h} fill="none" stroke={FRAME} strokeWidth={1.3} />
      <text x={10} y={y + h - 5} fontSize={8.5 * FONT_SCALE} fontWeight={700} fill={FRAME}>
        {label}
      </text>
    </g>
  )
}

/** 顧客セグメント（原図どおり破線の楕円） */
function Seg({ cx, cy, label }: { cx: number; cy: number; label: string }) {
  const t = TONE.outside
  const fs = SIZE * FONT_SCALE
  return (
    <g>
      <ellipse cx={cx} cy={cy} rx={46} ry={11} fill={t.fill} stroke={t.stroke} strokeWidth={1.1} strokeDasharray="3 2" />
      <text x={cx} y={cy + fs * 0.44} textAnchor="middle" fontSize={fs} fontWeight={700} fill={t.text}>
        {label}
      </text>
    </g>
  )
}

/** ISP（楕円）と、その下の ONU */
function Isp({ cx, label }: { cx: number; label: string }) {
  const t = TONE.outside
  const fs = SIZE * FONT_SCALE
  return (
    <g>
      <g>
        <ellipse cx={cx} cy={12} rx={22} ry={9} fill={t.fill} stroke={t.stroke} strokeWidth={1.2} />
        <text x={cx} y={12 + fs * 0.44} textAnchor="middle" fontSize={fs} fontWeight={700} fill={t.text}>
          {label}
        </text>
      </g>
      <Box x={cx - 16} y={21} w={32} h={18} tone="outside" lines={['ONU']} size={SIZE} />
    </g>
  )
}

/** 稲妻の線（1000BASE-LX）。縦に下りる形 */
function vbolt(x: number, y1: number, y2: number): [number, number][] {
  const m = (y1 + y2) / 2
  return [
    [x, y1],
    [x, m - 9],
    [x - 4, m - 6],
    [x + 4, m - 2],
    [x - 4, m + 2],
    [x + 4, m + 6],
    [x, m + 9],
    [x, y2],
  ]
}

/** ビル間の1本: 上の M/C → 稲妻の線 → 下の M/C */
function Crossing({ x }: { x: number }) {
  return (
    <g>
      <Poly points={vbolt(x, 250, 284)} />
      <rect x={x - 4} y={242} width={8} height={8} fill={MC} />
      <rect x={x - 4} y={284} width={8} height={8} fill={MC} />
    </g>
  )
}

/** 回線の記号（ア〜ス） */
function Label({ x, y, text, anchor = 'middle' }: { x: number; y: number; text: string; anchor?: 'start' | 'middle' | 'end' }) {
  return <Cap x={x} y={y} text={text} anchor={anchor} size={SIZE} color={TEXT} bold />
}

/** VRRP の広告（L3SW1 → キ → L2SW1 → ケ → L2SW2 → ク → L3SW2） */
const ADVERT: [number, number][] = [
  [51, 116],
  [51, 144],
  [51, 154],
  [150, 154],
  [171, 154],
  [171, 116],
]

export default function R1G11Fig1({ highlight = false }: ExamFigureProps) {
  const hatch = useFigureId('r1g11-hatch')
  return (
    <FigSvg w={340} h={590} title="図1 Z 社の現行ネットワーク構成と増強案（抜粋）">
      <defs>
        <pattern id={hatch} width={4} height={4} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1={0} y1={0} x2={0} y2={4} stroke={HATCH} strokeWidth={1} />
        </pattern>
      </defs>

      {/* ── 強調：M/C の4組と、L3SW3―L2SW3 の LAG の輪（線と囲みより先に敷く）── */}
      {highlight && (
        <g>
          <Ring x={229.5} y={239.5} w={73} h={55} />
          <Ring x={66} y={346} w={24} h={20} />
        </g>
      )}

      {/* ── 囲み ───────────────────────────────────── */}
      <Building y={32} h={220} label="ビル3階" />
      <Building y={282} h={208} label="ビル4階" />
      <g>
        <rect x={190} y={398} width={140} height={82} fill={`url(#${hatch})`} stroke={SEGMENT} strokeWidth={1.1} strokeDasharray="4 3" />
        <text x={196} y={475} fontSize={SIZE * FONT_SCALE} fontWeight={700} fill={TEXT}>
          新規顧客
        </text>
      </g>

      {/* ── 線：ビル3階 ─────────────────────────────── */}
      <Wire x1={63} y1={39} x2={63} y2={54} width={THICK} />
      <Wire x1={183} y1={39} x2={183} y2={54} width={THICK} />
      <Wire x1={92} y1={64} x2={152} y2={64} width={THICK} />
      <Wire x1={44} y1={74} x2={44} y2={106} />
      <Wire x1={168} y1={74} x2={168} y2={106} />
      <Wire x1={72} y1={116} x2={150} y2={116} />
      <Wire x1={51} y1={126} x2={51} y2={144} />
      <Wire x1={171} y1={126} x2={171} y2={144} />
      <Wire x1={72} y1={154} x2={150} y2={154} />
      <Wire x1={36} y1={164} x2={36} y2={184} />
      <Wire x1={66} y1={164} x2={140} y2={184} />
      <Wire x1={156} y1={164} x2={80} y2={184} />
      <Wire x1={186} y1={164} x2={186} y2={184} />

      {/* ── 線：ビル3階からビル4階へ（コアルータ1 の2本は線オと交わる）── */}
      <Poly points={[[76, 74], [76, 86], [X1, 86], [X1, 242]]} />
      <Poly points={[[86, 74], [86, 80], [X2, 80], [X2, 242]]} dash={ADDED} />
      <Poly points={[[212, 68], [X3, 68], [X3, 242]]} />
      <Poly points={[[212, 58], [X4, 58], [X4, 242]]} dash={ADDED} />
      <Crossing x={X1} />
      <Crossing x={X2} />
      <Crossing x={X3} />
      <Crossing x={X4} />
      <Poly points={[[X1, 292], [X1, 304], [66, 304], [66, 326]]} />
      <Poly points={[[X2, 292], [X2, 310], [82, 310], [82, 326]]} dash={ADDED} />
      <Wire x1={X3} y1={292} x2={X3} y2={326} />
      <Wire x1={X4} y1={292} x2={X4} y2={326} dash={ADDED} />

      {/* ── 線：ビル4階（既設の実線と、追加の破線の2本並び）── */}
      <Wire x1={98} y1={340} x2={266} y2={340} />
      <Wire x1={98} y1={332} x2={266} y2={332} dash={ADDED} />
      <Wire x1={72} y1={346} x2={72} y2={366} />
      <Wire x1={84} y1={346} x2={84} y2={366} dash={ADDED} />
      <Wire x1={282} y1={346} x2={282} y2={366} />
      <Wire x1={294} y1={346} x2={294} y2={366} dash={ADDED} />
      <Wire x1={98} y1={380} x2={266} y2={380} />
      <Wire x1={98} y1={372} x2={266} y2={372} dash={ADDED} />
      <Wire x1={62} y1={386} x2={62} y2={410} />
      <Wire x1={270} y1={386} x2={104} y2={410} />
      <Wire x1={94} y1={386} x2={214} y2={410} dash={ADDED} />
      <Wire x1={302} y1={386} x2={284} y2={410} dash={ADDED} />

      {/* ── 強調：VRRP の広告の道筋（ノードより先）── */}
      {highlight && <Route points={ADVERT} />}

      {/* ── ノード：ビル3階 ─────────────────────────── */}
      <Isp cx={63} label="ISP1" />
      <Isp cx={183} label="ISP2" />
      <Box x={10} y={38} w={20} h={18} tone="host" lines={['M']} size={SIZE} />
      <Box x={32} y={54} w={60} h={20} tone="device" lines={['コアルータ1']} size={SIZE} />
      <Box x={152} y={54} w={60} h={20} tone="device" lines={['コアルータ2']} size={SIZE} />
      <Box x={30} y={106} w={42} h={20} tone="device" lines={['L3SW1']} size={SIZE} />
      <Box x={150} y={106} w={42} h={20} tone="device" lines={['L3SW2']} size={SIZE} />
      <Box x={30} y={144} w={42} h={20} tone="device" lines={['L2SW1']} size={SIZE} />
      <Box x={150} y={144} w={42} h={20} tone="device" lines={['L2SW2']} size={SIZE} />
      <Box x={14} y={184} w={34} h={18} tone="outside" lines={['CR11']} size={SIZE} />
      <Box x={54} y={184} w={34} h={18} tone="outside" lines={['CR12']} size={SIZE} />
      <Box x={132} y={184} w={34} h={18} tone="outside" lines={['CRm1']} size={SIZE} />
      <Box x={172} y={184} w={34} h={18} tone="outside" lines={['CRm2']} size={SIZE} />
      <Seg cx={51} cy={222} label="顧客セグメント1" />
      <Cap x={110} y={225} text="…" anchor="middle" color={MUTED} />
      <Seg cx={169} cy={222} label="顧客セグメントm" />

      {/* 回線の記号 ア〜ス */}
      <Label x={55} y={51} text="ア" anchor="end" />
      <Label x={175} y={51} text="イ" anchor="end" />
      <Label x={122} y={58} text="ウ" />
      <Label x={38} y={94} text="エ" anchor="end" />
      <Label x={161} y={100} text="オ" anchor="end" />
      <Label x={111} y={111} text="カ" />
      <Label x={45} y={139} text="キ" anchor="end" />
      <Label x={165} y={139} text="ク" anchor="end" />
      <Label x={111} y={149} text="ケ" />
      <Label x={30} y={178} text="コ" anchor="end" />
      <Label x={94} y={167} text="サ" />
      <Label x={128} y={167} text="シ" />
      <Label x={192} y={178} text="ス" anchor="start" />

      {/* ── ノード：ビル4階 ─────────────────────────── */}
      <Box x={56} y={326} w={42} h={20} tone="device" lines={['L3SW3']} size={SIZE} />
      <Box x={266} y={326} w={42} h={20} tone="device" lines={['L3SW4']} size={SIZE} />
      <Box x={56} y={366} w={42} h={20} tone="device" lines={['L2SW3']} size={SIZE} />
      <Box x={266} y={366} w={42} h={20} tone="device" lines={['L2SW4']} size={SIZE} />
      <Box x={40} y={410} w={34} h={18} tone="outside" lines={['CRn1']} size={SIZE} />
      <Box x={80} y={410} w={34} h={18} tone="outside" lines={['CRn2']} size={SIZE} />
      <Box x={206} y={410} w={34} h={18} tone="outside" lines={['CRx1']} size={SIZE} />
      <Box x={256} y={410} w={34} h={18} tone="outside" lines={['CRx2']} size={SIZE} />
      <Seg cx={77} cy={446} label="顧客セグメントn" />
      <Cap x={156} y={449} text="…" anchor="middle" color={MUTED} />
      <Seg cx={248} cy={446} label="顧客セグメントx" />

      {/* ── 強調の文字 ─────────────────────────────────── */}
      {highlight && (
        <g>
          <Callout
            x={73}
            y={257}
            w={147}
            lines={['光側が切れても電気側はリンクアップ']}
            leader={[
              [220, 266.4],
              [226, 266.4],
            ]}
          />
          <Callout
            x={104}
            y={346}
            w={101}
            lines={['1本では 2G を運べない']}
            leader={[
              [104, 355.4],
              [93.5, 355.4],
            ]}
          />
        </g>
      )}

      {/* ── 凡例と注記（原図は図の下）────────────────────── */}
      <Cap x={6} y={504} text="CR：顧客ルータ" size={7} color={MUTED} />
      <Cap x={110} y={504} text="L2SW：レイヤ2スイッチ" size={7} color={MUTED} />
      <Cap x={222} y={504} text="L3SW：レイヤ3スイッチ" size={7} color={MUTED} />
      <Cap x={6} y={516} text="M：監視装置" size={7} color={MUTED} />
      <Cap x={110} y={516} text="ONU：光回線終端装置" size={7} color={MUTED} />
      <Cap x={6} y={531} text="注記1" size={7} color={MUTED} />
      <Wire x1={34} y1={528} x2={52} y2={528} width={THICK} />
      <Cap x={55} y={531} text="は 10GBASE-SR，" size={7} color={MUTED} />
      <Poly points={[[130, 528], [133, 528], [136, 524], [140, 532], [144, 524], [148, 532], [151, 528], [154, 528]]} />
      <Cap x={157} y={531} text="は 1000BASE-LX，" size={7} color={MUTED} />
      <Wire x1={34} y1={540} x2={52} y2={540} />
      <Cap x={55} y={543} text="は 1000BASE-T を示す。" size={7} color={MUTED} />
      <Cap x={6} y={556} text="注記2 ビル3階とビル4階の間の" size={7} color={MUTED} />
      <Poly points={[[116, 553], [119, 553], [122, 549], [126, 557], [130, 549], [134, 557], [137, 553], [140, 553]]} />
      <Cap x={143} y={556} text="に接続している" size={7} color={MUTED} />
      <rect x={197} y={549} width={7} height={7} fill={MC} />
      <Cap x={207} y={556} text="は，メディアコンバータを示す。" size={7} color={MUTED} />
      <Cap x={6} y={569} text="注記3" size={7} color={MUTED} />
      <Wire x1={34} y1={566} x2={52} y2={566} dash={ADDED} />
      <Cap x={55} y={569} text="は，増強によって追加される回線を示す。" size={7} color={MUTED} />
      <Cap x={6} y={582} text="注記4" size={7} color={MUTED} />
      <rect x={34} y={574} width={18} height={9} fill={`url(#${hatch})`} stroke={SEGMENT} strokeWidth={1} strokeDasharray="3 2" />
      <Cap x={55} y={582} text="は，新規顧客を追加したときの構成を示す。" size={7} color={MUTED} />
    </FigSvg>
  )
}

