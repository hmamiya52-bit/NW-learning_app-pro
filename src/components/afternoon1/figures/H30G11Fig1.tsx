import { Cap, FigSvg, Ring, Route } from './primitives'
import H30G11Base from './H30G11Base'
import { A_Y, B_Y, BR_LINES, BR_PC, DMZ_SW, FW, HATCH, HQ_UP_X, L3, PROXY, RETIRE_FILL, TRIP_PC } from './h30g11Layout'
import type { Pt } from './h30g11Layout'
import { MUTED, SEGMENT, useFigureId } from './tokens'
import type { ExamFigureProps } from './tokens'

/**
 * 図1 F 社の現行ネットワーク構成（抜粋）— H30 午後Ⅰ 問1
 *
 * 下絵は H30G11Base（図2 と共通）。原図の並び（上の段に出張先・インターネット・G 社 SaaS、下の段に本社と4枚重ねの営業所）は変えず、
 * 社内 PC の箱を2行にして 340 の幅に入れた。略語の説明と注記1・2 は、見本の記号（網掛けの破線の四角・黒塗りの四角）ごと図の下に描く。
 *
 * 解説を開いたときは、
 *   - 営業所の社内 PC から IPsec VPN で本社に入り、L3SW・FW を通ってプロキシサーバへ向かう道筋をなぞる
 *     （営業所の通信も本社のプロキシを通る。ハブアンドスポーク）
 *   - プロキシサーバに輪を付ける（設問1・設問2）
 *   - 網掛けの出張先の PC に輪を付ける（本社を通らずに G 社 SaaS を使う。設問3(5)）
 */

/** 営業所の社内 PC → L2SW → IPsec ルータ → インターネット → 本社の IPsec ルータ → L3SW → FW → L2SW → プロキシサーバ */
const BRANCH_TO_PROXY: Pt[] = [
  [BR_PC[0].x + BR_PC[0].w / 2, 252],
  [BR_PC[0].x + BR_PC[0].w / 2, BR_PC[0].y],
  [250, 223],
  [256, 214],
  [256, 205],
  [273, 195],
  [281, 180],
  ...BR_LINES[0].slice().reverse(),
  [HQ_UP_X, 41],
  [HQ_UP_X, 168],
  [HQ_UP_X, B_Y],
  [L3.x + L3.w, B_Y],
  [FW.x + FW.w / 2, B_Y],
  [FW.x + FW.w / 2, L3.y],
  [FW.x + FW.w / 2, A_Y],
  [DMZ_SW.x, A_Y],
  [PROXY.x, A_Y],
  [PROXY.x + PROXY.w / 2, A_Y],
]

export default function H30G11Fig1({ highlight = false }: ExamFigureProps) {
  const hatch = useFigureId('h30g11f1-hatch')
  return (
    <FigSvg w={340} h={326} title="図1 F 社の現行ネットワーク構成（抜粋）">
      <H30G11Base
        underlay={
          highlight && (
            <g>
              <Ring {...PROXY} />
              <Ring {...TRIP_PC} />
              <Route points={BRANCH_TO_PROXY} />
            </g>
          )
        }
      />

      {/* ── 略語の説明と注記1・2（見本の記号ごと） ─────────────── */}
      <defs>
        <pattern id={hatch} width={4} height={4} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1={0} y1={0} x2={0} y2={4} stroke={HATCH} strokeWidth={1} />
        </pattern>
      </defs>
      <Cap x={6} y={287} text="FW：ファイアウォール" size={7} color={MUTED} />
      <Cap x={84} y={287} text="L2SW：レイヤ2スイッチ" size={7} color={MUTED} />
      <Cap x={172} y={287} text="L3SW：レイヤ3スイッチ" size={7} color={MUTED} />
      <Cap x={6} y={303} text="注記1" size={7} color={MUTED} />
      <rect x={34} y={295} width={18} height={10} fill={`url(#${hatch})`} stroke={SEGMENT} strokeWidth={1} strokeDasharray="3 2" />
      <Cap x={56} y={303} text="は，G社SaaS導入に伴って追加予定の構成を示す。" size={7} color={MUTED} />
      <Cap x={6} y={319} text="注記2" size={7} color={MUTED} />
      <rect x={34} y={311} width={18} height={10} fill={RETIRE_FILL} />
      <Cap x={56} y={319} text="は，G社SaaS導入後，廃止予定の機器を示す。" size={7} color={MUTED} />
    </FigSvg>
  )
}
