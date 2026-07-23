import type { NoteData } from './types'

/** IPv6 */
export const ipv6: NoteData = {
  summary: '復習ノート「レイヤ1〜3基礎」のIPv6項より。アドレス体系（128bit・省略ルール・リンクローカル）／NDP／SLAAC／IPv4からの移行技術。',
  sections: [
    {
      heading: 'IPv6 アドレスの基本',
      richItems: [
        [
          { text: 'IPv4のIPアドレスは ', style: 'plain' },
          { text: '32', style: 'red' },
          { text: ' ビット／IPv6のIPアドレスは ', style: 'plain' },
          { text: '128', style: 'red' },
          { text: ' ビット', style: 'plain' },
        ],
        [
          { text: 'IPv6 は ', style: 'plain' },
          { text: '16', style: 'red' },
          { text: ' ビットずつ ', style: 'plain' },
          { text: ':', style: 'red' },
          { text: ' で区切り、16進数で8ブロック表記', style: 'plain' },
        ],
        [
          { text: 'IPv6の省略ルール：2001:0db8:0000:0000:0000:ff00:0042:8329 → 2001:', style: 'plain' },
          { text: 'db8::ff00:42:', style: 'red' },
          { text: '8329（連続する 0 のブロックは ', style: 'plain' },
          { text: '::', style: 'red' },
          { text: ' で1か所だけ省略可能、各ブロックの先頭の 0 も省略可能）', style: 'plain' },
        ],
        [
          { text: 'IPv6とIPv4は ', style: 'plain' },
          { text: '互換性無し', style: 'red' },
          { text: '（同一NW上で動かすには両方のスタックが必要）', style: 'plain' },
        ],
      ],
    },
    {
      heading: 'IPv6 アドレスの種別',
      richItems: [
        [
          { text: 'fe80', style: 'red' },
          { text: ' で始まるIPv6アドレス：', style: 'plain' },
          { text: 'リンクローカルユニキャストアドレス', style: 'red' },
          { text: '。', style: 'plain' },
          { text: 'ルータ', style: 'red' },
          { text: ' を介さずに直接接続できる相手との通信にだけ使用', style: 'plain' },
        ],
        [
          { text: 'IPv6にはブロードキャストが ', style: 'plain' },
          { text: '無い', style: 'red' },
          { text: '。代わりに ', style: 'plain' },
          { text: 'マルチキャスト', style: 'red' },
          { text: ' を使用', style: 'plain' },
        ],
      ],
      navyItems: [
        [
          { text: 'グローバルユニキャスト', style: 'navy' },
          { text: '：', style: 'plain' },
          { text: '2000::/3', style: 'navy' },
          { text: '（先頭3ビットが 001）— インターネット上で一意', style: 'plain' },
        ],
        [
          { text: 'リンクローカル', style: 'navy' },
          { text: '：', style: 'plain' },
          { text: 'fe80::/10', style: 'navy' },
          { text: ' — 同一リンク内のみ', style: 'plain' },
        ],
        [
          { text: 'ユニークローカル', style: 'navy' },
          { text: '：', style: 'plain' },
          { text: 'fc00::/7', style: 'navy' },
          { text: ' — IPv4 のプライベート相当', style: 'plain' },
        ],
        [
          { text: 'マルチキャスト', style: 'navy' },
          { text: '：', style: 'plain' },
          { text: 'ff00::/8', style: 'navy' },
          { text: '（', style: 'plain' },
          { text: 'ff02::1', style: 'navy' },
          { text: '＝全ノード／', style: 'plain' },
          { text: 'ff02::2', style: 'navy' },
          { text: '＝全ルータ／', style: 'plain' },
          { text: 'ff02::5', style: 'navy' },
          { text: '＝OSPFv3）', style: 'plain' },
        ],
        [
          { text: 'ループバック', style: 'navy' },
          { text: '：', style: 'plain' },
          { text: '::1/128', style: 'navy' },
          { text: '（IPv4 の 127.0.0.1 相当）', style: 'plain' },
        ],
      ],
    },
    {
      heading: 'IPv6 ヘッダ',
      richItems: [
        [
          { text: 'IPv6 ヘッダは ', style: 'plain' },
          { text: '40', style: 'red' },
          { text: ' バイトの固定長（IPv4 は可変長）。オプションは拡張ヘッダで実現', style: 'plain' },
        ],
        [
          { text: 'チェックサムは ', style: 'plain' },
          { text: '無い', style: 'red' },
          { text: '（L2／L4 で検査するため）', style: 'plain' },
        ],
        [
          { text: 'ルータでフラグメント化を ', style: 'plain' },
          { text: 'しない', style: 'red' },
          { text: '（送信元のみが行う／パスMTU探索を使用）', style: 'plain' },
        ],
        [
          { text: 'IPv6パケット構造（下図）', style: 'plain' },
        ],
      ],
      headerDiagrams: [
        {
          title: 'IPv6 ヘッダ構造（40バイト固定長）',
          rows: [
            {
              cells: [
                { label: 'バージョン\n(6)', bg: '#dcfce7' },
                { label: 'トラフィック\nクラス', bg: '#dcfce7' },
                { label: 'フローラベル', bg: '#dcfce7' },
                { label: 'ペイロード長', bg: '#bbf7d0' },
                { label: '次ヘッダ', bg: '#bbf7d0' },
                { label: 'ホップ\nリミット', bg: '#bbf7d0' },
              ],
            },
            {
              cells: [
                { label: '送信元IPv6アドレス（128bit）', bg: '#fef3c7', maskDigits: true, span: 6 },
              ],
            },
            {
              cells: [
                { label: '宛先IPv6アドレス（128bit）', bg: '#fef3c7', maskDigits: true, span: 6 },
              ],
            },
            {
              cells: [
                { label: 'データ（L4 ペイロード）', bg: '#fee2e2', span: 6 },
              ],
            },
          ],
          caption: '緑＝制御フィールド／黄＝アドレス（赤字マスク対象）／橙＝ペイロード。',
        },
      ],
    },
    {
      heading: 'NDP（近隣探索プロトコル）',
      richItems: [
        [
          { text: 'IPv6 ではARPが廃止され、', style: 'plain' },
          { text: 'NDP', style: 'red' },
          { text: '（Neighbor Discovery Protocol）が代わりに使われる', style: 'plain' },
        ],
        [
          { text: 'NDP は ', style: 'plain' },
          { text: 'ICMPv6', style: 'red' },
          { text: ' のメッセージで動作（タイプ133〜137）', style: 'plain' },
        ],
      ],
      navyItems: [
        [
          { text: 'RS', style: 'navy' },
          { text: '（Router Solicitation）：ホストがルータを探すメッセージ', style: 'plain' },
        ],
        [
          { text: 'RA', style: 'navy' },
          { text: '（Router Advertisement）：ルータがプレフィックス情報を通知', style: 'plain' },
        ],
        [
          { text: 'NS', style: 'navy' },
          { text: '（Neighbor Solicitation）：相手のMACアドレスを問い合わせ（ARP相当）', style: 'plain' },
        ],
        [
          { text: 'NA', style: 'navy' },
          { text: '（Neighbor Advertisement）：自分のMACアドレスを応答', style: 'plain' },
        ],
        [
          { text: 'リダイレクト', style: 'navy' },
          { text: '：より良い経路をホストに通知', style: 'plain' },
        ],
      ],
    },
    {
      heading: 'SLAAC（自動アドレス設定）',
      richItems: [
        [
          { text: 'SLAAC', style: 'red' },
          { text: '（Stateless Address Auto Configuration）：DHCPサーバ無しでホストが自動的にIPv6アドレスを生成する仕組み', style: 'plain' },
        ],
        [
          { text: '手順：ホストが ', style: 'plain' },
          { text: 'RS', style: 'red' },
          { text: ' を送信 → ルータが ', style: 'plain' },
          { text: 'RA', style: 'red' },
          { text: ' でプレフィックス通知 → ホストがプレフィックス＋インタフェースIDで自身のアドレスを生成', style: 'plain' },
        ],
      ],
      navyItems: [
        [
          { text: 'インタフェースID（下位64bit）の生成方式：', style: 'plain' },
          { text: 'EUI-64', style: 'navy' },
          { text: '（MACアドレスから生成）またはランダム（プライバシー拡張：RFC 4941）', style: 'plain' },
        ],
        [
          { text: 'DHCPv6', style: 'navy' },
          { text: ' は SLAAC と併用される（DNSサーバ等の追加情報配布用、ステートフル運用も可）', style: 'plain' },
        ],
      ],
    },
    {
      heading: 'IPv4 → IPv6 移行技術',
      richItems: [
        [
          { text: 'デュアルスタック', style: 'red' },
          { text: '：1台でIPv4・IPv6 両方のスタックを動かす最も基本的な移行方式', style: 'plain' },
        ],
        [
          { text: 'トンネリング', style: 'red' },
          { text: '：IPv6パケットをIPv4パケットでカプセル化して、IPv4網を通す', style: 'plain' },
        ],
      ],
      navyItems: [
        [
          { text: '6to4', style: 'navy' },
          { text: '：IPv4アドレスからIPv6プレフィックス（', style: 'plain' },
          { text: '2002::/16', style: 'navy' },
          { text: '）を生成して自動トンネル', style: 'plain' },
        ],
        [
          { text: 'NAT64 / DNS64', style: 'navy' },
          { text: '：IPv6 のみのクライアントから IPv4 サーバへアクセスさせる変換技術', style: 'plain' },
        ],
        [
          { text: 'IPv4 over IPv6', style: 'navy' },
          { text: '（', style: 'plain' },
          { text: 'MAP-E', style: 'navy' },
          { text: '／', style: 'plain' },
          { text: 'DS-Lite', style: 'navy' },
          { text: '）：日本のフレッツ回線で利用される IPoE 方式', style: 'plain' },
        ],
      ],
    },
  ],
  exam_tips: [
    'IPv6 アドレスは ==128== ビット／IPv4 は ==32== ビット',
    '省略ルール：連続0は ==::== で1か所だけ省略可能',
    '==fe80::/10== はリンクローカル（==ルータ==を越えない）',
    'IPv6 では ARP 廃止 ⇒ ==NDP==（ICMPv6）',
    '==SLAAC== は ==RS==／==RA== でアドレス自動生成',
    'IPv6 にはブロードキャストが ==無い==（マルチキャストで代替）',
  ],
}
