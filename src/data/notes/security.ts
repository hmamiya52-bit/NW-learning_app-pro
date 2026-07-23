import type { NoteData } from './types'

export const security: NoteData = {
  summary: '復習ノート「セキュリティ」準拠。標的型攻撃・認証（チャレンジレスポンス・証明書）・SSO・SSL/TLSを整理。SSL-VPN は SSL/TLS・PKI ノートを参照。',
  sections: [
    {
      heading: '標的型攻撃',
      richItems: [
        [
          { text: '標的型攻撃では、攻撃者はマルウェアを送り込み、侵入したマルウェアが ', style: 'plain' },
          { text: 'C&Cサーバ', style: 'red' },
          { text: ' を経由して命令を送る', style: 'plain' },
        ],
        [
          { text: 'FWで外部から通信を全て拒否しているのにPCで遠隔操作できる理由：FWで内部LAN→外部NWの通信が許可されている場合、マルウェアからC&Cサーバに接続させ、その応答パケットで命令を送れるため', style: 'plain' },
        ],
        [
          { text: 'マルウェアがC&Cサーバと通信しないようにするためには、', style: 'plain' },
          { text: 'プロキシ', style: 'red' },
          { text: ' サーバの導入が有効。内部LANからインターネットへの通信は、プロキシサーバ経由でのみ許可する（プロキシサーバの設定を知らないマルウェアに有効）', style: 'plain' },
        ],
        [
          { text: 'プロキシサーバの設定を調査してくるマルウェアへの対策：プロキシサーバで ', style: 'plain' },
          { text: '認証', style: 'red' },
          { text: ' 設定を行う', style: 'plain' },
        ],
      ],
    },
    {
      heading: '認証',
      richItems: [
        [
          { text: 'チャレンジ・レスポンス認証：NWを介してパスワードを安全に送信する仕組み（乱数を暗号化して共通鍵を確認）', style: 'plain' },
        ],
        [
          { text: 'レスポンス自体は第三者に盗聴される可能性がある。安全な理由：利用者は毎回 ', style: 'plain' },
          { text: '異なるパスワード（レスポンス）', style: 'red' },
          { text: ' をサーバに送ることになるから', style: 'plain' },
        ],
        [
          { text: 'ディジタル証明書：本人の ', style: 'plain' },
          { text: '公開鍵', style: 'red' },
          { text: ' であることを証明する', style: 'plain' },
        ],
        [
          { text: 'ルート', style: 'red' },
          { text: ' 証明書：認証局（CA）の公開鍵を証明', style: 'plain' },
        ],
        [
          { text: 'サーバ', style: 'red' },
          { text: ' 証明書：サーバの公開鍵を証明', style: 'plain' },
        ],
        [
          { text: 'クライアント', style: 'red' },
          { text: ' 証明書：クライアント（PC）の公開鍵を証明', style: 'plain' },
        ],
        [
          { text: 'クライアント証明書をPCに配布する際にPC側で必要な情報 ⇒ クライアントの ', style: 'plain' },
          { text: '秘密鍵', style: 'red' },
          { text: '（無いとデータの暗号化ができない）。「クライアント証明書」ときたら「秘密鍵」!', style: 'plain' },
        ],
        [
          { text: '証明書の中には公開鍵がある。持ち主はメッセージのハッシュ値を秘密鍵で暗号化して送る', style: 'plain' },
        ],
        [
          { text: 'サーバ証明書では、接続するFQDNと証明書の ', style: 'plain' },
          { text: 'CN', style: 'red' },
          { text: ' が一致しているか確認する', style: 'plain' },
        ],
        [
          { text: 'CAは誰でも作れる。信頼できる認証機関＝', style: 'plain' },
          { text: '第三者認証局', style: 'red' },
        ],
        [
          { text: 'CAサーバの自社運用は、セキュリティ対策や故障対応で手間がかかる', style: 'plain' },
        ],
      ],
    },
    {
      heading: 'SSO（シングルサインオン）',
      richItems: [
        [
          { text: 'リバースプロキシ', style: 'red' },
          { text: ' 方式と ', style: 'plain' },
          { text: 'エージェント', style: 'red' },
          { text: ' 方式がある', style: 'plain' },
        ],
        [
          { text: 'ネスペにおけるSSOの問題は基本的に国語', style: 'plain' },
        ],
      ],
    },
    {
      heading: 'SSL/TLS',
      richItems: [
        [
          { text: 'Secure Socket Layer / Transport Layer Security — データを暗号化したり認証したりしてセキュアな通信路を確保するプロトコル', style: 'plain' },
        ],
        [
          { text: '代表例：HTTPS（HTTP over SSL/TLS）。ポート番号は ', style: 'plain' },
          { text: '443', style: 'red' },
        ],
        [
          { text: 'SSLの通信シーケンス①：クライアント→サーバ：', style: 'plain' },
          { text: 'Client Hello', style: 'red' },
          { text: ' を送信。利用可能な暗号化アルゴリズムの一覧を伝える', style: 'plain' },
        ],
        [
          { text: 'SSLの通信シーケンス②：サーバ→クライアント：', style: 'plain' },
          { text: 'Server Hello', style: 'red' },
          { text: ' を送信。使用するアルゴリズムを通知する', style: 'plain' },
        ],
        [
          { text: 'TLS通信の前は認証・鍵交換で、暗号化アルゴリズムを使用', style: 'plain' },
        ],
        [
          { text: 'ハッシュはメッセージ認証', style: 'plain' },
        ],
      ],
    },
    // ── 復習ノートに無い既存項目（ネイビー強調のみで残す） ──────────
    {
      heading: '補足：TLSハンドシェイク（参考）',
      navyItems: [
        [
          { text: '①', style: 'plain' },
          { text: 'ClientHello', style: 'navy' },
          { text: '（TLSバージョン・乱数・暗号スイート候補）', style: 'plain' },
        ],
        [
          { text: '②', style: 'plain' },
          { text: 'ServerHello', style: 'navy' },
          { text: '（選択した暗号スイート）+ Certificate（サーバ証明書）+ ServerHelloDone', style: 'plain' },
        ],
        [
          { text: '③', style: 'plain' },
          { text: 'ClientKeyExchange', style: 'navy' },
          { text: '（プリマスタシークレット送付）', style: 'plain' },
        ],
        [
          { text: '④', style: 'plain' },
          { text: 'ChangeCipherSpec', style: 'navy' },
          { text: ' + Finished（マスタシークレットで鍵生成、以降暗号化）', style: 'plain' },
        ],
        [
          { text: 'TLS 1.3', style: 'navy' },
          { text: '：', style: 'plain' },
          { text: '0-RTT', style: 'navy' },
          { text: '／RSA鍵交換廃止（ECDHEのみ）／前方秘匿性', style: 'plain' },
        ],
      ],
    },
    {
      heading: '補足：認証連携（参考）',
      navyItems: [
        [
          { text: 'RADIUS', style: 'navy' },
          { text: '：サプリカント／NAS（Authenticator）／RADIUSサーバ。AAA。', style: 'plain' },
          { text: 'UDP 1812', style: 'navy' },
          { text: '（認証）／', style: 'plain' },
          { text: 'UDP 1813', style: 'navy' },
          { text: '（アカウンティング）', style: 'plain' },
        ],
        [
          { text: 'LDAP', style: 'navy' },
          { text: '：X.500ベース。', style: 'plain' },
          { text: 'TCP 389', style: 'navy' },
          { text: '（平文）／', style: 'plain' },
          { text: 'TCP 636', style: 'navy' },
          { text: '（LDAPS）', style: 'plain' },
        ],
        [
          { text: 'Kerberos', style: 'navy' },
          { text: '：', style: 'plain' },
          { text: 'TGT', style: 'navy' },
          { text: ' → ', style: 'plain' },
          { text: 'ST', style: 'navy' },
          { text: ' の2段階チケット認証', style: 'plain' },
        ],
        [
          { text: 'SAML', style: 'navy' },
          { text: '：XMLベースSSO。IdPとSP間でアサーション交換', style: 'plain' },
        ],
        [
          { text: 'OAuth 2.0', style: 'navy' },
          { text: '：認可フレームワーク／', style: 'plain' },
          { text: 'OpenID Connect', style: 'navy' },
          { text: '：OAuth上の認証層', style: 'plain' },
        ],
      ],
    },
    {
      heading: '補足：Webアプリ攻撃（参考）',
      navyItems: [
        [
          { text: 'SQLインジェクション', style: 'navy' },
          { text: '：入力値にSQL構文を埋め込みDB不正操作（対策：プリペアドステートメント）', style: 'plain' },
        ],
        [
          { text: 'XSS', style: 'navy' },
          { text: '（クロスサイトスクリプティング）：悪意のスクリプトを反射／格納（対策：エスケープ・CSP）', style: 'plain' },
        ],
        [
          { text: 'CSRF', style: 'navy' },
          { text: '：認証済みセッションを悪用（対策：CSRFトークン／SameSite Cookie）', style: 'plain' },
        ],
        [
          { text: 'ディレクトリトラバーサル', style: 'navy' },
          { text: '：../でパスをさかのぼる（対策：入力値検証）', style: 'plain' },
        ],
      ],
    },
  ],
  exam_tips: [
    'C&Cサーバ対策＝プロキシ強制（＋認証）',
    'チャレンジレスポンス：毎回==異なるレスポンス==で安全',
    'クライアント証明書配布時には==秘密鍵==が必要',
    'サーバ証明書は接続FQDNと==CN==の一致確認',
  ],
}
