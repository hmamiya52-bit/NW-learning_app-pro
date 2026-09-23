import { useId } from 'react'

/**
 * 試験図を自作 SVG で描き直すための共通トークン。
 *
 * すべての図はモバイル 375px（表示幅およそ 280px）で読めることを前提に、
 * viewBox 幅 340 を基準に設計する。
 */

/**
 * 図の色は「役割」でしか変えない。基本は3色だけ。
 *
 * 色数を絞るのは見やすさのためだけではない。**色に意味を持たせる**ためである。
 * 同じ役割のものは必ず同じ色になり、色が違えば役割が違う。
 * 「なぜここだけ色が違うのか」を読み手に考えさせないことが目的なので、
 * 「彩りを添える」「目立たせたい」という理由で色を変えてはいけない。
 *
 * 強調したいときは色を足すのではなく、MARK（解説を開いたときだけ出る赤）を使う。
 */
export const TONE = {
  /**
   * 自社側のネットワーク装置・自社の網。
   * ルータ／L2SW／L3SW／LB／FW／SD-WAN装置／BGPルータ／DDoS 検知のための装置／自社の AS。
   */
  device: { fill: '#eff6ff', stroke: '#60a5fa', text: '#1e40af' },
  /**
   * サーバ・PC・端末（通信の当事者になるホスト）。
   * 配信サーバ／プロキシサーバ／DDoS 検知サーバ／PC／ゲーム端末。
   */
  host: { fill: '#fffbeb', stroke: '#f59e0b', text: '#92400e' },
  /**
   * 自社の外にあるもの。他社の網と、他社が持つ装置。
   * インターネット／ISP／IX／他社の AS／MPLS VPN 網／PE（キャリアの装置）／SaaS。
   */
  outside: { fill: '#f1f5f9', stroke: '#94a3b8', text: '#334155' },
} as const

export type ToneName = keyof typeof TONE

/** 物理的な接続線（装置どうしをつなぐ線） */
export const LINE = '#94a3b8'
/** 拠点・データセンターなどの実線の囲み */
export const FRAME = '#64748b'
/** セグメント・サブネットなどの破線の囲み */
export const SEGMENT = '#94a3b8'
/**
 * 論理的な関係を表す線（BGP ピア・NetFlow の送信方向など、物理配線ではないもの）。
 * 色相では区別しない。LINE より濃くし、破線＋矢印で見分ける。
 */
export const LOGICAL = '#475569'
/** 凡例・補足ラベルの文字 */
export const MUTED = '#64748b'

/**
 * 解説を開いたときだけ出す強調の色。
 *
 * 基本3色（青・橙・灰）に無い赤なので、「図がもともと持っている区別」ではなく
 * 「解説のための書き込み」だと一目で分かる。図を閉じているときは一切出さない。
 */
export const MARK = '#dc2626'
export const MARK_FILL = '#fef2f2'
export const MARK_TEXT = '#991b1b'

/**
 * 図中の文字の倍率。
 *
 * 座標（箱の大きさ・線の位置）を触らずに、図の文字だけを一括で大きくするための1本のつまみ。
 * 個々の図が渡す size は「図の中での大小関係」を表し、実際の描画は size * FONT_SCALE になる。
 *
 * 上げすぎると箱から文字がはみ出す。変えたら全図で、
 * text の bbox が親の箱と viewBox に収まっているか確かめること。
 */
export const FONT_SCALE = 1.2

/** 試験図コンポーネントの共通 props */
export interface ExamFigureProps {
  /**
   * 解説を開いているか。
   * true のときだけ、強調の経路・輪・吹き出しを重ねる（閉じているときは原図どおり）。
   */
  highlight?: boolean
}

/**
 * 太字の文字の幅のざっくり見積もり（全角 1.0em／英大文字・数字 0.75em／英小文字 0.65em／
 * 空白 0.35em／その他の半角 0.6em）。札の幅決めにだけ使う。正確さは実測（§5.4）で担保する。
 *
 * Meiryo UI の欧文は Verdana 系で幅が広く、太字の HTTPS は 3.6em ある。
 * 以前の「半角 0.55em」では札の幅が足りず、HTTPS が札の両端からはみ出していた。
 */
export function estimateWidth(text: string, fontSize: number) {
  let em = 0
  for (const ch of text) {
    if (ch.charCodeAt(0) >= 0x80) em += 1
    else if (ch === ' ') em += 0.35
    else if (/[A-Z0-9]/.test(ch)) em += 0.75
    else if (/[a-z]/.test(ch)) em += 0.65
    else em += 0.6
  }
  return em * fontSize
}

/** 同一ページに複数の図が並ぶので、marker の id は図ごとに一意にする */
export function useFigureId(prefix: string) {
  return `${prefix}-${useId().replace(/:/g, '')}`
}
