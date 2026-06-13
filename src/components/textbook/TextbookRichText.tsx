import type { ReactNode } from 'react'

interface TextbookRichTextProps {
  text: string
  className?: string
}

const EMPHASIS_PATTERN = /(\*\*[^*]+\*\*|\[\[(blue|green|amber|red|slate):[^\]]+\]\])/g

const COLOR_STYLES = {
  blue: 'font-black text-blue-700',
  green: 'font-black text-emerald-700',
  amber: 'font-black text-amber-700',
  red: 'font-black text-rose-700',
  slate: 'font-black text-slate-900',
} as const

function renderToken(raw: string, key: string): ReactNode {
  if (raw.startsWith('**') && raw.endsWith('**')) {
    return (
      <strong key={key} className="font-black text-slate-900">
        {raw.slice(2, -2)}
      </strong>
    )
  }

  if (raw.startsWith('[[') && raw.endsWith(']]')) {
    const body = raw.slice(2, -2)
    const separatorIndex = body.indexOf(':')
    const color = body.slice(0, separatorIndex) as keyof typeof COLOR_STYLES
    const text = body.slice(separatorIndex + 1)

    return (
      <strong key={key} className={COLOR_STYLES[color] ?? COLOR_STYLES.slate}>
        {text}
      </strong>
    )
  }

  return raw
}

export default function TextbookRichText({ text, className }: TextbookRichTextProps) {
  const parts: ReactNode[] = []
  let lastIndex = 0

  for (const match of text.matchAll(EMPHASIS_PATTERN)) {
    const index = match.index ?? 0
    if (index > lastIndex) {
      parts.push(<span key={`text-${lastIndex}`}>{text.slice(lastIndex, index)}</span>)
    }
    parts.push(renderToken(match[0], `${index}-${match[0]}`))
    lastIndex = index + match[0].length
  }

  if (lastIndex < text.length) {
    parts.push(<span key={`text-${lastIndex}`}>{text.slice(lastIndex)}</span>)
  }

  return <span className={className}>{parts}</span>
}
