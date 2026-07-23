import type { NoteData } from './types'

/** SSL/TLS・PKI */
export const ssl_tls: NoteData = {
  summary: '復習ノート「SSL/TLS」「セキュリティ」より。TLSハンドシェイク／PKI（証明書・認証局）／SSL-VPNの3方式を整理。',
  sections: [
    {
      heading: 'SSL/TLS の基本',
      richItems: [
        [
          { text: 'Secure Socket Layer / Transport Layer Security — データを', style: 'plain' },
          { text: '暗号化', style: 'red' },
          { text: '・', style: 'plain' },
          { text: '認証', style: 'red' },
          { text: ' してセキュアな通信路を確保するプロトコル', style: 'plain' },
        ],
        [
          { text: '代表例：HTTPS（HTTP over SSL/TLS）。ポート番号は ', style: 'plain' },
          { text: '443', style: 'red' },
        ],
        [
          { text: 'TLS通信の前は ', style: 'plain' },
          { text: '認証・鍵交換', style: 'red' },
          { text: ' で、暗号化アルゴリズムを使用', style: 'plain' },
        ],
        [
          { text: 'ハッシュは ', style: 'plain' },
          { text: 'メッセージ認証', style: 'red' },
          { text: ' に使われる', style: 'plain' },
        ],
      ],
    },
    {
      heading: 'SSL通信シーケンス',
      richItems: [
        [
          { text: '①クライアント → サーバ：', style: 'plain' },
          { text: 'Client Hello', style: 'red' },
          { text: ' を送信。利用可能な暗号化アルゴリズムの一覧を伝える', style: 'plain' },
        ],
        [
          { text: '②サーバ → クライアント：', style: 'plain' },
          { text: 'Server Hello', style: 'red' },
          { text: ' を送信。使用するアルゴリズムを通知する', style: 'plain' },
        ],
        [
          { text: '③続いてサーバ証明書送付・鍵交換・Finished で暗号化通信を確立', style: 'plain' },
        ],
      ],
      navyItems: [
        [
          { text: '補足（TLS 1.2 詳細）：', style: 'plain' },
          { text: 'ClientHello', style: 'navy' },
          { text: ' → ', style: 'plain' },
          { text: 'ServerHello', style: 'navy' },
          { text: ' + Certificate + ServerHelloDone → ', style: 'plain' },
          { text: 'ClientKeyExchange', style: 'navy' },
          { text: '（プリマスタシークレット送付）→ ', style: 'plain' },
          { text: 'ChangeCipherSpec', style: 'navy' },
          { text: ' + Finished', style: 'plain' },
        ],
        [
          { text: 'TLS 1.3', style: 'navy' },
          { text: '：', style: 'plain' },
          { text: '0-RTT', style: 'navy' },
          { text: ' / RSA鍵交換廃止（ECDHEのみ）/ 前方秘匿性', style: 'plain' },
        ],
      ],
    },
    {
      heading: 'PKI / ディジタル証明書',
      richItems: [
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
          { text: 'クライアント証明書をPCに配布する際に必要な情報 ⇒ クライアントの ', style: 'plain' },
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
      navyItems: [
        [
          { text: 'X.509', style: 'navy' },
          { text: '：証明書のフォーマット規格', style: 'plain' },
        ],
        [
          { text: 'CRL', style: 'navy' },
          { text: '（証明書失効リスト）／', style: 'plain' },
          { text: 'OCSP', style: 'navy' },
          { text: '（Online Certificate Status Protocol：失効状態をリアルタイム問い合わせ）', style: 'plain' },
        ],
        [
          { text: 'HSTS', style: 'navy' },
          { text: '（HTTP Strict Transport Security）：HTTPSへ強制リダイレクトをブラウザに記憶させる', style: 'plain' },
        ],
      ],
    },
    {
      heading: 'SSL-VPN',
      richItems: [
        [
          { text: 'IPsecはESPを用いて ', style: 'plain' },
          { text: 'レイヤ3', style: 'red' },
          { text: ' で通信する／SSL-VPNはTCP', style: 'plain' },
          { text: '443', style: 'red' },
          { text: '番（HTTPS）を用いた ', style: 'plain' },
          { text: 'レイヤ4', style: 'red' },
          { text: ' 通信', style: 'plain' },
        ],
        [
          { text: 'SSL-VPNの方式①：', style: 'plain' },
          { text: 'リバースプロキシ', style: 'red' },
          { text: '。リバースプロキシサーバ（SSL-VPN装置）をWebサーバの前段に設置。Webサーバの改ざんを防ぐことが目的。外部からのアクセスはプロキシが代理応答するので、オリジナルのWebサーバにアクセスできない。改ざん防止以外には、アクセス負荷分散や、キャッシュによる表示速度向上も期待できる。Webブラウザで動作しないアプリには使用できない', style: 'plain' },
        ],
        [
          { text: 'SSL-VPNの方式②：', style: 'plain' },
          { text: 'ポートフォワーディング', style: 'red' },
          { text: '。SSL-VPN装置で、サーバのIPアドレスとポート番号を事前に定義。通信中に動的にサーバのポート番号が変化するアプリケーションには使えない', style: 'plain' },
        ],
        [
          { text: 'SSL-VPNの方式③：', style: 'plain' },
          { text: 'L2フォワーディング', style: 'red' },
          { text: '。PCに専用のソフトウェアをインストール。PCとSSL-VPN装置間でSSLのトンネルを作成。レイヤ2レベルの通信が行えるので、同一LAN内にいるかのような通信が行える。PCには仮想のIPアドレスが払い出される。使用するプロトコルの制限が無い', style: 'plain' },
        ],
      ],
    },
  ],
  exam_tips: [
    'HTTPS のポートは ==443==',
    'TLSハンドシェイクは ==ClientHello → ServerHello== の順',
    'クライアント証明書配布時には ==秘密鍵== が必要',
    'サーバ証明書は接続FQDNと ==CN== の一致確認',
    'SSL-VPN：==リバースプロキシ==／==ポートフォワーディング==／==L2フォワーディング== の3方式',
    'IPsec は ==L3==／SSL-VPN は ==L4==',
  ],
}
