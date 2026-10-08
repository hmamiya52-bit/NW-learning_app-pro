import { FigSvg, Ring, Route } from './primitives'
import H30G11Base from './H30G11Base'
import { B_Y, BR_LINES, BR_PC, CTRL, HQ_L2, HQ_PC, HQ_UP_X, L3, ROW_Y, SAAS_SRV } from './h30g11Layout'
import type { Pt } from './h30g11Layout'
import type { ExamFigureProps } from './tokens'

/**
 * 図2 SD-WAN ルータを使用したネットワーク構成案（抜粋）— H30 午後Ⅰ 問1
 *
 * 下絵は H30G11Base（図1 と共通）に `sdwan` を渡したもの。グループウェアサーバが無くなり、本社と営業所の IPsec ルータが
 * SD-WAN ルータに替わり、本社に SD-WAN コントローラが加わる（原図どおり線は無い）。注記（SD-WAN コントローラの接続構成は省略する）は
 * 記号を持たないので examFigures の note に置く。
 *
 * 解説を開いたときは、
 *   - 本社の社内 PC から L3SW・SD-WAN ルータを通ってインターネットへ出て G 社 SaaS へ向かう道筋をなぞる
 *     （L3SW の既定の経路の行き先を SD-WAN ルータにする。設問3(2)）
 *   - 営業所の社内 PC から営業所の SD-WAN ルータを通って G 社 SaaS へ向かう道筋をなぞる（各拠点から直接出る）
 *   - SD-WAN コントローラに輪を付ける（設問3(3)）
 */

/** インターネット → G 社 SaaS のグループウェアサーバ群（2本の道筋で共通の終わり） */
const TO_SAAS: Pt[] = [
  [226, ROW_Y],
  [SAAS_SRV.x, ROW_Y],
  [SAAS_SRV.x + SAAS_SRV.w / 2, ROW_Y],
]

/** 本社の社内 PC → L2SW → L3SW → SD-WAN ルータ → インターネット → G 社 SaaS */
const HQ_TO_SAAS: Pt[] = [
  [HQ_PC[0].x + HQ_PC[0].w / 2, 252],
  [HQ_PC[0].x + HQ_PC[0].w / 2, HQ_PC[0].y],
  [37, 223],
  [HQ_L2[0].x + HQ_L2[0].w / 2, 214],
  [HQ_L2[0].x + HQ_L2[0].w / 2, HQ_L2[0].y],
  [75, L3.y + L3.h],
  [81, B_Y],
  [L3.x + L3.w, B_Y],
  [HQ_UP_X, B_Y],
  [HQ_UP_X, 168],
  [HQ_UP_X, 41],
  ...TO_SAAS,
]

/** 営業所の社内 PC → L2SW → SD-WAN ルータ → インターネット → G 社 SaaS */
const BRANCH_TO_SAAS: Pt[] = [
  [BR_PC[0].x + BR_PC[0].w / 2, 252],
  [BR_PC[0].x + BR_PC[0].w / 2, BR_PC[0].y],
  [250, 223],
  [256, 214],
  [256, 205],
  [273, 195],
  [281, 180],
  ...BR_LINES[0].slice().reverse(),
  ...TO_SAAS,
]

export default function H30G11Fig2({ highlight = false }: ExamFigureProps) {
  return (
    <FigSvg w={340} h={276} title="図2 SD-WAN ルータを使用したネットワーク構成案（抜粋）">
      <H30G11Base
        sdwan
        underlay={
          highlight && (
            <g>
              <Ring {...CTRL} />
              <Route points={HQ_TO_SAAS} />
              <Route points={BRANCH_TO_SAAS} />
            </g>
          )
        }
      />
    </FigSvg>
  )
}
