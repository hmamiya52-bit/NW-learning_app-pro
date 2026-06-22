import type { ReactNode } from 'react'
import { Lightbulb } from 'lucide-react'
import TextbookRichText from '../TextbookRichText'

interface Props {
  title: string
  caption: string
  takeaway?: string
  children: ReactNode
}

// 図1つ＝1理解単位の共通枠。タイトル・見どころ（1行）・本体・誤解しない点（1行）。
export default function FigureFrame({ title, caption, takeaway, children }: Props) {
  return (
    <figure className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <figcaption className="border-b border-slate-100 px-4 py-2.5">
        <h3 className="text-sm font-black text-slate-800">{title}</h3>
        <p className="mt-0.5 text-xs leading-relaxed text-slate-500">
          <TextbookRichText text={caption} />
        </p>
      </figcaption>
      <div className="px-3 py-3 sm:px-4">{children}</div>
      {takeaway && (
        <div className="flex items-start gap-2 border-t border-amber-100 bg-amber-50 px-4 py-2">
          <Lightbulb className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600" aria-hidden="true" />
          <p className="text-xs font-bold leading-relaxed text-amber-900">
            <TextbookRichText text={takeaway} />
          </p>
        </div>
      )}
    </figure>
  )
}
