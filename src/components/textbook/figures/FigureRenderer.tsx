import type { Figure } from '../../../data/textbook/types'
import AddressTableFigure from './AddressTableFigure'
import EncapFigure from './EncapFigure'
import OsiStackFigure from './OsiStackFigure'
import PacketFlowFigure from './PacketFlowFigure'

export default function FigureRenderer({ figure }: { figure: Figure }) {
  switch (figure.kind) {
    case 'packet-flow':
      return <PacketFlowFigure figure={figure} />
    case 'osi-stack':
      return <OsiStackFigure figure={figure} />
    case 'encap':
      return <EncapFigure figure={figure} />
    case 'address-table':
      return <AddressTableFigure figure={figure} />
    default:
      return null
  }
}
