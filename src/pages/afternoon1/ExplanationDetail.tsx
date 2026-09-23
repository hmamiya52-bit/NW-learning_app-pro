import { useParams, Link } from 'react-router-dom'
import { officialAnswers } from '../../data/officialAnswers'
import { afternoonProblems } from '../../data/afternoonProblems'
import { getAfternoon1Explanation } from '../../data/afternoon1/explanations'
import { getAfternoon1ExamFigures } from '../../data/afternoon1/examFigures'
import { MarkupText } from '../../components/afternoon1/MarkupText'
import {
  Afternoon1FigureColorKey,
  Afternoon1FigureView,
} from '../../components/afternoon1/AfternoonFigure'

/**
 * 午後Ⅰ 詳細解説ページ（/afternoon1/:id/explanation）
 *
 * 解答欄の答え合わせ（checkMode）に出る行解説より深く、問題文のセクション別解説・
 * 図表・設問ごとの考え方のプロセス・習得すべき知識・解法の型をまとめる。
 * データ: afternoon1Explanations[id].detail（未投入なら「準備中」フォールバック）
 */
export default function Afternoon1ExplanationDetail() {
  const { id } = useParams<{ id: string }>()

  const answerSet = id ? officialAnswers.find((a) => a.id === id) : undefined
  const problem = answerSet ? afternoonProblems.find((p) => p.id === answerSet.id) : undefined
  const explanation = id ? getAfternoon1Explanation(id) : undefined
  const detail = explanation?.detail
  const examFigures = id ? getAfternoon1ExamFigures(id) : []

  if (!answerSet || !id) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: '#f8fafc' }}
      >
        <div className="text-center space-y-3">
          <p className="text-slate-500">問題が見つかりません</p>
          <Link to="/afternoon1" className="text-teal-600 text-sm hover:underline">
            ← 問題一覧に戻る
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8fafc' }}>
      <div className="max-w-3xl mx-auto px-4 pb-16 pt-4 space-y-4">

        {/* Header */}
        <section>
          <div className="rounded-xl bg-indigo-700 text-white px-4 py-3 shadow-md flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-bold bg-indigo-500 rounded-full px-2 py-0.5 flex-shrink-0">
                  {answerSet.year}
                </span>
                <span className="text-[11px] font-bold rounded-full px-2 py-0.5 flex-shrink-0 bg-white text-indigo-800">
                  午後Ⅰ 問{answerSet.number}
                </span>
                <span className="text-[11px] font-bold rounded-full px-2 py-0.5 flex-shrink-0 bg-amber-400 text-amber-900">
                  詳細解説
                </span>
              </div>
              <h1 className="text-sm font-black leading-snug">{problem?.title ?? '詳細解説'}</h1>
            </div>
            <Link
              to={`/afternoon1/${id}`}
              className="text-[11px] text-indigo-300 hover:text-white transition-colors flex-shrink-0 mt-0.5"
            >
              ← 戻る
            </Link>
          </div>
        </section>

        {/* Action links */}
        <div className="flex flex-wrap gap-2 justify-end">
          {problem?.questionPdfUrl && (
            <a
              href={problem.questionPdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-slate-600 border border-slate-300 rounded-lg px-3 py-1.5 hover:bg-slate-50 transition-colors"
            >
              問題文PDFを開く
            </a>
          )}
          <Link
            to={`/afternoon1/${id}/answer?check=1`}
            className="text-xs font-bold text-teal-600 border border-teal-300 rounded-lg px-3 py-1.5 hover:bg-teal-50 transition-colors"
          >
            解答欄に戻る
          </Link>
        </div>

        {!detail ? (
          /* フォールバック: 詳細解説未投入 */
          <div className="bg-white rounded-xl border border-slate-200 px-4 py-8 text-center space-y-3">
            <p className="text-slate-500 text-sm">この問題の詳細解説は準備中です。</p>
            <p className="text-slate-400 text-xs">
              解答欄では、解答例と配点による自己採点をご利用いただけます。
            </p>
            <Link
              to={`/afternoon1/${id}/answer`}
              className="inline-block text-xs font-bold text-teal-600 border border-teal-300 rounded-lg px-4 py-2 hover:bg-teal-50 transition-colors"
            >
              解答欄で練習する →
            </Link>
          </div>
        ) : (
          <>
            {/* 問題文の解説（本文のセクションごとに紐解く） */}
            <section className="bg-white rounded-xl border border-slate-200 px-4 py-4">
              <h2 className="text-sm font-black text-teal-800 mb-3 flex items-center gap-2">
                <span className="inline-block w-1.5 h-4 bg-teal-500 rounded-full" />
                問題文の解説
              </h2>
              <div className="space-y-4">
                {detail.problemSections.map((sec, i) => (
                  <div key={i} className={i > 0 ? 'pt-3 border-t border-slate-100' : ''}>
                    <p className="text-[13px] font-bold text-indigo-800 mb-1">{sec.heading}</p>
                    <p className="text-[13px] leading-relaxed text-slate-700 whitespace-pre-wrap">
                      <MarkupText text={sec.body} />
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* 問題中の図表（自作 SVG での再現） */}
            {examFigures.length > 0 && (
              <section className="bg-white rounded-xl border border-slate-200 px-4 py-4">
                <h2 className="text-sm font-black text-teal-800 mb-3 flex items-center gap-2">
                  <span className="inline-block w-1.5 h-4 bg-teal-500 rounded-full" />
                  問題中の図表
                </h2>
                <div className="mb-3">
                  <Afternoon1FigureColorKey />
                </div>
                <div className="space-y-3">
                  {examFigures.map((fig, i) => (
                    <Afternoon1FigureView key={i} figure={fig} />
                  ))}
                </div>
              </section>
            )}

            {/* 図解で整理（比較表など） */}
            {detail.figures && detail.figures.length > 0 && (
              <section className="bg-white rounded-xl border border-slate-200 px-4 py-4">
                <h2 className="text-sm font-black text-teal-800 mb-3 flex items-center gap-2">
                  <span className="inline-block w-1.5 h-4 bg-teal-500 rounded-full" />
                  図解で整理
                </h2>
                <div className="space-y-3">
                  {detail.figures.map((fig, i) => (
                    <Afternoon1FigureView key={i} figure={fig} />
                  ))}
                </div>
              </section>
            )}

            {/* 設問別 詳細解説 */}
            <section className="space-y-3">
              <h2 className="text-sm font-black text-teal-800 flex items-center gap-2 px-1">
                <span className="inline-block w-1.5 h-4 bg-teal-500 rounded-full" />
                設問別 詳細解説
              </h2>
              {detail.questionDetails.map((qd) => (
                <div
                  key={qd.rowKey}
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden"
                >
                  <div className="bg-indigo-50 px-4 py-2 border-b border-indigo-100">
                    <p className="text-xs font-black text-indigo-800">{qd.heading}</p>
                    <p className="text-[12px] text-slate-600 leading-snug mt-0.5">
                      <MarkupText text={qd.asked} />
                    </p>
                  </div>
                  <div className="px-4 py-3 space-y-3">
                    {/* 考え方のプロセス */}
                    <div>
                      <p className="text-[11px] font-bold text-slate-500 mb-1">考え方のプロセス</p>
                      <ol className="space-y-1">
                        {qd.thinkingProcess.map((step, i) => (
                          <li
                            key={i}
                            className="flex gap-2 text-[12px] leading-relaxed text-slate-700"
                          >
                            <span className="flex-shrink-0 w-4 h-4 mt-0.5 rounded-full bg-teal-100 text-teal-700 text-[10px] font-bold flex items-center justify-center">
                              {i + 1}
                            </span>
                            <span>
                              <MarkupText text={step} />
                            </span>
                          </li>
                        ))}
                      </ol>
                    </div>
                    {/* 解答例 */}
                    <div className="rounded-md bg-emerald-50 border border-emerald-200 px-3 py-2">
                      <p className="text-[10px] font-bold text-emerald-600 mb-0.5">解答例</p>
                      <p className="text-[12px] text-emerald-900 leading-relaxed whitespace-pre-wrap">
                        {qd.modelAnswer}
                      </p>
                    </div>
                    {/* 詳細解説 */}
                    <div>
                      <p className="text-[11px] font-bold text-slate-500 mb-1">解説</p>
                      <p className="text-[12px] leading-relaxed text-slate-700">
                        <MarkupText text={qd.commentary} />
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </section>

            {/* 習得すべき知識 */}
            <section className="bg-white rounded-xl border border-slate-200 px-4 py-4">
              <h2 className="text-sm font-black text-teal-800 mb-3 flex items-center gap-2">
                <span className="inline-block w-1.5 h-4 bg-teal-500 rounded-full" />
                この問題で習得すべき知識
              </h2>
              <ul className="space-y-2.5">
                {detail.keyKnowledge.map((k, i) => (
                  <li key={i} className="border-l-2 border-teal-200 pl-3">
                    <p className="text-[12px] font-bold text-slate-800">{k.term}</p>
                    <p className="text-[12px] leading-relaxed text-slate-600 mt-0.5">
                      <MarkupText text={k.description} />
                    </p>
                  </li>
                ))}
              </ul>
            </section>

            {/* 応用できる解法の型 */}
            {detail.solvingTips && detail.solvingTips.length > 0 && (
              <section className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-4">
                <h2 className="text-sm font-black text-amber-800 mb-1">応用できる解法の型</h2>
                <p className="text-[11px] text-amber-700/80 mb-3">
                  この問題で使った、ほかの午後Ⅰにも転用できる解き方のコツ。
                </p>
                <ul className="space-y-2">
                  {detail.solvingTips.map((tip, i) => (
                    <li key={i} className="flex gap-2 text-[12px] leading-relaxed text-slate-700">
                      <span className="flex-shrink-0 text-amber-500 font-black">✓</span>
                      <span>
                        <MarkupText text={tip} />
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </>
        )}

        {/* 入口へ戻る */}
        <div className="flex justify-center pt-2">
          <Link
            to={`/afternoon1/${id}`}
            className="text-xs text-slate-400 hover:text-teal-600 border border-slate-200 rounded-lg px-4 py-2 hover:border-teal-300 transition-colors"
          >
            ← この問題のトップへ戻る
          </Link>
        </div>

        <p className="text-[10px] text-slate-400 text-center leading-relaxed">
          解説は本アプリの独自著作です。問題文・公式解答例は © 独立行政法人情報処理推進機構（IPA）<br />
          {answerSet.year} ネットワークスペシャリスト試験 午後Ⅰ 問{answerSet.number}
        </p>

      </div>
    </div>
  )
}
