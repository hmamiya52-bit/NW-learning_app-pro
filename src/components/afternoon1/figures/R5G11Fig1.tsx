import { Callout, Ring, Route } from './primitives'
import R5G11Base from './R5G11Base'
import { DC_X_FIG1, dc } from './r5g11Layout'
import type { ExamFigureProps } from './tokens'

/**
 * 図1 G 社のシステム構成（抜粋）— R5 午後Ⅰ 問1
 *
 * 原図の並び（インターネットの下に ルータ・FW・L3SW の列とサーバセグメント、FW の右に DMZ）は 340 の幅にそのまま入る。
 * データセンターの中は図4 と同じ形にそろえ（r5g11Layout.ts の `dc`）、原図どおり真ん中に置いた。略語の説明は原図どおり図の下。
 *
 * 解説を開いたときは、AP サーバの動的コンテンツが DMZ の Web サーバを通って返る道筋をなぞり（Web サーバが中継する。設問1 a）、
 * Web サーバと DNS サーバに輪を付けて、DNS サーバが権威とキャッシュの2役を持つことを吹き出しで示す（設問1 b・c）。
 */

const D = dc(DC_X_FIG1)

/** Web サーバ → DMZ の L2SW → FW → L3SW → サーバセグメントの L2SW → AP サーバ（線の折れ点をなぞる） */
const RELAY: [number, number][] = [
  [D.web.x + 16, D.web.y + 15],
  [D.web.x + 16, D.web.y],
  [D.dmzSw.x + 10, D.dmzSw.y + D.dmzSw.h],
  [D.dmzSw.x + 10, D.dmzSw.y + 9],
  [D.fw.x + D.fw.w, D.fw.y + 9],
  [D.cx, D.fw.y + 9],
  [D.cx, D.segSw.y + 9],
  [D.cx - 8, D.segSw.y + D.segSw.h],
  [D.ap[0].x + 16, D.ap[0].y],
  [D.ap[0].x + 16, D.ap[0].y + 15],
]

export default function R5G11Fig1({ highlight = false }: ExamFigureProps) {
  return (
    <R5G11Base
      cloud={false}
      title="図1 G 社のシステム構成（抜粋）"
      h={268}
      underlay={
        highlight && (
          <g>
            <Ring {...D.web} />
            <Ring {...D.dns} />
            <Route points={RELAY} />
          </g>
        )
      }
      overlay={
        highlight && (
          <Callout
            x={262}
            y={106}
            w={70}
            lines={['権威とキャッシュ', 'の2役']}
            leader={[
              [262, D.dns.y + 15],
              [D.dns.x + D.dns.w, D.dns.y + 15],
            ]}
          />
        )
      }
    />
  )
}
