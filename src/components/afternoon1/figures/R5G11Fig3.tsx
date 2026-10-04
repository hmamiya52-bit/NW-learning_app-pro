import { ArrowDefs, Callout, Cap, FigSvg, Ring, Route } from './primitives'
import { FONT_SCALE, LINE, LOGICAL, MUTED, useFigureId } from './tokens'
import type { ExamFigureProps } from './tokens'

/**
 * 図3 h2 の通信シーケンス（抜粋）— R5 午後Ⅰ 問1
 *
 * シーケンス図。縦線（クライアント・サーバ）、(a)〜(i) の矢印と文言、右の波括弧2つ（TCP3ウェイハンドシェイク・
 * TLSセッション開始）と「⋮」、HTTP/2 通信の大きな破線の囲みと、リクエストとレスポンスを組にする小さな破線の囲み、
 * 太枠の空欄 d と ID：1・ID：3 は原図どおり。340 の幅にそのまま入るので組み直していない。
 * ネットワーク構成図ではないので役割の3色は当てない（H27-G1-1 図2 と同じ）。矢印は LOGICAL、縦線は LINE。
 *
 * 解説を開いたときは、ALPN のやり取りが載る (d)(e) をなぞり（設問3(1)(2)）、空欄 d の2つの箱に輪を付けて、
 * 吹き出しで ALPN の交渉と、d がストリームであることを示す（設問1 d・設問2(1)）。
 */

const SIZE = 7.5
const TEXT = '#334155'

/** 縦線の x */
const C = 118
const S = 228
/** 矢印の文言の真ん中 */
const MID = (C + S) / 2

interface Msg {
  y: number
  from: number
  to: number
  label: string
}

const MSGS: Msg[] = [
  { y: 36, from: C, to: S, label: '(a)Syn' },
  { y: 54, from: S, to: C, label: '(b)Syn/Ack' },
  { y: 72, from: C, to: S, label: '(c)Ack' },
  { y: 98, from: C, to: S, label: '(d)ClientHello' },
  { y: 116, from: S, to: C, label: '(e)ServerHello' },
  { y: 190, from: C, to: S, label: '(f)HTTPリクエスト' },
  { y: 208, from: S, to: C, label: '(g)HTTPレスポンス' },
  { y: 262, from: C, to: S, label: '(h)HTTPリクエスト' },
  { y: 280, from: S, to: C, label: '(i)HTTPレスポンス' },
]

/** 空欄 d の箱（太枠）と、右の ID */
const STREAMS = [
  { y: 148, id: 'ID：1' },
  { y: 220, id: 'ID：3' },
]
const D_BOX = { x: C + 3, w: 45, h: 18 }

/** 右の波括弧（先が右を向く）。x0 は括弧の左端 */
function Brace({ x0, y1, y2 }: { x0: number; y1: number; y2: number }) {
  const ym = (y1 + y2) / 2
  return (
    <path
      d={`M${x0},${y1} Q${x0 + 4},${y1} ${x0 + 4},${y1 + 5} L${x0 + 4},${ym - 4} Q${x0 + 4},${ym} ${x0 + 8},${ym} Q${x0 + 4},${ym} ${x0 + 4},${ym + 4} L${x0 + 4},${y2 - 5} Q${x0 + 4},${y2} ${x0},${y2}`}
      fill="none"
      stroke={MUTED}
      strokeWidth={1}
    />
  )
}

/** 破線の囲み */
function Dashed({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  return <rect x={x} y={y} width={w} height={h} fill="none" stroke={MUTED} strokeWidth={1.1} strokeDasharray="4 3" />
}

export default function R5G11Fig3({ highlight = false }: ExamFigureProps) {
  const fid = useFigureId('r5g11-fig3')
  const arrow = `url(#${fid}-arrow-0)`
  const fs = SIZE * FONT_SCALE
  return (
    <FigSvg w={340} h={316} title="図3 h2 の通信シーケンス（抜粋）">
      <ArrowDefs figureId={fid} colors={[LOGICAL]} />

      {/* ── 強調の輪（空欄 d の箱）。縦線が上に見えるよう、縦線より先に敷く ── */}
      {highlight && STREAMS.map((s) => <Ring key={s.y} x={D_BOX.x} y={s.y} w={D_BOX.w} h={D_BOX.h} />)}

      {/* ── 縦線・囲み・波括弧 ─────────────────────────── */}
      {[C, S].map((x) => (
        <line key={x} x1={x} y1={18} x2={x} y2={312} stroke={LINE} strokeWidth={1.2} />
      ))}
      <Dashed x={C - 16} y={142} w={S - C + 32} h={162} />
      <Dashed x={C - 8} y={172} w={S - C + 16} h={42} />
      <Dashed x={C - 8} y={244} w={S - C + 16} h={42} />
      <Brace x0={S + 6} y1={24} y2={76} />
      <Brace x0={S + 6} y1={86} y2={138} />

      {/* ── 矢印 ───────────────────────────────────── */}
      {MSGS.map((m) => (
        <line key={m.y} x1={m.from} y1={m.y} x2={m.to} y2={m.y} stroke={LOGICAL} strokeWidth={1.2} markerEnd={arrow} />
      ))}

      {/* ── 強調：ALPN が載る (d)(e)。矢頭は隠さない ─────────── */}
      {highlight && (
        <g>
          <Route
            points={[
              [C, 98],
              [S - 8, 98],
            ]}
          />
          <Route
            points={[
              [S, 116],
              [C + 8, 116],
            ]}
          />
        </g>
      )}

      {/* ── 空欄 d の箱（太枠）と ID ─────────────────────── */}
      {STREAMS.map((s) => (
        <g key={s.y}>
          <rect x={D_BOX.x} y={s.y} width={D_BOX.w} height={D_BOX.h} fill="#ffffff" stroke={TEXT} strokeWidth={2} />
          <text x={D_BOX.x + D_BOX.w / 2} y={s.y + D_BOX.h / 2 + fs * 0.4} textAnchor="middle" fontSize={fs} fill={TEXT}>
            d
          </text>
        </g>
      ))}
      {STREAMS.map((s) => (
        <Cap key={s.id} x={D_BOX.x + D_BOX.w + 6} y={s.y + D_BOX.h / 2 + 3.5} text={s.id} size={SIZE} color={TEXT} />
      ))}

      {/* ── 見出し・文言・波括弧の名前 ─────────────────────── */}
      <Cap x={C} y={12} text="クライアント" anchor="middle" size={SIZE} color={TEXT} />
      <Cap x={S} y={12} text="サーバ" anchor="middle" size={SIZE} color={TEXT} />
      {MSGS.map((m) => (
        <Cap key={m.y} x={MID} y={m.y - 5} text={m.label} anchor="middle" size={SIZE} color={TEXT} />
      ))}
      <Cap x={MID} y={136} text="⋮" anchor="middle" size={SIZE} color={TEXT} />
      <Cap x={MID} y={299} text="⋮" anchor="middle" size={SIZE} color={TEXT} />
      <Cap x={S + 18} y={53} text="TCP3ウェイハンドシェイク" size={SIZE} color={TEXT} />
      <Cap x={S + 18} y={115} text="TLSセッション開始" size={SIZE} color={TEXT} />
      <Cap x={S + 22} y={226} text="HTTP/2 通信" size={SIZE} color={TEXT} />

      {/* ── 強調の文字 ─────────────────────────────────── */}
      {highlight && (
        <g>
          <Callout
            x={4}
            y={97.6}
            w={92}
            lines={['ALPN で h2 を交渉']}
            leader={[
              [96, 107],
              [C, 107],
            ]}
          />
          <Callout
            x={30}
            y={147.6}
            w={64}
            lines={['d はストリーム']}
            leader={[
              [94, 157],
              [D_BOX.x, 157],
            ]}
          />
        </g>
      )}
    </FigSvg>
  )
}
