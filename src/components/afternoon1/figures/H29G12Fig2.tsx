import { Box, Cap, Ell, FigSvg, Poly, Ring, Route, Wire } from './primitives'
import { FRAME } from './tokens'
import type { ExamFigureProps } from './tokens'
import { HQ_UTM, HQ_W, HQ_X, HQ_Y, INET, INET_TO_UTM, SIZE, SMALL, TEXT, WAN, WAN_LINES, WAN_X, wanPath } from './h29g12Layout'
import type { Rect } from './h29g12Layout'
import { BranchFrames, BranchNodes, BranchWires, DiagDots, Frame } from './H29G12Parts'

/**
 * 図2 VDI 導入後のネットワーク構成案（抜粋）— H29 午後Ⅰ 問2
 *
 * 図1 と同じく、支店を上の段に置いて中の2列を右へ 90 度回し、インターネットを支店の右、広域イーサ網を支店の UTM の下に置いた
 * （`h29g12Layout.ts`）。PC は TC に替わり、支店からインターネットへの線は無い（原図どおり。下線②で廃止する回線）。
 * 本社は下に全幅で置き、中の並びは原図どおり: UTM・SSL 可視化装置・L3SW の縦の列、SSL 可視化装置の左に標的型攻撃対策装置、
 * L3SW の左に帯域制御装置（広域イーサ網からの線は左から入る）、右にファイルサーバ・プリントサーバ・プリンタ。
 * L3SW の下に L2SW が2台並び、左の L2SW には TC・⋮・TC、右の L2SW は L3SW と4本の線（リンクアグリゲーション。注記2）でつながり、
 * 下の VDI サーバ（2枚重ね。後ろの枠は右上へずらし、角に「⋱」）へ2本（手前の物理 NIC と、後ろの枠へ）。
 * VDI サーバの中は原図どおり、物理 NIC の箱が枠の上辺に乗り、その下に接して仮想 SW、仮想 SW から下が VDI の囲み
 * （物理 NIC の下の端に VDI の囲みの上辺が掛かる）、下に仮想 PC … 仮想 PC。原図より VDI の囲みを狭くし、「VDIサーバ」の名前と重ならないようにした。
 *
 * 色は役割だけで決めている。UTM・L2SW・L3SW・帯域制御装置・SSL 可視化装置・標的型攻撃対策装置・仮想 SW は device、
 * TC・サーバ・プリンタ・仮想 PC と、VDI サーバの部品の物理 NIC は host（H29-G1-1 の PC の中の NIC と同じ）、インターネットと広域イーサ網は outside。
 *
 * 解説を開いたときは、本社の仮想 PC から支店の TC までの画面転送通信の道筋をなぞり（設問2(1)）、帯域制御装置（設問3）・
 * 仮想 SW（設問4 ア）・本社の UTM（設問2(3)・設問4 イ・ウ）に輪を付ける。
 */

const HQ: Rect = { x: HQ_X, y: HQ_Y, w: HQ_W, h: 282 }
const APT: Rect = { x: 22, y: 195, w: 58, h: 30 }
const SSLV: Rect = { x: 122, y: 195, w: 56, h: 30 }
const FS: Rect = { x: 268, y: 195, w: 42, h: 30 }
const BWC: Rect = { x: 22, y: 235, w: 58, h: 30 }
const L3: Rect = { x: 130, y: 241, w: 40, h: 18 }
const PS: Rect = { x: 268, y: 235, w: 42, h: 30 }
const PR: Rect = { x: 268, y: 282, w: 42, h: 18 }
const TC1: Rect = { x: 22, y: 282, w: 24, h: 18 }
const TC2: Rect = { x: 22, y: 322, w: 24, h: 18 }
const L2A: Rect = { x: 62, y: 282, w: 36, h: 18 }
const L2B: Rect = { x: 141, y: 282, w: 36, h: 18 }
/** VDI サーバ（手前の枠）。後ろの枠は右上へ STEP ずらす */
const VS: Rect = { x: 126, y: 324, w: 166, h: 96 }
const STEP = 8
const NIC: Rect = { x: 136, y: 324, w: 46, h: 18 }
const VDI_F: Rect = { x: 130, y: 338, w: 114, h: 76 }
const VSW: Rect = { x: 136, y: 342, w: 46, h: 18 }
const VPC1: Rect = { x: 136, y: 388, w: 40, h: 18 }
const VPC2: Rect = { x: 198, y: 388, w: 40, h: 18 }
/** 3段目（帯域制御装置・L3SW・プリントサーバ）の中心の高さ */
const ROW3_Y = 250

const mid = (r: Rect) => r.x + r.w / 2
const bottom = (r: Rect) => r.y + r.h

/** L3SW と右の L2SW のあいだの4本（リンクアグリゲーション）。強調の道筋は2本目をなぞる */
const LAG: [number, number, number, number][] = [0, 1, 2, 3].map((i) => [152 + 3 * i, bottom(L3), 158 + 3 * i, L2B.y])

/** 仮想 SW から仮想 PC への2本 */
const TO_VPC1: [number, number][] = [
  [152, bottom(VSW)],
  [156, VPC1.y],
]
const TO_VPC2: [number, number][] = [
  [174, bottom(VSW)],
  [214, VPC2.y],
]

/** 支店の TC → L2SW → UTM → 広域イーサ網 → 帯域制御装置 → L3SW → L2SW → 物理 NIC → 仮想 SW → 仮想 PC（画面転送通信） */
const SCREEN: [number, number][] = [
  [94, 40],
  [94, 74],
  [140, 74],
  [140, WAN.cy],
  [WAN_X, WAN.cy],
  [WAN_X, ROW3_Y],
  [mid(L3), ROW3_Y],
  [LAG[1][0], LAG[1][1]],
  [LAG[1][2], LAG[1][3]],
  [mid(NIC), L2B.y + 9],
  [mid(NIC), NIC.y],
  [mid(NIC), VSW.y + 9],
  TO_VPC1[0],
  TO_VPC1[1],
  [156, VPC1.y + 6],
]

export default function H29G12Fig2({ highlight = false }: ExamFigureProps) {
  return (
    <FigSvg w={340} h={436} title="図2 VDI 導入後のネットワーク構成案（抜粋）">
      {/* ── 囲み ───────────────────────────────────── */}
      <BranchFrames />
      <Frame rect={HQ} label="本社（従業員100人）" at="tr" />
      {/* VDI サーバ（後ろの枠を白で塗って先に描き、手前の枠を重ねる）と、中の VDI の囲み */}
      <rect x={VS.x + STEP} y={VS.y - STEP} width={VS.w} height={VS.h} fill="#ffffff" stroke={FRAME} strokeWidth={1.3} />
      <Frame rect={VS} label="VDIサーバ" at="tr" fill="#ffffff" />
      <DiagDots x1={VS.x + VS.w} y1={VS.y} x2={VS.x + VS.w + STEP} y2={VS.y - STEP} />
      <Frame rect={VDI_F} label="VDI" at="tr" />

      {/* ── 線 ─────────────────────────────────────── */}
      <BranchWires />
      {WAN_LINES.map((pts, i) => (
        <Poly key={i} points={pts} />
      ))}
      <Poly points={INET_TO_UTM} />
      <Poly points={wanPath(ROW3_Y, BWC.x)} />
      <Wire x1={mid(HQ_UTM)} y1={bottom(HQ_UTM)} x2={mid(SSLV)} y2={SSLV.y} />
      <Wire x1={APT.x + APT.w} y1={APT.y + APT.h / 2} x2={SSLV.x} y2={SSLV.y + SSLV.h / 2} />
      <Wire x1={mid(SSLV)} y1={bottom(SSLV)} x2={mid(L3)} y2={L3.y} />
      <Wire x1={BWC.x + BWC.w} y1={ROW3_Y} x2={L3.x} y2={ROW3_Y} />
      <Wire x1={L3.x + L3.w} y1={L3.y + 2} x2={FS.x} y2={FS.y + 16} />
      <Wire x1={L3.x + L3.w} y1={ROW3_Y} x2={PS.x} y2={ROW3_Y} />
      <Wire x1={mid(PS)} y1={bottom(PS)} x2={mid(PR)} y2={PR.y} width={3} />
      <Wire x1={L3.x + 4} y1={bottom(L3)} x2={L2A.x + L2A.w - 4} y2={L2A.y} />
      {LAG.map(([x1, y1, x2, y2]) => (
        <Wire key={x1} x1={x1} y1={y1} x2={x2} y2={y2} />
      ))}
      <Wire x1={TC1.x + TC1.w} y1={TC1.y + 9} x2={L2A.x} y2={L2A.y + 9} />
      <Wire x1={TC2.x + TC2.w} y1={TC2.y + 4} x2={L2A.x} y2={bottom(L2A) - 2} />
      <Wire x1={mid(NIC)} y1={bottom(L2B)} x2={mid(NIC)} y2={NIC.y} />
      <Wire x1={L2B.x + L2B.w - 4} y1={bottom(L2B)} x2={L2B.x + L2B.w + 8} y2={VS.y - STEP} />
      <Poly points={TO_VPC1} />
      <Poly points={TO_VPC2} />

      {/* ── 強調：画面転送通信の道筋、帯域制御装置・仮想 SW・本社の UTM ── */}
      {highlight && (
        <g>
          <Ring {...BWC} />
          <Ring {...VSW} pad={2.5} />
          <Ring {...HQ_UTM} />
          <Route points={SCREEN} />
        </g>
      )}

      {/* ── ノード ───────────────────────────────────── */}
      <BranchNodes term="TC" />
      <Ell {...INET} tone="outside" lines={['インターネット']} size={SIZE} />
      <Ell {...WAN} tone="outside" lines={['広域イーサ網']} size={SIZE} />
      <Box {...HQ_UTM} tone="device" lines={['UTM']} size={SIZE} />
      <Box {...APT} tone="device" lines={['標的型攻撃', '対策装置']} size={SIZE} />
      <Box {...SSLV} tone="device" lines={['SSL', '可視化装置']} size={SIZE} />
      <Box {...FS} tone="host" lines={['ファイル', 'サーバ']} size={SIZE} />
      <Box {...BWC} tone="device" lines={['帯域', '制御装置']} size={SIZE} />
      <Box {...L3} tone="device" lines={['L3SW']} size={SIZE} />
      <Box {...PS} tone="host" lines={['プリント', 'サーバ']} size={SIZE} />
      <Box {...PR} tone="host" lines={['プリンタ']} size={SIZE} />
      <Box {...TC1} tone="host" lines={['TC']} size={SIZE} />
      <Cap x={mid(TC1)} y={314} text="⋮" anchor="middle" size={SMALL} color={TEXT} />
      <Box {...TC2} tone="host" lines={['TC']} size={SIZE} />
      <Box {...L2A} tone="device" lines={['L2SW']} size={SIZE} />
      <Box {...L2B} tone="device" lines={['L2SW']} size={SIZE} />
      <Box {...NIC} tone="host" lines={['物理NIC']} size={SIZE} />
      <Box {...VSW} tone="device" lines={['仮想SW']} size={SIZE} />
      <Box {...VPC1} tone="host" lines={['仮想PC']} size={SIZE} />
      <Cap x={187} y={400} text="⋯" anchor="middle" size={SMALL} color={TEXT} />
      <Box {...VPC2} tone="host" lines={['仮想PC']} size={SIZE} />
    </FigSvg>
  )
}
