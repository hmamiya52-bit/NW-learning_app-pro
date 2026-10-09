import { Link } from 'react-router-dom'
import { afternoonProblems } from '../../data/afternoonProblems'
import type { AfternoonProblem } from '../../data/afternoonProblems'
import { officialAnswers } from '../../data/officialAnswers'
import { getAfternoon1Explanation } from '../../data/afternoon1/explanations'
import { getAfternoon1QuestionTexts } from '../../data/afternoon1/questionTexts'
import { getAfternoon1ExamFigures } from '../../data/afternoon1/examFigures'

/**
 * 支援砲撃Ⅰの問題一覧（/afternoon1）
 *
 * 入口カードからここに来る。解説を入れた問だけを並べる。
 * 対象は午後Ⅰ（G1）のみ。午後Ⅱ（G2）は今回の対象外なので載せない。
 * 解説が未投入の問は一覧に出さない（/afternoon1/:id を直接開けば解答欄は使える）。
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

const ROWS = buildRows()
const READY = ROWS.filter((r) => r.hasExplanation)

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
              </div>
              <h1 className="text-sm font-black leading-snug">支援砲撃Ⅰ</h1>
            </div>
            <Link
              to="/"
              className="text-[11px] text-teal-300 hover:text-white transition-colors flex-shrink-0 mt-0.5"
            >
              ← ホーム
            </Link>
          </div>
        </section>

        <section className="bg-white rounded-xl border border-slate-200 px-4 py-4">
          <p className="text-center text-xl sm:text-2xl font-black text-red-600">
            ≪戦う理由は見つかったか？≫
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

      </div>
    </div>
  )
}
