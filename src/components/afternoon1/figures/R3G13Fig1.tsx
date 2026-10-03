import { Box, Callout, Cap, Ell, FigSvg, Ring, RingEll, Route, SolidFrame, Wire } from './primitives'
import { Dots, HqFrames, HqNodes, HqWires, OfficeFrame } from './R3G13Parts'
import { HQ_Y, INET, L2SW01, L2SW02, MID_CY, SIZE, SMALL } from './r3g13Layout'
import { MUTED } from './tokens'
import type { ExamFigureProps } from './tokens'

/**
 * 図1 Y 社のネットワーク構成 — R3 午後Ⅰ 問3
 *
 * 原図は 営業所 → 広域イーサ網 → 本社 の横一列（およそ 2.6:1）で、公衆電話網とインターネットが上にある。
 * 340 の幅には入らないので、営業所を上に、公衆電話網と広域イーサ網を真ん中の段に、本社を下に積んだ。
 * 公衆電話網は2つの PBX を、広域イーサ網は L3SW1 と L3SW0 を結ぶので、どちらも営業所と本社のあいだに置ける。
 * そのために営業所の中は上下を入れ替え（電話機と PC を上、PBX・IP-GW・L3SW1 を下）、PBX と L3SW1 から下へ線を出した。
 * 本社の中の並び（左上に PBX、真ん中にルータと FW、右に DMZ とサーバ室、下に L2SW と PC）は原図どおり。
 * 本社のルータ・FW・DMZ・サーバ室・L2SW01・L2SW02 は図2 と同じ位置（r3g13Layout.ts・R3G13Parts.tsx）。
 * 略語の説明は SVG の下に、注記1・2（回線数）は examFigures の note に置く。
 *
 * 色は役割だけで決めている。PBX・IP-GW・L3SW・L2SW・ルータ・FW は device、TEL・PC・サーバは host、
 * 公衆電話網・広域イーサ網・インターネットは outside。
 *
 * 解説を開いたときは、拠点間の内線が IP パケットになって通る道筋（営業所の IP-GW → 広域イーサ網 → 本社の IP-GW）を
 * なぞり、2台の IP-GW に輪を付ける（設問2）。公衆電話網には輪と、外線の回線数の吹き出しを付ける（設問3(1)）。
 */

/** 公衆電話網・広域イーサ網（真ん中の段） */
const PSTN = { cx: 47, cy: MID_CY, rx: 32, ry: 11 }
const WAN = { cx: 152, cy: MID_CY, rx: 40, ry: 11 }

/** 営業所1 の中（上下を入れ替えた並び） */
const OFFICE = {
  pbx: { x: 34, y: 128, w: 26, h: 18 },
  ipgw: { x: 83, y: 128, w: 38, h: 18 },
  l3sw1: { x: 132, y: 128, w: 40, h: 18 },
  l2sw1: { x: 132, y: 94, w: 40, h: 18 },
  tel: [15, 55],
  pc: [124, 160],
  leafY: 60,
}

/** 本社の PBX・IP-GW・TEL・L3SW0 */
const HQ = {
  pbx: { x: 34, y: 266, w: 26, h: 18 },
  ipgw: { x: 28, y: 308, w: 38, h: 18 },
  tel: [76, 116],
  l3sw0: { x: 132, y: 354, w: 40, h: 18 },
  pc: [32, 68, 112, 148],
  pcY: 432,
}

export default function R3G13Fig1({ highlight = false }: ExamFigureProps) {
  return (
    <FigSvg w={340} h={530} title="図1 Y 社のネットワーク構成">
      {/* ── 囲み ───────────────────────────────────── */}
      <OfficeFrame
        x={2}
        y={44}
        w={182}
        h={126}
        dx={8}
        dy={18}
        label1={{ x: 100, y: 164, anchor: 'middle' }}
        label5={{ x: 100, y: 183 }}
      />
      <SolidFrame x={2} y={HQ_Y} w={336} h={222} label="本社" />
      <HqFrames />

      {/* ── 線 ─────────────────────────────────────── */}
      {/* 営業所1: PBX ― TEL、PBX ― IP-GW ― L3SW1 ― L2SW1 ― PC */}
      <Wire x1={40} y1={128} x2={27} y2={78} />
      <Wire x1={54} y1={128} x2={67} y2={78} />
      <Wire x1={60} y1={137} x2={83} y2={137} />
      <Wire x1={121} y1={137} x2={132} y2={137} />
      <Wire x1={152} y1={128} x2={152} y2={112} />
      <Wire x1={142} y1={94} x2={134} y2={78} />
      <Wire x1={162} y1={94} x2={170} y2={78} />
      {/* 営業所1 の PBX ― 公衆電話網、L3SW1 ― 広域イーサ網。後ろの営業所からも1本ずつ */}
      <Wire x1={47} y1={146} x2={47} y2={219} />
      <Wire x1={152} y1={146} x2={152} y2={219} />
      <Wire x1={70} y1={188} x2={70} y2={222.4} />
      <Wire x1={175} y1={188} x2={175} y2={221} />
      {/* 公衆電話網 ― 本社の PBX、広域イーサ網 ― L3SW0、インターネット ― ルータ */}
      <Wire x1={47} y1={241} x2={47} y2={266} />
      <Wire x1={152} y1={241} x2={152} y2={354} />
      <Wire x1={201} y1={30.6} x2={201} y2={266} />
      {/* 本社: PBX ― IP-GW・TEL、IP-GW ― L3SW0、FW ― L3SW0 */}
      <Wire x1={47} y1={284} x2={47} y2={308} />
      <Wire x1={58} y1={284} x2={86} y2={308} />
      <Wire x1={60} y1={278} x2={126} y2={308} />
      <Wire x1={62} y1={326} x2={136} y2={354} />
      <Wire x1={190} y1={326} x2={168} y2={354} />
      <HqWires />
      {/* L3SW0 ― サーバ室の3台、L2SW02・L2SW01 */}
      <Wire x1={172} y1={360} x2={238} y2={373} />
      <Wire x1={172} y1={363} x2={238} y2={407} />
      <Wire x1={172} y1={366} x2={238} y2={441} />
      <Wire x1={140} y1={372} x2={66} y2={398} />
      <Wire x1={148} y1={372} x2={140} y2={398} />
      {/* L2SW ― PC */}
      <Wire x1={52} y1={416} x2={42} y2={432} />
      <Wire x1={68} y1={416} x2={78} y2={432} />
      <Wire x1={132} y1={416} x2={122} y2={432} />
      <Wire x1={148} y1={416} x2={158} y2={432} />

      {/* ── 強調：拠点間の内線の道筋、IP-GW 2台と公衆電話網の輪 ──── */}
      {highlight && (
        <g>
          <RingEll {...PSTN} />
          <Ring {...OFFICE.ipgw} />
          <Ring {...HQ.ipgw} />
          <Route
            points={[
              [102, 137],
              [152, 137],
              [152, 230],
              [152, 363],
              [136, 354],
              [62, 326],
              [47, 317],
            ]}
          />
        </g>
      )}

      {/* ── ノード ───────────────────────────────────── */}
      <Ell {...INET} tone="outside" lines={['インターネット']} size={SIZE} />

      {OFFICE.tel.map((x) => (
        <Box key={x} x={x} y={OFFICE.leafY} w={24} h={18} tone="host" lines={['TEL']} size={SIZE} />
      ))}
      <Dots x={47} y={OFFICE.leafY + 13} />
      {OFFICE.pc.map((x) => (
        <Box key={x} x={x} y={OFFICE.leafY} w={20} h={18} tone="host" lines={['PC']} size={SIZE} />
      ))}
      <Dots x={152} y={OFFICE.leafY + 13} />
      <Box {...OFFICE.l2sw1} tone="device" lines={['L2SW1']} size={SIZE} />
      <Box {...OFFICE.pbx} tone="device" lines={['PBX']} size={SIZE} />
      <Box {...OFFICE.ipgw} tone="device" lines={['IP-GW']} size={SIZE} />
      <Box {...OFFICE.l3sw1} tone="device" lines={['L3SW1']} size={SIZE} />

      <Dots x={58.5} y={211} />
      <Dots x={163.5} y={211} />
      <Ell {...PSTN} tone="outside" lines={['公衆電話網']} size={SIZE} />
      <Ell {...WAN} tone="outside" lines={['広域イーサ網']} size={SIZE} />

      <Box {...HQ.pbx} tone="device" lines={['PBX']} size={SIZE} />
      <Box {...HQ.ipgw} tone="device" lines={['IP-GW']} size={SIZE} />
      {HQ.tel.map((x) => (
        <Box key={x} x={x} y={308} w={24} h={18} tone="host" lines={['TEL']} size={SIZE} />
      ))}
      <Dots x={108} y={321} />
      <Box {...HQ.l3sw0} tone="device" lines={['L3SW0']} size={SIZE} />
      <HqNodes />
      <Box {...L2SW02} tone="device" lines={['L2SW02']} size={SIZE} />
      <Box {...L2SW01} tone="device" lines={['L2SW01']} size={SIZE} />
      {HQ.pc.map((x) => (
        <Box key={x} x={x} y={HQ.pcY} w={20} h={18} tone="host" lines={['PC']} size={SIZE} />
      ))}
      <Dots x={60} y={HQ.pcY + 13} />
      <Dots x={140} y={HQ.pcY + 13} />

      {/* ── 略語の説明（原図どおり図の下） ─────────────── */}
      <Cap x={4} y={486} text="L2SW：レイヤ2スイッチ" size={SMALL} color={MUTED} />
      <Cap x={4} y={498} text="L3SW：レイヤ3スイッチ" size={SMALL} color={MUTED} />
      <Cap x={4} y={510} text="FW：ファイアウォール" size={SMALL} color={MUTED} />
      <Cap x={4} y={522} text="TEL：電話機" size={SMALL} color={MUTED} />
      <Cap x={100} y={486} text="IP-GW：音声信号とIPパケットの変換装置" size={SMALL} color={MUTED} />
      <Cap x={100} y={498} text="eLNサーバ：eラーニングシステムのサーバ" size={SMALL} color={MUTED} />
      <Cap x={100} y={510} text="広域イーサ網：広域イーサネットサービス網" size={SMALL} color={MUTED} />

      {/* ── 強調の文字（本社の左上の空いた所。外線の回線数は注記1） ── */}
      {highlight && (
        <Callout
          x={68}
          y={254}
          w={79}
          lines={['外線 80＋10×5']}
          leader={[
            [82, 254],
            [74, 235.9],
          ]}
        />
      )}
    </FigSvg>
  )
}
