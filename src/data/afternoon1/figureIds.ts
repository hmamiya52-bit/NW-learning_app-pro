// 午後Ⅰ解説で再現する試験図の id 一覧
//
// IPA の図をビットマップで取り込まず、同じ情報・同じ構造を自作 SVG で描き直す。
// 図ごとの専用コンポーネントを src/components/afternoon1/figures/ に置き、
// ここの id で対応付ける。
//
// id を足したら:
//   1. figures/index.ts の EXAM_FIGURES に描画コンポーネントを登録する
//   2. 未登録の id を解説データから参照すると「準備中」表示になる（validate-data が検出する）

export const AFTERNOON1_FIGURE_IDS = [
  // ─── R6 午後Ⅰ 問1（コンテンツ配信ネットワーク）─────────────
  'R6-G1-1-fig1', // 図1 D社データセンターの構成（抜粋）
  'R6-G1-1-tab1', // 表1 ゲームファイルの配信に利用するIPアドレスとポート番号
  'R6-G1-1-fig2', // 図2 BGP anycast 方式によるE社の経路広告イメージ
  'R6-G1-1-fig3', // 図3 E社POPの概要（抜粋）
] as const

export type Afternoon1FigureId = (typeof AFTERNOON1_FIGURE_IDS)[number]
