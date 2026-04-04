type AnswerMode = 'multiple-choice' | 'written'

interface Props {
  questionCount: number
  onSelect: (mode: AnswerMode) => void
  onBack: () => void
}

export default function ModeSelect({ questionCount, onSelect, onBack }: Props) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 gap-6">
      <div className="text-center">
        <p className="text-slate-500 text-sm mb-1">全 {questionCount} 問</p>
        <h2 className="text-xl font-bold text-slate-800">解答モードを選んでください</h2>
      </div>

      <div className="w-full max-w-sm flex flex-col gap-4">
        {/* 4択モード */}
        <button
          onClick={() => onSelect('multiple-choice')}
          className="w-full bg-blue-900 hover:bg-blue-800 active:bg-blue-950 text-white rounded-2xl p-5 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl" aria-hidden="true">🔘</span>
            <div>
              <p className="font-bold text-base">4択モード</p>
              <p className="text-blue-200 text-sm mt-0.5">選択肢から選ぶ・自動判定</p>
            </div>
          </div>
        </button>

        {/* 記述モード */}
        <button
          onClick={() => onSelect('written')}
          className="w-full bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-800 border-2 border-slate-200 rounded-2xl p-5 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl" aria-hidden="true">✍️</span>
            <div>
              <p className="font-bold text-base">記述モード</p>
              <p className="text-slate-500 text-sm mt-0.5">自由記述→正解確認→自己判定</p>
            </div>
          </div>
        </button>
      </div>

      <button
        onClick={onBack}
        className="text-slate-400 hover:text-slate-600 text-sm underline-offset-2 hover:underline transition-colors"
      >
        ← 戻る
      </button>
    </div>
  )
}
