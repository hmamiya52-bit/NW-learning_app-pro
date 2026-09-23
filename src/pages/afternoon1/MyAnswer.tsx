import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import { officialAnswers } from '../../data/officialAnswers'
import type { OfficialAnswerSet } from '../../data/officialAnswers'
import { afternoonProblems } from '../../data/afternoonProblems'
import { processRows, BORDER_OUTER, BORDER_INNER, BORDER_HEAD } from '../../lib/answerTable'
import { getRowScores } from '../../lib/scoring'
import {
  getAfternoon1Explanation,
  makeRowKey,
  type Afternoon1RowExplanation,
} from '../../data/afternoon1/explanations'
import {
  getAfternoon1QuestionTexts,
  type Afternoon1QuestionText,
} from '../../data/afternoon1/questionTexts'
import { getAfternoon1ExamFigures } from '../../data/afternoon1/examFigures'
import { MarkupText } from '../../components/afternoon1/MarkupText'
import {
  Afternoon1FigureColorKey,
  Afternoon1FigureView,
} from '../../components/afternoon1/AfternoonFigure'
import ScratchMemo from '../../components/afternoon1/ScratchMemo'

// ----------------------------------------------------------------
// Types & storage
// ----------------------------------------------------------------

type MyAnswers = Record<string, string>
type Marking = 'correct' | 'partial' | 'wrong'
type Scorings = Record<string, Marking>

/**
 * 書きかけの解答だけをこの端末に残す（リロードで消えるのを防ぐため）。
 * 演習記録ではないので、同期対象（src/lib/sync/adapters.ts の KEYS）には登録しない。
 * 採点結果・自己採点・所要時間は保存しない。
 */
function draftKey(id: string) {
  return `nwsp:a1:draft:${id}`
}

function loadDraft(id: string): MyAnswers {
  try {
    const raw = localStorage.getItem(draftKey(id))
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveDraft(id: string, answers: MyAnswers) {
  try {
    localStorage.setItem(draftKey(id), JSON.stringify(answers))
  } catch {
    /* 保存できなくても演習は続けられる */
  }
}

// ----------------------------------------------------------------
// Timer hook
// ----------------------------------------------------------------

function useTimer() {
  const [elapsed, setElapsed] = useState(0)
  const [running, setRunning] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const start = useCallback(() => {
    if (intervalRef.current) return
    intervalRef.current = setInterval(() => setElapsed((e) => e + 1), 1000)
    setRunning(true)
  }, [])

  const pause = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setRunning(false)
  }, [])

  const reset = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setElapsed(0)
    setRunning(false)
  }, [])

  useEffect(
    () => () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    },
    [],
  )

  const fmt = (s: number) => {
    const h = Math.floor(s / 3600)
    const m = Math.floor((s % 3600) / 60)
    const sec = s % 60
    if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
  }

  return { elapsed, running, start, pause, reset, fmt }
}

// ----------------------------------------------------------------
// Answer input table
// ----------------------------------------------------------------

const MARK_LABEL: Record<Marking, string> = { correct: '○', partial: '△', wrong: '×' }

function AnswerInputTable({
  answerSet,
  myAnswers,
  onChange,
  checkMode,
  scorings,
  onMark,
  rowExplanations,
  questionTexts,
}: {
  answerSet: OfficialAnswerSet
  myAnswers: MyAnswers
  onChange: (rowIndex: string, value: string) => void
  checkMode: boolean
  scorings: Scorings
  onMark: (rowIndex: string, marking: Marking) => void
  rowExplanations: Record<string, Afternoon1RowExplanation>
  questionTexts: Record<string, Afternoon1QuestionText>
}) {
  const rows = useMemo(() => processRows(answerSet.answers), [answerSet])

  // 設問文アコーディオンの開閉。どの行が開いているかを Set で持ち、
  // details を open/onToggle で完全に制御する（一括開閉と個別開閉を両立させるため）
  const [openQuestions, setOpenQuestions] = useState<Set<string>>(() => new Set())
  const questionKeys = useMemo(
    () =>
      rows
        .map((row) => makeRowKey(row.s, row.q, row.t))
        .filter((key) => !!questionTexts[key]),
    [rows, questionTexts],
  )
  const allQuestionsOpen =
    questionKeys.length > 0 && questionKeys.every((k) => openQuestions.has(k))

  const toggleQuestion = useCallback((key: string, open: boolean) => {
    setOpenQuestions((prev) => {
      if (prev.has(key) === open) return prev
      const next = new Set(prev)
      if (open) next.add(key)
      else next.delete(key)
      return next
    })
  }, [])

  return (
    <div className="overflow-x-auto">
      {/* 設問文の一括開閉 */}
      {questionKeys.length > 0 && (
        <div className="flex items-center justify-between gap-2 px-3 py-1.5 border-b border-slate-200 bg-slate-50">
          <span className="text-[10px] text-slate-400">各行の折り畳みで設問を確認できます</span>
          <button
            type="button"
            onClick={() => setOpenQuestions(allQuestionsOpen ? new Set() : new Set(questionKeys))}
            className="flex-shrink-0 text-[11px] font-bold text-teal-700 border border-teal-200 bg-white rounded px-2 py-0.5 hover:bg-teal-50 transition-colors"
          >
            {allQuestionsOpen ? '設問をすべて閉じる' : '設問をすべて開く'}
          </button>
        </div>
      )}

      <table className="w-full table-fixed border-collapse text-xs" style={{ border: BORDER_OUTER }}>
        {/* 設問番号の列は狭く、解答欄の列を広く取る。table-fixed にして、
            長いラベル（ア/イ…や装置名）が列幅を引きずらないようにする。 */}
        <colgroup>
          <col style={{ width: '2.75rem' }} />
          <col style={{ width: '4.5rem' }} />
          <col />
        </colgroup>
        <thead>
          <tr style={{ backgroundColor: '#f8fafc' }}>
            <th
              colSpan={2}
              className="py-1.5 px-2 text-center font-bold text-slate-700"
              style={{ border: BORDER_HEAD }}
            >
              設問
            </th>
            <th
              className="py-1.5 px-2 text-left font-bold text-slate-700"
              style={{ border: BORDER_HEAD }}
            >
              解答
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const rowKey = String(row.rowIndex)
            const val = myAnswers[rowKey] ?? ''
            const renderQ = row.showQ && row.qLabel !== ''
            const answerColspan = row.showQ && row.qLabel === '' ? 2 : 1
            const questionKey = makeRowKey(row.s, row.q, row.t)

            const markingControls = checkMode ? (
              <div className="flex gap-2.5 px-1 pb-1.5 pt-0.5">
                {(['correct', 'partial', 'wrong'] as Marking[]).map((m) => {
                  const isSelected = scorings[rowKey] === m
                  const colors: Record<Marking, string> = {
                    correct: isSelected
                      ? 'bg-emerald-500 text-white'
                      : 'border border-emerald-400 text-emerald-600',
                    partial: isSelected
                      ? 'bg-amber-400 text-white'
                      : 'border border-amber-400 text-amber-600',
                    wrong: isSelected
                      ? 'bg-red-500 text-white'
                      : 'border border-red-400 text-red-500',
                  }
                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() => onMark(rowKey, m)}
                      className={`text-[11px] font-bold rounded px-1.5 py-0.5 transition-colors ${colors[m]}`}
                    >
                      {MARK_LABEL[m]}
                    </button>
                  )
                })}
              </div>
            ) : null

            // 公式設問文（IPA 原文）の折り畳み。解答中も答え合わせ中も出す。
            const official = questionTexts[questionKey]
            const questionAccordion = official ? (
              <details
                open={openQuestions.has(questionKey)}
                onToggle={(e) => toggleQuestion(questionKey, e.currentTarget.open)}
                className="mx-1 mt-1 mb-0.5 rounded border border-teal-200 bg-teal-50/60"
              >
                <summary className="cursor-pointer select-none px-2 py-1 text-[11px] font-bold text-teal-700 marker:text-teal-400">
                  設問を見る
                </summary>
                <div className="px-2 pb-2 pt-0.5 space-y-1">
                  {official.lead && (
                    <p className="text-[11px] leading-relaxed text-slate-500">
                      <span className="font-bold text-teal-600 mr-1">設問{row.s}</span>
                      {official.lead}
                    </p>
                  )}
                  <p className="text-[11px] leading-relaxed text-slate-800">
                    {official.lead ? (
                      <span className="font-bold text-teal-600 mr-1">{row.q}</span>
                    ) : (
                      <span className="font-bold text-teal-600 mr-1">{official.heading}</span>
                    )}
                    {official.text}
                  </p>
                </div>
              </details>
            ) : null

            // 行解説。checkMode に入って初めて出す（書く前に答えが見えないようにする）
            const exp = checkMode ? rowExplanations[questionKey] : undefined
            const explanationAccordion = exp ? (
              <details className="mx-1 mb-1 mt-0.5 rounded border border-slate-200 bg-slate-50">
                <summary className="cursor-pointer select-none px-2 py-1 text-[11px] font-bold text-slate-600 marker:text-slate-400">
                  解説を見る
                </summary>
                <div className="px-2 pb-2 pt-0.5 space-y-1.5 text-[11px] leading-relaxed text-slate-700">
                  {exp.point && (
                    <p>
                      <span className="font-bold text-slate-500">出題の力点</span>：
                      <MarkupText text={exp.point} />
                    </p>
                  )}
                  <p>
                    <span className="font-bold text-slate-500">本文の根拠</span>：
                    <MarkupText text={exp.basis} />
                  </p>
                  {exp.knowledge && (
                    <p>
                      <span className="font-bold text-teal-600">必要な知識</span>：
                      <MarkupText text={exp.knowledge} />
                    </p>
                  )}
                  <p>
                    <span className="font-bold text-slate-500">なぜこの解答か</span>：
                    <MarkupText text={exp.reasoning} />
                  </p>
                  {exp.pitfall && (
                    <p>
                      <span className="font-bold text-amber-600">ありがちな失点</span>：
                      <MarkupText text={exp.pitfall} />
                    </p>
                  )}
                </div>
              </details>
            ) : null

            const modelAnswer = checkMode ? (
              <div className="mx-1 mb-1 mt-0.5 border-t border-indigo-200 pt-1 text-[11px] text-indigo-800 bg-indigo-50 rounded px-2 py-1 leading-snug">
                <span className="text-[10px] font-bold text-indigo-400 mr-1">解答例</span>
                {row.a}
              </div>
            ) : null

            const inputContent = row.essay ? (
              <div>
                {questionAccordion}
                <textarea
                  className="w-full min-h-[80px] sm:min-h-[56px] text-xs text-slate-800 border-0 outline-none resize-y bg-transparent leading-snug p-1.5 placeholder:text-slate-300"
                  placeholder="記述してください"
                  value={val}
                  onChange={(e) => onChange(rowKey, e.target.value)}
                />
                <div className="text-right text-[10px] text-slate-400 pr-1 pb-0.5 leading-none">
                  {val.length} 文字
                </div>
                {modelAnswer}
                {explanationAccordion}
                {markingControls}
              </div>
            ) : (
              <div>
                {questionAccordion}
                <input
                  type="text"
                  className="w-full text-xs text-slate-800 border-0 outline-none bg-transparent p-1.5 placeholder:text-slate-300"
                  placeholder="—"
                  value={val}
                  onChange={(e) => onChange(rowKey, e.target.value)}
                />
                {modelAnswer}
                {explanationAccordion}
                {markingControls}
              </div>
            )

            return (
              <tr key={row.rowIndex} className="align-top">
                {/* 設問セル */}
                {row.showS && (
                  <td
                    rowSpan={row.sRowspan}
                    className="py-1.5 px-1 font-bold text-slate-700 whitespace-nowrap align-middle text-center"
                    style={{ border: BORDER_INNER }}
                  >
                    設問{row.s}
                  </td>
                )}

                {/* 小問セル: qLabel が空でない場合のみ */}
                {renderQ && (
                  <td
                    rowSpan={row.qRowspan}
                    className="py-1.5 px-1 text-slate-600 align-middle text-center break-words leading-snug"
                    style={{ border: BORDER_INNER }}
                  >
                    {row.qLabel}
                  </td>
                )}

                {/* 解答セル */}
                <td colSpan={answerColspan} className="p-0" style={{ border: BORDER_INNER }}>
                  {row.inlineT !== undefined ? (
                    <div className="flex items-stretch">
                      <div
                        className="flex items-center justify-center flex-shrink-0 text-slate-500 text-[11px] py-1 px-1.5 whitespace-nowrap"
                        style={{ borderRight: BORDER_INNER }}
                      >
                        {row.inlineT}
                      </div>
                      <div className="flex-1">{inputContent}</div>
                    </div>
                  ) : (
                    inputContent
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

// ----------------------------------------------------------------
// Page
// ----------------------------------------------------------------

export default function Afternoon1MyAnswer() {
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const forceCheck = searchParams.get('check') === '1'

  return (
    <Afternoon1MyAnswerContent
      key={`${id ?? 'missing'}:${forceCheck ? 'check' : ''}`}
      id={id}
      forceCheck={forceCheck}
    />
  )
}

function Afternoon1MyAnswerContent({
  id,
  forceCheck,
}: {
  id: string | undefined
  forceCheck: boolean
}) {
  const answerSet = id ? officialAnswers.find((a) => a.id === id) : undefined
  const problem = answerSet ? afternoonProblems.find((p) => p.id === answerSet.id) : undefined

  const [myAnswers, setMyAnswers] = useState<MyAnswers>(() => (id ? loadDraft(id) : {}))
  const [checkMode, setCheckMode] = useState(forceCheck)
  const [scorings, setScorings] = useState<Scorings>({})
  const [showClearModal, setShowClearModal] = useState(false)
  const [showFinishConfirm, setShowFinishConfirm] = useState(false)
  const [memo, setMemo] = useState('')
  const [openFigures, setOpenFigures] = useState<Set<number>>(() => new Set())

  const timer = useTimer()

  const explanation = useMemo(() => (id ? getAfternoon1Explanation(id) : undefined), [id])
  const rowExplanations = useMemo(() => {
    const map: Record<string, Afternoon1RowExplanation> = {}
    explanation?.rows.forEach((r) => {
      map[r.rowKey] = r
    })
    return map
  }, [explanation])
  const questionTexts = useMemo(() => (id ? getAfternoon1QuestionTexts(id) : {}), [id])
  const examFigures = useMemo(() => (id ? getAfternoon1ExamFigures(id) : []), [id])
  const allFiguresOpen = examFigures.length > 0 && examFigures.every((_, i) => openFigures.has(i))

  useEffect(() => {
    if (id) saveDraft(id, myAnswers)
  }, [id, myAnswers])

  const handleChange = useCallback((rowIndex: string, value: string) => {
    setMyAnswers((prev) => ({ ...prev, [rowIndex]: value }))
  }, [])

  const handleMark = useCallback((rowIndex: string, marking: Marking) => {
    setScorings((prev) => {
      // 同じマーキングを再クリックしたら解除
      if (prev[rowIndex] === marking) {
        const next = { ...prev }
        delete next[rowIndex]
        return next
      }
      return { ...prev, [rowIndex]: marking }
    })
  }, [])

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

  const filledCount = Object.values(myAnswers).filter((v) => v.trim()).length
  const totalRows = answerSet.answers.length

  // 採点計算（その場で表示するだけ。保存も記録もしない）
  const rowScores = getRowScores(id)
  const maxScore = rowScores.reduce((sum, r) => sum + r.correct, 0)
  const markedCount = Object.keys(scorings).length
  const allRowsMarked = totalRows > 0 && markedCount === totalRows
  const calculatedScore = Object.entries(scorings).reduce((sum, [rowKey, marking]) => {
    const pts = rowScores[parseInt(rowKey, 10)]
    if (!pts) return sum
    if (marking === 'correct') return sum + pts.correct
    if (marking === 'partial') return sum + pts.partial
    return sum
  }, 0)

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8fafc' }}>
      <div className="max-w-4xl mx-auto px-4 pb-16 pt-4 space-y-4">

        {/* Header */}
        <section>
          <div className="rounded-xl bg-teal-700 text-white px-4 py-3 shadow-md flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[11px] font-bold bg-teal-500 rounded-full px-2 py-0.5 flex-shrink-0">
                  {answerSet.year}
                </span>
                <span className="text-[11px] font-bold rounded-full px-2 py-0.5 flex-shrink-0 bg-white text-teal-800">
                  午後Ⅰ 問{answerSet.number}
                </span>
              </div>
              <h1 className="text-sm font-black leading-snug">{problem?.title ?? '解答欄'}</h1>
            </div>
            <Link
              to={`/afternoon1/${id}`}
              className="text-[11px] text-teal-300 hover:text-white transition-colors flex-shrink-0 mt-0.5"
            >
              ← 戻る
            </Link>
          </div>
        </section>

        {/* 問題PDF */}
        {problem?.questionPdfUrl && (
          <div className="flex justify-end">
            <a
              href={problem.questionPdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-slate-500 hover:text-teal-600 hover:underline transition-colors"
            >
              問題文 PDF を開く →
            </a>
          </div>
        )}

        {/* Timer + progress */}
        <div className="bg-white rounded-xl border border-slate-200 px-4 py-3 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-lg font-mono font-bold text-slate-800 w-20 tabular-nums">
              {timer.fmt(timer.elapsed)}
            </span>
            <div>
              <div className="flex gap-1">
                {!timer.running ? (
                  <button
                    onClick={timer.start}
                    className="text-[11px] font-bold text-white bg-teal-600 hover:bg-teal-700 rounded px-2.5 py-1 transition-colors"
                  >
                    ▶ 開始
                  </button>
                ) : (
                  <button
                    onClick={timer.pause}
                    className="text-[11px] font-bold text-white bg-amber-500 hover:bg-amber-600 rounded px-2.5 py-1 transition-colors"
                  >
                    ⏸ 一時停止
                  </button>
                )}
                <button
                  onClick={timer.reset}
                  className="text-[11px] font-bold text-slate-500 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded px-2.5 py-1 transition-colors"
                >
                  リセット
                </button>
              </div>
              {!timer.running && timer.elapsed === 0 && (
                <p className="text-[10px] text-slate-400 mt-1">問題文を手元に用意してから開始</p>
              )}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] text-slate-500">記入済み</span>
              <span className="text-[11px] font-bold text-slate-700">
                {filledCount} / {totalRows}
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5">
              <div
                className="bg-teal-500 h-1.5 rounded-full transition-all"
                style={{ width: `${totalRows > 0 ? (filledCount / totalRows) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>

        {/* 図表（設問が参照する図表。解いている間に開ける） */}
        {examFigures.length > 0 && (
          <section className="bg-white rounded-xl border border-slate-200 px-4 py-3">
            <div className="flex items-center justify-between gap-2 mb-2">
              <h2 className="text-xs font-black text-teal-800 flex items-center gap-2">
                <span className="inline-block w-1.5 h-3.5 bg-teal-500 rounded-full" />
                問題中の図表
              </h2>
              <button
                type="button"
                onClick={() =>
                  setOpenFigures(
                    allFiguresOpen ? new Set() : new Set(examFigures.map((_, i) => i)),
                  )
                }
                className="flex-shrink-0 text-[11px] font-bold text-teal-700 border border-teal-200 bg-white rounded px-2 py-0.5 hover:bg-teal-50 transition-colors"
              >
                {allFiguresOpen ? 'すべて閉じる' : 'すべて開く'}
              </button>
            </div>
            <div className="mb-2">
              <Afternoon1FigureColorKey />
            </div>
            <div className="space-y-2">
              {examFigures.map((fig, i) => (
                <details
                  key={i}
                  open={openFigures.has(i)}
                  onToggle={(e) => {
                    const open = e.currentTarget.open
                    setOpenFigures((prev) => {
                      if (prev.has(i) === open) return prev
                      const next = new Set(prev)
                      if (open) next.add(i)
                      else next.delete(i)
                      return next
                    })
                  }}
                  className="rounded border border-slate-200"
                >
                  <summary className="cursor-pointer select-none px-2 py-1.5 text-[11.5px] font-bold text-slate-700 marker:text-slate-400">
                    {fig.title}
                  </summary>
                  <div className="px-1 pb-1">
                    <Afternoon1FigureView figure={fig} hideCaption allowPoints={checkMode} />
                  </div>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* Action buttons */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => setShowClearModal(true)}
            className="text-[11px] text-red-400 hover:text-red-600 transition-colors"
          >
            解答をクリア
          </button>
          <button
            onClick={() => (checkMode ? setCheckMode(false) : setShowFinishConfirm(true))}
            className={`text-xs font-bold rounded-lg px-3 py-1.5 transition-colors ${
              checkMode
                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                : 'text-indigo-600 border border-indigo-300 hover:bg-indigo-50'
            }`}
          >
            {checkMode ? '答え合わせ中 ✓' : '答え合わせ'}
          </button>
        </div>

        {/* 採点結果カード（その場で表示するだけ。記録には残らない） */}
        {checkMode && markedCount > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
            <p className="text-[11px] font-bold text-amber-800 mb-0.5">採点結果</p>
            <p className="text-[11px] text-amber-700">
              {markedCount} / {totalRows}問マーク済み
              <span className="mx-2 text-amber-400">|</span>
              推定スコア:
              <span className="font-bold ml-1 text-amber-900">
                {calculatedScore} / {maxScore}点
              </span>
            </p>
            <p className="text-[10px] text-amber-600 mt-0.5">
              {allRowsMarked
                ? 'この結果は記録されません。ページを離れると消えます。'
                : '全設問を ○ / △ / × で採点すると満点までの得点が出ます。'}
            </p>
          </div>
        )}

        {/* 問題全体の解説（概要）— 答え合わせ時のみ・既定閉じ */}
        {checkMode && explanation?.overview && (
          <details className="bg-white rounded-xl border border-slate-200 px-4 py-2.5">
            <summary className="cursor-pointer select-none text-xs font-bold text-teal-800 marker:text-slate-400">
              この問題の解説（概要）
            </summary>
            <p className="mt-2 text-[12px] leading-relaxed text-slate-700">
              <MarkupText text={explanation.overview} />
            </p>
          </details>
        )}

        {/* 詳細解説ページへの導線 — 答え合わせ時のみ */}
        {checkMode && explanation?.detail && (
          <Link
            to={`/afternoon1/${id}/explanation`}
            className="flex items-center justify-between gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 hover:bg-amber-100 transition-colors"
          >
            <span className="text-[12px] font-bold text-amber-800">
              さらに深く理解する：詳細解説ページ
            </span>
            <span className="text-[12px] font-bold text-amber-600 flex-shrink-0">→</span>
          </Link>
        )}

        {/* 解説が未投入のときの断り書き（答え合わせ時のみ） */}
        {checkMode && !explanation && (
          <div className="bg-white rounded-xl border border-slate-200 px-4 py-3">
            <p className="text-[12px] text-slate-500">
              この問題の解説は準備中です。解答例と配点での自己採点はご利用いただけます。
            </p>
          </div>
        )}

        {/* Input table */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <AnswerInputTable
            answerSet={answerSet}
            myAnswers={myAnswers}
            onChange={handleChange}
            checkMode={checkMode}
            scorings={scorings}
            onMark={handleMark}
            rowExplanations={rowExplanations}
            questionTexts={questionTexts}
          />
        </div>

        {/* 下書きメモ（保存しない） */}
        <ScratchMemo
          value={memo}
          onChange={setMemo}
          note="保存されません"
          placeholder={'根拠の抜き出し・下書きなどにお使いください\n（保存されません）'}
          textareaClassName="h-[220px] resize-y"
        />

        {/* Bottom check button */}
        <div className="flex justify-end">
          <button
            onClick={() => (checkMode ? setCheckMode(false) : setShowFinishConfirm(true))}
            className={`text-xs font-bold rounded-lg px-3 py-1.5 transition-colors ${
              checkMode
                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                : 'text-indigo-600 border border-indigo-300 hover:bg-indigo-50'
            }`}
          >
            {checkMode ? '答え合わせ中 ✓' : '答え合わせ'}
          </button>
        </div>

        {/* 入口へ戻る */}
        <div className="flex justify-center pt-2">
          <Link
            to={`/afternoon1/${id}`}
            className="text-xs text-slate-400 hover:text-teal-600 border border-slate-200 rounded-lg px-4 py-2 hover:border-teal-300 transition-colors"
          >
            ← この問題のトップへ戻る
          </Link>
        </div>

      </div>

      {/* 答え合わせ確認ダイアログ */}
      {showFinishConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setShowFinishConfirm(false)}
        >
          <div className="absolute inset-0 bg-black/40" />
          <div
            className="relative bg-white rounded-2xl w-full max-w-sm shadow-xl px-6 py-5 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-sm font-bold text-slate-800">解答を終了しますか？</h3>
            <p className="text-xs text-slate-500">
              答え合わせモードに切り替えます。タイマーを一時停止します。
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowFinishConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-500 hover:bg-slate-50"
              >
                キャンセル
              </button>
              <button
                onClick={() => {
                  timer.pause()
                  setCheckMode(true)
                  setShowFinishConfirm(false)
                }}
                className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700"
              >
                はい
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear confirmation modal */}
      {showClearModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setShowClearModal(false)}
        >
          <div className="absolute inset-0 bg-black/40" />
          <div
            className="relative bg-white rounded-2xl w-full max-w-sm shadow-xl px-6 py-5 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-sm font-bold text-slate-800">解答をクリアしますか？</h3>
            <p className="text-xs text-slate-500">
              入力した解答がすべて消去されます。この操作は元に戻せません。
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowClearModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-500 hover:bg-slate-50"
              >
                キャンセル
              </button>
              <button
                onClick={() => {
                  setMyAnswers({})
                  setScorings({})
                  setShowClearModal(false)
                }}
                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold"
              >
                クリアする
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
