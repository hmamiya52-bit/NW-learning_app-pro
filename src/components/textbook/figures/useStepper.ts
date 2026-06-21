import { useCallback, useEffect, useRef, useState } from 'react'

// ステップ管理。自動再生は最後で必ず停止する（無限アニメにしない＝スクショ安定）。
export function useStepper(count: number, intervalMs = 1600) {
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const timer = useRef<number | null>(null)

  const clear = useCallback(() => {
    if (timer.current !== null) {
      window.clearTimeout(timer.current)
      timer.current = null
    }
  }, [])

  const stop = useCallback(() => {
    clear()
    setPlaying(false)
  }, [clear])

  const go = useCallback(
    (next: number) => {
      stop()
      setIndex(Math.max(0, Math.min(count - 1, next)))
    },
    [count, stop],
  )

  const next = useCallback(() => go(index + 1), [go, index])
  const prev = useCallback(() => go(index - 1), [go, index])

  const togglePlay = useCallback(() => {
    if (playing) {
      stop()
      return
    }
    setIndex((cur) => (cur >= count - 1 ? 0 : cur))
    setPlaying(true)
  }, [playing, stop, count])

  useEffect(() => {
    if (!playing || index >= count - 1) return
    timer.current = window.setTimeout(() => {
      // 最後の1歩へ進むタイミングで再生を止める（setState は callback 内＝同期 setState を避ける）
      if (index >= count - 2) setPlaying(false)
      setIndex((cur) => Math.min(count - 1, cur + 1))
    }, intervalMs)
    return clear
  }, [playing, index, count, intervalMs, clear])

  useEffect(() => clear, [clear])

  return { index, setIndex: go, next, prev, playing, togglePlay, count }
}
