// 午後Ⅰ 独自解説（Claude 著作）
//
// IPA 公式「解答例」(src/data/officialAnswers.ts) には解説が無いため、問題本文 PDF を
// 精読して根拠付きの独自解説を付与する。IPA 引用データとは分離し、そちらは汚染しない。
// 執筆ルール: docs/afternoon1_authoring_rules.md
//
// 著作権: 問題本文の逐語引用は禁止。basis は位置参照＋言い換えに留める。
//        （公式設問文だけは原文転記が目的なので questionTexts/ 側に置く）

import type { Afternoon1FigureId } from './figureIds'

/** 解答行ごとの解説（officialAnswers の AnswerRow と rowKey で 1:1 対応） */
export interface Afternoon1RowExplanation {
  /** `${s}|${q ?? ''}|${t ?? ''}` で officialAnswers の行と対応 */
  rowKey: string
  /**
   * この設問が問う力点（30-60字目安）。
   * 用語・数値の穴埋め行では省略してよい（記述式 essay:true の行では必須）。
   */
  point?: string
  /** 本文中の根拠（位置参照＋言い換え。逐語引用しない。40-90字目安） */
  basis: string
  /** なぜこの解答例になるか（60-120字目安） */
  reasoning: string
  /**
   * この行を解くのに要る技術知識（40-80字目安）。
   * NW は「本文の記述」＋「プロトコルの仕様知識」の二本立てで根拠が立つ行が大半のため、
   * basis（本文側）と分けて持つ。
   */
  knowledge?: string
  /** ありがちな失点・誤答パターン（難所のみ任意。40-80字目安） */
  pitfall?: string
}

/** 設問ごとの詳細解説（詳細解説ページ用。深掘り学習向け） */
export interface Afternoon1QuestionDetail {
  /** `${s}|${q ?? ''}|${t ?? ''}` で officialAnswers の行と対応 */
  rowKey: string
  /** 表示用の設問見出し（例「設問1(1)」） */
  heading: string
  /** この設問が問うていること（要約。公式の設問文そのものは questionTexts/ にある） */
  asked: string
  /** 解答に至る考え方のプロセス（ステップ列） */
  thinkingProcess: string[]
  /** 解答例（officialAnswers と一致。説明のため再掲。複数解答は ／ 連結） */
  modelAnswer: string
  /** 詳細解説（根拠・なぜその解答か・部分点や失点の機微） */
  commentary: string
}

/** その問題で習得すべき知識（用語＋説明） */
export interface Afternoon1KeyKnowledge {
  term: string
  description: string
}

/** 問題文をセクション単位で解説する1ブロック */
export interface Afternoon1ProblemSection {
  /** 本文のセクション名（例「〔現状の配信方式〕」） */
  heading: string
  /** そのセクションの解説（==赤==/__navy__ 可・段落区切りは \n）。末尾に設問との対応を書く */
  body: string
}

/** 比較表の1行（観点＋各列の値） */
export interface Afternoon1CompareRow {
  /** 観点（左端の見出し列。MarkupText 可） */
  label: string
  /** 各列の値（columns[1..] に対応。MarkupText 可） */
  cells: string[]
}

/**
 * 図表。詳細解説ページの problemSections の後に表示する。
 *   compare … 3列までの比較表（対比の整理用。自作）
 *   exam    … 試験問題の図表を自作 SVG で再現したもの（figureIds.ts の id で参照）
 */
export type Afternoon1Figure =
  | {
      kind: 'compare'
      /** 図表タイトル */
      title: string
      /** 補足（表の下に小さく表示。MarkupText 可） */
      note?: string
      /** 列見出し。columns[0] は観点列の見出し（例「観点」「段階」） */
      columns: string[]
      /** 行（観点＋各列の値） */
      rows: Afternoon1CompareRow[]
      /** 強調する列の index（columns 基準。例 [2] でその列を色付け） */
      highlightCols?: number[]
    }
  | {
      kind: 'exam'
      /** 図表タイトル（原図の図題に合わせる。例「図1 D社データセンターの構成（抜粋）」） */
      title: string
      /** 描画コンポーネントの id */
      figureId: Afternoon1FigureId
      /** 補足（図の下に小さく表示。MarkupText 可） */
      note?: string
    }

/** 詳細解説（深掘りページ用。任意。未投入なら詳細ページは「準備中」） */
export interface Afternoon1DetailedExplanation {
  /** 問題文をセクションごとに紐解く解説 */
  problemSections: Afternoon1ProblemSection[]
  /** 図表。任意。problemSections の後・設問別解説の前に表示 */
  figures?: Afternoon1Figure[]
  /** 各設問の詳細解説＋考え方のプロセス */
  questionDetails: Afternoon1QuestionDetail[]
  /** この問題で習得すべき知識（4-6件） */
  keyKnowledge: Afternoon1KeyKnowledge[]
  /** 応用できる解法の型（ほかの問にも転用できる汎用テクニック。3件前後。MarkupText 可） */
  solvingTips?: string[]
}

/**
 * 1問分の解説（officialAnswers の 1 OfficialAnswerSet に対応）。
 * 試験問題の図表そのものは「解く側の材料」なので examFigures.ts に分けてある。
 */
export interface Afternoon1Explanation {
  /** officialAnswers.id と一致（例 'R6-G1-1'） */
  id: string
  /** 問題全体の趣旨（状況 → ぶつかる難所 → 何が問われるか。100-200字目安） */
  overview: string
  /** 行ごとの解説（officialAnswers.answers と rowKey で 1:1） */
  rows: Afternoon1RowExplanation[]
  /** 詳細解説（任意） */
  detail?: Afternoon1DetailedExplanation
}

/**
 * 午後Ⅰ 独自解説マップ。
 * 未投入の id は undefined → UI は「解説準備中」フォールバック（段階投入を許容）。
 * 投入順: R6-G1-1 の1問を書き切ってから次を考える。
 */
export const afternoon1Explanations: Record<string, Afternoon1Explanation> = {
  // ─── R6 午後Ⅰ 問1：コンテンツ配信ネットワーク ────────────────
  // （P2 で投入）
}

/** officialAnswers の AnswerRow から rowKey を作る */
export function makeRowKey(s: string, q?: string, t?: string): string {
  return `${s}|${q ?? ''}|${t ?? ''}`
}

/** 指定問題の解説を返す（未投入なら undefined） */
export function getAfternoon1Explanation(id: string): Afternoon1Explanation | undefined {
  return afternoon1Explanations[id]
}
