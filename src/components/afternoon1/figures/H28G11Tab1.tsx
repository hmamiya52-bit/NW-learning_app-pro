/**
 * 表1 OP25B のためのアクセスリスト — H28 午後Ⅰ 問1
 *
 * 2段の見出しの語（プロトコル（TCP/UDP/IP）など）を持つ6列の表なので HTML で組む。
 * 見出しに色は付けない（色は図で「装置かホストか外部か」を表すために取ってある）。
 * 空欄 オ・カ・キ は原図どおり太枠の箱で示し、注記（“－”）は表の下に置く。
 *
 * 375px（表の幅 273px）に6列を横スクロールなしで入れるため、文字を 10px、左右の余白を 2px に詰め、
 * マスの中では折り返さない（「禁止」「許可」が1字ずつに割れるのを防ぐ）。
 * 一番広い「（TCP/UDP/IP）」だけは、「TCP/」の後で折り返してよいことにした
 * （「UDP/」の後で折ると、解説を開いて「a.b.0.0/20」を出したときに 10px はみ出した）。
 *
 * 設問2(3) はこの表の空欄を埋める設問。解説を開いたときは、空欄のマスを赤で囲み、
 * 箱の下に解答例（TCP・a.b.0.0/20・25）を赤で出す。
 */

import type { ExamFigureProps } from './tokens'

const TH = 'border border-slate-300 px-0.5 py-1 font-bold text-center align-middle bg-slate-100 text-slate-700 leading-snug'
const TD = 'border border-slate-300 px-0.5 py-1.5 text-center align-middle text-slate-700 whitespace-nowrap'
/** 解説を開いたときに、そのマスが説明の対象だと示す */
const MARK = 'bg-red-50 ring-2 ring-inset ring-red-500'

/** 原図の空欄の箱 */
function Blank({ label }: { label: string }) {
  return <span className="inline-block min-w-[2.4em] border-2 border-slate-700 px-1.5 leading-tight">{label}</span>
}

/** 空欄のマス。解説を開いたときだけ、箱の下に解答例を出す */
function BlankCell({ label, answer, highlight }: { label: string; answer: string; highlight: boolean }) {
  return (
    <td className={`${TD} ${highlight ? MARK : ''}`}>
      <Blank label={label} />
      {highlight && <div className="mt-0.5 font-bold text-red-700">{answer}</div>}
    </td>
  )
}

/** 見出しの行（それぞれの行の中では折り返さない） */
function Head({ lines }: { lines: string[] }) {
  return (
    <th className={TH}>
      {lines.map((ln) => (
        <span key={ln} className="block whitespace-nowrap">
          {ln}
        </span>
      ))}
    </th>
  )
}

export default function H28G11Tab1({ highlight = false }: ExamFigureProps) {
  return (
    <div className="overflow-x-auto">
      <table className="border-collapse text-[10px] mx-auto w-full" style={{ maxWidth: 400 }}>
        <thead>
          <tr>
            <Head lines={['項番']} />
            <Head lines={['動作']} />
            <th className={TH}>
              <span className="block whitespace-nowrap">プロトコル</span>
              <span className="whitespace-nowrap">（TCP/</span>
              <wbr />
              <span className="whitespace-nowrap">UDP/IP）</span>
            </th>
            <Head lines={['送信元', 'IP アドレス']} />
            <Head lines={['宛先', 'IP アドレス']} />
            <Head lines={['宛先', 'ポート番号']} />
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className={TD}>1</td>
            <td className={TD}>禁止</td>
            <BlankCell label="オ" answer="TCP" highlight={highlight} />
            <BlankCell label="カ" answer="a.b.0.0/20" highlight={highlight} />
            <td className={TD}>any</td>
            <BlankCell label="キ" answer="25" highlight={highlight} />
          </tr>
          <tr>
            <td className={TD}>2</td>
            <td className={TD}>許可</td>
            <td className={TD}>IP</td>
            <td className={TD}>any</td>
            <td className={TD}>any</td>
            <td className={TD}>－</td>
          </tr>
        </tbody>
      </table>
      <p className="mx-auto mt-1 text-[10px] text-slate-500" style={{ maxWidth: 400 }}>
        注記 “－”は，設定がないことを示す。
      </p>
    </div>
  )
}
