import React from 'react'

/**
 * 午後Ⅰ解説のインライン強調マークアップ（マスク機能なし）。
 *   ==text== → 赤太字（重要語・暗記対象・解答の核心）
 *   __text__ → ネイビー太字（構造ラベル・本文中の参照箇所や段階名）
 *
 * ノートモードの RedWord と違い、隠す（マスクする）機能は持たない。
 * 色はノートモードの RedWord / NavyWord に合わせている。
 */
export function MarkupText({ text }: { text: string }) {
  const parts = text.split(/(==.+?==|__.+?__)/g)
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('==') && part.endsWith('==')) {
          return (
            <span key={i} className="font-bold text-red-600">
              {part.slice(2, -2)}
            </span>
          )
        }
        if (part.startsWith('__') && part.endsWith('__')) {
          return (
            <span key={i} className="font-bold" style={{ color: '#1a3a5c' }}>
              {part.slice(2, -2)}
            </span>
          )
        }
        return <React.Fragment key={i}>{part}</React.Fragment>
      })}
    </>
  )
}

export default MarkupText
