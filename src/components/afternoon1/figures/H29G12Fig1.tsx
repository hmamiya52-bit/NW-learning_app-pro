import { Box, Cap, Ell, FigSvg, Poly, Ring, Route, Wire } from './primitives'
import { MUTED } from './tokens'
import type { ExamFigureProps } from './tokens'
import { B_PS, HQ_UTM, HQ_W, HQ_X, HQ_Y, INET, INET_LINES, INET_TO_UTM, SIZE, SMALL, TEXT, WAN, WAN_LINES, WAN_X, wanPath } from './h29g12Layout'
import type { Rect } from './h29g12Layout'
import { BranchFrames, BranchNodes, BranchWires, Frame } from './H29G12Parts'

/**
 * 図1 T 社の現行ネットワーク構成（抜粋）— H29 午後Ⅰ 問2
 *
 * 原図は左に支店（2枚重ね）、右に本社を並べ、あいだにインターネットと広域イーサ網を置く（縦横比 2.4:1）。
 * 図2 と同じく、支店を上の段に置いて中の2列を右へ 90 度回し、インターネットを支店の右、広域イーサ網を支店の UTM の下に置いた
 * （`h29g12Layout.ts`）。本社は下に全幅で置き、中の並び（UTM・L3SW・L2SW・PC … PC の縦の列と、右のファイルサーバ・
 * プリントサーバ・プリンタ）は原図どおり。支店からインターネットと広域イーサ網へは、原図どおり2本ずつ（手前の枠と後ろの枠から）。
 * プリンタとプリントサーバの USB（注記2）は太線。略語の説明は原図どおり図の下に置き、注記1・2 は図の下の注記（note）に回した。
 *
 * 色は役割だけで決めている。UTM・L2SW・L3SW は device、PC・サーバ・プリンタは host、インターネットと広域イーサ網は outside。
 *
 * 解説を開いたときは、支店の PC から本社のファイルサーバへのファイル転送通信の道筋をなぞり（今、広域イーサ網を通る唯一の通信。設問2(1)）、
 * 支店のプリントサーバに輪を付ける（印刷は自拠点で済む。設問1・2(1)）。
 */

const HQ: Rect = { x: HQ_X, y: HQ_Y, w: HQ_W, h: 166 }
const L3: Rect = { x: 130, y: 204, w: 40, h: 18 }
const L2: Rect = { x: 132, y: 244, w: 36, h: 18 }
const PC1: Rect = { x: 96, y: 284, w: 24, h: 18 }
const PC2: Rect = { x: 138, y: 284, w: 24, h: 18 }
const FS: Rect = { x: 268, y: 175, w: 42, h: 30 }
const PS: Rect = { x: 268, y: 221, w: 42, h: 30 }
const PR: Rect = { x: 268, y: 284, w: 42, h: 18 }
const L3_Y = L3.y + L3.h / 2

const mid = (r: Rect) => r.x + r.w / 2
const bottom = (r: Rect) => r.y + r.h

/** L3SW からファイルサーバへの線（強調の道筋もこの線をなぞる） */
const TO_FS: [number, number][] = [
  [L3.x + L3.w, L3.y + 3],
  [FS.x, FS.y + 18],
]

/** 支店の PC → L2SW → UTM → 広域イーサ網 → 本社の L3SW → ファイルサーバ（ファイル転送通信） */
const FILE: [number, number][] = [
  [94, 40],
  [94, 74],
  [140, 74],
  [140, WAN.cy],
  [WAN_X, WAN.cy],
  [WAN_X, L3_Y],
  [mid(L3), L3_Y],
  TO_FS[0],
  TO_FS[1],
  [FS.x + 8, FS.y + 17],
]

export default function H29G12Fig1({ highlight = false }: ExamFigureProps) {
  return (
    <FigSvg w={340} h={350} title="図1 T 社の現行ネットワーク構成（抜粋）">
      {/* ── 囲み ───────────────────────────────────── */}
      <BranchFrames />
      <Frame rect={HQ} label="本社（従業員100人）" at="tr" />

      {/* ── 線 ─────────────────────────────────────── */}
      <BranchWires />
      {[...INET_LINES, ...WAN_LINES].map((pts, i) => (
        <Poly key={i} points={pts} />
      ))}
      <Poly points={INET_TO_UTM} />
      <Poly points={wanPath(L3_Y, L3.x)} />
      <Wire x1={mid(HQ_UTM)} y1={bottom(HQ_UTM)} x2={mid(L3)} y2={L3.y} />
      <Wire x1={mid(L3)} y1={bottom(L3)} x2={mid(L2)} y2={L2.y} />
      <Poly points={TO_FS} />
      <Wire x1={L3.x + L3.w} y1={L3.y + 15} x2={PS.x} y2={PS.y + 10} />
      <Wire x1={mid(PS)} y1={bottom(PS)} x2={mid(PR)} y2={PR.y} width={3} />
      <Wire x1={mid(L2)} y1={bottom(L2)} x2={mid(PC2)} y2={PC2.y} />
      <Wire x1={L2.x + 4} y1={bottom(L2)} x2={PC1.x + PC1.w - 4} y2={PC1.y} />

      {/* ── 強調：ファイル転送通信の道筋、支店のプリントサーバ ── */}
      {highlight && (
        <g>
          <Ring {...B_PS} />
          <Route points={FILE} />
        </g>
      )}

      {/* ── ノード ───────────────────────────────────── */}
      <BranchNodes term="PC" />
      <Ell {...INET} tone="outside" lines={['インターネット']} size={SIZE} />
      <Ell {...WAN} tone="outside" lines={['広域イーサ網']} size={SIZE} />
      <Box {...HQ_UTM} tone="device" lines={['UTM']} size={SIZE} />
      <Box {...L3} tone="device" lines={['L3SW']} size={SIZE} />
      <Box {...L2} tone="device" lines={['L2SW']} size={SIZE} />
      <Box {...PC1} tone="host" lines={['PC']} size={SIZE} />
      <Box {...PC2} tone="host" lines={['PC']} size={SIZE} />
      <Cap x={129} y={297} text="⋯" anchor="middle" size={SMALL} color={TEXT} />
      <Box {...FS} tone="host" lines={['ファイル', 'サーバ']} size={SIZE} />
      <Box {...PS} tone="host" lines={['プリント', 'サーバ']} size={SIZE} />
      <Box {...PR} tone="host" lines={['プリンタ']} size={SIZE} />

      {/* ── 略語の説明（原図どおり図の下） ─────────────────── */}
      <Cap x={6} y={328} text="L2SW：レイヤ2スイッチ" size={SMALL} color={MUTED} />
      <Cap x={96} y={328} text="L3SW：レイヤ3スイッチ" size={SMALL} color={MUTED} />
      <Cap x={186} y={328} text="UTM：Unified Threat Management" size={SMALL} color={MUTED} />
      <Cap x={6} y={342} text="広域イーサ網：広域イーサネットサービス網" size={SMALL} color={MUTED} />
    </FigSvg>
  )
}
