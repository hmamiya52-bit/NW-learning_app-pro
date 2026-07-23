import type { NoteData } from './types'

export const ipsec: NoteData = {
  summary: '復習ノート「IPsecとGRE」準拠。インターネットVPN・IPsec（ESP/AH/IKE）・通信モード・通信フェーズ・NATトラバーサル・GRE・GRE over IPsecを整理。',
  sections: [
    {
      heading: 'インターネットVPN／IPsec基礎',
      richItems: [
        [
          { text: '暗号化によって ', style: 'plain' },
          { text: '盗聴', style: 'red' },
          { text: ' は防げるが、暗号化だけでは ', style: 'plain' },
          { text: '改ざん', style: 'red' },
          { text: ' や ', style: 'plain' },
          { text: 'なりすまし', style: 'red' },
          { text: ' の脅威は防げない。これらは適切にVPNを用いることで対処が可能', style: 'plain' },
        ],
        [
          { text: 'インターネットVPN：インターネット上に構築する仮想的なネットワーク。専用線や広域イーサに比べて ', style: 'plain' },
          { text: '安価', style: 'red' },
          { text: '・広帯域なWANを構築可能', style: 'plain' },
        ],
        [
          { text: 'IP-VPNとの違い：IP-VPNは通信事業者の ', style: 'plain' },
          { text: '閉域IP網', style: 'red' },
          { text: '／インターネットVPNはインターネット回線を用いる。インターネットVPNはIP-VPNより安価だが ', style: 'plain' },
          { text: 'セキュリティリスク', style: 'red' },
          { text: ' は高い', style: 'plain' },
        ],
        [
          { text: 'IPsec：', style: 'plain' },
          { text: '認証', style: 'red' },
          { text: ' と ', style: 'plain' },
          { text: '暗号化', style: 'red' },
          { text: ' の機能を持った規格', style: 'plain' },
        ],
        [
          { text: 'ESP', style: 'red' },
          { text: '：', style: 'plain' },
          { text: '暗号化と認証', style: 'red' },
          { text: ' の両方の機能をもつ', style: 'plain' },
        ],
        [
          { text: 'AH', style: 'red' },
          { text: '：', style: 'plain' },
          { text: '認証の機能のみ', style: 'red' },
          { text: ' をもつ', style: 'plain' },
        ],
        [
          { text: 'ESPヘッダには、TCPとUDPと違って ', style: 'plain' },
          { text: 'ポート番号', style: 'red' },
          { text: ' が無い', style: 'plain' },
        ],
      ],
    },
    {
      heading: 'IPsecの通信モード',
      richItems: [
        [
          { text: 'トランスポート', style: 'red' },
          { text: ' モード：端末間でIPsec通信を行う', style: 'plain' },
        ],
        [
          { text: 'トンネル', style: 'red' },
          { text: ' モード：VPN装置間でIPsec通信を行う（VPNルータにIPsec設定をすればPCに個別のIPsec設定が不要のため、一般的な企業間でよく利用）', style: 'plain' },
        ],
        [
          { text: 'トンネルモードにする目的：', style: 'plain' },
          { text: 'プライベートIPアドレス', style: 'red' },
          { text: ' のままだと通信できないから。両端が ', style: 'plain' },
          { text: 'グローバルアドレス', style: 'red' },
          { text: ' ならトランスポートモードでOK', style: 'plain' },
        ],
      ],
    },
    {
      heading: 'IKE（鍵交換）と通信フェーズ',
      richItems: [
        [
          { text: 'IPsecにおける鍵交換プロトコル：', style: 'plain' },
          { text: 'IKE', style: 'red' },
          { text: '。ポート番号：', style: 'plain' },
          { text: '500', style: 'red' },
        ],
        [
          { text: 'IKEのモード：', style: 'plain' },
          { text: 'メイン', style: 'red' },
          { text: ' モード（接続相手のVPN装置が ', style: 'plain' },
          { text: '固定IPアドレス', style: 'red' },
          { text: '。双方とも固定IPでなければ通信できない。利点：IPアドレスを使って認証するのでセキュリティが強固）', style: 'plain' },
        ],
        [
          { text: 'アグレッシブ', style: 'red' },
          { text: ' モード（接続相手が ', style: 'plain' },
          { text: '動的IPアドレス', style: 'red' },
          { text: '。接続先のIPアドレスを認証情報として利用しない。利点：固定IP取得費用がかからずコスト面で有利）', style: 'plain' },
        ],
        [
          { text: 'IKEフェーズ1：', style: 'plain' },
          { text: 'ISAKMP SA', style: 'red' },
          { text: ' と呼ばれる制御用のSAを生成。SA: Security Association（セッション的なやつ）。暗号化方式などの決定と暗号鍵の生成。このSAをフェーズ2で利用', style: 'plain' },
        ],
        [
          { text: 'IKEフェーズ2：', style: 'plain' },
          { text: 'IPsec SA', style: 'red' },
          { text: ' と呼ばれる通信用のSAを生成。暗号化方式などの決定と暗号鍵の生成。このSAをIPsec通信で使用', style: 'plain' },
        ],
        [
          { text: 'IPsec通信：', style: 'plain' },
          { text: 'セキュアな通信', style: 'red' },
        ],
        [
          { text: 'SAの生存時間：', style: 'plain' },
          { text: 'ライフタイム', style: 'red' },
          { text: '（終了するとSAは消滅）。再生成の処理を ', style: 'plain' },
          { text: 'リキー', style: 'red' },
          { text: '（ReKey）という。一定時間でSAを廃止する理由：第三者による暗号解読を防ぐため', style: 'plain' },
        ],
      ],
    },
    {
      heading: 'ESPパケットとNATトラバーサル',
      richItems: [
        [
          { text: 'ESPパケットの構造（下図）。暗号化範囲はピンク〜紫の部分', style: 'plain' },
        ],
        [
          { text: 'IPsecではTCP（UDP）ヘッダが ', style: 'plain' },
          { text: '暗号化', style: 'red' },
          { text: ' される ⇒ NATがあると ', style: 'plain' },
          { text: 'ポート番号', style: 'red' },
          { text: ' がないため通信に失敗することがある', style: 'plain' },
        ],
        [
          { text: 'NATトラバーサル', style: 'red' },
          { text: ' という技術を使い、ESPパケットに ', style: 'plain' },
          { text: 'UDP', style: 'red' },
          { text: ' パケットを付与する（下図：トランスポートモード+NAT-T）', style: 'plain' },
        ],
      ],
      headerDiagrams: [
        {
          title: 'ESPパケット — トランスポートモード',
          rows: [
            {
              cells: [
                { label: 'オリジナル\nIPヘッダ', bg: '#dbeafe' },
                { label: 'ESP\nヘッダ',         bg: '#fce7f3' },
                { label: 'TCP',                 bg: '#e9d5ff' },
                { label: 'データ',              bg: '#e9d5ff' },
                { label: 'ESP\nトレーラ',       bg: '#e9d5ff' },
                { label: 'ESP\n認証データ',     bg: '#fce7f3' },
              ],
            },
          ],
          caption: 'ピンク（ESPヘッダ／認証データ）が認証範囲。紫（TCP〜トレーラ）が暗号化範囲。',
        },
        {
          title: 'ESPパケット — トンネルモード（IPヘッダを新しく付与）',
          rows: [
            {
              cells: [
                { label: '新IP\nヘッダ',        bg: '#fef3c7' },
                { label: 'ESP\nヘッダ',         bg: '#fce7f3' },
                { label: 'オリジナル\nIPヘッダ', bg: '#e9d5ff' },
                { label: 'TCP',                 bg: '#e9d5ff' },
                { label: 'データ',              bg: '#e9d5ff' },
                { label: 'ESP\nトレーラ',       bg: '#e9d5ff' },
                { label: 'ESP\n認証データ',     bg: '#fce7f3' },
              ],
            },
          ],
          caption: 'オリジナルIPヘッダごと暗号化される。VPN装置間のトンネル化。',
        },
        {
          title: 'ESPパケット — トランスポートモード + NAT-T（UDPカプセル化）',
          rows: [
            {
              cells: [
                { label: '新IP\nヘッダ',        bg: '#fef3c7' },
                { label: '新UDP\nヘッダ',       bg: '#bae6fd' },
                { label: 'オリジナル\nIPヘッダ', bg: '#dbeafe' },
                { label: 'ESP\nヘッダ',         bg: '#fce7f3' },
                { label: '暗号化された\nデータ', bg: '#e9d5ff' },
                { label: 'ESP\n認証データ',     bg: '#fce7f3' },
              ],
            },
          ],
          caption: '青のUDPヘッダを追加することで、NAPT越えを実現する（NATトラバーサル）。',
        },
      ],
    },
    {
      heading: 'IPsecの接続方式',
      richItems: [
        [
          { text: 'ハブアンドスポーク', style: 'red' },
          { text: ' 方式：本社などをハブとし、支店をスポークとして接続する構成。利点：', style: 'plain' },
          { text: '安価', style: 'red' },
        ],
        [
          { text: 'フルメッシュ', style: 'red' },
          { text: ' 方式：全ての拠点でIPsecトンネルを張る構成。利点：', style: 'plain' },
          { text: '信頼性が高い', style: 'red' },
        ],
        [
          { text: 'NHRP', style: 'red' },
          { text: '：動的にIPsecを確立するためのプロトコル（Next Hop Resolution Protocol）。IPsecトンネル確立に必要な対向側IPアドレス情報を、トンネル確立時に動的に得るのに利用される', style: 'plain' },
        ],
      ],
    },
    {
      heading: 'GRE（Generic Routing Encapsulation）',
      richItems: [
        [
          { text: 'レイヤ', style: 'plain' },
          { text: '3', style: 'red' },
          { text: ' のトンネルプロトコル', style: 'plain' },
        ],
        [
          { text: 'IPsecと比べた違い：GREは通信を ', style: 'plain' },
          { text: '暗号化しない', style: 'red' },
        ],
        [
          { text: 'GREは ', style: 'plain' },
          { text: 'マルチキャスト', style: 'red' },
          { text: ' も転送できる（IPsec単独は ', style: 'plain' },
          { text: 'ユニキャスト', style: 'red' },
          { text: ' のみ）', style: 'plain' },
        ],
        [
          { text: 'GREによるマルチキャスト転送の活用：複数拠点間で ', style: 'plain' },
          { text: 'OSPF', style: 'red' },
          { text: ' のようなルーティングプロトコルを使用するケース（OSPFのLSA交換はマルチキャストが必要）', style: 'plain' },
        ],
        [
          { text: 'IPsec上でGREを動作させる技術：', style: 'plain' },
          { text: 'GRE over IPsec', style: 'red' },
          { text: '。', style: 'plain' },
          { text: '暗号化', style: 'red' },
          { text: ' できない・', style: 'plain' },
          { text: 'マルチキャスト', style: 'red' },
          { text: ' できない弱点を補完', style: 'plain' },
        ],
        [
          { text: 'GRE等でヘッダを付与すると、', style: 'plain' },
          { text: 'MTU', style: 'red' },
          { text: ' サイズが ', style: 'plain' },
          { text: '1500', style: 'red' },
          { text: ' バイトを超え ', style: 'plain' },
          { text: 'フラグメント', style: 'red' },
          { text: ' が発生する場合があるため、ルータ等でMTUを調整する必要がある', style: 'plain' },
        ],
      ],
    },
  ],
  exam_tips: [
    'AHは==暗号化なし==、ESPは==暗号化あり==',
    'トランスポートモード＝端末間／トンネルモード＝VPN装置間',
    'IKEはUDP==500==、IKEフェーズ1（ISAKMP SA）→ フェーズ2（IPsec SA）',
    'メインモード（固定IP）／アグレッシブモード（動的IP）',
    'NATトラバーサルはESPに==UDP==ヘッダを付与（ESPにポート番号が無いため）',
    'GRE over IPsec：暗号化＋マルチキャスト両立',
  ],
}
