import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { categories } from '../data/categories'

// NOTE_DB に存在するカテゴリIDの順序リスト（前後ナビ用 / Notes 一覧フィルタ用）
export const NOTE_CATEGORY_IDS = [
  'layer1-3', 'layer4-7', 'firewall', 'wireless', 'routing',
  'vrrp', 'wan', 'load-balancer', 'dhcp', 'dns',
  'mail', 'voip', 'ipsec', 'sdn', 'security',
  'proxy', 'network-mgmt', 'protocol-review', 'iot',
]

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
interface ProtocolEntry {
  name: string
  transport: string
  ports: string
}

interface NoteSection {
  heading: string
  items?: string[]
  protocols?: ProtocolEntry[]
}

interface NoteData {
  summary: string
  sections: NoteSection[]
  exam_tips: string[]
}

// ─────────────────────────────────────────────
// 赤字ワードのトグルコンポーネント
// ─────────────────────────────────────────────
interface RedWordProps {
  text: string
  masked: boolean
  version: number // この値が変わると revealed がリセットされる
}

function RedWord({ text, masked, version }: RedWordProps) {
  const [revealed, setRevealed] = useState(false)

  // マスクモードが再度 ON になったらリセット
  useEffect(() => {
    if (masked) setRevealed(false)
  }, [masked, version])

  if (!masked) {
    return <span className="text-red-600 font-bold">{text}</span>
  }
  if (revealed) {
    return (
      <span
        role="button"
        tabIndex={0}
        className="text-red-600 font-bold cursor-pointer underline decoration-dotted"
        title="クリックで再び隠す"
        onClick={() => setRevealed(false)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setRevealed(false) } }}
      >
        {text}
      </span>
    )
  }
  return (
    <span
      role="button"
      tabIndex={0}
      className="rounded px-0.5 cursor-pointer select-none"
      style={{ backgroundColor: '#c0392b', color: 'transparent' }}
      title="クリックで表示"
      onClick={() => setRevealed(true)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setRevealed(true) } }}
    >
      {text}
    </span>
  )
}

// ─────────────────────────────────────────────
// Render helper: ==text== → RedWord コンポーネント
// ─────────────────────────────────────────────
function renderText(text: string, hideRed: boolean, version: number): React.ReactNode {
  const parts = text.split(/(==.+?==)/g)
  return parts.map((part, i) => {
    if (part.startsWith('==') && part.endsWith('==')) {
      const inner = part.slice(2, -2)
      return <RedWord key={i} text={inner} masked={hideRed} version={version} />
    }
    return <span key={i}>{part}</span>
  })
}

// ─────────────────────────────────────────────
// プロトコルテーブル用：名前/ポートを個別トグル
// ─────────────────────────────────────────────
interface ProtoCellProps {
  text: string
  isRed: boolean    // この列が「赤字対象」か
  isHidden: boolean // 赤字を隠す状態か（= isRed && hideRed）
  isPort?: boolean  // ポート列：数字のみ赤字・マスク、記号は残す
  version: number
}

function ProtoCell({ text, isRed, isHidden, isPort, version }: ProtoCellProps) {
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    setRevealed(false)
  }, [isRed, isHidden, version])

  // 赤字対象でない → 通常表示
  if (!isRed) {
    return <span className="font-semibold text-slate-800">{text}</span>
  }

  // ── ポート列：数字のみ対象 ──
  if (isPort) {
    const parts = text.split(/(\d+)/g)
    const renderParts = (numClass: string) =>
      parts.map((part, i) =>
        /^\d+$/.test(part) ? (
          <span key={i} className={numClass}>{part}</span>
        ) : (
          <span key={i} className="text-slate-600">{part}</span>
        )
      )

    if (!isHidden) {
      // 赤字表示（非マスク）：数字だけ赤
      return <span>{renderParts('text-red-600 font-bold')}</span>
    }
    // マスク状態
    return (
      <span
        role="button" tabIndex={0}
        className="cursor-pointer"
        title={revealed ? 'タップで再び隠す' : 'タップで表示'}
        onClick={() => setRevealed((v) => !v)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setRevealed((v) => !v) } }}
      >
        {parts.map((part, i) =>
          /^\d+$/.test(part) ? (
            revealed ? (
              <span key={i} className="text-red-600 font-bold underline decoration-dotted">{part}</span>
            ) : (
              <span
                key={i}
                className="rounded select-none"
                style={{ backgroundColor: '#c0392b', color: 'transparent', padding: '0 2px' }}
              >{part}</span>
            )
          ) : (
            <span key={i} className="text-slate-500">{part}</span>
          )
        )}
      </span>
    )
  }

  // ── 名前列：全体を対象 ──
  if (!isHidden) {
    // 赤字表示（非マスク）
    return <span className="text-red-600 font-bold">{text}</span>
  }
  // マスク状態
  if (revealed) {
    return (
      <span
        role="button" tabIndex={0}
        className="text-red-600 font-bold cursor-pointer underline decoration-dotted"
        title="タップで再び隠す"
        onClick={() => setRevealed(false)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setRevealed(false) } }}
      >
        {text}
      </span>
    )
  }
  return (
    <span
      role="button" tabIndex={0}
      className="rounded px-0.5 cursor-pointer select-none"
      style={{ backgroundColor: '#c0392b', color: 'transparent' }}
      title="タップで表示"
      onClick={() => setRevealed(true)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setRevealed(true) } }}
    >
      {text}
    </span>
  )
}

// ─────────────────────────────────────────────
// Note content database (all 19 categories)
// ==重要語== で赤字マーク
// ─────────────────────────────────────────────
const NOTE_DB: Record<string, NoteData> = {
  'layer1-3': {
    summary: 'L1（物理）〜L3（ネットワーク）層の基礎。イーサネット・スイッチング・VLANとARPが中心。',
    sections: [
      {
        heading: 'データ単位',
        items: [
          'L1（物理層）：==ビット==',
          'L2（データリンク層）：==フレーム==',
          'L3（ネットワーク層）：==パケット==',
          'L4（トランスポート層）：==セグメント==（TCP）/ ==データグラム==（UDP）',
        ],
      },
      {
        heading: 'スパニングツリー（STP/RSTP）',
        items: [
          '目的：L2ループによる==ブロードキャストストーム==を防止',
          'BPDUフレームでループを検出し、一部ポートを==ブロッキング==状態に',
          '==RSTP==（IEEE 802.1w）：コンバージェンス時間を約==30==秒→==数秒==に短縮',
          'ルートブリッジ：最小==Bridge ID==を持つSWが選出される',
        ],
      },
      {
        heading: 'VLAN',
        items: [
          '論理的にL2ネットワークを分割する技術',
          '==IEEE 802.1Q==：トランクポートでVLAN IDタグ（==4==バイト、==12==ビットID）を付加',
          '最大==4094==のVLANを識別可能',
          '==アクセスポート==：タグなし（端末向け）、==トランクポート==：タグあり（SW間）',
        ],
      },
      {
        heading: 'ARP / GARP',
        items: [
          'ARP：==IPアドレス== → ==MACアドレス==の解決（同一L2セグメント内）',
          '==Gratuitous ARP（GARP）==：自身のIPをブロードキャストし、近隣のARPキャッシュを更新。HA切替時に使用',
          'ARPスプーフィング：偽のGARPで==中間者攻撃==を実行する脅威',
        ],
      },
      {
        heading: 'リンクアグリゲーション / その他',
        items: [
          '==LACP==（IEEE 802.3ad）：複数物理リンクを1本の論理リンクとして帯域拡大＋冗長化',
          'ポートミラーリング：通信をコピーしてIDS/パケットキャプチャに転送',
          'MACアドレステーブル未登録 → ==フラッディング==（受信ポート以外へ転送）',
        ],
      },
      {
        heading: 'アドレス種別（プレフィックス）',
        items: [
          'グローバルユニキャスト：==/3 (2000::)==（インターネットでルーティング可能）',
          'リンクローカル：==fe80::/10==（同一リンク内のみ。NDP・ルータ発見に使用）',
          'ユニークローカル（ULA）：==fc00::/7==（プライベートIPv6に相当）',
          'マルチキャスト：==ff00::/8==（ブロードキャストはなくマルチキャストで代替）',
          'ループバック：==::1/128==',
        ],
      },
      {
        heading: 'NDP（Neighbor Discovery Protocol）',
        items: [
          '==ICMPv6==を使用（ARP不要）',
          '==NS==（Neighbor Solicitation）/ ==NA==（Neighbor Advertisement）：==MACアドレス解決==',
          '==RS==（Router Solicitation）/ ==RA==（Router Advertisement）：==デフォルトルータ・プレフィックス発見==',
          '==DAD==（Duplicate Address Detection）：重複アドレス検出。NSを送って==応答なし==でアドレス採用',
        ],
      },
      {
        heading: 'SLAAC（Stateless Address Autoconfiguration）',
        items: [
          'ルータの==RA==（プレフィックス情報）＋インタフェースID（==EUI-64== or ランダム）でIPv6アドレスを自動生成',
          'DHCPサーバ不要。ただしDNSサーバ情報はRA拡張（==RDNSS==）かStateless DHCPv6で配布',
          'プレフィックス割り当ての標準：組織に==/48==、サブネットに==/64==',
        ],
      },
      {
        heading: '移行技術',
        items: [
          '==6in4トンネリング==：IPv6をIPv4でカプセル化してIPv4網を通過',
          '==NAT64==：IPv6クライアントがIPv4サーバに接続するための変換',
          '==DS-Lite==：IPv4接続をIPv6網でトンネリング（新方式）',
        ],
      },
    ],
    exam_tips: [
      'STPとRSTPの違い（収束時間）は頻出',
      '802.1Qのタグ構造（==4==バイト：TPID 2B + TCI 2B）',
      'ブロードキャストドメインは==ルータ（L3）==で分割、コリジョンドメインは==SW（L2）==で分割',
      '==fe80::/10==（リンクローカル）は令和7年本試験に出題',
      'DADの手順（==NS送信==→==応答なし==→==アドレス採用==）とSLAACの流れを整理',
      'NDPの4メッセージ（==NS/NA/RS/RA==）の役割を区別',
    ],
  },

  'layer4-7': {
    summary: 'TCPの3ウェイハンドシェイク・輻輳制御・ICMPが頻出。UDPとの比較も重要。HTTP/1.1→2→3の進化、QUICの特徴が頻出。令和7年度でHTTP/3が出題。',
    sections: [
      {
        heading: 'TCPの特徴',
        items: [
          '3ウェイハンドシェイク：==SYN== → ==SYN-ACK== → ==ACK==でコネクション確立',
          '4ウェイハンドシェイク：==FIN/ACK × 2往復==でコネクション切断',
          'シーケンス番号・確認応答番号による==順序保証==と==再送制御==',
          'ウィンドウ制御：==フロー制御==（受信バッファに合わせて送信量を調整）',
        ],
      },
      {
        heading: '輻輳制御',
        items: [
          '==スロースタート==：ウィンドウを1から==指数的==に増加（ssthreshまで）',
          '==輻輳回避==：ssthresh到達後は==線形増加==（1 MSS/RTT）',
          '==高速再転送==：==3つのDuplicate ACK==でタイムアウト前に再送',
          'RED（Random Early Detection）：キュー満杯前にランダムドロップで輻輳崩壊を防止',
        ],
      },
      {
        heading: 'ICMP',
        items: [
          'Type ==8==（Echo Request）/ Type ==0==（Echo Reply）：pingに使用',
          'Type ==11==（Time Exceeded）：TTL=0でルータが返す。==traceroute==に使用',
          'Type ==3==（Destination Unreachable）：到達不能通知。コード==3==はポート到達不能',
          'Type ==5==（Redirect）：より良い経路をホストに通知',
          '==DFビット==（Don\'t Fragment）：フラグメント禁止。==PMTUD==（Path MTU Discovery）に使用',
        ],
      },
      {
        heading: 'UDPとの比較',
        items: [
          '==UDP==：コネクションレス・再送なし・低遅延。DNS・DHCP・NTP・VoIP・動画配信に向く',
          'TCPのオーバーヘッド：ヘッダが最低==20==バイト。UDPは==8==バイト',
        ],
      },
      {
        heading: 'HTTP バージョン比較',
        items: [
          'HTTP/1.1：テキストベース。Keep-Alive対応。==HoLブロッキング==あり',
          'HTTP/2：バイナリフレーム。==マルチプレキシング==・HPACK圧縮・サーバプッシュ。TCPのHoLブロッキングは残存',
          '==HTTP/3==：==QUIC==（UDP）上で動作。TCPのHoLブロッキングを==根本解決==。==TLS 1.3が統合==',
          'QUIC：==0-RTT接続==・ストリームごとの独立した再送制御・接続移行（QUIC Connection Migration）',
        ],
      },
      {
        heading: 'HTTPS / 証明書',
        items: [
          '==OCSP==：証明書の失効状態をリアルタイム確認',
          '==HSTS==：サーバが「常にHTTPS接続せよ」とブラウザに指示するヘッダ',
          '==OCSP Stapling==：サーバ自身がOCSP応答をキャッシュしてクライアントに提示（レイテンシ削減）',
        ],
      },
      {
        heading: 'QUIC の運用注意点',
        items: [
          'QUIC（UDP）はNAPT変換エントリーの==エージングタイム==を短く設定することでルータのメモリ負荷を軽減',
          'ファイアウォールで==UDP 443==を許可する必要がある',
        ],
      },
    ],
    exam_tips: [
      '3ウェイハンドシェイクの手順（==SYN==→==SYN-ACK==→==ACK==）は絶対暗記',
      'スロースタートとssthreshの関係を数値で説明できるように',
      'ICMPのタイプ番号（==0/8/3/11==）はpingとtracerouteの理解に必須',
      'HTTP/2と3の違い（==TCP vs QUIC==）は令和7年本試験に出題',
      '==HoLブロッキング==がTCPレベルで残るHTTP/2 vs 解消されるHTTP/3',
      'フォワードとリバースプロキシの配置と目的の違い',
    ],
  },

  firewall: {
    summary: 'ステートフルインスペクション・NAPT・DMZの3つが必須知識。IDS/IPSの検知方式、インライン/アウトオブバンド配置、WAFの防御対象が頻出。',
    sections: [
      {
        heading: 'ファイアウォールの方式',
        items: [
          '==パケットフィルタリング==：IPアドレス・ポートのみでフィルタリング。==ステートレス==',
          '==ステートフルインスペクション==：TCPの状態（SYN/ESTABLISHED）を追跡し、戻りパケットを==自動許可==',
          '==アプリケーションゲートウェイ==（プロキシ型）：L7まで解析。FTPのデータポート等を動的に許可',
        ],
      },
      {
        heading: 'NAT / NAPT',
        items: [
          '==静的NAT==：==1対1==のIPアドレス変換',
          '==NAPT==（IPマスカレード）：==IPアドレス＋ポート番号==の変換。1つのグローバルIPで複数端末が通信可能',
          '==DNAT==（Destination NAT）：宛先IPを書き換えてDMZ内サーバへ転送。ポートフォワーディングに使用',
          '==SNAT==（Source NAT）：送信元IPを書き換える（インターネットへの出口で使用）',
        ],
      },
      {
        heading: 'DMZ（非武装地帯）',
        items: [
          '外部公開サーバ（Web・Mail・DNS）を内部LANとも外部とも==分離したゾーン==',
          'ファイアウォールで「外部→DMZ」と「==DMZ==→==内部==」のアクセスを個別に制御',
          '典型的な==3ゾーン==構成：外部（Internet）/ DMZ / 内部（Internal）',
        ],
      },
      {
        heading: '検知方式',
        items: [
          '==シグネチャ型==（パターンマッチング型）：既知の攻撃パターンと照合。==誤検知が少ない==が==未知の攻撃に無力==',
          '==アノマリ型==（異常検知型）：ベースラインからの逸脱を検知。==未知の攻撃にも対応==できるが==誤検知が多い==',
        ],
      },
      {
        heading: 'IDS vs IPS の配置',
        items: [
          '==IDS==：==アウトオブバンド==（ミラーポート）配置。検知・アラートのみ。==通信への影響なし==',
          '==IPS==：==インライン==配置。通信を==ブロック可能==。障害時に通信断のリスク（==フェールオープン==設定で回避）',
        ],
      },
      {
        heading: 'WAF（Web Application Firewall）',
        items: [
          '防御対象：==SQLインジェクション==・==XSS==・==CSRF==・パスワードブルートフォース・ファイルアップロード攻撃',
          '防御対象外：==帯域消費型DDoS==（L3/L4レベルはWAFでは対応不可）',
          '==ポジティブモデル==（ホワイトリスト）と==ネガティブモデル==（ブラックリスト）',
        ],
      },
    ],
    exam_tips: [
      'ステートフルとパケットフィルタリングの違いは必出',
      'NAPTで同時セッション数に上限がある理由（ポート番号が==16==ビット＝約65000）',
      'DMZの概念と3ゾーン構成は毎年出題レベル',
      'シグネチャ型 vs アノマリ型の長所・短所を対比で覚える',
      'WAFの防御範囲（==L7アプリ層==）とIPSの防御範囲（L3-L7）の違い',
      'インライン配置のIPS障害時の挙動（==フェールオープン/フェールクローズ==）',
    ],
  },

  wireless: {
    summary: '無線LANの規格・セキュリティ（WPA3/SAE）・802.1X認証、Wi-Fi 7（令和8年予想）が頻出。',
    sections: [
      {
        heading: 'IEEE 802.11 規格の変遷',
        items: [
          '802.11a/b/g：初期規格（54Mbps以下）',
          '==802.11n==（Wi-Fi 4）：MIMO・2.4/5GHz両対応。最大==600==Mbps',
          '==802.11ac==（Wi-Fi 5）：5GHzのみ。MU-MIMO・==256-QAM==。最大==6.9==Gbps',
          '==802.11ax==（Wi-Fi 6）：2.4/5GHz。==OFDMA==・==1024-QAM==・==TWT==（省電力）。最大==9.6==Gbps',
          '802.11ax 6E（Wi-Fi 6E）：==6GHz帯==追加',
          '==802.11be==（Wi-Fi 7）：==320==MHz・==4096-QAM==・==MLO==・プリアンブルパンクチャリング。最大==46==Gbps',
        ],
      },
      {
        heading: 'セキュリティ規格',
        items: [
          '==WEP==：RC4使用。脆弱なため==使用禁止==',
          '==WPA==：TKIP使用。暫定措置',
          '==WPA2==：==AES-CCMP==使用。現在の標準',
          '==WPA3-Personal==：==SAE==（Dragonfly鍵交換）採用。==オフライン辞書攻撃==に強い',
          '==WPA3-Enterprise==：192ビット暗号スイート対応',
        ],
      },
      {
        heading: 'IEEE 802.1X 認証',
        items: [
          '構成：==サプリカント==（端末）/ ==Authenticator==（AP/SW）/ ==Authentication Server==（RADIUS）',
          '==EAP-TLS==：クライアント証明書を使った==相互認証==（最も安全）',
          '==PEAP==：サーバ証明書のみ。ユーザ名/パスワードをTLSトンネル内で転送',
        ],
      },
      {
        heading: 'Wi-Fi 7（令和8年度予想）',
        items: [
          '==MLO==（Multi-Link Operation）：複数バンドを同時使用。超低遅延・高スループット',
          '==4096-QAM==：Wi-Fi 6の1024-QAMより約==20==%効率向上',
          '最大帯域幅：==320==MHz（Wi-Fi 6の2倍）',
          '==プリアンブルパンクチャリング==：干渉部分を除外して広帯域通信',
          '空間ストリーム：最大==16==本（Wi-Fi 6の2倍）',
        ],
      },
    ],
    exam_tips: [
      'CCMP（==WPA2==）・TKIP（==WPA==）・RC4（==WEP==）の対応を整理',
      '802.1Xの3者構成（サプリカント・Authenticator・RADIUS）は図で覚える',
      'Wi-Fi 7の==MLO==・==4096-QAM==・==320==MHzは令和8年度最重要予想',
    ],
  },

  routing: {
    summary: 'ルーティングプロトコルの分類と動作が頻出。',
    sections: [
      {
        heading: 'ルーティングプロトコルの分類',
        items: [
          '==IGP==（AS内部）：OSPF・RIP・EIGRP / ==EGP==（AS間）：BGP',
          'ディスタンスベクタ型：==RIP==（メトリック=ホップ数、最大==15==）',
          'リンクステート型：==OSPF==（メトリック=コスト=帯域幅ベース、==SPFアルゴリズム==）',
          'パスベクタ型：==BGP==（==AS Path属性==でループ防止）',
        ],
      },
      {
        heading: 'OSPF の動作',
        items: [
          'Helloパケット（==224.0.0.5==宛マルチキャスト）でネイバー確立',
          'LSAを交換 → ==LSDB==（Link State Database）構築 → SPFで最短経路算出',
          '==DR/BDR==の選出：マルチアクセスネットワークでLSAフラッディングを効率化',
          'DRへの送信：==224.0.0.6== / 全OSPFルータへの送信：==224.0.0.5==',
          'コスト = リファレンス帯域幅（デフォルト==100==Mbps）÷ インタフェース帯域幅',
        ],
      },
      {
        heading: 'BGP の特徴',
        items: [
          '==TCP ポート 179==を使用（信頼性の高いセッション）',
          'AS間のポリシーベースルーティングに使用',
          '==iBGP==（AS内部）と==eBGP==（AS間）がある',
        ],
      },
    ],
    exam_tips: [
      'OSPFのLSDB・SPF・DR/BDRの概念は頻出',
      'BGPは==TCP接続==、IGPはIPの上で動作する点を区別',
      'デフォルトルート（==0.0.0.0/0==）はロンゲストマッチの最後の手段',
    ],
  },

  vrrp: {
    summary: 'ルータ冗長化の標準プロトコル。仮想ルータIPで透過的な冗長化を実現。',
    sections: [
      {
        heading: 'VRRP基礎',
        items: [
          '==VRRP==（Virtual Router Redundancy Protocol）：複数ルータで==仮想IPアドレス==を共有',
          '==マスタルータ==が通常転送、障害時に==バックアップ==が自動昇格',
          '==プライオリティ==（0〜255、デフォルト100）で役割決定',
          '==仮想MACアドレス==：00-00-5e-00-01-{VRID}形式',
        ],
      },
      {
        heading: 'フェイルオーバー',
        items: [
          '==Advertisement間隔==（デフォルト1秒）で生存確認',
          '==プリエンプト==：高プライオリティルータが復帰後に自動でマスタ奪還',
          '==トラッキング==：上流IF断時にプライオリティを下げ自動的にバックアップに降格',
        ],
      },
    ],
    exam_tips: [
      'VRRPとHSRPの違い（==VRRPはIEEEオープン標準==、HSRPはCisco独自）',
      '==仮想IPとルータのIPは別==を明確に理解',
      'プリエンプトが==無効==な場合、マスタ復帰後も元のバックアップがマスタのまま',
    ],
  },

  wan: {
    summary: 'MPLS・SSL-VPN・IPsec VPNの特徴と使い分けが頻出。',
    sections: [
      {
        heading: 'MPLS',
        items: [
          '==ラベルスイッチング==でIPよりも高速・効率的な転送',
          '==LER==（Label Edge Router）：入口でラベル==付加==、出口でラベル==除去==',
          '==LSR==（Label Switch Router）：ラベルを==スワップ==しながら転送',
          '==L3-VPN==（BGP/MPLS VPN）：ISPバックボーンで閉域VPNを実現',
        ],
      },
      {
        heading: 'VPN の種類',
        items: [
          '==IPsec VPN==：L3レベルの暗号化。専用クライアントが必要。==UDP 500/4500==',
          '==SSL-VPN==（==TCP 443==）：ブラウザから接続可能。FWを通過しやすい',
          '==L2TP/IPsec==：L2フレームをトンネリング。PPPの機能（CHAP認証等）が使える',
          '==SD-WAN==：複数のWANリンク（インターネット・MPLS・LTE）をソフトウェアで統合管理',
        ],
      },
      {
        heading: 'アクセス系回線',
        items: [
          '==ADSL==：非対称DSL。下り最大数十Mbps。電話線使用',
          '==VDSL==：短距離高速DSL。集合住宅のFTTB構成で利用',
          '==FTTH==：光ファイバを建物内まで引き込む。==PON==（Passive Optical Network）方式が主流',
        ],
      },
    ],
    exam_tips: [
      'SSL-VPNとIPsec VPNの使い分け（==FW越え容易さ==・==クライアント要否==）',
      'MPLSのラベル付加/除去の役割（==LER==）とスワップの役割（==LSR==）',
      'SD-WANはWANの柔軟な集約・制御が目的',
    ],
  },

  'load-balancer': {
    summary: 'L4/L7での負荷分散、セッション維持（パーシステンス）が試験頻出。',
    sections: [
      {
        heading: '分散方式',
        items: [
          '==ラウンドロビン==：均等に順番配分',
          '==最小接続数==：セッション数が最も少ないサーバへ',
          '==IPハッシュ==：送信元IPでサーバを固定（セッション維持）',
          '==重み付きラウンドロビン==：サーバ性能比に応じて配分率を調整',
        ],
      },
      {
        heading: 'セッション維持（パーシステンス）',
        items: [
          '==Cookieベース==：LBがCookieを付与しサーバを固定（推奨）',
          '==送信元IPベース==：NAT越え環境では不安定',
          '==SSL セッションID==：再ハンドシェイクなしにサーバを固定',
        ],
      },
      {
        heading: 'ヘルスチェック',
        items: [
          'L4チェック（TCPポート疎通）・L7チェック（HTTPステータスコード確認）',
          '==バックエンドサーバ障害==時に自動的にプールから除外',
        ],
      },
    ],
    exam_tips: [
      '==CookieパーシステンスはHTTPS復号（SSL終端）が前提==',
      'L4LBはIPヘッダのみ参照、L7LBはHTTPヘッダまで参照',
      'DSR（Direct Server Return）：応答をLBを経由せず直接返す',
    ],
  },

  dhcp: {
    summary: 'DORAシーケンスとリレーエージェント、セキュリティ（スヌーピング）が頻出。',
    sections: [
      {
        heading: 'DORA シーケンス',
        items: [
          '① ==Discover==：クライアントがブロードキャストでDHCPサーバを探索',
          '② ==Offer==：サーバが候補IPアドレスを提示',
          '③ ==Request==：クライアントが特定サーバを選択しリースを要求',
          '④ ==Ack==：サーバがリースを確定。IPアドレス・GW・DNS・リース期間を配布',
        ],
      },
      {
        heading: 'DHCPリレーエージェント',
        items: [
          'DHCPはブロードキャストのためルータを越えられない',
          '==リレーエージェント==（通常はルータ）がDiscoverを==ユニキャスト==に変換してDHCPサーバに転送',
          '==Option 82==（Relay Agent Information）：接続ポート情報を付加可能',
        ],
      },
      {
        heading: 'セキュリティ',
        items: [
          '==DHCPスターベーション攻撃==：大量のDiscoverでアドレスプールを枯渇させるDoS攻撃',
          '→ 偽DHCPサーバを立ててMITM攻撃に発展させるケースも',
          '==DHCPスヌーピング==：スイッチでTrusted/Untrustedポートを分類し、UntrustedからのOfferをブロック',
        ],
      },
    ],
    exam_tips: [
      '==DORA==の順序は必ず暗記',
      'リレーエージェントはどの層の機器がどう動作するかを整理',
      'DHCPスヌーピングはDHCP/ARP攻撃両方への対策になる',
    ],
  },

  dns: {
    summary: 'DNSの階層構造・問い合わせの流れ・セキュリティ（DNSSEC・キャッシュポイズニング）が頻出。',
    sections: [
      {
        heading: 'DNSの構成要素',
        items: [
          '==スタブリゾルバ==（クライアント）：フルリゾルバに==再帰問い合わせ==',
          '==フルサービスリゾルバ==（キャッシュDNS）：ルート→TLD→権威と==反復問い合わせ==',
          '==権威DNSサーバ==：ゾーン情報の正式な回答者',
          'ルートDNSサーバ：世界==13==系統。TLDのDNSへ委任（リファーラル）',
        ],
      },
      {
        heading: '主要レコード',
        items: [
          '==A==：ドメイン → IPv4アドレス',
          '==AAAA==：ドメイン → IPv6アドレス',
          '==MX==：メールサーバ（優先度付き）',
          '==CNAME==：別名（エイリアス）',
          '==PTR==：IP → ドメイン（逆引き）。in-addr.arpaドメイン使用',
          '==NS==：権威DNSサーバの指定',
          '==TXT==：SPF・DKIMなどテキスト情報',
        ],
      },
      {
        heading: 'セキュリティ',
        items: [
          '==DNSキャッシュポイズニング==：フルリゾルバに偽応答を注入し、利用者を偽サイトへ誘導',
          '対策①：==DNSSEC==（応答に==デジタル署名==を付加し改ざんを検出）',
          '対策②：==ソースポートランダマイゼーション==（Kaminskyアタック対策）',
          'ゾーン転送（AXFR/IXFR）：==TSIG認証==で不正転送を防止',
        ],
      },
    ],
    exam_tips: [
      'フルリゾルバとスタブリゾルバ・権威DNSの役割分担を整理',
      'DNSSECの仕組み（署名→検証の流れ）',
      '==DRDoS==（DNSアンプ攻撃）：オープンリゾルバに偽送信元IPでAnyクエリを送付し増幅',
    ],
  },

  mail: {
    summary: 'SMTP/POP3/IMAPと送信ドメイン認証（SPF・DKIM・DMARC）の三本柱が頻出。',
    sections: [
      {
        heading: 'メールプロトコル',
        items: [
          '==SMTP==（TCP ==25==/==587==）：メール転送。MTA間は25番、クライアント→サーバはSubmission（587/465）',
          '==POP3==（TCP ==110==/==995==）：メールをサーバからダウンロード後削除。複数端末の同期に不向き',
          '==IMAP==（TCP ==143==/==993==）：メールをサーバ上に保持。複数端末間での同期が可能',
        ],
      },
      {
        heading: '送信ドメイン認証',
        items: [
          '==SPF==：DNSのTXTレコードに送信可能サーバのIPを登録。受信側が==Envelope From==ドメインで照合',
          '==DKIM==：送信サーバが==秘密鍵==でヘッダ・本文を署名。受信側がDNS==公開鍵==で検証。改ざん検知も兼ねる',
          '==DMARC==：SPF/DKIMのどちらかが合格かつFrom:ドメインが一致（==Alignment==）した場合に認証成功。失敗時のポリシー（==none/quarantine/reject==）をDNSで公開',
        ],
      },
      {
        heading: '迷惑メール対策全体像',
        items: [
          'なりすまし対策：==SPF==（IP検証）＋ ==DKIM==（署名検証）＋ ==DMARC==（ポリシー適用）',
          'DNSBL（ブラックリスト）：送信元IPをブラックリストと照合',
          '==MTA-STS==：DNSとHTTPSでメール転送経路の暗号化を強制',
        ],
      },
    ],
    exam_tips: [
      'SPF・DKIM・DMARCの役割の違いを整理して覚える',
      'DMARCの「==Alignment==」の概念（From:とEnvelope Fromが一致するか）',
      'POP3は==サーバ削除型==、IMAPは==サーバ保管型==',
    ],
  },

  voip: {
    summary: 'VoIPのシグナリング（SIP）とメディア転送（RTP）、QoS（DSCP）の分離を理解する。',
    sections: [
      {
        heading: 'VoIPの2層構造',
        items: [
          'シグナリング（呼制御）：==SIP==。セッション確立・変更・切断を担当。==UDP/TCP 5060==',
          'メディア転送：==RTP==。実際の音声/映像パケットを送受信。==UDP==上で動作',
          '==RTCP==：RTPと対で動作しQoS統計（==パケットロス率・ジッタ・RTT==）を報告',
        ],
      },
      {
        heading: 'SIPの動作',
        items: [
          '==INVITE==：セッション確立要求',
          '==200 OK==：応答（接続可）',
          '==ACK==：確認応答でメディアストリーム開始',
          '==BYE==：切断要求',
          '==SDP==（Session Description Protocol）：INVITEに含まれ、使用するコーデック・ポート番号等を記述',
        ],
      },
      {
        heading: 'QoS',
        items: [
          '==ジッタ==：パケット到着間隔のばらつき。ジッタバッファで吸収するが遅延が増加',
          '==DSCP==（Differentiated Services Code Point）：IPヘッダのTOSフィールド上位==6==ビット。==EF==（Expedited Forwarding）が音声に最適',
          '推奨遅延：片方向==150==ms以内。ジッタ：==30==ms以内。パケットロス：==1==%以下',
        ],
      },
    ],
    exam_tips: [
      'SIPは==シグナリングのみ==、RTPが==メディア==という分離を混同しない',
      'DSCPと==EF==クラスの組み合わせ（VoIP優先）',
      'ジッタバッファのトレードオフ（大きいほど音質安定だが==遅延増加==）',
    ],
  },

  ipsec: {
    summary: 'IPsecの2モード・2プロトコル・IKEの動作、NATトラバーサルが頻出。',
    sections: [
      {
        heading: 'IPsecの2つのプロトコル',
        items: [
          '==AH==（Authentication Header）：IPヘッダを含む全体を==認証のみ==。==暗号化なし==',
          '==ESP==（Encapsulating Security Payload）：ペイロードを==暗号化＋認証==。実運用での主流',
          '==SA==（Security Association）：==一方向==の通信を保護するパラメータセット。双方向には2つ必要',
        ],
      },
      {
        heading: 'トンネルモード vs トランスポートモード',
        items: [
          '==トンネルモード==：元のIPパケット全体をカプセル化。新しいIPヘッダを付加。==VPN装置間==に適用',
          '==トランスポートモード==：ペイロード部のみを保護。元のIPヘッダを残す。==端末間==に適用',
        ],
      },
      {
        heading: 'IKE（鍵交換）',
        items: [
          '==IKEv2==：==UDP 500番==。フェーズ1でIKE SA確立 → フェーズ2でIPsec SA確立',
          '==NATトラバーサル（NAT-T）==：ESPを==UDP 4500==でカプセル化。NAPT越えを実現',
          '==DH（Diffie-Hellman）==交換でセッション鍵を安全に共有',
        ],
      },
    ],
    exam_tips: [
      'AHは==暗号化なし==、ESPは==暗号化あり==を確実に区別',
      'トンネルモードは==VPN GW間==、トランスポートモードは==端末間==',
      'NATトラバーサルが必要な理由（ESPにはポート番号がないため）',
    ],
  },

  sdn: {
    summary: 'コントロールプレーンとデータプレーンの分離。OpenFlowが代表的実装。',
    sections: [
      {
        heading: 'SDN基礎',
        items: [
          '==SDN==（Software Defined Networking）：制御プレーンをソフトウェアで集中管理',
          '==コントロールプレーン==（OFC/OpenFlow Controller）と==データプレーン==（OFS/OpenFlow Switch）を分離',
          '==フローテーブル==でパケット転送ルールを定義',
          'APIによる動的な経路制御・ポリシー変更が可能',
        ],
      },
      {
        heading: 'OpenFlow',
        items: [
          '==OFC==（OpenFlow Controller）：ネットワーク全体の制御ロジックを管理',
          '==OFS==（OpenFlow Switch）：OFCの指示に従ってパケットを転送',
          '==OpenFlowチャネル==（TLS/TCP 6653）：OFCとOFS間の制御通信',
          '==Match-Action==：フィールド一致条件とアクション（転送・廃棄・書換え）',
        ],
      },
    ],
    exam_tips: [
      'OFCとOFSの役割の違いを明確に',
      'フローテーブルの==Match-Action==の概念',
      '==オーバーレイSDN==（VXLAN）vs ==アンダーレイSDN==の違い',
    ],
  },

  security: {
    summary: 'TLSハンドシェイク・PKI・標的型攻撃・認証（RADIUS・Kerberos・SAML）が頻出。試験の最重要分野。',
    sections: [
      {
        heading: 'TLSハンドシェイク（TLS 1.2）',
        items: [
          '① ==ClientHello==（TLSバージョン・乱数・暗号スイート候補）',
          '② ==ServerHello==（選択した暗号スイート）＋ Certificate（サーバ証明書）＋ ServerHelloDone',
          '③ ==ClientKeyExchange==（プリマスタシークレット送付）',
          '④ ==ChangeCipherSpec== ＋ Finished（両者が共通の==マスタシークレット==で鍵生成、以降暗号化）',
          '==TLS 1.3==：==0-RTT==（セッション再開）、==RSA鍵交換廃止==（ECDHEのみ）、==前方秘匿性==保証',
        ],
      },
      {
        heading: 'PKI（証明書チェーン）',
        items: [
          '==ルートCA== → ==中間CA== → ==サーバ証明書==の階層構造',
          'ルートCA証明書はOS/ブラウザに組み込み済み（==トラストアンカー==）',
          '中間CAを経由することでルートCA秘密鍵の露出リスクを限定',
          '証明書失効：==CRL==（失効リスト）または==OCSP==（リアルタイム確認）',
        ],
      },
      {
        heading: 'セキュリティ機能',
        items: [
          '==HSTS==：Strict-Transport-SecurityヘッダでブラウザにHTTPS強制。==ダウングレード攻撃==を防止',
          '==前方秘匿性（PFS）==：セッションごとに一時鍵（ECDHE）を生成。過去の通信を保護',
          '==OCSP Stapling==：サーバがOCSP応答をキャッシュし証明書検証の遅延を削減',
        ],
      },
      {
        heading: 'DoS/DDoS 系攻撃',
        items: [
          '==SYNフラッド==：大量SYNでサーバのTCBを枯渇。対策：==SYNクッキー==・接続レート制限',
          '==スマーフ攻撃==：ブロードキャストアドレスにICMPを送り増幅させる。対策：==directed broadcast無効化==',
          '==DRDoS==（Distributed Reflection DoS）：偽送信元IPでDNS/NTPリゾルバに問い合わせ、応答を被害者に集中。==DNSアンプ攻撃==とも呼ばれる',
          'Ping of Death：MTUを超えたICMPパケット送信による脆弱性攻撃（現在はほぼ対策済み）',
        ],
      },
      {
        heading: 'サイドチャネル攻撃',
        items: [
          '==Tempest攻撃==：機器から漏れる==電磁波==を傍受し、画面内容・通信内容を復元',
          '==タイミング攻撃==：処理時間の差から鍵情報を推測',
          'サイドチャネル攻撃全般の対策：==電磁シールド==・定常電力消費・ランダム化',
        ],
      },
      {
        heading: 'Webアプリ攻撃',
        items: [
          '==SQLインジェクション==：入力値にSQL構文を埋め込んでDB不正操作。対策：==プリペアドステートメント==',
          '==XSS==（クロスサイトスクリプティング）：悪意のあるスクリプトを被害サイトに反射・格納。対策：==エスケープ・CSP==',
          '==CSRF==：認証済みセッションを悪用して意図しない操作を実行させる。対策：==CSRFトークン・SameSite Cookie==',
          '==ディレクトリトラバーサル==：../を使いパスをさかのぼってファイルを読み出す。対策：==入力値検証==',
        ],
      },
      {
        heading: 'RADIUS',
        items: [
          '構成：サプリカント / ==NAS==（Authenticator）/ ==RADIUSサーバ==',
          '==AAA==（Authentication・Authorization・Accounting）を提供',
          '==IEEE 802.1X==で無線LAN・有線LAN認証のバックエンドとして使用',
          '==UDP 1812==（認証）・==UDP 1813==（アカウンティング）',
          'RADIUS属性でVLAN割り当てなどの認可情報も配布可能',
        ],
      },
      {
        heading: 'LDAP',
        items: [
          'X.500をベースにしたディレクトリサービスアクセスプロトコル',
          '==TCP 389==（平文）/ ==TCP 636==（LDAPS/TLS）',
          '==DN==（Distinguished Name）：ツリー内の場所を一意に識別（例：cn=user,ou=staff,dc=example,dc=com）',
          'Active Directoryは==LDAP==と==Kerberos==を統合したMicrosoft製ディレクトリサービス',
        ],
      },
      {
        heading: 'Kerberos',
        items: [
          '==チケットベース==の認証（パスワードをネットワーク上に流さない）',
          '① ==AS==（Authentication Server）に==TGT==（Ticket Granting Ticket）を要求',
          '② ==TGS==（Ticket Granting Server）に==ST==（Service Ticket）を要求',
          '③ STをサービス提示してアクセス',
          'Active Directoryのデフォルト認証プロトコル',
        ],
      },
      {
        heading: 'SAML / SSO',
        items: [
          '==SAML==：XMLベースのSSOフェデレーション規格。==IdP==（Identity Provider）と==SP==（Service Provider）間でアサーション交換',
          '==OAuth 2.0==：==認可==フレームワーク（認証ではなく認可）',
          '==OpenID Connect==：OAuth 2.0の上に==認証==レイヤを追加',
        ],
      },
    ],
    exam_tips: [
      'TLS 1.2と1.3のハンドシェイクの違い（==RTT数==・==鍵交換方式==）',
      '前方秘匿性の有無が==RSA==と==ECDHE==の最大の差',
      '証明書チェーンの検証順序（サーバ証明書→中間CA→ルートCA）',
      'DRDoSの「==反射==」「==増幅==」の仕組みを図で説明できるように',
      '==Tempest攻撃==は令和7年本試験で出題済み。物理的な対策が必要',
      'CSRF vs XSSの違い（==CSRF==：別サイトから正規サイトへ操作 / ==XSS==：正規サイトに悪意のスクリプト注入）',
      'RADIUSの3者構成はIEEE 802.1X絡みで必出',
      'KerberosのTGT→STの==2段階==は図解で覚える',
      'SAMLとOAuth2.0/OIDCの「==認証==」「==認可==」の違いを区別',
    ],
  },

  proxy: {
    summary: 'フォワード/リバース/トランスペアレントプロキシの違いとHTTPS復号が頻出。',
    sections: [
      {
        heading: 'プロキシの種類',
        items: [
          '==フォワードプロキシ==：クライアント側配置。クライアントの代理でサーバに接続。URLフィルタリング・キャッシュ',
          '==リバースプロキシ==：サーバ側配置。サーバの代理としてクライアントからのリクエストを受信。負荷分散・SSL終端',
          '==トランスペアレントプロキシ==：クライアント設定不要。L4/L7スイッチで強制転送',
        ],
      },
      {
        heading: 'HTTPS復号（SSLインスペクション）',
        items: [
          'プロキシが==SSL終端==し平文でコンテンツ検査→再暗号化してサーバへ転送',
          '企業の==ルートCA証明書==をクライアントに配布し、プロキシが動的証明書を発行',
          '==PAC==（Proxy Auto-Config）ファイル：JavaScriptでプロキシ自動設定',
        ],
      },
      {
        heading: 'プロキシ認証',
        items: [
          'BASIC認証・NTLM認証・Kerberos認証をサポート',
          '==CONNECT メソッド==：HTTPSトンネル確立時にプロキシへのトンネル要求',
        ],
      },
    ],
    exam_tips: [
      'フォワードとリバースプロキシの==配置位置と目的==',
      'HTTPS復号は==ルートCA信頼==が前提',
      'PACファイルは==wpad==（Web Proxy Auto-Discovery）で自動配布可能',
    ],
  },

  'network-mgmt': {
    summary: 'SNMP（MIB・OID・Trap）・syslog・NetFlowの役割と、AIOps・ストリーミングテレメトリ（令和8年予想）。',
    sections: [
      {
        heading: 'SNMP',
        items: [
          '==マネージャ==（監視サーバ）がエージェント（機器）に==Get/Set==で情報取得・設定変更',
          '==Trap==：機器から異常をマネージャに==非同期通知==（==UDP 162==）',
          '==MIB==（Management Information Base）：管理情報の木構造データベース',
          '==OID==（Object Identifier）：MIB内の各オブジェクトを一意に識別する番号',
          '==v1/v2c==：==コミュニティストリング==（平文）。==v3==：==USM==（認証＋暗号化）',
        ],
      },
      {
        heading: 'syslog / NetFlow',
        items: [
          '==syslog==：==UDP 514==。ファシリティとセベリティ（==0:Emergency〜7:Debug==）',
          '==NetFlow==：フロー情報（送受信IP・ポート・プロトコル・バイト数）を収集。帯域分析・異常検知に活用',
          'IPFIX：NetFlowの標準化版。sFlow：サンプリングベースの軽量版',
        ],
      },
      {
        heading: 'AIOps・新世代監視（令和8年度予想）',
        items: [
          '==ストリーミングテレメトリ==：==gRPC/gNMI==で機器からリアルタイム==プッシュ==送信。SNMPポーリングより高精度',
          '==AIOps==：ML/AIで==異常検知・根本原因分析・Self-healing==（自己修復）を自動化',
          '==インテントベースネットワーキング（IBN）==：管理者の「意図（What）」を入力するとシステムが自動設定（How）',
        ],
      },
    ],
    exam_tips: [
      'SNMPのGet（==マネージャから問い合わせ==）とTrap（==機器から通知==）の方向を区別',
      'v1/v2cとv3のセキュリティの違い（==コミュニティ文字列== vs ==USM==）',
      'ストリーミングテレメトリとSNMPポーリングの==プッシュ/プル==比較は令和8年度最重要予想',
    ],
  },

  'protocol-review': {
    summary: 'L1〜L7の全レイヤを体系的に整理。ポート番号・プロトコル番号・Ethertype・イーサネット規格を一覧化。試験直前の総まとめに最適。',
    sections: [
      {
        heading: 'アプリケーション層（L5〜L7）— プロトコルとポート番号',
        protocols: [
          { name: 'HTTP',         transport: 'TCP',     ports: '80' },
          { name: 'HTTPS',        transport: 'TCP',     ports: '443' },
          { name: 'DNS',          transport: 'UDP/TCP', ports: '53' },
          { name: 'SMTP',         transport: 'TCP',     ports: '25（送信）/ 587（サブミッション）' },
          { name: 'POP3',         transport: 'TCP',     ports: '110（平文）/ 995（SSL）' },
          { name: 'IMAP4',        transport: 'TCP',     ports: '143（平文）/ 993（SSL）' },
          { name: 'SSH',          transport: 'TCP',     ports: '22' },
          { name: 'Telnet',       transport: 'TCP',     ports: '23' },
          { name: 'FTP',          transport: 'TCP',     ports: '21（制御）/ 20（データ・アクティブ）' },
          { name: 'TFTP',         transport: 'UDP',     ports: '69' },
          { name: 'DHCP',         transport: 'UDP',     ports: '67（サーバ）/ 68（クライアント）' },
          { name: 'SNMP',         transport: 'UDP',     ports: '161（Get/Set）/ 162（Trap）' },
          { name: 'NTP',          transport: 'UDP',     ports: '123' },
          { name: 'Syslog',       transport: 'UDP',     ports: '514' },
          { name: 'LDAP',         transport: 'TCP',     ports: '389（平文）/ 636（LDAPS）' },
          { name: 'LDAPS',        transport: 'TCP',     ports: '636' },
          { name: 'RADIUS',       transport: 'UDP',     ports: '1812（認証）/ 1813（課金）' },
          { name: 'SIP',          transport: 'UDP/TCP', ports: '5060（平文）/ 5061（TLS）' },
          { name: 'BGP',          transport: 'TCP',     ports: '179' },
          { name: 'MQTT',         transport: 'TCP',     ports: '1883（平文）/ 8883（TLS）' },
          { name: 'CoAP',         transport: 'UDP',     ports: '5683' },
          { name: 'QUIC / HTTP/3',transport: 'UDP',     ports: '443' },
          { name: 'OpenFlow',     transport: 'TCP',     ports: '6653' },
          { name: 'IKEv2',        transport: 'UDP',     ports: '500（通常）/ 4500（NAT-T）' },
        ],
      },
      {
        heading: 'トランスポート層（L4）',
        items: [
          '==TCP==（IPプロトコル番号：==6==）：コネクション型・信頼性転送・フロー制御・輻輳制御・3ウェイハンドシェイク',
          '==UDP==（IPプロトコル番号：==17==）：コネクションレス・低遅延・再送なし。VoIP・DNS・DHCP・QUIC に使用',
          '==SCTP==（IPプロトコル番号：==132==）：マルチホーミング・マルチストリーム対応。信頼性はTCP相当',
          'ウェルノウンポート：==0〜1023==（システムサービス用・root権限が必要）',
          '登録ポート：==1024〜49151==（アプリケーションが登録して使用）',
          'エフェメラルポート：==49152〜65535==（クライアントが一時的に使用する動的ポート）',
        ],
      },
      {
        heading: 'ネットワーク層（L3）— IPプロトコル番号',
        items: [
          'ICMP：プロトコル番号 ==1==',
          'TCP：プロトコル番号 ==6==',
          'UDP：プロトコル番号 ==17==',
          'GRE：プロトコル番号 ==47==',
          'ESP（IPsec）：プロトコル番号 ==50==',
          'AH（IPsec）：プロトコル番号 ==51==',
          'OSPF：プロトコル番号 ==89==',
          'SCTP：プロトコル番号 ==132==',
        ],
      },
      {
        heading: 'ICMPタイプ番号（L3）',
        items: [
          'Type ==0==：Echo Reply（ping 応答）',
          'Type ==3==：Destination Unreachable（到達不能）。Code ==3== = Port Unreachable',
          'Type ==5==：Redirect（より良い経路をホストに通知）',
          'Type ==8==：Echo Request（ping 要求）',
          'Type ==11==：Time Exceeded（TTL=0。==traceroute== に使用）',
        ],
      },
      {
        heading: 'マルチキャストアドレス（L3）',
        items: [
          '==224.0.0.5==：全 OSPF ルータ宛',
          '==224.0.0.6==：OSPF の DR/BDR 宛',
          '==224.0.0.9==：RIPv2 ルータ宛',
          '==224.0.0.18==：VRRP 宛',
          '==ff02::1==：リンクローカル全ノード（IPv6）',
          '==ff02::2==：リンクローカル全ルータ（IPv6）',
          '==ff02::5==：OSPFv3 全ルータ（IPv6）',
        ],
      },
      {
        heading: '物理層（L1）— 主要イーサネット規格',
        items: [
          '==100BASE-TX==：Fast Ethernet。UTP Cat5。最大 ==100==m',
          '==1000BASE-T==：GbE。UTP Cat5e。最大 ==100==m',
          '==1000BASE-SX==：GbE。マルチモードファイバ（MMF）。最大 ==550==m',
          '==1000BASE-LX==：GbE。シングルモードファイバ（SMF）。最大 ==5==km',
          '==10GBASE-T==：10GbE。UTP Cat6a。最大 ==100==m',
          '==10GBASE-SR==：10GbE。マルチモードファイバ（MMF）。最大 ==300==m',
          '==10GBASE-LR==：10GbE。シングルモードファイバ（SMF）。最大 ==10==km',
          '==40GBASE-SR4==：40GbE。MMF×4 レーン（QSFP+）。最大 ==150==m',
          '==100GBASE-SR4==：100GbE。MMF×4 レーン（QSFP28）。最大 ==100==m',
        ],
      },
    ],
    exam_tips: [
      'ポート番号は==平文 vs 暗号化版==をセットで暗記（HTTP:80/HTTPS:443、SMTP:25/587、POP3:110/995、IMAP4:143/993、LDAP:389/636）',
      '==UDP 使用プロトコル==：DNS・SNMP・NTP・TFTP・DHCP・Syslog・RADIUS・CoAP・QUIC（HTTP/3）',
      '==BGP は TCP 179==（OSPF・RIP・VRRP は IP を直接使用）',
      'IP プロトコル番号：==ICMP=1==・==TCP=6==・==UDP=17==・==GRE=47==・==ESP=50==・==AH=51==・==OSPF=89==',
      'ICMP タイプ：==0/8==（ping 応答/要求）・==11==（TTL 超過・traceroute）・==3==（到達不能）',
      'Ethertype：==0x0800==（IPv4）・==0x0806==（ARP）・==0x86DD==（IPv6）・==0x8100==（VLAN）',
    ],
  },

  iot: {
    summary: 'MQTT・CoAP・LPWA（令和7年）とSASE・ZTNA・Wi-Fi 7（令和8年予想）が最重要。',
    sections: [
      {
        heading: 'IoT通信プロトコル',
        items: [
          '==MQTT==（==TCP 1883/8883==）：==Pub/Subモデル==。ブローカーを介してPublisher→Subscriberにメッセージ配信。==QoS 0/1/2==',
          '==CoAP==（==UDP 5683==）：RESTfulなHTTP互換の軽量プロトコル。==Confirmable/Non-confirmable==で信頼性を選択',
          'AMQP：メッセージキューイングプロトコル。エンタープライズ向け（MQTTよりリッチ）',
        ],
      },
      {
        heading: 'LPWA（Low Power Wide Area）',
        items: [
          '==LoRaWAN==：==チャープ変調（CSS）==。==920MHz帯==。数km〜数十kmの長距離通信',
          '==Sigfox==：Ultra-Narrow Band変調。月単位の電池駆動。最大==12==バイト/メッセージ',
          '==NB-IoT / LTE-M==：3GPP標準。既存LTE基地局活用。キャリアサービス',
          '==Wi-SUN==：スマートメーター向けメッシュネットワーク（日本標準）',
        ],
      },
      {
        heading: 'SASE・ゼロトラスト（令和8年予想）',
        items: [
          '==SASE==（Secure Access Service Edge）：==SD-WAN＋SWG・CASB・ZTNA・FWaaS==をクラウドで統合',
          '==ZTNA==（Zero Trust Network Access）：「==常に認証・常に最小権限==」。VPN不要でアプリ単位アクセス制御',
          '==CASB==（Cloud Access Security Broker）：クラウドサービス利用の可視化・制御',
          '==SWG==（Secure Web Gateway）：クラウド型プロキシ。URLフィルタ・マルウェアスキャン・DLP',
        ],
      },
      {
        heading: '試験制度変更（令和8年度）',
        items: [
          '==CBT==（Computer Based Testing）方式に完全移行',
          '科目A-2（旧午前Ⅱ）・科目B（旧午後Ⅰ/Ⅱ → B-1/B-2）に名称変更',
          '記述解答→==キーボード入力（タイピング）==方式に変更',
        ],
      },
    ],
    exam_tips: [
      'MQTT（==TCP・Pub/Sub==）とCoAP（==UDP・RESTful==）の違いは令和7年に出題',
      'LPWAの各技術（LoRa・Sigfox・NB-IoT）の特徴の違い',
      '==SASE== = ==SD-WAN== + セキュリティ（SWG+CASB+ZTNA+FWaaS）という構成を覚える',
    ],
  },
}

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────
export default function NoteDetail() {
  const { categoryId } = useParams<{ categoryId: string }>()
  const category = categories.find((c) => c.id === categoryId)
  const note = categoryId ? NOTE_DB[categoryId] : undefined
  const [hideRed, setHideRed] = useState(false)
  // マスクモードを ON にするたびにインクリメントして RedWord をリセット
  const [maskVersion, setMaskVersion] = useState(0)
  // プロトコルテーブル専用マスクモード（protocol-review ページのみ）
  const [protoMask, setProtoMask] = useState<'none' | 'name' | 'port'>('none')
  const [protoVersion, setProtoVersion] = useState(0)

  const setProtoMaskMode = (mode: 'none' | 'name' | 'port') => {
    setProtoMask(mode)
    setProtoVersion((v) => v + 1)
  }

  const [toastVisible, setToastVisible] = useState(false)
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const toggleHide = () => {
    setHideRed((v) => {
      const next = !v
      if (next) {
        setMaskVersion((k) => k + 1) // ONにするとき全リセット
        if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
        setToastVisible(true)
        toastTimerRef.current = setTimeout(() => setToastVisible(false), 3000)
      }
      return next
    })
  }

  // 前後のノートカテゴリ
  const currentIdx = categoryId ? NOTE_CATEGORY_IDS.indexOf(categoryId) : -1
  const prevId = currentIdx > 0 ? NOTE_CATEGORY_IDS[currentIdx - 1] : null
  const nextId = currentIdx < NOTE_CATEGORY_IDS.length - 1 ? NOTE_CATEGORY_IDS[currentIdx + 1] : null
  const prevCategory = prevId ? categories.find((c) => c.id === prevId) : null
  const nextCategory = nextId ? categories.find((c) => c.id === nextId) : null

  if (!category || !note) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4" style={{ backgroundColor: '#f8fafc' }}>
        <p className="text-slate-500">ノートが見つかりません</p>
        <Link to="/notes" className="text-blue-600 underline text-sm">ノート一覧へ戻る</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8fafc' }}>
      <div className="max-w-3xl mx-auto px-4 pb-32 pt-6">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-400 mb-4">
          <Link to="/notes" className="hover:text-blue-600 transition-colors">ノートモード</Link>
          <span>/</span>
          <span className="text-slate-600">{category.name}</span>
        </nav>

        {/* Header */}
        <div className="mb-5">
          <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
            <div>
              <div
                className="inline-block text-xs font-semibold px-3 py-1 rounded-full text-white mb-2"
                style={{ backgroundColor: '#1a3a5c' }}
              >
                {category.name}
              </div>
              <h1 className="text-2xl font-black text-slate-800">{category.name} ノート</h1>
            </div>

          </div>

          {/* 凡例 */}
          <div className="flex items-center gap-3 text-xs text-slate-500 bg-white border border-slate-200 rounded-lg px-3 py-2 flex-wrap">
            <span className="text-red-600 font-bold">赤字</span>
            <span>= 重要暗記ワード</span>
            <span className="mx-1 text-slate-300">|</span>
            {hideRed || (categoryId === 'protocol-review' && protoMask !== 'none') ? (
              <span className="flex items-center gap-1 flex-wrap">
                <span className="inline-block w-10 rounded text-center text-xs" style={{ backgroundColor: '#c0392b', color: 'transparent' }}>隠れ</span>
                <span>をタップで表示 / もう一度タップで再び隠す</span>
              </span>
            ) : (
              <span>画面下の「赤字を隠す」で暗記テストができます</span>
            )}
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-5">
          {note.sections.map((section, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div
                className={`px-5 py-3 border-b border-slate-100 ${section.protocols ? 'flex items-center justify-between gap-2' : ''}`}
                style={{ backgroundColor: '#1a3a5c' }}
              >
                <h2 className="text-sm font-bold text-white leading-snug">{section.heading}</h2>
                {section.protocols && (
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => setProtoMaskMode(protoMask === 'name' ? 'none' : 'name')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                        protoMask === 'name'
                          ? 'bg-red-500 text-white'
                          : 'bg-blue-800 text-blue-200 hover:bg-blue-700'
                      }`}
                    >
                      {protoMask === 'name' ? '名前が赤字 ✓' : '名前を赤字に'}
                    </button>
                    <button
                      onClick={() => setProtoMaskMode(protoMask === 'port' ? 'none' : 'port')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                        protoMask === 'port'
                          ? 'bg-red-500 text-white'
                          : 'bg-blue-800 text-blue-200 hover:bg-blue-700'
                      }`}
                    >
                      {protoMask === 'port' ? 'ポートが赤字 ✓' : 'ポートを赤字に'}
                    </button>
                  </div>
                )}
              </div>
              {section.protocols ? (
                <div className="px-5 py-3 overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="text-xs text-slate-400 border-b border-slate-100">
                        <th className="text-left pb-2 pr-4 font-semibold">プロトコル</th>
                        <th className="text-left pb-2 pr-4 font-semibold w-20">種別</th>
                        <th className="text-left pb-2 font-semibold">ポート / 番号</th>
                      </tr>
                    </thead>
                    <tbody>
                      {section.protocols.map((entry, j) => (
                        <tr key={j} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                          <td className="py-1.5 pr-4">
                            <ProtoCell
                              text={entry.name}
                              isRed={protoMask === 'name'}
                              isHidden={protoMask === 'name' && hideRed}
                              version={protoVersion + maskVersion}
                            />
                          </td>
                          <td className="py-1.5 pr-4 text-slate-400 text-xs font-mono">{entry.transport}</td>
                          <td className="py-1.5 font-mono text-xs">
                            <ProtoCell
                              text={entry.ports}
                              isRed={protoMask === 'port'}
                              isHidden={protoMask === 'port' && hideRed}
                              isPort
                              version={protoVersion + maskVersion}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <ul className="px-5 py-4 space-y-2">
                  {(section.items ?? []).map((item, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-slate-700 leading-relaxed">
                      <span className="flex-shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-400" />
                      <span>{renderText(item, hideRed, maskVersion)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* Exam Tips */}
        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-2xl overflow-hidden">
          <div className="px-5 py-3 border-b border-amber-200 bg-amber-100">
            <h2 className="text-sm font-bold text-amber-800">★ 試験で狙われるポイント</h2>
          </div>
          <ul className="px-5 py-4 space-y-2">
            {note.exam_tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-amber-900 leading-relaxed">
                <span className="flex-shrink-0 mt-0.5 text-amber-500 font-bold">!</span>
                <span>{renderText(tip, hideRed, maskVersion)}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 前後ナビ */}
        {(prevCategory || nextCategory) && (
          <div className="mt-6 flex gap-3">
            {prevCategory ? (
              <Link
                to={`/notes/${prevCategory.id}`}
                className="flex-1 flex items-center gap-2 px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-600 hover:border-blue-400 hover:text-blue-700 transition-colors min-w-0"
              >
                <span className="flex-shrink-0">←</span>
                <span className="truncate">{prevCategory.name}</span>
              </Link>
            ) : <div className="flex-1" />}
            {nextCategory ? (
              <Link
                to={`/notes/${nextCategory.id}`}
                className="flex-1 flex items-center justify-end gap-2 px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-600 hover:border-blue-400 hover:text-blue-700 transition-colors min-w-0"
              >
                <span className="truncate">{nextCategory.name}</span>
                <span className="flex-shrink-0">→</span>
              </Link>
            ) : <div className="flex-1" />}
          </div>
        )}

        {/* Bottom Navigation */}
        <div className="mt-4 flex flex-col sm:flex-row gap-3">
          <Link
            to="/notes"
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-600 hover:border-blue-400 hover:text-blue-700 transition-colors"
          >
            ← ノート一覧へ
          </Link>
          <Link
            to={`/quiz?mode=topic&category=${category.id}`}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white transition-colors"
            style={{ backgroundColor: '#1a3a5c' }}
          >
            問題を解く →
          </Link>
        </div>
      </div>
      {/* ─── トースト通知 ─── */}
      {toastVisible && (
        <div
          className="fixed bottom-16 left-1/2 -translate-x-1/2 z-40 bg-slate-800 text-white text-sm rounded-xl px-4 py-2.5 shadow-lg flex items-center gap-2 whitespace-nowrap"
          role="status"
          aria-live="polite"
        >
          <span>👆</span>
          <span>赤字をタップすると答えが表示されます</span>
        </div>
      )}
      {/* ─── スティッキーフッター：赤字を隠す ─── */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t border-slate-200 shadow-lg z-30">
        <div className="max-w-3xl mx-auto px-4 py-2.5 flex justify-center sm:justify-end">
          <button
            onClick={toggleHide}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold border-2 transition-all shadow-sm ${
              hideRed
                ? 'bg-red-600 border-red-600 text-white shadow-red-200'
                : 'bg-white border-red-400 text-red-600 hover:bg-red-50'
            }`}
            aria-pressed={hideRed}
          >
            <span className="text-base">{hideRed ? '👁' : '📕'}</span>
            {hideRed ? '赤字を表示する' : '赤字を隠す'}
          </button>
        </div>
      </div>
    </div>
  )
}
