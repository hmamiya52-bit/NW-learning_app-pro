import type { Figure } from '../../../data/textbook/types'
import AddressTableFigure from './AddressTableFigure'
import EncapFigure from './EncapFigure'
import OsiStackFigure from './OsiStackFigure'
import PacketFlowFigure from './PacketFlowFigure'
import RadioRangeFigure from './RadioRangeFigure'
import RecordTableFigure from './RecordTableFigure'
import SegmentMapFigure from './SegmentMapFigure'
import SequenceFigure from './SequenceFigure'
import SubnetCalcFigure from './SubnetCalcFigure'
import TimelineFigure from './TimelineFigure'

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
    case 'sequence':
      return <SequenceFigure figure={figure} />
    case 'timeline':
      return <TimelineFigure figure={figure} />
    case 'record-table':
      return <RecordTableFigure figure={figure} />
    case 'subnet-calc':
      return <SubnetCalcFigure figure={figure} />
    case 'segment-map':
      return <SegmentMapFigure figure={figure} />
    case 'radio-range':
      return <RadioRangeFigure figure={figure} />
    default:
      return null
  }
}
