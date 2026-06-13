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

export default function PacketFlowVisualizer({
  scenario,
  title = 'Interactive Flow',
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

  const packetStartRatio = 0.18
  const packetEndRatio = 0.82
  const packetStyle = {
    '--packet-from-x': `${currentFrom.x + (currentTo.x - currentFrom.x) * packetStartRatio}%`,
    '--packet-from-y': `${currentFrom.y + (currentTo.y - currentFrom.y) * packetStartRatio}%`,
    '--packet-to-x': `${currentFrom.x + (currentTo.x - currentFrom.x) * packetEndRatio}%`,
    '--packet-to-y': `${currentFrom.y + (currentTo.y - currentFrom.y) * packetEndRatio}%`,
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
        <p className="text-xs font-bold uppercase text-slate-400">{title}</p>
        <h4 className="mt-0.5 text-base font-black text-slate-800">{scenario.title}</h4>
        <p className="mt-1 text-sm leading-relaxed text-slate-600">{description ?? scenario.description}</p>
        {description && (
          <p className="mt-1 text-xs leading-relaxed text-slate-500">{scenario.description}</p>
        )}
        {points.length > 0 && (
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {points.map((point) => (
              <li key={point} className="rounded-full bg-blue-50 px-2 py-1 text-[10px] font-bold text-blue-700">
                {point}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="p-3 sm:p-4">
        <div
          className="relative h-[330px] overflow-hidden rounded-lg border border-slate-200 bg-slate-50 sm:h-[390px]"
          aria-label={`${scenario.title}の通信フロー図`}
        >
          <svg className="absolute inset-0 h-full w-full" aria-hidden="true">
            {pathPairs.map(([from, to]) => {
              const active = isActivePath(currentStep, from, to)
              return (
                <line
                  key={`${from.id}-${to.id}`}
                  x1={`${from.x}%`}
                  y1={`${from.y}%`}
                  x2={`${to.x}%`}
                  y2={`${to.y}%`}
                  stroke={active ? '#2563eb' : '#cbd5e1'}
                  strokeWidth={active ? 5 : 3}
                  strokeLinecap="round"
                  strokeDasharray={active ? '0' : '8 8'}
                />
              )
            })}
          </svg>

          {scenario.nodes.map((node) => (
            <div
              key={node.id}
              className={[
                'absolute w-[70px] -translate-x-1/2 -translate-y-1/2 rounded-lg border bg-white px-1.5 py-2 text-center shadow-sm transition-all sm:w-[116px] sm:px-2',
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
              <p className="mt-0.5 hidden text-[10px] leading-snug text-slate-500 sm:block">{node.hint}</p>
            </div>
          ))}

          <div
            key={currentStep.id}
            className="textbook-packet absolute z-10 -translate-x-1/2 -translate-y-1/2"
            style={packetStyle}
            aria-hidden="true"
          >
            <div className="rounded-full bg-blue-600 px-2.5 py-1 text-[10px] font-black text-white shadow-lg shadow-blue-200">
              {currentStep.packetLabel}
            </div>
          </div>
        </div>

        <div className="mt-3 grid gap-3 lg:grid-cols-[minmax(0,1fr)_260px]">
          <section className="rounded-lg border border-slate-200 bg-white px-4 py-3" aria-live="polite">
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
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{currentStep.explanation}</p>
            <p className="mt-2 rounded-lg bg-blue-50 px-3 py-2 text-xs font-bold leading-relaxed text-blue-800">
              {currentStep.deviceFocus}
            </p>
          </section>

          <section className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3">
            <h5 className="text-xs font-black text-slate-700">このステップで見るヘッダ</h5>
            <dl className="mt-2 space-y-1.5">
              {headerEntries.map(([key, value]) => (
                <div key={key} className="grid grid-cols-[76px_minmax(0,1fr)] gap-2 text-[11px]">
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
