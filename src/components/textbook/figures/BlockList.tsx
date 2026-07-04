import { AlertTriangle, Info, Lightbulb } from 'lucide-react'
import type { Block, CalloutTone } from '../../../data/textbook/types'
import CheckList from '../CheckList'
import TextbookRichText from '../TextbookRichText'
import FigureRenderer from './FigureRenderer'

const CALLOUT: Record<CalloutTone, { wrap: string; icon: typeof Info; iconColor: string; title: string }> = {
  info: { wrap: 'border-blue-200 bg-blue-50', icon: Info, iconColor: 'text-blue-600', title: 'text-blue-900' },
  warn: { wrap: 'border-rose-200 bg-rose-50', icon: AlertTriangle, iconColor: 'text-rose-600', title: 'text-rose-900' },
  tip: { wrap: 'border-emerald-200 bg-emerald-50', icon: Lightbulb, iconColor: 'text-emerald-600', title: 'text-emerald-900' },
}

export default function BlockList({ blocks }: { blocks: Block[] }) {
  return (
    <div className="space-y-4">
      {blocks.map((block, i) => {
        if (block.kind === 'text') {
          return (
            <p key={i} className="text-[15px] leading-7 text-slate-700">
              <TextbookRichText text={block.text} />
            </p>
          )
        }
        if (block.kind === 'callout') {
          const c = CALLOUT[block.tone]
          const Icon = c.icon
          return (
            <div key={i} className={`flex gap-2.5 rounded-lg border px-3.5 py-3 ${c.wrap}`}>
              <Icon className={`mt-0.5 h-4 w-4 flex-shrink-0 ${c.iconColor}`} aria-hidden="true" />
              <div className="min-w-0">
                <p className={`text-sm font-black ${c.title}`}>{block.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-slate-700">
                  <TextbookRichText text={block.body} />
                </p>
              </div>
            </div>
          )
        }
        if (block.kind === 'check') {
          return <CheckList key={i} items={block.items} badge={block.label ?? '確認'} />
        }
        return <FigureRenderer key={i} figure={block.figure} />
      })}
    </div>
  )
}
