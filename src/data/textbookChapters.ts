import { textbookDiagramChapters } from './textbookDiagramChapters'

export type TextbookChapterStatus = 'published' | 'diagram' | 'draft'

export type TextbookCalloutType =
  | 'important'
  | 'practical'
  | 'exam'
  | 'pitfall'
  | 'analogy'

export interface TextbookCallout {
  type: TextbookCalloutType
  title: string
  body: string[]
}

export type TextbookDiagram =
  | LayerStackDiagram
  | NetworkFlowDiagram
  | ComparisonDiagram
  | AddressRoleTableDiagram
  | SequenceDiagram
  | SegmentDiagram
  | PacketFrameDiagram
  | EncapsulationDiagram
  | VlanDesignDiagram
  | DiagnosticMapDiagram
  | ExamNetworkDiagram
  | InteractiveFlowDiagram

export interface TextbookChapter {
  id: string
  order: number
  title: string
  description: string
  status: TextbookChapterStatus
  estimatedMinutes: number
  intro: string[]
  sections: TextbookSection[]
  examFocus: string[]
  practicalFocus: string[]
  pitfalls: string[]
  summary: string[]
}

export interface TextbookSection {
  heading: string
  body: string[]
  diagrams?: TextbookDiagram[]
  callouts?: TextbookCallout[]
}

interface DiagramBase {
  title: string
  description: string
  points: string[]
}

export interface LayerStackDiagram extends DiagramBase {
  type: 'layer-stack'
  layers: {
    label: string
    title: string
    description: string
    example: string
    color: 'blue' | 'green' | 'amber'
  }[]
}

export interface NetworkFlowDiagram extends DiagramBase {
  type: 'network-flow'
  nodes: {
    id: string
    label: string
    caption: string
    role: PacketFlowNodeRole
  }[]
  links: {
    from: string
    to: string
    label: string
  }[]
}

export interface ComparisonDiagram extends DiagramBase {
  type: 'comparison'
  columns: {
    title: string
    subtitle: string
    items: string[]
    accent: 'teal' | 'indigo' | 'amber'
  }[]
}

export interface AddressRoleTableDiagram extends DiagramBase {
  type: 'address-role-table'
  rows: {
    name: string
    layer: string
    header: string
    identifies: string
    scope: string
    example: string
    examHint: string
    accent: 'emerald' | 'blue' | 'amber'
  }[]
}

export interface SequenceDiagram extends DiagramBase {
  type: 'sequence'
  steps: {
    label: string
    title: string
    body: string
  }[]
}

export interface SegmentDiagram extends DiagramBase {
  type: 'segment'
  domains: {
    title: string
    description: string
    members: string[]
    accent: 'sky' | 'emerald' | 'rose'
  }[]
}

export interface PacketFrameDiagram extends DiagramBase {
  type: 'packet-frame'
  layers: {
    title: string
    subtitle: string
    fields: string[]
    accent: 'emerald' | 'blue' | 'amber' | 'slate'
  }[]
  notes: {
    title: string
    body: string
    accent: 'emerald' | 'blue' | 'amber' | 'slate'
  }[]
}

export interface EncapsulationDiagram extends DiagramBase {
  type: 'encapsulation-flow'
  stages: {
    label: string
    title: string
    description: string
    parts: {
      label: string
      accent: 'emerald' | 'blue' | 'amber' | 'slate'
    }[]
  }[]
  routeNotes: {
    title: string
    body: string
    accent: 'emerald' | 'blue' | 'amber' | 'slate'
  }[]
}

export interface VlanDesignDiagram extends DiagramBase {
  type: 'vlan-design'
  physical: {
    label: string
    caption: string
    role: PacketFlowNodeRole
    vlan?: string
  }[]
  logical: {
    title: string
    subnet: string
    description: string
    members: string[]
    accent: 'sky' | 'emerald' | 'rose'
  }[]
  trunk: {
    label: string
    description: string
  }
}

export interface DiagnosticMapDiagram extends DiagramBase {
  type: 'diagnostic-map'
  path: {
    id: string
    label: string
    caption: string
    role: PacketFlowNodeRole
    tone?: 'slate' | 'sky' | 'blue' | 'emerald' | 'amber' | 'rose' | 'violet'
  }[]
  lanes: {
    title: string
    subtitle: string
    items: string[]
    accent: 'sky' | 'blue' | 'emerald' | 'amber'
  }[]
}

export interface ExamNetworkDiagram extends DiagramBase {
  type: 'exam-network'
  mobileOptimized?: boolean
  viewBox: {
    width: number
    height: number
  }
  zones: ExamNetworkZone[]
  nodes: ExamNetworkNode[]
  links: ExamNetworkLink[]
  steps?: ExamNetworkStep[]
}

export interface ExamNetworkZone {
  id: string
  label: string
  x: number
  y: number
  width: number
  height: number
  kind: 'solid' | 'dashed' | 'cloud'
  caption?: string
  tone?: 'slate' | 'sky' | 'blue' | 'emerald' | 'amber' | 'rose' | 'violet'
}

export interface ExamNetworkNode {
  id: string
  label: string
  caption?: string
  x: number
  y: number
  width: number
  height: number
  role: PacketFlowNodeRole
  tone?: 'slate' | 'sky' | 'blue' | 'emerald' | 'amber' | 'rose' | 'violet'
}

export interface ExamNetworkLink {
  id: string
  points: { x: number; y: number }[]
  label?: string
  dashed?: boolean
  tone?: 'slate' | 'sky' | 'blue' | 'emerald' | 'amber' | 'rose' | 'violet'
  labelPosition?: { x: number; y: number }
}

export interface ExamNetworkStep {
  id: string
  title: string
  packetLabel: string
  activeLinkIds: string[]
  packet: {
    from: { x: number; y: number }
    to: { x: number; y: number }
  }
  description: string
  deviceAction: string
  capture: {
    point: string
    l2: string
    l3: string
    l4: string
    note: string
  }
}

export interface InteractiveFlowDiagram extends DiagramBase {
  type: 'interactive-flow'
  scenario: PacketFlowScenario
}

export type PacketFlowNodeRole =
  | 'pc'
  | 'switch'
  | 'router'
  | 'server'
  | 'dns'
  | 'firewall'
  | 'internet'

export interface PacketFlowNode {
  id: string
  label: string
  role: PacketFlowNodeRole
  hint: string
  x: number
  y: number
}

export interface PacketFlowStep {
  id: string
  title: string
  from: string
  to: string
  packetLabel: string
  explanation: string
  deviceFocus: string
  headerFocus: {
    sourceMac?: string
    destinationMac?: string
    sourceIp?: string
    destinationIp?: string
    protocol?: string
    port?: string
  }
}

export interface PacketFlowScenario {
  id: string
  title: string
  description: string
  mobileOptimized?: boolean
  nodes: PacketFlowNode[]
  steps: PacketFlowStep[]
}

export const textbookChapters: TextbookChapter[] = textbookDiagramChapters

export function getTextbookChapter(chapterId: string | undefined): TextbookChapter | undefined {
  if (!chapterId) return undefined
  return textbookChapters.find((chapter) => chapter.id === chapterId)
}

export function getPublishedTextbookChapters(): TextbookChapter[] {
  return textbookChapters.filter((chapter) => chapter.status === 'published')
}
