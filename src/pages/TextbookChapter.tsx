import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  BookOpenText,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Construction,
  RotateCcw,
} from 'lucide-react'
import BlockList from '../components/textbook/figures/BlockList'
import CheckList from '../components/textbook/CheckList'
import TextbookRichText from '../components/textbook/TextbookRichText'
import { getTextbookChapter, textbookChapters, type TextbookChapter } from '../data/textbook'
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
          <p className="mt-2 text-sm leading-relaxed text-slate-500">{chapter.summary}</p>
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

export default function TextbookChapter() {
  const { chapterId } = useParams()
  const chapter = getTextbookChapter(chapterId)
  const [readState, setReadState] = useState(() => getTextbookReadState())

  // 章を切り替えたら（前/次の章ボタン・一覧からの遷移）ページ先頭から表示する。
  // ハッシュ（節アンカー）が付いているときは、その位置への移動を妨げない。
  useEffect(() => {
    if (!window.location.hash) window.scrollTo(0, 0)
  }, [chapterId])

  if (!chapter) return <MissingChapter />
  if (chapter.status === 'draft') return <DraftChapter chapter={chapter} />

  const isRead = Boolean(readState[chapter.id])
  const currentIndex = textbookChapters.findIndex((item) => item.id === chapter.id)
  const prevChapter = currentIndex > 0 ? textbookChapters[currentIndex - 1] : undefined
  const nextChapter = currentIndex >= 0 ? textbookChapters[currentIndex + 1] : undefined

  return (
    <div className="min-h-screen bg-slate-50">
      <article className="mx-auto max-w-3xl px-4 pb-16 pt-6">
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
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{chapter.summary}</p>
              {chapter.estimatedMinutes > 0 && (
                <span className="mt-3 inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-bold text-slate-500">
                  <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
                  約{chapter.estimatedMinutes}分
                </span>
              )}
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
            <div className="mt-4 border-t border-slate-100 pt-4">
              <BlockList blocks={chapter.intro} />
            </div>
          )}

          {chapter.sections.length > 0 && (
            <details className="mt-4 rounded-lg border border-slate-100 bg-slate-50/70 px-3.5 py-2.5">
              <summary className="cursor-pointer select-none text-sm font-bold text-slate-700">この章の内容</summary>
              <ol className="mt-2 space-y-1.5">
                {chapter.sections.map((section, index) => (
                  <li key={section.heading}>
                    <a
                      href={`#textbook-section-${index + 1}`}
                      className="flex items-start gap-2 rounded text-sm font-bold text-slate-600 hover:text-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    >
                      <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded bg-blue-50 text-[11px] font-black text-blue-700">
                        {index + 1}
                      </span>
                      <span className="leading-snug">{section.heading}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </details>
          )}
        </header>

        <div className="mt-5 space-y-5">
          {chapter.sections.map((section, index) => (
            <section
              key={section.heading}
              id={`textbook-section-${index + 1}`}
              className="scroll-mt-16 rounded-lg border border-slate-200 bg-white px-4 py-5 shadow-sm sm:px-5"
            >
              <div className="mb-4 flex items-start gap-3">
                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-blue-50 text-sm font-black text-blue-700">
                  {index + 1}
                </span>
                <h2 className="pt-0.5 text-lg font-black leading-snug text-slate-800">{section.heading}</h2>
              </div>
              <BlockList blocks={section.blocks} />
            </section>
          ))}
        </div>

        {chapter.checks && chapter.checks.length > 0 && (
          <section className="mt-5 rounded-lg border border-slate-200 bg-white px-4 py-5 shadow-sm sm:px-5">
            <h2 className="text-base font-black text-slate-800">理解の確認</h2>
            <p className="mt-1 text-xs font-bold text-slate-400">答えを思い浮かべてから、開いて確かめてください</p>
            <div className="mt-3">
              <CheckList items={chapter.checks} badge="Q" />
            </div>
          </section>
        )}

        {chapter.takeaways.length > 0 && (
          <section className="mt-5 rounded-lg border border-blue-100 bg-blue-50 px-5 py-5">
            <h2 className="text-base font-black text-blue-900">この章で持ち帰る考え方</h2>
            <ul className="mt-3 space-y-2">
              {chapter.takeaways.map((item) => (
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
