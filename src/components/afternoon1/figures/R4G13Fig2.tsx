import { ArrowDefs, Callout, Cap, FigSvg, Ring, Route } from './primitives'
import { FONT_SCALE, LINE, LOGICAL, MUTED, useFigureId } from './tokens'
import type { ExamFigureProps } from './tokens'

/**
 * 図2 PC の起動から営業支援サーバアクセスまでの通信手順（抜粋）— R4 午後Ⅰ 問3
 *
 * シーケンス図。縦線（PC・DS・営業支援サーバ）と、DS の箱の中の破線の KDC、左の社員のアイコンと操作の矢印4本、
 * ①〜⑧の矢印と番号、両向きの太い「HTTP 通信」は原図どおり。
 * ネットワーク構成図ではないので役割の3色は当てない（H27-G1-1 図2 と同じ）。矢印は LOGICAL、縦線は LINE。
 * 矢印の文言は原図どおり PC の縦線の右から書き始める。④と⑦の文言は 340 の幅に1行では入らないので2行にした。
 * PC と営業支援サーバのあいだの矢印の文言は DS の縦線をまたぐ（原図どおり）。文字に白い縁取りを付けて、縦線を文字の所だけ隠す。
 *
 * 解説を開いたときは、KDC とやり取りする①②⑤⑥をなぞり、DS の箱に輪を付けて、ポート 88 の通信であることを吹き出しで示す
 * （設問2(2)）。②と⑥は PC の鍵で暗号化される通信でもある（設問2(1)）。
 */

const SIZE = 7.5
const SMALL = 7
const TEXT = '#334155'

/** 縦線の x */
const PC = 104
const DS = 266
const SV = 316
/** 縦線の上端（見出しの箱の下辺）と下端 */
const TOP = 43
const BOTTOM = 330

interface Msg {
  /** 矢印の y */
  y: number
  from: number
  to: number
  /** 文言（2行のときは2要素） */
  label: string[]
  /** 番号（HTTP 通信は番号なし） */
  n?: string
}

const MSGS: Msg[] = [
  { y: 92, from: PC, to: DS, label: ['認証要求（ID，PW）'], n: '①' },
  { y: 114, from: DS, to: PC, label: ['認証成功（TGT）'], n: '②' },
  { y: 166, from: PC, to: SV, label: ['HTTP 要求'], n: '③' },
  { y: 200, from: SV, to: PC, label: ['HTTP 応答（401，', 'WWW-Authenticate:Negotiate）'], n: '④' },
  { y: 222, from: PC, to: DS, label: ['営業支援サーバ用の ST 要求（TGT）'], n: '⑤' },
  { y: 244, from: DS, to: PC, label: ['営業支援サーバ用の ST の払出し（ST）'], n: '⑥' },
  { y: 278, from: PC, to: SV, label: ['HTTP 要求（ケルベロス認証向けの', 'API を利用して ST 提示）'], n: '⑦' },
  { y: 300, from: SV, to: PC, label: ['HTTP 応答（200 OK，認証成功を応答）'], n: '⑧' },
]

/** 社員の操作（左から PC の縦線への矢印） */
const ACTIONS: { y: number; label: string }[] = [
  { y: 56, label: 'PC 起動' },
  { y: 70, label: 'ID，PW 入力' },
  { y: 130, label: 'Web ブラウザ起動' },
  { y: 144, label: '営業支援サーバアクセス' },
]

/** 縦線の見出しの箱（白地。文字は太字にしない）。dash を渡すと破線の箱（DS の中の KDC） */
function Head({ x, y, w, h, lines, dash }: { x: number; y: number; w: number; h: number; lines: string[]; dash?: string }) {
  const fs = SIZE * FONT_SCALE
  const lh = fs + 2.5
  const cx = x + w / 2
  const startY = y + h / 2 + fs * 0.44 - ((lines.length - 1) * lh) / 2
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill="#ffffff" stroke={MUTED} strokeWidth={1.2} strokeDasharray={dash} />
      <text x={cx} y={startY} textAnchor="middle" fontSize={fs} fill={TEXT}>
        {lines.map((ln, i) => (
          <tspan key={i} x={cx} dy={i === 0 ? 0 : lh}>
            {ln}
          </tspan>
        ))}
      </text>
    </g>
  )
}

/** 矢印の文言。白い縁取りで、またいだ縦線を文字の所だけ隠す */
function Label({ x, y, text }: { x: number; y: number; text: string }) {
  return (
    <text
      x={x}
      y={y}
      fontSize={SMALL * FONT_SCALE}
      fill={TEXT}
      stroke="#ffffff"
      strokeWidth={3}
      strokeLinejoin="round"
      paintOrder="stroke"
    >
      {text}
    </text>
  )
}

/** 社員のアイコン（原図の人の形） */
function Person({ cx, top }: { cx: number; top: number }) {
  return (
    <g>
      <circle cx={cx} cy={top + 3.6} r={3.6} fill={TEXT} />
      <path d={`M${cx - 7},${top + 15} Q${cx - 7},${top + 8.5} ${cx},${top + 8.5} Q${cx + 7},${top + 8.5} ${cx + 7},${top + 15} Z`} fill={TEXT} />
    </g>
  )
}

export default function R4G13Fig2({ highlight = false }: ExamFigureProps) {
  const fid = useFigureId('r4g13-fig2')
  const arrow = `url(#${fid}-arrow-0)`
  return (
    <FigSvg w={340} h={334} title="図2 PC の起動から営業支援サーバアクセスまでの通信手順（抜粋）">
      <ArrowDefs figureId={fid} colors={[LOGICAL]} />

      {/* ── 縦線 ───────────────────────────────────── */}
      {[PC, DS, SV].map((x) => (
        <line key={x} x1={x} y1={TOP} x2={x} y2={BOTTOM} stroke={LINE} strokeWidth={1.2} />
      ))}

      {/* ── 社員の操作と、①〜⑧・HTTP 通信の矢印 ──────────────── */}
      {ACTIONS.map((a) => (
        <line key={a.y} x1={90} y1={a.y} x2={PC} y2={a.y} stroke={LOGICAL} strokeWidth={1.2} markerEnd={arrow} />
      ))}
      {MSGS.map((m) => (
        <line key={m.y} x1={m.from} y1={m.y} x2={m.to} y2={m.y} stroke={LOGICAL} strokeWidth={1.2} markerEnd={arrow} />
      ))}
      <line x1={PC} y1={322} x2={SV} y2={322} stroke={LOGICAL} strokeWidth={2.2} markerStart={arrow} markerEnd={arrow} />

      {/* ── 強調：KDC とのやり取り（①②⑤⑥）。矢頭は隠さない ──────── */}
      {highlight && (
        <g>
          <Ring x={246} y={5} w={40} h={38} />
          <Route
            points={[
              [PC, 92],
              [DS - 8, 92],
            ]}
          />
          <Route
            points={[
              [DS, 114],
              [PC + 8, 114],
            ]}
          />
          <Route
            points={[
              [PC, 222],
              [DS - 8, 222],
            ]}
          />
          <Route
            points={[
              [DS, 244],
              [PC + 8, 244],
            ]}
          />
        </g>
      )}

      {/* ── 見出し（縦線の上の箱）と社員 ─────────────────────── */}
      <Cap x={40} y={12} text="社員" anchor="middle" size={SIZE} color={TEXT} />
      <Person cx={40} top={17} />
      <Head x={89} y={25} w={30} h={18} lines={['PC']} />
      <g>
        <rect x={246} y={5} width={40} height={38} fill="#ffffff" stroke={MUTED} strokeWidth={1.2} />
        <text x={DS} y={17.5} textAnchor="middle" fontSize={SIZE * FONT_SCALE} fill={TEXT}>
          DS
        </text>
      </g>
      <Head x={252} y={23} w={28} h={18} lines={['KDC']} dash="3 2" />
      <Head x={294} y={13} w={44} h={30} lines={['営業支援', 'サーバ']} />

      {/* ── 文言と番号 ─────────────────────────────────── */}
      {ACTIONS.map((a) => (
        <Cap key={a.y} x={88} y={a.y + 3} text={a.label} anchor="end" size={SMALL} color={TEXT} />
      ))}
      {MSGS.map((m) =>
        m.label.map((ln, i) => <Label key={`${m.y}-${i}`} x={PC + 6} y={m.y - 6 - (m.label.length - 1 - i) * 13} text={ln} />),
      )}
      <Label x={PC + 6} y={316} text="HTTP 通信" />
      {MSGS.map((m) => (
        <Cap key={m.n} x={PC - 9} y={m.y + 3.5} text={m.n ?? ''} anchor="middle" size={SIZE} color={TEXT} />
      ))}

      {/* ── 強調の文字 ─────────────────────────────────── */}
      {highlight && (
        <Callout
          x={132}
          y={12}
          w={102}
          lines={['KDC との通信は 88 番']}
          leader={[
            [234, 21.4],
            [246, 21.4],
          ]}
        />
      )}
    </FigSvg>
  )
}
