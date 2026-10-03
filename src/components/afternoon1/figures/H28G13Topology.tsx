import type { ReactNode } from 'react'
import { Box, Cap, DashFrame, Ell, Wire } from './primitives'
import { D, HUB, INTERNET, SIZE, rightMid } from './h28g13Layout'
import { FONT_SCALE, MUTED, TONE } from './tokens'

/**
 * D 社のネットワーク構成（H28 午後Ⅰ 問3 の図1・図3 で共通の下絵）
 *
 * 図3 は図1 の MSV を旧 MSV と呼び替え、新 MSV 2台と共用ストレージを足した図なので、下絵をここに1つだけ持つ。
 * 座標は h28g13Layout.ts にあり、2枚が必ず同じ形になる。
 *
 * 色は役割だけで決めている。ルータ・FW・L3SW・SW は device、DNS・LDAP・MSV・MGW・PC・ストレージは host、
 * インターネットは outside。
 *
 * 描く順番: 囲み → 線 → underlay（強調の経路・輪）→ ノード → overlay（強調の文字）。
 * underlay をノードより前に差し込むので、箱の中の文字が隠れることはない。
 */

/**
 * ストレージ（原図どおり横倒しの円筒。右の面が見える形）。文字は胴の部分に置く。
 * 右の面の弧は胴の内側へ e だけ張り出すので、文字は左の端から右の面の弧までの真ん中に置く。
 * 図2 の共用ストレージも同じ形なので、ここから使う。
 */
export function Storage({ x, y, w, h, lines }: { x: number; y: number; w: number; h: number; lines: string[] }) {
  const t = TONE.host
  const e = h > 30 ? 6 : 5
  const r = h / 2
  const fs = SIZE * FONT_SCALE
  const lh = fs + 2.5
  const cx = x + w / 2 - e
  const startY = y + r + fs * 0.44 - ((lines.length - 1) * lh) / 2
  return (
    <g>
      <path
        d={`M${x + e},${y} L${x + w - e},${y} A${e},${r} 0 0 1 ${x + w - e},${y + h} L${x + e},${y + h} A${e},${r} 0 0 1 ${x + e},${y} Z`}
        fill={t.fill}
        stroke={t.stroke}
        strokeWidth={1.2}
      />
      <path d={`M${x + w - e},${y} A${e},${r} 0 0 0 ${x + w - e},${y + h}`} fill="none" stroke={t.stroke} strokeWidth={1.2} />
      <g>
        {/* 文字の置き場（胴の内側）。描画には出ないが、§5.4 の実測でこの枠との余白を測る */}
        <rect x={x + 1} y={y + 1} width={w - 2 * e - 2} height={h - 2} fill="none" stroke="none" />
        <text x={cx} y={startY} textAnchor="middle" fontSize={fs} fontWeight={700} fill={t.text}>
          {lines.map((ln, i) => (
            <tspan key={i} x={cx} dy={i === 0 ? 0 : lh}>
              {ln}
            </tspan>
          ))}
        </text>
      </g>
    </g>
  )
}

/** 縦の「⋮」（原図の MSV1 と MSV3 のあいだの省略） */
function VDots({ x, y }: { x: number; y: number }) {
  return (
    <g>
      {[0, 5, 10].map((d) => (
        <circle key={d} cx={x} cy={y + d} r={0.9} fill={MUTED} />
      ))}
    </g>
  )
}

function Node({ k, tone, label }: { k: string; tone: 'device' | 'host'; label: string }) {
  return <Box {...D[k]} tone={tone} lines={[label]} size={SIZE} />
}

function ToHub({ k }: { k: string }) {
  const [x, y] = rightMid(D[k])
  return <Wire x1={x} y1={y} x2={HUB[0]} y2={HUB[1]} />
}

export default function H28G13Topology({
  migration = false,
  underlay,
  overlay,
}: {
  /** 図3（移行中 NW）。MSV を旧 MSV と呼び、新 MSV 2台と共用ストレージを足す */
  migration?: boolean
  /** 線とノードのあいだに差し込むもの（強調の経路・輪） */
  underlay?: ReactNode
  /** ノードの上に重ねるもの（強調の文字） */
  overlay?: ReactNode
}) {
  const old = migration ? '旧' : ''
  return (
    <g>
      {/* ── 囲み ───────────────────────────────────── */}
      <DashFrame {...D.dmz} label="DMZ" />

      {/* ── 線 ─────────────────────────────────────── */}
      <Wire x1={197} y1={INTERNET.cy + INTERNET.ry} x2={197} y2={38} />
      <Wire x1={197} y1={58} x2={197} y2={68} />
      <Wire x1={197} y1={88} x2={197} y2={98} />
      <Wire x1={214} y1={78} x2={238} y2={78} />
      <Wire x1={270} y1={73} x2={290} y2={50} />
      <Wire x1={270} y1={78} x2={290} y2={78} />
      <Wire x1={270} y1={83} x2={290} y2={106} />
      {/* DNS1・DNS2 は箱の下から、LDAP・MSV は箱の右から L3SW へ */}
      <Wire x1={106} y1={58} x2={HUB[0]} y2={HUB[1]} />
      <Wire x1={152} y1={58} x2={HUB[0]} y2={HUB[1]} />
      <ToHub k="ldap" />
      <ToHub k="msv1" />
      <ToHub k="msv3" />
      <Wire x1={174} y1={142} x2={190} y2={118} />
      <Wire x1={222} y1={142} x2={206} y2={118} />
      <Wire x1={60} y1={108} x2={66} y2={108} />
      <Wire x1={60} y1={152} x2={66} y2={152} />
      {migration && (
        <g>
          <ToHub k="newMsv1" />
          <ToHub k="newMsv2" />
          <Wire x1={56} y1={186} x2={66} y2={178} />
          <Wire x1={56} y1={196} x2={66} y2={204} />
        </g>
      )}

      {underlay}

      {/* ── ノード ───────────────────────────────────── */}
      <Ell {...INTERNET} tone="outside" lines={['インターネット']} size={SIZE} />
      <Node k="dns1" tone="host" label="DNS1" />
      <Node k="dns2" tone="host" label="DNS2" />
      <Node k="router" tone="device" label="ルータ" />
      <Node k="ldap" tone="host" label="LDAP" />
      <Node k="fw" tone="device" label="FW" />
      <Node k="l3sw" tone="device" label="L3SW" />
      <Node k="sw" tone="device" label="SW" />
      <Node k="dns3" tone="host" label="DNS3" />
      <Node k="mgw1" tone="host" label="MGW1" />
      <Node k="mgw2" tone="host" label="MGW2" />
      <Storage {...D.storage1} lines={['ストレージ']} />
      <Node k="msv1" tone="host" label={`${old}MSV1`} />
      <VDots x={32} y={125} />
      <VDots x={89} y={125} />
      <Storage {...D.storage3} lines={['ストレージ']} />
      <Node k="msv3" tone="host" label={`${old}MSV3`} />
      <Node k="pc1" tone="host" label="PC" />
      <Cap x={198} y={155} text="…" anchor="middle" color={MUTED} />
      <Node k="pc2" tone="host" label="PC" />
      {migration && (
        <g>
          <Storage {...D.shared} lines={['共用', 'ストレージ']} />
          <Node k="newMsv1" tone="host" label="新MSV1" />
          <Node k="newMsv2" tone="host" label="新MSV2" />
        </g>
      )}

      {overlay}
    </g>
  )
}
