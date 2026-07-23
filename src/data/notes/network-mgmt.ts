import type { NoteData } from './types'

export const network_mgmt: NoteData = {
  summary: '復習ノート「ネットワーク管理」「SNMP」準拠。管理の分類・ping／SYSLOG／REST／LLDP／BFD・SNMP（マネージャ／エージェント／コミュニティ／ポーリング／Trap／インフォーム／MIB）を整理。',
  sections: [
    {
      heading: 'ネットワーク管理',
      richItems: [
        [
          { text: 'ネットワーク管理の分類：', style: 'plain' },
          { text: '障害管理', style: 'red' },
          { text: '（障害の検知）／', style: 'plain' },
          { text: '構成管理', style: 'red' },
          { text: '（IPアドレスや物理構成などの構成情報）／', style: 'plain' },
          { text: '機能管理', style: 'red' },
          { text: '（応答時間などのNW機能を管理）', style: 'plain' },
        ],
        [
          { text: 'L2SWにSNMPやSSLでアクセスできるようにするためには、', style: 'plain' },
          { text: 'IPアドレス', style: 'red' },
          { text: ' を設定する必要がある', style: 'plain' },
        ],
      ],
    },
    {
      heading: 'pingによる監視（ICMPポーリング）',
      richItems: [
        [
          { text: 'レイヤ3のレベルまでなら ', style: 'plain' },
          { text: 'ping', style: 'red' },
          { text: ' による監視（ICMPポーリング）。pingは監視サーバから監視対象機器に送る', style: 'plain' },
        ],
        [
          { text: 'pingの応答がない場合の要因：機器の故障／通信経路上の機器の故障／監視対象機器がFW機能やアクセスリスト等によりpingを拒否している', style: 'plain' },
        ],
        [
          { text: 'pingによる監視は不十分：L2SWはIPが一つしかないのでどのポートが故障したか分からない／レイヤ3のダウンという単純な情報しか分からない／レイヤ7レベルでの不具合は分からない', style: 'plain' },
        ],
        [
          { text: 'ICMPは ', style: 'plain' },
          { text: '輻輳の検知', style: 'red' },
          { text: ' にも向かない（起きていても届くし、起きてなくても別の障害で届かないことがある）', style: 'plain' },
        ],
      ],
    },
    {
      heading: 'SYSLOG・REST・LLDP・BFD',
      richItems: [
        [
          { text: 'SYSLOG監視：', style: 'plain' },
          { text: 'UDP', style: 'red' },
          { text: ' を用いる。ping監視と異なり、監視対象機器から監視サーバにダウン情報等を伝達する', style: 'plain' },
        ],
        [
          { text: 'インタフェースがダウンした場合、', style: 'plain' },
          { text: 'リアルタイム', style: 'red' },
          { text: ' にログを送ることができる（ping監視は一定間隔のため故障検知が遅れる）', style: 'plain' },
        ],
        [
          { text: 'REST', style: 'red' },
          { text: '（Representational State Transfer）：NW機器やサーバと接続し、設定情報を取得したり、設定変更が行えたりする便利な仕組み', style: 'plain' },
        ],
        [
          { text: 'LLDP', style: 'red' },
          { text: '（Link Layer Discovery Protocol）：隣接機器に対して、自身の情報（装置名、ポート番号等）を通知するプロトコル', style: 'plain' },
        ],
        [
          { text: 'BFD', style: 'red' },
          { text: '（双方向フォワーディング検出）：ルータ同士が定期的にメッセージを送り合う。', style: 'plain' },
          { text: '高速', style: 'red' },
          { text: ' に障害を検知できる', style: 'plain' },
        ],
      ],
    },
    {
      heading: 'SNMP（Simple Network Management Protocol）',
      richItems: [
        [
          { text: 'NW構成機器を集中管理するためのプロトコル。ポート番号：', style: 'plain' },
          { text: 'UDP', style: 'red' },
          { text: ' ', style: 'plain' },
          { text: '161/162', style: 'red' },
        ],
        [
          { text: 'SNMP', style: 'plain' },
          { text: 'マネージャ', style: 'red' },
          { text: '：機器を管理する側', style: 'plain' },
        ],
        [
          { text: 'SNMP', style: 'plain' },
          { text: 'エージェント', style: 'red' },
          { text: '：管理されるネットワーク機器やサーバ', style: 'plain' },
        ],
        [
          { text: 'SNMPマネージャ側で管理すべきこと：エージェントとマネージャの設定で ', style: 'plain' },
          { text: 'コミュニティ', style: 'red' },
          { text: ' というグループを指定し、コミュニティ単位で情報を管理', style: 'plain' },
        ],
        [
          { text: 'コミュニティのデフォルト名：', style: 'plain' },
          { text: 'public', style: 'red' },
        ],
      ],
    },
    {
      heading: 'SNMPの監視の種類',
      richItems: [
        [
          { text: 'ポーリング', style: 'red' },
          { text: '：ping監視と同様に、マネージャからエージェントへ ', style: 'plain' },
          { text: '一定間隔', style: 'red' },
          { text: ' で監視を行う', style: 'plain' },
        ],
        [
          { text: 'Trap', style: 'red' },
          { text: '：SYSLOG監視と同様に、エージェントからマネージャに ', style: 'plain' },
          { text: 'リアルタイム', style: 'red' },
          { text: ' で異常を通知する', style: 'plain' },
        ],
      ],
    },
    {
      heading: 'SNMPインフォーム・MIB',
      richItems: [
        [
          { text: 'SNMPインフォームにより解消されるTrapのデメリット：Trapを送信してもNWの障害（STP再計算等）によりTrapがSNMPマネージャに届かない場合がある', style: 'plain' },
        ],
        [
          { text: 'SNMPインフォームを設定した場合、エージェントは ', style: 'plain' },
          { text: '確認応答がマネージャから届かない', style: 'red' },
          { text: ' とき、', style: 'plain' },
          { text: '再送', style: 'red' },
          { text: ' する。これによりTrapを確実に届けることができる', style: 'plain' },
        ],
        [
          { text: 'SNMPエージェントでは、各種の管理情報を ', style: 'plain' },
          { text: 'MIB', style: 'red' },
          { text: ' と呼ばれる機器の中にあるデータベースに保存する（MIB: Management Information Base）', style: 'plain' },
        ],
      ],
    },
    {
      heading: 'その他ネスペ試験的なこと',
      richItems: [
        [
          { text: '「変更」ときたら「差分」（元からあるやつを回答に入れない）', style: 'plain' },
        ],
        [
          { text: '検知の問題点2つときたら、フォールスポジティブ・ネガティブの両側面で考える', style: 'plain' },
        ],
        [
          { text: '新旧のNWが混ざるとき、IPアドレスの重複に注意', style: 'plain' },
        ],
        [
          { text: '接続できない ⇒ ルーティングループを疑う。特にデフォルトルート', style: 'plain' },
        ],
      ],
    },
  ],
  exam_tips: [
    'ネスペ管理3分類：障害管理／構成管理／機能管理',
    'ping＝マネージャ→対象（一定間隔）／Trap＝対象→マネージャ（リアルタイム）',
    'SNMPはUDP==161==（Get/Set）＋==162==（Trap）',
    'コミュニティのデフォルト名は==public==（変更必須）',
    'SNMPインフォーム：Trap到達失敗時に==再送==',
    'BFD：ルータ間定期メッセージで==高速障害検知==',
  ],
}
