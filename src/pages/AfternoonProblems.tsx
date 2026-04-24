import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { afternoonProblems, YEARS } from '../data/afternoonProblems'
import type { AfternoonProblem, ProblemSection } from '../data/afternoonProblems'
import { officialAnswers } from '../data/officialAnswers'
import {
  loadRecords, addRecord, deleteRecord,
  loadPlans, setPlan, removePlan, getMaxScore,
} from '../lib/tracker'
import type { PracticeRecord } from '../lib/tracker'

// ----------------------------------------------------------------
// Types / helpers
// ----------------------------------------------------------------

const ANSWER_IDS = new Set(officialAnswers.map(a => a.id))

interface RowData {
  problem: AfternoonProblem
  hasAnswer: boolean
  records: PracticeRecord[]
  latestScore: number | null
  latestDate: string | null
  roundCount: number
  plannedDate: string | null
  maxScore: number
}

type PracticeFilter = 'all' | 'studied' | 'unstudied'
type SortMode = 'score' | 'year'

function today(): string {
  return new Date().toISOString().slice(0, 10)
}

function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  // "YYYY-MM-DD" → "M/D"
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const [, m, d] = dateStr.split('-')
    return `${parseInt(m)}/${parseInt(d)}`
  }
  // already "M/D" or custom string
  return dateStr
}

function scoreColor(score: number, max: number): string {
  const pct = score / max
  if (pct >= 0.8) return 'text-emerald-600'
  if (pct >= 0.6) return 'text-amber-500'
  return 'text-red-500'
}

// 年度インデックス（YEARS の順序を保持）
const YEAR_ORDER: Record<string, number> = {}
YEARS.forEach((y, i) => { YEAR_ORDER[y] = i })

function buildRows(
  section: ProblemSection,
  records: PracticeRecord[],
  plans: Record<string, string>,
  sortMode: SortMode,
): RowData[] {
  const maxScore = getMaxScore(section)
  const problems = afternoonProblems.filter(p => p.section === section)

  const rows: RowData[] = problems.map(problem => {
    const problemRecords = records
      .filter(r => r.problemId === problem.id)
      .sort((a, b) => b.date.localeCompare(a.date))
    return {
      problem,
      hasAnswer: ANSWER_IDS.has(problem.id),
      records: problemRecords,
      latestScore: problemRecords.length > 0 ? Math.max(...problemRecords.map(r => r.score)) : null,
      latestDate: problemRecords[0]?.date ?? null,
      roundCount: problemRecords.length,
      plannedDate: plans[problem.id] ?? null,
      maxScore,
    }
  })

  if (sortMode === 'year') {
    return rows.sort((a, b) => {
      const yi = YEAR_ORDER[a.problem.year] - YEAR_ORDER[b.problem.year]
      return yi !== 0 ? yi : a.problem.number - b.problem.number
    })
  }

  // score mode: 演習済み→最高点降順, 未演習→YEARS 順
  const studied = rows
    .filter(r => r.roundCount > 0)
    .sort((a, b) => (b.latestScore ?? 0) - (a.latestScore ?? 0))

  const unstudied = rows
    .filter(r => r.roundCount === 0)
    .sort((a, b) => {
      const yi = YEAR_ORDER[a.problem.year] - YEAR_ORDER[b.problem.year]
      return yi !== 0 ? yi : a.problem.number - b.problem.number
    })

  return [...studied, ...unstudied]
}

// ----------------------------------------------------------------
// Record modal
// ----------------------------------------------------------------

interface RecordModalProps {
  problem: AfternoonProblem
  onSave: (data: { date: string; score: number; plannedDate: string; memo: string }) => void
  onClose: () => void
}

function RecordModal({ problem, onSave, onClose }: RecordModalProps) {
  const maxScore = getMaxScore(problem.section)
  const sectionLabel = problem.section === 'G1' ? '午後Ⅰ' : '午後Ⅱ'
  const [date, setDate] = useState(today())
  const [score, setScore] = useState('')
  const [plannedDate, setPlannedDate] = useState('')
  const [memo, setMemo] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const s = parseInt(score)
    if (isNaN(s) || s < 0 || s > maxScore) return
    onSave({ date, score: s, plannedDate, memo })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative bg-white rounded-2xl w-full max-w-md shadow-xl" onClick={e => e.stopPropagation()}>
        <div className="px-5 pt-5 pb-3 border-b border-slate-100">
          <p className="text-[11px] text-slate-400">
            {sectionLabel} 問{problem.number} · {problem.yearLabel}
          </p>
          <h3 className="text-sm font-bold text-slate-800 mt-0.5 leading-snug">{problem.title}</h3>
        </div>
        <form onSubmit={handleSubmit} className="px-5 py-4 space-y-3">
          <div>
            <label className="text-xs font-bold text-slate-500 block mb-1">演習日</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 block mb-1">
              点数
              <span className="font-normal text-slate-400 ml-1">（満点 {maxScore} 点）</span>
            </label>
            <input
              type="number"
              min={0}
              max={maxScore}
              step={1}
              value={score}
              onChange={e => setScore(e.target.value)}
              placeholder={`0 〜 ${maxScore}`}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 block mb-1">
              次回計画日
              <span className="font-normal text-slate-400 ml-1">（任意）</span>
            </label>
            <input
              type="date"
              value={plannedDate}
              onChange={e => setPlannedDate(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 block mb-1">
              メモ
              <span className="font-normal text-slate-400 ml-1">（任意）</span>
            </label>
            <textarea
              value={memo}
              onChange={e => setMemo(e.target.value)}
              rows={2}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
            />
          </div>
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-500 hover:bg-slate-50"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700"
            >
              記録する
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ----------------------------------------------------------------
// History modal
// ----------------------------------------------------------------

interface HistoryModalProps {
  problem: AfternoonProblem
  records: PracticeRecord[]
  onDelete: (id: string) => void
  onAddRecord: () => void
  onClose: () => void
}

function HistoryModal({ problem, records, onDelete, onAddRecord, onClose }: HistoryModalProps) {
  const maxScore = getMaxScore(problem.section)
  const sectionLabel = problem.section === 'G1' ? '午後Ⅰ' : '午後Ⅱ'

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div
        className="relative bg-white rounded-2xl w-full max-w-md shadow-xl max-h-[80vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="px-5 pt-5 pb-3 border-b border-slate-100 flex-shrink-0">
          <p className="text-[11px] text-slate-400">
            {sectionLabel} 問{problem.number} · {problem.yearLabel}
          </p>
          <h3 className="text-sm font-bold text-slate-800 mt-0.5 leading-snug">{problem.title}</h3>
          <p className="text-xs text-slate-400 mt-1">
            満点 {maxScore} 点 · {records.length} 回演習
          </p>
        </div>
        <div className="overflow-y-auto flex-1 px-5 py-3">
          {records.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-6">演習記録がありません</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {records.map((r, i) => (
                <li key={r.id} className="flex items-start gap-3 py-2.5">
                  <div className="flex-shrink-0 text-xs text-slate-400 w-5 text-right pt-0.5">
                    {records.length - i}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs text-slate-500">{formatDate(r.date)}</span>
                      <span className={`text-sm font-black tabular-nums ${scoreColor(r.score, maxScore)}`}>
                        {r.score}
                        <span className="text-[10px] font-normal text-slate-400">/{maxScore}</span>
                      </span>
                      <span className="text-[10px] text-slate-400">
                        ({Math.round((r.score / maxScore) * 100)}%)
                      </span>
                    </div>
                    {r.memo && (
                      <p className="text-xs text-slate-500 mt-0.5 leading-snug">{r.memo}</p>
                    )}
                  </div>
                  <button
                    onClick={() => onDelete(r.id)}
                    className="text-slate-300 hover:text-red-400 transition-colors p-1 flex-shrink-0"
                    aria-label="削除"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="px-5 py-4 border-t border-slate-100 flex-shrink-0 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-500 hover:bg-slate-50"
          >
            閉じる
          </button>
          <button
            onClick={onAddRecord}
            className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700"
          >
            ＋記録する
          </button>
        </div>
      </div>
    </div>
  )
}

// ----------------------------------------------------------------
// Problem table
// ----------------------------------------------------------------

interface ProblemTableProps {
  section: ProblemSection
  rows: RowData[]
  studiedCount: number
  sortMode: SortMode
  onRecord: (problem: AfternoonProblem) => void
  onHistory: (problem: AfternoonProblem) => void
  onPlanChange: (problemId: string, date: string) => void
}

function ProblemTable({ section, rows, studiedCount, sortMode, onRecord, onHistory, onPlanChange }: ProblemTableProps) {
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null)
  const label = section === 'G1' ? '午後Ⅰ' : '午後Ⅱ'
  const headerColor = section === 'G1' ? 'bg-blue-700' : 'bg-purple-700'
  const badgeColor = section === 'G1' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
  const actualStudied = rows.filter(r => r.roundCount > 0).length

  return (
    <section>
      <h2 className={`text-xs font-bold text-white rounded-t-xl px-4 py-2 ${headerColor} flex items-center justify-between`}>
        <span>{label}</span>
        <span className="font-normal opacity-80">
          演習済 {actualStudied} / {rows.length}問
        </span>
      </h2>
      <div className="rounded-b-xl border border-slate-200 bg-white overflow-x-auto">
        {rows.length === 0 ? (
          <div className="px-4 py-6 text-xs text-slate-400 text-center">
            条件に一致する問題がありません
          </div>
        ) : (
          <table className="w-full border-collapse text-sm min-w-[800px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="py-2 px-2 text-left text-xs font-bold text-slate-500 w-12">年度</th>
                <th className="py-2 px-2 text-left text-xs font-bold text-slate-500 w-11">問</th>
                <th className="py-2 px-2 text-left text-xs font-bold text-slate-500">テーマ</th>
                <th className="py-2 px-2 text-center text-xs font-bold text-slate-500 w-12">周回</th>
                <th className="py-2 px-2 text-center text-xs font-bold text-slate-500 w-16">最高点</th>
                <th className="py-2 px-2 text-left text-xs font-bold text-slate-500 w-14">実施日</th>
                <th className="py-2 px-2 text-left text-xs font-bold text-slate-500 w-16">計画日</th>
                <th className="py-2 px-2 text-center text-xs font-bold text-slate-500 w-12 whitespace-nowrap">問題文</th>
                <th className="py-2 px-2 text-xs font-bold text-slate-500 w-40">アクション</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => {
                // score モード時のみセパレータを表示
                const isSeparator = sortMode === 'score' && i === studiedCount && studiedCount > 0 && i < rows.length
                return (
                  <tr
                    key={row.problem.id}
                    className={[
                      'group align-middle cursor-pointer hover:bg-indigo-50/40 transition-colors',
                      isSeparator ? 'border-t-2 border-indigo-200' : 'border-t border-slate-100',
                    ].join(' ')}
                    onClick={() => onHistory(row.problem)}
                  >
                    {/* 年度 */}
                    <td className="py-1.5 px-2 text-xs text-slate-500 whitespace-nowrap">
                      {row.problem.year}
                    </td>

                    {/* 問番号 */}
                    <td className="py-1.5 px-2">
                      <span className={`text-[11px] font-bold rounded-full px-2 py-0.5 whitespace-nowrap ${badgeColor}`}>
                        問{row.problem.number}
                      </span>
                    </td>

                    {/* テーマ + キーワード */}
                    <td className="py-1.5 px-2">
                      <div className="text-xs font-semibold text-slate-800 leading-snug">
                        {row.problem.title}
                        <span className="ml-1 opacity-0 group-hover:opacity-40 transition-opacity text-slate-400 text-xs">›</span>
                      </div>
                      {row.problem.keywords.length > 0 && (
                        <div className="flex flex-wrap gap-0.5 mt-0.5">
                          {row.problem.keywords.map(kw => (
                            <span
                              key={kw}
                              className="text-[9px] bg-slate-100 text-slate-400 rounded px-1 py-0 leading-tight"
                            >
                              {kw}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>

                    {/* 周回 */}
                    <td className="py-1.5 px-2 text-center">
                      {row.roundCount > 0 ? (
                        <span className="text-xs font-bold text-indigo-600">{row.roundCount}回</span>
                      ) : (
                        <span className="text-xs text-slate-300">—</span>
                      )}
                    </td>

                    {/* 最高点 */}
                    <td className="py-1.5 px-2 text-center">
                      {row.latestScore !== null ? (
                        <span className={`text-xs font-black tabular-nums ${scoreColor(row.latestScore, row.maxScore)}`}>
                          {row.latestScore}
                          <span className="text-[10px] font-normal text-slate-300">/{row.maxScore}</span>
                        </span>
                      ) : (
                        <span className="text-xs text-slate-300">—</span>
                      )}
                    </td>

                    {/* 実施日 */}
                    <td className="py-1.5 px-2 text-xs text-slate-500 whitespace-nowrap">
                      {row.latestDate ? formatDate(row.latestDate) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>

                    {/* 計画日（月/日入力） */}
                    <td
                      className="py-1.5 px-2 text-xs text-slate-500"
                      onClick={e => { e.stopPropagation(); setEditingPlanId(row.problem.id) }}
                    >
                      {editingPlanId === row.problem.id ? (
                        <input
                          type="text"
                          placeholder="例: 5/10"
                          defaultValue={row.plannedDate ? formatDate(row.plannedDate) : ''}
                          autoFocus
                          className="w-[4.5rem] border border-indigo-300 rounded px-1 py-0.5 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-400"
                          onKeyDown={e => {
                            if (e.key === 'Enter') {
                              onPlanChange(row.problem.id, (e.target as HTMLInputElement).value)
                              setEditingPlanId(null)
                            }
                            if (e.key === 'Escape') setEditingPlanId(null)
                          }}
                          onBlur={e => {
                            onPlanChange(row.problem.id, e.target.value)
                            setEditingPlanId(null)
                          }}
                          onClick={e => e.stopPropagation()}
                        />
                      ) : row.plannedDate ? (
                        <span className="cursor-pointer hover:text-indigo-600 hover:underline transition-colors whitespace-nowrap">
                          {formatDate(row.plannedDate)}
                        </span>
                      ) : (
                        <span className="text-slate-300 cursor-pointer hover:text-indigo-400 transition-colors">—</span>
                      )}
                    </td>

                    {/* 問題文PDF */}
                    <td
                      className="py-1.5 px-2 text-center"
                      onClick={e => e.stopPropagation()}
                    >
                      {row.problem.questionPdfUrl ? (
                        <a
                          href={row.problem.questionPdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] font-bold text-indigo-500 hover:text-indigo-700 hover:underline transition-colors"
                        >
                          PDF
                        </a>
                      ) : (
                        <span className="text-slate-200 text-[10px]">—</span>
                      )}
                    </td>

                    {/* アクション：3列1行 */}
                    <td
                      className="py-1.5 px-2"
                      onClick={e => e.stopPropagation()}
                    >
                      <div className="flex gap-1 items-center">
                        {/* 解答欄 */}
                        {row.hasAnswer ? (
                          <Link
                            to={`/afternoon/answers/${row.problem.id}/myAnswer`}
                            className="text-[10px] font-bold text-teal-600 border border-teal-300 rounded px-1.5 py-0.5 hover:bg-teal-50 transition-colors leading-tight whitespace-nowrap"
                          >
                            解答欄
                          </Link>
                        ) : (
                          <span className="text-[10px] px-1.5 py-0.5 invisible whitespace-nowrap">解答欄</span>
                        )}
                        {/* 公式解答 */}
                        {row.hasAnswer ? (
                          <Link
                            to={`/afternoon/answers/${row.problem.id}`}
                            className="text-[10px] font-bold text-indigo-600 border border-indigo-300 rounded px-1.5 py-0.5 hover:bg-indigo-50 transition-colors leading-tight whitespace-nowrap"
                          >
                            公式解答
                          </Link>
                        ) : (
                          <span className="text-[10px] px-1.5 py-0.5 invisible whitespace-nowrap">公式解答</span>
                        )}
                        {/* 記録 */}
                        <button
                          onClick={() => onRecord(row.problem)}
                          className="text-[10px] font-bold text-slate-500 border border-slate-200 rounded px-1.5 py-0.5 hover:bg-slate-50 hover:border-slate-300 transition-colors leading-tight whitespace-nowrap"
                        >
                          記録
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </section>
  )
}

// ----------------------------------------------------------------
// Page
// ----------------------------------------------------------------

export default function AfternoonProblems() {
  const [records, setRecords] = useState<PracticeRecord[]>(() => loadRecords())
  const [plans, setPlans] = useState<Record<string, string>>(() => loadPlans())
  const [recordModal, setRecordModal] = useState<AfternoonProblem | null>(null)
  const [historyModal, setHistoryModal] = useState<AfternoonProblem | null>(null)

  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([])
  const [practiceFilter, setPracticeFilter] = useState<PracticeFilter>('all')
  const [sortMode, setSortMode] = useState<SortMode>('score')

  // 全行データ（ソート済み）
  const g1Rows = useMemo(() => buildRows('G1', records, plans, sortMode), [records, plans, sortMode])
  const g2Rows = useMemo(() => buildRows('G2', records, plans, sortMode), [records, plans, sortMode])

  // 全キーワード一覧
  const allKeywords = useMemo(() => {
    const set = new Set<string>()
    afternoonProblems.forEach(p => p.keywords.forEach(kw => set.add(kw)))
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'ja'))
  }, [])

  // フィルタ
  const filterRows = (rows: RowData[]): RowData[] => {
    return rows.filter(row => {
      if (practiceFilter === 'studied' && row.roundCount === 0) return false
      if (practiceFilter === 'unstudied' && row.roundCount > 0) return false
      if (selectedKeywords.length > 0) {
        if (!selectedKeywords.some(kw => row.problem.keywords.includes(kw))) return false
      }
      return true
    })
  }

  const g1Filtered = useMemo(() => filterRows(g1Rows), [g1Rows, practiceFilter, selectedKeywords]) // eslint-disable-line react-hooks/exhaustive-deps
  const g2Filtered = useMemo(() => filterRows(g2Rows), [g2Rows, practiceFilter, selectedKeywords]) // eslint-disable-line react-hooks/exhaustive-deps

  // セパレータ用演習済み数（score モードのみ有効）
  const g1StudiedCount = useMemo(
    () => sortMode === 'score' ? g1Filtered.filter(r => r.roundCount > 0).length : 0,
    [g1Filtered, sortMode],
  )
  const g2StudiedCount = useMemo(
    () => sortMode === 'score' ? g2Filtered.filter(r => r.roundCount > 0).length : 0,
    [g2Filtered, sortMode],
  )

  // 全体の演習済み数（ヘッダー表示用・フィルタ前）
  const totalStudied = useMemo(
    () => [...g1Rows, ...g2Rows].filter(r => r.roundCount > 0).length,
    [g1Rows, g2Rows],
  )
  const totalProblems = g1Rows.length + g2Rows.length

  const hasFilter = selectedKeywords.length > 0 || practiceFilter !== 'all'

  // HistoryModal 用レコード
  const historyRecords = useMemo(() => {
    if (!historyModal) return []
    return records
      .filter(r => r.problemId === historyModal.id)
      .sort((a, b) => b.date.localeCompare(a.date))
  }, [historyModal, records])

  // 記録保存
  function handleSaveRecord(data: { date: string; score: number; plannedDate: string; memo: string }) {
    if (!recordModal) return
    const record = addRecord({
      problemId: recordModal.id,
      date: data.date,
      score: data.score,
      memo: data.memo || undefined,
    })
    if (data.plannedDate) {
      setPlan(recordModal.id, data.plannedDate)
    } else {
      removePlan(recordModal.id)
    }
    setPlans(loadPlans())
    setRecords(prev => [...prev, record])
    setRecordModal(null)
  }

  function handleDeleteRecord(id: string) {
    deleteRecord(id)
    setRecords(loadRecords())
  }

  function handlePlanChange(problemId: string, date: string) {
    if (date) {
      setPlan(problemId, date)
    } else {
      removePlan(problemId)
    }
    setPlans(loadPlans())
  }

  // 履歴モーダルから記録モーダルへ切り替え
  function handleRecordFromHistory() {
    if (!historyModal) return
    const problem = historyModal
    setHistoryModal(null)
    setRecordModal(problem)
  }

  const toggleKeyword = (kw: string) => {
    setSelectedKeywords(prev =>
      prev.includes(kw) ? prev.filter(k => k !== kw) : [...prev, kw],
    )
  }

  const resetFilters = () => {
    setSelectedKeywords([])
    setPracticeFilter('all')
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8fafc' }}>
      <div className="max-w-5xl mx-auto px-4 pb-16 pt-4 space-y-4">

        {/* Header */}
        <section>
          <div className="rounded-xl bg-indigo-700 text-white px-4 py-3 shadow-md flex items-center justify-between gap-4">
            <div>
              <h1 className="text-base font-black leading-snug">午後問題演習補助ツール</h1>
              <p className="text-xs text-indigo-200 mt-0.5">
                H25〜R7 全{totalProblems}問（午後Ⅰ / 午後Ⅱ）
                <span className="mx-2 opacity-50">|</span>
                演習済 {totalStudied} / {totalProblems}問
              </p>
            </div>
            <Link
              to="/"
              className="text-[11px] text-indigo-300 hover:text-white transition-colors flex-shrink-0"
            >
              ← ホーム
            </Link>
          </div>
        </section>

        {/* Filter bar */}
        <section className="bg-white rounded-xl border border-slate-200 px-4 py-3 space-y-2.5">
          {/* キーワードチップ（折り返し・3行折りたたみ） */}
          <div className="flex items-start gap-2">
            <span className="text-[10px] font-bold text-slate-500 flex-shrink-0 mt-0.5 pt-px">キーワード</span>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap gap-1.5">
                {allKeywords.map(kw => {
                  const selected = selectedKeywords.includes(kw)
                  return (
                    <button
                      key={kw}
                      onClick={() => toggleKeyword(kw)}
                      className={`flex-shrink-0 text-[10px] rounded-full px-2 py-0.5 transition-colors ${
                        selected
                          ? 'bg-indigo-600 text-white'
                          : 'border border-slate-300 text-slate-500 hover:border-indigo-400 hover:text-indigo-600'
                      }`}
                    >
                      {kw}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* 絞り込みオプション */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {/* 演習状態フィルタ */}
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-bold text-slate-400 mr-1">演習</span>
              {(['all', 'studied', 'unstudied'] as PracticeFilter[]).map(f => {
                const labels: Record<PracticeFilter, string> = {
                  all: 'すべて',
                  studied: '済み',
                  unstudied: '未',
                }
                return (
                  <button
                    key={f}
                    onClick={() => setPracticeFilter(f)}
                    className={`text-[10px] rounded-full px-2 py-0.5 transition-colors ${
                      practiceFilter === f
                        ? 'bg-indigo-600 text-white'
                        : 'border border-slate-300 text-slate-500 hover:border-indigo-400 hover:text-indigo-600'
                    }`}
                  >
                    {labels[f]}
                  </button>
                )
              })}
            </div>

            {/* 並び替え */}
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-bold text-slate-400 mr-1">並び替え</span>
              {(['score', 'year'] as SortMode[]).map(s => {
                const labels: Record<SortMode, string> = {
                  score: '点数順',
                  year: '年度順',
                }
                return (
                  <button
                    key={s}
                    onClick={() => setSortMode(s)}
                    className={`text-[10px] rounded-full px-2 py-0.5 transition-colors ${
                      sortMode === s
                        ? 'bg-indigo-600 text-white'
                        : 'border border-slate-300 text-slate-500 hover:border-indigo-400 hover:text-indigo-600'
                    }`}
                  >
                    {labels[s]}
                  </button>
                )
              })}
            </div>

            {/* リセット */}
            {hasFilter && (
              <button
                onClick={resetFilters}
                className="text-[10px] font-bold text-slate-400 hover:text-slate-600 border border-slate-200 rounded-full px-2.5 py-0.5 transition-colors ml-auto"
              >
                絞り込みをリセット
              </button>
            )}
          </div>
        </section>

        {/* 午後Ⅰ テーブル */}
        <ProblemTable
          section="G1"
          rows={g1Filtered}
          studiedCount={practiceFilter === 'all' ? g1StudiedCount : g1Filtered.length}
          sortMode={sortMode}
          onRecord={setRecordModal}
          onHistory={setHistoryModal}
          onPlanChange={handlePlanChange}
        />

        {/* 午後Ⅱ テーブル */}
        <ProblemTable
          section="G2"
          rows={g2Filtered}
          studiedCount={practiceFilter === 'all' ? g2StudiedCount : g2Filtered.length}
          sortMode={sortMode}
          onRecord={setRecordModal}
          onHistory={setHistoryModal}
          onPlanChange={handlePlanChange}
        />

      </div>

      {/* Record modal */}
      {recordModal && (
        <RecordModal
          problem={recordModal}
          onSave={handleSaveRecord}
          onClose={() => setRecordModal(null)}
        />
      )}

      {/* History modal */}
      {historyModal && (
        <HistoryModal
          problem={historyModal}
          records={historyRecords}
          onDelete={handleDeleteRecord}
          onAddRecord={handleRecordFromHistory}
          onClose={() => setHistoryModal(null)}
        />
      )}
    </div>
  )
}
