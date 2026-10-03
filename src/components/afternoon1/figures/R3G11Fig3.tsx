import { Callout, Cap, FigSvg, Ring, Route, SolidFrame, Wire } from './primitives'
import { HqCoreNodes, HqCoreWires, ShopCoreNodes, ShopCoreWires, ShopFrame, VDots } from './R3G11Parts'
import { HQ, PORT_SIZE, SIZE, TEXT } from './r3g11Layout'
import { FONT_SCALE, TONE, useFigureId } from './tokens'
import type { ExamFigureProps, ToneName } from './tokens'

/**
 * 図3 ネットワーク更改後の在庫管理システムの構成（抜粋）— R3 午後Ⅰ 問1
 *
 * 原図の並び（左上に C 社データセンタ、その下に本社、上の真ん中にインターネットと ISP-C、右に店舗）のまま描いた。
 * 本社と店舗の在庫管理システムの部分は図1 と同じ位置（r3g11Layout.ts・R3G11Parts.tsx）。
 * ポート名（EP・RP・BP）と IF 名（IF1〜IF3）は原図どおり線の脇に置く。店舗の枠は原図どおり2枚重ね。
 *
 * 色は役割だけで決めている。RT00・RT01・L2SW・Wi-Fi AP は device、サーバと在庫管理端末は host、
 * インターネット・ISP-C と RT 管理コントローラ（C 社の持ち物）は outside。
 * 原図の網掛け（注記1: ネットワーク更改で追加される箇所）は色ではなく斜線で残す。
 *
 * 解説を開いたときは、店舗の在庫管理端末から運用管理サーバまでの道筋をなぞり（設問2(3)）、
 * Wi-Fi AP（設問2(4)）・運用管理サーバと RT 管理コントローラ（設問3(2)）に輪を付ける。
 */

/** 網掛けの斜線の色（原図の網掛けを表す。役割の色ではない） */
const HATCH = '#94a3b8'

const HQ_Y = 80
const HQ_CORE = 154
const SHOP_Y = 18
const SHOP_CORE = 92

/** 網掛けの箱（更改で追加される機器）。役割の色の上に斜線を重ね、その上に文字を置く */
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
  const fs = SIZE * FONT_SCALE
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

/** 網掛けの楕円（更改で WAN になるインターネットと ISP-C） */
function HatchEll({
  cx,
  cy,
  rx,
  ry,
  label,
  patternId,
}: {
  cx: number
  cy: number
  rx: number
  ry: number
  label: string
  patternId: string
}) {
  const t = TONE.outside
  const fs = SIZE * FONT_SCALE
  return (
    <g>
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={t.fill} stroke={t.stroke} strokeWidth={1.2} />
      <ellipse cx={cx} cy={cy} rx={rx - 0.6} ry={ry - 0.6} fill={`url(#${patternId})`} />
      <text x={cx} y={cy + fs * 0.44} textAnchor="middle" fontSize={fs} fontWeight={700} fill={t.text}>
        {label}
      </text>
    </g>
  )
}

/** ポート名・IF 名 */
function Port({
  x,
  y,
  text,
  anchor = 'start',
}: {
  x: number
  y: number
  text: string
  anchor?: 'start' | 'middle' | 'end'
}) {
  return <Cap x={x} y={y} text={text} anchor={anchor} size={PORT_SIZE} color={TEXT} />
}

export default function R3G11Fig3({ highlight = false }: ExamFigureProps) {
  const hatch = useFigureId('r3g11-hatch')
  return (
    <FigSvg w={340} h={250} title="図3 ネットワーク更改後の在庫管理システムの構成（抜粋）">
      <defs>
        <pattern id={hatch} width={4} height={4} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1={0} y1={0} x2={0} y2={4} stroke={HATCH} strokeWidth={1} />
        </pattern>
      </defs>

      {/* ── 囲み ───────────────────────────────────── */}
      <SolidFrame x={2} y={6} w={108} h={64} label="C社データセンタ" />
      <SolidFrame x={HQ.x} y={HQ_Y} w={HQ.w} h={166} label="本社" />
      <ShopFrame y={SHOP_Y} h={160} />

      {/* ── 線 ─────────────────────────────────────── */}
      {/* ISP-C から RT 管理コントローラ・RT00 の EP・RT01 の EP・後ろの店舗へ */}
      <Wire x1={97} y1={40} x2={121} y2={40} />
      <Wire x1={152} y1={52} x2={152} y2={111} />
      <Wire x1={176} y1={46} x2={222} y2={58} />
      <Wire x1={170} y1={49} x2={188} y2={72} />
      {/* 本社: 運用管理サーバ ── RT00 の RP、運用管理サーバ ── L2SW00、RT00 の BP ── L2SW00 */}
      <Wire x1={58} y1={121} x2={140} y2={121} />
      <Wire x1={52} y1={136} x2={88} y2={HQ_CORE} />
      <Wire x1={150} y1={131} x2={124} y2={HQ_CORE} />
      <HqCoreWires y0={HQ_CORE} />
      {/* 店舗: RT01 の RP ── Wi-Fi AP、RT01 の BP ── L2SW01 の IF1 */}
      <Wire x1={256} y1={58} x2={278} y2={58} />
      <Wire x1={239} y1={68} x2={239} y2={SHOP_CORE} />
      <ShopCoreWires y0={SHOP_CORE} />

      {/* ── 強調：端末011 → 運用管理サーバの道筋と、輪 ────────── */}
      {highlight && (
        <g>
          <Route
            points={[
              [215, 140],
              [229, 112],
              [239, 102],
              [239, 68],
              [239, 58],
              [222, 58],
              [176, 46],
              [152, 46],
              [152, 52],
              [152, 111],
              [152, 121],
              [150, 131],
              [124, 154],
              [106, 164],
              [88, 154],
              [52, 136],
            ]}
          />
          <Ring x={15} y={30} w={82} h={20} />
          <Ring x={14} y={106} w={44} h={30} />
          <Ring x={278} y={48} w={48} h={20} />
        </g>
      )}

      {/* ── ノード ───────────────────────────────────── */}
      <HatchEll cx={150} cy={18} rx={34} ry={14} label="インターネット" patternId={hatch} />
      <HatchEll cx={150} cy={40} rx={30} ry={12} label="ISP-C" patternId={hatch} />
      <VDots x={184.5} y={53} />

      <HatchBox x={15} y={30} w={82} h={20} tone="outside" lines={['RT管理コントローラ']} patternId={hatch} />
      <Cap x={56} y={63} text="controller.isp-c.net" anchor="middle" size={PORT_SIZE} color={TEXT} />

      <HatchBox x={14} y={106} w={44} h={30} tone="host" lines={['運用管理', 'サーバ']} patternId={hatch} />
      <HatchBox x={140} y={111} w={34} h={20} tone="device" lines={['RT00']} patternId={hatch} />
      <Port x={137} y={117} text="RP" anchor="end" />
      <Port x={156} y={107} text="EP" />
      <Port x={153} y={142} text="BP" />
      <HqCoreNodes y0={HQ_CORE} numbered />

      <HatchBox x={222} y={48} w={34} h={20} tone="device" lines={['RT01']} patternId={hatch} />
      <HatchBox x={278} y={48} w={48} h={20} tone="device" lines={['Wi-Fi AP']} patternId={hatch} />
      <Port x={219} y={51} text="EP" anchor="end" />
      <Port x={267} y={54} text="RP" anchor="middle" />
      <Port x={235} y={80} text="BP" anchor="end" />
      <Port x={243} y={88} text="IF1" />
      <ShopCoreNodes y0={SHOP_CORE} numbered />
      <Port x={221} y={SHOP_CORE + 30} text="IF2" anchor="end" />
      <Port x={213} y={SHOP_CORE + 44} text="IF1" anchor="end" />
      <Port x={257} y={SHOP_CORE + 30} text="IF3" />
      <Port x={265} y={SHOP_CORE + 44} text="IF1" />

      {/* ── 強調の文字 ─────────────────────────────────── */}
      {highlight && (
        <g>
          <Callout
            x={64}
            y={86}
            w={66}
            lines={['ルータを経ない']}
            leader={[
              [80, 104.8],
              [70, 145],
            ]}
          />
          <Callout
            x={274}
            y={78}
            w={55}
            lines={['RP 側から', '本社へ不可']}
            leader={[
              [302, 78],
              [302, 70],
            ]}
          />
        </g>
      )}
    </FigSvg>
  )
}
