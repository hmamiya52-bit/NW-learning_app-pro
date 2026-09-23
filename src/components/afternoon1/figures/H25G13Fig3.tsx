import { Box, Callout, FigSvg, Ring, Wire } from './primitives'
import { FONT_SCALE, MARK, MARK_FILL, MARK_TEXT } from './tokens'
import type { ExamFigureProps } from './tokens'

/**
 * 図3 監視システム上のマップ — H25 午後Ⅰ 問3
 *
 * 原図どおり、FW 稼働系・FW 待機系 → L3SW → L2SW（左下の1台）だけを描く。
 * 原図の注記のとおり一部が省略されていて、それを描き足すのが設問3(1)。
 *
 * 色は役割だけで決めている。FW・L3SW・L2SW はすべて C 社の NW 基盤の装置なので device。
 *
 * 解説を開いたときは、解答例で描き足す L2SW 2台とその線を赤の破線で重ねる。
 * これは経路の強調ではなく解答の描き込みなので、§5.4 の検査5 の対象外だと分かるよう
 * data-role="answer" を付けている（線の両端が L3SW と描き足した L2SW に入っていることは別に確かめる）。
 */

/** 解答例で描き足す L2SW（左上の x） */
const ADDED_L2SW = [150, 242]

export default function H25G13Fig3({ highlight = false }: ExamFigureProps) {
  return (
    <FigSvg w={340} h={124} title="図3 監視システム上のマップ">
      {/* ── 線 ─────────────────────────────────────── */}
      <Wire x1={132} y1={34} x2={160} y2={55} />
      <Wire x1={208} y1={34} x2={180} y2={55} />
      <Wire x1={158} y1={73} x2={88} y2={99} />

      {/* ── 強調：輪と、設問3(1)の解答の描き込み（ノードより先）── */}
      {highlight && (
        <g>
          <Ring x={112} y={6} w={40} h={28} />
          <Ring x={188} y={6} w={40} h={28} />
          <Ring x={150} y={55} w={40} h={18} />
          <g data-role="answer">
            <line x1={170} y1={73} x2={170} y2={99} stroke={MARK} strokeWidth={1.6} strokeDasharray="4 2" />
            <line x1={182} y1={73} x2={254} y2={99} stroke={MARK} strokeWidth={1.6} strokeDasharray="4 2" />
          </g>
        </g>
      )}

      {/* ── ノード ───────────────────────────────────── */}
      <Box x={112} y={6} w={40} h={28} tone="device" lines={['FW', '稼働系']} size={7} />
      <Box x={188} y={6} w={40} h={28} tone="device" lines={['FW', '待機系']} size={7} />
      <Box x={150} y={55} w={40} h={18} tone="device" lines={['L3SW']} size={7} />
      <Box x={58} y={99} w={40} h={18} tone="device" lines={['L2SW']} size={7} />

      {/* ── 強調：描き足す L2SW と、吹き出し ── */}
      {highlight && (
        <g>
          <g data-role="answer">
            {ADDED_L2SW.map((x) => (
              <g key={x}>
                <rect
                  x={x}
                  y={99}
                  width={40}
                  height={18}
                  rx={2}
                  fill={MARK_FILL}
                  stroke={MARK}
                  strokeWidth={1.4}
                  strokeDasharray="4 2"
                />
                <text
                  x={x + 20}
                  y={108 + 7.5 * FONT_SCALE * 0.44}
                  textAnchor="middle"
                  fontSize={7.5 * FONT_SCALE}
                  fontWeight={700}
                  fill={MARK_TEXT}
                >
                  L2SW
                </text>
              </g>
            ))}
          </g>
          <Callout
            x={236}
            y={6}
            w={102}
            lines={['FW は2台のまま', '（管理用 IP が別々）']}
            leader={[
              [236, 20],
              [231.5, 20],
            ]}
          />
          <Callout
            x={38}
            y={50}
            w={104}
            lines={['L3SW はスタックで1台']}
            leader={[
              [142, 59.4],
              [146.5, 62],
            ]}
          />
        </g>
      )}
    </FigSvg>
  )
}
