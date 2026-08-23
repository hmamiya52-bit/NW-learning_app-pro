interface Props {
  /** この図の全ステップの説明文（表示順）。高さの決定に使う。 */
  texts: string[]
  /** 現在のステップ */
  index: number
  /** 外枠のクラス。余白と最低高（既定の図は mt-2 min-h-12）。 */
  className?: string
  /** 1行ぶんのクラス。字送り・色（既定の図は text-sm・slate-700）。 */
  textClassName?: string
}

/**
 * ステッパー図の説明文。
 *
 * 全ステップを同じグリッドセルに重ねて置き、現在の歩だけを見せる。セルの高さは
 * 「その図の最長の歩」で決まり、歩を送っても変わらない＝**操作ボタンが動かない**。
 *
 * 以前は `h-12` 固定で、どの図も全角35字が上限だった（図解仕様 §7.1）。ボタン不動は
 * 保てるが、字数が全図一律に縛られるため技術的な補足を削る必要があった。重ねる方式なら
 * 不動のまま、上限がその図の中身だけで決まる。
 *
 * 高さ決めの複製は `aria-hidden` かつ `invisible`（visibility:hidden）なので、読み上げにも
 * ページ内検索にも出ない。読み上げは現在の歩を持つ `aria-live` の1つだけが担う。
 */
export default function StepExplanation({ texts, index, className = '', textClassName = '' }: Props) {
  return (
    <div className={`grid ${className}`}>
      {texts.map((t, i) => (
        <p key={i} aria-hidden="true" className={`invisible col-start-1 row-start-1 flex items-start ${textClassName}`}>
          {t}
        </p>
      ))}
      <p aria-live="polite" className={`col-start-1 row-start-1 flex items-start ${textClassName}`}>
        {texts[index]}
      </p>
    </div>
  )
}
