import { useEffect, useState } from 'react'

// スマホ幅判定。トポロジを横並び/縦並びへ切り替えるために使う。
export function useIsNarrow(maxWidth = 520) {
  const query = `(max-width: ${maxWidth}px)`
  const [narrow, setNarrow] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false,
  )

  useEffect(() => {
    // 初期値は useState の initializer 済み。ここでは変化の購読だけを行う。
    const mql = window.matchMedia(query)
    const handler = (e: MediaQueryListEvent) => setNarrow(e.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [query])

  return narrow
}
