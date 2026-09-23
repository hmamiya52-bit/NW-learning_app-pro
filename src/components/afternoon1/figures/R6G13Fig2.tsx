import { Cap, FigSvg, RangeBar, RouteTag } from './primitives'
import { FONT_SCALE, MUTED } from './tokens'
import type { ExamFigureProps } from './tokens'

/**
 * 図2 A 社の VPN を構成する IP パケット構造 — R6 午後Ⅰ 問3
 *
 * 原図は説明文を左、パケットの絵を右に置くが、375px では横に入らないので
 * 説明文を各パケットの上に移した。マスの数・並び・名前・2段の入れ子は原図どおり。
 *
 * 色について: この図はネットワーク構成図ではなくパケットの並びなので、
 * TONE の3色（装置／ホスト／外部）はどれも当てはまらない。
 * 役割で色を変えられない以上、**全部のマスを同じ白**にして、
 * 入れ子の段だけで意味を持たせる（色の違いを深読みさせない）。
 *
 * 設問1(4)はトンネルモードで暗号化される範囲を図2 中の字句で答えさせるので、
 * 解説を開いたときは、トランスポートモード（現在）とトンネルモードの範囲を
 * 帯で描き分ける。トンネルモードの帯は ESP ヘッダーの所で途切れる
 * （ESP ヘッダーは復号のために平文で残すので、暗号化の範囲に入らない）。
 */

const CELL = '#ffffff'
const EDGE = MUTED
const TEXT = '#334155'

function Field({
  x,
  y,
  w,
  h,
  lines,
  size = 6.5,
}: {
  x: number
  y: number
  w: number
  h: number
  lines: string[]
  size?: number
}) {
  const fs = size * FONT_SCALE
  const lh = fs + 2
  const startY = y + h / 2 + fs * 0.44 - ((lines.length - 1) * lh) / 2
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={CELL} stroke={EDGE} strokeWidth={1.1} />
      <text
        x={x + w / 2}
        y={startY}
        textAnchor="middle"
        fontSize={fs}
        fontWeight={700}
        fill={TEXT}
      >
        {lines.map((ln, i) => (
          <tspan key={i} x={x + w / 2} dy={i === 0 ? 0 : lh}>
            {ln}
          </tspan>
        ))}
      </text>
    </g>
  )
}

/** 「元の IP パケット」の2段組（上段が見出し、下段がヘッダーとペイロード） */
function OriginalPacket({ x, y, w }: { x: number; y: number; w: number }) {
  const half = w / 2
  return (
    <g>
      <Field x={x} y={y} w={w} h={14} lines={['元の IP パケット']} size={6} />
      <Field x={x} y={y + 14} w={half} h={22} lines={['元の', 'IPヘッダー']} size={5.5} />
      <Field x={x + half} y={y + 14} w={half} h={22} lines={['元の', 'IPペイロード']} size={5.5} />
    </g>
  )
}

export default function R6G13Fig2({ highlight = false }: ExamFigureProps) {
  return (
    <FigSvg w={340} h={160} title="図2 A 社の VPN を構成する IP パケット構造">
      {/* (1) IP-IP でカプセル化したパケット */}
      <Cap x={5} y={11} text="(1) 元の IP パケットを IP-IP でカプセル化した IP パケット" size={7} />
      <Field x={5} y={16} w={70} h={36} lines={['IP', 'ヘッダー']} />
      <OriginalPacket x={75} y={16} w={180} />

      {/* (2) さらに IPsec で暗号化したパケット */}
      <Cap x={5} y={66} text="(2) (1)の IP パケットを更に IPsec で暗号化した IP パケット" size={7} />
      <Field x={5} y={72} w={52} h={36} lines={['IP', 'ヘッダー']} />
      <Field x={57} y={72} w={48} h={36} lines={['ESP', 'ヘッダー']} />
      <OriginalPacket x={105} y={72} w={122} />
      <Field x={227} y={72} w={52} h={36} lines={['ESP', 'トレーラ']} />
      <Field x={279} y={72} w={56} h={36} lines={['ESP', '認証データ']} />

      {/* ── 強調：暗号化される範囲の対比 ── */}
      {highlight && (
        <g>
          {/* トンネルモードで暗号化される範囲。ESP ヘッダーは中身を読ませない
              ための情報なので、暗号化の外に残る（帯が途切れているのがその印） */}
          <RangeBar x1={5} x2={57} y={122} />
          <RangeBar x1={105} x2={279} y={122} />
          {/* A 社が今使っているトランスポートモードの範囲 */}
          <RangeBar x1={105} x2={279} y={146} soft />
          <RouteTag cx={192} cy={122} text="トンネルモード" />
          <RouteTag cx={192} cy={146} text="トランスポートモード（現在）" />
        </g>
      )}
    </FigSvg>
  )
}
