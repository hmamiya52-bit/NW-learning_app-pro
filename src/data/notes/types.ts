// ノートモードのデータ型

export interface ProtocolEntry {
  name: string
  transport: string
  ports: string
}

// 強調トークン（記号マークアップ廃止のための構造化データ）
export type EmphasisStyle = 'red' | 'navy' | 'plain'
export interface EmphasisToken {
  text: string
  style: EmphasisStyle
}

// 復習ノート準拠のリッチプロトコル
export interface RichProtocolEntry {
  name: string
  nameStyle?: EmphasisStyle      // プロトコル名の強調（既定 plain）
  layer?: string                 // "レイヤ2" / "レイヤ3" / "レイヤ4" 等（下位レイヤ表用）。数字部分のみ赤字化される
  portTokens?: EmphasisToken[]   // ポート番号トークン（上位レイヤ表用）
  description: EmphasisToken[]   // 説明文（強調混在）
}

export interface RichProtocolTable {
  heading: string                // テーブル見出し
  hasPort: boolean               // ポート列を表示するか
  rows: RichProtocolEntry[]
}

// ヘッダ構成図（HTML表＋色分け＋赤字隠し対応）
export interface HeaderDiagramCell {
  label: string
  span?: number          // colspan（既定 1）
  bg?: string            // 背景色（CSS color string）
  isRed?: boolean        // ラベルを赤字＋マスク対象にする
  maskDigits?: boolean   // ラベル内の数字だけ赤字＋マスク対象（記号や単位は残す）
  small?: boolean        // 小さめのフォント
}
export interface HeaderDiagramRow {
  cells: HeaderDiagramCell[]
}
export interface HeaderDiagram {
  title: string
  rows: HeaderDiagramRow[]
  caption?: string       // 図の下に表示する補足
  totalCols?: number     // テーブルの列数（colspan 計算用）
}

export interface NoteSection {
  heading: string
  items?: string[]
  protocols?: ProtocolEntry[]
  richProtocolTables?: RichProtocolTable[]   // 復習ノート準拠のプロトコル表
  richItems?: EmphasisToken[][]              // 構造化された箇条書き（赤・ネイビー混在可）
  headerDiagrams?: HeaderDiagram[]           // ヘッダ構成図（HTML表）
  navyItems?: EmphasisToken[][]              // ネイビー強調のみで残す既存項目（各セクション末尾）
}

export interface NoteData {
  summary: string
  sections: NoteSection[]
  exam_tips: string[]
}
