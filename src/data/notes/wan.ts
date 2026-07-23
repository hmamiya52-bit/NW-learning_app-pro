import type { NoteData } from './types'

export const wan: NoteData = {
  summary: '復習ノート「WAN」準拠。専用線／広域イーサネット／IP-VPN／SD-WAN／クラウド／高速化を整理。',
  sections: [
    {
      heading: '主なWANサービス',
      richItems: [
        [
          { text: 'レイヤ1サービス：', style: 'plain' },
          { text: '専用線', style: 'red' },
        ],
        [
          { text: 'レイヤ2サービス：', style: 'plain' },
          { text: '広域イーサネット', style: 'red' },
        ],
        [
          { text: 'レイヤ3サービス：', style: 'plain' },
          { text: 'IP-VPN', style: 'red' },
        ],
        [
          { text: '専用線を敷設する場合、利用者拠点側に、アナログ回線の場合は ', style: 'plain' },
          { text: 'DSU', style: 'red' },
          { text: '、光回線の場合は ', style: 'plain' },
          { text: 'ONU', style: 'red' },
          { text: ' という装置を設置（専用線は高額、拠点数が増えると回線が増え複雑になる）', style: 'plain' },
        ],
        [
          { text: '広域イーサネットでは、', style: 'plain' },
          { text: 'タグVLAN', style: 'red' },
          { text: ' により、異なる利用者を論理的にグループ分けする', style: 'plain' },
        ],
      ],
    },
    {
      heading: 'IP-VPN（MPLS）',
      richItems: [
        [
          { text: 'MPLS', style: 'red' },
          { text: ' というスイッチング方式を使用。パケットに ', style: 'plain' },
          { text: 'ラベル', style: 'red' },
          { text: ' と呼ばれる短い固定長のタグ情報を付与し、この情報を基にルーティング', style: 'plain' },
        ],
        [
          { text: 'ラベルには2種類：①利用者を識別するラベル／②IP-VPN網内での経路情報のための転送ラベル', style: 'plain' },
        ],
        [
          { text: '利用者拠点〜IP-VPN網の接続点：利用者が設置するルータ＝', style: 'plain' },
          { text: 'CEルータ', style: 'red' },
          { text: '、通信事業者側の利用者に近いルータ＝', style: 'plain' },
          { text: 'PEルータ', style: 'red' },
        ],
        [
          { text: '複数のプロバイダと契約した回線を冗長化する仕組み ⇒ ', style: 'plain' },
          { text: 'マルチホーミング', style: 'red' },
        ],
      ],
    },
    {
      heading: 'WAN高速化装置（WAS）',
      richItems: [
        [
          { text: 'データの ', style: 'plain' },
          { text: '圧縮', style: 'red' },
        ],
        [
          { text: 'キャッシュ', style: 'red' },
          { text: ' 蓄積（通信したデータをWASにキャッシュとして保存）', style: 'plain' },
        ],
        [
          { text: '代理応答', style: 'red' },
          { text: '：対向機器の代わりにWASがACKを返す。ターンアラウンドタイムが大きいとき効果大', style: 'plain' },
        ],
      ],
    },
    {
      heading: 'SD-WAN／PPPoE',
      richItems: [
        [
          { text: 'SD-WAN', style: 'red' },
          { text: '：', style: 'plain' },
          { text: 'SDN', style: 'red' },
          { text: ' によって制御されるIPsecルータ', style: 'plain' },
        ],
        [
          { text: 'SDNの構成：', style: 'plain' },
          { text: 'データプレーン', style: 'red' },
          { text: '（利用者の通信トラフィックを転送）／', style: 'plain' },
          { text: 'コントロールプレーン', style: 'red' },
          { text: '（通信装置を集中制御）', style: 'plain' },
        ],
        [
          { text: 'ブロードバンドからインターネットに接続するときなど、シリアル回線で使用するデータリンクのコネクション確立やデータ転送をLAN上で実現するプロトコル：', style: 'plain' },
          { text: 'PPPoE', style: 'red' },
        ],
      ],
    },
    {
      heading: 'クラウド',
      richItems: [
        [
          { text: 'SaaS', style: 'red' },
          { text: '（Software）：サーバの中のソフトウェアを提供', style: 'plain' },
        ],
        [
          { text: 'PaaS', style: 'red' },
          { text: '（Platform）：サーバの中のOS環境（プラットフォーム）を提供', style: 'plain' },
        ],
        [
          { text: 'IaaS', style: 'red' },
          { text: '（Infrastructure）：サーバやNW機器などのハードウェアを提供', style: 'plain' },
        ],
        [
          { text: 'AWS等のクラウドサービスにおいて、利用者ごとに独立した仮想ネットワークを ', style: 'plain' },
          { text: 'VPC', style: 'red' },
          { text: '（Virtual Private Cloud）という', style: 'plain' },
        ],
        [
          { text: 'ハウジング：ラックやスペースごと借りる（家みたいな）／ホスティング：レンタルサーバ（ホストとなるコンピュータ）を借りる', style: 'plain' },
        ],
      ],
    },
    // ── 復習ノートに無い既存項目（ネイビー強調のみで残す） ──────────
    {
      heading: '補足：アクセス系回線（参考）',
      navyItems: [
        [
          { text: 'ADSL', style: 'navy' },
          { text: '：非対称DSL。下り最大数十Mbps。電話線使用', style: 'plain' },
        ],
        [
          { text: 'VDSL', style: 'navy' },
          { text: '：短距離高速DSL。集合住宅のFTTB構成で利用', style: 'plain' },
        ],
        [
          { text: 'FTTH', style: 'navy' },
          { text: '：光ファイバを建物内まで引き込む。', style: 'plain' },
          { text: 'PON', style: 'navy' },
          { text: '（Passive Optical Network）方式が主流', style: 'plain' },
        ],
      ],
    },
  ],
  exam_tips: [
    'WANサービス：L1=専用線 / L2=広域イーサネット / L3=IP-VPN',
    'IP-VPNはMPLSのラベル方式。==CEルータ==（利用者）と==PEルータ==（事業者側）',
    'WAS：圧縮／キャッシュ／代理応答',
    'SD-WANはSDNで制御されるIPsecルータ',
    'クラウド：==SaaS==／==PaaS==／==IaaS==の階層を理解',
  ],
}
