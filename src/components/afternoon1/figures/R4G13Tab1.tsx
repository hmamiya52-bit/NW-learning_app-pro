/**
 * 表1 FW に設定されている通信を許可するルール — R4 午後Ⅰ 問3
 *
 * 5列の表なので HTML で組む。見出しに色は付けない（色は図で「装置かホストか外部か」を表すために取ってある）。
 * アクセス経路のマスは原図どおり2行・2行・3行をまとめる。空欄 ア〜カ は原図どおり太枠の箱で示し、
 * 注記と注 1) は表の下に置く（H28-G1-1 表1 と同じ）。
 * 375px（表の幅 273px）に横スクロールなしで入れるため、文字を 10px、左右の余白を 2px に詰め、
 * 折り返してよい所だけを `|` で決める（語の途中では割らない）。
 *
 * 設問1(3)・(4) はこの表の空欄を埋める設問。解説を開いたときは、空欄のマスを赤で囲み、箱の下に解答例を赤で出す
 * （ア と イ は3か所に出るので、3か所とも出す）。
 */

import type { ExamFigureProps } from './tokens'

const TH = 'border border-slate-300 px-0.5 py-1 font-bold text-center align-middle bg-slate-100 text-slate-700 leading-snug'
const TD = 'border border-slate-300 px-0.5 py-1.5 align-middle text-slate-700 leading-snug'
/** 解説を開いたときに、そのマスが説明の対象だと示す */
const MARK = 'bg-red-50 ring-2 ring-inset ring-red-500'

/** 空欄ごとの解答例（解説を開いたときだけ出す） */
const ANSWER: Record<string, string> = {
  ア: '外部 DNS|サーバ',
  イ: 'UDP/53',
  ウ: '公開 Web|サーバ',
  エ: 'プロキシ|サーバ',
  オ: 'any',
  カ: '社内 DNS|サーバ',
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
    <>
      <Blank label={label} />
      {highlight && (
        <span className="mt-0.5 block font-bold text-red-700">
          <Chunks text={ANSWER[label]} />
        </span>
      )}
    </>
  )
}

/** 空欄だけのマス（送信元・宛先） */
function BlankCell({ label, highlight }: { label: string; highlight: boolean }) {
  return (
    <td className={`${TD} text-center ${highlight ? MARK : ''}`}>
      <BlankWithAnswer label={label} highlight={highlight} />
    </td>
  )
}

/** 「TCP/53，イ」のマス */
function DnsPortCell({ highlight }: { highlight: boolean }) {
  return (
    <td className={`${TD} ${highlight ? MARK : ''}`}>
      <span className="whitespace-nowrap">TCP/53，</span>
      <wbr />
      <BlankWithAnswer label="イ" highlight={highlight} />
    </td>
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

/** TCP/8080 と注 1) の印 */
function Proxy8080() {
  return (
    <td className={TD}>
      <span className="whitespace-nowrap">
        TCP/8080<sup className="ml-0.5 text-[8px]">1)</sup>
      </span>
    </td>
  )
}

export default function R4G13Tab1({ highlight = false }: ExamFigureProps) {
  return (
    <div className="overflow-x-auto">
      <table className="border-collapse text-[10px] mx-auto w-full" style={{ maxWidth: 520 }}>
        <thead>
          <tr>
            <th className={`${TH} whitespace-nowrap`}>項番</th>
            <th className={TH}>
              <Chunks text="アクセス|経路" />
            </th>
            <th className={TH}>送信元</th>
            <th className={TH}>宛先</th>
            <th className={TH}>
              <Chunks text="プロトコル／|ポート番号" />
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <Cell text="1" center />
            <td rowSpan={2} className={TD}>
              <Chunks text="インターネット|→DMZ" />
            </td>
            <Cell text="any" center />
            <BlankCell label="ア" highlight={highlight} />
            <DnsPortCell highlight={highlight} />
          </tr>
          <tr>
            <Cell text="2" center />
            <Cell text="any" center />
            <BlankCell label="ウ" highlight={highlight} />
            <Cell text="TCP/443" />
          </tr>
          <tr>
            <Cell text="3" center />
            <td rowSpan={2} className={TD}>
              <Chunks text="DMZ→|インターネット" />
            </td>
            <BlankCell label="ア" highlight={highlight} />
            <Cell text="any" center />
            <DnsPortCell highlight={highlight} />
          </tr>
          <tr>
            <Cell text="4" center />
            <BlankCell label="エ" highlight={highlight} />
            <BlankCell label="オ" highlight={highlight} />
            <Cell text="TCP/80，|TCP/443" />
          </tr>
          <tr>
            <Cell text="5" center />
            <td rowSpan={3} className={TD}>
              <Chunks text="内部 LAN|→DMZ" />
            </td>
            <BlankCell label="カ" highlight={highlight} />
            <BlankCell label="ア" highlight={highlight} />
            <DnsPortCell highlight={highlight} />
          </tr>
          <tr>
            <Cell text="6" center />
            <Cell text="サーバ|セグメント" />
            <Cell text="プロキシ|サーバ" />
            <Proxy8080 />
          </tr>
          <tr>
            <Cell text="7" center />
            <Cell text="PC |セグメント" />
            <Cell text="プロキシ|サーバ" />
            <Proxy8080 />
          </tr>
        </tbody>
      </table>
      <div className="mx-auto mt-1 space-y-0.5 text-[10px] text-slate-500" style={{ maxWidth: 520 }}>
        <p>注記 FW は，ステートフルパケットインスペクション機能をもつ。</p>
        <p>注 1) TCP/8080 は，代替 HTTP のポートである。</p>
      </div>
    </div>
  )
}
