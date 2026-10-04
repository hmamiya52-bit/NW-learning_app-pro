/**
 * 表1 FTA の利用時の流れ — R4 午後Ⅰ 問1
 *
 * 項番・概要・説明の3列。説明の列は長い文なので、`whitespace-nowrap` を付けずに折り返し、
 * 375px でも表の中に横スクロールを出さない（H26-G1-2 表1 と同じ組み方）。
 * 概要の列は語の途中で割らない（項番4 は原図どおり「ファイル／アップロード通知」の2行）。
 * 見出しに色は付けない（色は図で「装置かホストか外部か」を表すために取ってある）。
 *
 * 解説を開いたときは、次の句だけを赤で囲む（1つのマスの中で、根拠になる所だけ）。
 *   - 項番1・5 の「PC 又は操作端末」（PC は OA セグメント、操作端末は管理セグメントの端末。設問2(2)）
 *   - 項番3 の「上長は」（承認の操作を許されるのは上長だけ。設問2(3) の認可）
 */

import type { ReactNode } from 'react'
import type { ExamFigureProps } from './tokens'

const TH = 'border border-slate-300 px-1.5 py-1 font-bold text-center align-middle bg-slate-100 text-slate-700'
const TD = 'border border-slate-300 px-1.5 py-1.5 align-middle text-slate-700 leading-snug'

/** 解説を開いたときだけ、その句を赤で囲む */
function Mark({ on, children }: { on: boolean; children: ReactNode }) {
  if (!on) return <>{children}</>
  return <span className="rounded-sm bg-red-50 font-bold text-red-700 ring-2 ring-red-500">{children}</span>
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

export default function R4G11Tab1({ highlight = false }: ExamFigureProps) {
  const rows: { no: string; summary: string; body: ReactNode }[] = [
    {
      no: '1',
      summary: 'アップロード',
      body: (
        <>
          {'送信者は，FTA に HTTPS（HTTP over TLS）でアクセスし，'}
          <Mark on={highlight}>PC 又は操作端末</Mark>
          {'から FTA にファイルをアップロードする。'}
        </>
      ),
    },
    { no: '2', summary: '承認依頼', body: '上長宛ての承認依頼メールが，FTA から内部メールサーバに自動送信される。' },
    {
      no: '3',
      summary: '承認',
      body: (
        <>
          <Mark on={highlight}>上長は</Mark>
          {'，PC でメールを確認後，FTA に HTTPS でアクセスし，ファイルの中身を確認した上で承認する。'}
        </>
      ),
    },
    {
      no: '4',
      summary: 'ファイル|アップロード通知',
      body: '受信者宛てのファイルアップロード通知メールが，FTA から内部メールサーバに自動送信される。',
    },
    {
      no: '5',
      summary: 'ダウンロード',
      body: (
        <>
          {'受信者は，PC でメールを確認後，FTA に HTTPS でアクセスし，ファイルを '}
          <Mark on={highlight}>PC 又は操作端末</Mark>
          {'にダウンロードする。'}
        </>
      ),
    },
  ]
  return (
    <div className="overflow-x-auto">
      <table className="border-collapse text-[11px] mx-auto w-full" style={{ maxWidth: 560 }}>
        <thead>
          <tr>
            <th className={`${TH} whitespace-nowrap`}>項番</th>
            <th className={`${TH} whitespace-nowrap`}>概要</th>
            <th className={TH}>説明</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.no}>
              <td className={`${TD} text-center`}>{r.no}</td>
              <td className={TD}>
                <Chunks text={r.summary} />
              </td>
              <td className={TD}>{r.body}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
