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
}

export interface Topology {
  nodes: TopoNode[]
  links: TopoLink[]
  zones: TopoZone[]
  // 'chain'（既定・第1〜4章の一直線）／'graph'（links を使い、スイッチ＝幹・端末＝枝・冗長＝ループを描く）
  layout?: 'chain' | 'graph'
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
}

export type LayerStatus = 'change' | 'same' | 'strip'

export interface PacketStep {
  // 経路（リンク）を流れる、または機器（ノード）内の処理
  focus: { type: 'link'; a: string; b: string } | { type: 'node'; id: string }
  packetLabel: string
  headers: { l2: string; l3: string; l4?: string }
  // 各層がこのステップで「変わる／そのまま／外す」のどれか（カードで色分け表示）
  status?: { l2?: LayerStatus; l3?: LayerStatus; l4?: LayerStatus }
  // graph レイアウトで、このステップにおいてブロック中の冗長リンク（STP の片ポート停止）
  blockedLink?: { a: string; b: string }
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
