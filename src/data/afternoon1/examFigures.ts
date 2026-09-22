// 午後Ⅰ 試験問題の図表（自作 SVG での再現）
//
// 解説（explanations.ts）ではなく「解く側の材料」なので、公式設問文（questionTexts/）と
// 同じ扱いで問題 id 別に持つ。解説が未投入でも、解答欄と詳細解説の両方に出る。
//
// 著作権: IPA の図をビットマップで取り込むことはしない。同じ情報・同じ構造・同じラベルを
//        自作 SVG で描き直したものを src/components/afternoon1/figures/ に置き、
//        figureId で参照する。title と note は原図の図題・注記に合わせる。
//
// points は本アプリの独自解説（図のどこに注目すれば設問が解けるか）。解答に触れるので、
// 解答欄では答え合わせに入ってからでないと開けない（詳細解説ページでは常に開ける）。

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
      points: [
        'ゲーム端末から LB までは HTTPS、LB から配信サーバまでは HTTP。==この変わり目==がサーバ証明書の置き場所を決める（設問1(3)）。',
        '配信サーバは破線のセグメントごとに分かれている。__α・β・γ で別のセグメント__なので、増設先も同じセグメントを選ぶ（設問1(2)イ）。',
        'サーバの箱が重ねて描かれているのは複数台という意味。LB はこの中から1台を選んで振り分ける（設問1(2)ア）。',
      ],
    },
    {
      kind: 'exam',
      figureId: 'R6-G1-1-tab1',
      title: '表1 ゲームファイルの配信に利用する IP アドレスとポート番号',
      note: '注記 203.x.11.21 はグローバル IP アドレス',
      points: [
        'LB 側のポートが 443、配信サーバ側が 80。==HTTPS を終端しているのは LB==だと、この表だけで読み取れる（設問1(3)）。',
        'IP アドレスは3つのゲームで同じ。__振り分けを変えているのは URL__であって、アドレスではない。',
        '所属セグメントはゲームごとに別。ゲームβの行が設問1(2)イの答えになる。',
      ],
    },
    {
      kind: 'exam',
      figureId: 'R6-G1-1-fig2',
      title: '図2 BGP anycast 方式による E 社の経路広告イメージ',
      note: '注記 AS-E は E 社の AS，AS-G はゲーム端末が接続する ISP の AS を示す。',
      points: [
        'AS-E が2つあるのは誤りではない。==同じ AS 番号・同じアドレスブロックを2つの POP から広告する==のが BGP anycast。',
        '東京POP から AS-G へは2本ある。__IX 経由__は AS Path が1つ、__AS-F 経由__は2つ。設問2(2)はこの比較。',
        '実線が装置どうしの接続、破線の双方向矢印が BGP ピア。IX は AS 番号を持たないので AS Path には現れない。',
      ],
    },
    {
      kind: 'exam',
      figureId: 'R6-G1-1-fig3',
      title: '図3 E 社 POP の概要（抜粋）',
      note: '注記 装置間の接続と ISP の接続は，全て 10G ビットイーサネットである。',
      points: [
        '攻撃の道筋は インターネット → ISP → BGPルータ1 → ルータ → FW1 → LB11。==どこで捨てるか==が設問3(1)。',
        '破線は NetFlow の向き。各 BGP ルータから DDoS 検知サーバへ送られるので、__検知の材料は入口で採っている__。',
        'LB は FW1 の配下に3台、FW2 の配下に3台。攻撃対象の LB11 は FW1 側にある。',
      ],
    },
  ],
}

/** 指定した問題の図表を返す（未作成なら空） */
export function getAfternoon1ExamFigures(problemId: string): Afternoon1Figure[] {
  return afternoon1ExamFigures[problemId] ?? []
}
