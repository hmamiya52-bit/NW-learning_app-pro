import { Cap, FigSvg, Ring } from './primitives'
import { FONT_SCALE, FRAME, LOGICAL, useFigureId } from './tokens'
import type { ExamFigureProps } from './tokens'

/**
 * 図4 HTTP バージョンと NAPT との関係 — R7 午後Ⅰ 問2
 *
 * 原図どおり、縦長の3つの箱（PC（Web ブラウザ）・ルータ・HTTP サーバ）を横に並べ、左の外に HTTP/1.1・HTTP/2・HTTP/3 の
 * 行の名前を置く。コネクションとストリームは原図と同じく管（左の端は「(」の弧、右の端は丸い面）で描き、ルータの中では
 * 管の上下の線を破線にして「NAPT 変換エントリー」と書く。HTTP のセッションの両矢印は、管の左右から出る（管の中は隠れる）。
 * HTTP/2・HTTP/3 は、PC の中の3本のストリームが1本の太い管（TCP コネクション、QUIC コネクション）に入り、
 * HTTP サーバの中で3本に分かれる。
 *
 * 管も矢印も論理の表現なので、線の色は LOGICAL。箱は役割の色を付けない枠（FRAME）。
 *
 * 解説を開いたときは、HTTP/1.1 の3つの NAPT 変換エントリー（コネクションごとに1つ）と、HTTP/3 の NAPT 変換エントリー（UDP）に輪を付ける。
 */

type Rect = { x: number; y: number; w: number; h: number }

const SMALL = 7
const TEXT = '#334155'
const fs = SMALL * FONT_SCALE

/** 縦長の3つの箱 */
const BOX_Y = 2
const BOX_H = 210
const PC: Rect = { x: 44, y: BOX_Y, w: 82, h: BOX_H }
const RT: Rect = { x: 192, y: BOX_Y, w: 82, h: BOX_H }
const SV: Rect = { x: 284, y: BOX_Y, w: 54, h: BOX_H }
/** 管と箱の境（ルータの中は破線） */
const DASH_FROM = RT.x
const DASH_TO = RT.x + RT.w
/** PC とルータのあいだ（管の名前を置く所）の真ん中 */
const GAP_MID = (PC.x + PC.w + RT.x) / 2
const RT_MID = RT.x + RT.w / 2

/** 矢頭の先（左は PC の中、右は HTTP サーバの中） */
const ARROW_L = 48
const ARROW_R = 334

/** HTTP/1.1 の3本の管 */
const H1_Y = [32, 51, 70]
const H1_H = 15
const H1_X1 = 112
const H1_X2 = 300

/** HTTP/2・HTTP/3 の太い管と、出入りするストリーム */
const BIG_H = 50
const BIG_Y = [94, 156]
const BIG_X1 = 116
const BIG_X2 = 296
const STREAM_H = 14
const STREAM_X1 = 66
const STREAM_X2 = 120
const STREAM_R_X2 = 318
const streamCenters = (by: number) => [by + 8, by + 25, by + 42]

/** 管の端の弧の横の半径 */
const CAP = 4

/** 管の外形（上下の線はルータの中だけ破線、左の端は「(」の弧） */
function TubeEdges({ x1, x2, y, h, dashed = true }: { x1: number; x2: number; y: number; h: number; dashed?: boolean }) {
  const seg = (yy: number) => {
    if (!dashed || x2 <= DASH_FROM || x1 >= DASH_TO) {
      return <line x1={x1} y1={yy} x2={x2} y2={yy} stroke={LOGICAL} strokeWidth={1} />
    }
    return (
      <>
        <line x1={x1} y1={yy} x2={DASH_FROM} y2={yy} stroke={LOGICAL} strokeWidth={1} />
        <line x1={DASH_FROM} y1={yy} x2={DASH_TO} y2={yy} stroke={LOGICAL} strokeWidth={1} strokeDasharray="4 3" />
        <line x1={DASH_TO} y1={yy} x2={x2} y2={yy} stroke={LOGICAL} strokeWidth={1} />
      </>
    )
  }
  return (
    <g>
      {seg(y)}
      {seg(y + h)}
      {/* 弧の内側も白く塗る（入ってくるストリームの線を弧で切る） */}
      <path d={`M ${x1},${y + h} A ${CAP},${h / 2} 0 0 1 ${x1},${y}`} fill="#ffffff" stroke={LOGICAL} strokeWidth={1} />
    </g>
  )
}

/** 管の右の端の丸い面 */
function Face({ x, y, h }: { x: number; y: number; h: number }) {
  return <ellipse cx={x} cy={y + h / 2} rx={CAP} ry={h / 2} fill="#ffffff" stroke={LOGICAL} strokeWidth={1} />
}

/** 太い管の右の端（右へふくらむ弧） */
function BulgeRight({ x, y, h }: { x: number; y: number; h: number }) {
  return <path d={`M ${x},${y} A ${CAP + 2},${h / 2} 0 0 1 ${x},${y + h}`} fill="#ffffff" stroke={LOGICAL} strokeWidth={1} />
}

/** 管の白い地と、その上の名前（名前は地と同じ `<g>` に入れ、§5.4 の検査2 で余白を測れるようにする） */
function TubeBody({ x1, x2, y, h, labels }: { x1: number; x2: number; y: number; h: number; labels: { x: number; lines: string[] }[] }) {
  const lh = fs + 2
  return (
    <g>
      <rect x={x1} y={y} width={x2 - x1} height={h} fill="#ffffff" />
      {labels.map((l) => (
        <text
          key={l.x}
          x={l.x}
          y={y + h / 2 + fs * 0.44 - ((l.lines.length - 1) * lh) / 2}
          textAnchor="middle"
          fontSize={fs}
          fill={TEXT}
        >
          {l.lines.map((ln, i) => (
            <tspan key={i} x={l.x} dy={i === 0 ? 0 : lh}>
              {ln}
            </tspan>
          ))}
        </text>
      ))}
    </g>
  )
}

/** 縦長の箱（名前は上の真ん中） */
function Column({ rect, label }: { rect: Rect; label: string }) {
  const { x, y, w, h } = rect
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill="none" stroke={FRAME} strokeWidth={1.2} />
      <text x={x + w / 2} y={y + 3.5 + fs} textAnchor="middle" fontSize={fs} fill={TEXT}>
        {label}
      </text>
    </g>
  )
}

export default function R7G12Fig4({ highlight = false }: ExamFigureProps) {
  const arrow = useFigureId('r7g12-arrow')
  const line = (x1: number, x2: number, y: number, key: string) => (
    <line key={key} x1={x1} y1={y} x2={x2} y2={y} stroke={LOGICAL} strokeWidth={1} markerEnd={`url(#${arrow})`} />
  )
  return (
    <FigSvg w={340} h={214} title="図4 HTTP バージョンと NAPT との関係">
      <defs>
        <marker id={arrow} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10" fill="none" stroke={LOGICAL} strokeWidth={1.5} />
        </marker>
      </defs>

      {/* ── 箱と行の名前 ─────────────────────────────── */}
      <Column rect={PC} label="PC（Web ブラウザ）" />
      <Column rect={RT} label="ルータ" />
      <Column rect={SV} label="HTTP サーバ" />
      <Cap x={40} y={H1_Y[1] + H1_H / 2 + 3} text="HTTP/1.1" anchor="end" size={SMALL} color={TEXT} />
      <Cap x={40} y={BIG_Y[0] + BIG_H / 2 + 3} text="HTTP/2" anchor="end" size={SMALL} color={TEXT} />
      <Cap x={40} y={BIG_Y[1] + BIG_H / 2 + 3} text="HTTP/3" anchor="end" size={SMALL} color={TEXT} />
      <Cap x={ARROW_L} y={28} text="HTTP のセッション" size={SMALL} color={TEXT} />

      {/* ── 矢印（HTTP のセッション。管の左右から出る）── */}
      {H1_Y.map((y, i) => (
        <g key={i}>
          {line(H1_X1 - CAP, ARROW_L, y + H1_H / 2, `l${i}`)}
          {line(H1_X2 + CAP, ARROW_R, y + H1_H / 2, `r${i}`)}
        </g>
      ))}
      {BIG_Y.map((by, b) => (
        <g key={b}>
          {streamCenters(by).map((cy, i) => (
            <g key={i}>
              {line(STREAM_X1 - CAP, ARROW_L, cy, `sl${i}`)}
              {line(STREAM_R_X2 + CAP, ARROW_R, cy, `sr${i}`)}
            </g>
          ))}
        </g>
      ))}

      {/* ── 強調：HTTP/1.1 の3つのエントリーと、HTTP/3 のエントリー ── */}
      {highlight && (
        <g>
          <Ring x={DASH_FROM + 3} y={H1_Y[0]} w={RT.w - 6} h={H1_Y[2] + H1_H - H1_Y[0]} />
          <Ring x={DASH_FROM + 3} y={BIG_Y[1]} w={RT.w - 6} h={BIG_H} />
        </g>
      )}

      {/* ── HTTP/1.1 の管（コネクションごとに NAPT 変換エントリー）── */}
      {H1_Y.map((y, i) => (
        <g key={i}>
          <TubeBody
            x1={H1_X1}
            x2={H1_X2}
            y={y}
            h={H1_H}
            labels={[
              { x: GAP_MID, lines: ['TCP コネクション'] },
              { x: RT_MID, lines: ['NAPT 変換エントリー'] },
            ]}
          />
          <TubeEdges x1={H1_X1} x2={H1_X2} y={y} h={H1_H} />
          <Face x={H1_X2} y={y} h={H1_H} />
        </g>
      ))}

      {/* ── HTTP/2・HTTP/3（ストリームが1本の太い管に入る）── */}
      {BIG_Y.map((by, b) => (
        <g key={b}>
          {streamCenters(by).map((cy, i) => (
            <g key={i}>
              <TubeBody
                x1={STREAM_X1}
                x2={STREAM_X2}
                y={cy - STREAM_H / 2}
                h={STREAM_H}
                labels={i === 0 ? [{ x: (STREAM_X1 + BIG_X1) / 2, lines: ['ストリーム'] }] : []}
              />
              <TubeEdges x1={STREAM_X1} x2={STREAM_X2} y={cy - STREAM_H / 2} h={STREAM_H} dashed={false} />
            </g>
          ))}
          <TubeBody
            x1={BIG_X1}
            x2={BIG_X2}
            y={by}
            h={BIG_H}
            labels={[
              { x: GAP_MID, lines: b === 0 ? ['TCP コネクション'] : ['QUIC コネクション', '(UDP)'] },
              { x: RT_MID, lines: ['NAPT 変換エントリー'] },
            ]}
          />
          <TubeEdges x1={BIG_X1} x2={BIG_X2} y={by} h={BIG_H} />
          {streamCenters(by).map((cy, i) => (
            <g key={i}>
              <rect x={BIG_X2} y={cy - STREAM_H / 2} width={STREAM_R_X2 - BIG_X2} height={STREAM_H} fill="#ffffff" />
              <TubeEdges x1={BIG_X2 + CAP + 2} x2={STREAM_R_X2} y={cy - STREAM_H / 2} h={STREAM_H} dashed={false} />
              <Face x={STREAM_R_X2} y={cy - STREAM_H / 2} h={STREAM_H} />
            </g>
          ))}
          <BulgeRight x={BIG_X2} y={by} h={BIG_H} />
        </g>
      ))}
    </FigSvg>
  )
}
