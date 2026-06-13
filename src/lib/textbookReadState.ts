export type TextbookReadMap = Record<string, string>

const TEXTBOOK_READ_KEY = 'nwsp:textbook:read_chapters:v1'

function canUseStorage(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

function loadReadMap(): TextbookReadMap {
  if (!canUseStorage()) return {}
  try {
    const raw = window.localStorage.getItem(TEXTBOOK_READ_KEY)
    return raw ? (JSON.parse(raw) as TextbookReadMap) : {}
  } catch {
    return {}
  }
}

function saveReadMap(map: TextbookReadMap): void {
  if (!canUseStorage()) return
  window.localStorage.setItem(TEXTBOOK_READ_KEY, JSON.stringify(map))
}

export function getTextbookReadState(): TextbookReadMap {
  return loadReadMap()
}

export function isTextbookChapterRead(chapterId: string): boolean {
  return Boolean(loadReadMap()[chapterId])
}

export function markTextbookChapterRead(chapterId: string): TextbookReadMap {
  const map = loadReadMap()
  const next = { ...map, [chapterId]: new Date().toISOString() }
  saveReadMap(next)
  return next
}

export function markTextbookChapterUnread(chapterId: string): TextbookReadMap {
  const map = loadReadMap()
  const next = { ...map }
  delete next[chapterId]
  saveReadMap(next)
  return next
}
