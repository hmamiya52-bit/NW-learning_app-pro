// 午後Ⅰ 公式設問文（IPA 原文引用）の型
//
// 出典：独立行政法人情報処理推進機構（IPA）公開の情報処理技術者試験
//       ネットワークスペシャリスト試験 午後Ⅰ 問題
//       https://www.ipa.go.jp/shiken/mondai-kaiotu/index.html
//
// 解説側の questionDetails.asked は本アプリが書いた「要約」であり、公式の設問文とは
// 文言も字数条件も違う。設問文そのものは本ディレクトリに IPA 原文のまま収める。
// 改変・要約はしない（要約は asked の役割）。
//
// 転記手順: 公式問題 PDF は画像スキャンでテキスト抽出できないため、ページを画像化して
//          目視で転記する。年度ごとに 1 ファイル。
// 検証: npm run validate-data（解答行との rowKey 突合）

/** 1 つの解答行に対応する公式設問文 */
export interface Afternoon1QuestionText {
  /** `${s}|${q ?? ''}|${t ?? ''}` で officialAnswers の行と対応 */
  rowKey: string
  /** 表示用の見出し（例「設問1(1)」） */
  heading: string
  /** 親設問の導入文（例「〔現状の配信方式〕について答えよ。」）。小問が無い設問では省略 */
  lead?: string
  /** 公式の設問文（原文のまま。改変しない） */
  text: string
}

/** 年度ファイルが公開する形（問題 id → 設問文の配列） */
export type Afternoon1QuestionTextSet = Record<string, Afternoon1QuestionText[]>
