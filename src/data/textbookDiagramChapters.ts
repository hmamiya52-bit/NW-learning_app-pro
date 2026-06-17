import type {
  ComparisonDiagram,
  EncapsulationDiagram,
  ExamNetworkDiagram,
  LayerStackDiagram,
  PacketFlowNode,
  PacketFlowNodeRole,
  PacketFlowStep,
  TextbookChapter,
  TextbookDiagram,
} from './textbookChapters'

type Tone = 'slate' | 'sky' | 'blue' | 'emerald' | 'amber' | 'rose' | 'violet'

interface ChapterSpec {
  id: string
  order: number
  title: string
  description: string
  scope: string
  nodes: PacketFlowNode[]
  linkLabels: string[]
  steps: PacketFlowStep[]
  keyFields: string[]
  observationPoints: string[]
  compare: {
    title: string
    subtitle: string
    items: string[]
    accent: 'teal' | 'indigo' | 'amber'
  }[]
}

const ROLE_TONE: Record<PacketFlowNodeRole, Tone> = {
  pc: 'sky',
  switch: 'emerald',
  router: 'blue',
  server: 'amber',
  dns: 'violet',
  firewall: 'rose',
  internet: 'slate',
}

const osiLayerDiagram: LayerStackDiagram = {
  type: 'layer-stack',
  title: 'OSI参照モデルを7層で見る',
  description: '最初に、通信をどの層の話として見ているかを分けます。L5とL6も含め、L1からL7までを地図として置きます。',
  points: [
    'L7はアプリケーションの意味、L4はアプリケーション間の通信、L3はネットワーク間の到達性、L2は同一リンク上の転送を扱います。',
    'L5とL6は、現在のTCP/IP説明ではL7側へまとめて扱われることが多い層です。',
    'ネスペ午後では、どの層の情報を見て判断しているかを切り分けます。',
  ],
  layers: [
    { label: 'L7', title: 'アプリケーション層', description: 'HTTP、DNS、SMTPなど、通信の意味を扱う層です。', example: 'HTTPリクエスト、DNS問い合わせ', color: 'blue' },
    { label: 'L6', title: 'プレゼンテーション層', description: '表現形式、文字コード、暗号化などを扱う層です。', example: 'TLSで保護されたデータ表現', color: 'blue' },
    { label: 'L5', title: 'セッション層', description: '通信のまとまりや対話の管理を扱う層です。', example: 'セッションの確立、維持、終了', color: 'blue' },
    { label: 'L4', title: 'トランスポート層', description: '端末内のどのアプリケーションへ渡すかをポート番号で扱います。', example: 'TCP 443、UDP 53', color: 'green' },
    { label: 'L3', title: 'ネットワーク層', description: '宛先IPアドレスを見て、別ネットワークへ届ける道筋を扱います。', example: 'IPv4、IPv6、経路表', color: 'green' },
    { label: 'L2', title: 'データリンク層', description: '同一リンク上で次に渡す相手をMACアドレスで扱います。', example: 'Ethernet、VLAN、ARP', color: 'amber' },
    { label: 'L1', title: '物理層', description: 'ケーブル、電気信号、光、電波などの物理的な伝送を扱います。', example: 'UTP、光ファイバ、無線電波', color: 'amber' },
  ],
}

const encapsulationDiagram: EncapsulationDiagram = {
  type: 'encapsulation-flow',
  title: '送信側ではヘッダを付け、受信側では外していく',
  description: 'アプリケーションデータは、L4、L3、L2の情報を順に付与され、受信側では逆順に取り出されます。',
  points: [
    '各リンク上ではL2フレームとして運ばれます。その中にIPパケットやTCPセグメントが入ります。',
    'ルータは受信側のL2を外し、IPを見て、次のリンク用のL2を付け直します。',
    'L4やL7の中身を、L2SWが見て転送判断するわけではありません。',
  ],
  stages: [
    {
      label: '送信前',
      title: 'アプリケーションデータ',
      description: 'ブラウザなどのアプリケーションが送るデータです。',
      parts: [{ label: 'Data', accent: 'slate' }],
    },
    {
      label: 'L4',
      title: 'TCP/UDPヘッダを付ける',
      description: '送信元ポート、宛先ポートなどを付けます。',
      parts: [
        { label: 'L4 Header', accent: 'emerald' },
        { label: 'Data', accent: 'slate' },
      ],
    },
    {
      label: 'L3',
      title: 'IPヘッダを付ける',
      description: '送信元IP、宛先IPなどを付けます。',
      parts: [
        { label: 'L3 Header', accent: 'blue' },
        { label: 'L4 Header', accent: 'emerald' },
        { label: 'Data', accent: 'slate' },
      ],
    },
    {
      label: 'L2',
      title: 'Ethernetヘッダを付ける',
      description: 'このリンクで使う送信元MAC、宛先MACを付けます。',
      parts: [
        { label: 'L2 Header', accent: 'amber' },
        { label: 'L3 Header', accent: 'blue' },
        { label: 'L4 Header', accent: 'emerald' },
        { label: 'Data', accent: 'slate' },
        { label: 'FCS', accent: 'amber' },
      ],
    },
  ],
  routeNotes: [
    { title: 'ルータ通過時', body: 'L2ヘッダはリンクごとに変わります。L3の宛先IPは、基本的に最終宛先を指したままです。', accent: 'blue' },
    { title: '受信側', body: 'サーバはL2、L3、L4の順に確認し、最後にアプリケーションへデータを渡します。', accent: 'emerald' },
  ],
}

function makeNode(id: string, label: string, role: PacketFlowNodeRole, hint: string, x: number, y = 54): PacketFlowNode {
  return { id, label, role, hint, x, y }
}

function makeStep(
  id: string,
  title: string,
  from: string,
  to: string,
  packetLabel: string,
  explanation: string,
  deviceFocus: string,
  headerFocus: PacketFlowStep['headerFocus'],
): PacketFlowStep {
  return { id, title, from, to, packetLabel, explanation, deviceFocus, headerFocus }
}

function centerX(index: number, total: number): number {
  if (total <= 1) return 500
  return 120 + (760 / (total - 1)) * index
}

function linkId(from: string, to: string): string {
  return `link-${from}-${to}`
}

function findAdjacentLinkId(nodes: PacketFlowNode[], from: string, to: string): string {
  for (let index = 0; index < nodes.length - 1; index += 1) {
    const left = nodes[index]
    const right = nodes[index + 1]
    if ((left.id === from && right.id === to) || (left.id === to && right.id === from)) {
      return linkId(left.id, right.id)
    }
  }
  return linkId(from, to)
}

function makeExamNetworkDiagram(spec: ChapterSpec): ExamNetworkDiagram {
  const centers = new Map(spec.nodes.map((node, index) => [node.id, { x: centerX(index, spec.nodes.length), y: 240 }]))
  const nodeById = new Map(spec.nodes.map((node) => [node.id, node]))

  return {
    type: 'exam-network',
    title: `${spec.title}: 構成図で見る範囲`,
    description: spec.scope,
    points: [
      'まず、どの機器を通る通信なのかを構成図で確認します。',
      '線は物理的な接続だけでなく、読解上の通信経路として追います。',
      '動くラベルとキャプチャ欄で、どの層の情報を見ているかを確認します。',
    ],
    viewBox: { width: 1000, height: 430 },
    zones: [
      {
        id: 'scope',
        label: `第${spec.order}章の対象範囲`,
        x: 35,
        y: 40,
        width: 930,
        height: 330,
        kind: 'dashed',
        caption: '図解先行公開中',
        tone: 'slate',
      },
      {
        id: 'client-side',
        label: '利用者側',
        x: 65,
        y: 120,
        width: 250,
        height: 185,
        kind: 'dashed',
        caption: '送信元、利用者、端末',
        tone: 'sky',
      },
      {
        id: 'service-side',
        label: 'サービス側',
        x: 685,
        y: 120,
        width: 250,
        height: 185,
        kind: 'dashed',
        caption: '宛先、基盤、外部サービス',
        tone: 'amber',
      },
    ],
    nodes: spec.nodes.map((node, index) => {
      const center = centers.get(node.id) ?? { x: centerX(index, spec.nodes.length), y: 240 }
      return {
        id: node.id,
        label: node.label,
        caption: node.hint,
        x: center.x - 62,
        y: center.y - 32,
        width: 124,
        height: 64,
        role: node.role,
        tone: ROLE_TONE[node.role],
      }
    }),
    links: spec.nodes.slice(0, -1).map((node, index) => {
      const next = spec.nodes[index + 1]
      const from = centers.get(node.id) ?? { x: centerX(index, spec.nodes.length), y: 240 }
      const to = centers.get(next.id) ?? { x: centerX(index + 1, spec.nodes.length), y: 240 }
      return {
        id: linkId(node.id, next.id),
        points: [
          { x: from.x + 62, y: from.y },
          { x: to.x - 62, y: to.y },
        ],
        label: spec.linkLabels[index],
        tone: index % 2 === 0 ? 'blue' : 'emerald',
        labelPosition: { x: (from.x + to.x) / 2, y: 206 },
      }
    }),
    steps: spec.steps.map((step) => {
      const from = centers.get(step.from) ?? { x: 120, y: 240 }
      const to = centers.get(step.to) ?? { x: 880, y: 240 }
      const fromNode = nodeById.get(step.from)
      const toNode = nodeById.get(step.to)
      return {
        id: step.id,
        title: step.title,
        packetLabel: step.packetLabel,
        activeLinkIds: [findAdjacentLinkId(spec.nodes, step.from, step.to)],
        packet: { from, to },
        description: step.explanation,
        deviceAction: step.deviceFocus,
        capture: {
          point: `${fromNode?.label ?? step.from} - ${toNode?.label ?? step.to}`,
          l2: `送信元MAC ${step.headerFocus.sourceMac ?? 'この区間の送信側'} / 宛先MAC ${step.headerFocus.destinationMac ?? 'この区間の次ホップ'}`,
          l3: `送信元IP ${step.headerFocus.sourceIp ?? '対象外'} / 宛先IP ${step.headerFocus.destinationIp ?? '対象外'}`,
          l4: `${step.headerFocus.protocol ?? '対象外'} ${step.headerFocus.port ?? ''}`.trim(),
          note: step.deviceFocus,
        },
      }
    }),
  }
}

function makePacketFrameDiagram(spec: ChapterSpec): TextbookDiagram {
  return {
    type: 'packet-frame',
    title: `${spec.title}: 観測する情報を分ける`,
    description: '構成図だけでは足りない情報を、ヘッダ、状態、ログ、設定のどこで見るかに分けます。',
    points: [
      '同じ通信でも、見る層や観測点が変わると判断材料が変わります。',
      '午後問題では、構成図、表、ログ、条件文を組み合わせて読みます。',
      '図解先行フェーズでは、本文説明を後から足せるように観測点を先に置きます。',
    ],
    layers: [
      { title: '構成図で見るもの', subtitle: '機器と境界', fields: spec.nodes.map((node) => node.label), accent: 'slate' },
      { title: '判断に使う情報', subtitle: 'ヘッダ・状態・条件', fields: spec.keyFields, accent: 'blue' },
      { title: '観測点', subtitle: 'ログ・表・キャプチャ', fields: spec.observationPoints, accent: 'emerald' },
    ],
    notes: [
      { title: '基本図解', body: 'まずはこの章で最低限見たい情報だけを置き、本文は後続工程で追加します。', accent: 'blue' },
      { title: '増補余地', body: 'レビュー後、必要なら正常時/障害時/変更前後の比較図を追加します。', accent: 'amber' },
    ],
  }
}

function makeComparisonDiagram(spec: ChapterSpec): ComparisonDiagram {
  return {
    type: 'comparison',
    title: `${spec.title}: 見る観点を分ける`,
    description: '同じ題材を、試験読解、実務観測、誤解防止の3方向から分けます。',
    points: [
      '構成図の線だけで判断せず、条件、状態、ログを合わせます。',
      '用語暗記ではなく、設問で問われる判断に接続します。',
      '図が混みすぎる場合は、増補図解として別図に分けます。',
    ],
    columns: spec.compare,
  }
}

function makeInteractiveFlowDiagram(spec: ChapterSpec): TextbookDiagram {
  return {
    type: 'interactive-flow',
    title: `${spec.title}: 動く手順`,
    description: '再生、前へ、次へを使って、通信や状態変化を1ステップずつ追います。',
    points: [
      'どの機器が、どの情報を見て、次に何をするかを確認します。',
      'ヘッダ欄では、そのステップで注目するL2/L3/L4/L7相当の情報を見ます。',
      '本文は後続工程で追加し、まずは動く骨格を先に作ります。',
    ],
    scenario: {
      id: `${spec.id}-flow`,
      title: spec.title,
      description: spec.scope,
      nodes: spec.nodes,
      steps: spec.steps,
    },
  }
}

function makeChapter(spec: ChapterSpec): TextbookChapter {
  const overviewDiagrams: TextbookDiagram[] =
    spec.order === 1 ? [osiLayerDiagram, makeExamNetworkDiagram(spec)] : [makeExamNetworkDiagram(spec)]
  const informationDiagrams: TextbookDiagram[] =
    spec.order === 1 ? [encapsulationDiagram, makePacketFrameDiagram(spec)] : [makePacketFrameDiagram(spec), makeComparisonDiagram(spec)]

  return {
    id: spec.id,
    order: spec.order,
    title: spec.title,
    description: spec.description,
    status: 'diagram',
    estimatedMinutes: 0,
    intro: [],
    sections: [
      { heading: '図解1: 構成図で見る範囲', body: [], diagrams: overviewDiagrams },
      { heading: '図解2: 見る情報を分ける', body: [], diagrams: informationDiagrams },
      { heading: '図解3: 動く手順', body: [], diagrams: [makeInteractiveFlowDiagram(spec)] },
    ],
    examFocus: [],
    practicalFocus: [],
    pitfalls: [],
    summary: [],
  }
}

const chapterSpecs: ChapterSpec[] = [
  {
    id: 'osi-communication',
    order: 1,
    title: 'OSI参照モデルと通信の全体像',
    description: '通信をレイヤ、ヘッダ、構成図で見るための入口です。',
    scope: 'PCからサーバへ届くまでを、OSI 7層、カプセル化、ルータでの再カプセル化として見ます。',
    nodes: [
      makeNode('pc', 'PC', 'pc', 'L4/L3/L2を付ける', 10),
      makeNode('l2sw', 'L2SW', 'switch', '宛先MACで転送', 36),
      makeNode('l3sw', 'L3SW', 'router', 'L3で経路判断', 62),
      makeNode('server', 'サーバ', 'server', '順に外して受信', 88),
    ],
    linkLabels: ['同一リンク', 'GWへ', '別リンク'],
    keyFields: ['L4ヘッダ', 'L3ヘッダ', 'L2ヘッダ', 'FCS'],
    observationPoints: ['構成図', 'パケットキャプチャ', 'ARP表', '経路表'],
    compare: [
      { title: 'L2', subtitle: '同一リンク', accent: 'teal', items: ['MACアドレスを見る', 'リンクごとに付け替わる', 'L2SWの主な判断材料'] },
      { title: 'L3', subtitle: 'ネットワーク間', accent: 'indigo', items: ['IPアドレスを見る', '経路表で次ホップを決める', 'ルータ/L3SWの主な判断材料'] },
      { title: 'L4', subtitle: 'アプリケーション間', accent: 'amber', items: ['ポート番号を見る', 'TCP/UDPの違いを見る', 'FWやLBの条件に使われる'] },
    ],
    steps: [
      makeStep('pc-l2', 'PCが最初のL2フレームを作る', 'pc', 'l2sw', 'Ethernet', '宛先IPはサーバのまま、宛先MACは次ホップ向けにします。', 'PCはL4、L3、L2の順に情報を付与します。', { sourceMac: 'PC', destinationMac: 'GW', sourceIp: 'PC', destinationIp: 'Server', protocol: 'TCP', port: '443' }),
      makeStep('l2-l3', 'L2SWがMACアドレスで転送する', 'l2sw', 'l3sw', 'Frame', 'L2SWは宛先MACを見て、同じリンク内でフレームを転送します。', 'L2SWはIP経路判断をしていません。', { sourceMac: 'PC', destinationMac: 'GW', sourceIp: 'PC', destinationIp: 'Server', protocol: 'TCP', port: '443' }),
      makeStep('l3-server', 'L3SWが次のリンク用にL2を付け直す', 'l3sw', 'server', '再カプセル化', 'L3SWは受信したL2を外し、IPを見て、サーバ側リンク用のL2を付けます。', '変わるのはL2です。宛先IPはサーバを指したままです。', { sourceMac: 'L3SW', destinationMac: 'Server', sourceIp: 'PC', destinationIp: 'Server', protocol: 'TCP', port: '443' }),
    ],
  },
  {
    id: 'tcp-udp-port',
    order: 2,
    title: 'TCP/UDPとポート番号',
    description: 'L4の役割、ポート番号、5タプルを図で整理します。',
    scope: 'クライアントとサーバの間で、TCP/UDPとポート番号が何を識別するかを見ます。',
    nodes: [
      makeNode('client', 'クライアント', 'pc', '送信元ポートを使う', 10),
      makeNode('gw', '中継機器', 'router', '経路を中継', 40),
      makeNode('server', 'サーバ', 'server', '宛先ポートで受ける', 70),
      makeNode('app', 'アプリ', 'server', 'プロセスへ渡す', 90),
    ],
    linkLabels: ['TCP/UDP', 'IP転送', 'ポートで渡す'],
    keyFields: ['送信元IP', '宛先IP', '送信元ポート', '宛先ポート', 'TCP/UDP'],
    observationPoints: ['5タプル', 'TCP状態', 'FWセッション表', 'パケットキャプチャ'],
    compare: [
      { title: 'TCP', subtitle: '状態を持つ', accent: 'teal', items: ['3ウェイハンドシェイク', '再送、順序制御', 'HTTP/TLSなどで多用'] },
      { title: 'UDP', subtitle: '軽量', accent: 'indigo', items: ['コネクション確立なし', 'アプリ側で再送する場合がある', 'DNS、NTP、CoAPなど'] },
      { title: 'ポート番号', subtitle: '端末内の宛先', accent: 'amber', items: ['宛先ポートはサービスを示す', '送信元ポートは戻り通信の識別に効く', '5タプルで通信を識別'] },
    ],
    steps: [
      makeStep('syn-out', 'SYNを送る', 'client', 'gw', 'SYN', 'クライアントは一時ポートからサーバの待受ポートへSYNを送ります。', '送信元ポートと宛先ポートの組合せを見ます。', { sourceIp: '10.0.1.10', destinationIp: '172.16.0.20', protocol: 'TCP SYN', port: '52000 -> 443' }),
      makeStep('syn-to-server', 'サーバへ到達する', 'gw', 'server', 'SYN', '中継機器はL3で転送し、サーバは宛先ポート443で待ち受けます。', 'L4の宛先ポートはサーバ上のサービスへ渡す手掛かりです。', { sourceIp: '10.0.1.10', destinationIp: '172.16.0.20', protocol: 'TCP SYN', port: '52000 -> 443' }),
      makeStep('synack-back', 'SYN/ACKを返す', 'server', 'gw', 'SYN/ACK', 'サーバは送信元と宛先を反転して応答します。', '戻り通信は同じ5タプルの反対方向として追います。', { sourceIp: '172.16.0.20', destinationIp: '10.0.1.10', protocol: 'TCP SYN/ACK', port: '443 -> 52000' }),
      makeStep('app-deliver', 'アプリケーションへ渡す', 'server', 'app', 'Payload', '確立後のデータは宛先ポートに対応するアプリケーションへ渡されます。', 'ポート番号は端末内の受け渡し先を識別します。', { sourceIp: '10.0.1.10', destinationIp: '172.16.0.20', protocol: 'TCP', port: '52000 -> 443' }),
    ],
  },
  {
    id: 'dns-dhcp-arp',
    order: 3,
    title: 'DNS・DHCP・ARP',
    description: '通信を始める前の準備を、名前、IP、MACに分けて見ます。',
    scope: '端末が通信を始める前に、IP設定、名前解決、次ホップMAC解決を行う流れです。',
    nodes: [
      makeNode('pc', 'PC', 'pc', '通信を始める端末', 10),
      makeNode('l2sw', 'L2SW', 'switch', '同一LANへ転送', 34),
      makeNode('infra', 'DNS/DHCP', 'dns', '準備情報を返す', 58),
      makeNode('gw', 'GW', 'router', '次ホップになる', 82),
    ],
    linkLabels: ['ブロードキャスト/問い合わせ', '応答', 'ARP対象'],
    keyFields: ['FQDN', '割当IP', 'デフォルトGW', '宛先MAC'],
    observationPoints: ['DNSキャッシュ', 'DHCPリース', 'ARPテーブル', 'MACアドレステーブル'],
    compare: [
      { title: 'DNS', subtitle: '名前からIPへ', accent: 'teal', items: ['FQDNをIPアドレスへ解決', 'キャッシュとTTLを見る', 'A/AAAAレコードを確認'] },
      { title: 'DHCP', subtitle: '端末設定を配る', accent: 'indigo', items: ['IP、GW、DNSを配る', 'DORAの流れを見る', 'リレーの有無を見る'] },
      { title: 'ARP', subtitle: '次ホップMACへ', accent: 'amber', items: ['同一LAN内で解決', '最終宛先ではなく次ホップを見る', 'IPヘッダではなくARPとして運ぶ'] },
    ],
    steps: [
      makeStep('dhcp-discover', 'DHCP Discoverを送る', 'pc', 'l2sw', 'DHCP', '端末はまだ自分のIP設定を持たないため、同一LANへブロードキャストします。', 'L2ブロードキャストとして扱います。', { sourceMac: 'PC', destinationMac: 'ff:ff:ff:ff:ff:ff', sourceIp: '0.0.0.0', destinationIp: '255.255.255.255', protocol: 'UDP', port: '68 -> 67' }),
      makeStep('dns-query', 'DNSで宛先IPを調べる', 'l2sw', 'infra', 'DNS', '通信先のFQDNからIPアドレスを得ます。', 'DNSは通信前の宛先IP確認です。', { sourceIp: '192.168.10.10', destinationIp: '192.168.10.53', protocol: 'UDP', port: '53000 -> 53' }),
      makeStep('arp-gw', '次ホップのMACを調べる', 'l2sw', 'gw', 'ARP', '別ネットワークへ送る場合、PCはデフォルトゲートウェイのMACアドレスを調べます。', 'ARP対象は最終宛先サーバではなく、同一LAN内の次ホップです。', { sourceMac: 'PC', destinationMac: 'ff:ff:ff:ff:ff:ff', sourceIp: '192.168.10.10', destinationIp: '192.168.10.1', protocol: 'ARP' }),
    ],
  },
  {
    id: 'web-tls-http',
    order: 4,
    title: 'Web通信・TLS・HTTP',
    description: 'WebアクセスをDNS、TCP、TLS、HTTPの順番で見ます。',
    scope: 'ブラウザからWebサーバへ届くまでを、開始手順と保護されたHTTP通信として追います。',
    nodes: [
      makeNode('browser', 'ブラウザ', 'pc', '利用者端末', 10),
      makeNode('gw', 'GW/FW', 'firewall', '経路と許可', 34),
      makeNode('internet', 'インターネット', 'internet', '外部経路', 58),
      makeNode('web', 'Webサーバ', 'server', 'HTTPS待受', 82),
    ],
    linkLabels: ['TCP/TLS', '外部接続', 'HTTPS'],
    keyFields: ['FQDN', 'TCP 443', '証明書', 'HTTPメソッド', 'ステータスコード'],
    observationPoints: ['DNS応答', 'TCP状態', 'TLS証明書', 'HTTPログ'],
    compare: [
      { title: 'DNS', subtitle: '宛先を得る', accent: 'teal', items: ['FQDNからIPを得る', 'キャッシュを確認', '誤ったIPを疑う'] },
      { title: 'TLS', subtitle: '相手を確認する', accent: 'indigo', items: ['証明書チェーン', 'FQDN一致', '有効期限'] },
      { title: 'HTTP', subtitle: '要求と応答', accent: 'amber', items: ['メソッドとパス', 'Hostヘッダ', 'ステータスコード'] },
    ],
    steps: [
      makeStep('tcp-start', 'TCP接続を開始する', 'browser', 'gw', 'SYN', 'ブラウザはWebサーバの443番ポートへTCP接続を開始します。', 'まずL4接続が成立するかを見ます。', { sourceIp: '192.168.10.10', destinationIp: '203.0.113.20', protocol: 'TCP SYN', port: '53000 -> 443' }),
      makeStep('fw-forward', 'FWが許可して外部へ出す', 'gw', 'internet', 'TCP', 'FWは送信元、宛先、ポート、状態を見て通信を許可します。', '許可条件と戻り通信の状態を確認します。', { sourceIp: '192.168.10.10', destinationIp: '203.0.113.20', protocol: 'TCP', port: '53000 -> 443' }),
      makeStep('tls-handshake', 'TLSでサーバを確認する', 'internet', 'web', 'TLS', '証明書を受け取り、信頼できる相手かを確認します。', 'HTTP本文の前にTLSの確認があります。', { sourceIp: '192.168.10.10', destinationIp: '203.0.113.20', protocol: 'TLS', port: '443' }),
      makeStep('http-request', 'HTTP要求を送る', 'browser', 'gw', 'HTTP', 'TLS上でHTTPリクエストを送ります。', 'HTTPとして見るのはTLS確立後です。', { sourceIp: '192.168.10.10', destinationIp: '203.0.113.20', protocol: 'HTTPS', port: 'GET /' }),
    ],
  },
  {
    id: 'l2-vlan-stp',
    order: 5,
    title: 'L2スイッチング・VLAN・STP',
    description: '物理構成と論理構成、VLAN、L2ループ防止を図で見ます。',
    scope: 'L2SWがMACアドレスを学習し、VLANで範囲を分け、STPでループを抑える様子を扱います。',
    nodes: [
      makeNode('pc-a', 'PC-A', 'pc', 'VLAN 10', 10),
      makeNode('l2sw', 'L2SW', 'switch', 'MAC学習', 34),
      makeNode('l3sw', 'L3SW/SVI', 'router', 'VLAN間の境界', 58),
      makeNode('server', 'サーバ', 'server', 'VLAN 20', 82),
    ],
    linkLabels: ['Access', 'Trunk/SVI', 'VLAN 20'],
    keyFields: ['送信元MAC', '宛先MAC', 'VLAN ID', 'STP状態'],
    observationPoints: ['MACアドレステーブル', 'VLAN設定', 'trunk設定', 'STP状態'],
    compare: [
      { title: '物理構成', subtitle: 'ケーブル上', accent: 'teal', items: ['どの機器が接続されているか', '冗長リンクの有無', '物理障害の範囲'] },
      { title: '論理構成', subtitle: 'VLAN上', accent: 'indigo', items: ['ブロードキャストドメイン', 'アクセスポートとトランク', 'SVIでL3境界を作る'] },
      { title: 'STP', subtitle: 'ループ防止', accent: 'amber', items: ['Blocking/Forwarding', '障害時の再計算', '収束時間を見る'] },
    ],
    steps: [
      makeStep('learn-mac', 'L2SWが送信元MACを学習する', 'pc-a', 'l2sw', 'Frame', 'フレーム到着時、L2SWは送信元MACと受信ポートを学習します。', 'L2SWの判断材料はMACアドレスとポートです。', { sourceMac: 'PC-A', destinationMac: 'GW', sourceIp: '192.168.10.10', destinationIp: '192.168.20.20', protocol: 'TCP' }),
      makeStep('to-svi', 'VLAN間通信はL3境界へ進む', 'l2sw', 'l3sw', 'VLAN 10', '別VLAN宛ての通信は、SVIなどのL3中継点へ渡します。', 'VLANをまたぐにはL3判断が必要です。', { sourceMac: 'PC-A', destinationMac: 'SVI10', sourceIp: '192.168.10.10', destinationIp: '192.168.20.20', protocol: 'TCP' }),
      makeStep('to-server', '別VLAN側へ再カプセル化する', 'l3sw', 'server', 'VLAN 20', 'L3SWはVLAN 20側のL2フレームとして送り直します。', 'L2ヘッダはVLANごとに変わります。', { sourceMac: 'SVI20', destinationMac: 'Server', sourceIp: '192.168.10.10', destinationIp: '192.168.20.20', protocol: 'TCP' }),
    ],
  },
  {
    id: 'routing-ospf',
    order: 6,
    title: 'ルーティング基礎・OSPF',
    description: '経路表、ロンゲストマッチ、OSPF収束を図で見ます。',
    scope: 'ルータが宛先プレフィックスを見て次ホップを選び、OSPFで経路情報を共有する流れです。',
    nodes: [
      makeNode('router-a', 'Router A', 'router', '送信元側', 10),
      makeNode('router-b', 'Router B', 'router', '隣接ルータ', 34),
      makeNode('router-c', 'Router C', 'router', '迂回候補', 58),
      makeNode('server', 'サーバ網', 'server', '宛先NW', 82),
    ],
    linkLabels: ['OSPF隣接', 'LSA共有', '宛先へ'],
    keyFields: ['宛先プレフィックス', '次ホップ', '出力IF', 'OSPFコスト'],
    observationPoints: ['経路表', 'OSPFネイバー', 'LSDB', 'traceroute'],
    compare: [
      { title: '静的経路', subtitle: '手動設定', accent: 'teal', items: ['明示的に設定', '変化に自動追従しない', '小規模や固定経路で使う'] },
      { title: '動的経路', subtitle: '自動交換', accent: 'indigo', items: ['経路情報を交換', '障害時に再計算', '設計と制御が重要'] },
      { title: 'OSPF', subtitle: 'リンク状態型', accent: 'amber', items: ['隣接を作る', 'LSAを共有', 'SPFで経路を計算'] },
    ],
    steps: [
      makeStep('hello', 'OSPF Helloで隣接を確認する', 'router-a', 'router-b', 'Hello', '隣接条件が一致するとネイバー関係を作ります。', 'Hello/Dead間隔やエリアなどを確認します。', { sourceIp: 'Router A', destinationIp: '224.0.0.5', protocol: 'OSPF Hello' }),
      makeStep('lsa', 'LSAを共有する', 'router-b', 'router-c', 'LSA', 'リンク状態情報を共有し、同じLSDBを目指します。', 'OSPFは単に隣の経路だけを覚えるわけではありません。', { sourceIp: 'Router B', destinationIp: '224.0.0.5', protocol: 'OSPF LSA' }),
      makeStep('forward', '経路表に従って転送する', 'router-c', 'server', 'IP', '計算結果として選ばれた次ホップへパケットを転送します。', '実際のデータ転送は経路表の結果を使います。', { sourceIp: '10.0.0.10', destinationIp: '172.16.0.20', protocol: 'IP' }),
    ],
  },
  {
    id: 'bgp-internet',
    order: 7,
    title: 'BGP・インターネット接続',
    description: 'AS、経路広告、外部接続の切替を図で見ます。',
    scope: '組織外との接続で、AS間に経路を広告し、到達性を作る様子を扱います。',
    nodes: [
      makeNode('as-a', '自社AS', 'router', 'AS65001', 10),
      makeNode('isp-a', 'ISP A', 'internet', 'eBGP', 34),
      makeNode('internet', 'Internet', 'internet', 'AS間経路', 58),
      makeNode('saas', 'SaaS', 'server', '公開サービス', 82),
    ],
    linkLabels: ['eBGP', '経路伝播', '到達'],
    keyFields: ['プレフィックス', 'AS PATH', 'Local Pref', 'MED', 'Next Hop'],
    observationPoints: ['BGPテーブル', '広告経路', 'セッション状態', 'looking glass'],
    compare: [
      { title: 'eBGP', subtitle: 'AS間', accent: 'teal', items: ['外部ASと交換', '到達性を広告', 'ポリシー制御が重要'] },
      { title: 'iBGP', subtitle: 'AS内', accent: 'indigo', items: ['AS内で経路を配る', 'フルメッシュやRRを考える', 'IGPとの関係を見る'] },
      { title: '経路選択', subtitle: '最短とは限らない', accent: 'amber', items: ['属性で選ぶ', '冗長化と負荷分散', '誤広告の影響を見る'] },
    ],
    steps: [
      makeStep('advertise', '自社プレフィックスを広告する', 'as-a', 'isp-a', 'UPDATE', '自社ASは到達可能なプレフィックスをISPへ広告します。', '広告しない経路には外部から到達できません。', { sourceIp: 'AS65001', destinationIp: 'ISP A', protocol: 'BGP UPDATE', port: 'TCP 179' }),
      makeStep('propagate', 'AS間へ経路が伝わる', 'isp-a', 'internet', 'AS PATH', '広告された経路はAS PATHなどの属性を伴って伝播します。', 'BGPはポリシーで経路を選びます。', { sourceIp: 'ISP A', destinationIp: 'Internet', protocol: 'BGP UPDATE', port: 'TCP 179' }),
      makeStep('reach', '外部サービスへ到達する', 'internet', 'saas', 'IP', '選ばれた経路に従ってSaaSへ通信します。', '障害時は経路広告やセッション状態を確認します。', { sourceIp: '198.51.100.10', destinationIp: '203.0.113.50', protocol: 'HTTPS', port: '443' }),
    ],
  },
  {
    id: 'redundancy-change',
    order: 8,
    title: '冗長化・可用性・更改作業',
    description: 'VRRP、状態同期、切替、切戻しを図で見ます。',
    scope: '障害や更改作業で、どの機器が切り替わり、通信にどの範囲で影響するかを見ます。',
    nodes: [
      makeNode('pc', 'PC', 'pc', 'デフォルトGW利用', 10),
      makeNode('vrrp', 'VRRP VIP', 'router', '仮想IP', 34),
      makeNode('core', 'Core', 'router', '中継', 58),
      makeNode('server', 'サーバ', 'server', '業務通信', 82),
    ],
    linkLabels: ['GW向け', '切替対象', '業務通信'],
    keyFields: ['仮想IP', '優先度', 'Advertisement', 'セッション同期'],
    observationPoints: ['VRRP状態', '監視ログ', 'セッション表', '作業手順書'],
    compare: [
      { title: '冗長化', subtitle: '故障に備える', accent: 'teal', items: ['単一障害点を減らす', '切替条件を決める', '監視対象を決める'] },
      { title: '状態同期', subtitle: '通信継続', accent: 'indigo', items: ['FW/LBでは状態が重要', '同期なしでは再接続が必要な場合', '同期範囲を確認'] },
      { title: '更改作業', subtitle: '影響を管理', accent: 'amber', items: ['事前確認', '切替', '確認', '切戻し条件'] },
    ],
    steps: [
      makeStep('normal-gw', '通常時は仮想IPへ送る', 'pc', 'vrrp', 'Frame', 'PCは物理機器ではなくデフォルトゲートウェイの仮想IPを使います。', 'ARPで仮想MACを得る点を確認します。', { sourceMac: 'PC', destinationMac: 'VRRP仮想MAC', sourceIp: '192.168.10.10', destinationIp: '172.16.0.20', protocol: 'TCP' }),
      makeStep('active-forward', 'Masterが中継する', 'vrrp', 'core', 'IP', 'Master側の装置が実際の転送を担当します。', 'どちらがMasterかを状態で見ます。', { sourceIp: '192.168.10.10', destinationIp: '172.16.0.20', protocol: 'TCP' }),
      makeStep('service-reach', 'サーバへ通信が届く', 'core', 'server', 'TCP', '切替後も経路と状態が維持されていれば通信は継続できます。', '状態同期の有無が影響します。', { sourceIp: '192.168.10.10', destinationIp: '172.16.0.20', protocol: 'TCP', port: '443' }),
    ],
  },
  {
    id: 'lb-proxy-cdn',
    order: 9,
    title: 'ロードバランサ・プロキシ・CDN',
    description: '中継装置が通信をどう受け、どこへ渡すかを図で見ます。',
    scope: 'LB、プロキシ、CDNが、直接通信とは異なる接続先、終端点、観測点を作る様子です。',
    nodes: [
      makeNode('client', 'Client', 'pc', '利用者', 10),
      makeNode('proxy', 'Proxy/CDN', 'server', '中継/キャッシュ', 34),
      makeNode('lb', 'LB', 'router', 'VIPで受ける', 58),
      makeNode('origin', 'Origin', 'server', '実サーバ', 82),
    ],
    linkLabels: ['代理通信', 'VIP', '実サーバ'],
    keyFields: ['VIP', 'Real Server', 'Host', 'X-Forwarded-For', 'CONNECT'],
    observationPoints: ['LBログ', 'プロキシログ', 'CDNキャッシュ', 'ヘルスチェック'],
    compare: [
      { title: 'LB', subtitle: '振り分け', accent: 'teal', items: ['VIPで受ける', '実サーバへ分配', 'ヘルスチェックを見る'] },
      { title: 'プロキシ', subtitle: '代理通信', accent: 'indigo', items: ['接続先がプロキシになる', 'CONNECTでトンネル', 'ログの送信元に注意'] },
      { title: 'CDN', subtitle: '近い場所から配信', accent: 'amber', items: ['DNSとキャッシュ', 'オリジン保護', 'キャッシュヒット/ミスを見る'] },
    ],
    steps: [
      makeStep('client-proxy', 'クライアントが中継先へ接続する', 'client', 'proxy', 'HTTPS', '直接Originへ行くのではなく、Proxy/CDNへ接続します。', 'クライアントから見た接続先を確認します。', { sourceIp: 'Client', destinationIp: 'Proxy/CDN', protocol: 'HTTPS', port: '443' }),
      makeStep('proxy-lb', '中継装置がLBへ送る', 'proxy', 'lb', 'HTTP', 'Proxy/CDNが必要に応じてLBやOriginへ通信します。', '送信元IPやHostヘッダの扱いを見ます。', { sourceIp: 'Proxy/CDN', destinationIp: 'VIP', protocol: 'HTTP/HTTPS', port: '443' }),
      makeStep('lb-origin', 'LBが実サーバへ振り分ける', 'lb', 'origin', 'TCP', 'LBはヘルスチェック結果や方式に応じて実サーバへ振り分けます。', 'VIPとReal Serverを分けて見ます。', { sourceIp: 'LB', destinationIp: 'Origin', protocol: 'TCP', port: '443' }),
    ],
  },
  {
    id: 'vpn-wan-sdwan',
    order: 10,
    title: 'VPN・WAN・SD-WAN',
    description: '拠点間接続、IPsec、overlay/underlayを図で見ます。',
    scope: '拠点LANの通信がIPsecやSD-WANで外部回線上を保護されて運ばれる様子です。',
    nodes: [
      makeNode('branch', '拠点LAN', 'pc', '送信元NW', 10),
      makeNode('vpn-a', 'IPsec装置A', 'router', '暗号化', 34),
      makeNode('wan', 'WAN/Internet', 'internet', 'underlay', 58),
      makeNode('vpn-b', 'IPsec装置B', 'router', '復号', 74),
      makeNode('hq', '本社LAN', 'server', '宛先NW', 90),
    ],
    linkLabels: ['内側IP', 'ESP/UDP4500', 'トンネル', '内側IP'],
    keyFields: ['内側IP', '外側IP', 'ESP', 'UDP 4500', 'トンネルID'],
    observationPoints: ['IKE SA', 'IPsec SA', 'NAT-T', '回線品質'],
    compare: [
      { title: 'underlay', subtitle: '実際の到達性', accent: 'teal', items: ['回線、ISP、Internet', '外側IPで届く', '遅延や損失を見る'] },
      { title: 'overlay', subtitle: '論理的な接続', accent: 'indigo', items: ['トンネルで結ぶ', '内側IPを運ぶ', '経路制御を重ねる'] },
      { title: 'IPsec', subtitle: '保護通信', accent: 'amber', items: ['IKEで鍵交換', 'ESPで保護', 'NAT-Tを確認'] },
    ],
    steps: [
      makeStep('inner-to-gw', '拠点LANからVPN装置へ送る', 'branch', 'vpn-a', '内側IP', '拠点端末は本社LAN宛ての通常のIPパケットを送ります。', 'まだIPsec外側ヘッダは付いていません。', { sourceIp: '10.10.0.10', destinationIp: '10.20.0.20', protocol: 'TCP', port: '443' }),
      makeStep('encapsulate', 'IPsec装置がカプセル化する', 'vpn-a', 'wan', 'ESP', 'IPsec装置が外側IPヘッダとESPを付け、WANへ送ります。', '内側IPと外側IPを分けて見ます。', { sourceIp: '198.51.100.10', destinationIp: '203.0.113.10', protocol: 'ESP/NAT-T', port: 'UDP 4500' }),
      makeStep('decapsulate', '対向側で復号して本社LANへ渡す', 'vpn-b', 'hq', '内側IP', '対向装置はESPを外し、元の内側IPパケットを本社LANへ渡します。', '本社LAN側では内側IP通信として見えます。', { sourceIp: '10.10.0.10', destinationIp: '10.20.0.20', protocol: 'TCP', port: '443' }),
    ],
  },
  {
    id: 'security-fw-swg',
    order: 11,
    title: 'セキュリティ境界・FW・SWG',
    description: '内部、DMZ、外部の境界と許可条件を図で見ます。',
    scope: 'FWやSWGが、通信経路、許可条件、NAT、ログ取得点にどのように関わるかを見ます。',
    nodes: [
      makeNode('internal', '内部PC', 'pc', '利用者', 10),
      makeNode('fw', 'FW', 'firewall', '許可/遮断', 34),
      makeNode('dmz', 'DMZ Web', 'server', '公開サーバ', 58),
      makeNode('internet', 'Internet', 'internet', '外部', 82),
    ],
    linkLabels: ['内部->FW', 'DMZ', '外部'],
    keyFields: ['送信元/宛先', 'サービス', '方向', 'NAT', '状態'],
    observationPoints: ['FWルール', 'FWログ', 'NATテーブル', 'SWGログ'],
    compare: [
      { title: 'FW', subtitle: '境界の制御', accent: 'teal', items: ['ルール表で許可/遮断', '方向と状態を見る', 'ログで根拠を確認'] },
      { title: 'DMZ', subtitle: '公開範囲', accent: 'indigo', items: ['内部LANと分ける', '外部公開の入口', '許可通信を限定'] },
      { title: 'SWG', subtitle: 'Web出口制御', accent: 'amber', items: ['プロキシ型の制御', 'URLやユーザを見る', '復号有無に注意'] },
    ],
    steps: [
      makeStep('to-fw', '内部PCがFWへ到達する', 'internal', 'fw', 'TCP', '内部PCの通信は境界装置であるFWへ到達します。', 'FWの入力IFと方向を確認します。', { sourceIp: '192.168.10.10', destinationIp: '172.16.0.20', protocol: 'TCP', port: '52000 -> 443' }),
      makeStep('fw-rule', 'FWがルールと状態を確認する', 'fw', 'dmz', '許可', 'FWは送信元、宛先、サービス、状態を見て許可します。', 'FWは単に線をつなぐ装置ではなく、条件で判断します。', { sourceIp: '192.168.10.10', destinationIp: '172.16.0.20', protocol: 'TCP', port: '443' }),
      makeStep('dmz-external', 'DMZと外部の境界を分ける', 'dmz', 'internet', '公開', '公開サーバは外部にも見えるため、内部LANとは別の境界で保護します。', 'DMZは内部LANの延長ではありません。', { sourceIp: '172.16.0.20', destinationIp: 'Internet', protocol: 'HTTPS', port: '443' }),
    ],
  },
  {
    id: 'auth-sso-pki',
    order: 12,
    title: '認証・認可・SSO・PKI',
    description: '誰を確認し、何を許可するかを図で分けます。',
    scope: '利用者、サービス、IdP、証明書基盤の間で、認証情報やチケットがどう動くかを扱います。',
    nodes: [
      makeNode('user', '利用者', 'pc', 'ブラウザ', 10),
      makeNode('sp', 'SP', 'server', '利用先サービス', 34),
      makeNode('idp', 'IdP', 'server', '認証基盤', 58),
      makeNode('app', 'アプリ', 'server', '認可後に利用', 82),
    ],
    linkLabels: ['アクセス', 'リダイレクト', 'アサーション'],
    keyFields: ['IDトークン', 'SAMLアサーション', '証明書チェーン', '権限情報'],
    observationPoints: ['認証ログ', '証明書', 'IdP設定', 'アプリ認可設定'],
    compare: [
      { title: '認証', subtitle: '誰か', accent: 'teal', items: ['本人確認', 'パスワード、証明書、MFA', 'ログイン結果を見る'] },
      { title: '認可', subtitle: '何を許すか', accent: 'indigo', items: ['ロールや権限', 'アクセス可否', 'アプリ側の判断'] },
      { title: 'PKI', subtitle: '信頼の根拠', accent: 'amber', items: ['証明書チェーン', 'CAを信頼', '失効や期限を見る'] },
    ],
    steps: [
      makeStep('access-sp', '利用者がサービスへアクセスする', 'user', 'sp', 'HTTPS', '未認証の利用者はサービスへアクセスします。', 'サービスは認証済みかを確認します。', { sourceIp: 'Client', destinationIp: 'SP', protocol: 'HTTPS', port: '443' }),
      makeStep('redirect-idp', 'IdPへ認証を委ねる', 'sp', 'idp', 'Redirect', 'SPは利用者をIdPへ誘導し、認証を行わせます。', '認証を担当する主体を分けます。', { sourceIp: 'SP', destinationIp: 'IdP', protocol: 'SAML/OIDC', port: '443' }),
      makeStep('assertion', '認証結果をサービスへ渡す', 'idp', 'app', 'Assertion', 'IdPは認証結果や属性をサービスへ渡し、アプリは認可を判断します。', '認証結果と権限判断を混同しないように見ます。', { sourceIp: 'IdP', destinationIp: 'App', protocol: 'SAML/OIDC', port: '443' }),
    ],
  },
  {
    id: 'wireless-lan',
    order: 13,
    title: '無線LAN',
    description: '端末、AP、WLC、認証、VLAN割当を図で見ます。',
    scope: '無線端末がAPへ接続し、認証後に適切なVLANへ収容される流れです。',
    nodes: [
      makeNode('sta', '無線端末', 'pc', 'Supplicant', 10),
      makeNode('ap', 'AP', 'switch', '無線収容', 34),
      makeNode('wlc', 'WLC', 'router', '集中制御', 58),
      makeNode('radius', 'RADIUS', 'server', '認証', 82),
    ],
    linkLabels: ['無線', 'CAPWAP等', 'EAP/RADIUS'],
    keyFields: ['SSID', 'BSSID', '認証方式', 'VLAN ID', 'チャネル'],
    observationPoints: ['WLCログ', 'RADIUSログ', '電波強度', 'DHCPリース'],
    compare: [
      { title: '電波', subtitle: '物理的な条件', accent: 'teal', items: ['チャネルと干渉', '電波強度', 'ローミングしきい値'] },
      { title: '認証', subtitle: '接続可否', accent: 'indigo', items: ['802.1X/EAP', 'RADIUS連携', '証明書やID'] },
      { title: 'VLAN', subtitle: '収容先', accent: 'amber', items: ['認証結果で割当', 'SSIDとVLANの対応', 'DHCP範囲を見る'] },
    ],
    steps: [
      makeStep('assoc', '端末がAPへ関連付ける', 'sta', 'ap', 'Association', '端末はSSIDを選び、APへ接続を試みます。', 'まず無線リンクの成立を見ます。', { sourceMac: 'STA', destinationMac: 'AP', protocol: '802.11' }),
      makeStep('wlc-forward', 'APがWLCへ制御情報を送る', 'ap', 'wlc', 'Control', '集中管理構成ではAPとWLCの間で制御情報をやり取りします。', 'AP単体ではなくWLCの設定も見ます。', { sourceIp: 'AP', destinationIp: 'WLC', protocol: 'CAPWAP等' }),
      makeStep('radius-auth', 'RADIUSで認証する', 'wlc', 'radius', 'EAP', '認証結果により接続可否やVLAN割当が決まります。', '認証ログとVLAN割当を対応させます。', { sourceIp: 'WLC', destinationIp: 'RADIUS', protocol: 'RADIUS/EAP', port: 'UDP 1812' }),
    ],
  },
  {
    id: 'ipv6',
    order: 14,
    title: 'IPv6',
    description: 'IPv6アドレス、NDP、RA/SLAACを図で見ます。',
    scope: 'IPv6ではARPではなくNDPを使い、RAやSLAACでアドレス設定やデフォルトルータを扱います。',
    nodes: [
      makeNode('host', 'IPv6端末', 'pc', 'Link-Local/GUA', 10),
      makeNode('switch', 'L2SW', 'switch', '同一リンク', 34),
      makeNode('router', 'Router', 'router', 'RA送信', 58),
      makeNode('server', 'IPv6サーバ', 'server', '宛先', 82),
    ],
    linkLabels: ['NS/NA', 'RA', 'IPv6'],
    keyFields: ['IPv6アドレス', 'Link-Local', 'RA', 'NS/NA', 'ICMPv6'],
    observationPoints: ['近隣キャッシュ', 'RA受信', 'DNS AAAA', 'traceroute6'],
    compare: [
      { title: 'IPv4', subtitle: 'ARP/DHCP', accent: 'teal', items: ['ARPでMAC解決', 'DHCPで設定', 'ブロードキャストあり'] },
      { title: 'IPv6', subtitle: 'NDP/RA', accent: 'indigo', items: ['ICMPv6を使う', 'Link-Localが重要', 'ブロードキャストではなくマルチキャスト'] },
      { title: '移行期', subtitle: '両方を見る', accent: 'amber', items: ['A/AAAA', 'デュアルスタック', '片方だけ失敗するケース'] },
    ],
    steps: [
      makeStep('dad', 'DADで重複を確認する', 'host', 'switch', 'NS', '端末は利用予定のIPv6アドレスが重複していないか確認します。', 'NDPはICMPv6を使います。', { sourceIp: '::', destinationIp: 'ff02::1:ffxx:xxxx', protocol: 'ICMPv6 NS' }),
      makeStep('ra', 'Router Advertisementを受ける', 'switch', 'router', 'RA', 'ルータはプレフィックスやデフォルトルータ情報を広告します。', 'RAによりSLAACの前提情報を得ます。', { sourceIp: 'fe80::1', destinationIp: 'ff02::1', protocol: 'ICMPv6 RA' }),
      makeStep('ipv6-traffic', 'IPv6でサーバへ通信する', 'router', 'server', 'IPv6', '設定後、IPv6アドレスを使ってサーバへ通信します。', 'DNSではAAAAレコードも確認します。', { sourceIp: '2001:db8:10::10', destinationIp: '2001:db8:20::20', protocol: 'TCP', port: '443' }),
    ],
  },
  {
    id: 'mail',
    order: 15,
    title: 'メール',
    description: 'SMTP配送、DNSレコード、SPF/DKIM/DMARCを図で見ます。',
    scope: 'メールが送信者のMTAから宛先ドメインのMXへ配送され、認証結果で判定される流れです。',
    nodes: [
      makeNode('mua', 'MUA', 'pc', '送信者', 10),
      makeNode('mta', '送信MTA', 'server', 'SMTP送信', 34),
      makeNode('dns', 'DNS', 'dns', 'MX/TXT', 58),
      makeNode('mx', '受信MX', 'server', '受信判定', 82),
    ],
    linkLabels: ['投稿', 'MX/TXT照会', 'SMTP配送'],
    keyFields: ['MX', 'SPF', 'DKIM-Signature', 'DMARC', 'Received'],
    observationPoints: ['メールヘッダ', 'DNS TXT', 'MTAログ', 'DMARCレポート'],
    compare: [
      { title: 'SMTP配送', subtitle: '送る経路', accent: 'teal', items: ['MUAからMTA', 'MXを引く', '受信MXへ配送'] },
      { title: 'SPF/DKIM', subtitle: '送信元確認', accent: 'indigo', items: ['SPFは送信元IP', 'DKIMは署名', 'どちらもDNSを見る'] },
      { title: 'DMARC', subtitle: '方針', accent: 'amber', items: ['SPF/DKIM結果を使う', 'Fromの整合性', 'reject/quarantine/none'] },
    ],
    steps: [
      makeStep('submit', 'MUAが送信MTAへ投稿する', 'mua', 'mta', 'SMTP', '利用者のメールソフトは送信MTAへメールを投稿します。', '投稿と配送を分けます。', { sourceIp: 'Client', destinationIp: 'MTA', protocol: 'SMTP Submission', port: '587' }),
      makeStep('dns-mx', '宛先ドメインのMX/TXTを確認する', 'mta', 'dns', 'DNS', '送信MTAは宛先MXを引き、SPF/DKIM/DMARCに関わるTXTも確認されます。', 'メールはDNS設定と強く結び付きます。', { sourceIp: 'MTA', destinationIp: 'DNS', protocol: 'DNS', port: '53' }),
      makeStep('deliver', '受信MXへ配送する', 'dns', 'mx', 'SMTP', '宛先MXへSMTPで配送され、認証結果やポリシーで判定されます。', '受信側ログとヘッダを見ます。', { sourceIp: 'MTA', destinationIp: 'MX', protocol: 'SMTP', port: '25' }),
    ],
  },
  {
    id: 'virtual-sdn-vxlan',
    order: 16,
    title: '仮想化・クラウド・SDN/VXLAN/EVPN',
    description: '物理と仮想、underlayとoverlayを図で分けます。',
    scope: '仮想ネットワークの通信がVTEPでVXLANにカプセル化され、物理ネットワーク上を運ばれる様子です。',
    nodes: [
      makeNode('vm-a', 'VM-A', 'server', '仮想端末', 10),
      makeNode('vtep-a', 'VTEP-A', 'router', 'カプセル化', 34),
      makeNode('underlay', 'Underlay', 'internet', 'IP到達性', 58),
      makeNode('vtep-b', 'VTEP-B', 'router', 'デカプセル化', 74),
      makeNode('vm-b', 'VM-B', 'server', '仮想端末', 90),
    ],
    linkLabels: ['Inner Ethernet', 'VXLAN', 'IP Fabric', 'Inner Ethernet'],
    keyFields: ['VNI', '内側MAC', '外側IP', 'UDP 4789', 'EVPN Route'],
    observationPoints: ['VTEP表', 'EVPN経路', 'underlay経路', 'VXLANキャプチャ'],
    compare: [
      { title: '物理', subtitle: 'underlay', accent: 'teal', items: ['IP到達性を作る', 'VTEP間をつなぐ', '障害時は物理経路を見る'] },
      { title: '仮想', subtitle: 'overlay', accent: 'indigo', items: ['VNIで論理網を分ける', '内側MACを運ぶ', 'テナントを分離'] },
      { title: '制御', subtitle: 'EVPN/SDN', accent: 'amber', items: ['到達性を配る', '制御プレーンを見る', '自動化設定の影響を確認'] },
    ],
    steps: [
      makeStep('inner-frame', 'VM-Aが内側Ethernetを送る', 'vm-a', 'vtep-a', 'Inner', 'VM-Aは同じ仮想ネットワーク宛てのEthernetフレームを送ります。', 'まず内側の通信を見ます。', { sourceMac: 'VM-A', destinationMac: 'VM-B', sourceIp: '10.1.1.10', destinationIp: '10.1.1.20', protocol: 'TCP' }),
      makeStep('vxlan', 'VTEPがVXLANで包む', 'vtep-a', 'underlay', 'VXLAN', 'VTEP-Aは内側フレームをVXLAN/UDP/IPでカプセル化します。', '内側ヘッダと外側ヘッダを分けて見ます。', { sourceIp: 'VTEP-A', destinationIp: 'VTEP-B', protocol: 'UDP/VXLAN', port: '4789' }),
      makeStep('decap', '対向VTEPで元に戻す', 'vtep-b', 'vm-b', 'Inner', 'VTEP-Bは外側ヘッダを外し、内側フレームをVM-Bへ渡します。', 'デカプセル化後は仮想ネットワーク内の通信として見ます。', { sourceMac: 'VM-A', destinationMac: 'VM-B', sourceIp: '10.1.1.10', destinationIp: '10.1.1.20', protocol: 'TCP' }),
    ],
  },
  {
    id: 'voip-qos-multicast',
    order: 17,
    title: 'VoIP・QoS・マルチキャスト',
    description: '音声制御、音声データ、品質制御、配信木を図で見ます。',
    scope: 'SIPで呼制御を行い、RTPで音声を運び、QoSやマルチキャストで品質や配信効率を扱います。',
    nodes: [
      makeNode('phone-a', '電話A', 'pc', '発信側', 10),
      makeNode('call', 'Call Server', 'server', 'SIP制御', 34),
      makeNode('wan', 'WAN', 'router', 'QoS制御', 58),
      makeNode('phone-b', '電話B', 'pc', '着信側', 82),
    ],
    linkLabels: ['SIP', 'QoS', 'RTP'],
    keyFields: ['SIP', 'RTP', 'DSCP', 'CoS', '遅延/ジッタ/損失'],
    observationPoints: ['SIPログ', 'RTP統計', 'QoSキュー', 'interface counters'],
    compare: [
      { title: 'SIP', subtitle: '呼制御', accent: 'teal', items: ['呼び出し、応答、切断', '制御通信', 'サーバ経由の場合がある'] },
      { title: 'RTP', subtitle: '音声データ', accent: 'indigo', items: ['実際の音声を運ぶ', '経路がSIPと違う場合', 'ジッタや損失を見る'] },
      { title: 'QoS', subtitle: '品質制御', accent: 'amber', items: ['DSCP/CoS', '優先制御', '帯域とキューを見る'] },
    ],
    steps: [
      makeStep('sip-invite', 'SIP INVITEを送る', 'phone-a', 'call', 'SIP', '電話AはCall Serverへ発呼要求を送ります。', '呼制御と音声データを分けます。', { sourceIp: 'Phone A', destinationIp: 'Call Server', protocol: 'SIP', port: '5060/5061' }),
      makeStep('qos-mark', 'WANでQoSを適用する', 'call', 'wan', 'DSCP', '音声系通信には優先制御のマーキングが使われます。', 'どこでマーキングし、どこでキュー制御するかを見ます。', { sourceIp: 'Phone A', destinationIp: 'Phone B', protocol: 'RTP', port: 'UDP dynamic' }),
      makeStep('rtp-media', 'RTPで音声を運ぶ', 'wan', 'phone-b', 'RTP', '呼が成立すると、音声データはRTPで相手へ届きます。', 'SIPとRTPの経路差に注意します。', { sourceIp: 'Phone A', destinationIp: 'Phone B', protocol: 'RTP', port: 'UDP dynamic' }),
    ],
  },
  {
    id: 'iot-lpwa-coap',
    order: 18,
    title: 'IoT・LPWA・CoAP',
    description: '軽量通信、低消費電力、CoAP/DTLSを図で見ます。',
    scope: '制約のあるIoT端末がゲートウェイ経由でクラウドへデータを送り、再送や保護をどう扱うかを見ます。',
    nodes: [
      makeNode('sensor', 'センサ', 'pc', '低消費電力', 10),
      makeNode('gw', 'IoT GW', 'router', '中継/変換', 34),
      makeNode('cloud', 'クラウド', 'server', 'API受信', 58),
      makeNode('app', '監視アプリ', 'server', '可視化', 82),
    ],
    linkLabels: ['LPWA等', 'CoAP/DTLS', 'API'],
    keyFields: ['CoAP Method', 'Message ID', 'Token', 'DTLS', 'ACK'],
    observationPoints: ['GWログ', '再送回数', '電波品質', 'クラウド受信ログ'],
    compare: [
      { title: 'LPWA', subtitle: '長距離/低消費電力', accent: 'teal', items: ['低速でも届く', '電池寿命を重視', '頻繁な通信に向かない'] },
      { title: 'CoAP', subtitle: '軽量HTTP風', accent: 'indigo', items: ['UDP上で動く', 'Confirmable/ACK', 'Message IDを見る'] },
      { title: 'DTLS', subtitle: 'UDP上の保護', accent: 'amber', items: ['暗号化と認証', '再接続コスト', '制約端末への影響'] },
    ],
    steps: [
      makeStep('sensor-gw', 'センサがデータを送る', 'sensor', 'gw', 'LPWA', 'センサは小さなデータを省電力でゲートウェイへ送ります。', '通信量と電力制約を意識します。', { sourceIp: 'Sensor', destinationIp: 'GW', protocol: 'LPWA' }),
      makeStep('coap-cloud', 'GWがCoAPでクラウドへ送る', 'gw', 'cloud', 'CoAP', 'GWはCoAP/DTLSなどでクラウドAPIへデータを送ります。', 'UDP上の軽量通信として見ます。', { sourceIp: 'GW', destinationIp: 'Cloud', protocol: 'CoAP/DTLS', port: 'UDP 5684' }),
      makeStep('ack-app', 'ACKと可視化へ進む', 'cloud', 'app', 'ACK/API', 'クラウドは受信結果を返し、監視アプリで可視化します。', '再送やACKの有無を観測します。', { sourceIp: 'Cloud', destinationIp: 'GW/App', protocol: 'CoAP ACK/API' }),
    ],
  },
  {
    id: 'ops-monitoring',
    order: 19,
    title: '運用監視・障害切分け',
    description: '監視点、ログ、SNMP、syslog、切分け順を図で見ます。',
    scope: '障害時に、どの観測点から確認し、どのレイヤの問題として切り分けるかを扱います。',
    nodes: [
      makeNode('nms', '監視サーバ', 'server', 'NMS', 10),
      makeNode('router', 'ルータ', 'router', '経路/IF', 34),
      makeNode('fw', 'FW', 'firewall', '許可/遮断', 58),
      makeNode('server', '業務サーバ', 'server', 'サービス', 82),
    ],
    linkLabels: ['SNMP/ping', 'syslog', 'サービス監視'],
    keyFields: ['ICMP', 'SNMP OID', 'syslog severity', 'flow', 'HTTP status'],
    observationPoints: ['監視アラート', '機器ログ', 'IF統計', 'アプリログ'],
    compare: [
      { title: '死活監視', subtitle: '到達できるか', accent: 'teal', items: ['ping', 'ポート監視', '経路障害の入口'] },
      { title: '状態監視', subtitle: '何が起きたか', accent: 'indigo', items: ['SNMP', 'CPU/IF/エラー', 'しきい値'] },
      { title: 'ログ', subtitle: '根拠を残す', accent: 'amber', items: ['syslog', 'FWログ', 'アプリログと時刻合わせ'] },
    ],
    steps: [
      makeStep('ping-router', '監視サーバが到達性を見る', 'nms', 'router', 'ICMP', 'まずネットワーク機器まで到達できるかを確認します。', 'L3到達性の入口として見ます。', { sourceIp: 'NMS', destinationIp: 'Router', protocol: 'ICMP' }),
      makeStep('fw-log', 'FWログで遮断有無を見る', 'router', 'fw', 'Log', '経路上のFWで許可/遮断ログを確認します。', '通信が止まる境界を探します。', { sourceIp: 'Client', destinationIp: 'Server', protocol: 'TCP', port: '443' }),
      makeStep('service-check', '業務サーバの応答を見る', 'fw', 'server', 'HTTP', 'ネットワークが通っていても、サービスが応答しているかを確認します。', 'ネットワークとアプリの切分けを行います。', { sourceIp: 'NMS', destinationIp: 'Server', protocol: 'HTTP', port: '200/500' }),
    ],
  },
  {
    id: 'afternoon-reading',
    order: 20,
    title: '午後問題総合読解',
    description: '構成図、条件、設問根拠、答案化を図でつなぎます。',
    scope: '午後問題の構成図を、通信経路、境界、条件、観測点、答案化の順に読むための総合図です。',
    nodes: [
      makeNode('client', '利用者', 'pc', '送信元', 10),
      makeNode('fw', 'FW', 'firewall', '境界', 34),
      makeNode('lb', 'LB', 'router', '中継', 58),
      makeNode('app', 'App', 'server', '業務', 74),
      makeNode('db', 'DB', 'server', '状態/データ', 90),
    ],
    linkLabels: ['条件1', '条件2', '条件3', '状態'],
    keyFields: ['問題文条件', '構成図の境界', '表の値', 'ログ', '設問の制約'],
    observationPoints: ['通信経路', '許可条件', '変更前後', '障害箇所', '答案根拠'],
    compare: [
      { title: '構成図', subtitle: '場所を読む', accent: 'teal', items: ['送信元と宛先', '境界と中継', '対象範囲を線で追う'] },
      { title: '条件', subtitle: '制約を読む', accent: 'indigo', items: ['FWルール', 'アドレス/ポート', '変更内容や前提'] },
      { title: '答案化', subtitle: '根拠を書く', accent: 'amber', items: ['図の位置', '条件文', '表やログの値を結び付ける'] },
    ],
    steps: [
      makeStep('mark-source', '送信元と宛先を決める', 'client', 'fw', '経路', '設問で問われている通信の送信元と宛先を最初に固定します。', '誰から誰への通信かを曖昧にしません。', { sourceIp: 'Client', destinationIp: 'App', protocol: '対象通信' }),
      makeStep('check-policy', '境界で条件を確認する', 'fw', 'lb', '許可条件', 'FWやLBなど、通過時に条件が変わる場所を確認します。', '通る線だけでなく、許可条件を見ます。', { sourceIp: 'Client', destinationIp: 'VIP', protocol: 'TCP', port: '443' }),
      makeStep('reach-app', 'アプリと状態を確認する', 'lb', 'app', '業務通信', 'LBの先にあるアプリやDBの状態まで追い、設問の根拠にします。', '構成図、条件、状態を答案へつなげます。', { sourceIp: 'LB', destinationIp: 'App', protocol: 'HTTP', port: '8080' }),
      makeStep('state-db', '状態を持つ場所を確認する', 'app', 'db', 'DB', '変更や障害の影響は、状態を持つ場所にも現れます。', '答案では影響範囲を具体的に書けるようにします。', { sourceIp: 'App', destinationIp: 'DB', protocol: 'SQL', port: 'DB port' }),
    ],
  },
]

export const textbookDiagramChapters: TextbookChapter[] = chapterSpecs.map(makeChapter)
