import { ArrowDefs, Callout, Cap, FigSvg, Route } from './primitives'
import { FONT_SCALE, LINE, LOGICAL, MUTED, useFigureId } from './tokens'
import type { ExamFigureProps } from './tokens'

/**
 * 図2 IP カメラ 11 からレシーバ 11 への配信イメージ（抜粋）— R5 午後Ⅰ 問2
 *
 * シーケンス図。縦線（レシーバ11・L3SW11・FW01・IPカメラ11）、(a)〜(e) の矢印と点線の角丸の囲み、右の (a)〜(e) の名前、
 * 凡例（太い矢印＝映像データ、●付きの矢印＝IGMPv3 又は PIM のパケット）は原図どおり。340 の幅にそのまま入るので組み直していない。
 * ネットワーク構成図ではないので役割の3色は当てない（H27-G1-1 図2 と同じ）。矢印は LOGICAL で、映像データは原図どおり太さで分ける。
 * 太い矢印は矢頭が線の太さに比例して大きくなりすぎるので、矢頭を小さくした専用の marker を使う。
 *
 * 解説を開いたときは、(c) と (d) の Join の道筋をなぞり（設問1 エ）、映像が Join と逆向きに流れることを吹き出しで示す。
 */

const SIZE = 7.5
const SMALL = 7
const TEXT = '#334155'

/** 縦線の x（左から レシーバ11・L3SW11・FW01・IPカメラ11） */
const R = 30
const L = 95
const F = 160
const C = 225
const HEADS: { x: number; label: string }[] = [
  { x: R, label: 'レシーバ11' },
  { x: L, label: 'L3SW11' },
  { x: F, label: 'FW01' },
  { x: C, label: 'IPカメラ11' },
]
const TOP = 22
const BOTTOM = 180
/** (a)〜(e) の名前の左端 */
const LABEL_X = 238

interface Arrow {
  y: number
  from: number
  to: number
  /** 映像データ（太い矢印） */
  data?: boolean
}

/** 矢印（● は control の矢印の元に付く） */
const ARROWS: Arrow[] = [
  { y: 40, from: C, to: F, data: true },
  { y: 63, from: L, to: R },
  { y: 63, from: L, to: F },
  { y: 79, from: F, to: L },
  { y: 79, from: F, to: C },
  { y: 103, from: R, to: L },
  { y: 127, from: L, to: F },
  { y: 151, from: F, to: L, data: true },
  { y: 165, from: L, to: R, data: true },
]
/** ●（IGMPv3 又は PIM のパケットの送り元） */
const DOTS: [number, number][] = [
  [L, 63],
  [F, 79],
  [R, 103],
  [L, 127],
]

/** 点線の角丸の囲みと、右の名前 */
const GROUPS: { x1: number; x2: number; y: number; h: number; label: string; ly: number }[] = [
  { x1: F - 8, x2: C + 8, y: 31, h: 18, label: '(a)常時送信', ly: 43 },
  { x1: R - 8, x2: C + 8, y: 55, h: 32, label: '(b)PIM hello', ly: 74 },
  { x1: R - 8, x2: L + 8, y: 95, h: 16, label: '(c)IGMPv3 (S,G) Join', ly: 106 },
  { x1: L - 8, x2: F + 8, y: 119, h: 16, label: '(d)PIM (S,G) Join', ly: 130 },
  { x1: R - 8, x2: F + 8, y: 143, h: 30, label: '(e)複製及び配信', ly: 161 },
]

export default function R5G12Fig2({ highlight = false }: ExamFigureProps) {
  const fid = useFigureId('r5g12-fig2')
  const thin = `url(#${fid}-arrow-0)`
  const thick = `url(#${fid}-thick)`
  const fs = SIZE * FONT_SCALE
  return (
    <FigSvg w={340} h={220} title="図2 IP カメラ 11 からレシーバ 11 への配信イメージ（抜粋）">
      <ArrowDefs figureId={fid} colors={[LOGICAL]} />
      <defs>
        <marker id={`${fid}-thick`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="3.2" markerHeight="3.2" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill={LOGICAL} />
        </marker>
      </defs>

      {/* ── 縦線と点線の囲み ───────────────────────────── */}
      {HEADS.map((h) => (
        <line key={h.x} x1={h.x} y1={TOP} x2={h.x} y2={BOTTOM} stroke={LINE} strokeWidth={1.2} />
      ))}
      {GROUPS.map((g) => (
        <rect
          key={g.label}
          x={g.x1}
          y={g.y}
          width={g.x2 - g.x1}
          height={g.h}
          rx={8}
          fill="none"
          stroke={MUTED}
          strokeWidth={1.1}
          strokeDasharray="1 2.2"
        />
      ))}

      {/* ── 矢印 ───────────────────────────────────── */}
      {ARROWS.map((a) => (
        <line
          key={`${a.y}-${a.to}`}
          x1={a.from}
          y1={a.y}
          x2={a.to}
          y2={a.y}
          stroke={LOGICAL}
          strokeWidth={a.data ? 3 : 1.2}
          markerEnd={a.data ? thick : thin}
        />
      ))}

      {/* ── 強調：(c)(d) の Join の道筋。矢頭は隠さない ─────────── */}
      {highlight && (
        <g>
          <Route
            points={[
              [R, 103],
              [L - 8, 103],
            ]}
          />
          <Route
            points={[
              [L, 127],
              [F - 8, 127],
            ]}
          />
        </g>
      )}

      {/* ── ●・見出し・名前 ─────────────────────────────── */}
      {DOTS.map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={2.6} fill={LOGICAL} />
      ))}
      {HEADS.map((h) => (
        <g key={h.label}>
          <rect x={h.x - 25} y={4} width={50} height={18} fill="#ffffff" stroke={MUTED} strokeWidth={1.2} />
          <text x={h.x} y={13 + fs * 0.44} textAnchor="middle" fontSize={fs} fill={TEXT}>
            {h.label}
          </text>
        </g>
      ))}
      {GROUPS.map((g) => (
        <Cap key={g.label} x={LABEL_X} y={g.ly} text={g.label} size={SIZE} color={TEXT} />
      ))}

      {/* ── 凡例（原図どおり図の下） ─────────────────────── */}
      <line x1={30} y1={196} x2={8} y2={196} stroke={LOGICAL} strokeWidth={3} markerEnd={thick} />
      <Cap x={34} y={199} text="：映像データのマルチキャストパケット" size={SMALL} color={MUTED} />
      <line x1={30} y1={210} x2={8} y2={210} stroke={LOGICAL} strokeWidth={1.2} markerEnd={thin} />
      <circle cx={30} cy={210} r={2.6} fill={LOGICAL} />
      <Cap x={34} y={213} text="：IGMPv3 又は PIM のマルチキャストパケット" size={SMALL} color={MUTED} />

      {/* ── 強調の文字 ─────────────────────────────────── */}
      {highlight && (
        <Callout
          x={238}
          y={170}
          w={94}
          lines={['Join の逆向きに配信']}
          leader={[
            [238, 179],
            [F + 8, 160],
          ]}
        />
      )}
    </FigSvg>
  )
}
