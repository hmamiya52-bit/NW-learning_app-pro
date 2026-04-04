import type { AnswerRecord, UserProgress, StudySession, Bookmark } from '../types'

const KEYS = {
  ANSWER_RECORDS: 'nwsp:answer_records',
  USER_PROGRESS: 'nwsp:user_progress',
  STUDY_SESSIONS: 'nwsp:study_sessions',
  BOOKMARKS: 'nwsp:bookmarks',
} as const

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function save<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value))
}

// --- AnswerRecord ---
export function getAnswerRecords(): AnswerRecord[] {
  return load(KEYS.ANSWER_RECORDS, [])
}
export function addAnswerRecord(record: AnswerRecord): void {
  const records = getAnswerRecords()
  save(KEYS.ANSWER_RECORDS, [...records, record])
}

// --- UserProgress ---
export function getAllProgress(): UserProgress[] {
  return load(KEYS.USER_PROGRESS, [])
}
export function getProgress(topicId: string): UserProgress {
  const all = getAllProgress()
  return (
    all.find((p) => p.topicId === topicId) ?? {
      topicId,
      totalAttempts: 0,
      correctCount: 0,
      lastStudiedAt: '',
      isBookmarked: false,
    }
  )
}
export function updateProgress(topicId: string, isCorrect: boolean): void {
  const all = getAllProgress()
  const existing = all.find((p) => p.topicId === topicId)
  const updated: UserProgress = existing
    ? {
        ...existing,
        totalAttempts: existing.totalAttempts + 1,
        correctCount: existing.correctCount + (isCorrect ? 1 : 0),
        lastStudiedAt: new Date().toISOString(),
      }
    : {
        topicId,
        totalAttempts: 1,
        correctCount: isCorrect ? 1 : 0,
        lastStudiedAt: new Date().toISOString(),
        isBookmarked: false,
      }
  const next = existing
    ? all.map((p) => (p.topicId === topicId ? updated : p))
    : [...all, updated]
  save(KEYS.USER_PROGRESS, next)
}
export function toggleBookmark(topicId: string): void {
  const all = getAllProgress()
  const existing = all.find((p) => p.topicId === topicId)
  if (existing) {
    save(
      KEYS.USER_PROGRESS,
      all.map((p) =>
        p.topicId === topicId ? { ...p, isBookmarked: !p.isBookmarked } : p
      )
    )
  }
}

// --- StudySession ---
export function getStudySessions(): StudySession[] {
  return load(KEYS.STUDY_SESSIONS, [])
}
export function saveStudySession(session: StudySession): void {
  const sessions = getStudySessions()
  const next = sessions.find((s) => s.id === session.id)
    ? sessions.map((s) => (s.id === session.id ? session : s))
    : [...sessions, session]
  save(KEYS.STUDY_SESSIONS, next)
}

// --- Bookmarks (Question-level) ---
export function getBookmarks(): Bookmark[] {
  return load(KEYS.BOOKMARKS, [])
}
export function toggleQuestionBookmark(questionId: string): boolean {
  const bookmarks = getBookmarks()
  const exists = bookmarks.some((b) => b.questionId === questionId)
  if (exists) {
    save(KEYS.BOOKMARKS, bookmarks.filter((b) => b.questionId !== questionId))
    return false
  } else {
    save(KEYS.BOOKMARKS, [...bookmarks, { questionId, createdAt: new Date().toISOString() }])
    return true
  }
}

// --- 統計ヘルパー ---
export function calcCorrectRate(topicId: string): number {
  const p = getProgress(topicId)
  if (p.totalAttempts === 0) return 0
  return Math.round((p.correctCount / p.totalAttempts) * 100)
}

export function resetAllData(): void {
  Object.values(KEYS).forEach((k) => localStorage.removeItem(k))
}
