import { Cloud, Database, Globe, Laptop, Network, Router, Server, Shield } from 'lucide-react'
import type { ComponentType } from 'react'
import type { NodeRole, Tone } from '../../../data/textbook/types'

// tone（論理色）→ Tailwind クラス。淡い塗り・枠・濃い文字をセットで持つ。
export const TONE: Record<
  Tone,
  { fill: string; border: string; text: string; soft: string; line: string }
> = {
  sky: { fill: 'bg-sky-50', border: 'border-sky-300', text: 'text-sky-800', soft: 'bg-sky-100', line: 'bg-sky-400' },
  emerald: { fill: 'bg-emerald-50', border: 'border-emerald-300', text: 'text-emerald-800', soft: 'bg-emerald-100', line: 'bg-emerald-400' },
  blue: { fill: 'bg-blue-50', border: 'border-blue-300', text: 'text-blue-800', soft: 'bg-blue-100', line: 'bg-blue-400' },
  amber: { fill: 'bg-amber-50', border: 'border-amber-300', text: 'text-amber-900', soft: 'bg-amber-100', line: 'bg-amber-400' },
  violet: { fill: 'bg-violet-50', border: 'border-violet-300', text: 'text-violet-800', soft: 'bg-violet-100', line: 'bg-violet-400' },
  rose: { fill: 'bg-rose-50', border: 'border-rose-300', text: 'text-rose-800', soft: 'bg-rose-100', line: 'bg-rose-400' },
  slate: { fill: 'bg-slate-50', border: 'border-slate-300', text: 'text-slate-700', soft: 'bg-slate-100', line: 'bg-slate-400' },
}

export const ROLE_ICON: Record<NodeRole, ComponentType<{ className?: string }>> = {
  pc: Laptop,
  switch: Network,
  router: Router,
  server: Server,
  dns: Database,
  firewall: Shield,
  internet: Globe,
  cloud: Cloud,
}

export const ROLE_TONE: Record<NodeRole, Tone> = {
  pc: 'sky',
  switch: 'emerald',
  router: 'blue',
  server: 'amber',
  dns: 'violet',
  firewall: 'rose',
  internet: 'slate',
  cloud: 'slate',
}

// レイヤ色（本文の [[color]] と統一）: L2=緑, L3=青, L4=アンバー
export const LAYER_TONE = { l2: 'emerald', l3: 'blue', l4: 'amber' } as const
