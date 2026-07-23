import type { NoteData } from './types'

export const layer1_3: NoteData = {
  summary: '復習ノート「レイヤ1〜3基礎」準拠。イーサネット・L2SW・VLAN・VXLAN・パケットキャプチャ・IPアドレス・STP/RSTP・LA・スタック・MAC・ARP/GARP・マルチキャスト。',
  sections: [
    {
      heading: 'LAN',
      richItems: [
        [
          { text: '有線LANの規格の総称：', style: 'plain' },
          { text: 'イーサネット', style: 'red' },
        ],
        [
          { text: 'イーサネットにおけるデータ送信の単位：', style: 'plain' },
          { text: 'フレーム', style: 'red' },
          { text: '（複数のPCがほぼ同時に複数のPCと通信可能）', style: 'plain' },
        ],
        [
          { text: 'イーサネットフレームの構造（下図）', style: 'plain' },
        ],
      ],
      headerDiagrams: [
        {
          title: 'イーサネットフレームの構造',
          rows: [
            {
              cells: [
                { label: '宛先MAC',  bg: '#dbeafe', isRed: true },
                { label: '送信元MAC', bg: '#dbeafe', isRed: true },
                { label: 'タイプ',    bg: '#e0e7ff' },
                { label: 'データ\n(L3)', bg: '#dcfce7', span: 2 },
                { label: 'FCS',       bg: '#e2e8f0' },
              ],
            },
          ],
          caption: '青＝L2(MAC) / 紺＝タイプ / 緑＝L3ペイロード / 灰＝トレーラ。赤字はマスク対象。',
        },
      ],
    },
    {
      heading: 'スイッチ（L2SW）',
      richItems: [
        [
          { text: 'シェアードハブ：受信したフレームを', style: 'plain' },
          { text: '全てのポート', style: 'red' },
          { text: 'に転送', style: 'plain' },
        ],
        [
          { text: 'スイッチングハブ：フレームの宛先MACアドレスを見て、', style: 'plain' },
          { text: '該当するホスト', style: 'red' },
          { text: 'が接続されているポートにのみ転送', style: 'plain' },
        ],
        [
          { text: 'フレームが同一', style: 'plain' },
          { text: 'セグメント', style: 'red' },
          { text: '宛てであれば L3SW が ', style: 'plain' },
          { text: 'L2SW', style: 'red' },
          { text: ' として動作することもある（イーサネットヘッダを変更しない）', style: 'plain' },
        ],
        [
          { text: 'スイッチのMACアドレス学習：', style: 'plain' },
          { text: '該当ポート', style: 'red' },
          { text: 'にのみフレームを転送するため、フレームの送信元MACアドレスを見て学習', style: 'plain' },
        ],
        [
          { text: 'ストレートケーブルとクロスケーブル — 1Gbps以上の通信を行う機器は ', style: 'plain' },
          { text: 'Auto MDI/MDI-X', style: 'red' },
          { text: ' 機能が実装', style: 'plain' },
        ],
      ],
    },
    {
      heading: 'VLAN',
      richItems: [
        [
          { text: 'ポートベースVLAN — 上限：2の', style: 'plain' },
          { text: '16', style: 'red' },
          { text: '乗 = ', style: 'plain' },
          { text: '65536', style: 'red' },
          { text: '個（フレームの変化なし）', style: 'plain' },
        ],
        [
          { text: 'ポートVLANが設定されたポート：アクセスポート', style: 'plain' },
        ],
        [
          { text: 'タグVLANが設定されたポート：', style: 'plain' },
          { text: 'トランク', style: 'red' },
          { text: 'ポート', style: 'plain' },
        ],
        [
          { text: 'VLANタグ（802.1Qヘッダ）のサイズ：', style: 'plain' },
          { text: '32', style: 'red' },
          { text: 'ビット（フレーム構造ではMACアドレスとタイプの間に入る）', style: 'plain' },
        ],
        [
          { text: 'VLAN IDは', style: 'plain' },
          { text: '12', style: 'red' },
          { text: 'ビットなので、VLAN最大数は', style: 'plain' },
          { text: '4094', style: 'red' },
          { text: '（両端の0と4095は使用不可）', style: 'plain' },
        ],
        [
          { text: 'VLANはレイヤ', style: 'plain' },
          { text: '2', style: 'red' },
          { text: ' で閉じた技術', style: 'plain' },
        ],
        [
          { text: 'VLANの問題点（複数組織が混ざるNW）⇒「', style: 'plain' },
          { text: '重複', style: 'red' },
          { text: '」と「', style: 'plain' },
          { text: '上限', style: 'red' },
          { text: '」⇒', style: 'plain' },
          { text: 'VXLAN', style: 'red' },
          { text: ' で解決可能', style: 'plain' },
        ],
      ],
      headerDiagrams: [
        {
          title: 'VLANタグ付きフレーム（IEEE 802.1Q）',
          rows: [
            {
              cells: [
                { label: '宛先MAC',  bg: '#dbeafe' },
                { label: '送信元MAC', bg: '#dbeafe' },
                { label: 'VLANタグ\n(32bit)', bg: '#fde68a', maskDigits: true },
                { label: 'タイプ',    bg: '#e0e7ff' },
                { label: 'データ\n(L3)', bg: '#dcfce7' },
                { label: 'FCS',       bg: '#e2e8f0' },
              ],
            },
          ],
          caption: 'タグはMACアドレスとタイプの間に挿入。32bit（TPID 16bit + TCI 16bit、うちVLAN ID は12bit）。',
        },
      ],
    },
    {
      heading: 'VXLAN',
      richItems: [
        [
          { text: 'VXLAN', style: 'red' },
          { text: '：レイヤ3（アンダーレイ）上にレイヤ2（オーバーレイ）を作る技術', style: 'plain' },
        ],
        [
          { text: 'VXLANヘッダ中の VNI は ', style: 'plain' },
          { text: '24', style: 'red' },
          { text: ' ビットなので、約1677万個のL2ネットワークを構築可能', style: 'plain' },
        ],
        [
          { text: 'VXLANパケットの構造：IPv4ヘッダ / ', style: 'plain' },
          { text: 'UDP', style: 'red' },
          { text: 'ヘッダ / ', style: 'plain' },
          { text: 'VXLAN', style: 'red' },
          { text: 'ヘッダ / イーサネットフレーム', style: 'plain' },
        ],
        [
          { text: 'トンネリング全般、ヘッダ追加でフラグメントが起き、NW機器の負荷を増やすので MSS の調整が必要', style: 'plain' },
        ],
        [
          { text: 'L2トンネリングしたらブロードキャストドメインは同一', style: 'plain' },
        ],
      ],
      headerDiagrams: [
        {
          title: 'VXLANパケットの構造',
          rows: [
            {
              cells: [
                { label: '新IPv4ヘッダ', bg: '#fce7f3' },
                { label: 'UDPヘッダ',     bg: '#fef3c7', isRed: true },
                { label: 'VXLANヘッダ\n(VNI 24bit)', bg: '#f3e8ff', maskDigits: true },
                { label: 'イーサネット\nフレーム（オリジナル）', bg: '#dbeafe', span: 2 },
              ],
            },
          ],
          caption: 'L3（アンダーレイ）上にL2（オーバーレイ）を作るカプセル化。VNIは24bit ⇒ 約1677万L2NWを構築可能。',
        },
      ],
    },
    {
      heading: 'パケットキャプチャ',
      richItems: [
        [
          { text: 'スイッチSWは', style: 'plain' },
          { text: '宛先の端末が繋がっているポート', style: 'red' },
          { text: 'にのみフレームを転送する', style: 'plain' },
        ],
        [
          { text: 'スイッチに必要な設定：', style: 'plain' },
          { text: 'ミラーリング', style: 'red' },
          { text: 'の設定', style: 'plain' },
        ],
        [
          { text: 'PCに必要な設定：NICの動作モードを ', style: 'plain' },
          { text: 'プロミスキャス', style: 'red' },
          { text: ' モードに設定（自分宛以外のフレームを受信するため）', style: 'plain' },
        ],
      ],
    },
    {
      heading: 'IPアドレス',
      richItems: [
        [
          { text: 'IPv4のIPアドレスは ', style: 'plain' },
          { text: '32', style: 'red' },
          { text: ' ビット', style: 'plain' },
        ],
        [
          { text: 'IPv6のIPアドレスは ', style: 'plain' },
          { text: '128', style: 'red' },
          { text: ' ビット', style: 'plain' },
        ],
        [
          { text: 'IPv6の省略ルール：2001:0db8:0000:0000:0000:ff00:0042:8329 → 2001:', style: 'plain' },
          { text: 'db8::ff00:42:', style: 'red' },
          { text: '8329', style: 'plain' },
        ],
        [
          { text: 'fe80で始まるIPv6アドレス：', style: 'plain' },
          { text: 'リンクローカルユニキャストアドレス', style: 'red' },
          { text: '。', style: 'plain' },
          { text: 'ルータ', style: 'red' },
          { text: ' を介さずに直接接続できる相手との通信にだけ使用', style: 'plain' },
        ],
        [
          { text: 'IPv6とIPv4は互換性無し', style: 'plain' },
        ],
        [
          { text: 'ルータの前後で', style: 'plain' },
          { text: 'ネットワーク', style: 'red' },
          { text: 'アドレスの重複は ✖', style: 'plain' },
        ],
        [
          { text: 'IPヘッダとパケット構造（下図）', style: 'plain' },
        ],
      ],
      headerDiagrams: [
        {
          title: 'IPヘッダとパケット構造',
          rows: [
            {
              cells: [
                { label: '送信元IP\nアドレス',  bg: '#dcfce7', isRed: true },
                { label: '宛先IP\nアドレス',    bg: '#dcfce7', isRed: true },
                { label: 'プロトコル',          bg: '#bbf7d0' },
                { label: 'その他',              bg: '#bbf7d0' },
                { label: 'データ\n(L4)',        bg: '#fef3c7', span: 2 },
              ],
            },
          ],
          caption: '緑＝L3(IP)ヘッダ／黄＝L4ペイロード。赤字（送信元・宛先）はマスク対象。',
        },
      ],
    },
    {
      heading: 'LANの冗長化（STP / RSTP）',
      richItems: [
        [
          { text: '複数のL2SWをループ状に循環構成にすると発生 ⇒ ', style: 'plain' },
          { text: 'ブロードキャストストーム', style: 'red' },
          { text: '（フレームが無限に流れ続け通信不能）', style: 'plain' },
        ],
        [
          { text: 'スイッチングハブは ', style: 'plain' },
          { text: 'ブロードキャスト', style: 'red' },
          { text: ' フレームを無条件で別の全ポートに転送するため発生（ユニキャスト・マルチキャストでは発生', style: 'plain' },
          { text: 'しない', style: 'red' },
          { text: '）', style: 'plain' },
        ],
        [
          { text: 'STP：レイヤ', style: 'plain' },
          { text: '2', style: 'red' },
          { text: '。目的は ', style: 'plain' },
          { text: 'ループの回避', style: 'red' },
          { text: ' と ', style: 'plain' },
          { text: '冗長性の確保', style: 'red' },
        ],
        [
          { text: 'STPでループ検出に利用するフレーム：', style: 'plain' },
          { text: 'BPDU', style: 'red' },
          { text: '（Bridge Protocol Data Unit）。', style: 'plain' },
          { text: 'ルート', style: 'red' },
          { text: 'ブリッジが送る。複数経路から ', style: 'plain' },
          { text: 'BPDU', style: 'red' },
          { text: ' を受け取るとループを検知', style: 'plain' },
        ],
        [
          { text: 'STPルートブリッジの決定：ブリッジの ', style: 'plain' },
          { text: '優先度', style: 'red' },
          { text: ' とMACアドレスを用い、MACアドレスが ', style: 'plain' },
          { text: '小さい', style: 'red' },
          { text: ' 方が優先', style: 'plain' },
        ],
        [
          { text: 'STPの4つの状態：ブロッキング、リスニング、ラーニング、', style: 'plain' },
          { text: 'フォワーディング', style: 'red' },
        ],
        [
          { text: 'STPの経路切り替え時間：最大で ', style: 'plain' },
          { text: '50', style: 'red' },
          { text: ' 秒かかる', style: 'plain' },
        ],
        [
          { text: 'STPポートの役割：ルートポート、', style: 'plain' },
          { text: '指定', style: 'red' },
          { text: 'ポート、非指定ポートのいずれか（ルートブリッジである L3SW では全ポートが指定ポート）', style: 'plain' },
        ],
        [
          { text: 'STPより障害復旧を高速化 ⇒ ', style: 'plain' },
          { text: 'RSTP', style: 'red' },
          { text: '（', style: 'plain' },
          { text: 'Rapid', style: 'red' },
          { text: ' STP）', style: 'plain' },
        ],
        [
          { text: '状態遷移の ', style: 'plain' },
          { text: '待ち', style: 'red' },
          { text: ' 時間が無く、', style: 'plain' },
          { text: '代替', style: 'red' },
          { text: ' ポートと ', style: 'plain' },
          { text: 'バックアップ', style: 'red' },
          { text: ' ポートが予め決まっている', style: 'plain' },
        ],
        [
          { text: '【ネスペ対策】STPがあったら絶対NW構成図に ', style: 'plain' },
          { text: '全て', style: 'red' },
          { text: ' のブロックポートを書き込む（見落とすと引っ掛けで失点）', style: 'plain' },
        ],
      ],
    },
    {
      heading: 'リンクアグリゲーション（LA）',
      richItems: [
        [
          { text: 'LAの目的：①帯域の拡大、②冗長性の確保', style: 'plain' },
        ],
        [
          { text: '10Gbpsケーブル1本より1Gbpsケーブル4本でLAを組む利点：インタフェースが ', style: 'plain' },
          { text: '安', style: 'red' },
          { text: 'い／', style: 'plain' },
          { text: '冗長化', style: 'red' },
          { text: ' できるため信頼性が高い（一本断でも通信可能）', style: 'plain' },
        ],
        [
          { text: 'STPと比較したLAの利点：①', style: 'plain' },
          { text: '障害時の中断時間が短い', style: 'red' },
          { text: '、②', style: 'plain' },
          { text: '帯域拡大が可能', style: 'red' },
        ],
        [
          { text: 'LAの設定方法：静的設定／LACP（Link Aggregation Control Protocol）による ', style: 'plain' },
          { text: '動的', style: 'red' },
          { text: ' 設定', style: 'plain' },
        ],
        [
          { text: 'LACPの利点：', style: 'plain' },
          { text: '対向の機器', style: 'red' },
          { text: ' が正常か確認できる', style: 'plain' },
        ],
      ],
    },
    {
      heading: 'スタック',
      richItems: [
        [
          { text: '2台のスイッチングハブをスタック接続する利点：', style: 'plain' },
          { text: '信頼性', style: 'red' },
          { text: ' 向上、', style: 'plain' },
          { text: 'ポート', style: 'red' },
          { text: ' の増加（さらにLAと組み合わせて ', style: 'plain' },
          { text: '帯域', style: 'red' },
          { text: ' 増加）', style: 'plain' },
        ],
        [
          { text: 'スタック接続したときのIPアドレスとconfigは共通', style: 'plain' },
        ],
      ],
    },
    {
      heading: 'MACアドレス',
      richItems: [
        [
          { text: '複数のNICを一つのMACアドレスで用いる技術 ⇒ ', style: 'plain' },
          { text: 'チーミング', style: 'red' },
        ],
        [
          { text: 'L2SWは同一セグメントの機器間に限り通信可能。異なるセグメントにはフレームを ', style: 'plain' },
          { text: '送れない', style: 'red' },
          { text: '（送る場合は ', style: 'plain' },
          { text: 'ルーティング', style: 'red' },
          { text: '（L3SW等）の処理が必要）', style: 'plain' },
        ],
        [
          { text: 'MACアドレス認証が不十分な理由①：MACアドレスは ', style: 'plain' },
          { text: '盗聴', style: 'red' },
          { text: ' が可能（暗号化したら通信相手が分からなくなるため暗号化できない）', style: 'plain' },
        ],
        [
          { text: 'MACアドレス認証が不十分な理由②：MACアドレスは ', style: 'plain' },
          { text: '書き換え', style: 'red' },
          { text: ' が容易', style: 'plain' },
        ],
        [
          { text: 'MACアドレスは48bit構成。前半 ', style: 'plain' },
          { text: '24', style: 'red' },
          { text: ' bit は ', style: 'plain' },
          { text: 'OUI', style: 'red' },
          { text: ' と呼ばれ、', style: 'plain' },
          { text: '製造者', style: 'red' },
          { text: ' ごとに固有の番号', style: 'plain' },
        ],
      ],
    },
    {
      heading: 'ARP / GARP',
      richItems: [
        [
          { text: 'ARPテーブル：', style: 'plain' },
          { text: 'IPアドレス', style: 'red' },
          { text: ' と ', style: 'plain' },
          { text: 'MACアドレス', style: 'red' },
          { text: ' の対応を保持', style: 'plain' },
        ],
        [
          { text: 'ARP要求は ', style: 'plain' },
          { text: 'ブロード', style: 'red' },
          { text: 'キャストにより送る', style: 'plain' },
        ],
        [
          { text: 'ARPテーブルを更新するためのパケット：', style: 'plain' },
          { text: 'GARP', style: 'red' },
        ],
        [
          { text: 'GARPはVRRPのマスタルータ切替時、バックアップルータに接続されているSWの ', style: 'plain' },
          { text: 'MACアドレス', style: 'red' },
          { text: 'テーブル書き換えにも利用される（ARPテーブル＝IPに対するMAC は変わらない／MACアドレステーブル＝MACに対するSWのポート）', style: 'plain' },
        ],
        [
          { text: 'ARPは認証機能が無いので、送られたARP応答を無条件に信じる', style: 'plain' },
        ],
        [
          { text: 'ARPを利用したサイバー攻撃：', style: 'plain' },
          { text: 'ARPスプーフィング', style: 'red' },
          { text: '（ARPフレームに偽情報を入れて相手のARPテーブルに嘘を登録させ、通信を妨害／盗聴）', style: 'plain' },
        ],
      ],
    },
    {
      heading: 'マルチキャスト',
      richItems: [
        [
          { text: 'PIM：L3装置間のマルチキャストルーティング', style: 'plain' },
        ],
        [
          { text: 'IGMP：L3SW〜端末間の管理', style: 'plain' },
        ],
        [
          { text: 'SSM：L3で送信元を特定する', style: 'plain' },
        ],
        [
          { text: '224.0.0.', style: 'plain' },
          { text: '2', style: 'red' },
          { text: '：サブネット上の全てのマルチキャスト対応ルータ向け', style: 'plain' },
        ],
        [
          { text: '224.0.0.', style: 'plain' },
          { text: '1', style: 'red' },
          { text: '：サブネット上の全てのマルチキャスト対応ホスト向け', style: 'plain' },
        ],
      ],
    },
    // ── 復習ノートに無い既存項目（ネイビー強調のみで残す） ──────────
    {
      heading: '補足：データ単位（参考）',
      navyItems: [
        [
          { text: 'L1（物理層）：', style: 'plain' },
          { text: 'ビット', style: 'navy' },
        ],
        [
          { text: 'L2（データリンク層）：', style: 'plain' },
          { text: 'フレーム', style: 'navy' },
        ],
        [
          { text: 'L3（ネットワーク層）：', style: 'plain' },
          { text: 'パケット', style: 'navy' },
        ],
        [
          { text: 'L4（トランスポート層）：', style: 'plain' },
          { text: 'セグメント', style: 'navy' },
          { text: '（TCP）/ ', style: 'plain' },
          { text: 'データグラム', style: 'navy' },
          { text: '（UDP）', style: 'plain' },
        ],
      ],
    },
    {
      heading: '補足：ドメインの分割（参考）',
      navyItems: [
        [
          { text: 'ブロードキャストドメインは ', style: 'plain' },
          { text: 'ルータ（L3）', style: 'navy' },
          { text: ' で分割', style: 'plain' },
        ],
        [
          { text: 'コリジョンドメインは ', style: 'plain' },
          { text: 'SW（L2）', style: 'navy' },
          { text: ' で分割', style: 'plain' },
        ],
        [
          { text: 'MACアドレステーブル未登録 → ', style: 'plain' },
          { text: 'フラッディング', style: 'navy' },
          { text: '（受信ポート以外へ転送）', style: 'plain' },
        ],
      ],
    },
  ],
  exam_tips: [
    'STPとRSTPの違い（収束時間）は頻出',
    '802.1Qのタグ構造（==4==バイト：TPID 2B + TCI 2B）',
    '==ループの回避==と==冗長性の確保==がSTPの2大目的',
    'VLAN最大数 ==4094==（12bit、両端0/4095除く）',
    'VXLAN VNI ==24==bit ⇒ 約1677万個のL2NWが構築可能',
    'GARPは==VRRPマスタ切替==／重複検査／ARPキャッシュ更新で多用される',
  ],
}
