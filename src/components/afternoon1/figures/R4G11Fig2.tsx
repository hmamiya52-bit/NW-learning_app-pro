import { Callout, FigSvg, Ring, Route } from './primitives'
import R4G11Base from './R4G11Base'
import { CAP, FTA, VIS } from './r4g11Layout'
import type { ExamFigureProps } from './tokens'

/**
 * 図2 ベンダが提案した A 社ネットワークの構成（抜粋）— R4 午後Ⅰ 問1
 *
 * 下絵は R4G11Base（図1 と共通）に、網掛けの FTA・NPB・可視化サーバ・キャプチャサーバを足したもの。
 * 注記（網掛け部分は追加される箇所）は examFigures の note に置く。
 *
 * 解説を開いたときは、
 *   - FTA の2本の足（管理セグメントの L2SW と OA の L2SW）をなぞって FTA に輪を付ける（設問2(2)）
 *   - 2台のコントローラから L2SW を通って制御サーバへ向かう測定データの道筋をなぞり、
 *     制御サーバのポートを吹き出しで指す（設問3(3)）
 *   - ミラーパケットを受ける可視化サーバとキャプチャサーバに輪を付ける（設問3(4)）
 */

/** 管理セグメントの L2SW → FTA → OA の L2SW */
const FTA_LEGS: [number, number][] = [
  [247, 352],
  [233, 343],
  [208, 332],
  [201, 323],
  [201, 314],
  [176, 154],
  [164, 145],
]
/** コントローラ → 制御セグメントの L2SW → 制御サーバ */
const FROM_CTRL1: [number, number][] = [
  [44, 315],
  [70, 315],
  [96, 343],
  [108, 352],
  [126, 352],
  [150, 352],
  [167, 352],
]
const FROM_CTRL2: [number, number][] = [
  [44, 389],
  [70, 389],
  [96, 361],
  [108, 352],
]

export default function R4G11Fig2({ highlight = false }: ExamFigureProps) {
  return (
    <FigSvg w={340} h={470} title="図2 ベンダが提案した A 社ネットワークの構成（抜粋）">
      <R4G11Base
        proposed
        underlay={
          highlight && (
            <g>
              <Ring {...FTA} />
              <Ring {...VIS} />
              <Ring {...CAP} />
              <Route points={FTA_LEGS} />
              <Route points={FROM_CTRL1} />
              <Route points={FROM_CTRL2} />
            </g>
          )
        }
        overlay={
          highlight && (
            <Callout
              x={186}
              y={372}
              w={80}
              lines={['このポートを写す']}
              leader={[
                [186, 381],
                [138, 381],
                [138, 352],
              ]}
            />
          )
        }
      />
    </FigSvg>
  )
}
