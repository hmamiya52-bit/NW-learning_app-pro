// 教科書モード（v2）データ型。
// 図は「座標を持たない論理データ」。レイアウトは表示側が画面幅に応じて算出する。

export type Tone = 'sky' | 'emerald' | 'blue' | 'amber' | 'violet' | 'rose' | 'slate'

export type NodeRole =
  | 'pc'
  | 'switch'
  | 'router'
  | 'server'
  | 'dns'
  | 'firewall'
  | 'internet'
  | 'cloud'
  | 'lb'
  | 'proxy'

export type ChapterStatus = 'published' | 'draft'

export interface TextbookChapter {
  id: string
  order: number
  title: string
  summary: string
  status: ChapterStatus
  estimatedMinutes: number
  intro: Block[]
  sections: Section[]
  takeaways: string[]
  // 章末の「理解の確認」（2〜3問）。答えはタップで開く。
  checks?: CheckItem[]
}

// 確認問題・設問例の1問（本文の check ブロックと章末 checks で共用）。
export interface CheckItem {
  question: string
  answer: string
  note?: string
}

export interface Section {
  heading: string
  blocks: Block[]
}

export type CalloutTone = 'info' | 'warn' | 'tip'

// 本文・図・補足を「読む順」に並べる。図は1理解単位として本文の間に差し込む。
export type Block =
  | { kind: 'text'; text: string }
  | { kind: 'callout'; tone: CalloutTone; title: string; body: string }
  | { kind: 'figure'; figure: Figure }
  // 設問例など、本文中の開閉式の問い（label 例: '設問例'。省略時は '確認'）。
  | { kind: 'check'; label?: string; items: CheckItem[] }

export interface FigureBase {
  id: string
  title: string
  caption: string // この図で何を見るか（1行）
  takeaway?: string // 誤解しない点（1行）
}

export type Figure =
  | PacketFlowFigure
  | OsiStackFigure
  | EncapFigure
  | AddressTableFigure
  | SequenceFigure
  | TimelineFigure
  | RecordTableFigure
  | SubnetCalcFigure
  | SegmentMapFigure

// 動くパケット図（中核）。トポロジ＋ステップ。ARP もこの型で表現する。
export interface PacketFlowFigure extends FigureBase {
  kind: 'packet-flow'
  topology: Topology
  steps: PacketStep[]
  // 学習表など、ステップに連動して埋まる小さな表（MACアドレステーブル等）。任意。
  sideTable?: {
    title: string
    columns: { key: string; label: string }[]
  }
  // L2/L3 ヘッダ表を出さない（構成の説明が主役で、ヘッダ詳細が不要な図）。
  hideHeaders?: boolean
}

export interface Topology {
  nodes: TopoNode[]
  links: TopoLink[]
  zones: TopoZone[]
  // 'chain'（既定・第1〜4章の一直線）／'graph'（links を使い、スイッチ＝幹・端末＝枝・冗長＝ループ・3ルータ三角形を描く）
  layout?: 'chain' | 'graph'
  // graph(三角形/縦積み)で、ルータ間リンクに添えるラベル（帯域・コスト等）。a/b は順不同。
  edgeLabels?: { a: string; b: string; label: string }[]
  // graph で縦積みレイアウト（spine を縦一列に並べ、最上段の端末は上・最下段の端末は下・中間段の端末は左右に枝分かれ）。
  stack?: boolean
  // graph で、ロールに関わらず葉（枝側）として扱うノードid（例: 第8章BGP図で境界ルータをISPの雲にぶら下げる）。
  leafIds?: string[]
  // graph で三方向FWレイアウト（spine を縦一列に並べ、最下段のノードから zone ごとに左右の列へ枝分かれ）。
  // 第9章 内部/DMZ/外部の三層境界。上=外部・下=内部の向き規約に従う。
  tiers?: boolean
  // chain で領域フォーカス表示にする（俯瞰＝ゾーン地図＋詳細＝現在ゾーンのノード）。スマホ幅で有効。
  zoneFocus?: boolean
  // graph で冗長ペア（VRRP）。上=共有先・中=2台の冗長ペア（左右）・下=端末の3段で描き、仮想IPを中央に固定表示する。
  pair?: boolean
  // pair のとき中央に固定表示する仮想IP（VRRPのVIP）。例: '192.168.10.1'
  vip?: string
  // graph でリンクアグリゲーション（LAG）。2台の機器間の複数リンクを近接した平行線＋点線ブラケットで1本の論理リンクとして描く。
  bundle?: boolean
  // bundle のブラケットに添える短い説明。例: '束ねて1本の論理リンク'
  bundleNote?: string
  // bundle の帯域表示（図の下段）。full＝全リンク時、reduced＝1本故障時。blockedLink が一致で自動的に切替わる。
  bundleBandwidth?: { full: string; reduced: string }
  // graph で拠点間トンネル（VPN）。2台の拠点ルータを横に置き、間を「暗号トンネルの帯」で結ぶ。端末は各ルータの下。
  tunnel?: boolean
  // tunnel の帯の上に出す見出し（例: 'IPsec暗号トンネル'）。
  tunnelNote?: string
}

export interface TopoNode {
  id: string
  label: string
  role: NodeRole
  zoneId?: string
  sub?: string // IP など
}

export interface TopoLink {
  a: string
  b: string
}

export interface TopoZone {
  id: string
  label: string
  tone: Tone
  sub?: string // 領域フォーカスの俯瞰に出すネットワークアドレス等
}

export type LayerStatus = 'change' | 'same' | 'strip'

export interface PacketStep {
  // 経路（リンク）を流れる、または機器（ノード）内の処理
  focus: { type: 'link'; a: string; b: string } | { type: 'node'; id: string }
  packetLabel: string
  headers: { l2: string; l3: string; l4?: string }
  // 各層がこのステップで「変わる／そのまま／外す」のどれか（カードで色分け表示）
  status?: { l2?: LayerStatus; l3?: LayerStatus; l4?: LayerStatus }
  // graph レイアウトで、このステップにおいてブロック中のリンク（STP の片ポート停止・経路の切断・FWの遮断）
  blockedLink?: { a: string; b: string }
  // FWなどノード処理ステップの判定。ノードフォーカス時、そのノード脇に通過/遮断チップを表示（第9章FW）。
  verdict?: 'pass' | 'block'
  // 停止中として灰色表示するノードid（第10章LBのヘルスチェック・第11章フェイルオーバー）。
  downNodes?: string[]
  // graph図（中央縦spine）で、パケットの宛先/送信元を図中に出す吹き出し。「宛先 X」「送信元 Y」形式・最大2。第9章。
  bubbles?: string[]
  // pair（VRRP）で、このステップに稼働中（アクティブ）のノードid。他方は待機中、downNodes にあれば故障として表示する。
  pairActive?: string
  // 領域フォーカス（zoneFocus）で、このステップの「現在ゾーン」。詳細側に表示するゾーンを明示する。
  zoneId?: string
  // sideTable をこのステップ時点までに埋まった状態にする（学習が進む表現）
  tableRows?: Record<string, string>[]
  tableHighlightRow?: number
  explanation: string
}

// OSI 7層（静的・該当層ハイライト）
export interface OsiStackFigure extends FigureBase {
  kind: 'osi-stack'
  layers: {
    label: string
    name: string
    desc: string
    example: string
    tone: Tone
    highlight?: boolean
  }[]
}

// カプセル化（フレーム⊃パケット⊃セグメント⊃データ のネストを一枚で見せる）
export interface EncapFigure extends FigureBase {
  kind: 'encap'
  dataLabel: string
  // 外側→内側の順。各層の「呼び名」と付くヘッダ（必要ならトレーラ）を持つ
  levels: {
    unit: string // 例: Ethernetフレーム
    layerLabel: string // 例: L2
    header: string // 例: L2ヘッダ（MAC）
    trailer?: string // 例: FCS
    tone: Tone
  }[]
}

// MAC/IP/ポート対応（スマホでは縦リフロー）
export interface AddressTableFigure extends FigureBase {
  kind: 'address-table'
  rows: {
    name: string
    layer: string
    carries: string
    scope: string
    example: string
    tone: Tone
  }[]
}

// シーケンス（ラダー）図: 2〜3者のやり取りを縦に。ハンドシェイク/要求応答/認証で使う。
// 全メッセージを描画し現在だけ強調するので、ステップしてもボタンは動かない。
export interface SequenceFigure extends FigureBase {
  kind: 'sequence'
  actors: { id: string; label: string; sub?: string; role?: NodeRole }[]
  messages: {
    from: string
    to: string
    label: string // 矢印に出す短いラベル
    note?: string // 現在ステップのとき下に出す補足（1〜2文）
    style?: 'normal' | 'broadcast'
  }[]
}

// 手順の俯瞰タイムライン（縦）。各項目「段階バッジ＋何を」。
export interface TimelineFigure extends FigureBase {
  kind: 'timeline'
  items: { badge: string; label: string; detail?: string; tone?: Tone }[]
}

// 規則／対応表（経路表・FWルール・NAT変換表・通信の見分け等）。スマホは1行=1カードに縦積み、PCは表。
export interface RecordTableFigure extends FigureBase {
  kind: 'record-table'
  columns: { key: string; label: string }[]
  rows: Record<string, string>[]
  highlightRow?: number // 強調する行（ロンゲストマッチの一致行など）
  rowHeader?: boolean // 先頭列を「カードの見出し」にする（スマホ）
  emphasizeKey?: string // この列の値を強調表示する（差分を目立たせる）
}

// サブネット（アドレス構造）。IPを10進＋2進で並べ、ネットワーク部=緑/ホスト部=グレーに色分け。
// steps でプレフィックスを変える（/24→/26→/27 で境界が動き、使えるホスト数が変わる）。
export interface SubnetCalcFigure extends FigureBase {
  kind: 'subnet-calc'
  ip: string // 例: '192.168.10.10'
  steps: { prefix: number; note: string }[]
}

// セグメント構成図（ルータが2つのネットワークをつなぐ）。各セグメントのホストIPから
// ネットワークアドレスをステップで導き、ルータの両端IP（GW）も図に書き込む。
export interface SegmentMapFigure extends FigureBase {
  kind: 'segment-map'
  routerLabel: string
  segments: { label: string; tone: Tone; nodeLabel: string; host: string; network: string; gw: string }[]
  // networks: ネットワークアドレスを表示するセグメント数。gateways: ルータ両端IPを表示。
  // highlight: 強調（0..segments-1=セグメント、segments.length=ルータ）。
  steps: { note: string; networks: number; gateways: boolean; highlight: number }[]
}
