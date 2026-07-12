import { useEffect, useRef } from 'react'
import { Box, Network, Server } from 'lucide-react'
import type { VmHostFigure as VmHostFigureData } from '../../../data/textbook/types'
import FigureFrame from './FigureFrame'
import StepperControls from './StepperControls'
import { useStepper } from './useStepper'

// サーバ仮想化の入れ子（第17章）。1台の物理サーバの中で複数のVMが動き、仮想スイッチでつながる構造を見せる。
// レイアウトは全ステップ不変（色だけ変わる）＝操作ボタン不動。steps.active で通信の経路を青く光らせる。

export default function VmHostFigure({ figure }: { figure: VmHostFigureData }) {
  const { index, setIndex, next, prev, count } = useStepper(figure.steps.length)
  const step = figure.steps[index]
  const on = (id: string) => step.active.includes(id)

  // VM→仮想スイッチ／仮想スイッチ→ハイパーバイザ／ハイパーバイザ→物理NW の接続線が経路上か。
  const tickOn = (vmId: string) => on(vmId) && on('switch')
  const swToHv = on('switch') && on('hv')
  const hvToUp = on('hv') && on('uplink')

  const ring = 'ring-2 ring-blue-500 ring-offset-1 ring-offset-white'

  const stageRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = stageRef.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    el.animate([{ opacity: 0.6 }, { opacity: 1 }], { duration: 240, easing: 'ease' })
  }, [index])

  return (
    <FigureFrame title={figure.title} caption={figure.caption} takeaway={figure.takeaway}>
      <div className="rounded-lg border border-slate-200 bg-slate-50/60 px-2 py-3 sm:px-3">
        <div ref={stageRef} key={index}>
          {/* 物理サーバの箱（この中でVMが間借り） */}
          <div className="relative rounded-xl border border-slate-300 bg-white px-3 pb-3 pt-5">
            <div className="absolute -top-2.5 left-3 inline-flex items-center gap-1 rounded-md border border-slate-300 bg-slate-100 px-2 py-0.5 text-[10px] font-black text-slate-600">
              <Server className="h-3 w-3" aria-hidden="true" />
              {figure.hostLabel}
            </div>

            {/* VM ×N */}
            <div className="flex gap-2">
              {figure.vms.map((vm) => (
                <div
                  key={vm.id}
                  className={`flex-1 min-w-0 rounded-lg border-[1.5px] border-blue-300 bg-blue-50 px-1 py-1.5 text-center ${on(vm.id) ? ring : ''}`}
                >
                  <div className="flex items-center justify-center gap-0.5 text-blue-800">
                    <Box className="h-3 w-3 flex-shrink-0" aria-hidden="true" />
                    <span className="text-[11px] font-black">{vm.label}</span>
                  </div>
                  <div className="mt-0.5 truncate text-[9px] text-slate-500">{vm.sub}</div>
                </div>
              ))}
            </div>

            {/* VM→仮想スイッチ の接続 */}
            <div className="flex gap-2">
              {figure.vms.map((vm) => (
                <div key={vm.id} className="flex flex-1 justify-center">
                  <div className={`h-2.5 w-0.5 ${tickOn(vm.id) ? 'bg-blue-500' : 'bg-slate-300'}`} />
                </div>
              ))}
            </div>

            {/* 仮想スイッチ */}
            <div className={`rounded-lg border-[1.5px] border-emerald-300 bg-emerald-50 px-2 py-1.5 text-center ${on('switch') ? ring : ''}`}>
              <span className="inline-flex items-center gap-1 align-middle text-emerald-800">
                <Network className="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
                <span className="text-[11px] font-black">{figure.switchLabel}</span>
              </span>
              <span className="ml-1 align-middle text-[9px] text-emerald-700">（{figure.switchSub}）</span>
            </div>

            {/* 仮想スイッチ→ハイパーバイザ */}
            <div className="flex justify-center">
              <div className={`h-2 w-0.5 ${swToHv ? 'bg-blue-500' : 'bg-slate-300'}`} />
            </div>

            {/* ハイパーバイザ */}
            <div className={`rounded-lg border border-slate-300 bg-slate-50 px-2 py-1.5 text-center ${on('hv') ? ring : ''}`}>
              <div className="text-[10px] font-black text-slate-600">{figure.hypervisorLabel}</div>
              <div className="mt-0.5 text-[9px] text-slate-500">{figure.hypervisorSub}</div>
            </div>
          </div>

          {/* 物理ネットワークへ */}
          <div className="flex justify-center">
            <div className={`h-3.5 w-0.5 ${hvToUp ? 'bg-blue-500' : 'bg-slate-300'}`} />
          </div>
          <div className="text-center">
            <span className={`inline-block rounded-md border border-slate-300 bg-slate-100 px-2.5 py-1 text-[10px] font-black text-slate-600 ${on('uplink') ? ring : ''}`}>
              {figure.uplinkLabel}
            </span>
          </div>
        </div>
      </div>

      <p aria-live="polite" className="mt-3 flex h-12 items-start text-sm leading-relaxed text-slate-700">{step.explanation}</p>

      <div className="mt-2">
        <StepperControls index={index} count={count} onPrev={prev} onNext={next} onSelect={setIndex} />
      </div>
    </FigureFrame>
  )
}
