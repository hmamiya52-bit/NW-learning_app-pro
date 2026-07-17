import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BookOpenText, CheckCircle2, ChevronRight, Clock3, Construction, Sparkles } from 'lucide-react'
import { textbookChapters, type TextbookChapter } from '../data/textbook'
import { getTextbookReadState } from '../lib/textbookReadState'

function ChapterStatus({ chapter, isRead }: { chapter: TextbookChapter; isRead: boolean }) {
  if (chapter.status === 'draft') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100 px-2 py-1 text-[11px] font-bold text-slate-500">
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
    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-[11px] font-bold text-emerald-700">
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
            <p className="mt-1 text-xs leading-relaxed text-slate-500">{chapter.summary}</p>
          </div>
        </div>
        {chapter.status !== 'draft' && (
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
    return <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-4 opacity-80">{body}</div>
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
  const draftCount = textbookChapters.filter((chapter) => chapter.status === 'draft').length

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
                ネスペ学習の入口です。小さな構成図の上でパケットを動かしながら、MAC/IP、L2/L3、ARP、VLANがどうつながるかを、図を中心につかんでいきます。
              </p>
            </div>
            <div className={`grid ${draftCount > 0 ? 'grid-cols-3' : 'grid-cols-2'} gap-2 text-center md:w-72`}>
              <div className="rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-2">
                <p className="text-lg font-black text-emerald-700">{publishedCount}</p>
                <p className="text-[11px] font-bold text-emerald-800">公開中</p>
              </div>
              {draftCount > 0 && (
                <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                  <p className="text-lg font-black text-slate-600">{draftCount}</p>
                  <p className="text-[11px] font-bold text-slate-500">準備中</p>
                </div>
              )}
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
              <h2 className="text-sm font-black text-blue-900">全20章が公開済みです。第1章から順に読むと、構成図が少しずつ育っていきます。</h2>
            </div>
          </div>
        </section>

        <section aria-labelledby="chapter-list-heading">
          <div className="mb-3 flex items-end justify-between gap-3">
            <div>
              <h2 id="chapter-list-heading" className="text-xs font-bold uppercase tracking-wider text-slate-500">
                章一覧
              </h2>
              <p className="mt-1 text-xs text-slate-400">初学者向けの読み物です。第1章から順に読む前提で作られています。</p>
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
