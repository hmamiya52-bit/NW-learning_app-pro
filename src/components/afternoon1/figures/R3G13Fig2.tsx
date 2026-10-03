import { Box, Callout, Cap, Ell, FigSvg, Ring, Route, SolidFrame, Wire } from './primitives'
import { Dots, HatchBox, HatchPattern, HqFrames, HqNodes, HqWires, OfficeFrame } from './R3G13Parts'
import { HQ_Y, INET, L2SW01, L2SW02, LAN_ROW1, MID_CY, SIZE, SMALL, TEXT } from './r3g13Layout'
import { FONT_SCALE, FRAME, MUTED, useFigureId } from './tokens'
import type { ExamFigureProps } from './tokens'

/**
 * 図2 電話サービス導入後のネットワーク構成 — R3 午後Ⅰ 問3
 *
 * 図1 と同じく、営業所を上に、広域イーサ網を真ん中の段に、本社を下に積んだ（原図は横一列）。
 * 営業所の中は上下を入れ替え（PC を上、L3SW1 を下）、L3SW1 から下の広域イーサ網へ線を出した。
 * 上の段の 公衆電話網 ― Z 社電話サービス（GW）― インターネット の並びは原図どおり。
 * 本社のルータ・FW・DMZ・サーバ室・L2SW01・L2SW02 は図1 と同じ位置（r3g13Layout.ts・R3G13Parts.tsx）。
 * L3SW0 は原図どおり横長の箱で、ポートの記号 a〜h は線の脇に置く。広域イーサ網からの h は上から入る。
 * 原図の網掛け（注記1: PoE 対応製品）は色ではなく斜線で残す。注記1・2 は examFigures の note に置く。
 *
 * 色は役割だけで決めている。L3SW・L2SW・ルータ・FW・IPsec ルータは device、ITEL・PC・サーバは host、
 * 公衆電話網・広域イーサ網・インターネット・Z 社電話サービスの GW（他社の装置）は outside。
 *
 * 解説を開いたときは、外線の音声の道筋（L3SW0 のポート a → IPsec ルータ → インターネット → GW）をなぞって
 * 吹き出しを付け（設問3(1)）、下線①の PoE 給電の L2SW 3台に輪を付ける（設問3(2)）。
 */

/** 公衆電話網・Z 社電話サービス（上の段） */
const PSTN = { cx: 33, cy: 20, rx: 31, ry: 11 }
const ZSVC = { x: 70, y: 4, w: 100, h: 32 }
const GW = { x: 140, y: 11, w: 26, h: 18 }
/** 広域イーサ網（真ん中の段） */
const WAN = { cx: 49, cy: MID_CY, rx: 40, ry: 11 }

/** 営業所1 の中（上下を入れ替えた並び） */
const OFFICE = {
  l2sw1: { x: 29, y: 108, w: 40, h: 18 },
  l3sw1: { x: 29, y: 146, w: 40, h: 18 },
  itel: [13, 57],
  pc: [16, 60],
}

/** 本社の IPsec ルータ・L3SW0・ITEL・PC */
const HQ = {
  ipsec: { x: 120, y: 266, w: 32, h: 30 },
  l3sw0: { x: 30, y: 346, w: 150, h: 36 },
  itel: [24, 68, 104, 148],
  pc: [27, 71, 107, 151],
  pcY: 464,
}

/** ポートの記号（a〜j） */
function Port({ x, y, text, anchor = 'start' }: { x: number; y: number; text: string; anchor?: 'start' | 'end' }) {
  return <Cap x={x} y={y} text={text} anchor={anchor} size={SIZE} color={TEXT} />
}

/** Z 社電話サービスの枠（左上に名前、右寄りに GW） */
function ZServiceFrame() {
  return (
    <g>
      <rect x={ZSVC.x} y={ZSVC.y} width={ZSVC.w} height={ZSVC.h} fill="none" stroke={FRAME} strokeWidth={1.3} />
      <text x={ZSVC.x + 4} y={ZSVC.y + 13} fontSize={SIZE * FONT_SCALE} fill={TEXT}>
        Z社電話サービス
      </text>
    </g>
  )
}

export default function R3G13Fig2({ highlight = false }: ExamFigureProps) {
  const hatch = useFigureId('r3g13-hatch')
  return (
    <FigSvg w={340} h={512} title="図2 電話サービス導入後のネットワーク構成">
      <HatchPattern id={hatch} />

      {/* ── 囲み ───────────────────────────────────── */}
      <ZServiceFrame />
      <OfficeFrame
        x={2}
        y={44}
        w={94}
        h={136}
        dx={8}
        dy={18}
        label1={{ x: 8, y: 175, anchor: 'start' }}
        label5={{ x: 72, y: 193 }}
      />
      <SolidFrame x={2} y={HQ_Y} w={336} h={240} label="本社" />
      <HqFrames />

      {/* ── 線 ─────────────────────────────────────── */}
      {/* 公衆電話網 ― Z 社電話サービス、GW ― インターネット */}
      <Wire x1={PSTN.cx + PSTN.rx} y1={20} x2={ZSVC.x} y2={20} />
      <Wire x1={GW.x + GW.w} y1={20} x2={INET.cx - INET.rx} y2={20} />
      {/* インターネット ― IPsec ルータ・ルータ */}
      <Wire x1={188} y1={28.4} x2={136} y2={266} />
      <Wire x1={201} y1={30.6} x2={201} y2={266} />
      {/* 営業所1: PC ― ITEL ― L2SW1 ― L3SW1 ― 広域イーサ網。後ろの営業所からも1本 */}
      <Wire x1={27} y1={70} x2={27} y2={80} />
      <Wire x1={71} y1={70} x2={71} y2={80} />
      <Wire x1={27} y1={98} x2={41} y2={108} />
      <Wire x1={71} y1={98} x2={57} y2={108} />
      <Wire x1={49} y1={126} x2={49} y2={146} />
      <Wire x1={49} y1={164} x2={49} y2={219} />
      <Wire x1={74} y1={198} x2={74} y2={221.4} />
      {/* 本社: h（広域イーサ網）・a（IPsec ルータ）・b（FW） */}
      <Wire x1={49} y1={241} x2={49} y2={346} />
      <Wire x1={136} y1={296} x2={136} y2={346} />
      <Wire x1={190} y1={326} x2={172} y2={346} />
      <HqWires />
      {/* c・d・e（サーバ室の3台）、g（L2SW02）・f（L2SW01） */}
      <Wire x1={180} y1={354} x2={238} y2={373} />
      <Wire x1={180} y1={364} x2={238} y2={407} />
      <Wire x1={180} y1={374} x2={238} y2={441} />
      <Wire x1={70} y1={382} x2={60} y2={398} />
      <Wire x1={130} y1={382} x2={140} y2={398} />
      {/* L2SW ― ITEL ― PC */}
      <Wire x1={50} y1={416} x2={38} y2={LAN_ROW1} />
      <Wire x1={70} y1={416} x2={82} y2={LAN_ROW1} />
      <Wire x1={130} y1={416} x2={118} y2={LAN_ROW1} />
      <Wire x1={150} y1={416} x2={162} y2={LAN_ROW1} />
      {[38, 82, 118, 162].map((x) => (
        <Wire key={x} x1={x} y1={LAN_ROW1 + 18} x2={x} y2={HQ.pcY} />
      ))}

      {/* ── 強調：外線の音声の道筋と、PoE で給電する L2SW の輪 ──── */}
      {highlight && (
        <g>
          <Ring {...OFFICE.l2sw1} />
          <Ring {...L2SW02} />
          <Ring {...L2SW01} />
          <Route
            points={[
              [136, 360],
              [136, 266],
              [188, 28.4],
              [180, 20],
              [153, 20],
            ]}
          />
        </g>
      )}

      {/* ── ノード ───────────────────────────────────── */}
      <Ell {...PSTN} tone="outside" lines={['公衆電話網']} size={SIZE} />
      <Box {...GW} tone="outside" lines={['GW']} size={SIZE} />
      <Ell {...INET} tone="outside" lines={['インターネット']} size={SIZE} />

      {OFFICE.pc.map((x) => (
        <Box key={x} x={x} y={52} w={22} h={18} tone="host" lines={['PC']} size={SIZE} />
      ))}
      <Dots x={49} y={65} />
      {OFFICE.itel.map((x) => (
        <HatchBox key={x} x={x} y={80} w={28} h={18} tone="host" label="ITEL" patternId={hatch} />
      ))}
      <Dots x={49} y={93} />
      <HatchBox {...OFFICE.l2sw1} tone="device" label="L2SW1" patternId={hatch} />
      <Box {...OFFICE.l3sw1} tone="device" lines={['L3SW1']} size={SIZE} />

      <Dots x={61.5} y={213} />
      <Ell {...WAN} tone="outside" lines={['広域イーサ網']} size={SIZE} />

      <Box {...HQ.ipsec} tone="device" lines={['IPsec', 'ルータ']} size={SIZE} />
      <Box {...HQ.l3sw0} tone="device" lines={['L3SW0']} size={SIZE} />
      <HqNodes />
      <HatchBox {...L2SW02} tone="device" label="L2SW02" patternId={hatch} />
      <HatchBox {...L2SW01} tone="device" label="L2SW01" patternId={hatch} />
      {HQ.itel.map((x) => (
        <HatchBox key={x} x={x} y={LAN_ROW1} w={28} h={18} tone="host" label="ITEL" patternId={hatch} />
      ))}
      <Dots x={60} y={LAN_ROW1 + 13} />
      <Dots x={140} y={LAN_ROW1 + 13} />
      {HQ.pc.map((x) => (
        <Box key={x} x={x} y={HQ.pcY} w={22} h={18} tone="host" lines={['PC']} size={SIZE} />
      ))}
      <Dots x={60} y={HQ.pcY + 13} />
      <Dots x={140} y={HQ.pcY + 13} />

      {/* ── ポートの記号（L3SW0 の a〜h、L3SW1 の i・j） ─────── */}
      <Port x={45} y={342} text="h" anchor="end" />
      <Port x={132} y={342} text="a" anchor="end" />
      <Port x={171} y={342} text="b" anchor="end" />
      <Port x={194} y={356} text="c" />
      <Port x={194} y={372} text="d" />
      <Port x={194} y={388} text="e" />
      <Port x={63} y={391} text="g" anchor="end" />
      <Port x={137} y={391} text="f" />
      <Port x={53} y={140} text="j" />
      <Port x={53} y={175} text="i" />

      {/* ── 略語の説明（原図どおり図の下） ─────────────── */}
      <Cap x={4} y={504} text="ITEL：IP電話機" size={SMALL} color={MUTED} />
      <Cap x={100} y={504} text="GW：ゲートウェイ装置" size={SMALL} color={MUTED} />

      {/* ── 強調の文字（本社の左の空いた所から、ポート a の線を指す） ── */}
      {highlight && (
        <Callout
          x={60}
          y={300}
          w={55}
          lines={['外線の出口']}
          leader={[
            [115, 309.4],
            [136, 309.4],
          ]}
        />
      )}
    </FigSvg>
  )
}
