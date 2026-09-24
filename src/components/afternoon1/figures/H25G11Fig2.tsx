import { Cap, FigSvg, Ring, Route } from './primitives'
import { FONT_SCALE, MARK, MARK_FILL, MARK_TEXT, MUTED, TONE } from './tokens'
import type { ExamFigureProps, ToneName } from './tokens'

/**
 * 図2 B 社の PC から開発システムへの接続概念図（抜粋）— H25 午後Ⅰ 問1
 *
 * 原図は左から B 社の PC・SSL トンネル・SSL-VPN 装置・サーバを横に並べる。
 * 横一列のままだと 375px で文字が 5px 台まで縮むので、上から下へ流れる形に組み直した。
 * データの流れ（6310→11000、6320→23、6330→13000）は右寄りの3本の縦線にし、
 * (b) を通ったあと左へ折れて各サーバのポートに入る。3本が交わらない順に折ってある。
 * ブラウザ・ポートマッピングテーブル・サーバは流れの左に寄せた。
 * ポート番号・対応・データの流れ・凡例は原図どおり。
 *
 * 色は役割だけで決めている。B 社の PC とサーバは host、SSL-VPN 装置は device。
 * 中のソフトウェアモジュール（ブラウザ・Java アプレット・(b)・AP）は白い角丸、
 * ポート番号は原図の凡例どおり灰色の四角（役割の色ではない）。
 *
 * 解説を開いたときは、6310 から 11000 までの流れを赤でなぞり、
 * TCP が (b) で切れて張り直されること（TCP ①・②）と、
 * 待受けポート 6310・(b)・ポートマッピングテーブルに輪を付ける（設問2(2)(3)）。
 */

const TEXT = '#334155'
/** ポート番号の四角（原図の凡例の網掛け） */
const PORT = '#e2e8f0'
/** データの流れ（原図の太線） */
const FLOW = '#334155'
const WHITE = '#ffffff'

/** 流れの3本の x（左から 6310・6320・6330） */
const F1 = 214
const F2 = 264
const F3 = 314

/** 文字を1つ持つ四角（ポート番号・表のマス） */
function Cell({
  x,
  y,
  w,
  h,
  text,
  fill,
  size = 6.5,
  bold = false,
}: {
  x: number
  y: number
  w: number
  h: number
  text: string
  fill: string
  size?: number
  bold?: boolean
}) {
  const fs = size * FONT_SCALE
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={fill} stroke={MUTED} strokeWidth={1} />
      <text
        x={x + w / 2}
        y={y + h / 2 + fs * 0.415}
        textAnchor="middle"
        fontSize={fs}
        fontWeight={bold ? 700 : 400}
        fill={TEXT}
      >
        {text}
      </text>
    </g>
  )
}

/** ソフトウェアモジュール（原図の角丸の箱） */
function Module({
  x,
  y,
  w,
  h,
  text,
}: {
  x: number
  y: number
  w: number
  h: number
  text?: string
}) {
  const fs = 7 * FONT_SCALE
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={6} fill={WHITE} stroke={MUTED} strokeWidth={1.1} />
      {text && (
        <text x={x + w / 2} y={y + h / 2 + fs * 0.415} textAnchor="middle" fontSize={fs} fontWeight={700} fill={TEXT}>
          {text}
        </text>
      )}
    </g>
  )
}

/** 機器の枠（B 社の PC・SSL-VPN 装置・サーバ）。色は役割で決める */
function Frame({ x, y, w, h, tone }: { x: number; y: number; w: number; h: number; tone: ToneName }) {
  const t = TONE[tone]
  return <rect x={x} y={y} width={w} height={h} rx={2} fill={t.fill} stroke={t.stroke} strokeWidth={1.2} />
}

/** データの流れの線 */
function Flow({ points, dash }: { points: [number, number][]; dash?: string }) {
  return (
    <polyline
      points={points.map(([px, py]) => `${px},${py}`).join(' ')}
      fill="none"
      stroke={FLOW}
      strokeWidth={2.4}
      strokeDasharray={dash}
    />
  )
}

/** 経路に添える札（高さ fs+8。H25G11Fig1 の Tag と同じ） */
function Tag({ cx, cy, text, w }: { cx: number; cy: number; text: string; w: number }) {
  const fs = 7.5 * FONT_SCALE
  const h = fs + 8
  return (
    <g>
      <rect x={cx - w / 2} y={cy - h / 2} width={w} height={h} rx={h / 2} fill={MARK_FILL} stroke={MARK} strokeWidth={1} />
      <text x={cx} y={cy + fs * 0.415} textAnchor="middle" fontSize={fs} fontWeight={700} fill={MARK_TEXT}>
        {text}
      </text>
    </g>
  )
}

/** ポートマッピングテーブル（待受けポート → 転送先ポート・転送先アドレス） */
const MAPPING: [string, string, string][] = [
  ['6310', '11000', '10.10.10.1'],
  ['6320', '23', '10.10.10.2'],
  ['6330', '13000', '10.10.10.2'],
]

/** 6310 から 11000 までの流れ（解説を開いたときになぞる） */
const AP1_FLOW: [number, number][] = [
  [F1, 70],
  [F1, 284],
  [128, 284],
]

export default function H25G11Fig2({ highlight = false }: ExamFigureProps) {
  return (
    <FigSvg w={340} h={420} title="図2 B 社の PC から開発システムへの接続概念図（抜粋）">
      {/* ── 機器の枠 ───────────────────────────────── */}
      <Cap x={4} y={12} text="B社のPC" size={7.5} color={TEXT} bold />
      <Frame x={2} y={16} w={336} h={76} tone="host" />
      <Cap x={4} y={138} text="SSL-VPN装置" size={7.5} color={TEXT} bold />
      <Frame x={2} y={142} w={336} h={96} tone="device" />
      <Frame x={8} y={268} w={144} h={32} tone="host" />
      <Frame x={8} y={332} w={144} h={52} tone="host" />

      {/* ── 強調：(b) とポートマッピングテーブルの輪（箱より先）── */}
      {highlight && (
        <g>
          <Ring x={160} y={150} w={170} h={46} rx={6} />
          <Ring x={8} y={148} w={140} h={84} />
        </g>
      )}

      {/* ── 入れ物の箱（流れの線はこの上を通す）──────── */}
      <Module x={12} y={42} w={60} h={22} text="ブラウザ" />
      <polygon
        points="78,53 88,43 88,48 118,48 118,43 128,53 118,63 118,58 88,58 88,63"
        fill={WHITE}
        stroke={MUTED}
        strokeWidth={1}
      />
      <Module x={134} y={22} w={200} h={64} />
      <Cap x={140} y={36} text="(a) Java アプレット" size={7} color={TEXT} bold />
      <Cap x={140} y={73} text="待受けポート" size={6.5} color={TEXT} />
      <rect x={8} y={148} width={140} height={84} fill={WHITE} stroke={MUTED} strokeWidth={1.1} />
      <Module x={160} y={150} w={170} h={46} />

      {/* ── 強調：待受けポート 6310 の輪（Java アプレットの箱より後、ポートより先）── */}
      {highlight && <Ring x={197} y={62} w={34} h={16} />}

      {/* ── データの流れ（ポートより先に描く）──────────── */}
      {/* SSL トンネルの中だけ破線（原図どおり） */}
      <Flow points={[[F1, 78], [F1, 100]]} />
      <Flow points={[[F2, 78], [F2, 100]]} />
      <Flow points={[[F3, 78], [F3, 100]]} />
      <Flow points={[[F1, 100], [F1, 120]]} dash="4 3" />
      <Flow points={[[F2, 100], [F2, 120]]} dash="4 3" />
      <Flow points={[[F3, 100], [F3, 120]]} dash="4 3" />
      <Flow points={[[F1, 120], [F1, 284], [146, 284]]} />
      <Flow points={[[F2, 120], [F2, 346], [146, 346]]} />
      <Flow points={[[F3, 120], [F3, 370], [146, 370]]} />
      {/* サーバの中のポート → アプリケーション */}
      <Flow points={[[96, 284], [110, 284]]} />
      <Flow points={[[96, 346], [110, 346]]} />
      <Flow points={[[96, 370], [110, 370]]} />

      {/* ── 強調：6310 → 11000 の流れ（ノードより先）── */}
      {highlight && <Route points={AP1_FLOW} />}

      {/* 待受けポート */}
      <Cell x={197} y={62} w={34} h={16} text="6310" fill={PORT} size={7} />
      <Cell x={247} y={62} w={34} h={16} text="6320" fill={PORT} size={7} />
      <Cell x={297} y={62} w={34} h={16} text="6330" fill={PORT} size={7} />

      {/* ── SSL トンネル ───────────────────────────── */}
      <rect x={196} y={100} width={136} height={20} rx={10} fill="none" stroke={MUTED} strokeWidth={1.1} />
      <Cap x={190} y={114} text="SSL トンネル" anchor="end" size={7.5} color={TEXT} bold />

      {/* ── SSL-VPN 装置 ───────────────────────────── */}
      <Cap x={78} y={160} text="ポートマッピングテーブル" anchor="middle" size={6.5} color={TEXT} bold />
      <Cell x={12} y={165} w={50} h={15} text="待受けポート" fill={WHITE} bold />
      <Cell x={62} y={165} w={82} h={15} text="転送先ポート" fill={WHITE} bold />
      {MAPPING.map(([listen, port, addr], i) => (
        <g key={listen}>
          <Cell x={12} y={180 + i * 15} w={50} h={15} text={listen} fill={PORT} />
          <Cell x={62} y={180 + i * 15} w={32} h={15} text={port} fill={PORT} />
          <Cell x={94} y={180 + i * 15} w={50} h={15} text={addr} fill={WHITE} />
        </g>
      ))}
      <Cap x={165} y={163} text="(b) ポート" size={6.5} color={TEXT} bold />
      <Cap x={165} y={175} text="フォワード" size={6.5} color={TEXT} bold />
      <Cap x={165} y={187} text="処理の一部" size={6.5} color={TEXT} bold />

      {/* ── サーバ ─────────────────────────────────── */}
      <Cap x={80} y={250} text="shisankanri.example.com" anchor="middle" size={6.5} color={TEXT} />
      <Cap x={80} y={262} text="資産管理サーバ" anchor="middle" size={7} color={TEXT} bold />
      <Module x={56} y={276} w={40} h={16} text="AP1" />
      <Cell x={110} y={276} w={36} h={16} text="11000" fill={PORT} size={7} />

      <Cap x={80} y={314} text="testkankyo.example.com" anchor="middle" size={6.5} color={TEXT} />
      <Cap x={80} y={326} text="テスト環境サーバ" anchor="middle" size={7} color={TEXT} bold />
      <Module x={56} y={338} w={40} h={16} text="AP2" />
      <Cell x={110} y={338} w={36} h={16} text="23" fill={PORT} size={7} />
      <Module x={56} y={362} w={40} h={16} text="AP3" />
      <Cell x={110} y={362} w={36} h={16} text="13000" fill={PORT} size={7} />

      {/* ── 強調の文字：TCP は (b) で切れて張り直される ── */}
      {highlight && (
        <g>
          <Tag cx={F1} cy={131} text="TCP①" w={36} />
          <Tag cx={F1} cy={217} text="TCP②" w={36} />
        </g>
      )}

      {/* ── 凡例 ─────────────────────────────────────── */}
      <rect x={4} y={392} width={9} height={9} fill={PORT} stroke={MUTED} strokeWidth={1} />
      <Cap x={15} y={400} text="：ポート番号" size={6.5} color={MUTED} />
      <line x1={70} y1={396.5} x2={84} y2={396.5} stroke={FLOW} strokeWidth={2.4} />
      <Cap x={86} y={400} text="：データの流れ" size={6.5} color={MUTED} />
      <rect x={150} y={392} width={12} height={9} rx={3} fill={WHITE} stroke={MUTED} strokeWidth={1} />
      <Cap x={164} y={400} text="：ソフトウェアモジュール" size={6.5} color={MUTED} />
      <Cap x={4} y={414} text="AP1，AP2，AP3：アプリケーション" size={6.5} color={MUTED} />
    </FigSvg>
  )
}
