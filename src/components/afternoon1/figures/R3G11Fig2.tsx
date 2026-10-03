import { Box, Callout, Cap, Ell, FigSvg, Ring, Route, Wire } from './primitives'
import { PORT_SIZE, SIZE, TEXT } from './r3g11Layout'
import { FONT_SCALE, LOGICAL, MUTED, TONE } from './tokens'
import type { ExamFigureProps } from './tokens'

/**
 * 図2 RT の利用構成 — R3 午後Ⅰ 問1
 *
 * 原図は 機器1・2 → RT → ISP-C（上にインターネット）→ RT → 機器3・4 の横一列で、右上に RT 管理コントローラ。
 * 340 の幅にそのまま入るので組み直していない。L2 over IP トンネル（破線の角丸）は原図どおり、左の RT の BP から
 * ISP-C の下半分を通って右の RT の BP までを1本で描き、RT と ISP-C の上に重ねる。凡例（トンネルの見本と略語）は SVG の中、
 * 文だけの注記1・2 は examFigures の note に置く。
 *
 * 色は役割だけで決めている。RT は device、機器1〜4 は host、
 * インターネット・ISP-C（C 社の網）と RT 管理コントローラ（C 社の持ち物）は outside。
 *
 * 解説を開いたときは、RP の機器1 からインターネットへ出る道筋をなぞり（設問2(4)）、
 * トンネルに吹き出し（設問2(3)）、RT 管理コントローラに輪（設問2(1)）を付ける。
 */

/** 縦長の RT。文字は原図どおりトンネルより上に置く */
function TallRt({ x }: { x: number }) {
  const t = TONE.device
  return (
    <g>
      <rect x={x} y={38} width={34} height={76} rx={2} fill={t.fill} stroke={t.stroke} strokeWidth={1.2} />
      <text x={x + 17} y={64} textAnchor="middle" fontSize={SIZE * FONT_SCALE} fontWeight={700} fill={t.text}>
        RT
      </text>
    </g>
  )
}

/** ポート名（RP・BP・EP） */
function Port({ x, y, text, anchor = 'start' }: { x: number; y: number; text: string; anchor?: 'start' | 'end' }) {
  return <Cap x={x} y={y} text={text} anchor={anchor} size={PORT_SIZE} color={TEXT} />
}

export default function R3G11Fig2({ highlight = false }: ExamFigureProps) {
  return (
    <FigSvg w={340} h={176} title="図2 RT の利用構成">
      {/* ── 線 ─────────────────────────────────────── */}
      <Wire x1={36} y1={38} x2={70} y2={56} />
      <Wire x1={36} y1={114} x2={70} y2={92} />
      <Wire x1={104} y1={72} x2={143} y2={72} />
      <Wire x1={201} y1={72} x2={238} y2={72} />
      <Wire x1={304} y1={38} x2={272} y2={56} />
      <Wire x1={304} y1={114} x2={272} y2={92} />
      {/* RT 管理コントローラ ── ISP-C（インターネットの楕円の右を通る） */}
      <Wire x1={226} y1={24} x2={201} y2={80} />

      {/* ── 強調：RP の機器がインターネットへ出る道筋と、RT 管理コントローラの輪 ── */}
      {highlight && (
        <g>
          <Route
            points={[
              [36, 38],
              [70, 56],
              [87, 64],
              [104, 72],
              [143, 72],
              [172, 72],
              [172, 50],
            ]}
          />
          <Ring x={210} y={4} w={82} h={20} />
        </g>
      )}

      {/* ── ノード ───────────────────────────────────── */}
      <Box x={2} y={28} w={34} h={20} tone="host" lines={['機器1']} size={SIZE} />
      <Box x={2} y={104} w={34} h={20} tone="host" lines={['機器2']} size={SIZE} />
      <Box x={304} y={28} w={34} h={20} tone="host" lines={['機器3']} size={SIZE} />
      <Box x={304} y={104} w={34} h={20} tone="host" lines={['機器4']} size={SIZE} />
      <TallRt x={70} />
      <TallRt x={238} />
      <Ell cx={172} cy={50} rx={36} ry={14} tone="outside" lines={['インターネット']} size={SIZE} />
      <Ell cx={172} cy={76} rx={30} ry={16} tone="outside" lines={['ISP-C']} size={SIZE} />
      <Box x={210} y={4} w={82} h={20} tone="outside" lines={['RT管理コントローラ']} size={SIZE} />
      {/* L2 over IP トンネル（左の RT の BP から右の RT の BP まで。RT と ISP-C の上に重ねる） */}
      <rect
        x={70}
        y={84}
        width={202}
        height={16}
        rx={6}
        fill="none"
        stroke={LOGICAL}
        strokeWidth={1.1}
        strokeDasharray="4 2.5"
      />

      <Port x={67} y={66} text="RP" anchor="end" />
      <Port x={67} y={86} text="BP" anchor="end" />
      <Port x={107} y={68} text="EP" />
      <Port x={235} y={68} text="EP" anchor="end" />
      <Port x={275} y={66} text="RP" />
      <Port x={275} y={86} text="BP" />

      {/* ── 凡例（原図どおりトンネルの見本と略語） ──────────── */}
      <rect x={4} y={133} width={26} height={10} rx={5} fill="none" stroke={LOGICAL} strokeWidth={1.1} strokeDasharray="4 2.5" />
      <Cap x={32} y={141.5} text="：L2 over IP トンネル" size={7} color={MUTED} />
      <Cap x={4} y={156} text="BP：ブリッジポート" size={7} color={MUTED} />
      <Cap x={92} y={156} text="EP：外部接続ポート" size={7} color={MUTED} />
      <Cap x={190} y={156} text="ISP-C：C社のネットワーク" size={7} color={MUTED} />
      <Cap x={4} y={170} text="RP：ルーティングポート" size={7} color={MUTED} />

      {/* ── 強調の文字（トンネルの下の空いた所） ─────────── */}
      {highlight && (
        <Callout
          x={132}
          y={106}
          w={80}
          lines={['BP どうしは', '同じ L2 セグメント']}
          leader={[
            [172, 106],
            [172, 100],
          ]}
        />
      )}
    </FigSvg>
  )
}
