import type { NoteData } from './types'

export const firewall: NoteData = {
  summary: '復習ノート「ファイアウォール」準拠。FW（フィルタリング・動的フィルタリング・冗長化）、IDS/IPS、WAFを整理。',
  sections: [
    {
      heading: 'FW（ファイアウォール）— 基本',
      richItems: [
        [
          { text: '統合脅威管理機能を持つFW：', style: 'plain' },
          { text: 'UTM', style: 'red' },
          { text: '（アンチウイルス機能、URLフィルタリング機能をもつ）', style: 'plain' },
        ],
        [
          { text: 'FWの基本的な機能：', style: 'plain' },
          { text: 'フィルタリング', style: 'red' },
          { text: ' 機能（特定のIPアドレスやポート番号の通信だけを許可する）', style: 'plain' },
        ],
        [
          { text: '用いるパケットの情報：宛先・送信元', style: 'plain' },
          { text: 'IPアドレス', style: 'red' },
          { text: ' ／ 宛先・送信元', style: 'plain' },
          { text: 'ポート番号', style: 'red' },
          { text: ' ／ ', style: 'plain' },
          { text: 'プロトコル', style: 'red' },
        ],
        [
          { text: 'FWはホワイトリスト方式 ⇒ ', style: 'plain' },
          { text: '許可', style: 'red' },
          { text: ' するものだけ書けばよい（答案のコツ）。拒否するものは暗黙のdeny', style: 'plain' },
        ],
        [
          { text: 'FWでは、DMZ上の機器がインターネットからのpingに応答しないように、プロトコルが ', style: 'plain' },
          { text: 'ICMP', style: 'red' },
          { text: ' のパケットを通過禁止に設定', style: 'plain' },
        ],
        [
          { text: 'スマホが接続する場合、送信元IPアドレスは ', style: 'plain' },
          { text: 'ANY', style: 'red' },
        ],
        [
          { text: 'VoIPのためのFWの穴は SIP と RTP の2経路を考える', style: 'plain' },
        ],
      ],
    },
    {
      heading: '動的フィルタリング（ステートフルインスペクション）',
      richItems: [
        [
          { text: '動的フィルタリング：', style: 'plain' },
          { text: '戻り', style: 'red' },
          { text: ' のパケットを自動で許可する。', style: 'plain' },
          { text: 'ステートフルインスペクション', style: 'red' },
          { text: ' といわれることもある', style: 'plain' },
        ],
        [
          { text: '通過したパケットの状態を保持しておく必要がある（送信元・宛先IPアドレス、プロトコル、送信元・宛先ポート番号などの組み合わせ）', style: 'plain' },
        ],
        [
          { text: '注意：L3SWのACLはステートフルではなく、', style: 'plain' },
          { text: '静', style: 'red' },
          { text: ' 的パケットフィルタリングなので戻りが自動許可されない', style: 'plain' },
        ],
      ],
    },
    {
      heading: 'FWの冗長化',
      richItems: [
        [
          { text: 'FWの冗長化：VRRPを用いず、独自のプロトコルで行うことが一般的（ステートフルインスペクションで動的にセッションを管理しており、', style: 'plain' },
          { text: 'セッション維持', style: 'red' },
          { text: ' のため）', style: 'plain' },
        ],
        [
          { text: 'FW間はフェールオーバリンクと呼ばれる専用の線で結ばれ、設定情報やセッション情報を同期する', style: 'plain' },
        ],
        [
          { text: 'ActiveのFW故障時にセッション情報を引き継ぐ機能 ⇒ ', style: 'plain' },
          { text: 'ステートフルフェールオーバ', style: 'red' },
          { text: '（PCからインターネットへの通信を維持）', style: 'plain' },
        ],
      ],
    },
    {
      heading: 'IDSとIPS',
      richItems: [
        [
          { text: 'IDSとIPSの違い：IDSは ', style: 'plain' },
          { text: '検知', style: 'red' },
          { text: ' までしかできない（Detection）／IPSは ', style: 'plain' },
          { text: '防御', style: 'red' },
          { text: ' まで行える（Prevention）', style: 'plain' },
        ],
        [
          { text: 'FWとIDS/IPSの違い：FWはパケットの ', style: 'plain' },
          { text: 'ヘッダ情報', style: 'red' },
          { text: ' のみを確認／IDS/IPSは ', style: 'plain' },
          { text: 'データの中身', style: 'red' },
          { text: ' まで確認', style: 'plain' },
        ],
        [
          { text: 'IDS/IPSはFWの ', style: 'plain' },
          { text: '内', style: 'red' },
          { text: ' 側（', style: 'plain' },
          { text: 'DMZ', style: 'red' },
          { text: ' 側）に設置（', style: 'plain' },
          { text: '負荷', style: 'red' },
          { text: ' を減らすため。FWの外側だとFWで許可しないパケットも検査が必要となり、アラート・ログ・警告メールが大量になる）', style: 'plain' },
        ],
        [
          { text: 'IDS/IPSの設置場所：IPSは防御のため ', style: 'plain' },
          { text: 'インライン（通信経路上）', style: 'red' },
          { text: ' に設置／IDSは ', style: 'plain' },
          { text: 'インライン', style: 'red' },
          { text: ' または SW の ', style: 'plain' },
          { text: 'ミラーポート', style: 'red' },
          { text: ' に接続', style: 'plain' },
        ],
        [
          { text: 'インライン', style: 'red' },
          { text: ' 設置はIDSが故障すると通信できない／', style: 'plain' },
          { text: 'ミラーポート', style: 'red' },
          { text: ' 設置は構成変更が少ない', style: 'plain' },
        ],
        [
          { text: 'IDS/IPSをインライン設置する場合、機器の故障に備えて必要な機能：', style: 'plain' },
          { text: '通信をそのまま通過させ、遮断しない', style: 'red' },
          { text: ' 機能（バイパス）', style: 'plain' },
        ],
        [
          { text: 'IDSをSWのミラーポートに接続する場合、IDS側のNWポートを ', style: 'plain' },
          { text: 'ミラーポート', style: 'red' },
          { text: ' に接続して ', style: 'plain' },
          { text: 'プロミスキャス', style: 'red' },
          { text: ' モードにすることで、IDS以外を宛先とする通信を取り込む', style: 'plain' },
        ],
        [
          { text: 'IDS側のポートに ', style: 'plain' },
          { text: 'IP', style: 'red' },
          { text: ' アドレスを割り当てなければ、IDS自体がレイヤ', style: 'plain' },
          { text: '3', style: 'red' },
          { text: ' の攻撃を受けることを回避できる', style: 'plain' },
        ],
        [
          { text: 'IDS自体に不正パケットを防止する機能は無い。IDSは ', style: 'plain' },
          { text: 'RST', style: 'red' },
          { text: ' パケット送付によりコネクション切断で防御可能。ただしレイヤ4が ', style: 'plain' },
          { text: 'TCP', style: 'red' },
          { text: ' のときのみ。', style: 'plain' },
          { text: 'UDP', style: 'red' },
          { text: ' では不可（UDPなら ICMP unreachable 送り付け）', style: 'plain' },
        ],
      ],
    },
    {
      heading: 'WAF（Web Application Firewall）',
      richItems: [
        [
          { text: 'WAFで主にブロックするアプリケーション層プロトコル ⇒ ', style: 'plain' },
          { text: 'HTTP', style: 'red' },
          { text: ' と ', style: 'plain' },
          { text: 'HTTPS', style: 'red' },
        ],
        [
          { text: 'FWで防御できないがWAFで防御できる攻撃の例：', style: 'plain' },
          { text: 'SQLインジェクション', style: 'red' },
          { text: ' ／ ', style: 'plain' },
          { text: 'クロスサイトスクリプティング', style: 'red' },
          { text: ' 等', style: 'plain' },
        ],
        [
          { text: 'Webサーバへの通信をクラウド事業者の ', style: 'plain' },
          { text: 'クラウドWAF', style: 'red' },
          { text: ' 経由にするために必要な設定：DNSサーバでWebサーバの別名をWAFにするように ', style: 'plain' },
          { text: 'CNAME', style: 'red' },
          { text: ' レコードを設定', style: 'plain' },
        ],
        [
          { text: 'AレコードではなくCNAMEレコードなら、WAFサービス事業者がIPアドレスを変更してもDNSの設定変更が不要', style: 'plain' },
        ],
        [
          { text: 'HTTPSで動作するWebサーバの場合、Webサーバの証明書はクラウドWAFに配置（SSLで暗号化された通信をWAFで復号してセキュリティチェックを行うため）', style: 'plain' },
        ],
        [
          { text: 'WebサーバのIPアドレスを直接指定するなどしてWAFを経由せずに通信を試みる攻撃者への対策：', style: 'plain' },
          { text: 'WAFのIPアドレス以外', style: 'red' },
          { text: ' からのWebサーバへの通信をFWで遮断', style: 'plain' },
        ],
      ],
    },
    // ── 復習ノートに無い既存項目（ネイビー強調のみで残す） ──────────
    {
      heading: '補足：NAT / NAPT（参考）',
      navyItems: [
        [
          { text: '静的NAT', style: 'navy' },
          { text: '：', style: 'plain' },
          { text: '1対1', style: 'navy' },
          { text: 'のIPアドレス変換', style: 'plain' },
        ],
        [
          { text: 'NAPT', style: 'navy' },
          { text: '（IPマスカレード）：', style: 'plain' },
          { text: 'IPアドレス＋ポート番号', style: 'navy' },
          { text: 'の変換。1つのグローバルIPで複数端末が通信可能', style: 'plain' },
        ],
        [
          { text: 'DNAT', style: 'navy' },
          { text: '（Destination NAT）：宛先IPを書き換えてDMZ内サーバへ転送。ポートフォワーディング', style: 'plain' },
        ],
        [
          { text: 'SNAT', style: 'navy' },
          { text: '（Source NAT）：送信元IPを書き換える（インターネットへの出口で使用）', style: 'plain' },
        ],
      ],
    },
    {
      heading: '補足：DMZ（参考）',
      navyItems: [
        [
          { text: '外部公開サーバ（Web・Mail・DNS）を内部LANとも外部とも', style: 'plain' },
          { text: '分離したゾーン', style: 'navy' },
        ],
        [
          { text: 'FWで「外部→DMZ」と「', style: 'plain' },
          { text: 'DMZ', style: 'navy' },
          { text: '→', style: 'plain' },
          { text: '内部', style: 'navy' },
          { text: '」のアクセスを個別に制御', style: 'plain' },
        ],
        [
          { text: '典型的な', style: 'plain' },
          { text: '3ゾーン', style: 'navy' },
          { text: '構成：外部（Internet）/ DMZ / 内部（Internal）', style: 'plain' },
        ],
      ],
    },
    {
      heading: '補足：検知方式（参考）',
      navyItems: [
        [
          { text: 'シグネチャ型', style: 'navy' },
          { text: '（パターンマッチング型）：既知の攻撃パターンと照合。', style: 'plain' },
          { text: '誤検知が少ない', style: 'navy' },
          { text: 'が', style: 'plain' },
          { text: '未知の攻撃に無力', style: 'navy' },
        ],
        [
          { text: 'アノマリ型', style: 'navy' },
          { text: '（異常検知型）：ベースラインからの逸脱を検知。', style: 'plain' },
          { text: '未知の攻撃にも対応', style: 'navy' },
          { text: 'できるが', style: 'plain' },
          { text: '誤検知が多い', style: 'navy' },
        ],
      ],
    },
  ],
  exam_tips: [
    'FWは==許可==するものだけ書けばよい（拒否は暗黙のdeny）',
    '動的フィルタリング＝==ステートフルインスペクション==。L3SW ACLは静的なので戻りが自動許可されない',
    'FWの冗長化は==独自プロトコル==＋フェールオーバリンクで==ステートフルフェールオーバ==',
    'IPSは==インライン==で防御／IDSは==ミラーポート==で検知のみ',
    'IDSはL4が==TCP==のとき==RST==送付で切断、UDPは ICMP unreachable',
    'WAFは==SQLインジェクション==／==XSS==を防御、L3/L4の帯域消費型DDoSは対象外',
    'クラウドWAFはDNSの==CNAME==レコードで切替、IPアドレス以外をFWで遮断',
  ],
}
