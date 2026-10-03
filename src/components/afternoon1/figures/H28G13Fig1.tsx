import { Callout, Cap, FigSvg, Ring, Route } from './primitives'
import H28G13Topology from './H28G13Topology'
import { D } from './h28g13Layout'
import { MUTED } from './tokens'
import type { ExamFigureProps } from './tokens'

/**
 * 図1 現行 NW の構成（抜粋）— H28 午後Ⅰ 問3
 *
 * 下絵は H28G13Topology（図3 と共通）。原図の並びのまま 340 の幅に入るので組み直していない。
 * 略語の説明は原図では3列。375px に合わせて2列にし、LDAP の行だけ1行を使う。
 *
 * 解説を開いたときは、FW をはさんで向かい合う DNS1 と DNS3 に輪を付け（設問1(2)(3)）、
 * 社外からのメールが MGW2 から FW を通って MSV1 に届く道筋をなぞる（設問1(4)）。
 */

/** 社外からのメール: MGW2 → SW → FW → L3SW → MSV1（転送先は MSV1 に固定） */
const INBOUND: [number, number][] = [
  [300, 106],
  [290, 106],
  [270, 83],
  [254, 78],
  [214, 78],
  [197, 78],
  [197, 108],
  [178, 108],
  [112, 108],
  [100, 108],
]

export default function H28G13Fig1({ highlight = false }: ExamFigureProps) {
  return (
    <FigSvg w={340} h={224} title="図1 現行 NW の構成（抜粋）">
      <H28G13Topology
        underlay={
          highlight && (
            <g>
              <Ring {...D.dns1} />
              <Ring {...D.dns3} />
              <Ring {...D.msv1} />
              <Route points={INBOUND} />
            </g>
          )
        }
        overlay={
          highlight && (
            <g>
              <Callout
                x={4}
                y={2}
                w={90}
                lines={['DNS1 ⇔ DNS3 は', 'FW をまたぐ']}
                leader={[
                  [60, 32.6],
                  [60, 48],
                  [86, 48],
                ]}
              />
              <Callout
                x={242}
                y={128}
                w={90}
                lines={['MSV へ送るのは', '正常時 MGW2 だけ']}
                leader={[
                  [300, 128],
                  [300, 116],
                ]}
              />
            </g>
          )
        }
      />

      {/* ── 凡例（原図は3列。375px に合わせて2列）──────────── */}
      <Cap x={6} y={180} text="MSV：メールサーバ" size={7} color={MUTED} />
      <Cap x={172} y={180} text="MGW：中継メールサーバ" size={7} color={MUTED} />
      <Cap x={6} y={192} text="DNS：DNS サーバ" size={7} color={MUTED} />
      <Cap x={172} y={192} text="SW：スイッチングハブ" size={7} color={MUTED} />
      <Cap x={6} y={204} text="FW：ファイアウォール" size={7} color={MUTED} />
      <Cap x={172} y={204} text="L3SW：レイヤ3スイッチ" size={7} color={MUTED} />
      <Cap x={6} y={216} text="LDAP：LDAP（Lightweight Directory Access Protocol）サーバ" size={7} color={MUTED} />
    </FigSvg>
  )
}
