import type { ComponentType } from 'react'
import type { Afternoon1FigureId } from '../../../data/afternoon1/figureIds'

/**
 * 試験図の描画コンポーネント登録簿。
 *
 * IPA の図は著作権上ビットマップで取り込めないため、同じ情報・同じ構造・同じラベルを
 * 自作 SVG で描き直したものをここに登録する。図ごとに専用コンポーネントを書く
 * （汎用レンダラでは試験図の表現力に足りないため）。
 *
 * SVG を書くときの約束:
 *   - モバイル 375px で崩れないこと。レイアウトは再構成してよいが情報は落とさない
 *   - 設問が参照する記号（(a) 等）は原図と同じ記号・同じ位置関係にする
 *   - <marker id> などの id はページ内で一意にする（同一ページに複数図が並ぶため）
 *   - 色・線・余白は教科書図のトークン（figureTokens.ts）に揃える
 *
 * 全 id が揃ったら Partial を外して網羅性を型で縛る。
 */
export const EXAM_FIGURES: Partial<Record<Afternoon1FigureId, ComponentType>> = {
  // （P2 で登録）
}
