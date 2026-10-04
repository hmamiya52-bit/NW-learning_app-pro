/**
 * 表1 Wi-Fi の世代の仕様比較 — R5 午後Ⅰ 問3
 *
 * 1列目と1行目が見出しの表なので HTML で組む。左上の空きマスの斜線も原図どおり描く。
 * 見出しに色は付けない（色は図で「装置かホストか外部か」を表すために取ってある）。
 * 375px（表の幅 273px）に横スクロールなしで入れるため、文字を 10px、左右の余白を 2px に詰め、折り返してよい所だけを `|` で決める。
 * 割れない塊のうち「IEEE802.11ax」（68.5）と「（W52/W53/W56）」（96.4）が広く、4列が入らなかったので、「IEEE」の後ろ・
 * 「W52/」「W53/」の後ろ・「MU-MIMO」の後ろでも折り返せるようにした（語の途中では割らない。1024px では原図どおり1行）。
 * 略語の説明（bps・QAM・MIMO など）は記号を含まないが、原図どおり表の下に置く。
 *
 * 解説を開いたときは、Wi-Fi 6 の周波数帯のマスを赤で囲み、トライバンドで 5 GHz 帯を分ける2つ（W52/W53 と W56。設問2(1)）を
 * 赤の枠で示し、DFS が要る帯（W53・W56。設問2(2)）を赤の文字で添える。空間分割多重のマス（MU-MIMO。設問1 b）も囲む。
 */

import type { ExamFigureProps } from './tokens'

const TH = 'border border-slate-300 px-0.5 py-1 font-bold text-center align-middle bg-slate-100 text-slate-700 leading-snug'
const ROW = 'border border-slate-300 px-0.5 py-1 text-left align-middle bg-slate-50 font-normal text-slate-700 leading-snug'
const TD = 'border border-slate-300 px-0.5 py-1 text-left align-middle text-slate-700 leading-snug'
/** 解説を開いたときに、そのマスが説明の対象だと示す */
const MARK = 'bg-red-50 ring-2 ring-inset ring-red-500'
/** 解説を開いたときに、5 GHz 帯の分け方を示す枠 */
const PART = 'rounded-sm px-px font-bold text-red-700 ring-1 ring-red-500'

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

/** 1列目の見出し（項目名） */
function RowHead({ text }: { text: string }) {
  return (
    <th scope="row" className={ROW}>
      <Chunks text={text} />
    </th>
  )
}

/** 値のマス。lines は原図の改行どおりに並べる */
function Cell({ lines, mark = false }: { lines: string[]; mark?: boolean }) {
  return (
    <td className={`${TD} ${mark ? MARK : ''}`}>
      {lines.map((ln) => (
        <span key={ln} className="block">
          <Chunks text={ln} />
        </span>
      ))}
    </td>
  )
}

/** Wi-Fi 6 の周波数帯のマス。解説を開いたときは、5 GHz 帯の2つの分け方と DFS の対象を示す */
function Wifi6Band({ highlight }: { highlight: boolean }) {
  if (!highlight) return <Cell lines={['2.4 GHz', '5 GHz|（W52/|W53/|W56）']} />
  return (
    <td className={`${TD} ${MARK}`}>
      <span className="block">2.4 GHz</span>
      <span className="block">
        <span className="whitespace-nowrap">5 GHz</span>
        <wbr />
        <span className="whitespace-nowrap">
          （<span className={PART}>W52/W53</span>/
        </span>
        <wbr />
        <span className="whitespace-nowrap">
          <span className={PART}>W56</span>）
        </span>
      </span>
      <span className="mt-0.5 block font-bold text-red-700">
        <Chunks text="DFS：|W53・W56" />
      </span>
    </td>
  )
}

export default function R5G13Tab1({ highlight = false }: ExamFigureProps) {
  return (
    <div className="overflow-x-auto">
      <table className="border-collapse text-[10px] mx-auto w-full" style={{ maxWidth: 520 }}>
        <thead>
          <tr>
            {/* 原図の左上の空きマス（斜線） */}
            <th className={`${TH} relative`}>
              <svg aria-hidden="true" className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <line x1={0} y1={0} x2={100} y2={100} stroke="#94a3b8" strokeWidth={1} vectorEffect="non-scaling-stroke" />
              </svg>
            </th>
            <th className={`${TH} whitespace-nowrap`}>Wi-Fi 4</th>
            <th className={`${TH} whitespace-nowrap`}>Wi-Fi 5</th>
            <th className={`${TH} whitespace-nowrap`}>Wi-Fi 6</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <RowHead text="無線 LAN |規格" />
            <Cell lines={['IEEE|802.11n']} />
            <Cell lines={['IEEE|802.11ac']} />
            <Cell lines={['IEEE|802.11ax']} />
          </tr>
          <tr>
            <RowHead text="最大通信|速度|（理論値）" />
            <Cell lines={['600 Mbps']} />
            <Cell lines={['6.9 Gbps']} />
            <Cell lines={['9.6 Gbps']} />
          </tr>
          <tr>
            <RowHead text="周波数帯" />
            <Cell lines={['2.4 GHz', '5 GHz|（W52/|W53/|W56）']} />
            <Cell lines={['5 GHz|（W52/|W53/|W56）']} />
            <Wifi6Band highlight={highlight} />
          </tr>
          <tr>
            <RowHead text="変調方式" />
            <Cell lines={['64-QAM']} />
            <Cell lines={['256-QAM']} />
            <Cell lines={['1024-QAM']} />
          </tr>
          <tr>
            <RowHead text="空間分割|多重" />
            <Cell lines={['MIMO']} />
            <Cell lines={['MU-MIMO |4 台|（下り）']} />
            <Cell lines={['MU-MIMO |8 台|（上り／|下り）']} mark={highlight} />
          </tr>
          <tr>
            <RowHead text="多重方式" />
            <Cell lines={['OFDM']} />
            <Cell lines={['OFDM']} />
            <Cell lines={['OFDMA']} />
          </tr>
        </tbody>
      </table>
      <p className="mx-auto mt-1 text-[10px] text-slate-500" style={{ maxWidth: 520 }}>
        {[
          'bps：ビット／秒',
          'QAM：Quadrature Amplitude Modulation',
          'MIMO：Multiple Input and Multiple Output',
          'OFDM：Orthogonal Frequency Division Multiplexing',
          'MU-MIMO：Multi-User Multiple Input and Multiple Output',
          'OFDMA：Orthogonal Frequency Division Multiple Access',
        ].map((s) => (
          <span key={s} className="mr-3 inline-block">
            {s}
          </span>
        ))}
      </p>
    </div>
  )
}
