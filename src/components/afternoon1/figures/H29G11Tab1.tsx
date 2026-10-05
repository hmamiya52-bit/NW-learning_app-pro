/**
 * 表1 通信を許可する FW ルール設定（抜粋）— H29 午後Ⅰ 問1
 *
 * 5列の表なので HTML で組む。見出しに色は付けない（色は図で「装置かホストか外部か」を表すために取ってある）。
 * 空欄 カ・キ・ク・ケ は原図どおり太枠の箱で示す（1行目のアクセス経路は「 カ → キ 」）。
 * 375px（表の幅 273px）に横スクロールなしで入れるため、R5-G1-2 表1 と同じく文字を 10px、左右の余白を 2px に詰め、
 * 折り返してよい所だけを `|` で決める。割れない塊のうちアドレス（「202.y.44.0/28」69.3）と見出しの「／宛先ポート」（54.7）が広く、
 * 5列が 313px まで広がったので、アドレスは「202.y.44.」の後ろ、見出しは「IP 」「／宛先」の後ろでも折り返せるようにし、
 * 1行目の「 カ → キ 」は キ の前で折り返せるようにした（1024px では原図どおり1行）。
 *
 * 設問3 はこの表の空欄を埋める設問。解説を開いたときは、空欄のマスを赤で囲み、箱の下に解答例を赤で出す。
 */

import type { ExamFigureProps } from './tokens'

const TH = 'border border-slate-300 px-0.5 py-1 font-bold text-center align-middle bg-slate-100 text-slate-700 leading-snug'
const TD = 'border border-slate-300 px-0.5 py-1.5 align-middle text-slate-700 leading-snug'
/** 解説を開いたときに、そのマスが説明の対象だと示す */
const MARK = 'bg-red-50 ring-2 ring-inset ring-red-500'

/** 空欄ごとの解答例（解説を開いたときだけ出す） */
const ANSWER: Record<string, string> = {
  カ: '内部 LAN',
  キ: 'DMZ',
  ク: '172.16.|0.0/16',
  ケ: '202.y.44.|2/32',
}

/** `|` の所でだけ折り返す */
function Chunks({ text }: { text: string }) {
  const parts = text.split('|')
  return (
    <>
      {parts.map((p, i) => (
        <span key={`${i}-${p}`}>
          {i > 0 && <wbr />}
          <span className="whitespace-nowrap">{p}</span>
        </span>
      ))}
    </>
  )
}

/** 原図の空欄の箱 */
function Blank({ label }: { label: string }) {
  return <span className="inline-block min-w-[2.4em] border-2 border-slate-700 px-1 text-center leading-tight">{label}</span>
}

/** 空欄の箱と、解説を開いたときの解答例 */
function BlankWithAnswer({ label, highlight }: { label: string; highlight: boolean }) {
  return (
    <span className="inline-block text-center align-top">
      <Blank label={label} />
      {highlight && (
        <span className="mt-0.5 block font-bold text-red-700">
          <Chunks text={ANSWER[label]} />
        </span>
      )}
    </span>
  )
}

/** 字句だけのマス */
function Cell({ text, center = false }: { text: string; center?: boolean }) {
  return (
    <td className={`${TD} ${center ? 'text-center' : ''}`}>
      <Chunks text={text} />
    </td>
  )
}

export default function H29G11Tab1({ highlight = false }: ExamFigureProps) {
  return (
    <div className="overflow-x-auto">
      <table className="border-collapse text-[10px] mx-auto w-full" style={{ maxWidth: 560 }}>
        <thead>
          <tr>
            <th className={TH}>
              <Chunks text="アクセス|経路" />
            </th>
            <th className={TH}>
              <Chunks text="送信元|IP |アドレス" />
            </th>
            <th className={TH}>
              <Chunks text="宛先|IP |アドレス" />
            </th>
            <th className={TH}>
              <Chunks text="プロトコル|／宛先|ポート" />
            </th>
            <th className={TH}>
              <Chunks text="アドレス|変換" />
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className={`${TD} ${highlight ? MARK : ''}`}>
              <BlankWithAnswer label="カ" highlight={highlight} />
              <wbr />
              <span className="whitespace-nowrap">
                <span className="mx-0.5 align-top">→</span>
                <BlankWithAnswer label="キ" highlight={highlight} />
              </span>
            </td>
            <td className={`${TD} text-center ${highlight ? MARK : ''}`}>
              <BlankWithAnswer label="ク" highlight={highlight} />
            </td>
            <Cell text="202.y.44.|0/28" />
            <Cell text="任意" />
            <Cell text="無" center />
          </tr>
          <tr>
            <Cell text="DMZ→|インターネット" />
            <Cell text="202.y.44.|0/28" />
            <Cell text="任意" />
            <Cell text="任意" />
            <Cell text="無" center />
          </tr>
          <tr>
            <Cell text="インターネット|→DMZ" />
            <Cell text="任意" />
            <td className={`${TD} text-center ${highlight ? MARK : ''}`}>
              <BlankWithAnswer label="ケ" highlight={highlight} />
            </td>
            <Cell text="TCP/443" />
            <Cell text="無" center />
          </tr>
        </tbody>
      </table>
    </div>
  )
}
