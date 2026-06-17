import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  BookOpenText,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Construction,
  RotateCcw,
} from 'lucide-react'
import TextbookCallout from '../components/textbook/TextbookCallout'
import TextbookDiagram from '../components/textbook/TextbookDiagram'
import TextbookRichText from '../components/textbook/TextbookRichText'
import { getTextbookChapter, textbookChapters, type TextbookChapter } from '../data/textbookChapters'
import {
  getTextbookReadState,
  markTextbookChapterRead,
  markTextbookChapterUnread,
} from '../lib/textbookReadState'

function ReadButton({
  chapterId,
  isRead,
  onChange,
}: {
  chapterId: string
  isRead: boolean
  onChange: (next: ReturnType<typeof getTextbookReadState>) => void
}) {
  if (isRead) {
    return (
      <button
        type="button"
        onClick={() => onChange(markTextbookChapterUnread(chapterId))}
        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      >
        <RotateCcw className="h-4 w-4" aria-hidden="true" />
        未読に戻す
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={() => onChange(markTextbookChapterRead(chapterId))}
      className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
    >
      <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
      既読にする
    </button>
  )
}

function DraftChapter({ chapter }: { chapter: TextbookChapter }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-3xl px-4 pb-16 pt-6">
        <Link to="/textbook" className="inline-flex items-center gap-1 text-sm font-bold text-blue-600 hover:text-blue-700">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          章一覧へ
        </Link>
        <div className="mt-8 rounded-lg border border-slate-200 bg-white px-5 py-8 text-center shadow-sm">
          <Construction className="mx-auto h-10 w-10 text-slate-400" aria-hidden="true" />
          <h1 className="mt-3 text-xl font-black text-slate-800">{chapter.title}</h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">{chapter.description}</p>
          <p className="mt-4 text-sm font-bold text-slate-400">この章は準備中です。</p>
        </div>
      </div>
    </div>
  )
}

function MissingChapter() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-3xl px-4 pb-16 pt-6">
        <Link to="/textbook" className="inline-flex items-center gap-1 text-sm font-bold text-blue-600 hover:text-blue-700">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          章一覧へ
        </Link>
        <div className="mt-8 rounded-lg border border-slate-200 bg-white px-5 py-8 text-center shadow-sm">
          <BookOpenText className="mx-auto h-10 w-10 text-slate-400" aria-hidden="true" />
          <h1 className="mt-3 text-xl font-black text-slate-800">章が見つかりません</h1>
          <p className="mt-2 text-sm text-slate-500">章一覧から読みたい章を選んでください。</p>
        </div>
      </div>
    </div>
  )
}

function ChapterNavCard({ chapter, direction }: { chapter: TextbookChapter | undefined; direction: 'prev' | 'next' }) {
  const label = direction === 'prev' ? '前の章' : '次の章'
  const Icon = direction === 'prev' ? ChevronLeft : ChevronRight

  if (!chapter) {
    return (
      <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-400">
        {label}はありません
      </div>
    )
  }

  if (chapter.status === 'draft') {
    return (
      <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
        <p className="text-[11px] font-bold text-slate-400">{label}</p>
        <p className="mt-1 text-sm font-black text-slate-500">{chapter.title}</p>
        <p className="mt-1 text-xs font-bold text-slate-400">準備中</p>
      </div>
    )
  }

  return (
    <Link
      to={`/textbook/${chapter.id}`}
      className="group rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm transition-all hover:border-blue-300 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
    >
      <p className="text-[11px] font-bold text-slate-400">{label}</p>
      <div className="mt-1 flex items-center justify-between gap-3">
        {direction === 'prev' && <Icon className="h-4 w-4 text-slate-300 transition-colors group-hover:text-blue-500" aria-hidden="true" />}
        <p className="min-w-0 flex-1 text-sm font-black text-slate-800">{chapter.title}</p>
        {direction === 'next' && <Icon className="h-4 w-4 text-slate-300 transition-colors group-hover:text-blue-500" aria-hidden="true" />}
      </div>
    </Link>
  )
}

function FocusList({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null
  return (
    <section className="rounded-lg border border-slate-200 bg-white px-4 py-4 shadow-sm">
      <h2 className="text-sm font-black text-slate-800">{title}</h2>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-sm leading-relaxed text-slate-600">
            <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-500" />
            <span>
              <TextbookRichText text={item} />
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default function TextbookChapter() {
  const { chapterId } = useParams()
  const chapter = getTextbookChapter(chapterId)
  const [readState, setReadState] = useState(() => getTextbookReadState())

  if (!chapter) return <MissingChapter />
  if (chapter.status === 'draft') return <DraftChapter chapter={chapter} />

  const isRead = Boolean(readState[chapter.id])
  const currentIndex = textbookChapters.findIndex((item) => item.id === chapter.id)
  const prevChapter = currentIndex > 0 ? textbookChapters[currentIndex - 1] : undefined
  const nextChapter = currentIndex >= 0 ? textbookChapters[currentIndex + 1] : undefined
  const hasFocusItems = chapter.examFocus.length > 0 || chapter.practicalFocus.length > 0 || chapter.pitfalls.length > 0

  return (
    <div className="min-h-screen bg-slate-50">
      <article className="mx-auto max-w-4xl px-4 pb-16 pt-6">
        <nav className="mb-4" aria-label="パンくず">
          <Link to="/textbook" className="inline-flex items-center gap-1 text-sm font-bold text-blue-600 hover:text-blue-700">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            章一覧へ
          </Link>
        </nav>

        <header className="rounded-lg border border-slate-200 bg-white px-5 py-5 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Chapter {chapter.order}</p>
              <h1 className="mt-1 text-2xl font-black leading-tight text-slate-800">{chapter.title}</h1>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{chapter.description}</p>
            </div>
            <div className="flex flex-shrink-0 items-center gap-2">
              {isRead && (
                <span className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">
                  <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                  既読
                </span>
              )}
              <ReadButton chapterId={chapter.id} isRead={isRead} onChange={setReadState} />
            </div>
          </div>

          {chapter.intro.length > 0 && (
            <div className="mt-4 space-y-2 border-t border-slate-100 pt-4">
              {chapter.intro.map((paragraph) => (
                <p key={paragraph} className="text-sm leading-relaxed text-slate-700">
                  <TextbookRichText text={paragraph} />
                </p>
              ))}
            </div>
          )}
        </header>

        {chapter.status === 'diagram' && (
          <section className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
            <div className="flex gap-3">
              <Construction className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-700" aria-hidden="true" />
              <div className="min-w-0">
                <h2 className="text-sm font-black text-amber-950">工事中: この章は図解部分のみ先行公開中です</h2>
                <p className="mt-1 text-xs font-bold leading-relaxed text-amber-900">
                  説明文は後続工程で追加します。現在は構成図、観測点、動く図解を先に確認できる状態です。
                </p>
              </div>
            </div>
          </section>
        )}

        <div className="mt-5 space-y-5">
          {chapter.sections.map((section, index) => (
            <section key={section.heading} id={`textbook-section-${index + 1}`} className="scroll-mt-16 rounded-lg border border-slate-200 bg-white px-5 py-5 shadow-sm">
              <div className="flex items-start gap-3">
                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-blue-50 text-sm font-black text-blue-700">
                  {index + 1}
                </span>
                <div className="min-w-0">
                  <h2 className="text-lg font-black leading-snug text-slate-800">{section.heading}</h2>
                  {section.body.length > 0 && (
                    <div className="mt-3 space-y-3">
                      {section.body.map((paragraph) => (
                        <p key={paragraph} className="text-sm leading-7 text-slate-700">
                          <TextbookRichText text={paragraph} />
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {section.diagrams && section.diagrams.length > 0 && (
                <div className="mt-5 space-y-4">
                  {section.diagrams.map((diagram) => (
                    <TextbookDiagram key={diagram.title} diagram={diagram} />
                  ))}
                </div>
              )}

              {section.callouts && section.callouts.length > 0 && (
                <div className="mt-4 space-y-3">
                  {section.callouts.map((callout) => (
                    <TextbookCallout key={callout.title} callout={callout} />
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>

        {hasFocusItems && (
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <FocusList title="ネスペで見るところ" items={chapter.examFocus} />
            <FocusList title="実務で効くところ" items={chapter.practicalFocus} />
            <FocusList title="つまずきやすいところ" items={chapter.pitfalls} />
          </div>
        )}

        {chapter.summary.length > 0 && (
          <section className="mt-5 rounded-lg border border-blue-100 bg-blue-50 px-5 py-5">
            <h2 className="text-base font-black text-blue-900">この章のまとめ</h2>
            <ul className="mt-3 space-y-2">
              {chapter.summary.map((item) => (
                <li key={item} className="flex gap-2 text-sm leading-relaxed text-blue-900">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600" aria-hidden="true" />
                  <span>
                    <TextbookRichText text={item} />
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="mt-5 flex flex-col gap-3 rounded-lg border border-slate-200 bg-white px-4 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-bold text-slate-600">
            {isRead ? 'この章は既読です。' : '読み終えたら既読にできます。'}
          </p>
          <ReadButton chapterId={chapter.id} isRead={isRead} onChange={setReadState} />
        </div>

        <nav className="mt-5 grid gap-3 md:grid-cols-2" aria-label="章ナビゲーション">
          <ChapterNavCard chapter={prevChapter} direction="prev" />
          <ChapterNavCard chapter={nextChapter} direction="next" />
        </nav>

        <div className="mt-5 flex justify-center">
          <Link
            to="/textbook"
            className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-white px-4 py-2 text-sm font-black text-blue-700 shadow-sm transition-colors hover:border-blue-300 hover:bg-blue-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            章一覧に戻る
          </Link>
        </div>
      </article>
    </div>
  )
}
