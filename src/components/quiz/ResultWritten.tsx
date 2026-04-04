import type { Question } from '../../types'

interface Props {
  question: Question
  written: string
  onJudge: (isCorrect: boolean) => void
  isLast: boolean
}

export default function ResultWritten({ question, written, onJudge, isLast }: Props) {
  return (
    <div className="flex flex-col gap-5">
      {/* あなたの解答 */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">あなたの解答</p>
        <p className="text-base font-bold text-slate-800">{written || '（未入力）'}</p>
      </div>

      {/* 正解 */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-xs font-semibold text-blue-500 uppercase tracking-wider mb-1">正解</p>
        <p className="text-base font-bold text-blue-900">{question.correctAnswer}</p>
      </div>

      {/* 解説 */}
      <div className="bg-white border border-slate-200 rounded-xl p-4">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">解説</p>
        <p className="text-sm text-slate-700 leading-relaxed">{question.explanation}</p>
      </div>

      {/* 自己判定 */}
      <div>
        <p className="text-sm font-semibold text-slate-600 text-center mb-3">
          正解でしたか？ 自分で判定してください
        </p>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onJudge(true)}
            className="bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-bold rounded-xl py-4 text-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
          >
            ⭕ 正解
          </button>
          <button
            onClick={() => onJudge(false)}
            className="bg-red-500 hover:bg-red-600 active:bg-red-700 text-white font-bold rounded-xl py-4 text-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
          >
            ❌ 不正解
          </button>
        </div>
        <p className="text-xs text-slate-400 text-center mt-2">
          表記が異なっても意味が合っていれば正解にしてOK
        </p>
        <p className="text-xs text-slate-400 text-center mt-0.5">
          判定後、{isLast ? '結果画面' : '次の問題'}に進みます
        </p>
      </div>
    </div>
  )
}
