import { Link } from 'react-router-dom'
import { afternoonProblems } from '../../data/afternoonProblems'
import type { AfternoonProblem } from '../../data/afternoonProblems'
import { officialAnswers } from '../../data/officialAnswers'
import { getAfternoon1Explanation } from '../../data/afternoon1/explanations'
import { getAfternoon1QuestionTexts } from '../../data/afternoon1/questionTexts'
import { getAfternoon1ExamFigures } from '../../data/afternoon1/examFigures'

/**
 * 午後解説（開発中）の問題一覧（/afternoon1）
 *
 * 入口カードからここに来る。解説を入れた問を上に出し、残りは年度ごとに並べる。
 * 対象は午後Ⅰ（G1）のみ。午後Ⅱ（G2）は今回の対象外なので載せない。
 *
 * 解説が未投入の問も開ける。設問文と図表は出ないが、公式解答例と配点による
 * 自己採点は使えるので、PDF を見ながらの演習には足りる。
 */

interface Row {
  problem: AfternoonProblem
  rowCount: number
  hasExplanation: boolean
  hasQuestionTexts: boolean
  hasFigures: boolean
}

/** 元データはすべて静的なので、モジュール読み込み時に1回だけ組み立てる */
function buildRows(): Row[] {
  return afternoonProblems
    .filter((p) => p.section === 'G1')
    .map((problem) => {
      const answerSet = officialAnswers.find((a) => a.id === problem.id)
      return {
        problem,
        rowCount: answerSet?.answers.length ?? 0,
        hasExplanation: !!getAfternoon1Explanation(problem.id),
        hasQuestionTexts: Object.keys(getAfternoon1QuestionTexts(problem.id)).length > 0,
        hasFigures: getAfternoon1ExamFigures(problem.id).length > 0,
      }
    })
}

/** 年度ごとにまとめて、新しい年度が先に来るようにする */
function groupByYear(rows: Row[]) {
  const order: string[] = []
  const map = new Map<string, Row[]>()
  for (const row of rows) {
    const y = row.problem.year
    if (!map.has(y)) {
      map.set(y, [])
      order.push(y)
    }
    map.get(y)!.push(row)
  }
  return order
    .reverse()
    .map((year) => ({ year, label: map.get(year)![0].problem.yearLabel, rows: map.get(year)! }))
}

function ReadyCard({ row }: { row: Row }) {
  const { problem, rowCount } = row
  return (
    <Link
      to={`/afternoon1/${problem.id}`}
      className="block rounded-xl border-2 border-teal-300 bg-white px-4 py-3 hover:bg-teal-50 transition-colors"
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="text-[11px] font-bold bg-teal-700 text-white rounded-full px-2 py-0.5 flex-shrink-0">
          {problem.year}
        </span>
        <span className="text-[11px] font-bold text-teal-800">午後Ⅰ 問{problem.number}</span>
        <span className="ml-auto text-[11px] font-bold text-teal-600 flex-shrink-0">→</span>
      </div>
      <p className="text-[13px] font-black text-slate-800 leading-snug">{problem.title}</p>
      <p className="text-[11px] text-slate-500 mt-1">
        全{rowCount}行 ・ 設問文 ・ 図表 ・ 解説
      </p>
      {problem.keywords.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1.5">
          {problem.keywords.map((k) => (
            <span
              key={k}
              className="text-[10px] text-teal-700 bg-teal-50 border border-teal-200 rounded px-1.5 py-0.5"
            >
              {k}
            </span>
          ))}
        </div>
      )}
    </Link>
  )
}

function PendingRow({ row }: { row: Row }) {
  const { problem, rowCount } = row
  return (
    <Link
      to={`/afternoon1/${problem.id}`}
      className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 transition-colors"
    >
      <span className="text-[11px] font-bold text-slate-400 w-10 flex-shrink-0">
        問{problem.number}
      </span>
      <span className="text-[12px] text-slate-700 leading-snug flex-1 min-w-0">{problem.title}</span>
      <span className="text-[10px] text-slate-400 flex-shrink-0">{rowCount}行</span>
      <span className="text-[10px] text-slate-400 flex-shrink-0">›</span>
    </Link>
  )
}

const ROWS = buildRows()
const READY = ROWS.filter((r) => r.hasExplanation)
const PENDING_BY_YEAR = groupByYear(ROWS.filter((r) => !r.hasExplanation))

export default function Afternoon1ProblemList() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8fafc' }}>
      <div className="max-w-3xl mx-auto px-4 pb-16 pt-4 space-y-4">

        {/* Header */}
        <section>
          <div className="rounded-xl bg-teal-700 text-white px-4 py-3 shadow-md flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-bold rounded-full px-2 py-0.5 flex-shrink-0 bg-white text-teal-800">
                  午後Ⅰ
                </span>
                <span className="text-[11px] font-bold rounded-full px-2 py-0.5 flex-shrink-0 bg-amber-400 text-amber-900">
                  開発中
                </span>
              </div>
              <h1 className="text-sm font-black leading-snug">午後解説</h1>
            </div>
            <Link
              to="/"
              className="text-[11px] text-teal-300 hover:text-white transition-colors flex-shrink-0 mt-0.5"
            >
              ← ホーム
            </Link>
          </div>
        </section>

        {/* この画面の説明 */}
        <section className="bg-white rounded-xl border border-slate-200 px-4 py-3">
          <p className="text-[12px] leading-relaxed text-slate-700">
            公式の設問文と図表を画面に載せ、答え合わせのあとに解説が出る演習です。
            問題本文は PDF で読みます。
          </p>
          <p className="text-[11px] text-slate-400 leading-relaxed mt-1.5">
            解説あり {READY.length} 問 / 午後Ⅰ 全 {ROWS.length} 問。
            この画面の演習は記録に残りません（XP・バッジ・演習記録は付きません）。
          </p>
        </section>

        {/* 解説あり */}
        {READY.length > 0 && (
          <section className="space-y-2">
            <h2 className="text-sm font-black text-teal-800 flex items-center gap-2 px-1">
              <span className="inline-block w-1.5 h-4 bg-teal-500 rounded-full" />
              解説あり
            </h2>
            {READY.map((row) => (
              <ReadyCard key={row.problem.id} row={row} />
            ))}
          </section>
        )}

        {/* 準備中 */}
        <section className="space-y-2">
          <h2 className="text-sm font-black text-slate-500 flex items-center gap-2 px-1">
            <span className="inline-block w-1.5 h-4 bg-slate-300 rounded-full" />
            解説はこれから
          </h2>
          <p className="text-[11px] text-slate-400 px-1 leading-relaxed">
            設問文と図表はまだ入っていませんが、解答欄は使えます（公式解答例と配点による自己採点）。
          </p>
          {PENDING_BY_YEAR.map((group) => (
            <div key={group.year} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <p className="text-[11px] font-bold text-slate-500 bg-slate-50 px-3 py-1.5 border-b border-slate-200">
                {group.label}
              </p>
              <div className="divide-y divide-slate-100">
                {group.rows.map((row) => (
                  <PendingRow key={row.problem.id} row={row} />
                ))}
              </div>
            </div>
          ))}
        </section>

        <p className="text-[10px] text-slate-400 text-center leading-relaxed pt-2">
          午後Ⅱ（問題文がさらに長い区分）は、この画面の対象外です。<br />
          解説は本アプリの独自著作です。問題文・公式解答例は © 独立行政法人情報処理推進機構（IPA）
        </p>

      </div>
    </div>
  )
}
