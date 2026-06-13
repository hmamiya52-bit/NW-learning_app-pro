import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  BookOpenText,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Construction,
  Sparkles,
} from 'lucide-react'
import { textbookChapters, type TextbookChapter } from '../data/textbookChapters'
import { getTextbookReadState } from '../lib/textbookReadState'

const STATUS_STYLES = {
  published: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  draft: 'bg-slate-100 text-slate-500 border-slate-200',
} as const

function ChapterStatus({ chapter, isRead }: { chapter: TextbookChapter; isRead: boolean }) {
  if (chapter.status === 'draft') {
    return (
      <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[11px] font-bold ${STATUS_STYLES.draft}`}>
        <Construction className="h-3.5 w-3.5" aria-hidden="true" />
        準備中
      </span>
    )
  }

  if (isRead) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2 py-1 text-[11px] font-bold text-blue-700">
        <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
        既読
      </span>
    )
  }

  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[11px] font-bold ${STATUS_STYLES.published}`}>
      <BookOpenText className="h-3.5 w-3.5" aria-hidden="true" />
      公開中
    </span>
  )
}

function ChapterCard({ chapter, isRead }: { chapter: TextbookChapter; isRead: boolean }) {
  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-slate-100 text-sm font-black text-slate-600">
            {chapter.order}
          </span>
          <div className="min-w-0">
            <h2 className="text-sm font-black leading-snug text-slate-800">{chapter.title}</h2>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">{chapter.description}</p>
          </div>
        </div>
        {chapter.status === 'published' && (
          <ChevronRight className="mt-2 h-4 w-4 flex-shrink-0 text-slate-300 transition-colors group-hover:text-blue-500" aria-hidden="true" />
        )}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <ChapterStatus chapter={chapter} isRead={isRead} />
        {chapter.estimatedMinutes > 0 && (
          <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2 py-1 text-[11px] font-bold text-slate-500">
            <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
            約{chapter.estimatedMinutes}分
          </span>
        )}
      </div>
    </>
  )

  if (chapter.status === 'draft') {
    return (
      <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-4 opacity-80">
        {body}
      </div>
    )
  }

  return (
    <Link
      to={`/textbook/${chapter.id}`}
      className="group rounded-lg border border-slate-200 bg-white px-4 py-4 shadow-sm transition-all hover:border-blue-300 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
      aria-label={`${chapter.title}を読む`}
    >
      {body}
    </Link>
  )
}

export default function Textbook() {
  const [readState] = useState(() => getTextbookReadState())

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 pb-16 pt-6">
        <header className="mb-5">
          <div className="flex items-center gap-2">
            <BookOpenText className="h-6 w-6 text-blue-600" aria-hidden="true" />
            <h1 className="text-2xl font-black text-slate-800">教科書モード</h1>
          </div>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
            ネスペ学習の最初に読むための、図解中心の入門テキストです。ノートモードの前に、通信の流れと設計の考え方をつかみます。
          </p>
        </header>

        <section className="mb-5 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3">
          <div className="flex gap-3">
            <Sparkles className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" aria-hidden="true" />
            <div className="min-w-0">
              <h2 className="text-sm font-black text-blue-900">紙の教科書では見えないところも動かして見る</h2>
              <p className="mt-1 text-sm leading-relaxed text-blue-800">
                第1章では、ARP要求、L2SW転送、ルータ転送をステップ再生できるパケットフローを入れています。
              </p>
            </div>
          </div>
        </section>

        <section aria-labelledby="chapter-list-heading">
          <div className="mb-3 flex items-end justify-between gap-3">
            <div>
              <h2 id="chapter-list-heading" className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Chapters
              </h2>
              <p className="mt-1 text-xs text-slate-400">章はノートモードの構成に合わせて、順番に追加します。</p>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {textbookChapters.map((chapter) => (
              <ChapterCard key={chapter.id} chapter={chapter} isRead={Boolean(readState[chapter.id])} />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
