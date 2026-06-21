import { useCallback, useState } from 'react'

// ステップ管理（手動送りのみ。自動再生は持たない）。
export function useStepper(count: number) {
  const [index, setIndex] = useState(0)

  const go = useCallback(
    (next: number) => setIndex(Math.max(0, Math.min(count - 1, next))),
    [count],
  )
  const next = useCallback(() => go(index + 1), [go, index])
  const prev = useCallback(() => go(index - 1), [go, index])

  return { index, setIndex: go, next, prev, count }
}
