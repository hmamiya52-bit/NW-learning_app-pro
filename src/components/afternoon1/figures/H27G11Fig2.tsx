import { ArrowDefs, Callout, Cap, FigSvg, Route } from './primitives'
import { LINE, LOGICAL, MUTED, useFigureId } from './tokens'
import type { ExamFigureProps } from './tokens'

/**
 * 図2 エージェント方式における SSO 認証処理のシーケンス — H27 午後Ⅰ 問1
 *
 * 縦線（PC・Web アプリケーションサーバ・SSO サーバ）、①〜⑦の番号、②と⑤の波括弧（2本で1組）、
 * ⑥の破線の囲み、各矢印の向きと文言は原図どおり。
 * ネットワーク構成図ではないので役割の3色は当てない。矢印は物理的な接続ではないので LOGICAL で描く。
 * 矢印の文言は、PC がかかわる矢印は PC と Web アプリケーションサーバのあいだに、
 * サーバどうしの矢印は Web アプリケーションサーバと SSO サーバのあいだに置く（原図と同じ置き方）。
 *
 * 解説を開いたときは、②と⑤の応答（どちらもリダイレクト。空欄イ）を赤でなぞり、
 * ⑤の応答で Cookie にアクセスチケットが入ること（設問2・空欄ウ）と、
 * ⑤のサービス要求でその Cookie を Web アプリケーションサーバへ送らせるのが Domain 属性であること
 * （設問3(1)）を吹き出しで示す。
 */

const TEXT = '#334155'
/** 文字の大きさ（Cap の size） */
const SIZE = 7.5

const PC = 60
const WEB = 180
const SSO = 300

interface Msg {
  y: number
  from: number
  to: number
  label: string
}

const MSGS: Msg[] = [
  { y: 46, from: PC, to: WEB, label: 'サービス要求' }, // ①
  { y: 72, from: WEB, to: PC, label: '応答' }, // ②
  { y: 98, from: PC, to: SSO, label: 'SSO サーバアクセス' }, // ②
  { y: 124, from: SSO, to: PC, label: '認証画面' }, // ③
  { y: 150, from: PC, to: SSO, label: 'UserID/Password 送出' }, // ④
  { y: 176, from: SSO, to: PC, label: '応答' }, // ⑤
  { y: 202, from: PC, to: WEB, label: 'サービス要求' }, // ⑤
  { y: 234, from: WEB, to: SSO, label: 'アクセスチケット確認要求' }, // ⑥
  { y: 256, from: SSO, to: WEB, label: '応答' }, // ⑥
  { y: 282, from: WEB, to: PC, label: 'Web アプリケーション画面' }, // ⑦
]

/** 番号（ベースライン）。②と⑤は波括弧の先に置く */
const NUMS: { n: string; x: number; y: number }[] = [
  { n: '①', x: 22, y: 49.5 },
  { n: '②', x: 18, y: 88.5 },
  { n: '③', x: 22, y: 127.5 },
  { n: '④', x: 22, y: 153.5 },
  { n: '⑤', x: 18, y: 192.5 },
  { n: '⑥', x: 20, y: 243.5 },
  { n: '⑦', x: 22, y: 285.5 },
]

/** 2本で1組の矢印をくくる波括弧（原図の②と⑤） */
function Brace({ y1, y2 }: { y1: number; y2: number }) {
  const ym = (y1 + y2) / 2
  return (
    <path
      d={`M36,${y1} Q32,${y1} 32,${y1 + 5} L32,${ym - 4} Q32,${ym} 28,${ym} Q32,${ym} 32,${ym + 4} L32,${y2 - 5} Q32,${y2} 36,${y2}`}
      fill="none"
      stroke={MUTED}
      strokeWidth={1}
    />
  )
}

export default function H27G11Fig2({ highlight = false }: ExamFigureProps) {
  const fid = useFigureId('h27g11-fig2')
  const arrow = `url(#${fid}-arrow-0)`
  return (
    <FigSvg w={340} h={296} title="図2 エージェント方式における SSO 認証処理のシーケンス">
      <ArrowDefs figureId={fid} colors={[LOGICAL]} />

      {/* ── 縦線の見出し ───────────────────────────────── */}
      <Cap x={PC} y={25} text="PC" anchor="middle" size={SIZE} color={TEXT} />
      <Cap x={WEB} y={11.5} text="Web アプリケーション" anchor="middle" size={SIZE} color={TEXT} />
      <Cap x={WEB} y={25} text="サーバ" anchor="middle" size={SIZE} color={TEXT} />
      <Cap x={SSO} y={25} text="SSO サーバ" anchor="middle" size={SIZE} color={TEXT} />

      {/* ── 縦線・⑥の囲み・波括弧 ─────────────────────── */}
      {[PC, WEB, SSO].map((x) => (
        <line key={x} x1={x} y1={31} x2={x} y2={292} stroke={LINE} strokeWidth={1.2} />
      ))}
      <rect x={36} y={216} width={294} height={48} fill="none" stroke={MUTED} strokeWidth={1.1} strokeDasharray="4 3" />
      <Brace y1={64} y2={106} />
      <Brace y1={168} y2={210} />

      {/* ── 矢印 ───────────────────────────────────── */}
      {MSGS.map((m) => (
        <line key={m.y} x1={m.from} y1={m.y} x2={m.to} y2={m.y} stroke={LOGICAL} strokeWidth={1.2} markerEnd={arrow} />
      ))}

      {/* ── 強調：②と⑤の応答（リダイレクト）。矢頭は隠さない ── */}
      {highlight && (
        <g>
          <Route
            points={[
              [WEB, 72],
              [PC + 8, 72],
            ]}
          />
          <Route
            points={[
              [SSO, 176],
              [PC + 8, 176],
            ]}
          />
        </g>
      )}

      {/* ── 矢印の文言と番号 ───────────────────────────── */}
      {MSGS.map((m) => (
        <Cap
          key={m.y}
          x={m.from === PC || m.to === PC ? (PC + WEB) / 2 : (WEB + SSO) / 2}
          y={m.y - 5}
          text={m.label}
          anchor="middle"
          size={SIZE}
          color={TEXT}
        />
      ))}
      {NUMS.map((n) => (
        <Cap key={n.n} x={n.x} y={n.y} text={n.n} anchor="middle" size={SIZE} color={TEXT} />
      ))}

      {/* ── 強調の文字 ─────────────────────────────────── */}
      {highlight && (
        <g>
          <Callout
            x={190}
            y={155}
            w={106}
            lines={['Cookie でチケットを渡す']}
            leader={[
              [243, 173.8],
              [243, 176],
            ]}
          />
          <Callout
            x={186}
            y={181}
            w={100}
            lines={['Domain 属性があれば', 'Web サーバにも届く']}
            leader={[
              [186, 197],
              [172, 202],
            ]}
          />
        </g>
      )}
    </FigSvg>
  )
}
