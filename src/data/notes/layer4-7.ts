import type { NoteData } from './types'

export const layer4_7: NoteData = {
  summary: '復習ノート「レイヤ4,7基礎」準拠。TCPとUDP（L4）／DoS・DDoS攻撃／HTTP・HTTP/2・Cookie・セッション管理を中心に整理。',
  sections: [
    {
      heading: 'TCPとUDP（レイヤ4プロトコル）',
      richItems: [
        [
          { text: 'レイヤ', style: 'plain' },
          { text: '4', style: 'red' },
          { text: '：トランスポート層', style: 'plain' },
        ],
        [
          { text: 'UDPを使うアプリケーション例：', style: 'plain' },
          { text: 'SIP', style: 'red' },
          { text: ', ', style: 'plain' },
          { text: 'ARP', style: 'red' },
          { text: ', ', style: 'plain' },
          { text: 'SNMP', style: 'red' },
          { text: ', ', style: 'plain' },
          { text: 'NTP', style: 'red' },
          { text: ', ', style: 'plain' },
          { text: 'DNS', style: 'red' },
          { text: ', ', style: 'plain' },
          { text: 'DHCP', style: 'red' },
          { text: ' 等', style: 'plain' },
        ],
        [
          { text: 'TCPヘッダとセグメント構造：', style: 'plain' },
          { text: '送信元', style: 'red' },
          { text: 'ポート番号 / ', style: 'plain' },
          { text: '宛先', style: 'red' },
          { text: 'ポート番号 / その他のヘッダ / データ', style: 'plain' },
        ],
        [
          { text: 'TCPヘッダの中で、パケットの順番を管理するための番号 ⇒ ', style: 'plain' },
          { text: 'シーケンス', style: 'red' },
          { text: '番号', style: 'plain' },
        ],
        [
          { text: 'TCPで動作するプロトコル（HTTP, SMTP 等）は事実上IPアドレスの詐称が ', style: 'plain' },
          { text: '不可', style: 'red' },
          { text: '（IPアドレスを偽装すると ', style: 'plain' },
          { text: '3ウェイハンドシェイク', style: 'red' },
          { text: ' が成立しないため）', style: 'plain' },
        ],
        [
          { text: 'IPパケットの最大サイズは ', style: 'plain' },
          { text: 'MTU', style: 'red' },
          { text: '。通常は ', style: 'plain' },
          { text: '1500', style: 'red' },
          { text: ' バイト', style: 'plain' },
        ],
        [
          { text: 'TCP/IPヘッダを除いたデータ部分を ', style: 'plain' },
          { text: 'MSS', style: 'red' },
          { text: '（Maximum Segment Size）。最大サイズは ', style: 'plain' },
          { text: '1460', style: 'red' },
          { text: ' バイト（IPヘッダとTCPヘッダが各 ', style: 'plain' },
          { text: '20', style: 'red' },
          { text: ' バイトのため）', style: 'plain' },
        ],
      ],
      headerDiagrams: [
        {
          title: 'TCPヘッダとセグメント構造',
          rows: [
            {
              cells: [
                { label: '送信元\nポート番号', bg: '#fef3c7', isRed: true },
                { label: '宛先\nポート番号',   bg: '#fef3c7', isRed: true },
                { label: 'その他のヘッダ\n(シーケンス番号 等)', bg: '#fde68a', span: 2 },
                { label: 'データ',             bg: '#dcfce7', span: 2 },
              ],
            },
          ],
          caption: '黄＝L4ヘッダ／緑＝L4ペイロード。シーケンス番号でパケット順序を管理。',
        },
      ],
    },
    {
      heading: 'DoS攻撃／DDoS攻撃',
      richItems: [
        [
          { text: 'DoS攻撃：大量のパケットをサーバに送り付け、サービス提供に影響を与えるサイバー攻撃', style: 'plain' },
        ],
        [
          { text: 'DoS攻撃は ', style: 'plain' },
          { text: '送信元IPアドレス', style: 'red' },
          { text: ' を偽装して行われることがある', style: 'plain' },
        ],
        [
          { text: '偽装理由①：自分の身元を明かさず攻撃するため', style: 'plain' },
        ],
        [
          { text: '偽装理由②：FW などのフィルタリング機能で簡単に防御されないため', style: 'plain' },
        ],
        [
          { text: '送信元IPアドレスを偽装し、ICMPの応答パケットを大量発生させ攻撃対象に送る ', style: 'plain' },
          { text: '分散', style: 'red' },
          { text: '型DoS攻撃（DDoS）⇒ ', style: 'plain' },
          { text: 'スマーフ', style: 'red' },
          { text: ' 攻撃。送信元IPアドレスを ', style: 'plain' },
          { text: '攻撃対象', style: 'red' },
          { text: ' のサーバに偽装', style: 'plain' },
        ],
        [
          { text: 'SYNフラッド攻撃：SYNパケットを送り付けた後、', style: 'plain' },
          { text: 'ACK', style: 'red' },
          { text: ' パケットが攻撃対象のホストに届かないようにし、未完了の接続開始処理を大量発生させる（メモリを大量消費）', style: 'plain' },
        ],
        [
          { text: 'DNSリフレクタ', style: 'red' },
          { text: '（DNSアンプ）攻撃：送信元IPアドレスを攻撃対象に偽装したDNS問合せを大量に送付。応答パケットを大きくするため一般的に ', style: 'plain' },
          { text: 'TXT', style: 'red' },
          { text: ' レコードを問い合わせる', style: 'plain' },
        ],
      ],
    },
    {
      heading: 'HTTP — メソッドとステータスコード',
      richItems: [
        [
          { text: 'HTTPのメソッド：', style: 'plain' },
          { text: 'GET', style: 'red' },
          { text: '（Webサーバからのコンテンツ取得）／POST（Webサーバへのデータ送信）', style: 'plain' },
        ],
        [
          { text: 'CONNECT', style: 'red' },
          { text: '：', style: 'plain' },
          { text: 'プロキシ', style: 'red' },
          { text: ' サーバへのHTTPS中継依頼。PCから ', style: 'plain' },
          { text: 'プロキシ', style: 'red' },
          { text: ' サーバに対して利用', style: 'plain' },
        ],
        [
          { text: 'HTTPSはPCとWEBサーバ間で暗号化通信が行われるが、プロキシは暗号鍵が分からないので暗号を解いた中継処理ができない。CONNECTメソッドが適用されると、プロキシはHTTPS通信に対して何もせず通過させる', style: 'plain' },
        ],
        [
          { text: 'CONNECTは制限しないとTCP/', style: 'plain' },
          { text: '443', style: 'red' },
          { text: ' 以外のポートでも使えてしまう（なので制限すべき）', style: 'plain' },
        ],
        [
          { text: 'HTTPレスポンスに含まれる3桁の数字 ⇒ ステータスコード', style: 'plain' },
        ],
        [
          { text: 'ステータスコード：', style: 'plain' },
          { text: '200', style: 'red' },
          { text: '（リクエスト成功）／', style: 'plain' },
          { text: '404', style: 'red' },
          { text: '（指定ページが無い）／302（', style: 'plain' },
          { text: 'リダイレクト', style: 'red' },
          { text: '）', style: 'plain' },
        ],
      ],
    },
    {
      heading: 'セッション管理とCookie',
      richItems: [
        [
          { text: 'クライアントとサーバ間でログイン情報を保持・管理する仕組み ⇒ ', style: 'plain' },
          { text: 'セッション', style: 'red' },
          { text: ' 管理', style: 'plain' },
        ],
        [
          { text: 'セッションとTCPの違い：セッションは上位層（L5〜7）の処理／TCPはトランスポート層のコネクション（3ウェイハンドシェイクが行われる一連の通信）', style: 'plain' },
        ],
        [
          { text: 'Cookie', style: 'red' },
          { text: '：セッション管理でよく利用される、クライアントとサーバ間で保持される情報', style: 'plain' },
        ],
        [
          { text: 'CookieのセッションIDを発行するのは ', style: 'plain' },
          { text: 'サーバ', style: 'red' },
          { text: ' 側。WebサーバはHTTPレスポンスの "', style: 'plain' },
          { text: 'Set-Cookie', style: 'red' },
          { text: '" ヘッダフィールドにセッションIDを書き込む', style: 'plain' },
        ],
        [
          { text: 'Secure', style: 'red' },
          { text: ' 属性：暗号化された通信（HTTPS）のみCookieを送り、HTTPでは ', style: 'plain' },
          { text: '送らない', style: 'red' },
        ],
        [
          { text: 'Domain', style: 'red' },
          { text: ' 属性：ドメインを指定しないと ', style: 'plain' },
          { text: '発行したサーバ', style: 'red' },
          { text: ' にしかCookieが送られない', style: 'plain' },
        ],
      ],
    },
    {
      heading: 'HTTPヘッダ／URI／HTTP/2',
      richItems: [
        [
          { text: 'URLは ', style: 'plain' },
          { text: 'ホスト', style: 'red' },
          { text: ' ヘッダフィールドに埋め込まれる。ヘッダにFQDNをもつのはHTTPだけ（LB等で他プロトコルはFQDNで振り分けられない）', style: 'plain' },
        ],
        [
          { text: 'Upgrade ヘッダ：別のプロトコルに切り替えを要求', style: 'plain' },
        ],
        [
          { text: 'Request-URI：接続先のFQDN（ホスト名）やポート番号が含まれる', style: 'plain' },
        ],
        [
          { text: 'HTTP/2：HTTP1.1の問題点を解消し、一つのTCPコネクションで複数のファイルを同時にやりとりできるプロトコル', style: 'plain' },
        ],
        [
          { text: 'ストリーム', style: 'red' },
          { text: '：HTTP/2 において、TCPコネクション上で作られる仮想的な通信路 ⇒ ', style: 'plain' },
          { text: '順序', style: 'red' },
          { text: ' の制約がなくなる', style: 'plain' },
        ],
      ],
    },
    // ── 復習ノートに無い既存項目（ネイビー強調のみで残す） ──────────
    {
      heading: '補足：輻輳制御（参考）',
      navyItems: [
        [
          { text: 'スロースタート', style: 'navy' },
          { text: '：ウィンドウを1から', style: 'plain' },
          { text: '指数的', style: 'navy' },
          { text: 'に増加（ssthreshまで）', style: 'plain' },
        ],
        [
          { text: '輻輳回避', style: 'navy' },
          { text: '：ssthresh到達後は', style: 'plain' },
          { text: '線形増加', style: 'navy' },
          { text: '（1 MSS/RTT）', style: 'plain' },
        ],
        [
          { text: '高速再転送', style: 'navy' },
          { text: '：', style: 'plain' },
          { text: '3つのDuplicate ACK', style: 'navy' },
          { text: 'でタイムアウト前に再送', style: 'plain' },
        ],
        [
          { text: 'RED（Random Early Detection）：キュー満杯前にランダムドロップで輻輳崩壊を防止', style: 'plain' },
        ],
      ],
    },
    {
      heading: '補足：ICMPタイプ（参考）',
      navyItems: [
        [
          { text: 'Type ', style: 'plain' },
          { text: '8', style: 'navy' },
          { text: '（Echo Request）/ Type ', style: 'plain' },
          { text: '0', style: 'navy' },
          { text: '（Echo Reply）：ping', style: 'plain' },
        ],
        [
          { text: 'Type ', style: 'plain' },
          { text: '11', style: 'navy' },
          { text: '（Time Exceeded）：TTL=0でルータが返す。traceroute', style: 'plain' },
        ],
        [
          { text: 'Type ', style: 'plain' },
          { text: '3', style: 'navy' },
          { text: '（Destination Unreachable）：到達不能。コード3はポート到達不能', style: 'plain' },
        ],
        [
          { text: 'DFビット', style: 'navy' },
          { text: '（Don\'t Fragment）：PMTUDに使用', style: 'plain' },
        ],
      ],
    },
    {
      heading: '補足：HTTPバージョン（参考）',
      navyItems: [
        [
          { text: 'HTTP/1.1：テキストベース。Keep-Alive対応。', style: 'plain' },
          { text: 'HoLブロッキング', style: 'navy' },
          { text: 'あり', style: 'plain' },
        ],
        [
          { text: 'HTTP/2：バイナリフレーム・', style: 'plain' },
          { text: 'マルチプレキシング', style: 'navy' },
          { text: '・HPACK圧縮・サーバプッシュ', style: 'plain' },
        ],
        [
          { text: 'HTTP/3', style: 'navy' },
          { text: '：', style: 'plain' },
          { text: 'QUIC', style: 'navy' },
          { text: '（UDP）上で動作。TCPのHoLブロッキングを', style: 'plain' },
          { text: '根本解決', style: 'navy' },
          { text: '。TLS 1.3が統合', style: 'plain' },
        ],
        [
          { text: 'QUIC：', style: 'plain' },
          { text: '0-RTT接続', style: 'navy' },
          { text: '／ストリーム独立再送制御／接続移行', style: 'plain' },
        ],
        [
          { text: 'QUIC（UDP）はNAPT変換エントリーの', style: 'plain' },
          { text: 'エージングタイム', style: 'navy' },
          { text: 'を短く設定／FWで', style: 'plain' },
          { text: 'UDP 443', style: 'navy' },
          { text: 'を許可', style: 'plain' },
        ],
      ],
    },
    {
      heading: '補足：HTTPS／証明書（参考）',
      navyItems: [
        [
          { text: 'OCSP', style: 'navy' },
          { text: '：証明書の失効状態をリアルタイム確認', style: 'plain' },
        ],
        [
          { text: 'HSTS', style: 'navy' },
          { text: '：常にHTTPS接続するようブラウザに指示するヘッダ', style: 'plain' },
        ],
        [
          { text: 'OCSP Stapling', style: 'navy' },
          { text: '：サーバ自身がOCSP応答をキャッシュしてクライアントに提示（レイテンシ削減）', style: 'plain' },
        ],
      ],
    },
  ],
  exam_tips: [
    'TCPで動作するプロトコルは==IPアドレスの詐称が不可==（3ウェイハンドシェイクが成立しないため）',
    'MTU=1500、MSS=1460（IP/TCPヘッダ各20バイト）は数値で覚える',
    'スマーフ攻撃と==DNSリフレクタ==攻撃はDDoSの代表例',
    'SYNフラッドは==ACK==を返さない＝半開コネクションでメモリ消費',
    'CONNECTメソッドは==TCP/443==以外で使われ得るのでプロキシで制限すべき',
    '==Secure属性==／==Domain属性==はCookieセキュリティで頻出',
  ],
}
