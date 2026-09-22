import { useParams, Link } from 'react-router-dom'
import { officialAnswers } from '../../data/officialAnswers'
import { afternoonProblems } from '../../data/afternoonProblems'
import { getAfternoon1Explanation } from '../../data/afternoon1/explanations'
import { getAfternoon1QuestionTexts } from '../../data/afternoon1/questionTexts'

/**
 * 午後Ⅰ解説（開発中）の入口ページ（/afternoon1/:id）
 *
 * この問1問の入口。問題本文は PDF で読む前提なので、PDF へのリンクを最初に置き、
 * そのうえで解答欄・詳細解説への導線を出す。
 * 既存の /afternoon 動線とは独立していて、記録（XP・バッジ・演習記録）は一切持たない。
 */
export default function Afternoon1Entry() {
  const { id } = useParams<{ id: string }>()

  const answerSet = id ? officialAnswers.find((a) => a.id === id) : undefined
  const problem = answerSet ? afternoonProblems.find((p) => p.id === answerSet.id) : undefined
  const explanation = id ? getAfternoon1Explanation(id) : undefined
  const questionTexts = id ? getAfternoon1QuestionTexts(id) : {}

  if (!answerSet || !id) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f8fafc' }}>
        <div className="text-center space-y-3">
          <p className="text-slate-500">問題が見つかりません</p>
          <Link to="/" className="text-teal-600 text-sm hover:underline">← ホームに戻る</Link>
        </div>
      </div>
    )
  }

  const rowCount = answerSet.answers.length
  const essayCount = answerSet.answers.filter((a) => a.essay).length
  const questionTextCount = Object.keys(questionTexts).length

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8fafc' }}>
      <div className="max-w-3xl mx-auto px-4 pb-16 pt-4 space-y-4">

        {/* Header */}
        <section>
          <div className="rounded-xl bg-teal-700 text-white px-4 py-3 shadow-md flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-bold bg-teal-500 rounded-full px-2 py-0.5 flex-shrink-0">
                  {answerSet.year}
                </span>
                <span className="text-[11px] font-bold rounded-full px-2 py-0.5 flex-shrink-0 bg-white text-teal-800">
                  午後Ⅰ 問{answerSet.number}
                </span>
                <span className="text-[11px] font-bold rounded-full px-2 py-0.5 flex-shrink-0 bg-amber-400 text-amber-900">
                  開発中
                </span>
              </div>
              <h1 className="text-sm font-black leading-snug">{problem?.title ?? '午後解説'}</h1>
            </div>
            <Link
              to="/"
              className="text-[11px] text-teal-300 hover:text-white transition-colors flex-shrink-0 mt-0.5"
            >
              ← 戻る
            </Link>
          </div>
        </section>

        {/* 進め方 */}
        <section className="bg-white rounded-xl border border-slate-200 px-4 py-4 space-y-3">
          <h2 className="text-sm font-black text-teal-800 flex items-center gap-2">
            <span className="inline-block w-1.5 h-4 bg-teal-500 rounded-full" />
            進め方
          </h2>
          <ol className="space-y-2">
            {[
              '問題文 PDF を開いて本文を読む（本文はアプリ内に載せていません）',
              '解答欄に記入する。各行の折り畳みで公式の設問文と図表を確認できます',
              '「答え合わせ」で解答例・行ごとの解説・自己採点が出ます',
              'さらに深く復習したいときは詳細解説ページへ',
            ].map((step, i) => (
              <li key={i} className="flex gap-2 text-[12px] leading-relaxed text-slate-700">
                <span className="flex-shrink-0 w-4 h-4 mt-0.5 rounded-full bg-teal-100 text-teal-700 text-[10px] font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
          <p className="text-[11px] text-slate-400 leading-relaxed border-t border-slate-100 pt-2">
            この画面の演習は記録に残りません（XP・バッジ・演習記録は付きません）。
            書きかけの解答だけ、この端末に一時保存されます。
          </p>
        </section>

        {/* 問題PDF */}
        {problem?.questionPdfUrl && (
          <a
            href={problem.questionPdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between gap-2 bg-white rounded-xl border-2 border-teal-300 px-4 py-3 hover:bg-teal-50 transition-colors"
          >
            <div className="min-w-0">
              <p className="text-[13px] font-black text-teal-800">問題文 PDF を開く</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                本文（プロローグ・〔 〕節）はこちらで読みます
              </p>
            </div>
            <span className="text-teal-600 font-black flex-shrink-0">↗</span>
          </a>
        )}

        {/* 解答欄 */}
        <Link
          to={`/afternoon1/${id}/answer`}
          className="flex items-center justify-between gap-2 bg-teal-700 text-white rounded-xl px-4 py-3 hover:bg-teal-800 transition-colors shadow-md"
        >
          <div className="min-w-0">
            <p className="text-[13px] font-black">解答欄へ</p>
            <p className="text-[11px] text-teal-100 mt-0.5">
              全{rowCount}行（うち記述式{essayCount}行）
              {questionTextCount > 0 ? '・公式の設問文つき' : ''}
            </p>
          </div>
          <span className="font-black flex-shrink-0">→</span>
        </Link>

        {/* 詳細解説 */}
        <Link
          to={`/afternoon1/${id}/explanation`}
          className="flex items-center justify-between gap-2 bg-white rounded-xl border border-slate-200 px-4 py-3 hover:border-amber-300 hover:bg-amber-50 transition-colors"
        >
          <div className="min-w-0">
            <p className="text-[13px] font-black text-amber-800">詳細解説ページ</p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {explanation?.detail
                ? '問題文の解説・図表・設問別の考え方・習得すべき知識'
                : '準備中です'}
            </p>
          </div>
          <span className="text-amber-600 font-black flex-shrink-0">→</span>
        </Link>

        {/* 公式解答例の既存ページ（参考） */}
        <div className="flex justify-center pt-2">
          <Link
            to="/"
            className="text-xs text-slate-400 hover:text-teal-600 border border-slate-200 rounded-lg px-4 py-2 hover:border-teal-300 transition-colors"
          >
            ← ホームへ戻る
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
