import type { NoteData } from './types'

export const voip: NoteData = {
  summary: '復習ノート「音声とVoIP」準拠。VoIP・呼制御（SIP）・RTP・SDP・音声符号化・B2BUAを整理。',
  sections: [
    {
      heading: '音声通話の基礎',
      richItems: [
        [
          { text: '一回の通話＝呼。単位時間当たりの呼＝呼量（単位：アーラン）', style: 'plain' },
        ],
        [
          { text: 'VoIP：音声をパケット化してIP上で通信する技術（一般的にアナログ信号の音声がデジタル信号に変換される）', style: 'plain' },
        ],
        [
          { text: 'アナログ電話機の音声をVoIP化するときに利用される機器：VoIPゲートウェイ', style: 'plain' },
        ],
        [
          { text: '普通のアナログ電話機：アナログ電話線を使用、アナログ電話用のプロトコル', style: 'plain' },
        ],
        [
          { text: 'IP電話機：LANケーブルを使用、IPを使用', style: 'plain' },
        ],
      ],
    },
    {
      heading: '呼制御（SIP）',
      richItems: [
        [
          { text: '呼制御：電話をかけたり相手を呼び出したり切断したりする制御', style: 'plain' },
        ],
        [
          { text: '呼制御を行う代表的なプロトコル：', style: 'plain' },
          { text: 'SIP', style: 'red' },
        ],
        [
          { text: '呼制御を行う代表的な機器：', style: 'plain' },
          { text: 'SIPサーバ', style: 'red' },
          { text: '、', style: 'plain' },
          { text: 'IP-PBX', style: 'red' },
        ],
        [
          { text: 'VoIPで電話をかけるときの流れ — 電話機1→SIPサーバ：通話要求（', style: 'plain' },
          { text: 'INVITE', style: 'red' },
          { text: ' メッセージ）を送る', style: 'plain' },
        ],
        [
          { text: 'SIPサーバで：電話情報のデータベースから該当するIPアドレスを検索／通話相手の電話機2に通話要求を転送', style: 'plain' },
        ],
      ],
    },
    {
      heading: 'RTP・SDP',
      richItems: [
        [
          { text: '音声通話に用いるプロトコル：', style: 'plain' },
          { text: 'RTP', style: 'red' },
          { text: '。アプリケーション層のプロトコル。トランスポート層には ', style: 'plain' },
          { text: 'UDP', style: 'red' },
          { text: ' を用いる', style: 'plain' },
        ],
        [
          { text: '電話機間において、SIPはSIPサーバを経由するが、', style: 'plain' },
          { text: 'RTP', style: 'red' },
          { text: ' ではSIPサーバを ', style: 'plain' },
          { text: '経由しない', style: 'red' },
        ],
        [
          { text: 'SIPメッセージのヘッダ：通話元・通話先等の情報が記載', style: 'plain' },
        ],
        [
          { text: 'SIPメッセージのボディ部：', style: 'plain' },
          { text: 'SDP', style: 'red' },
          { text: ' というセッション記述プロトコルに従う', style: 'plain' },
        ],
        [
          { text: '音声通話のシーケンス：INVITE → 200 OK → ACK で通話開始／切るときは ', style: 'plain' },
          { text: 'BYE', style: 'red' },
        ],
      ],
    },
    {
      heading: '音声符号化・B2BUA',
      richItems: [
        [
          { text: 'PCM：', style: 'plain' },
          { text: '64', style: 'red' },
          { text: ' kbps', style: 'plain' },
        ],
        [
          { text: 'CS-ACELP：', style: 'plain' },
          { text: '8', style: 'red' },
          { text: ' kbps', style: 'plain' },
        ],
        [
          { text: '異なるSIPネットワーク間の境界に配置される仲介役 ⇒ ', style: 'plain' },
          { text: 'B2B UA', style: 'red' },
          { text: '。具体的な装置：VoIPゲートウェイが該当', style: 'plain' },
        ],
      ],
    },
    // ── 復習ノートに無い既存項目（ネイビー強調のみで残す） ──────────
    {
      heading: '補足：QoS（参考）',
      navyItems: [
        [
          { text: 'ジッタ', style: 'navy' },
          { text: '：パケット到着間隔のばらつき。ジッタバッファで吸収するが遅延が増加', style: 'plain' },
        ],
        [
          { text: 'DSCP', style: 'navy' },
          { text: '（Differentiated Services Code Point）：IPヘッダのTOSフィールド上位', style: 'plain' },
          { text: '6', style: 'navy' },
          { text: 'ビット。', style: 'plain' },
          { text: 'EF', style: 'navy' },
          { text: '（Expedited Forwarding）が音声に最適', style: 'plain' },
        ],
        [
          { text: '推奨遅延：片方向', style: 'plain' },
          { text: '150', style: 'navy' },
          { text: 'ms以内／ジッタ：', style: 'plain' },
          { text: '30', style: 'navy' },
          { text: 'ms以内／パケットロス：', style: 'plain' },
          { text: '1', style: 'navy' },
          { text: '%以下', style: 'plain' },
        ],
        [
          { text: 'RTCP', style: 'navy' },
          { text: '：RTPと対で動作しQoS統計（パケットロス率・ジッタ・RTT）を報告', style: 'plain' },
        ],
      ],
    },
  ],
  exam_tips: [
    'SIPはシグナリング、RTPはメディア（実音声）',
    'RTPは==SIPサーバを経由しない==',
    'SIPシーケンス：INVITE → 200 OK → ACK → BYE',
    'PCM=64kbps / CS-ACELP=8kbps',
    'B2BUAは異なるSIP網の境界（VoIPゲートウェイが該当）',
  ],
}
