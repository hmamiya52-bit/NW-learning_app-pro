// 午後Ⅰ 試験問題の図表（自作 SVG での再現）
//
// 解説（explanations.ts）ではなく「解く側の材料」なので、公式設問文（questionTexts/）と
// 同じ扱いで問題 id 別に持つ。解説が未投入でも、解答欄と詳細解説の両方に出る。
//
// 著作権: IPA の図をビットマップで取り込むことはしない。同じ情報・同じ構造・同じラベルを
//        自作 SVG で描き直したものを src/components/afternoon1/figures/ に置き、
//        figureId で参照する。title と注記は原図の図題・注記に合わせる。

import type { Afternoon1Figure } from './explanations'

/** 問題 id → その問題が参照する図表（原図の並び順） */
export const afternoon1ExamFigures: Record<string, Afternoon1Figure[]> = {
  // ─── R6 午後Ⅰ 問1：コンテンツ配信ネットワーク ────────────────
  'R6-G1-1': [
    {
      kind: 'exam',
      figureId: 'R6-G1-1-fig1',
      title: '図1 D社データセンターの構成（抜粋）',
      note: '注記 α配信サーバは，ゲームαのゲームファイルを配信するサーバである（β，γも同様）。',
    },
    {
      kind: 'exam',
      figureId: 'R6-G1-1-tab1',
      title: '表1 ゲームファイルの配信に利用する IP アドレスとポート番号',
      note: '注記 203.x.11.21 はグローバル IP アドレス',
    },
    {
      kind: 'exam',
      figureId: 'R6-G1-1-fig2',
      title: '図2 BGP anycast 方式による E 社の経路広告イメージ',
      note: '注記 AS-E は E 社の AS，AS-G はゲーム端末が接続する ISP の AS を示す。',
    },
    {
      kind: 'exam',
      figureId: 'R6-G1-1-fig3',
      title: '図3 E 社 POP の概要（抜粋）',
      note: '注記 装置間の接続と ISP の接続は，全て 10G ビットイーサネットである。',
    },
  ],
}

/** 指定した問題の図表を返す（未作成なら空） */
export function getAfternoon1ExamFigures(problemId: string): Afternoon1Figure[] {
  return afternoon1ExamFigures[problemId] ?? []
}
