/**
 * 図2 A 社ドメインの SPF レコードの設定（抜粋）— H28 午後Ⅰ 問1
 *
 * DNS のゾーンファイルの1行なので、等幅の文字で読ませたい。SVG ではなく HTML で組む
 * （R6-G1-3 図4 の PAC ファイルと同じ扱い）。原図は1行で、名前と IN TXT のあいだを広く空けている。
 * 375px では1行に収まらないので、その空きの所でだけ折り返す（語の途中では割らない）。
 * 注記（x.y.z.1 は MSV3 の IP アドレス）は examFigures の note に置く。
 *
 * 解説を開いたときは、問い合わせる名前（a-sha.co.jp.。設問3(1) の MAIL FROM で得たドメイン）と、
 * 照合に使う ip4 の指定（設問3(2)）を赤で示す。
 */

import type { ExamFigureProps } from './tokens'

/** 解説を開いたときに、その部分が説明の対象だと示す */
const MARK = 'bg-red-50 text-red-700 font-bold ring-1 ring-inset ring-red-400 rounded-sm'

export default function H28G11Fig2({ highlight = false }: ExamFigureProps) {
  const mark = highlight ? MARK : undefined
  return (
    <div className="mx-auto rounded-sm border border-slate-400 bg-white px-3 py-2" style={{ maxWidth: 400 }}>
      <div className="font-mono text-[11px] leading-relaxed text-slate-700">
        <span className="whitespace-pre">
          <span className={mark}>a-sha.co.jp.</span>
          {'      '}
        </span>
        <wbr />
        <span className="whitespace-pre">
          {'IN TXT "v=spf1 '}
          <span className={mark}>+ip4:x.y.z.1</span>
          {' -all"'}
        </span>
      </div>
    </div>
  )
}
