import type { NoteData } from './types'

/** 脅威・攻撃手法 */
export const threat: NoteData = {
  summary: '復習ノート全体に散らばる攻撃手法を整理。DoS/DDoS（SYNフラッド・スマーフ・DNSリフレクタ）／ARPスプーフィング／SQLインジェクション／XSS／標的型攻撃（C&C）。',
  sections: [
    {
      heading: 'DoS / DDoS 攻撃',
      richItems: [
        [
          { text: 'DoS攻撃：1台から大量パケットを送って対象を停止させる攻撃', style: 'plain' },
        ],
        [
          { text: 'DDoS攻撃：', style: 'plain' },
          { text: '多数', style: 'red' },
          { text: ' のホストから一斉に攻撃する分散型のDoS（踏み台にされた多数のPCから一斉に通信）', style: 'plain' },
        ],
        [
          { text: 'SYNフラッド：TCPの3wayハンドシェイクを悪用。', style: 'plain' },
          { text: 'SYN', style: 'red' },
          { text: ' を大量送信し、サーバを ', style: 'plain' },
          { text: 'SYN_RECV', style: 'red' },
          { text: ' 状態で滞留させてリソースを枯渇', style: 'plain' },
        ],
        [
          { text: 'スマーフ', style: 'red' },
          { text: ' 攻撃：送信元を被害者に偽装した', style: 'plain' },
          { text: 'ICMP Echo Request', style: 'red' },
          { text: ' をブロードキャスト宛に送り、応答（Echo Reply）を被害者に集中させる', style: 'plain' },
        ],
        [
          { text: 'DNSリフレクタ', style: 'red' },
          { text: ' 攻撃（DNSアンプ）：送信元を被害者に偽装した小さなDNSクエリを送り、', style: 'plain' },
          { text: 'TXT', style: 'red' },
          { text: ' レコードなど大きな応答を被害者に返させて回線を圧迫', style: 'plain' },
        ],
        [
          { text: 'ACK', style: 'red' },
          { text: ' リフレクション攻撃：偽装SYNを多数のサーバに送り、応答 SYN/', style: 'plain' },
          { text: 'ACK', style: 'red' },
          { text: ' を被害者に集中させる', style: 'plain' },
        ],
      ],
      navyItems: [
        [
          { text: '対策：', style: 'plain' },
          { text: 'IPS', style: 'navy' },
          { text: '／', style: 'plain' },
          { text: 'WAF', style: 'navy' },
          { text: '／DDoS対策サービス（クラウド型WAF・スクラビングセンタ）', style: 'plain' },
        ],
        [
          { text: 'BCP38', style: 'navy' },
          { text: '：送信元IPの偽装パケットをISP側で破棄するベストプラクティス', style: 'plain' },
        ],
      ],
    },
    {
      heading: '中間者攻撃 / 経路傍受',
      richItems: [
        [
          { text: 'ARPスプーフィング', style: 'red' },
          { text: '：偽のARP応答を返してデフォルトGW等のMACアドレスを攻撃者PCに紐付け、通信を傍受する攻撃', style: 'plain' },
        ],
        [
          { text: '対策：L2SWの ', style: 'plain' },
          { text: 'ダイナミックARPインスペクション', style: 'red' },
          { text: '（DAI）／DHCPスヌーピングと組み合わせる', style: 'plain' },
        ],
      ],
      navyItems: [
        [
          { text: 'DNSキャッシュポイズニング', style: 'navy' },
          { text: '：キャッシュDNSサーバに偽の応答を覚え込ませる（対策：', style: 'plain' },
          { text: 'DNSSEC', style: 'navy' },
          { text: '・ソースポートランダム化）', style: 'plain' },
        ],
        [
          { text: 'セッションハイジャック', style: 'navy' },
          { text: '：Cookie等のセッションIDを盗んで成りすまし', style: 'plain' },
        ],
      ],
    },
    {
      heading: 'Webアプリ攻撃',
      richItems: [
        [
          { text: 'SQLインジェクション', style: 'red' },
          { text: '：入力値にSQL構文を埋め込み、DBを不正操作する攻撃', style: 'plain' },
        ],
        [
          { text: '対策：', style: 'plain' },
          { text: 'プリペアドステートメント', style: 'red' },
          { text: '（バインド機構）', style: 'plain' },
        ],
        [
          { text: 'クロスサイトスクリプティング', style: 'red' },
          { text: '（XSS）：悪意のスクリプトを反射／格納してブラウザで実行させる', style: 'plain' },
        ],
        [
          { text: '対策：出力時の ', style: 'plain' },
          { text: 'エスケープ', style: 'red' },
          { text: '／CSP（Content Security Policy）', style: 'plain' },
        ],
      ],
      navyItems: [
        [
          { text: 'CSRF', style: 'navy' },
          { text: '：認証済みセッションを悪用して意図しないリクエストを送らせる（対策：CSRFトークン／SameSite Cookie）', style: 'plain' },
        ],
        [
          { text: 'ディレクトリトラバーサル', style: 'navy' },
          { text: '：../ でパスをさかのぼってファイルにアクセス（対策：入力値検証）', style: 'plain' },
        ],
        [
          { text: 'OSコマンドインジェクション', style: 'navy' },
          { text: '：入力値からシェルコマンドを実行（対策：シェル経由呼び出しを避ける）', style: 'plain' },
        ],
      ],
    },
    {
      heading: '標的型攻撃（C&C）',
      richItems: [
        [
          { text: '標的型攻撃では、攻撃者はマルウェアを送り込み、侵入したマルウェアが ', style: 'plain' },
          { text: 'C&Cサーバ', style: 'red' },
          { text: ' を経由して命令を送る', style: 'plain' },
        ],
        [
          { text: 'FWで外部からの通信を全て拒否しているのにPCで遠隔操作できる理由：FWで内部LAN→外部NWの通信が許可されている場合、マルウェアからC&Cサーバに接続させ、その応答パケットで命令を送れるため', style: 'plain' },
        ],
        [
          { text: 'マルウェアがC&Cサーバと通信しないようにするためには、', style: 'plain' },
          { text: 'プロキシ', style: 'red' },
          { text: ' サーバの導入が有効。内部LANからインターネットへの通信は、プロキシサーバ経由でのみ許可する', style: 'plain' },
        ],
        [
          { text: 'プロキシサーバの設定を調査してくるマルウェアへの対策：プロキシサーバで ', style: 'plain' },
          { text: '認証', style: 'red' },
          { text: ' 設定を行う', style: 'plain' },
        ],
      ],
    },
    {
      heading: '無線LAN特有の攻撃',
      navyItems: [
        [
          { text: 'Evil Twin', style: 'navy' },
          { text: '：正規APと同じSSIDの偽APを設置して接続を奪う', style: 'plain' },
        ],
        [
          { text: 'デオーセンティケーション攻撃', style: 'navy' },
          { text: '：管理フレームを偽造して切断させる（対策：Management Frame Protection／IEEE 802.11w）', style: 'plain' },
        ],
        [
          { text: 'KRACK', style: 'navy' },
          { text: '：WPA2 4ウェイハンドシェイクの再送悪用（対策：WPA3／パッチ適用）', style: 'plain' },
        ],
      ],
    },
  ],
  exam_tips: [
    'SYNフラッド = ==SYN== を投げ続ける／対策は ==SYN Cookie==',
    'スマーフ攻撃 = ==ICMP Echo== をブロードキャスト送信',
    'DNSリフレクタ攻撃は ==TXT== レコードで応答増幅',
    'ARPスプーフィング対策 = L2SWの ==DAI==（ダイナミックARPインスペクション）',
    'SQLインジェクション対策 = ==プリペアドステートメント==',
    'C&Cサーバ対策 = ==プロキシ強制==（＋認証）',
  ],
}
