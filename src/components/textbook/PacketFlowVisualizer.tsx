import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Globe2,
  Monitor,
  Network,
  Pause,
  Play,
  RotateCcw,
  Router,
  Server,
  Shield,
} from 'lucide-react'
import type {
  PacketFlowNode,
  PacketFlowNodeRole,
  PacketFlowScenario,
  PacketFlowStep,
} from '../../data/textbookChapters'
import TextbookRichText from './TextbookRichText'

interface PacketFlowVisualizerProps {
  scenario: PacketFlowScenario
  title?: string
  description?: string
  points?: string[]
}

const AUTO_STEP_MS = 3600

const HEADER_LABELS: Record<keyof PacketFlowStep['headerFocus'], string> = {
  sourceMac: '送信元MAC',
  destinationMac: '宛先MAC',
  sourceIp: '送信元IP',
  destinationIp: '宛先IP',
  protocol: '種別',
  port: 'ポート',
}

function RoleIcon({ role }: { role: PacketFlowNodeRole }) {
  if (role === 'pc') return <Monitor className="h-5 w-5" aria-hidden="true" />
  if (role === 'switch') return <Network className="h-5 w-5" aria-hidden="true" />
  if (role === 'router') return <Router className="h-5 w-5" aria-hidden="true" />
  if (role === 'server' || role === 'dns') return <Server className="h-5 w-5" aria-hidden="true" />
  if (role === 'firewall') return <Shield className="h-5 w-5" aria-hidden="true" />
  return <Globe2 className="h-5 w-5" aria-hidden="true" />
}

function nodeById(nodes: PacketFlowNode[], id: string): PacketFlowNode {
  const node = nodes.find((item) => item.id === id)
  if (!node) {
    throw new Error(`Packet flow node not found: ${id}`)
  }
  return node
}

function isActivePath(step: PacketFlowStep, from: PacketFlowNode, to: PacketFlowNode): boolean {
  return (
    (step.from === from.id && step.to === to.id) ||
    (step.from === to.id && step.to === from.id)
  )
}

function MobilePacketFlowPath({
  nodes,
  pathPairs,
  currentStep,
}: {
  nodes: PacketFlowNode[]
  pathPairs: readonly (readonly [PacketFlowNode, PacketFlowNode])[]
  currentStep: PacketFlowStep
}) {
  const positionedNodes = nodes.map((node, index) => ({
    ...node,
    mobileX: nodes.length <= 1 ? 50 : 14 + (72 / (nodes.length - 1)) * index,
    mobileY: 57,
  }))
  const positionById = new Map(positionedNodes.map((node) => [node.id, node]))
  const activePair = pathPairs.find(([from, to]) => isActivePath(currentStep, from, to))
  const activeFrom = activePair ? positionById.get(activePair[0].id) : undefined
  const activeTo = activePair ? positionById.get(activePair[1].id) : undefined
  const packetLeft = activeFrom && activeTo ? (activeFrom.mobileX + activeTo.mobileX) / 2 : 50

  return (
    <div
      className="relative -mx-3 h-[190px] overflow-hidden rounded-lg border border-slate-200 bg-gradient-to-b from-slate-50 to-white sm:mx-0 sm:hidden"
      data-testid="mobile-packet-flow"
    >
      <svg className="absolute inset-0 h-full w-full" aria-hidden="true">
        {pathPairs.map(([from, to]) => {
          const fromNode = positionById.get(from.id)
          const toNode = positionById.get(to.id)
          if (!fromNode || !toNode) return null
          const active = isActivePath(currentStep, from, to)
          return (
            <g key={`${from.id}-${to.id}`}>
              <line
                x1={`${fromNode.mobileX}%`}
                y1={`${fromNode.mobileY}%`}
                x2={`${toNode.mobileX}%`}
                y2={`${toNode.mobileY}%`}
                stroke="#ffffff"
                strokeWidth={active ? 8 : 6}
                strokeLinecap="round"
              />
              <line
                x1={`${fromNode.mobileX}%`}
                y1={`${fromNode.mobileY}%`}
                x2={`${toNode.mobileX}%`}
                y2={`${toNode.mobileY}%`}
                stroke={active ? '#2563eb' : '#cbd5e1'}
                strokeWidth={active ? 4 : 2.5}
                strokeLinecap="round"
                strokeDasharray={active ? undefined : '6 6'}
              />
            </g>
          )
        })}
      </svg>

      <div
        className="absolute top-[20%] z-20 -translate-x-1/2 rounded-md border border-blue-200 bg-white px-2.5 py-1 text-[10px] font-black text-blue-700 shadow-lg shadow-blue-100"
        style={{ left: `${packetLeft}%` }}
      >
        {currentStep.packetLabel}
      </div>

      {positionedNodes.map((node) => {
        const activeNode = node.id === currentStep.from || node.id === currentStep.to
        return (
          <div
            key={node.id}
            className={[
              'absolute z-10 w-[60px] -translate-x-1/2 -translate-y-1/2 rounded-lg border bg-white px-1 py-2 text-center shadow-sm',
              activeNode ? 'border-blue-300 ring-2 ring-blue-100' : 'border-slate-200',
            ].join(' ')}
            style={{ left: `${node.mobileX}%`, top: `${node.mobileY}%` }}
          >
            <div className="mx-auto flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
              <RoleIcon role={node.role} />
            </div>
            <p className="mt-1 text-[9.5px] font-black leading-tight text-slate-800">{node.label}</p>
            <p className="mt-1 text-[7.5px] font-bold leading-tight text-slate-500">{node.hint}</p>
          </div>
        )
      })}
    </div>
  )
}

export default function PacketFlowVisualizer({
  scenario,
  title = '動く図解',
  description,
  points = [],
}: PacketFlowVisualizerProps) {
  const [stepIndex, setStepIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const currentStep = scenario.steps[stepIndex]
  const currentFrom = nodeById(scenario.nodes, currentStep.from)
  const currentTo = nodeById(scenario.nodes, currentStep.to)
  const pathPairs = useMemo(
    () => scenario.nodes.slice(0, -1).map((node, index) => [node, scenario.nodes[index + 1]] as const),
    [scenario.nodes],
  )
  const arrowMarkerId = `${scenario.id}-packet-flow-arrow`
  const activeArrowMarkerId = `${scenario.id}-packet-flow-arrow-active`
  const useMobileOptimizedPath = Boolean(scenario.mobileOptimized)

  const headerEntries = Object.entries(currentStep.headerFocus).filter(
    (entry): entry is [keyof PacketFlowStep['headerFocus'], string] => Boolean(entry[1]),
  )

  useEffect(() => {
    if (!isPlaying) return undefined
    const timer = window.setTimeout(() => {
      if (stepIndex >= scenario.steps.length - 1) {
        setIsPlaying(false)
        return
      }
      setStepIndex((current) => Math.min(current + 1, scenario.steps.length - 1))
    }, AUTO_STEP_MS)
    return () => window.clearTimeout(timer)
  }, [isPlaying, scenario.steps.length, stepIndex])

  const packetStartRatio = 0.32
  const packetEndRatio = 0.68
  const packetYOffset = currentFrom.y === currentTo.y ? -40 : -18
  const packetStyle = {
    '--packet-from-x': `${currentFrom.x + (currentTo.x - currentFrom.x) * packetStartRatio}%`,
    '--packet-from-y': `${currentFrom.y + (currentTo.y - currentFrom.y) * packetStartRatio + packetYOffset}%`,
    '--packet-to-x': `${currentFrom.x + (currentTo.x - currentFrom.x) * packetEndRatio}%`,
    '--packet-to-y': `${currentFrom.y + (currentTo.y - currentFrom.y) * packetEndRatio + packetYOffset}%`,
  } as CSSProperties

  const goPrevious = () => {
    setIsPlaying(false)
    setStepIndex((current) => Math.max(0, current - 1))
  }

  const goNext = () => {
    setIsPlaying(false)
    setStepIndex((current) => Math.min(scenario.steps.length - 1, current + 1))
  }

  const restart = () => {
    setIsPlaying(false)
    setStepIndex(0)
  }

  const togglePlay = () => {
    if (stepIndex >= scenario.steps.length - 1) {
      setStepIndex(0)
    }
    setIsPlaying((current) => !current)
  }

  return (
    <div className="scroll-mt-16 rounded-lg border border-slate-200 bg-white shadow-sm" data-testid="packet-flow-visualizer">
      <div className="border-b border-slate-200 px-4 py-3">
        <p className="text-xs font-black text-blue-700">{title}</p>
        <h4 className="mt-0.5 text-base font-black text-slate-800">{scenario.title}</h4>
        <p className="mt-1 text-sm leading-relaxed text-slate-600">
          <TextbookRichText text={description ?? scenario.description} />
        </p>
        {description && (
          <p className="mt-1 text-xs leading-relaxed text-slate-500">
            <TextbookRichText text={scenario.description} />
          </p>
        )}
        {points.length > 0 && (
          <ul className="mt-2 grid gap-1.5 sm:grid-cols-3">
            {points.map((point) => (
              <li key={point} className="rounded-md bg-blue-50 px-2 py-1 text-[10px] font-bold leading-relaxed text-blue-700">
                <TextbookRichText text={point} />
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="p-3 sm:p-4">
        {useMobileOptimizedPath && <MobilePacketFlowPath nodes={scenario.nodes} pathPairs={pathPairs} currentStep={currentStep} />}

        <div className={`${useMobileOptimizedPath ? 'hidden sm:block' : ''} overflow-x-auto pb-1`}>
          <div
            className="relative h-[230px] min-w-[720px] overflow-hidden rounded-lg border border-slate-200 bg-gradient-to-b from-slate-50 to-white sm:h-[270px]"
            aria-label={`${scenario.title}の通信フロー図`}
          >
            <svg className="absolute inset-0 h-full w-full" aria-hidden="true">
              <defs>
                <marker id={arrowMarkerId} markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
                  <path d="M0,0 L7,3.5 L0,7 Z" fill="#94a3b8" />
                </marker>
                <marker id={activeArrowMarkerId} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                  <path d="M0,0 L8,4 L0,8 Z" fill="#2563eb" />
                </marker>
              </defs>
              {pathPairs.map(([from, to]) => {
                const active = isActivePath(currentStep, from, to)
                return (
                  <g key={`${from.id}-${to.id}`}>
                    <line
                      x1={`${from.x}%`}
                      y1={`${from.y}%`}
                      x2={`${to.x}%`}
                      y2={`${to.y}%`}
                      stroke="#ffffff"
                      strokeWidth={active ? 9 : 7}
                      strokeLinecap="round"
                    />
                    <line
                      x1={`${from.x}%`}
                      y1={`${from.y}%`}
                      x2={`${to.x}%`}
                      y2={`${to.y}%`}
                      stroke={active ? '#2563eb' : '#cbd5e1'}
                      strokeWidth={active ? 5 : 3}
                      strokeLinecap="round"
                      strokeDasharray={active ? '0' : '8 8'}
                      markerEnd={active ? `url(#${activeArrowMarkerId})` : `url(#${arrowMarkerId})`}
                    />
                  </g>
                )
              })}
            </svg>

            {scenario.nodes.map((node) => (
              <div
                key={node.id}
                className={[
                  'absolute w-[76px] -translate-x-1/2 -translate-y-1/2 rounded-lg border bg-white px-2 py-2.5 text-center shadow-sm transition-all sm:w-[126px] sm:px-3',
                  node.id === currentStep.from || node.id === currentStep.to
                    ? 'border-blue-300 ring-2 ring-blue-100'
                    : 'border-slate-200',
                ].join(' ')}
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
              >
                <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                  <RoleIcon role={node.role} />
                </div>
                <p className="mt-1 text-[10px] font-black leading-tight text-slate-800 sm:text-xs">{node.label}</p>
                <p className="mt-1 hidden text-[10px] font-bold leading-snug text-slate-500 sm:block">{node.hint}</p>
              </div>
            ))}

            <div
              key={currentStep.id}
              className="textbook-packet absolute z-10 -translate-x-1/2 -translate-y-1/2"
              style={packetStyle}
              aria-hidden="true"
            >
              <div className="rounded-md border border-blue-200 bg-white px-2.5 py-1 text-[10px] font-black text-blue-700 shadow-lg shadow-blue-100">
                {currentStep.packetLabel}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3 grid gap-3 lg:grid-cols-[minmax(0,1fr)_260px]">
          <section className="min-h-[178px] rounded-lg border border-slate-200 bg-white px-4 py-3" aria-live="polite">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-blue-600">
                  STEP {stepIndex + 1} / {scenario.steps.length}
                </p>
                <h5 className="mt-1 text-sm font-black leading-snug text-slate-800">{currentStep.title}</h5>
              </div>
              <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-500">
                {currentStep.packetLabel}
              </span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              <TextbookRichText text={currentStep.explanation} />
            </p>
            <p className="mt-2 rounded-lg bg-blue-50 px-3 py-2 text-xs font-bold leading-relaxed text-blue-800">
              <TextbookRichText text={currentStep.deviceFocus} />
            </p>
          </section>

          <section className="min-h-[178px] rounded-lg border border-slate-200 bg-slate-50 px-3 py-3">
            <h5 className="text-xs font-black text-slate-700">このステップで見るヘッダ</h5>
            <dl className="mt-2 space-y-1.5">
              {headerEntries.map(([key, value]) => (
                <div key={key} className="grid grid-cols-[88px_minmax(0,1fr)] gap-2 text-[11px]">
                  <dt className="font-bold text-slate-500">{HEADER_LABELS[key]}</dt>
                  <dd className="min-w-0 break-all font-bold text-slate-800">{value}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={goPrevious}
            disabled={stepIndex === 0}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            title="前のステップ"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            前へ
          </button>
          <button
            type="button"
            onClick={togglePlay}
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-blue-700"
            title={isPlaying ? '一時停止' : '再生'}
          >
            {isPlaying ? <Pause className="h-4 w-4" aria-hidden="true" /> : <Play className="h-4 w-4" aria-hidden="true" />}
            {isPlaying ? '停止' : '再生'}
          </button>
          <button
            type="button"
            onClick={goNext}
            disabled={stepIndex >= scenario.steps.length - 1}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            title="次のステップ"
          >
            次へ
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={restart}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-50"
            title="最初から"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            最初から
          </button>
        </div>
      </div>
    </div>
  )
}
