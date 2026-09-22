import type { ComponentType } from 'react'
import type { Afternoon1FigureId } from '../../../data/afternoon1/figureIds'
import R6G11Fig1 from './R6G11Fig1'
import R6G11Tab1 from './R6G11Tab1'
import R6G11Fig2 from './R6G11Fig2'
import R6G11Fig3 from './R6G11Fig3'
import R6G12Fig1 from './R6G12Fig1'
import R6G12Tab1 from './R6G12Tab1'
import R6G12Tab2 from './R6G12Tab2'
import R6G12Fig2 from './R6G12Fig2'
import R6G12Fig3 from './R6G12Fig3'

/**
 * 試験図の描画コンポーネント登録簿。
 *
 * IPA の図は著作権上ビットマップで取り込めないため、同じ情報・同じ構造・同じラベルを
 * 自作 SVG で描き直したものをここに登録する。図ごとに専用コンポーネントを書く
 * （汎用レンダラでは試験図の表現力に足りないため）。
 *
 * SVG を書くときの約束:
 *   - モバイル 375px（表示幅およそ 280px）で崩れないこと。viewBox 幅 340 を基準にする
 *   - レイアウトは組み直してよいが、ノード・リンク・ラベル・番号・凡例は落とさない
 *   - 設問が参照する記号（(a) 等）は原図と同じ記号・同じ位置関係にする
 *   - <marker id> はページ内で一意にする（useFigureId を使う）
 *   - 色・線は primitives.tsx の TONE に揃える（教科書の構成図と同じ見た目になる）
 *
 * Record（Partial ではない）なので、figureIds.ts に id を足すと
 * ここに登録するまで型エラーになる。
 */
export const EXAM_FIGURES: Record<Afternoon1FigureId, ComponentType> = {
  'R6-G1-1-fig1': R6G11Fig1,
  'R6-G1-1-tab1': R6G11Tab1,
  'R6-G1-1-fig2': R6G11Fig2,
  'R6-G1-1-fig3': R6G11Fig3,
  'R6-G1-2-fig1': R6G12Fig1,
  'R6-G1-2-tab1': R6G12Tab1,
  'R6-G1-2-tab2': R6G12Tab2,
  'R6-G1-2-fig2': R6G12Fig2,
  'R6-G1-2-fig3': R6G12Fig3,
}
