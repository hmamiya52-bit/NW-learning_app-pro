import type { BadgeTier } from '../data/badges'

// ----------------------------------------------------------------
// Types
// ----------------------------------------------------------------

export interface QuizSessionPayload {
  mode: 'topic' | 'weakness' | 'random' | 'important'
  categoryId: string | null
  categoryName: string | null
  questionCount: number
  correctCount: number
  answerMode: 'multiple-choice' | 'written'
}

export interface NoteCheckPayload {
  noteId: string
  noteName: string
  level: 'green' | 'yellow' | 'red'
  sectionLabel: string
}

export interface BadgePayload {
  badgeId: string
  badgeName: string
  tier: BadgeTier
}

export interface AfternoonPayload {
  problemId: string
  year: string        // e.g. 'R6', 'H25'
  section: 'G1' | 'G2'
  number: number
  title: string
  score: number
  recordId: string
}

export type ActivityEvent =
  | { id: string; type: 'quiz-session';      date: string; createdAt: string; xp: number; payload: QuizSessionPayload }
  | { id: string; type: 'note-check';        date: string; createdAt: string; xp: number; payload: NoteCheckPayload }
  | { id: string; type: 'badge-unlock';      date: string; createdAt: string; xp: number; payload: BadgePayload }
  | { id: string; type: 'afternoon-record';  date: string; createdAt: string; xp: number; payload: AfternoonPayload }

export interface DaySummary {
  date: string
  totalXp: number
  events: ActivityEvent[]
}

// ----------------------------------------------------------------
// Storage
// ----------------------------------------------------------------

const KEY = 'nwsp:activityLog'
const MAX_EVENTS = 500

export function loadActivityLog(): ActivityEvent[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as ActivityEvent[]) : []
  } catch {
    return []
  }
}

export function addActivityEvent(event: Omit<ActivityEvent, 'id'>): void {
  const events = loadActivityLog()
  const newEvent = { ...event, id: crypto.randomUUID() } as ActivityEvent
  events.push(newEvent)
  const pruned = events.length > MAX_EVENTS ? events.slice(events.length - MAX_EVENTS) : events
  localStorage.setItem(KEY, JSON.stringify(pruned))
}

// ----------------------------------------------------------------
// Aggregation
// ----------------------------------------------------------------

export function getDaySummaries(events: ActivityEvent[]): DaySummary[] {
  const map = new Map<string, ActivityEvent[]>()
  for (const e of events) {
    const arr = map.get(e.date) ?? []
    arr.push(e)
    map.set(e.date, arr)
  }
  return Array.from(map.entries())
    .map(([date, evts]) => ({
      date,
      totalXp: evts.reduce((s, e) => s + e.xp, 0),
      events: evts.sort((a, b) => a.createdAt.localeCompare(b.createdAt)),
    }))
    .sort((a, b) => b.date.localeCompare(a.date))
}

export function getRecentDaySummaries(n: number): DaySummary[] {
  return getDaySummaries(loadActivityLog()).slice(0, n)
}

export function getAllDaySummaries(): DaySummary[] {
  return getDaySummaries(loadActivityLog())
}
