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
  const publishedCount = textbookChapters.filter((chapter) => chapter.status === 'published').length

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 pb-16 pt-6">
        <header className="mb-5 rounded-lg border border-slate-200 bg-white px-5 py-5 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <BookOpenText className="h-6 w-6 text-blue-600" aria-hidden="true" />
                <h1 className="text-2xl font-black text-slate-800">図解で学ぶ教科書</h1>
              </div>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
                ネスペ学習の入口として、通信の流れを図で追いながら基礎を固めます。暗記に入る前に、MAC/IP、L2/L3、ARP、VLANがどうつながるかをつかむための読み物です。
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-center md:w-52">
              <div className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-2">
                <p className="text-lg font-black text-blue-700">{publishedCount}</p>
                <p className="text-[11px] font-bold text-blue-800">公開中</p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                <p className="text-lg font-black text-slate-700">{textbookChapters.length}</p>
                <p className="text-[11px] font-bold text-slate-500">全章</p>
              </div>
            </div>
          </div>
        </header>

        <section className="mb-5 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3">
          <div className="flex gap-3">
            <Sparkles className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" aria-hidden="true" />
            <div className="min-w-0">
              <h2 className="text-sm font-black text-blue-900">教科書は現在試験的に作成中です。完成は未定です。要望次第で作成時期を早める可能性有</h2>
            </div>
          </div>
        </section>

        <section aria-labelledby="chapter-list-heading">
          <div className="mb-3 flex items-end justify-between gap-3">
            <div>
              <h2 id="chapter-list-heading" className="text-xs font-bold uppercase tracking-wider text-slate-500">
                章一覧
              </h2>
              <p className="mt-1 text-xs text-slate-400">ノートモードと近い構成で、初学者向けの読み物として順番に追加します。</p>
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
