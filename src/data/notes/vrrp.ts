import type { NoteData } from './types'

export const vrrp: NoteData = {
  summary: '復習ノート「VRRP」準拠。デフォルトゲートウェイ（ルータ）冗長化のためのプロトコル。',
  sections: [
    {
      heading: 'VRRP（Virtual Router Redundancy Protocol）',
      richItems: [
        [
          { text: 'デフォルトゲートウェイ（ルータ）', style: 'red' },
          { text: ' 冗長化が目的', style: 'plain' },
        ],
        [
          { text: 'VRRPを構成したルータは、', style: 'plain' },
          { text: '仮想IPアドレス', style: 'red' },
          { text: ' と ', style: 'plain' },
          { text: '仮想MACアドレス', style: 'red' },
          { text: ' の両方を持つ', style: 'plain' },
        ],
        [
          { text: '2台のルータでVRRPを機能させるには、それぞれに ', style: 'plain' },
          { text: '実IPアドレス', style: 'red' },
          { text: '、', style: 'plain' },
          { text: '仮想IPアドレス', style: 'red' },
          { text: '、', style: 'plain' },
          { text: 'VRRPグループ', style: 'red' },
          { text: '、', style: 'plain' },
          { text: '優先度', style: 'red' },
          { text: ' を設定する（仮想MACアドレスは自動付与）', style: 'plain' },
        ],
        [
          { text: '優先度が高いルータ ⇒ ', style: 'plain' },
          { text: 'マスタルータ', style: 'red' },
          { text: '／低いルータ ⇒ ', style: 'plain' },
          { text: 'バックアップルータ', style: 'red' },
        ],
        [
          { text: 'PCがVRRPルータと通信するには、デフォルトゲートウェイをVRRPの ', style: 'plain' },
          { text: '仮想IPアドレス', style: 'red' },
          { text: ' に設定する', style: 'plain' },
        ],
        [
          { text: 'マスタルータが故障したとき、バックアップルータが検知する方法：一定時間 ', style: 'plain' },
          { text: 'VRRPアドバタイズメント', style: 'red' },
          { text: ' が流れないと検知。このときバックアップルータはマスタルータに昇格', style: 'plain' },
        ],
        [
          { text: 'PCから送られた仮想MACアドレス宛のフレームは、L2SWのスイッチングにより、マスタルータのみに転送される', style: 'plain' },
        ],
        [
          { text: 'マスタルータが変わるときは、L2SWのMACアドレステーブルを書き換える必要があるため、バックアップルータ（マスタルータに昇格）が ', style: 'plain' },
          { text: 'GARP', style: 'red' },
          { text: ' を送信する', style: 'plain' },
        ],
      ],
    },
  ],
  exam_tips: [
    '仮想IPアドレスと仮想MACアドレスは ==自動付与== される',
    '昇格時には==GARP==でL2SWのMACアドレステーブルを書き換える',
    'マスタ／バックアップは==優先度==で決まる',
    'FW自体の冗長化はVRRPではなく独自プロトコル（ステートフルフェールオーバ）',
  ],
}
