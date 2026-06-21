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

// 動くパケット図（中核）。トポロジ＋ステップ。ARP もこの型で表現する。
export interface PacketFlowFigure extends FigureBase {
  kind: 'packet-flow'
  topology: Topology
  steps: PacketStep[]
}

export interface Topology {
  nodes: TopoNode[]
  links: TopoLink[]
  zones: TopoZone[]
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

export interface PacketStep {
  // 経路（リンク）を流れる、または機器（ノード）内の処理
  focus: { type: 'link'; a: string; b: string } | { type: 'node'; id: string }
  packetLabel: string
  headers: { l2: string; l3: string; l4?: string }
  concept?: { l2?: string; l3?: string; l4?: string } // 「区間ごとに変わる」等のタグ
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

// カプセル化（ヘッダが順に付く・ステップ式）
export interface EncapFigure extends FigureBase {
  kind: 'encap'
  steps: {
    label: string
    title: string
    desc: string
    parts: { label: string; tone: Tone }[]
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
