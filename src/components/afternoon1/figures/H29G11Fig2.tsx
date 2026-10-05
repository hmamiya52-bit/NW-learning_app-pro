import { Box, Callout, Cap, Ell, FigSvg, Poly, Ring, Wire } from './primitives'
import { FONT_SCALE, FRAME, LOGICAL, MUTED, SEGMENT, TONE } from './tokens'
import type { ExamFigureProps } from './tokens'
import { CUST_E, CUST_ROW_Y, INET, custFrame, custLines } from './h29g11Layout'
import type { Rect } from './h29g11Layout'

/**
 * 図2 検討後のネットワーク構成（抜粋）— H29 午後Ⅰ 問1
 *
 * 図1 と同じく、インターネットと顧客3社を上の段に置き、H 社を下に全幅で置いた（`h29g11Layout.ts`）。顧客 E 社の中は
 * 左へ 90 度回して、ルータ・FW を横に並べ、セグメントを FW の下に、PC（NIC と vNIC）をその右上に置いた。
 * H 社の中（ルータは図2 には無い。FW・DMZ・プロキシサーバ・SSL-VPN 装置と IP アドレスプール・内部 LAN の破線・
 * L3SW の中の VLAN200・VLAN201・内部ルータ（仮想インタフェース①〜⑥）・VLAN1〜3・VLAN101・サーバ機器・開発 LAN と PC）の並びは原図どおり。
 * SSL-VPN トンネル（太い破線、両端に●）は2本とも原図どおりの道筋で描く。顧客の PC の vNIC からはインターネットを通って FW へ、
 * 開発 LAN の PC の vNIC からは開発 LAN・VLAN101・内部ルータ（⑤の側から①の側へ）・VLAN200 を通って FW へ入り、
 * どちらも SSL-VPN 装置の●で終わる。トンネルが箱の中を通る所は、箱の文字に掛からない位置を計算で決めた。
 *
 * 色は役割だけで決めている。FW・L3SW・VLAN・内部ルータ・SSL-VPN 装置は device、サーバ機器・プロキシサーバ・PC は host、
 * インターネットと顧客のルータ・FW は outside。トンネルは物理の線ではないので LOGICAL の太い破線。
 *
 * 解説を開いたときは、2つの vNIC に輪を付け（設問2(3)）、VPN-PC の通信が⑥から内部ルータに入ることを吹き出しで添える
 * （設問4(3)）。②〜⑤の入口は図の解説の文で示す。
 */

const SIZE = 7.5
const SMALL = 7
const TEXT = '#334155'
/** トンネルの太さ（原図の太い破線） */
const TUNNEL_W = 2.4
const TUNNEL_DASH = '5 3'

/** H 社の枠と、中の機器 */
const HQ: Rect = { x: 2, y: 130, w: 336, h: 320 }
const FW: Rect = { x: 28, y: 150, w: 68, h: 80 }
const DMZ_Y = 172
const PROXY: Rect = { x: 148, y: 136, w: 38, h: 30 }
const VPN: Rect = { x: 202, y: 134, w: 134, h: 88 }
const POOL: Rect = { x: 224, y: 156, w: 109, h: 58 }
/** トンネルの行（FW の右から SSL-VPN 装置の●へ）と、FW の中を上下に通る位置 */
const T1_Y = 196
const T2_Y = 210
const T1_X = 90
const T2_X = 84
const DOT_X = 212
/** 内部 LAN の破線 */
const LAN_TOP = 218
const LAN_BOTTOM = 444
/** L3SW と中の機能 */
const L3: Rect = { x: 12, y: 236, w: 316, h: 116 }
const VLAN200: Rect = { x: 30, y: 244, w: 56, h: 18 }
const VLAN201: Rect = { x: 262, y: 244, w: 56, h: 18 }
const ROUTER: Rect = { x: 20, y: 272, w: 300, h: 44 }
const VLAN_Y = 326
/** 下の段の列（サーバ機器3つ）の中心の x */
const COL_XS = [48, 126, 204]
const VLANS: Rect[] = [
  { x: 28, y: VLAN_Y, w: 40, h: 18 },
  { x: 106, y: VLAN_Y, w: 40, h: 18 },
  { x: 184, y: VLAN_Y, w: 40, h: 18 },
  { x: 262, y: VLAN_Y, w: 64, h: 18 },
]
/** VLAN101 の文字と⑤の線の位置（右の端をトンネルが通るので左へ寄せる） */
const V101_X = 288
const SRV_W = 52
const SRV_H = 30
const SRV_Y = 366
const STEP = 4
const DEV: Rect = { x: 246, y: 360, w: 82, h: 32 }
const DEV_PC: Rect = { x: 248, y: 398, w: 80, h: 40 }

/** 顧客 E 社の中 */
const C_ROUTER: Rect = { x: 166, y: CUST_ROW_Y - 9, w: 32, h: 18 }
const C_FW: Rect = { x: 208, y: CUST_ROW_Y - 9, w: 24, h: 18 }
const C_BUS_Y = 98
const C_PC: Rect = { x: 240, y: 50, w: 84, h: 42 }

const mid = (r: Rect) => r.x + r.w / 2
const bottom = (r: Rect) => r.y + r.h

/** 名前を枠の内側の左上に置く囲み */
function Frame({ rect, label, fill = 'none', at = 'tl' }: { rect: Rect; label: string; fill?: string; at?: 'tl' | 'tr' }) {
  const { x, y, w, h } = rect
  const fs = SIZE * FONT_SCALE
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={fill} stroke={FRAME} strokeWidth={1.3} />
      <text x={at === 'tl' ? x + 4 : x + w - 4} y={y + 3.5 + fs} textAnchor={at === 'tl' ? 'start' : 'end'} fontSize={fs} fill={TEXT}>
        {label}
      </text>
    </g>
  )
}

/** セグメントの線（原図の太い線）と、機器がつながる所の黒い四角 */
function Bus({ x1, x2, y, taps }: { x1: number; x2: number; y: number; taps: number[] }) {
  return (
    <g>
      <Wire x1={x1} y1={y} x2={x2} y2={y} width={2} />
      {[x1, ...taps, x2].map((x) => (
        <rect key={x} x={x - 2.5} y={y - 2.5} width={5} height={5} fill={MUTED} />
      ))}
    </g>
  )
}

/** 角の丸い箱（VLAN・開発 LAN）。文字は太字で、textX を渡さなければ真ん中 */
function Pill({ rect, lines, tone, sub, textX }: { rect: Rect; lines: string[]; tone: 'device' | 'host'; sub?: string; textX?: number }) {
  const { x, y, w, h } = rect
  const t = TONE[tone]
  const fs = SIZE * FONT_SCALE
  const tx = textX ?? x + w / 2
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={Math.min(9, h / 2)} fill="#ffffff" stroke={t.stroke} strokeWidth={1.2} />
      {sub ? (
        <text x={tx} y={y + 13} textAnchor="middle" fontSize={fs} fontWeight={700} fill={t.text}>
          <tspan x={tx}>{lines[0]}</tspan>
          <tspan x={tx} dy={12} fontSize={SMALL * FONT_SCALE} fontWeight={400}>
            {sub}
          </tspan>
        </text>
      ) : (
        <text x={tx} y={y + h / 2 + fs * 0.44} textAnchor="middle" fontSize={fs} fontWeight={700} fill={t.text}>
          {lines[0]}
        </text>
      )}
    </g>
  )
}

/** PC の箱と、中の NIC・vNIC（vNIC にはトンネルの端の●）。ring のときは、PC の箱と vNIC の箱のあいだに強調の輪を敷く */
function PcWithNics({ rect, ring = false }: { rect: Rect; ring?: boolean }) {
  const { x, y, w, h } = rect
  const t = TONE.host
  const fs = SIZE * FONT_SCALE
  const nic: Rect = { x: x + 4, y: y + 4, w: 26, h: 18 }
  const vnic: Rect = { x: x + 34, y: y + 4, w: w - 38, h: 18 }
  return (
    <g>
      <g>
        <rect x={x} y={y} width={w} height={h} rx={2} fill={t.fill} stroke={t.stroke} strokeWidth={1.2} />
        <text x={x + w / 2} y={y + h - 5} textAnchor="middle" fontSize={fs} fontWeight={700} fill={t.text}>
          PC
        </text>
      </g>
      {ring && <Ring {...vnic} pad={2.5} />}
      <g>
        <rect x={nic.x} y={nic.y} width={nic.w} height={nic.h} fill="#ffffff" stroke={t.stroke} strokeWidth={1} />
        <text x={mid(nic)} y={nic.y + nic.h / 2 + fs * 0.44} textAnchor="middle" fontSize={fs} fontWeight={700} fill={t.text}>
          NIC
        </text>
      </g>
      <g>
        <rect x={vnic.x} y={vnic.y} width={vnic.w} height={vnic.h} fill="#ffffff" stroke={t.stroke} strokeWidth={1} />
        <text x={vnic.x + 4.5} y={vnic.y + vnic.h / 2 + fs * 0.44} fontSize={fs} fontWeight={700} fill={t.text}>
          vNIC
        </text>
      </g>
      <circle cx={vnic.x + vnic.w - 6} cy={vnic.y + vnic.h / 2} r={3.6} fill={LOGICAL} />
    </g>
  )
}

/** vNIC の箱（強調の輪を付けるため、PcWithNics と同じ位置を返す） */
const vnicOf = (pc: Rect): Rect => ({ x: pc.x + 34, y: pc.y + 4, w: pc.w - 38, h: 18 })
const dotOf = (pc: Rect): [number, number] => {
  const v = vnicOf(pc)
  return [v.x + v.w - 6, v.y + v.h / 2]
}

/** SSL-VPN トンネル（太い破線） */
function Tunnel({ points }: { points: [number, number][] }) {
  return <Poly points={points} color={LOGICAL} width={TUNNEL_W} dash={TUNNEL_DASH} />
}

export default function H29G11Fig2({ highlight = false }: ExamFigureProps) {
  const lines = custLines(C_ROUTER.x)
  const [cdx, cdy] = dotOf(C_PC)
  const [ddx, ddy] = dotOf(DEV_PC)
  /** 顧客の PC の vNIC → インターネット → FW → SSL-VPN 装置 */
  const t1: [number, number][] = [
    [cdx, cdy],
    [cdx, 4],
    [T1_X, 4],
    [T1_X, T1_Y],
    [DOT_X, T1_Y],
  ]
  /** 開発 LAN の PC の vNIC → 開発 LAN → VLAN101 → 内部ルータ（⑤の側から①の側へ）→ VLAN200 → FW → SSL-VPN 装置 */
  const t2: [number, number][] = [
    [ddx, ddy],
    [ddx, 298],
    [262, 298],
    [262, 286],
    [T2_X, 286],
    [T2_X, T2_Y],
    [DOT_X, T2_Y],
  ]
  return (
    <FigSvg w={340} h={476} title="図2 検討後のネットワーク構成（抜粋）">
      {/* ── 囲み ───────────────────────────────────── */}
      {[2, 1, 0].map((k) => (
        <Frame key={k} rect={custFrame(k)} label={`顧客${['E', 'F', 'G'][k]}社`} fill="#ffffff" />
      ))}
      <Frame rect={HQ} label="H社" />
      <Poly
        points={[
          [8, LAN_TOP],
          [332, LAN_TOP],
          [332, LAN_BOTTOM],
          [8, LAN_BOTTOM],
          [8, LAN_TOP],
        ]}
        color={SEGMENT}
        width={1.1}
        dash="5 3"
      />
      {/* L3SW（中に VLAN と内部ルータを置く入れ物。中の線が隠れないよう、線より先に描く） */}
      <g>
        <rect x={L3.x} y={L3.y} width={L3.w} height={L3.h} rx={2} fill={TONE.device.fill} stroke={TONE.device.stroke} strokeWidth={1.2} />
        <text x={L3.x + L3.w / 2} y={L3.y + 13} textAnchor="middle" fontSize={SIZE * FONT_SCALE} fontWeight={700} fill={TONE.device.text}>
          L3SW
        </text>
      </g>
      {/* サーバ機器の奥の1枚（線より先に描く） */}
      {COL_XS.map((c) => {
        const t = TONE.host
        return <rect key={c} x={c - SRV_W / 2 + STEP} y={SRV_Y - STEP} width={SRV_W} height={SRV_H} rx={2} fill={t.fill} stroke={t.stroke} strokeWidth={1.2} />
      })}

      {/* ── 線 ─────────────────────────────────────── */}
      {lines.map((pts, i) => (
        <Poly key={i} points={pts} />
      ))}
      <Wire x1={C_ROUTER.x + C_ROUTER.w} y1={CUST_ROW_Y} x2={C_FW.x} y2={CUST_ROW_Y} />
      <Wire x1={mid(C_FW)} y1={bottom(C_FW)} x2={mid(C_FW)} y2={C_BUS_Y} />
      <Wire x1={262} y1={C_BUS_Y} x2={262} y2={C_PC.y + 22} />
      <Wire x1={44} y1={INET.cy + INET.ry - 1} x2={44} y2={FW.y} />
      <Poly
        points={[
          [FW.x + FW.w, 178],
          [116, 178],
          [116, DMZ_Y],
        ]}
      />
      <Wire x1={mid(PROXY)} y1={bottom(PROXY)} x2={mid(PROXY)} y2={DMZ_Y} />
      <Poly
        points={[
          [192, DMZ_Y],
          [192, 152],
          [VPN.x, 152],
        ]}
      />
      <Wire x1={40} y1={bottom(FW)} x2={40} y2={VLAN200.y} />
      <Wire x1={290} y1={bottom(VPN)} x2={290} y2={VLAN201.y} />
      <Wire x1={48} y1={bottom(VLAN200)} x2={48} y2={ROUTER.y} />
      <Wire x1={290} y1={bottom(VLAN201)} x2={290} y2={ROUTER.y} />
      {VLANS.map((v, i) => {
        const cx = i < 3 ? mid(v) : V101_X
        return <Wire key={v.x} x1={cx} y1={bottom(ROUTER)} x2={cx} y2={v.y} />
      })}
      {COL_XS.map((c, i) => (
        <Wire key={c} x1={mid(VLANS[i])} y1={bottom(VLANS[i])} x2={mid(VLANS[i])} y2={SRV_Y} />
      ))}
      <Wire x1={V101_X} y1={bottom(VLANS[3])} x2={V101_X} y2={DEV.y} />
      <Wire x1={262} y1={bottom(DEV)} x2={265} y2={DEV_PC.y + 4} />

      {/* ── ノード ───────────────────────────────────── */}
      <Ell {...INET} tone="outside" lines={['インターネット']} size={SIZE} />
      <Box {...C_ROUTER} tone="outside" lines={['ルータ']} size={SIZE} />
      <Box {...C_FW} tone="outside" lines={['FW']} size={SIZE} />
      <Bus x1={190} x2={322} y={C_BUS_Y} taps={[mid(C_FW), 262]} />
      <PcWithNics rect={C_PC} ring={highlight} />
      <g>
        <rect x={FW.x} y={FW.y} width={FW.w} height={FW.h} rx={2} fill={TONE.device.fill} stroke={TONE.device.stroke} strokeWidth={1.2} />
        <text x={52} y={FW.y + FW.h / 2 + 4} textAnchor="middle" fontSize={SIZE * FONT_SCALE} fontWeight={700} fill={TONE.device.text}>
          FW
        </text>
      </g>
      <Bus x1={104} x2={200} y={DMZ_Y} taps={[116, mid(PROXY), 192]} />
      <Box {...PROXY} tone="host" lines={['プロキシ', 'サーバ']} size={SIZE} />
      <g>
        <rect x={VPN.x} y={VPN.y} width={VPN.w} height={VPN.h} rx={2} fill={TONE.device.fill} stroke={TONE.device.stroke} strokeWidth={1.2} />
        <text x={VPN.x + VPN.w - 4} y={VPN.y + 12.5} textAnchor="end" fontSize={SIZE * FONT_SCALE} fill={TONE.device.text}>
          SSL-VPN装置
        </text>
      </g>
      <g>
        <rect x={POOL.x} y={POOL.y} width={POOL.w} height={POOL.h} fill="#ffffff" stroke={SEGMENT} strokeWidth={1} strokeDasharray="4 2.5" />
        <text x={POOL.x + 4} y={POOL.y + 11.5} fontSize={SMALL * FONT_SCALE} fill={TEXT}>
          <tspan x={POOL.x + 4}>IPアドレスプール</tspan>
          {['E', 'F', 'G'].map((co, i) => (
            <tspan key={co} x={POOL.x + 4} dy={i === 0 ? 13 : 11.5}>{`${co}社用：10.100.${i + 1}.1〜200`}</tspan>
          ))}
        </text>
      </g>
      <Pill rect={VLAN200} lines={['VLAN200']} tone="device" />
      <Pill rect={VLAN201} lines={['VLAN201']} tone="device" />
      <g>
        <rect x={ROUTER.x} y={ROUTER.y} width={ROUTER.w} height={ROUTER.h} fill="#ffffff" stroke={TONE.device.stroke} strokeWidth={1.2} />
        <text x={170} y={ROUTER.y + 33} textAnchor="middle" fontSize={SIZE * FONT_SCALE} fill={TONE.device.text}>
          内部ルータ
        </text>
      </g>
      {VLANS.map((v, i) => (
        <Pill key={v.x} rect={v} lines={[i < 3 ? `VLAN${i + 1}` : 'VLAN101']} tone="device" textX={i < 3 ? undefined : V101_X} />
      ))}
      {COL_XS.map((c, i) => (
        <Box key={c} x={c - SRV_W / 2} y={SRV_Y} w={SRV_W} h={SRV_H} tone="host" lines={[`${['E', 'F', 'G'][i]}社システム`, 'サーバ機器']} size={SIZE} />
      ))}
      <Pill rect={DEV} lines={['開発LAN']} tone="host" sub="172.16.10.0/24" textX={281} />
      <PcWithNics rect={DEV_PC} ring={highlight} />

      {/* ── SSL-VPN トンネル（両端に●） ─────────────────── */}
      <Tunnel points={t1} />
      <Tunnel points={t2} />
      <circle cx={DOT_X} cy={T1_Y} r={3.6} fill={LOGICAL} />
      <circle cx={DOT_X} cy={T2_Y} r={3.6} fill={LOGICAL} />

      {/* ── 札（アドレス・番号・セグメントの名前） ─────────────── */}
      <Cap x={124} y={CUST_ROW_Y + 12} text="199.x.1.5" size={SMALL} color={TEXT} />
      <Cap x={mid(C_FW) - 4} y={C_BUS_Y - 5} text="192.168.0.1" anchor="end" size={SMALL} color={TEXT} />
      <Cap x={266} y={C_BUS_Y + 13} text="192.168.0.2" size={SMALL} color={TEXT} />
      <Cap x={CUST_E.x + 4} y={CUST_E.y + CUST_E.h - 6} text="社内：192.168.0.0/16" size={SMALL} color={TEXT} />
      <Cap x={145} y={PROXY.y + 10} text="202.y.44.1" anchor="end" size={SMALL} color={TEXT} />
      <Cap x={104} y={DMZ_Y - 5} text="DMZ" size={SMALL} color={TEXT} />
      <Cap x={120} y={DMZ_Y + 13} text="202.y.44.0/28" size={SMALL} color={TEXT} />
      <Cap x={VPN.x + 4} y={VPN.y + 12} text="202.y.44.2" size={SMALL} color={TEXT} />
      <Cap x={48} y={ROUTER.y + 12} text="①" anchor="middle" size={SIZE} color={TEXT} />
      <Cap x={290} y={ROUTER.y + 12} text="⑥" anchor="middle" size={SIZE} color={TEXT} />
      {VLANS.map((v, i) => (
        <Cap key={v.x} x={i < 3 ? mid(v) : V101_X} y={bottom(ROUTER) - 3} text={'②③④⑤'[i]} anchor="middle" size={SIZE} color={TEXT} />
      ))}
      {COL_XS.map((c, i) => (
        <Cap key={c} x={c + 2} y={SRV_Y + SRV_H + 12} text={`172.16.${100 + i}.0/24`} anchor="middle" size={SMALL} color={TEXT} />
      ))}
      <Cap x={12} y={LAN_BOTTOM - 6} text="内部LAN：172.16.0.0/16" size={SMALL} color={TEXT} />

      {/* ── 注記1（原図どおり、トンネルの見本ごと図の下） ───────── */}
      <Cap x={6} y={466} text="注記1" size={SMALL} color={MUTED} />
      <circle cx={36} cy={463.5} r={3.4} fill={LOGICAL} />
      <Wire x1={36} y1={463.5} x2={66} y2={463.5} color={LOGICAL} width={TUNNEL_W} dash={TUNNEL_DASH} />
      <circle cx={66} cy={463.5} r={3.4} fill={LOGICAL} />
      <Cap x={74} y={466} text="は，SSL-VPN トンネルを示す。" size={SMALL} color={MUTED} />

      {/* ── 強調の文字（vNIC の輪は PcWithNics の中で敷く） ─────────── */}
      {highlight && (
        <Callout
          x={196}
          y={240}
          w={56}
          lines={['VPN-PC は', '⑥から入る']}
          leader={[
            [252, 262],
            [282, 279],
          ]}
        />
      )}

    </FigSvg>
  )
}
