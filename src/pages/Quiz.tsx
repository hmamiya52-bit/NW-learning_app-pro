import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { questions as allQuestions } from '../data/questions'
import { categories } from '../data/categories'
import { addAnswerRecord, getAllProgress, saveStudySession } from '../lib/storage'
import type { Question, StudySession } from '../types'
import ModeSelect from '../components/quiz/ModeSelect'
import QuizQuestion from '../components/quiz/QuizQuestion'
import ResultMultipleChoice from '../components/quiz/ResultMultipleChoice'
import ResultWritten from '../components/quiz/ResultWritten'
import QuizSummary from './QuizSummary'

type Phase = 'mode-select' | 'question' | 'result-mc' | 'result-wr' | 'summary'
type AnswerMode = 'multiple-choice' | 'written'

interface AnswerLog {
  question: Question
  userAnswer: string
  isCorrect: boolean
  mode: AnswerMode
}

// ---------- 問題フィルタリング ----------
function filterQuestions(
  mode: string | null,
  categoryId: string | null,
): Question[] {
  if (mode === 'important') {
    return allQuestions.filter((q) => q.isImportant)
  }
  if (mode === 'topic' && categoryId) {
    return allQuestions.filter((q) => q.topicId === categoryId)
  }
  if (mode === 'weakness') {
    const progress = getAllProgress()
    const rateMap = new Map(
      progress.map((p) => [
        p.topicId,
        p.totalAttempts > 0 ? p.correctCount / p.totalAttempts : 0,
      ])
    )
    // 正答率 60% 未満 or 未学習（totalAttempts=0）の問題
    return allQuestions.filter((q) => {
      const rate = rateMap.get(q.topicId)
      return rate === undefined || rate < 0.6
    })
  }
  // random: 全問シャッフル
  return [...allQuestions].sort(() => Math.random() - 0.5)
}

function modeLabel(mode: string | null): string {
  switch (mode) {
    case 'important': return '重要問題モード'
    case 'weakness': return '弱点克服モード'
    case 'random': return 'ランダム出題'
    case 'topic': return 'カテゴリ別学習'
    default: return '学習'
  }
}

// ---------- コンポーネント ----------
export default function Quiz() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const mode = searchParams.get('mode')
  const categoryId = searchParams.get('category')

  // セッションID（リトライのたびに更新）
  const sessionId = useRef(crypto.randomUUID())

  // セッション開始時刻（完了時に上書きしないよう ref で保持）
  const sessionStartedAt = useRef('')

  // 再挑戦用問題リスト（nullの場合は通常フィルタリング）
  const [retryList, setRetryList] = useState<Question[] | null>(null)

  // 問題リスト（retryListがあればそちらを優先）
  const baseList = useMemo(
    () => filterQuestions(mode, categoryId),
    [mode, categoryId]
  )
  const questionList = retryList ?? baseList

  const [phase, setPhase] = useState<Phase>('mode-select')
  const [answerMode, setAnswerMode] = useState<AnswerMode>('multiple-choice')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [logs, setLogs] = useState<AnswerLog[]>([])
  const [lastSelected, setLastSelected] = useState('')
  const [lastWritten, setLastWritten] = useState('')
  const [lastIsCorrect, setLastIsCorrect] = useState(false)

  // セッション開始（sessionIdが変わるたびにリセット）
  const startedSessionId = useRef('')
  useEffect(() => {
    if (phase === 'question' && startedSessionId.current !== sessionId.current) {
      startedSessionId.current = sessionId.current
      sessionStartedAt.current = new Date().toISOString()
      const session: StudySession = {
        id: sessionId.current,
        startedAt: sessionStartedAt.current,
        endedAt: null,
        mode: (mode as StudySession['mode']) ?? 'random',
        categoryId: categoryId,
        questionCount: questionList.length,
        correctCount: 0,
      }
      saveStudySession(session)
    }
  }, [phase, mode, categoryId, questionList.length])

  const currentQuestion = questionList[currentIndex]
  const isLast = currentIndex === questionList.length - 1

  // ---------- 解答ハンドラ（4択）----------
  const handleAnswerMC = useCallback(
    (selected: string) => {
      const isCorrect = selected === currentQuestion.correctAnswer
      setLastSelected(selected)
      setLastIsCorrect(isCorrect)
      addAnswerRecord({
        id: crypto.randomUUID(),
        questionId: currentQuestion.id,
        mode: 'multiple-choice',
        isCorrect,
        userAnswer: selected,
        answeredAt: new Date().toISOString(),
      })
      setPhase('result-mc')
    },
    [currentQuestion]
  )

  // ---------- 解答ハンドラ（記述）----------
  const handleAnswerWritten = useCallback(
    (written: string) => {
      setLastWritten(written)
      setPhase('result-wr')
    },
    []
  )

  // ---------- 次の問題へ / 終了 ----------
  const advanceOrFinish = useCallback(
    (isCorrect: boolean) => {
      const newLog: AnswerLog = {
        question: currentQuestion,
        userAnswer: answerMode === 'multiple-choice' ? lastSelected : lastWritten,
        isCorrect,
        mode: answerMode,
      }
      const newLogs = [...logs, newLog]
      setLogs(newLogs)

      if (isLast) {
        // セッション完了（開始時刻は sessionStartedAt.current を再利用）
        const correctCount = newLogs.filter((l) => l.isCorrect).length
        saveStudySession({
          id: sessionId.current,
          startedAt: sessionStartedAt.current,
          endedAt: new Date().toISOString(),
          mode: (mode as StudySession['mode']) ?? 'random',
          categoryId: categoryId,
          questionCount: questionList.length,
          correctCount,
        })
        setPhase('summary')
      } else {
        setCurrentIndex((i) => i + 1)
        setPhase('question')
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentQuestion, answerMode, lastSelected, lastWritten, logs, isLast, mode, categoryId, questionList.length]
  )

  // ---------- 自己判定（記述）----------
  const handleJudge = useCallback(
    (isCorrect: boolean) => {
      addAnswerRecord({
        id: crypto.randomUUID(),
        questionId: currentQuestion.id,
        mode: 'written',
        isCorrect,
        userAnswer: lastWritten,
        answeredAt: new Date().toISOString(),
      })
      setLastIsCorrect(isCorrect)
      advanceOrFinish(isCorrect)
    },
    [currentQuestion, lastWritten, advanceOrFinish]
  )

  // 4択の「次へ」
  const handleNextMC = useCallback(() => {
    advanceOrFinish(lastIsCorrect)
  }, [advanceOrFinish, lastIsCorrect])

  // ---------- 間違えた問題を再挑戦 ----------
  const handleRetryWrong = useCallback(() => {
    const wrongQuestions = logs
      .filter((l) => !l.isCorrect)
      .map((l) => l.question)
    if (wrongQuestions.length === 0) {
      navigate('/')
      return
    }
    // セッションIDをリフレッシュ
    sessionId.current = crypto.randomUUID()
    // 状態をリセットして再スタート
    setRetryList(wrongQuestions)
    setLogs([])
    setCurrentIndex(0)
    setLastSelected('')
    setLastWritten('')
    setLastIsCorrect(false)
    setPhase('mode-select')
  }, [logs, navigate])

  // ---------- 問題なし ----------
  if (questionList.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4 px-4">
        <p className="text-slate-500 text-center">
          このモードで出題できる問題がありません。
        </p>
        <button
          onClick={() => navigate('/')}
          className="bg-blue-900 text-white font-bold rounded-xl px-6 py-3 hover:bg-blue-800 transition-colors"
        >
          ホームへ戻る
        </button>
      </div>
    )
  }

  // ---------- カテゴリ名（ヘッダー表示用）----------
  const categoryName = categoryId
    ? categories.find((c) => c.id === categoryId)?.name ?? ''
    : ''
  const headerTitle = mode === 'topic' && categoryName ? categoryName : modeLabel(mode)

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ヘッダー */}
      <header className="bg-blue-900 text-white shadow-lg sticky top-0 z-20">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="p-2 rounded-lg hover:bg-blue-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white flex-shrink-0"
            aria-label="ホームへ戻る"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm truncate">{headerTitle}</p>
            {phase !== 'mode-select' && phase !== 'summary' && (
              <p className="text-blue-300 text-xs">{questionList.length} 問</p>
            )}
          </div>
          {/* モードバッジ */}
          {phase !== 'mode-select' && phase !== 'summary' && (
            <span className="flex-shrink-0 text-xs bg-blue-800 text-blue-200 rounded-full px-2.5 py-1">
              {answerMode === 'multiple-choice' ? '4択' : '記述'}
            </span>
          )}
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 pb-12">
        {/* ── モード選択 ── */}
        {phase === 'mode-select' && (
          <ModeSelect
            questionCount={questionList.length}
            onSelect={(m) => {
              setAnswerMode(m)
              setPhase('question')
            }}
            onBack={() => navigate('/')}
          />
        )}

        {/* ── 問題 ── */}
        {phase === 'question' && currentQuestion && (
          <QuizQuestion
            key={currentQuestion.id}
            question={currentQuestion}
            index={currentIndex}
            total={questionList.length}
            answerMode={answerMode}
            onAnswerMultipleChoice={handleAnswerMC}
            onAnswerWritten={handleAnswerWritten}
          />
        )}

        {/* ── 4択 結果 ── */}
        {phase === 'result-mc' && currentQuestion && (
          <ResultMultipleChoice
            question={currentQuestion}
            selected={lastSelected}
            isCorrect={lastIsCorrect}
            onNext={handleNextMC}
            isLast={isLast}
          />
        )}

        {/* ── 記述 結果・自己判定 ── */}
        {phase === 'result-wr' && currentQuestion && (
          <ResultWritten
            question={currentQuestion}
            written={lastWritten}
            onJudge={handleJudge}
            isLast={isLast}
          />
        )}

        {/* ── サマリー ── */}
        {phase === 'summary' && (
          <QuizSummary
            logs={logs}
            sessionMode={modeLabel(mode)}
            onRetryWrong={handleRetryWrong}
          />
        )}
      </main>
    </div>
  )
}
