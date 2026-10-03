import { Callout, Cap, FigSvg, Ring, Route } from './primitives'
import H28G13Topology from './H28G13Topology'
import { D } from './h28g13Layout'
import { MUTED } from './tokens'
import type { ExamFigureProps } from './tokens'

/**
 * 図3 移行中 NW の構成（抜粋）— H28 午後Ⅰ 問3
 *
 * 下絵は H28G13Topology（図1 と共通）。図1 の MSV を旧 MSV と呼び替え、
 * 新 MSV 2台（L3SW へ線）と共用ストレージ（新 MSV 2台へ線）を下に足す。
 * 旧 MSV と新 MSV の説明は、原図どおり PC の下に置く。
 *
 * 解説を開いたときは、FW と LDAP に輪を付け（設問3(1)・3(4)）、
 * 移行中に社外から未変更社員へ届くメールの道筋（MGW → 新 MSV → 旧 MSV）をなぞる（設問3(2)(3)）。
 */

/** 社外からのメール: MGW2 → SW → FW → L3SW → 新 MSV1（転送先 VIP1） */
const TO_NEW: [number, number][] = [
  [300, 106],
  [290, 106],
  [270, 83],
  [254, 78],
  [214, 78],
  [197, 78],
  [197, 108],
  [178, 108],
  [112, 178],
  [100, 178],
]
/** 新 MSV1 が LDAP を引いて、未変更社員の MBOX がある旧 MSV1 へ回す */
const TO_OLD: [number, number][] = [
  [100, 178],
  [112, 178],
  [178, 108],
  [112, 108],
  [100, 108],
]

export default function H28G13Fig3({ highlight = false }: ExamFigureProps) {
  return (
    <FigSvg w={340} h={220} title="図3 移行中 NW の構成（抜粋）">
      <H28G13Topology
        migration
        underlay={
          highlight && (
            <g>
              <Ring {...D.fw} />
              <Ring {...D.ldap} />
              <Route points={TO_NEW} />
              <Route points={TO_OLD} />
            </g>
          )
        }
        overlay={
          highlight && (
            <g>
              <Callout x={4} y={2} w={100} lines={['FW で新MSV⇔MGW', 'の SMTP を許す']} />
              <Callout x={242} y={128} w={87} lines={['未変更社員宛ては', '新MSV → 旧MSV']} />
            </g>
          )
        }
      />

      {/* ── 凡例（原図どおり PC の下）────────────────────── */}
      <Cap x={158} y={182} text="旧MSV：図1のMSVのこと" size={7} color={MUTED} />
      <Cap x={158} y={195} text="新MSV：新設メールサーバ" size={7} color={MUTED} />
    </FigSvg>
  )
}
