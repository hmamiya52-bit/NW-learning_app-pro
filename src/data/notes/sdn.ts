import type { NoteData } from './types'

export const sdn: NoteData = {
  summary: '復習ノート「SDN」準拠。代表技術OpenFlow、OFC／OFSの役割分担、メッセージの種類、フローテーブルを整理。',
  sections: [
    {
      heading: 'SDN（Software Defined Network）',
      richItems: [
        [
          { text: '代表的な技術：', style: 'plain' },
          { text: 'OpenFlow', style: 'red' },
        ],
        [
          { text: '従来のNW機器は1台で①管理・制御機能、②データ転送機能を実現', style: 'plain' },
        ],
        [
          { text: 'OpenFlowでは：', style: 'plain' },
          { text: 'OFC', style: 'red' },
          { text: '（OpenFlowコントローラ）が①管理制御機能／', style: 'plain' },
          { text: 'OFS', style: 'red' },
          { text: '（OpenFlowスイッチ）が②データ転送', style: 'plain' },
        ],
        [
          { text: 'OFSは起動するとOFCとの間でTCPコネクションを確立し、OFCはOFSの存在を知る', style: 'plain' },
        ],
        [
          { text: 'OFCの導入時には、自分のIPアドレスとOFCのIPアドレスさえ設定すればよいので導入が容易（VLAN・STP・NWの各種設定は不要）', style: 'plain' },
        ],
        [
          { text: 'OFCからフローテーブルの作成や更新が行われ、OFSに通信メッセージが送られる', style: 'plain' },
        ],
      ],
    },
    {
      heading: 'OpenFlowメッセージ',
      richItems: [
        [
          { text: 'OFSとOFCは管理のための専用ネットワークを介して通信メッセージを交換する', style: 'plain' },
        ],
        [
          { text: 'Packet-In', style: 'red' },
          { text: '：OFSがOFCにパケットの処理方法を問い合わせるメッセージ', style: 'plain' },
        ],
        [
          { text: 'Packet-Out', style: 'red' },
          { text: '：OFCがOFSにパケットの送信指示を出すメッセージ', style: 'plain' },
        ],
        [
          { text: 'Flow Mod', style: 'red' },
          { text: '：OFCがOFSにフローテーブルの登録・変更の指示を出すメッセージ', style: 'plain' },
        ],
      ],
    },
    {
      heading: 'フローテーブルとエントリ',
      richItems: [
        [
          { text: '管理テーブル：どのようなときにどう動作するか記載したルール（エントリ）', style: 'plain' },
        ],
        [
          { text: 'エントリは ', style: 'plain' },
          { text: 'パケット識別子', style: 'red' },
          { text: '（', style: 'plain' },
          { text: 'MF: Match Field', style: 'red' },
          { text: '）と ', style: 'plain' },
          { text: 'パケットの処理（Action）', style: 'red' },
          { text: ' からなる', style: 'plain' },
        ],
        [
          { text: 'MFの例：IPアドレス、MACアドレス、プロトコル、ポート番号など', style: 'plain' },
        ],
      ],
    },
  ],
  exam_tips: [
    'OFC＝管理制御／OFS＝データ転送 の分離が SDN の根幹',
    'メッセージは Packet-In／Packet-Out／Flow Mod の3種',
    'エントリは MF（Match Field）＋Action',
    'SD-WAN は SDN によって制御される IPsecルータ',
  ],
}
