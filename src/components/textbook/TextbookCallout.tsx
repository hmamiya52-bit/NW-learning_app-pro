import { BookOpen, Info, Sparkles, TriangleAlert } from 'lucide-react'
import type { TextbookCallout as TextbookCalloutData } from '../../data/textbookChapters'
import TextbookRichText from './TextbookRichText'

interface TextbookCalloutProps {
  callout: TextbookCalloutData
}

const CALLOUT_STYLES = {
  important: {
    frame: 'border-blue-200 bg-blue-50 text-blue-900',
    icon: 'text-blue-600',
    Icon: Info,
  },
  practical: {
    frame: 'border-emerald-200 bg-emerald-50 text-emerald-900',
    icon: 'text-emerald-600',
    Icon: BookOpen,
  },
  exam: {
    frame: 'border-indigo-200 bg-indigo-50 text-indigo-900',
    icon: 'text-indigo-600',
    Icon: BookOpen,
  },
  pitfall: {
    frame: 'border-amber-200 bg-amber-50 text-amber-900',
    icon: 'text-amber-600',
    Icon: TriangleAlert,
  },
  analogy: {
    frame: 'border-teal-200 bg-teal-50 text-teal-900',
    icon: 'text-teal-600',
    Icon: Sparkles,
  },
} as const

export default function TextbookCallout({ callout }: TextbookCalloutProps) {
  const style = CALLOUT_STYLES[callout.type]
  const Icon = style.Icon

  return (
    <aside className={`rounded-lg border px-4 py-3 ${style.frame}`}>
      <div className="flex gap-3">
        <Icon className={`mt-0.5 h-5 w-5 flex-shrink-0 ${style.icon}`} aria-hidden="true" />
        <div className="min-w-0">
          <h4 className="text-sm font-black leading-snug">{callout.title}</h4>
          <div className="mt-1.5 space-y-1.5">
            {callout.body.map((paragraph) => (
              <p key={paragraph} className="text-sm leading-relaxed">
                <TextbookRichText text={paragraph} />
              </p>
            ))}
          </div>
        </div>
      </div>
    </aside>
  )
}
