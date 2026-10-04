import type { ReactNode } from 'react'
import { Box, Cap, Ell, FigSvg, Wire } from './primitives'
import {
  BUS,
  CLOUD,
  DC_X_FIG1,
  DC_X_FIG4,
  INET_FIG1,
  INET_FIG4,
  LINE_Y,
  SIZE,
  SMALL,
  TEXT,
  VLB,
  VPC,
  VROUTER,
  VWEB,
  dc,
} from './r5g11Layout'
import type { Rect } from './r5g11Layout'
import { FONT_SCALE, FRAME, MUTED, SEGMENT } from './tokens'

/**
 * G 社のシステム構成（R5 午後Ⅰ 問1 の図1・図4 で共通の下絵）
 *
 * 図4 は図1 の左に J 社クラウド（仮想 LB・G 社用 VPC セグメント・Web サーバ・仮想ルータ）を足し、専用線で L3SW とつなぎ、
 * DMZ の Web サーバを外した図なので、下絵をここに1つだけ持ち、`cloud` で切り替える。座標は r5g11Layout.ts。
 *
 * 色は役割だけで決めている。ルータ・FW・L2SW・L3SW は device、サーバは host（VPC の仮想サーバも host）、
 * インターネットと、J 社が提供する仮想 LB（J 社の負荷分散サービス）と仮想ルータ（J 社の VPC サービスの機能）は outside
 * （R3-G1-2 の VPC GW と同じ扱い）。
 *
 * 描く順番: 囲み → 線 → underlay（強調の経路・輪）→ ノード → overlay（強調の文字）。
 */

type Corner = 'tl' | 'tr' | 'br' | 'bc'

/** 名前を枠の内側に置く囲み（原図どおり。G 社データセンターは右上、J 社クラウドは左上、DMZ は右下、セグメントは下の真ん中） */
function Frame({
  rect,
  label,
  corner,
  solid = false,
  rx = 0,
}: {
  rect: Rect
  label: string
  corner: Corner
  solid?: boolean
  rx?: number
}) {
  const { x, y, w, h } = rect
  const fs = SIZE * FONT_SCALE
  const lx = corner === 'tl' ? x + 4.5 : corner === 'bc' ? x + w / 2 : x + w - 5
  const ly = corner === 'tl' || corner === 'tr' ? y + 4 + fs : y + h - 6
  const anchor = corner === 'tl' ? 'start' : corner === 'bc' ? 'middle' : 'end'
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={rx}
        fill="none"
        stroke={solid ? FRAME : SEGMENT}
        strokeWidth={solid ? 1.3 : 1.1}
        strokeDasharray={solid ? undefined : '5 3'}
      />
      <text x={lx} y={ly} textAnchor={anchor} fontSize={fs} fill={TEXT}>
        {label}
      </text>
    </g>
  )
}

/** 仮想セグメント（横の太線と、原図の黒い四角。幅の広い四角が機器のつなぎ目） */
function Bus({ taps }: { taps: number[] }) {
  return (
    <g>
      <line x1={BUS.x1} y1={BUS.y} x2={BUS.x2} y2={BUS.y} stroke={FRAME} strokeWidth={1.6} />
      {[BUS.x1, BUS.x2].map((x) => (
        <rect key={x} x={x - 2.5} y={BUS.y - 2.5} width={5} height={5} fill={FRAME} />
      ))}
      {taps.map((x) => (
        <rect key={x} x={x - 4.5} y={BUS.y - 2.5} width={9} height={5} fill={FRAME} />
      ))}
    </g>
  )
}

const mid = (r: Rect) => r.x + r.w / 2

export default function R5G11Base({
  cloud,
  title,
  h,
  underlay,
  overlay,
}: {
  /** 図4（J 社クラウドを足し、DMZ の Web サーバを外す） */
  cloud: boolean
  title: string
  h: number
  underlay?: ReactNode
  overlay?: ReactNode
}) {
  const D = dc(cloud ? DC_X_FIG4 : DC_X_FIG1)
  const inet = cloud ? INET_FIG4 : INET_FIG1
  const cx = D.cx
  /** 仮想セグメントにつながる機器の x（Web サーバ2台・仮想 LB・仮想ルータ） */
  const taps = [mid(VWEB[0]), mid(VWEB[1]), mid(VLB), mid(VROUTER)]
  return (
    <FigSvg w={340} h={h} title={title}>
      {/* ── 囲み ───────────────────────────────────── */}
      <Frame rect={D.frame} label="G 社データセンター" corner="tr" solid />
      <Frame rect={D.dmz} label="DMZ" corner="br" />
      <Frame rect={D.seg} label="サーバセグメント" corner="bc" />
      {cloud && (
        <g>
          <Frame rect={CLOUD} label="J 社クラウド" corner="tl" solid />
          <Frame rect={VPC} label="G 社用 VPC セグメント" corner="bc" rx={8} />
        </g>
      )}

      {/* ── 線 ─────────────────────────────────────── */}
      {/* インターネット ― ルータ ― FW ― L3SW ― サーバセグメントの L2SW ― AP サーバ2台 */}
      <Wire x1={cloud ? 172 : cx} y1={cloud ? 22 : inet.cy + inet.ry} x2={cx} y2={D.router.y} />
      <Wire x1={cx} y1={D.router.y + D.router.h} x2={cx} y2={D.fw.y} />
      <Wire x1={cx} y1={D.fw.y + D.fw.h} x2={cx} y2={D.l3sw.y} />
      <Wire x1={cx} y1={D.l3sw.y + D.l3sw.h} x2={cx} y2={D.segSw.y} />
      <Wire x1={cx - 8} y1={D.segSw.y + D.segSw.h} x2={mid(D.ap[0])} y2={D.ap[0].y} />
      <Wire x1={cx + 8} y1={D.segSw.y + D.segSw.h} x2={mid(D.ap[1])} y2={D.ap[1].y} />
      {/* FW ― DMZ の L2SW ― Web サーバ（図1 だけ）・DNS サーバ */}
      <Wire x1={D.fw.x + D.fw.w} y1={D.fw.y + 9} x2={D.dmzSw.x} y2={D.dmzSw.y + 9} />
      {!cloud && <Wire x1={mid(D.dmzSw) - 8} y1={D.dmzSw.y + D.dmzSw.h} x2={mid(D.web)} y2={D.web.y} />}
      <Wire x1={mid(D.dmzSw) + 8} y1={D.dmzSw.y + D.dmzSw.h} x2={mid(D.dns)} y2={D.dns.y} />
      {cloud && (
        <g>
          {/* インターネット ― 仮想 LB ― 仮想セグメント ― Web サーバ・仮想ルータ */}
          <Wire x1={132} y1={22} x2={mid(VLB)} y2={VLB.y} />
          <Wire x1={mid(VLB)} y1={VLB.y + VLB.h} x2={mid(VLB)} y2={BUS.y} />
          {[...VWEB, VROUTER].map((r) => (
            <Wire key={r.x} x1={mid(r)} y1={BUS.y} x2={mid(r)} y2={r.y} />
          ))}
          <Bus taps={taps} />
          {/* 仮想ルータ ― 専用線 ― L3SW */}
          <Wire x1={VROUTER.x + VROUTER.w} y1={LINE_Y} x2={D.l3sw.x} y2={LINE_Y} />
        </g>
      )}

      {underlay}

      {/* ── ノード ───────────────────────────────────── */}
      <Ell {...inet} tone="outside" lines={['インターネット']} size={SIZE} />
      <Box {...D.router} tone="device" lines={['ルータ']} size={SIZE} />
      <Box {...D.fw} tone="device" lines={['FW']} size={SIZE} />
      <Box {...D.l3sw} tone="device" lines={['L3SW']} size={SIZE} />
      <Box {...D.segSw} tone="device" lines={['L2SW']} size={SIZE} />
      {D.ap.map((r) => (
        <Box key={r.x} {...r} tone="host" lines={['AP', 'サーバ']} size={SIZE} />
      ))}
      <Box {...D.dmzSw} tone="device" lines={['L2SW']} size={SIZE} />
      {!cloud && <Box {...D.web} tone="host" lines={['Web', 'サーバ']} size={SIZE} />}
      <Box {...D.dns} tone="host" lines={['DNS', 'サーバ']} size={SIZE} />
      {cloud && (
        <g>
          <Box {...VLB} tone="outside" lines={['仮想 LB']} size={SIZE} />
          {VWEB.map((r) => (
            <Box key={r.x} {...r} tone="host" lines={['Web', 'サーバ']} size={SIZE} />
          ))}
          <Cap x={(VWEB[0].x + VWEB[0].w + VWEB[1].x) / 2} y={119} text="…" anchor="middle" color={MUTED} />
          <Box {...VROUTER} tone="outside" lines={['仮想', 'ルータ']} size={SIZE} />
          <Cap x={(CLOUD.x + CLOUD.w + D.frame.x) / 2} y={LINE_Y - 4} text="専用線" anchor="middle" size={SIZE} color={TEXT} />
        </g>
      )}

      {/* ── 略語の説明（図1 は原図どおり図の下に2行、図4 は左下） ─────── */}
      {cloud ? (
        <Cap x={4} y={228} text="VPC：仮想プライベートクラウド" size={SMALL} color={MUTED} />
      ) : (
        <g>
          <Cap x={40} y={248} text="FW：ファイアウォール" size={SMALL} color={MUTED} />
          <Cap x={120} y={248} text="L2SW：レイヤー2スイッチ" size={SMALL} color={MUTED} />
          <Cap x={217} y={248} text="L3SW：レイヤー3スイッチ" size={SMALL} color={MUTED} />
          <Cap x={40} y={262} text="AP サーバ：アプリケーションサーバ" size={SMALL} color={MUTED} />
        </g>
      )}

      {overlay}
    </FigSvg>
  )
}
