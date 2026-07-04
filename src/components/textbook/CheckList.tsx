import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import type { CheckItem } from '../../data/textbook/types'
import TextbookRichText from './TextbookRichText'

// 確認問題・設問例のカード。答えはタップで開閉（思い出してから確かめる）。
function CheckCard({ item, badge }: { item: CheckItem; badge: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="px-3.5 py-3">
        <p className="flex items-start gap-2 text-sm leading-relaxed text-slate-800">
          <span className="mt-0.5 flex-shrink-0 rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-black text-blue-700">{badge}</span>
          <span className="font-bold">
            <TextbookRichText text={item.question} />
          </span>
        </p>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="mt-2 inline-flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 transition-colors hover:bg-blue-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          {open ? <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" /> : <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />}
          {open ? '答えを閉じる' : '答えを見る'}
        </button>
        {open && (
          <div className="mt-2 rounded-md border border-blue-100 bg-blue-50/60 px-3 py-2.5">
            <p className="text-sm leading-relaxed text-slate-800">
              <span className="mr-1.5 rounded bg-blue-600 px-1.5 py-0.5 text-[10px] font-black text-white">答え</span>
              <TextbookRichText text={item.answer} />
            </p>
            {item.note && (
              <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                <TextbookRichText text={item.note} />
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default function CheckList({ items, badge = '確認' }: { items: CheckItem[]; badge?: string }) {
  return (
    <div className="space-y-2.5">
      {items.map((item, i) => (
        <CheckCard key={i} item={item} badge={items.length > 1 ? `${badge}${i + 1}` : badge} />
      ))}
    </div>
  )
}
