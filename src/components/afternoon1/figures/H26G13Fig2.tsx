import { ArrowDefs, Box, Callout, Cap, DashFrame, Ell, FigSvg } from './primitives'
import { FONT_SCALE, LOGICAL, MARK, MARK_FILL, MARK_TEXT, MUTED, TONE, useFigureId } from './tokens'
import type { ExamFigureProps } from './tokens'

/**
 * 図2 IB システムの DNS 概念図 — H26 午後Ⅰ 問3
 *
 * 箱の並び（上にインターネット、その下に DMZ、下の段の左に業務セグメント、右に内部セグメント）、
 * 空欄3つの位置、矢印の本数と向き、凡例と略語の説明は原図どおり。
 * 原図の注記のとおり一部が省略されていて、空欄を埋めて矢印を描き足すのが設問3(2)。
 *
 * 色は役割だけで決めている。DNS サーバ（空欄も DNS サーバ）と PC は host、インターネットは outside。
 * 矢印は物理的な接続ではなく DNS の問合せとゾーン転送なので LOGICAL で描き、
 * 原図の凡例どおり実線と破線で見分ける。
 *
 * 解説を開いたときは、解答例の図（空欄の DNS サーバ名と、DNS-P から DMZ の DNS-S 2台への
 * ゾーン転送）を赤の破線で重ねる。これは経路の強調ではなく解答の描き込みなので
 * data-role="answer" を付けている（§5.4 の検査5 の対象外。線の両端が箱の中にあることは別に確かめる）。
 * あわせて、DNS-P に問合せが来ないことと、DMZ の DNS-S のキャッシュが無効なことを吹き出しで示す。
 */

/** 箱の文字の大きさ（Box の size） */
const SIZE = 7.5

/** 空欄（原図どおり何も書かない箱）。中身は DNS サーバなので host の色で描く */
type Rect = { x: number; y: number; w: number; h: number }
const BLANK_DMZ: Rect = { x: 150, y: 48, w: 52, h: 20 }
const BLANK_C: Rect = { x: 110, y: 126, w: 52, h: 20 }
const BLANK_S: Rect = { x: 172, y: 164, w: 52, h: 20 }

/** 空欄の箱 */
function Blank({ r }: { r: Rect }) {
  return (
    <rect x={r.x} y={r.y} width={r.w} height={r.h} rx={2} fill={TONE.host.fill} stroke={TONE.host.stroke} strokeWidth={1.2} />
  )
}

/** 解答例で空欄に入る DNS サーバ（赤の破線の箱と文字） */
function AnswerBox({ r, text }: { r: Rect; text: string }) {
  const fs = 7.5 * FONT_SCALE
  return (
    <g>
      <rect x={r.x} y={r.y} width={r.w} height={r.h} rx={2} fill={MARK_FILL} stroke={MARK} strokeWidth={1.4} strokeDasharray="4 2" />
      <text x={r.x + r.w / 2} y={r.y + r.h / 2 + fs * 0.44} textAnchor="middle" fontSize={fs} fontWeight={700} fill={MARK_TEXT}>
        {text}
      </text>
    </g>
  )
}

/** インターネットの楕円 */
const NET = { cx: 128, cy: 14, rx: 42, ry: 11 }
/** 空欄（DNS-C）からインターネットへの矢印の x。楕円の下端に矢の先を合わせる */
const UP_X = 122
const UP_TIP = NET.cy + NET.ry * Math.sqrt(1 - ((UP_X - NET.cx) / NET.rx) ** 2)

/** DNS 問合せ（実線の矢印）。始点 → 終点 */
const QUERIES: [number, number, number, number][] = [
  [150, 22, 170, 48], // インターネット → DMZ の空欄
  [164, 18, 244, 48], // インターネット → DMZ の DNS-S
  [UP_X, 126, UP_X, UP_TIP], // 空欄（DNS-C）→ インターネット
  [144, 126, 166, 68], // 空欄（DNS-C）→ DMZ の空欄
  [156, 126, 240, 68], // 空欄（DNS-C）→ DMZ の DNS-S
  [64, 174, 110, 142], // PC → 空欄（DNS-C）
  [156, 146, 172, 172], // 空欄（DNS-C）→ 内部の空欄
]

/** 解答例で描き足すゾーン転送（DNS-P → DMZ の DNS-S 2台） */
const ADDED_TRANSFERS: [number, number, number, number][] = [
  [226, 116, 196, 68],
  [248, 116, 250, 68],
]

export default function H26G13Fig2({ highlight = false }: ExamFigureProps) {
  const fid = useFigureId('h26g13-fig2')
  const arrow = `url(#${fid}-arrow-0)`
  const markArrow = `url(#${fid}-arrow-1)`
  return (
    <FigSvg w={340} h={246} title="図2 IB システムの DNS 概念図">
      <ArrowDefs figureId={fid} colors={[LOGICAL, MARK]} />

      {/* ── 囲み ───────────────────────────────────── */}
      <DashFrame x={4} y={32} w={332} h={48} label="DMZ" />
      <DashFrame x={4} y={88} w={88} h={108} label="業務セグメント" />
      <DashFrame x={98} y={88} w={238} h={108} label="内部セグメント" labelAnchor="end" />

      {/* ── 矢印 ───────────────────────────────────── */}
      {QUERIES.map(([x1, y1, x2, y2]) => (
        <line key={`${x1}-${y1}-${x2}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={LOGICAL} strokeWidth={1.2} markerEnd={arrow} />
      ))}
      {/* ゾーン転送（DNS-P → 内部の空欄） */}
      <line x1={232} y1={136} x2={216} y2={164} stroke={LOGICAL} strokeWidth={1.2} strokeDasharray="4 3" markerEnd={arrow} />

      {/* ── 強調：解答例で描き足すゾーン転送（ノードより先）── */}
      {highlight && (
        <g data-role="answer">
          {ADDED_TRANSFERS.map(([x1, y1, x2, y2]) => (
            <line
              key={x2}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={MARK}
              strokeWidth={1.6}
              strokeDasharray="4 2"
              markerEnd={markArrow}
            />
          ))}
        </g>
      )}

      {/* ── ノード ───────────────────────────────────── */}
      <Ell cx={NET.cx} cy={NET.cy} rx={NET.rx} ry={NET.ry} tone="outside" lines={['インターネット']} size={SIZE} />
      <Blank r={BLANK_DMZ} />
      <Box x={224} y={48} w={52} h={20} tone="host" lines={['DNS-S']} size={SIZE} />
      <Box x={24} y={166} w={40} h={20} tone="host" lines={['PC']} size={SIZE} />
      <Blank r={BLANK_C} />
      <Box x={218} y={116} w={52} h={20} tone="host" lines={['DNS-P']} size={SIZE} />
      <Blank r={BLANK_S} />

      {/* ── 強調：空欄に入る DNS サーバと、吹き出し ── */}
      {highlight && (
        <g>
          <g data-role="answer">
            <AnswerBox r={BLANK_DMZ} text="DNS-S" />
            <AnswerBox r={BLANK_C} text="DNS-C" />
            <AnswerBox r={BLANK_S} text="DNS-S" />
          </g>
          {/* DMZ の DNS-S は2台とも（空欄も）同じなので、1台を指さずに DMZ の枠の中に置く */}
          <Callout x={38} y={40} w={70} lines={['DMZ の2台は', 'キャッシュ無効']} />
          <Callout
            x={240}
            y={150}
            w={86}
            lines={['問合せは受けない']}
            leader={[
              [256, 150],
              [256, 136],
            ]}
          />
        </g>
      )}

      {/* ── 凡例 ─────────────────────────────────────── */}
      <Cap x={6} y={212} text="（凡例）" size={7} color={MUTED} />
      <line x1={44} y1={209} x2={70} y2={209} stroke={LOGICAL} strokeWidth={1.2} markerEnd={arrow} />
      <Cap x={72} y={212} text="：DNS 問合せ" size={7} color={MUTED} />
      <line x1={44} y1={223} x2={70} y2={223} stroke={LOGICAL} strokeWidth={1.2} strokeDasharray="4 3" markerEnd={arrow} />
      <Cap x={72} y={226} text="：ゾーン転送" size={7} color={MUTED} />
      <Cap x={182} y={212} text="DNS-P：プライマリDNSサーバ" size={7} color={MUTED} />
      <Cap x={182} y={226} text="DNS-S：セカンダリDNSサーバ" size={7} color={MUTED} />
      <Cap x={182} y={240} text="DNS-C：キャッシュDNSサーバ" size={7} color={MUTED} />
    </FigSvg>
  )
}
