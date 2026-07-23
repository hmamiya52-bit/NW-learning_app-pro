import type { NoteData } from './types'

export const dhcp: NoteData = {
  summary: '復習ノート「DHCP」準拠。DORA・リレーエージェント・複数セグメント時の払い出し・スヌーピングを整理。',
  sections: [
    {
      heading: 'DHCPサーバの設定と利点',
      richItems: [
        [
          { text: 'DHCPサーバに設定する主な情報：', style: 'plain' },
          { text: 'サブネットマスク', style: 'red' },
          { text: '、', style: 'plain' },
          { text: 'ネットワークアドレス', style: 'red' },
          { text: '、払い出すIPアドレスの ', style: 'plain' },
          { text: '範囲', style: 'red' },
          { text: '、DNSサーバ等', style: 'plain' },
        ],
        [
          { text: 'DHCPサーバ設定の利点①：', style: 'plain' },
          { text: '固定でIPアドレスを割り当てる', style: 'red' },
          { text: ' 手間の削減', style: 'plain' },
        ],
        [
          { text: '利点②：', style: 'plain' },
          { text: '払い出したIPアドレス', style: 'red' },
          { text: ' や端末をDHCPサーバにて ', style: 'plain' },
          { text: '一元', style: 'red' },
          { text: ' 管理できる', style: 'plain' },
        ],
      ],
    },
    {
      heading: 'DHCPメッセージ4種',
      richItems: [
        [
          { text: '①', style: 'plain' },
          { text: 'DHCPディスカバー', style: 'red' },
          { text: '（DISCOVER）：', style: 'plain' },
          { text: 'ブロード', style: 'red' },
          { text: 'キャスト', style: 'plain' },
        ],
        [
          { text: '②', style: 'plain' },
          { text: 'DHCPオファー', style: 'red' },
          { text: '（OFFER）', style: 'plain' },
        ],
        [
          { text: '③', style: 'plain' },
          { text: 'DHCPリクエスト', style: 'red' },
          { text: '（REQUEST）：', style: 'plain' },
          { text: 'ブロード', style: 'red' },
          { text: 'キャスト', style: 'plain' },
        ],
        [
          { text: '④', style: 'plain' },
          { text: 'DHCPアック', style: 'red' },
          { text: '（ACK）', style: 'plain' },
        ],
      ],
    },
    {
      heading: 'DHCPリレーエージェント',
      richItems: [
        [
          { text: 'PCからのDHCPリクエストをルータ等が中継する仕組み ⇒ ', style: 'plain' },
          { text: 'DHCPリレーエージェント', style: 'red' },
        ],
        [
          { text: '複数のセグメントからIP要求が来た場合の払い出すIPの決め方：', style: 'plain' },
        ],
        [
          { text: 'リレーエージェントのルータ：DHCPブロードキャストを受信したインタフェース（要求元PC側）の ', style: 'plain' },
          { text: 'IPアドレス', style: 'red' },
          { text: ' を含めてDHCPサーバにDHCPリクエストを転送', style: 'plain' },
        ],
        [
          { text: 'DHCPサーバ：上記IPアドレスと ', style: 'plain' },
          { text: '同一セグメント', style: 'red' },
          { text: ' のIPアドレスを払い出す', style: 'plain' },
        ],
      ],
    },
    {
      heading: 'DHCPスヌーピング',
      richItems: [
        [
          { text: 'DHCPスヌーピング：スイッチングハブの機能。DHCPのパケットをのぞき見して不正な通信をブロック', style: 'plain' },
        ],
        [
          { text: '具体的に禁止する不正な接続：', style: 'plain' },
          { text: '不正なDHCPサーバ', style: 'red' },
          { text: ' からのIPアドレス取得／', style: 'plain' },
          { text: '固定でIPアドレスを割り当てた', style: 'red' },
          { text: ' PCからの接続', style: 'plain' },
        ],
        [
          { text: '不正なDHCPサーバ設置の防止：SWにおいて、DHCPスヌーピングの設定として、正規のDHCPサーバを接続する ', style: 'plain' },
          { text: 'ポート', style: 'red' },
          { text: ' を指定', style: 'plain' },
        ],
        [
          { text: 'DHCPスヌーピングでは、', style: 'plain' },
          { text: '正規', style: 'red' },
          { text: ' のDHCPサーバからIPアドレスを割り当てたPCだけを通信させる。PCの特定は ', style: 'plain' },
          { text: 'MACアドレス', style: 'red' },
          { text: ' で行う（正規DHCPサーバから払い出したDHCPのフレームを見て、許可するPCの ', style: 'plain' },
          { text: 'MACアドレス', style: 'red' },
          { text: ' を入手）', style: 'plain' },
        ],
        [
          { text: 'DHCPリレーエージェント設定時、ポートごとにスヌーピングをする／しないの設定をする（ポートを信頼するかしないか）', style: 'plain' },
        ],
      ],
    },
  ],
  exam_tips: [
    '==DHCPメッセージ4種==の順序は必ず暗記（ディスカバー→オファー→リクエスト→アック）',
    'リレーエージェントはどの層の機器がどう動作するかを整理',
    'DHCPスヌーピングはDHCP/ARP攻撃両方への対策になる',
  ],
}
