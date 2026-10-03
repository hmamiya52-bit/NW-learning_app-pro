/**
 * 表2 MSV 移行工程の概要 — H28 午後Ⅰ 問3
 *
 * 長い文の箇条書きが入る2列の表なので HTML で組み、概要の列は折り返す（H26-G1-2 表1 と同じ）。
 * 見出しに色は付けない。原図の「・」の箇条は、2行目以降を字下げしてそろえる。
 * 下線③ は原図どおり下線で示す。
 *
 * 解説を開いたときは、次の箇条を赤で強調する。
 *   - 開始工程の、MGW の転送先を VIP1 に変える箇条（社外からのメールがまず新 MSV に入る。設問3(2)(3)）
 *   - 移行工程の (2) 下線③（設問3(4)）
 *   - 移行工程の、未変更社員が混在する箇条（設問3(2)(3)）
 */

import type { ReactNode } from 'react'
import type { ExamFigureProps } from './tokens'

const TH = 'border border-slate-300 px-1.5 py-1 font-bold text-center align-middle bg-slate-100 text-slate-700'
const NAME = 'border border-slate-300 px-1.5 py-1.5 align-middle text-center text-slate-700 whitespace-nowrap'
const TD = 'border border-slate-300 px-1.5 py-1 align-top text-slate-700'
/** 解説を開いたときに、その箇条が説明の対象だと示す */
const MARK = 'rounded-sm bg-red-50 text-red-700 font-bold ring-2 ring-red-500'

/** 「・」の箇条（2行目以降を記号の幅だけ字下げする） */
function Item({ children, mark = false }: { children: ReactNode; mark?: boolean }) {
  return (
    <div className={`flex py-0.5 ${mark ? MARK : ''}`}>
      <span className="shrink-0">・</span>
      <div className="min-w-0">{children}</div>
    </div>
  )
}

/** 移行工程の (1)・(2) の小項目 */
function Sub({ no, children, mark = false }: { no: string; children: ReactNode; mark?: boolean }) {
  return (
    <div className={`flex py-0.5 ${mark ? MARK : ''}`}>
      <span className="shrink-0 pr-1">{no}</span>
      <div className="min-w-0">{children}</div>
    </div>
  )
}

export default function H28G13Tab2({ highlight = false }: ExamFigureProps) {
  return (
    <div className="overflow-x-auto">
      <table className="border-collapse text-[11px] leading-relaxed mx-auto w-full" style={{ maxWidth: 560 }}>
        <thead>
          <tr>
            <th className={`${TH} whitespace-nowrap`}>工程名</th>
            <th className={TH}>各工程の概要</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className={NAME}>開始工程</td>
            <td className={TD}>
              <Item>現行 NW に対し，機器の追加，設定を行い，移行中 NW を構築する。</Item>
              <Item mark={highlight}>MGW1，2 の，社内宛てメールの転送先 IP アドレスを，VIP1 に変更する。</Item>
              <Item>開始工程終了時点では，社員がアクセスする MSV は，旧 MSV だけである。</Item>
            </td>
          </tr>
          <tr>
            <td className={NAME}>移行工程</td>
            <td className={TD}>
              <Item>
                次の二つの実施によって，社員ごとに，メール送受信サーバを新 MSV に変更する。
                <Sub no="(1)">
                  PC と新 MSV の間でメール送受信を行えるように，PC のメールソフトのメール送受信サーバ設定に，新 MSV
                  を追加する。また，旧 MSV の使用も継続できるように，旧 MSV の設定は残す。この設定作業は，各社員が行う。
                </Sub>
                <Sub no="(2)" mark={highlight}>
                  各社員の申告に基づいて，<span className="underline underline-offset-2">③ LDAP の情報を変更する</span>
                  （申告を受け付け，LDAP の情報を変更する Web アプリケーションが，事前に用意されている）。
                </Sub>
              </Item>
              <Item mark={highlight}>
                各社員は，任意の日時に，移行工程の作業を実施する。このため，移行工程の期間は，メール送受信サーバの変更を実施済みの社員と，未実施の社員（以下，未変更社員という）が混在する。
              </Item>
              <Item>
                移行工程の期間は，あらかじめ全社員に周知する。その期間の経過後は，未変更社員が残っていても，次行程（終了工程）に移る。
              </Item>
            </td>
          </tr>
          <tr>
            <td className={NAME}>終了工程</td>
            <td className={TD}>
              <Item>
                新 MSV の設定を変更し，LDAP の情報によるメールルーティングを停止する。この後の未変更社員宛てのメールは，新 MSV の
                MBOX に格納される。未変更社員は，PC のメールソフトのメール送受信サーバ設定を変更するまで，新たなメールの受信が行えない。
              </Item>
              <Item>事前に周知した期間経過後，旧 MSV を停止する。旧 MSV に残ったメールは，消去する。</Item>
              <Item>各社員は，PC のメールソフトのメール送受信サーバ設定から，旧 MSV の定義を削除する。</Item>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
