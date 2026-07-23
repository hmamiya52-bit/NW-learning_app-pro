import type { NoteData } from './types'

export const load_balancer: NoteData = {
  summary: '復習ノート「負荷分散装置（LB）」準拠。LBの目的・分散アルゴリズム・セッション維持機能・冗長化全体まとめを整理。',
  sections: [
    {
      heading: 'LB導入のメリット',
      richItems: [
        [
          { text: '接続先の負荷を分散 ⇒ サーバの ', style: 'plain' },
          { text: '処理能力向上', style: 'red' },
        ],
        [
          { text: '冗長性の確保（', style: 'plain' },
          { text: '可用性', style: 'red' },
          { text: ' の向上）', style: 'plain' },
        ],
      ],
    },
    {
      heading: '負荷分散アルゴリズム',
      richItems: [
        [
          { text: '単純に順番に振り分ける方法：', style: 'plain' },
          { text: 'ラウンドロビン', style: 'red' },
        ],
        [
          { text: 'その他、最もコネクションが少ないサーバに振り分ける方式などもある', style: 'plain' },
        ],
      ],
    },
    {
      heading: 'LBの仮想IPとセッション維持',
      richItems: [
        [
          { text: 'LBには振り分け用の ', style: 'plain' },
          { text: '仮想IPアドレス', style: 'red' },
          { text: ' と、自身の ', style: 'plain' },
          { text: '物理IPアドレス', style: 'red' },
          { text: ' がある', style: 'plain' },
        ],
        [
          { text: '同じアクセス元の2回目以降の通信を1回目と同じサーバに振り分けるためのLBの機能：', style: 'plain' },
          { text: 'セッション維持', style: 'red' },
          { text: ' 機能', style: 'plain' },
        ],
        [
          { text: 'レイヤ3方式：リクエスト元の ', style: 'plain' },
          { text: 'IPアドレス', style: 'red' },
          { text: ' に基づいて振り分ける', style: 'plain' },
        ],
        [
          { text: 'レイヤ7方式：Webサーバにアクセスしたユーザに関する情報を保持する ', style: 'plain' },
          { text: 'Cookie', style: 'red' },
          { text: ' に埋め込まれた ', style: 'plain' },
          { text: 'セッションID', style: 'red' },
          { text: ' に基づいて振り分ける', style: 'plain' },
        ],
      ],
    },
    {
      heading: 'ネットワーク冗長化の仕組み・技術まとめ',
      richItems: [
        [
          { text: 'レイヤ1：', style: 'plain' },
          { text: 'スタック接続', style: 'red' },
        ],
        [
          { text: 'レイヤ2：', style: 'plain' },
          { text: 'STP', style: 'red' },
          { text: '／', style: 'plain' },
          { text: 'リンクアグリゲーション', style: 'red' },
          { text: '／', style: 'plain' },
          { text: 'チーミング', style: 'red' },
        ],
        [
          { text: 'レイヤ3：', style: 'plain' },
          { text: 'VRRP', style: 'red' },
          { text: '／', style: 'plain' },
          { text: 'ルーティング（OSPF, BGP等）', style: 'red' },
          { text: ' による冗長化（コスト値を等しくする）／', style: 'plain' },
          { text: '負荷分散装置', style: 'red' },
        ],
        [
          { text: 'レイヤ4以上：', style: 'plain' },
          { text: 'DNSラウンドロビン', style: 'red' },
          { text: '／', style: 'plain' },
          { text: 'FW独自機能', style: 'red' },
          { text: ' による冗長化', style: 'plain' },
        ],
        [
          { text: '※リンクアグリゲーション・チーミング・ルーティングはActive-Activeに設定することでスループット向上にも寄与', style: 'plain' },
        ],
      ],
    },
  ],
  exam_tips: [
    'LBの仮想IPと物理IPは別物',
    'L3セッション維持＝送信元IP／L7セッション維持＝CookieのセッションID',
    '冗長化は==レイヤ別==に整理して覚える（L1スタック／L2 STP・LA／L3 VRRP・OSPF／L4以上 DNS RR・FW）',
  ],
}
