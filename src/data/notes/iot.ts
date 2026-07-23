import type { NoteData } from './types'

export const iot: NoteData = {
  summary: 'MQTT・CoAP・LPWA（令和7年）とSASE・ZTNA・Wi-Fi 7（令和8年予想）が最重要。',
  sections: [
    {
      heading: 'IoT通信プロトコル',
      richItems: [
        [
          { text: 'MQTT', style: 'navy' },
          { text: '（', style: 'plain' },
          { text: 'TCP 1883/8883', style: 'navy' },
          { text: '）：', style: 'plain' },
          { text: 'Pub/Subモデル', style: 'navy' },
          { text: '。ブローカーを介してPublisher→Subscriberにメッセージ配信。', style: 'plain' },
          { text: 'QoS 0/1/2', style: 'navy' },
        ],
        [
          { text: 'CoAP', style: 'navy' },
          { text: '（', style: 'plain' },
          { text: 'UDP 5683', style: 'navy' },
          { text: '）：RESTfulなHTTP互換の軽量プロトコル。', style: 'plain' },
          { text: 'Confirmable/Non-confirmable', style: 'navy' },
          { text: ' で信頼性を選択', style: 'plain' },
        ],
        [
          { text: 'AMQP：メッセージキューイングプロトコル。エンタープライズ向け（MQTTよりリッチ）', style: 'plain' },
        ],
      ],
    },
    {
      heading: 'LPWA（Low Power Wide Area）',
      richItems: [
        [
          { text: 'LoRaWAN', style: 'navy' },
          { text: '：', style: 'plain' },
          { text: 'チャープ変調（CSS）', style: 'navy' },
          { text: '。', style: 'plain' },
          { text: '920MHz帯', style: 'navy' },
          { text: '。数km〜数十kmの長距離通信', style: 'plain' },
        ],
        [
          { text: 'Sigfox', style: 'navy' },
          { text: '：Ultra-Narrow Band変調。月単位の電池駆動。最大 ', style: 'plain' },
          { text: '12', style: 'navy' },
          { text: ' バイト/メッセージ', style: 'plain' },
        ],
        [
          { text: 'NB-IoT / LTE-M', style: 'navy' },
          { text: '：3GPP標準。既存LTE基地局活用。キャリアサービス', style: 'plain' },
        ],
        [
          { text: 'Wi-SUN', style: 'navy' },
          { text: '：スマートメーター向けメッシュネットワーク（日本標準）', style: 'plain' },
        ],
      ],
    },
    {
      heading: 'SASE・ゼロトラスト（令和8年予想）',
      richItems: [
        [
          { text: 'SASE', style: 'red' },
          { text: '（Secure Access Service Edge）：', style: 'plain' },
          { text: 'SD-WAN', style: 'navy' },
          { text: '＋SWG・', style: 'plain' },
          { text: 'CASB', style: 'red' },
          { text: '・', style: 'plain' },
          { text: 'ZTNA', style: 'navy' },
          { text: '・FWaaS をクラウドで統合', style: 'plain' },
        ],
        [
          { text: 'ZTNA', style: 'navy' },
          { text: '（Zero Trust Network Access）：「', style: 'plain' },
          { text: '常に認証・常に最小権限', style: 'navy' },
          { text: '」。VPN不要でアプリ単位アクセス制御', style: 'plain' },
        ],
        [
          { text: 'CASB', style: 'red' },
          { text: '（Cloud Access Security Broker）：クラウドサービス利用の可視化・制御', style: 'plain' },
        ],
        [
          { text: 'SWG', style: 'navy' },
          { text: '（Secure Web Gateway）：クラウド型プロキシ。URLフィルタ・マルウェアスキャン・DLP', style: 'plain' },
        ],
      ],
    },
    {
      heading: '試験制度変更（令和8年度）',
      richItems: [
        [
          { text: 'CBT', style: 'navy' },
          { text: '（Computer Based Testing）方式に完全移行', style: 'plain' },
        ],
        [
          { text: '科目A-2（旧午前Ⅱ）・科目B（旧午後Ⅰ/Ⅱ → B-1/B-2）に名称変更', style: 'plain' },
        ],
        [
          { text: '記述解答→', style: 'plain' },
          { text: 'キーボード入力（タイピング）', style: 'navy' },
          { text: ' 方式に変更', style: 'plain' },
        ],
      ],
    },
  ],
  exam_tips: [
    'MQTT（TCP・Pub/Sub）とCoAP（UDP・RESTful）の違いは令和7年に出題',
    'LPWAの各技術（LoRa・Sigfox・NB-IoT）の特徴の違い',
    '==SASE== = SD-WAN + セキュリティ（SWG+==CASB==+ZTNA+FWaaS）という構成を覚える',
  ],
}
