import type { NoteData } from './types'

export const dns: NoteData = {
  summary: '復習ノート「DNS」準拠。DNSの階層・コンテンツ／キャッシュ・ゾーン転送・主要レコード・冗長化・キャッシュポイズニング対策を整理。',
  sections: [
    {
      heading: 'DNSの基礎',
      richItems: [
        [
          { text: 'PC起動直後、PCからWebサーバに通信するとき最初に送られるフレームは、PC→', style: 'plain' },
          { text: 'デフォルトゲートウェイ', style: 'red' },
          { text: ' へのARP', style: 'plain' },
        ],
        [
          { text: 'DNSサーバに問い合わせを行うPCのソフトウェア：', style: 'plain' },
          { text: 'リゾルバ', style: 'red' },
        ],
        [
          { text: 'DNSは多数のDNSサーバで構成される分散型データベース。ツリー構造の頂点にあるサーバ：', style: 'plain' },
          { text: 'ルート', style: 'red' },
          { text: 'DNSサーバ', style: 'plain' },
        ],
      ],
    },
    {
      heading: 'ゾーン転送',
      richItems: [
        [
          { text: 'ゾーン転送の流れ①：ゾーン転送を要求（', style: 'plain' },
          { text: 'セカンダリ', style: 'red' },
          { text: 'DNSサーバ→', style: 'plain' },
          { text: 'プライマリ', style: 'red' },
          { text: 'DNSサーバ）', style: 'plain' },
        ],
        [
          { text: '②ゾーン情報が更新されていた場合、ゾーン転送（', style: 'plain' },
          { text: 'プライマリ', style: 'red' },
          { text: 'DNSサーバ→', style: 'plain' },
          { text: 'セカンダリ', style: 'red' },
          { text: 'DNSサーバ）', style: 'plain' },
        ],
        [
          { text: '※プライマリDNSサーバはゾーン情報を更新すると、セカンダリにリアルタイムで更新通知（', style: 'plain' },
          { text: 'NOTIFY', style: 'red' },
          { text: 'メッセージ）を送信する', style: 'plain' },
        ],
      ],
    },
    {
      heading: 'コンテンツDNSとキャッシュDNS',
      richItems: [
        [
          { text: 'コンテンツ', style: 'red' },
          { text: 'DNSサーバ（権威DNSサーバ）：', style: 'plain' },
          { text: 'ドメイン', style: 'red' },
          { text: ' 情報を持つ', style: 'plain' },
        ],
        [
          { text: 'キャッシュDNSサーバ（', style: 'plain' },
          { text: 'フル', style: 'red' },
          { text: ' リゾルバ）：名前解決を最後まで行う。ドメイン情報を持たず、PCからの問い合わせに対してコンテンツDNSサーバに問い合わせて回答する', style: 'plain' },
        ],
        [
          { text: '上位ドメインの権威サーバから下位ドメインの権威サーバまで繰り返して行う問い合わせ ⇒ ', style: 'plain' },
          { text: '反復', style: 'red' },
          { text: ' 問い合わせ', style: 'plain' },
        ],
        [
          { text: 'キャッシュDNSサーバの目的：①DNS問い合わせの高速化、②DNS問い合わせトラフィックの減少', style: 'plain' },
        ],
        [
          { text: 'PCのネットワーク設定で指定するDNSサーバは ', style: 'plain' },
          { text: 'キャッシュ', style: 'red' },
          { text: 'DNSサーバ', style: 'plain' },
        ],
        [
          { text: 'スタブリゾルバ：クライアントPCの名前解決ソフトウェア。PCからキャッシュDNSサーバに対する問い合わせ ⇒ ', style: 'plain' },
          { text: '再帰', style: 'red' },
          { text: ' 問い合わせ', style: 'plain' },
        ],
        [
          { text: 'hosts', style: 'red' },
          { text: ' ファイル：OS内でホスト名とIPアドレスの対応を管理するファイル（ほぼDNS）', style: 'plain' },
        ],
        [
          { text: 'DNS', style: 'plain' },
          { text: 'フォワーダ', style: 'red' },
          { text: '：フルサービスリゾルバに名前解決要求を転送するサーバ', style: 'plain' },
        ],
      ],
    },
    {
      heading: 'DNSレコード',
      richItems: [
        [
          { text: 'A', style: 'red' },
          { text: ' レコード：ホスト名に対する ', style: 'plain' },
          { text: 'IPアドレス', style: 'red' },
          { text: ' を登録（例：www IN A 203.0.113.123）', style: 'plain' },
        ],
        [
          { text: '同一ホスト名に対して複数のAレコードを登録すると、IPアドレスが異なる複数のサーバに ', style: 'plain' },
          { text: '負荷分散', style: 'red' },
          { text: ' が可能 ⇒ ', style: 'plain' },
          { text: 'DNSラウンドロビン', style: 'red' },
        ],
        [
          { text: 'MX', style: 'red' },
          { text: ' レコード：メールサーバの ', style: 'plain' },
          { text: 'FQDN', style: 'red' },
          { text: '、プライオリティ（例：(ドメイン名) IN MX 10 mx1.mamiya.com）。MXレコードの ', style: 'plain' },
          { text: 'プリファレンス', style: 'red' },
          { text: ' は ', style: 'plain' },
          { text: '小さい', style: 'red' },
          { text: ' 方が優先', style: 'plain' },
        ],
        [
          { text: 'CNAMEレコード：', style: 'plain' },
          { text: 'ホスト名', style: 'red' },
          { text: ' に別名をつける（例：web.name.com. IN CNAME www.betumei.com）', style: 'plain' },
        ],
        [
          { text: 'NS', style: 'red' },
          { text: ' レコード：そのゾーン自身や下位ドメインに関するDNSサーバのホスト名を指定する', style: 'plain' },
        ],
      ],
    },
    {
      heading: 'DNSの冗長化',
      richItems: [
        [
          { text: 'VRRPとの違い：VRRPは1台だけActive、DNSでは複数台のサーバがActive', style: 'plain' },
        ],
        [
          { text: 'DNSでは、設定情報を ', style: 'plain' },
          { text: 'マスタ', style: 'red' },
          { text: 'DNSサーバから ', style: 'plain' },
          { text: 'スレーブ', style: 'red' },
          { text: 'DNSサーバにコピー（VRRPは両方に設定情報を投入）', style: 'plain' },
        ],
      ],
    },
    {
      heading: 'DNSのセキュリティ',
      richItems: [
        [
          { text: 'コンテンツDNSサーバ：', style: 'plain' },
          { text: 'DMZ', style: 'red' },
          { text: ' 内（外部からの問い合わせに応答するため、フルリゾルバ機能は無効にする）', style: 'plain' },
        ],
        [
          { text: 'キャッシュDNSサーバ：', style: 'plain' },
          { text: '内部LAN', style: 'red' },
          { text: '（外部からの問い合わせを拒否するため。社内PCからのDNS問合せのみ受け付ける）', style: 'plain' },
        ],
        [
          { text: '内部DNSサーバ：', style: 'plain' },
          { text: '内部LAN', style: 'red' },
          { text: ' のゾーン情報を管理。当該ゾーンに存在しないホストの名前解決要求は外部DNSサーバに転送（転送の観点から「', style: 'plain' },
          { text: 'フォワーダ', style: 'red' },
          { text: '」とよぶ）', style: 'plain' },
        ],
        [
          { text: 'DNSキャッシュポイズニング', style: 'red' },
          { text: ' 攻撃：DNSサーバに偽のDNS情報を入れ、利用者に ', style: 'plain' },
          { text: '偽サイト', style: 'red' },
          { text: ' ', style: 'plain' },
          { text: 'にアクセス', style: 'red' },
          { text: ' させるサイバー攻撃', style: 'plain' },
        ],
        [
          { text: 'DNSサーバは、DNS問合せに関して、複数の応答があった場合、', style: 'plain' },
          { text: '先', style: 'red' },
          { text: ' にきた情報を正しいと判断する', style: 'plain' },
        ],
        [
          { text: 'DNSキャッシュポイズニングを成功させる方法：IPアドレスやポート番号を正しく偽装する必要／全ての問合せIDを付与してパケットを送信する', style: 'plain' },
        ],
        [
          { text: '対策①：送信元 ', style: 'plain' },
          { text: 'ポート番号', style: 'red' },
          { text: ' のランダム化', style: 'plain' },
        ],
        [
          { text: '対策②：DNSサーバを、', style: 'plain' },
          { text: 'コンテンツ', style: 'red' },
          { text: ' サーバと ', style: 'plain' },
          { text: 'キャッシュ', style: 'red' },
          { text: ' サーバに分け、', style: 'plain' },
          { text: 'キャッシュ', style: 'red' },
          { text: ' サーバを内部LANに配置', style: 'plain' },
        ],
        [
          { text: '対策③：DNSSEC ⇒ ', style: 'plain' },
          { text: 'デジタル署名', style: 'red' },
          { text: ' を用いて、DNSキャッシュサーバの応答が正しく、', style: 'plain' },
          { text: '改ざん', style: 'red' },
          { text: ' されていないことを確認', style: 'plain' },
        ],
      ],
    },
  ],
  exam_tips: [
    'コンテンツDNS（権威）と==キャッシュDNS（フルリゾルバ）==を分けて配置',
    '==反復==問い合わせ（フル → 権威）と==再帰==問い合わせ（PC → フル）の違い',
    'Aレコード複数登録 ⇒ ==DNSラウンドロビン==',
    'MXは数値の==小さい==方が優先',
    'コンテンツDNSは==DMZ==、キャッシュDNSは==内部LAN==',
    'DNSSECは==デジタル署名==で改ざん検知',
  ],
}
