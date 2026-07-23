import type { NoteData } from './types'

export const wireless: NoteData = {
  summary: '復習ノート「無線LAN」準拠。基礎・規格・WLC・PoE・無線LANセキュリティ（WPA/WPA2/WPA3）・802.1X認証・ハンドオーバを整理。',
  sections: [
    {
      heading: '無線LANの基礎',
      richItems: [
        [
          { text: 'アクセスポイント（AP）からクライアントに対して自分の存在を通知する信号：', style: 'plain' },
          { text: 'ビーコン', style: 'red' },
        ],
        [
          { text: '無線LANを識別するためのID：', style: 'plain' },
          { text: 'SSID', style: 'red' },
        ],
        [
          { text: '異なる周波数帯の規格での互換性はない', style: 'plain' },
        ],
        [
          { text: 'IEEE 802.11g：1から13までのチャネルがある。5チャネル離れている組み合わせ（1, 6, 11ch等）では周波数が重ならないため、干渉しづらい', style: 'plain' },
        ],
        [
          { text: '無線LANではアクセス制御に ', style: 'plain' },
          { text: 'CSMA/CA', style: 'red' },
          { text: ' 方式を用いる', style: 'plain' },
        ],
      ],
    },
    {
      heading: '無線LANの規格（IEEE）',
      richItems: [
        [
          { text: '802.11b：2.4GHz、11Mbps', style: 'plain' },
        ],
        [
          { text: '802.11g', style: 'red' },
          { text: '：2.4GHz、20MHz、54Mbps', style: 'plain' },
        ],
        [
          { text: '802.11a', style: 'red' },
          { text: '：5GHz、20MHz、54Mbps', style: 'plain' },
        ],
        [
          { text: '802.11n', style: 'red' },
          { text: '：2.4/5GHz、20/40MHz、600Mbps', style: 'plain' },
        ],
        [
          { text: '802.11ac', style: 'red' },
          { text: '：5GHz、20/40/80/160MHz、6.93Gbps（MU-MIMOは ', style: 'plain' },
          { text: 'ac', style: 'red' },
          { text: ' から）', style: 'plain' },
        ],
        [
          { text: '802.11ax', style: 'red' },
          { text: '：2.4/5GHz、9.6Gbps', style: 'plain' },
        ],
      ],
    },
    {
      heading: '無線LANコントローラ（WLC）',
      richItems: [
        [
          { text: '無線LANが大規模になるにつれて、設定の一元管理を目的としてWLCを用いることが多くなる', style: 'plain' },
        ],
        [
          { text: 'WLCの機能：APの ', style: 'plain' },
          { text: '構成', style: 'red' },
          { text: ' と ', style: 'plain' },
          { text: '設定', style: 'red' },
          { text: ' を管理／APのステータス（', style: 'plain' },
          { text: 'リンクダウン', style: 'red' },
          { text: '、', style: 'plain' },
          { text: '接続端末数', style: 'red' },
          { text: ' 等）監視／AP同士の電波干渉の検知／APの ', style: 'plain' },
          { text: '負荷分散', style: 'red' },
          { text: ' 制御', style: 'plain' },
        ],
        [
          { text: 'PMK', style: 'red' },
          { text: ' の保持などによる ', style: 'plain' },
          { text: 'ハンドオーバ', style: 'red' },
          { text: ' 制御（', style: 'plain' },
          { text: 'PMK', style: 'red' },
          { text: ' を用いて事前 ', style: 'plain' },
          { text: '認証', style: 'red' },
          { text: ' をしておく）', style: 'plain' },
        ],
        [
          { text: '利用者認証', style: 'red' },
          { text: '、', style: 'plain' },
          { text: '認証VLAN', style: 'red' },
          { text: ' などのセキュリティ対策機能', style: 'plain' },
        ],
        [
          { text: 'WLCを導入したら、APは ', style: 'plain' },
          { text: '通信をただ転送', style: 'red' },
          { text: ' するスイッチングハブのような役割になる。認証機能などはほぼ全てWLCに任せる', style: 'plain' },
        ],
        [
          { text: 'WLCの2つのモード', style: 'plain' },
        ],
        [
          { text: '　モードA：', style: 'plain' },
          { text: '管理機能だけ', style: 'red' },
          { text: ' をWLCが行い、実際の通信はWLCを経由しない', style: 'plain' },
        ],
        [
          { text: '　　【モードA利点①】WLCへの ', style: 'plain' },
          { text: '通信負荷集中', style: 'red' },
          { text: ' を抑制可能', style: 'plain' },
        ],
        [
          { text: '　　【モードA利点②】認証後にWLCに障害が発生しても、その ', style: 'plain' },
          { text: '無線LAN端末は通信が継続可能', style: 'red' },
        ],
        [
          { text: '　モードB：', style: 'plain' },
          { text: '実際の通信もWLCを経由', style: 'red' },
          { text: ' させる', style: 'plain' },
        ],
        [
          { text: 'モバイルWi-Fiルータには、利用者ID・パスワード・', style: 'plain' },
          { text: 'APN', style: 'red' },
          { text: '（LTE回線からインターネットへのゲートウェイの指定）の情報を設定', style: 'plain' },
        ],
      ],
    },
    {
      heading: '電波干渉と高速化技術',
      richItems: [
        [
          { text: '電波干渉を防ぐには：', style: 'plain' },
          { text: '周波数帯', style: 'red' },
          { text: ' を変える／', style: 'plain' },
          { text: 'チャネル', style: 'red' },
          { text: ' を変える（', style: 'plain' },
          { text: 'チャネル', style: 'red' },
          { text: ' を ', style: 'plain' },
          { text: '離す', style: 'red' },
          { text: '）／AP等の距離を離す', style: 'plain' },
        ],
        [
          { text: 'MIMO', style: 'red' },
          { text: '：複数のアンテナを束ねて同時に通信することで高速化（.11nや.11ac等）', style: 'plain' },
        ],
        [
          { text: 'チャネルボンディング', style: 'red' },
          { text: '：帯域幅を重ねる技術（通常20MHzを2倍の40MHzで通信＝速度2倍）', style: 'plain' },
        ],
        [
          { text: 'MIMOとチャネルボンディングは併用できる', style: 'plain' },
        ],
        [
          { text: 'デュアル', style: 'red' },
          { text: ' バンド：2.4GHzと5GHzの2つの周波数帯を併用。3つ使うなら ', style: 'plain' },
          { text: 'トライ', style: 'red' },
          { text: ' バンド。目的：多数の端末を ', style: 'plain' },
          { text: '安定', style: 'red' },
          { text: ' して接続させる（高速化ではない。一つの端末が使える周波数帯は変わらない）', style: 'plain' },
        ],
        [
          { text: '2.4GHz帯を利用する近距離・低消費電力の無線通信技術 ⇒ ', style: 'plain' },
          { text: 'Bluetooth', style: 'red' },
        ],
      ],
    },
    {
      heading: 'PoE（Power over Ethernet）',
      richItems: [
        [
          { text: '有線LANを利用した電力供給。天井などの電源コンセントが無い場所に無線APを設置するときに有用', style: 'plain' },
        ],
        [
          { text: 'IEEE ', style: 'plain' },
          { text: '802.3af', style: 'red' },
          { text: '：消費電力15.4W、別名PoE', style: 'plain' },
        ],
        [
          { text: 'IEEE ', style: 'plain' },
          { text: '802.3at', style: 'red' },
          { text: '：消費電力 ', style: 'plain' },
          { text: '30', style: 'red' },
          { text: 'W、別名 ', style: 'plain' },
          { text: 'PoE+', style: 'red' },
        ],
        [
          { text: 'IEEE ', style: 'plain' },
          { text: '802.3bt', style: 'red' },
          { text: '：消費電力 ', style: 'plain' },
          { text: '60', style: 'red' },
          { text: 'W、別名PoE++', style: 'plain' },
        ],
      ],
    },
    {
      heading: '無線LANのセキュリティ',
      richItems: [
        [
          { text: '無線LANは有線LANに比べてセキュリティ対策を十分に行う必要がある（電波の届く範囲なら壁を越えどこでも通信可能で、第三者が盗聴などの不正行為をしやすい）', style: 'plain' },
        ],
        [
          { text: 'any', style: 'red' },
          { text: ' 接続拒否：無線LANのAP設定で、SSIDが空白または ', style: 'plain' },
          { text: 'any', style: 'red' },
          { text: ' での接続要求を拒否する機能', style: 'plain' },
        ],
        [
          { text: 'APで定期的に送信するビーコン信号を停止する機能 ⇒ SSIDの ', style: 'plain' },
          { text: 'ステルス', style: 'red' },
          { text: ' 機能', style: 'plain' },
        ],
        [
          { text: 'SSIDやMACアドレスは ', style: 'plain' },
          { text: '暗号化', style: 'red' },
          { text: ' できないため、無線LANの認証に適さない', style: 'plain' },
        ],
        [
          { text: '代表的な無線LANセキュリティ方式：WEP、WPA、WPA2', style: 'plain' },
        ],
        [
          { text: 'WPAでは ', style: 'plain' },
          { text: 'RC4', style: 'red' },
          { text: ' を利用／WPA2ではより強固な ', style: 'plain' },
          { text: 'AES', style: 'red' },
          { text: ' を利用', style: 'plain' },
        ],
        [
          { text: 'WPA2ではPSKを使ったが、新規格のWPA3では事前共有鍵をより安全にやりとりする ', style: 'plain' },
          { text: 'SAE', style: 'red' },
          { text: ' という技術に改良。SAEはパスワードと ', style: 'plain' },
          { text: 'MACアドレス', style: 'red' },
          { text: '、乱数で暗号化を行う', style: 'plain' },
        ],
        [
          { text: 'TKIP — フェーズ1：一時鍵、IV、無線LAN端末のMACアドレスの3つを混合してキーストリーム1を生成／フェーズ2：キーストリーム1にIVの拡張部分を混合して暗号鍵であるキーストリーム2を生成', style: 'plain' },
        ],
        [
          { text: 'WPA（WPA2）の2種類認証：パーソナルモードの ', style: 'plain' },
          { text: 'PSK', style: 'red' },
          { text: '（', style: 'plain' },
          { text: '事前共有', style: 'red' },
          { text: ' 鍵）／エンタープライズモードの ', style: 'plain' },
          { text: 'IEEE 802.1X', style: 'red' },
          { text: ' 認証', style: 'plain' },
        ],
        [
          { text: 'IEEE 802.1X認証：ユーザID/パスワードによる認証である ', style: 'plain' },
          { text: 'PEAP', style: 'red' },
          { text: '、クライアント証明書を使った ', style: 'plain' },
          { text: 'EAP-TLS', style: 'red' },
          { text: ' がある', style: 'plain' },
        ],
        [
          { text: '来訪者にパーソナルモードで無線LANを設定してもらうときに教える情報 ⇒ ', style: 'plain' },
          { text: 'SSID', style: 'red' },
          { text: ' と ', style: 'plain' },
          { text: 'PSK', style: 'red' },
        ],
      ],
    },
    {
      heading: 'ハンドオーバ',
      richItems: [
        [
          { text: 'PMK（Pairwise Master Key）：無線LANの暗号化通信の鍵を乱数を組み合わせて毎回変更するために使う、もとになる鍵', style: 'plain' },
        ],
        [
          { text: 'ハンドオーバ：無線LAN端末を移動しながら利用しているとき、接続APが変わること（接続するAPに改めてPMKの作成などの認証処理が発生するため、一瞬通信ができなくなる＝ハンドオーバ時間）', style: 'plain' },
        ],
        [
          { text: 'WPA2で実装、ハンドオーバ時間短縮機能①：', style: 'plain' },
          { text: '事前認証', style: 'red' },
          { text: '。APが切り替わるタイミングで認証するのではなく、同じNWに接続されている他のAPとは、接続しているAP経由で事前に認証をしておく', style: 'plain' },
        ],
        [
          { text: '機能②：', style: 'plain' },
          { text: '認証キー', style: 'red' },
          { text: ' の保持（PMKキャッシュ）。一度認証した認証キーをAPが保持', style: 'plain' },
        ],
      ],
    },
    // ── 復習ノートに無い既存項目（ネイビー強調のみで残す） ──────────
    {
      heading: '補足：Wi-Fi 6 / Wi-Fi 7（参考）',
      navyItems: [
        [
          { text: '802.11ax', style: 'navy' },
          { text: '（Wi-Fi 6）：', style: 'plain' },
          { text: 'OFDMA', style: 'navy' },
          { text: '・', style: 'plain' },
          { text: '1024-QAM', style: 'navy' },
          { text: '・', style: 'plain' },
          { text: 'TWT', style: 'navy' },
          { text: '（省電力）', style: 'plain' },
        ],
        [
          { text: '802.11ax 6E（Wi-Fi 6E）：', style: 'plain' },
          { text: '6GHz帯', style: 'navy' },
          { text: '追加', style: 'plain' },
        ],
        [
          { text: '802.11be', style: 'navy' },
          { text: '（Wi-Fi 7）：', style: 'plain' },
          { text: '320', style: 'navy' },
          { text: 'MHz・', style: 'plain' },
          { text: '4096-QAM', style: 'navy' },
          { text: '・', style: 'plain' },
          { text: 'MLO', style: 'navy' },
          { text: '・プリアンブルパンクチャリング。最大', style: 'plain' },
          { text: '46', style: 'navy' },
          { text: 'Gbps', style: 'plain' },
        ],
      ],
    },
  ],
  exam_tips: [
    'CSMA/CAは無線LANのアクセス制御方式',
    'IEEE規格と周波数・最大速度の表は丸暗記',
    'WLCのモードA／Bの違い（通信が経由するかどうか）は頻出',
    'PoE: ==802.3af== 15.4W / ==802.3at== 30W (PoE+) / ==802.3bt== 60W (PoE++)',
    'WPA=RC4 / WPA2=AES / WPA3=SAE',
    'PSK＋SSIDでパーソナルモード設定、IEEE 802.1Xでエンタープライズモード',
    'ハンドオーバ高速化＝事前認証＋PMKキャッシュ',
  ],
}
