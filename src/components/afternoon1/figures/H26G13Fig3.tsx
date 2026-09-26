import type { ReactNode } from 'react'
import { Callout, Cap, FigSvg, Ring } from './primitives'
import { FRAME } from './tokens'
import type { ExamFigureProps } from './tokens'

/**
 * 図3 IB システムのサイバー攻撃に関わる重大なインシデント発生時の対応手順 — H26 午後Ⅰ 問3
 *
 * 原図どおり、発見者又は受付担当者の対応（4段）とセキュリティ担当者の対応（6段）を
 * 2つの枠に分けて横に並べる。見比べることで、担当者にだけある段（空欄 b を含む）が分かる。
 * ネットワーク構成図ではないので、役割の3色は当てずに白の枠で描く。
 *
 * 解説を開いたときは、空欄 b（設問4(1)）と、手順の最後の (6) 対処結果の報告（設問4(2)。
 * その後の段が図に無い）に輪を付け、それぞれに吹き出しを添える。
 */

const TEXT = '#334155'
/** 文字の大きさ（Cap の size） */
const SIZE = 7.5
/** 見出しと各段のベースライン */
const HEAD_Y = 21
const ROW0 = 41
const PITCH = 19

const REPORTER = ['(1) 状況把握と記録', '(2) 対処方法の確認', '(3) セキュリティ担当者への連絡', '(4) 対処結果の報告']
/** null は空欄 b の段 */
const SECURITY: (string | null)[] = [
  '(1) 状況把握と記録',
  '(2) 対処方法の確認',
  null,
  '(4) 原因の特定と対処',
  '(5) システムの復旧',
  '(6) 対処結果の報告',
]

/** 空欄 b（原図どおり枠で囲む） */
const BLANK = { x: 206, y: ROW0 + 2 * PITCH - 13, w: 62, h: 19 }
/** (6) 対処結果の報告 の段（輪を付ける範囲） */
const LAST_ROW = { x: 182, y: ROW0 + 5 * PITCH - 10, w: 88, h: 15 }

function Frame({ x, h, heading, children }: { x: number; h: number; heading: string; children: ReactNode }) {
  return (
    <g>
      <rect x={x} y={4} width={160} height={h} fill="#ffffff" stroke={FRAME} strokeWidth={1.2} />
      <Cap x={x + 8} y={HEAD_Y} text={heading} size={SIZE} color={TEXT} />
      {children}
    </g>
  )
}

export default function H26G13Fig3({ highlight = false }: ExamFigureProps) {
  return (
    <FigSvg w={340} h={150} title="図3 IB システムのサイバー攻撃に関わる重大なインシデント発生時の対応手順">
      <Frame x={4} h={104} heading="＜発見者又は受付担当者の対応＞">
        {REPORTER.map((t, i) => (
          <Cap key={t} x={12} y={ROW0 + i * PITCH} text={t} size={SIZE} color={TEXT} />
        ))}
      </Frame>

      <Frame x={176} h={142} heading="＜セキュリティ担当者の対応＞">
        {/* ── 強調：輪（文字より先に敷く）── */}
        {highlight && (
          <g>
            <Ring x={BLANK.x} y={BLANK.y} w={BLANK.w} h={BLANK.h} pad={2} />
            <Ring x={LAST_ROW.x} y={LAST_ROW.y} w={LAST_ROW.w} h={LAST_ROW.h} pad={2} />
          </g>
        )}
        {SECURITY.map((t, i) =>
          t ? (
            <Cap key={t} x={184} y={ROW0 + i * PITCH} text={t} size={SIZE} color={TEXT} />
          ) : (
            <g key="b">
              <Cap x={184} y={ROW0 + i * PITCH} text="(3)" size={SIZE} color={TEXT} />
              <g>
                <rect x={BLANK.x} y={BLANK.y} width={BLANK.w} height={BLANK.h} fill="#ffffff" stroke={TEXT} strokeWidth={1.4} />
                <Cap x={BLANK.x + BLANK.w / 2} y={ROW0 + i * PITCH} text="b" anchor="middle" size={SIZE} color={TEXT} />
              </g>
            </g>
          ),
        )}
      </Frame>

      {/* ── 強調の文字 ─────────────────────────────────── */}
      {highlight && (
        <g>
          <Callout
            x={276}
            y={BLANK.y - 0.2}
            w={56}
            lines={['NW を切る']}
            leader={[
              [276, BLANK.y + BLANK.h / 2],
              [BLANK.x + BLANK.w + 2, BLANK.y + BLANK.h / 2],
            ]}
          />
          <Callout
            x={78}
            y={112}
            w={86}
            lines={['(6) の後の評価と', '見直しが図に無い']}
            leader={[
              [164, LAST_ROW.y + LAST_ROW.h / 2],
              [LAST_ROW.x - 2, LAST_ROW.y + LAST_ROW.h / 2],
            ]}
          />
        </g>
      )}
    </FigSvg>
  )
}
