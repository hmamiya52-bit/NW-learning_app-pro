import { Box, Callout, Cap, FigSvg, Ring, Route, Wire } from './primitives'
import { MARK, MUTED } from './tokens'
import type { ExamFigureProps } from './tokens'

/**
 * 図3 J さんが考えた SD-WAN 装置間の IPsec トンネルの構成 — R6 午後Ⅰ 問2
 *
 * 原図は4台の SD-WAN 装置を 2×2 に置き、GE0（L 社 VPN 側）と GE1（インターネット側）の
 * トンネル12本を1枚に重ねて描く。375px では線が完全に潰れるので、
 * **GE0 の面と GE1 の面を上下2枚に分けた**。分けても
 *   ・4台の装置と対応する拠点
 *   ・24 個の TE 名とどれとどれが対になるか
 *   ・実線＝L 社 VPN／破線＝インターネット
 * は原図どおりで、情報は落としていない。装置あたり6本→3本になり線の交差が読める。
 *
 * TE の名前の付き方: TE ＋［0＝L社VPN／1＝インターネット］＋［自装置番号］＋［対向装置番号］。
 * 設問5 は「本社(装置2)→支店V(装置3)」の経路上の TE を答えるので、
 * TE023 と TE032（通常時）／TE123 と TE132（L 社 VPN 障害時）が読み取れることが要る。
 * 解説を開いたときは、この装置2 ⇔ 装置3 の1本だけを両面でなぞり、
 * 対応する TE 名の文字色も赤にする（文字を隠さずに「ここを見ろ」と言える）。
 */

type Pane = {
  top: number
  title: string
  /** TE 名の先頭の数字。0＝L社VPN、1＝インターネット */
  via: 0 | 1
  dash?: string
}

const PANES: Pane[] = [
  { top: 26, title: 'GE0：L社VPN 経由（実線）', via: 0 },
  { top: 262, title: 'GE1：インターネット経由（破線）', via: 1, dash: '5 3' },
]

/** 装置の箱（左上・右上・左下・右下）。n は装置番号 */
const NODES = [
  { n: 1, site: 'データセンター', x: 10, dy: 14 },
  { n: 2, site: '本社', x: 230, dy: 14 },
  { n: 4, site: '支店W', x: 10, dy: 144 },
  { n: 3, site: '支店V', x: 230, dy: 144 },
]

const BOX_W = 100
const BOX_H = 38

export default function R6G12Fig3({ highlight = false }: ExamFigureProps) {
  const te = (via: 0 | 1, self: number, peer: number) => `TE${via}${self}${peer}`

  return (
    <FigSvg w={340} h={500} title="図3 SD-WAN 装置間の IPsec トンネルの構成">
      {PANES.map((pane) => {
        const t = pane.top
        // 箱の辺の座標
        const L = 10, R = 230 // 左列・右列の x
        const T = t + 14, B = t + 144 // 上段・下段の y
        const mid = (y: number) => y + BOX_H / 2
        return (
          <g key={pane.via}>
            <Cap x={6} y={t} text={pane.title} color={MUTED} bold size={8} />

            {/* ── トンネル6本（K4）────────────────────── */}
            {/* 1 — 2（上の横） */}
            <Wire x1={L + BOX_W} y1={mid(T)} x2={R} y2={mid(T)} dash={pane.dash} />
            {/* 4 — 3（下の横） */}
            <Wire x1={L + BOX_W} y1={mid(B)} x2={R} y2={mid(B)} dash={pane.dash} />
            {/* 1 — 4（左の縦） */}
            <Wire x1={L + 30} y1={T + BOX_H} x2={L + 30} y2={B} dash={pane.dash} />
            {/* 2 — 3（右の縦） */}
            <Wire x1={R + 70} y1={T + BOX_H} x2={R + 70} y2={B} dash={pane.dash} />
            {/* 1 — 3（斜め） */}
            <Wire x1={L + BOX_W} y1={T + BOX_H - 6} x2={R} y2={B + 6} dash={pane.dash} />
            {/* 2 — 4（斜め） */}
            <Wire x1={R} y1={T + BOX_H - 6} x2={L + BOX_W} y2={B + 6} dash={pane.dash} />

            {/* ── 強調：装置2 ⇔ 装置3 の1本（箱より先に描く）── */}
            {highlight && (
              <g>
                <Route
                  points={[
                    [R + 70, T + BOX_H],
                    [R + 70, B],
                  ]}
                  dash={pane.dash ? '8 5' : undefined}
                />
                <Ring x={R} y={T} w={BOX_W} h={BOX_H} />
                <Ring x={R} y={B} w={BOX_W} h={BOX_H} />
              </g>
            )}

            {/* ── TE 名（線の端に添える）──────────────── */}
            <Cap x={L + BOX_W + 4} y={mid(T) - 4} text={te(pane.via, 1, 2)} size={7} />
            <Cap x={R - 4} y={mid(T) - 4} text={te(pane.via, 2, 1)} anchor="end" size={7} />
            <Cap x={L + BOX_W + 4} y={mid(B) - 4} text={te(pane.via, 4, 3)} size={7} />
            <Cap x={R - 4} y={mid(B) - 4} text={te(pane.via, 3, 4)} anchor="end" size={7} />
            <Cap x={L + 34} y={T + BOX_H + 14} text={te(pane.via, 1, 4)} size={7} />
            <Cap x={L + 34} y={B - 6} text={te(pane.via, 4, 1)} size={7} />
            <Cap
              x={R + 66}
              y={T + BOX_H + 14}
              text={te(pane.via, 2, 3)}
              anchor="end"
              size={7}
              color={highlight ? MARK : undefined}
              bold={highlight}
            />
            <Cap
              x={R + 66}
              y={B - 6}
              text={te(pane.via, 3, 2)}
              anchor="end"
              size={7}
              color={highlight ? MARK : undefined}
              bold={highlight}
            />
            <Cap x={L + BOX_W + 10} y={T + BOX_H + 16} text={te(pane.via, 1, 3)} size={7} />
            <Cap x={R - 10} y={B + 2} text={te(pane.via, 3, 1)} anchor="end" size={7} />
            <Cap x={R - 10} y={T + BOX_H + 16} text={te(pane.via, 2, 4)} anchor="end" size={7} />
            <Cap x={L + BOX_W + 10} y={B + 2} text={te(pane.via, 4, 2)} size={7} />

            {/* ── 装置の箱（線より後に描いて端を隠す）──── */}
            {NODES.map((nd) => (
              <Box
                key={nd.n}
                x={nd.x}
                y={t + nd.dy}
                w={BOX_W}
                h={BOX_H}
                tone="device"
                lines={[`SD-WAN装置${nd.n}`, nd.site]}
                size={7.5}
              />
            ))}
          </g>
        )
      })}

      {/* ── 強調の文字（2つの面のあいだの空き帯に置く）── */}
      {highlight && (
        <Callout
          x={56}
          y={214}
          w={228}
          lines={['本社は装置2、支店Vは装置3', '通常時 TE023・TE032／障害時 TE123・TE132']}
        />
      )}

      {/* ── 凡例 ─────────────────────────────────────── */}
      <Wire x1={6} y1={456} x2={40} y2={456} />
      <Cap x={44} y={459} text="：IPsec トンネル（L 社 VPN）" />
      <Wire x1={6} y1={472} x2={40} y2={472} dash="5 3" />
      <Cap x={44} y={475} text="：IPsec トンネル（インターネット）" />
      <Cap x={6} y={491} text="GE：Gigabit Ethernet インタフェース　TE：Tunnel Endpoint" size={7} />
    </FigSvg>
  )
}
