import { ArrowDefs, Box, Callout, Cap, FigSvg, Ring, Route } from './primitives'
import { LOGICAL, useFigureId } from './tokens'
import type { ExamFigureProps } from './tokens'

/**
 * 図2 Web ブラウザからサーバへのリクエスト — R5 午後Ⅰ 問1
 *
 * 原図どおり、左に変更前（Web ブラウザ → Web サーバ → AP サーバの縦の列）、右に変更後（Web ブラウザ → 仮想 LB →
 * Web サーバと AP サーバへ斜めに分かれる）を並べる。340 の幅にそのまま入るので組み直していない。
 * 矢印はリクエストの向きを表す論理的な流れなので LOGICAL。矢印の脇の HTTP の版も原図どおり。
 * 箱の色は図1・図4 と同じ役割の色（サーバと Web ブラウザは host、J 社の仮想 LB は outside）。
 *
 * 解説を開いたときは、変更前の Web サーバから AP サーバへの矢印をなぞって Web サーバに輪を付け（中継。設問1 a）、
 * 仮想 LB に輪を付けて、HTTP/2 を HTTP/1.1 に変えるのが仮想 LB であることを吹き出しで示す（設問4(2)）。
 */

const SIZE = 7.5
const TEXT = '#334155'

type Rect = { x: number; y: number; w: number; h: number }

/** 変更前 */
const BR0: Rect = { x: 32, y: 26, w: 40, h: 30 }
const WS0: Rect = { x: 12, y: 80, w: 80, h: 30 }
const AP0: Rect = { x: 12, y: 134, w: 80, h: 30 }
/** 変更後 */
const BR1: Rect = { x: 232, y: 26, w: 40, h: 30 }
const LB: Rect = { x: 229, y: 80, w: 46, h: 24 }
const WS1: Rect = { x: 168, y: 134, w: 80, h: 30 }
const AP1: Rect = { x: 256, y: 134, w: 80, h: 30 }

/** 矢印（x1,y1 → x2,y2）と、脇の HTTP の版 */
const ARROWS: { p: [number, number, number, number]; label: string; lx: number; ly: number; anchor: 'start' | 'end' }[] = [
  { p: [52, 56, 52, 80], label: 'HTTP/1.1', lx: 56, ly: 71, anchor: 'start' },
  { p: [52, 110, 52, 134], label: 'HTTP/1.1', lx: 56, ly: 125, anchor: 'start' },
  { p: [252, 56, 252, 80], label: 'HTTP/2', lx: 256, ly: 71, anchor: 'start' },
  { p: [240, 104, 208, 134], label: 'HTTP/1.1', lx: 214, ly: 118, anchor: 'end' },
  { p: [264, 104, 296, 134], label: 'HTTP/1.1', lx: 290, ly: 118, anchor: 'start' },
]

export default function R5G11Fig2({ highlight = false }: ExamFigureProps) {
  const fid = useFigureId('r5g11-fig2')
  const arrow = `url(#${fid}-arrow-0)`
  return (
    <FigSvg w={340} h={168} title="図2 Web ブラウザからサーバへのリクエスト">
      <ArrowDefs figureId={fid} colors={[LOGICAL]} />

      {/* ── 矢印 ───────────────────────────────────── */}
      {ARROWS.map(({ p }) => (
        <line key={`${p[0]}-${p[1]}-${p[2]}`} x1={p[0]} y1={p[1]} x2={p[2]} y2={p[3]} stroke={LOGICAL} strokeWidth={1.2} markerEnd={arrow} />
      ))}

      {/* ── 強調：Web サーバの中継と、HTTP の版が変わる仮想 LB ──────── */}
      {highlight && (
        <g>
          <Ring {...WS0} />
          <Ring {...LB} />
          <Route
            points={[
              [52, 95],
              [52, 126],
            ]}
          />
        </g>
      )}

      {/* ── 箱 ─────────────────────────────────────── */}
      <Cap x={12} y={14} text="変更前" size={SIZE} color={TEXT} />
      <Box {...BR0} tone="host" lines={['Web', 'ブラウザ']} size={SIZE} />
      <Box {...WS0} tone="host" lines={['Web サーバ', '（静的コンテンツ）']} size={SIZE} />
      <Box {...AP0} tone="host" lines={['AP サーバ', '（動的コンテンツ）']} size={SIZE} />
      <Cap x={168} y={14} text="変更後" size={SIZE} color={TEXT} />
      <Box {...BR1} tone="host" lines={['Web', 'ブラウザ']} size={SIZE} />
      <Box {...LB} tone="outside" lines={['仮想 LB']} size={SIZE} />
      <Box {...WS1} tone="host" lines={['Web サーバ', '（静的コンテンツ）']} size={SIZE} />
      <Box {...AP1} tone="host" lines={['AP サーバ', '（動的コンテンツ）']} size={SIZE} />

      {/* ── HTTP の版 ───────────────────────────────── */}
      {ARROWS.map((a) => (
        <Cap key={`${a.lx}-${a.ly}`} x={a.lx} y={a.ly} text={a.label} anchor={a.anchor} size={SIZE} color={TEXT} />
      ))}

      {/* ── 強調の文字 ─────────────────────────────────── */}
      {highlight && (
        <Callout
          x={130}
          y={72}
          w={86}
          lines={['HTTP/2 を', 'HTTP/1.1 に変換']}
          leader={[
            [216, 92],
            [LB.x, 92],
          ]}
        />
      )}
    </FigSvg>
  )
}
