import { Box, Callout, Cap, Ell, FigSvg, Poly, Ring, Route, SolidFrame, Wire } from './primitives'
import { FONT_SCALE, MUTED, TONE, useFigureId } from './tokens'
import type { ExamFigureProps, ToneName } from './tokens'

/**
 * 図1 Z社の現在のネットワーク構成（抜粋）— H25 午後Ⅰ 問2
 *
 * 原図は商品本部を左、本社を右に並べ、あいだを IP-VPN でつなぐ横長の図。
 * 375px に収めるため、商品本部を上、本社を下に並べ直した。
 * それぞれの拠点の中の並び（L2SW が上、SW が中、PC が下）と、どの箱がどの箱とつながるかは原図どおり。
 * 上下に並べたぶん、ルータ2 から IP-VPN への線は商品本部の右端を下りる。
 *
 * 色は役割だけで決めている。ルータ・L2SW・SW は device、サーバ・PC・プリンタは host、
 * IP-VPN（通信事業者の網）は outside。原図の網掛け（注記: 増設予定の SW5）は色ではなく斜線で残す。
 *
 * 解説を開いたときは、DHCP サーバから L2SW1 までと、SW1 ⇔ L2SW1 ⇔ SW2 の往復を赤でなぞり、
 * SW1・SW2 の組と SW5 とルータ2 に輪を付ける（設問3(3)・設問3(1) c・設問1 ア）。
 */

/** 網掛けの斜線の色（原図の網掛けを表す。役割の色ではない） */
const HATCH = '#94a3b8'
/** 箱の文字の大きさ（Box の size） */
const SIZE = 8

/** 網掛けの箱（増設予定の SW5）。役割の色の上に斜線を重ね、その上に文字を置く */
function HatchBox({
  x,
  y,
  w,
  h,
  tone,
  label,
  patternId,
}: {
  x: number
  y: number
  w: number
  h: number
  tone: ToneName
  label: string
  patternId: string
}) {
  const t = TONE[tone]
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

/** アクセス用 SW の下の PC 2台（左は斜め、右は真下。原図の枝の形） */
const PC_X = [14, 86, 146, 218]
const PC_W = 40

/** DHCP サーバ → L2SW1（OFFER・ACK のブロードキャストが出てくる所） */
const FROM_SERVER: [number, number][] = [
  [299, 215],
  [136, 215],
]
/** SW1 ⇔ L2SW1 ⇔ SW2（折り返しが往復する道筋） */
const LOOP: [number, number][] = [
  [106, 271],
  [106, 262],
  [124, 224],
  [136, 215],
  [148, 224],
  [166, 262],
  [166, 271],
]

export default function H25G12Fig1({ highlight = false }: ExamFigureProps) {
  const hatch = useFigureId('h25g12-hatch')
  return (
    <FigSvg w={340} h={362} title="図1 Z社の現在のネットワーク構成（抜粋）">
      <defs>
        <pattern id={hatch} width={4} height={4} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1={0} y1={0} x2={0} y2={4} stroke={HATCH} strokeWidth={1} />
        </pattern>
      </defs>

      {/* ── 囲み ───────────────────────────────────── */}
      <SolidFrame x={4} y={4} w={332} h={118} label="商品本部" />
      <SolidFrame x={4} y={160} w={332} h={168} label="本社" />

      {/* ── 線 ─────────────────────────────────────── */}
      {/* 商品本部 */}
      <Wire x1={164} y1={33} x2={262} y2={33} />
      <Wire x1={124} y1={42} x2={106} y2={60} />
      <Wire x1={148} y1={42} x2={166} y2={60} />
      <Wire x1={188} y1={69} x2={204} y2={69} />
      <Wire x1={106} y1={78} x2={34} y2={96} />
      <Wire x1={106} y1={78} x2={106} y2={96} />
      <Wire x1={166} y1={78} x2={166} y2={96} />
      <Wire x1={166} y1={78} x2={238} y2={96} />
      {/* ルータ2 → IP-VPN → ルータ1 */}
      <Poly
        points={[
          [289, 42],
          [289, 141],
          [204, 141],
        ]}
      />
      <Poly
        points={[
          [132, 141],
          [47, 141],
          [47, 206],
        ]}
      />
      {/* 本社 */}
      <Wire x1={74} y1={215} x2={108} y2={215} />
      <Wire x1={164} y1={215} x2={272} y2={215} />
      <Wire x1={164} y1={208} x2={272} y2={188} />
      <Wire x1={160} y1={224} x2={299} y2={262} />
      <Wire x1={124} y1={224} x2={106} y2={262} />
      <Wire x1={148} y1={224} x2={166} y2={262} />
      <Wire x1={68} y1={271} x2={84} y2={271} />
      <Wire x1={106} y1={280} x2={34} y2={302} />
      <Wire x1={106} y1={280} x2={106} y2={302} />
      <Wire x1={166} y1={280} x2={166} y2={302} />
      <Wire x1={166} y1={280} x2={238} y2={302} />

      {/* ── 強調：輪と、折り返しの道筋（ノードより先）── */}
      {highlight && (
        <g>
          <Ring x={84} y={262} w={104} h={18} />
          <Ring x={272} y={262} w={54} h={18} />
          <Ring x={262} y={24} w={54} h={18} />
          <Route points={FROM_SERVER} />
          <Route points={LOOP} />
        </g>
      )}

      {/* ── ノード ───────────────────────────────────── */}
      {/* 商品本部 */}
      <Box x={108} y={24} w={56} h={18} tone="device" lines={['L2SW2']} size={SIZE} />
      <Box x={262} y={24} w={54} h={18} tone="device" lines={['ルータ2']} size={SIZE} />
      <Box x={84} y={60} w={44} h={18} tone="device" lines={['SW3']} size={SIZE} />
      <Box x={144} y={60} w={44} h={18} tone="device" lines={['SW4']} size={SIZE} />
      <Box x={204} y={60} w={54} h={18} tone="host" lines={['プリンタ']} size={SIZE} />
      {PC_X.map((x) => (
        <Box key={`u${x}`} x={x} y={96} w={PC_W} h={18} tone="host" lines={['PC']} size={SIZE} />
      ))}
      <Cap x={70} y={108} text="…" anchor="middle" />
      <Cap x={202} y={108} text="…" anchor="middle" />

      {/* IP-VPN */}
      <Ell cx={168} cy={141} rx={36} ry={12} tone="outside" lines={['IP-VPN']} size={SIZE} />

      {/* 本社 */}
      <Box x={272} y={166} w={54} h={30} tone="host" lines={['Web', 'サーバ']} size={SIZE} />
      <Box x={272} y={200} w={54} h={30} tone="host" lines={['DHCP', 'サーバ']} size={SIZE} />
      <Box x={20} y={206} w={54} h={18} tone="device" lines={['ルータ1']} size={SIZE} />
      <Box x={108} y={206} w={56} h={18} tone="device" lines={['L2SW1']} size={SIZE} />
      <Box x={14} y={262} w={54} h={18} tone="host" lines={['プリンタ']} size={SIZE} />
      <Box x={84} y={262} w={44} h={18} tone="device" lines={['SW1']} size={SIZE} />
      <Box x={144} y={262} w={44} h={18} tone="device" lines={['SW2']} size={SIZE} />
      <HatchBox x={272} y={262} w={54} h={18} tone="device" label="SW5" patternId={hatch} />
      {PC_X.map((x) => (
        <Box key={`h${x}`} x={x} y={302} w={PC_W} h={18} tone="host" lines={['PC']} size={SIZE} />
      ))}
      <Cap x={70} y={314} text="…" anchor="middle" />
      <Cap x={202} y={314} text="…" anchor="middle" />

      {/* ── 強調の文字（空いている所に吹き出しを置く）── */}
      {highlight && (
        <g>
          <Callout
            x={8}
            y={227}
            w={76}
            lines={['SW1・SW2 が', '折り返し続ける']}
            leader={[
              [84, 243],
              [115, 243],
            ]}
          />
          <Callout
            x={268}
            y={290}
            w={62}
            lines={['作業3 の', 'PC1・PC2']}
            leader={[
              [299, 290],
              [299, 283],
            ]}
          />
        </g>
      )}

      {/* ── 凡例・注記 ─────────────────────────────────── */}
      <Cap x={4} y={343} text="L2SW：レイヤ2スイッチ" size={7} color={MUTED} />
      <Cap x={132} y={343} text="SW：アクセス用レイヤ2スイッチ" size={7} color={MUTED} />
      <Cap x={4} y={357} text="注記" size={7} color={MUTED} bold />
      <Cap x={26} y={357} text="SW5 は，増設予定の SW である。" size={7} color={MUTED} />
    </FigSvg>
  )
}
