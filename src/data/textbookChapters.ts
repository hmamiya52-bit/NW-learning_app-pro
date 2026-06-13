export type TextbookChapterStatus = 'published' | 'draft'

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
  | SequenceDiagram
  | SegmentDiagram
  | PacketFrameDiagram
  | EncapsulationDiagram
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
  nodes: PacketFlowNode[]
  steps: PacketFlowStep[]
}

const layerOneThreeScenario: PacketFlowScenario = {
  id: 'pc-to-web-layer1-3',
  title: 'PCがWebサーバへアクセスするまで',
  description:
    '同じリンク内では[[green:MACアドレス]]を使って次の相手へ届けます。別ネットワークへ進む判断では[[blue:IPアドレス]]を見ます。この違いを、フレームとパケットの動きで追いかけます。',
  nodes: [
    {
      id: 'pc',
      label: 'PC',
      role: 'pc',
      hint: '利用者の端末。WebサーバへHTTPSでアクセスしたい。',
      x: 14,
      y: 52,
    },
    {
      id: 'switch',
      label: 'L2SW',
      role: 'switch',
      hint: '同じVLAN内で、宛先MACアドレスを見てフレームを転送する。',
      x: 37,
      y: 52,
    },
    {
      id: 'router',
      label: 'ルータ',
      role: 'router',
      hint: 'L2フレームを外し、IPパケットを見て別ネットワークへ転送する。',
      x: 62,
      y: 52,
    },
    {
      id: 'web',
      label: 'Webサーバ',
      role: 'server',
      hint: '最終的な通信相手。HTTPSの要求を受け取る。',
      x: 86,
      y: 52,
    },
  ],
  steps: [
    {
      id: 'arp-request-to-switch',
      title: 'まずデフォルトゲートウェイのMACアドレスを探す',
      from: 'pc',
      to: 'switch',
      packetLabel: 'ARP要求',
      explanation:
        'PCは、Webサーバが自分とは別ネットワークにいると判断します。最初の次ホップはデフォルトゲートウェイですが、同じLAN内でフレームを届けるには相手の[[green:MACアドレス]]が必要です。そのため、ARP要求をブロードキャストします。',
      deviceFocus:
        'PCは「192.168.1.1を持っている機器はいますか」と同じLAN全体へ聞いています。',
      headerFocus: {
        sourceMac: '00:11:22:33:44:55',
        destinationMac: 'ff:ff:ff:ff:ff:ff',
        sourceIp: '192.168.1.10',
        destinationIp: '192.168.1.1',
        protocol: 'ARP',
      },
    },
    {
      id: 'arp-request-to-router',
      title: 'L2SWはARP要求を同じVLAN内へ広げる',
      from: 'switch',
      to: 'router',
      packetLabel: 'ARP要求',
      explanation:
        'ARP要求の宛先MACアドレスはブロードキャストです。L2SWは、同じVLANに属するポートへフレームを転送します。この時点でL2SWが見ている中心は[[green:MACアドレス]]です。',
      deviceFocus:
        'L2SWはIPアドレスで経路選択しているわけではありません。同じVLAN内でL2フレームを転送しています。',
      headerFocus: {
        sourceMac: '00:11:22:33:44:55',
        destinationMac: 'ff:ff:ff:ff:ff:ff',
        sourceIp: '192.168.1.10',
        destinationIp: '192.168.1.1',
        protocol: 'ARP',
      },
    },
    {
      id: 'arp-reply-to-switch',
      title: 'ルータが自分のMACアドレスを返す',
      from: 'router',
      to: 'switch',
      packetLabel: 'ARP応答',
      explanation:
        'ルータは「192.168.1.1は自分です」と応答します。これでPCは、別ネットワークへ進む最初の一歩を、どの[[green:MACアドレス]]宛てに送ればよいか分かります。',
      deviceFocus:
        'ルータはデフォルトゲートウェイとして、同じLAN側インタフェースのMACアドレスを返しています。',
      headerFocus: {
        sourceMac: 'aa:aa:aa:aa:aa:01',
        destinationMac: '00:11:22:33:44:55',
        sourceIp: '192.168.1.1',
        destinationIp: '192.168.1.10',
        protocol: 'ARP',
      },
    },
    {
      id: 'arp-reply-to-pc',
      title: 'PCはルータのMACアドレスを覚える',
      from: 'switch',
      to: 'pc',
      packetLabel: 'ARP応答',
      explanation:
        'L2SWはPCへARP応答を転送します。PCのARPテーブルには、デフォルトゲートウェイの[[blue:IPアドレス]]と[[green:MACアドレス]]の対応が入ります。',
      deviceFocus:
        '次からPCは、ルータ宛てのEthernetフレームを作れるようになります。',
      headerFocus: {
        sourceMac: 'aa:aa:aa:aa:aa:01',
        destinationMac: '00:11:22:33:44:55',
        sourceIp: '192.168.1.1',
        destinationIp: '192.168.1.10',
        protocol: 'ARP',
      },
    },
    {
      id: 'tcp-to-switch',
      title: 'Webサーバ宛てのIPパケットを、ルータ宛てのフレームに入れる',
      from: 'pc',
      to: 'switch',
      packetLabel: 'TCP SYN',
      explanation:
        'ここが重要です。[[blue:IPの宛先はWebサーバ]]ですが、[[green:Ethernetフレームの宛先MACアドレスはルータ]]です。最終目的地と次ホップは別の情報として扱います。',
      deviceFocus:
        'PCは「最終目的地はWebサーバ、次の一歩はルータ」と分けて考えています。',
      headerFocus: {
        sourceMac: '00:11:22:33:44:55',
        destinationMac: 'aa:aa:aa:aa:aa:01',
        sourceIp: '192.168.1.10',
        destinationIp: '203.0.113.20',
        protocol: 'TCP',
        port: '443',
      },
    },
    {
      id: 'tcp-to-router',
      title: 'L2SWは宛先MACアドレスを見てルータ側へ転送する',
      from: 'switch',
      to: 'router',
      packetLabel: 'TCP SYN',
      explanation:
        'L2SWはフレームの[[green:宛先MACアドレス]]を見て、ルータが接続されているポートへ転送します。中に入っているIPパケットの宛先IPアドレスで経路選択しているわけではありません。',
      deviceFocus:
        'L2SWの判断材料は、MACアドレステーブルとフレームの宛先MACアドレスです。',
      headerFocus: {
        sourceMac: '00:11:22:33:44:55',
        destinationMac: 'aa:aa:aa:aa:aa:01',
        sourceIp: '192.168.1.10',
        destinationIp: '203.0.113.20',
        protocol: 'TCP',
        port: '443',
      },
    },
    {
      id: 'router-to-web',
      title: 'ルータはIPを見て、次のリンク用のL2フレームを作る',
      from: 'router',
      to: 'web',
      packetLabel: 'TCP SYN',
      explanation:
        'ルータは受け取ったL2フレームを外し、中のIPパケットを見ます。[[blue:宛先IPアドレス]]で次の転送先を決めたら、次のリンクで使う[[green:新しいL2フレーム]]に入れ直して送ります。',
      deviceFocus:
        'ルータはL2をデカプセル化し、IPで経路判断し、次のリンク用に再カプセル化します。',
      headerFocus: {
        sourceMac: 'bb:bb:bb:bb:bb:01',
        destinationMac: 'cc:cc:cc:cc:cc:20',
        sourceIp: '192.168.1.10',
        destinationIp: '203.0.113.20',
        protocol: 'TCP',
        port: '443',
      },
    },
    {
      id: 'web-response',
      title: '戻りの通信も、区間ごとに次の一歩へ運ばれる',
      from: 'web',
      to: 'router',
      packetLabel: '応答データ',
      explanation:
        'WebサーバからPCへ戻る通信でも考え方は同じです。[[blue:IPの宛先はPC]]ですが、各リンクでは次の機器へ届けるための[[green:MACアドレス]]が使われます。',
      deviceFocus:
        '戻り方向でも、L3の最終宛先とL2の次ホップを分けて見ます。',
      headerFocus: {
        sourceMac: 'cc:cc:cc:cc:cc:20',
        destinationMac: 'bb:bb:bb:bb:bb:01',
        sourceIp: '203.0.113.20',
        destinationIp: '192.168.1.10',
        protocol: 'TCP/TLS',
        port: '443',
      },
    },
  ],
}

const layerOneThreeChapter: TextbookChapter = {
  id: 'layer1-3',
  order: 1,
  title: 'OSI参照モデルと通信の全体像',
  description: 'OSI参照モデル、カプセル化、機器ごとの見方から、通信全体の流れを順番に学ぶ章です',
  status: 'published',
  estimatedMinutes: 32,
  intro: [
    'ネットワークを学び始めたときに一番つまずきやすいのは、「いま何の話をしているのか」が途中で分からなくなることです。MACアドレス、IPアドレス、ポート番号、フレーム、パケット、セグメントが一度に出てくると、全部が同じような言葉に見えてしまいます。',
    'この章では、最初に[[blue:OSI参照モデル]]を地図として置き、その上で[[amber:カプセル化]]、[[green:L2の転送]]、[[blue:L3の転送]]を順番に見ます。用語を丸暗記する前に、通信がどの層で、どの情報を使って進むのかをつかみましょう。',
    'ネスペ午後問題でも実務の障害切り分けでも、基本の見方は同じです。「同じLAN内の話か」「ルータを越える話か」「どのヘッダを見て判断しているか」を分けて読めると、構成図がただの絵ではなく、通信の地図として見えてきます。',
  ],
  sections: [
    {
      heading: 'OSI参照モデルは通信を見るための地図',
      body: [
        'OSI参照モデルは、通信を7つの層に分けて考えるためのモデルです。最初から7層すべてを細かく覚えようとすると苦しくなりますが、[[blue:通信を分解して見るための地図]]だと考えると役に立ちます。',
        'この章で特に大事なのは、[[green:L2]]、[[blue:L3]]、[[amber:L4]]の境目です。L2は同じリンク内でフレームを届ける層、L3はIPアドレスを使ってネットワーク間を届ける層、L4は端末同士の通信をポート番号などで整理する層です。',
        'Webページを見るとき、利用者からは「PCがWebサーバにアクセスした」だけに見えます。けれども中では、アプリケーションのデータが下の層へ渡され、各層のヘッダを付けられながら、スイッチやルータを通って進みます。',
      ],
      diagrams: [
        {
          type: 'layer-stack',
          title: 'OSI参照モデルを通信の地図として見る',
          description:
            'この図は、各層がどの範囲の問題を扱うかを示しています。まずは[[green:L2]]、[[blue:L3]]、[[amber:L4]]の境目に注目してください。',
          points: [
            'L2は同じリンク、または同じVLAN内でフレームを届けます。',
            'L3はIPアドレスを見て、別ネットワークへ進む道を選びます。',
            'L4はTCP/UDPとポート番号で、端末上のどの通信かを識別します。',
          ],
          layers: [
            {
              label: 'L7',
              title: 'アプリケーション層',
              description: 'HTTPやDNSなど、利用者に近い通信の意味を扱う',
              example: 'HTTP, DNS, SMTP',
              color: 'amber',
            },
            {
              label: 'L4',
              title: 'トランスポート層',
              description: '端末同士の通信を、TCP/UDPとポート番号で整理する',
              example: 'TCP, UDP, ポート番号',
              color: 'amber',
            },
            {
              label: 'L3',
              title: 'ネットワーク層',
              description: 'IPアドレスを使い、別ネットワークへ進む経路を選ぶ',
              example: 'IP, ルーティング, ルータ',
              color: 'blue',
            },
            {
              label: 'L2',
              title: 'データリンク層',
              description: '同じリンク内で、MACアドレスを使ってフレームを届ける',
              example: 'Ethernet, MACアドレス, L2SW, VLAN, ARP',
              color: 'green',
            },
            {
              label: 'L1',
              title: '物理層',
              description: 'ビット列を電気信号、光、電波として運ぶ',
              example: 'LANケーブル, 光ファイバ, 無線の物理信号',
              color: 'blue',
            },
          ],
        },
      ],
    },
    {
      heading: 'データは下のレイヤへ渡されるたびに包まれる',
      body: [
        '送信側の端末では、アプリケーションのデータがそのまま線に流れるわけではありません。上位層のデータは、下位層へ渡されるたびに、その層で必要な情報を付け加えられます。この処理を[[amber:カプセル化]]と呼びます。',
        'たとえばHTTPS通信なら、アプリケーションのデータにTCPヘッダが付き、[[amber:TCPセグメント]]になります。そこへIPヘッダが付くと[[blue:IPパケット]]になり、最後にEthernetヘッダとFCSが付くと[[green:Ethernetフレーム]]になります。',
        'ルータを通るときは、この入れ子構造が重要です。ルータは受信したL2フレームをいったん外し、中のIPパケットを見て次の経路を決めます。そして、次のリンクで使う新しいL2フレームに入れ直して送り出します。',
      ],
      diagrams: [
        {
          type: 'encapsulation-flow',
          title: 'データがヘッダで包まれていく流れ',
          description:
            'この図は、アプリケーションデータにL4、L3、L2の情報が順に付いていく様子を表しています。外側ほど、その区間で運ぶための情報になります。',
          points: [
            'L4ではポート番号などが付き、TCPセグメントまたはUDPデータグラムとして扱われます。',
            'L3では送信元IPアドレスと宛先IPアドレスが付き、IPパケットになります。',
            'L2では送信元MACアドレスと宛先MACアドレスが付き、リンク上を流れるフレームになります。',
          ],
          stages: [
            {
              label: '1',
              title: 'アプリケーションデータ',
              description: 'HTTPリクエストなど、アプリケーションが送りたい中身。',
              parts: [{ label: 'データ', accent: 'slate' }],
            },
            {
              label: '2',
              title: 'L4で包む',
              description: 'TCPならポート番号やシーケンス番号を付ける。',
              parts: [
                { label: 'TCPヘッダ', accent: 'amber' },
                { label: 'データ', accent: 'slate' },
              ],
            },
            {
              label: '3',
              title: 'L3で包む',
              description: 'IPアドレスを付け、最終的な宛先を示す。',
              parts: [
                { label: 'IPヘッダ', accent: 'blue' },
                { label: 'TCP', accent: 'amber' },
                { label: 'データ', accent: 'slate' },
              ],
            },
            {
              label: '4',
              title: 'L2で包む',
              description: '次ホップへ届けるためのMACアドレスを付ける。',
              parts: [
                { label: 'Ethernetヘッダ', accent: 'emerald' },
                { label: 'IP', accent: 'blue' },
                { label: 'TCP', accent: 'amber' },
                { label: 'データ', accent: 'slate' },
                { label: 'FCS', accent: 'emerald' },
              ],
            },
          ],
          routeNotes: [
            {
              title: 'ルータで起きること',
              body: 'ルータはL2フレームを外し、IPヘッダを見て転送先を決めます。その後、次のリンク用のL2フレームを新しく作ります。',
              accent: 'blue',
            },
            {
              title: 'ここを混同しない',
              body: '別ネットワークへ行く通信でも、リンク上を流れるときは必ずそのリンクで使うL2フレームに入っています。',
              accent: 'emerald',
            },
          ],
        },
      ],
    },
    {
      heading: 'クライアント、ネットワーク、サーバは同じデータを違う見方で扱う',
      body: [
        'PCからWebサーバへアクセスするとき、同じ通信でも、機器によって見ている情報は違います。PCはアプリケーションの要求を作り、宛先IPアドレスと次に渡す相手を決めます。',
        'L2SWは、フレームの宛先MACアドレスを見て、どのポートへ出すかを決めます。ここでL2SWが中心に見ているのはL2の情報であり、IPアドレスで経路を選んでいるわけではありません。',
        'ルータは受け取ったフレームからL2ヘッダを外し、IPパケットの宛先IPアドレスを見て、次のネットワークへ転送します。サーバは最終的に受け取ったデータを、HTTPなどのアプリケーションとして処理します。',
      ],
      diagrams: [
        {
          type: 'network-flow',
          title: '同じ通信を機器ごとの見方で追う',
          description:
            'この図は、PCからWebサーバへ向かう通信を、機器ごとの判断材料で見たものです。どの区間でもL2フレームで運ばれますが、中に入っているIPパケットが最終宛先を示します。',
          points: [
            'PCは宛先IPを見て、次ホップがデフォルトゲートウェイだと判断します。',
            'L2SWは宛先MACアドレスを見て、同じVLAN内でフレームを転送します。',
            'ルータはIPヘッダを見て、次のネットワークへ進む経路を選びます。',
          ],
          nodes: [
            { id: 'pc', label: 'PC', caption: '要求を作る端末', role: 'pc' },
            { id: 'switch', label: 'L2SW', caption: 'MACアドレスで転送', role: 'switch' },
            { id: 'router', label: 'ルータ', caption: 'IPアドレスで経路選択', role: 'router' },
            { id: 'web', label: 'Webサーバ', caption: '要求を処理する端末', role: 'server' },
          ],
          links: [
            { from: 'pc', to: 'switch', label: 'L2フレーム' },
            { from: 'switch', to: 'router', label: 'L2フレーム' },
            { from: 'router', to: 'web', label: '新しいL2フレーム' },
          ],
        },
      ],
    },
    {
      heading: 'MACアドレス、IPアドレス、ポート番号の役割',
      body: [
        'MACアドレス、IPアドレス、ポート番号は、どれも通信相手を識別する情報です。ただし、見ている範囲が違います。ここを分けられると、フレームとパケットの話もかなり整理されます。',
        '[[green:MACアドレス]]は、同じリンク上で次に渡す相手を示します。[[blue:IPアドレス]]は、最終的な端末を示します。[[amber:ポート番号]]は、その端末の中でどのアプリケーションの通信かを示します。',
        '別ネットワーク上のWebサーバへ通信する場合、宛先IPアドレスはWebサーバのままです。一方、PCが最初に送るEthernetフレームの宛先MACアドレスは、Webサーバではなくデフォルトゲートウェイになります。',
      ],
      diagrams: [
        {
          type: 'packet-frame',
          title: 'フレーム、パケット、セグメントの入れ子',
          description:
            'この図は、HTTPS通信を例に、L2、L3、L4の情報がどの位置に入るかを示しています。外側のL2はリンクごとに変わり、内側のIPは最終宛先を示します。',
          points: [
            'Ethernetフレームの宛先MACアドレスは、次ホップを指します。',
            'IPパケットの宛先IPアドレスは、最終的な宛先端末を指します。',
            'TCPセグメントの宛先ポート番号は、端末上のアプリケーションを指します。',
          ],
          layers: [
            {
              title: 'Ethernetフレーム（L2）',
              subtitle: '同じリンク上で次ホップへ届ける外側の箱',
              accent: 'emerald',
              fields: ['宛先MAC', '送信元MAC', 'タイプ', '中身: IPパケット', 'FCS'],
            },
            {
              title: 'IPパケット（L3）',
              subtitle: '最終的な送信元と宛先を示す内側の箱',
              accent: 'blue',
              fields: ['送信元IP', '宛先IP', 'TTL', '中身: TCPセグメント'],
            },
            {
              title: 'TCPセグメント（L4）',
              subtitle: 'アプリケーション間の通信を識別するさらに内側の情報',
              accent: 'amber',
              fields: ['送信元ポート', '宛先ポート', 'シーケンス番号', 'データ'],
            },
          ],
          notes: [
            {
              title: 'MACアドレス',
              body: '同じリンク上の次の相手を示します。ルータを越えると、次のリンク用に付け替えられます。',
              accent: 'emerald',
            },
            {
              title: 'IPアドレス',
              body: '最終的な端末を示します。ルータはこの情報を見て、次の転送先を決めます。',
              accent: 'blue',
            },
            {
              title: 'ポート番号',
              body: '端末の中のどのアプリケーションに渡すかを示します。HTTPSなら宛先ポート443が典型です。',
              accent: 'amber',
            },
            {
              title: '午後問題での見方',
              body: '設問が「どの機器が何を見たか」を聞いているときは、まずL2、L3、L4のどの情報かを切り分けます。',
              accent: 'slate',
            },
          ],
        },
      ],
    },
    {
      heading: 'ARPはL2フレームを作るために必要になる',
      body: [
        'ARPは、IPv4アドレスからMACアドレスを調べるためのプロトコルです。ただし、ここで大事なのは定義の暗記ではありません。ARPは[[green:Ethernetフレームを作るために必要な前処理]]です。',
        '同じLAN内へフレームを送るには、宛先MACアドレスが必要です。PCがデフォルトゲートウェイへフレームを送りたいなら、まずデフォルトゲートウェイのIPアドレスに対応するMACアドレスを知る必要があります。',
        'Webサーバが別ネットワークにいる場合、PCがARPで調べるのはWebサーバのMACアドレスではありません。PCと同じLAN内にいる[[amber:デフォルトゲートウェイのMACアドレス]]を調べます。',
      ],
      diagrams: [
        {
          type: 'sequence',
          title: 'ARPでデフォルトゲートウェイのMACアドレスを調べる',
          description:
            'この図は、PCが別ネットワーク宛ての通信を始める前に、同じLAN内のデフォルトゲートウェイを探す流れです。',
          points: [
            'ARP要求はブロードキャストとして、同じVLAN内に届きます。',
            '該当するIPアドレスを持つ機器が、自分のMACアドレスをARP応答で返します。',
            'PCは得られた対応をARPテーブルに保存し、そのMACアドレス宛てにフレームを作ります。',
          ],
          steps: [
            {
              label: '1',
              title: 'PCが次ホップを決める',
              body: '宛先IPアドレスが自分のネットワーク外なので、PCは次ホップをデフォルトゲートウェイにします。',
            },
            {
              label: '2',
              title: 'ARP要求をブロードキャストする',
              body: 'PCは「192.168.1.1を持つ機器はMACアドレスを教えてください」と同じLAN内に問い合わせます。',
            },
            {
              label: '3',
              title: 'ルータがARP応答を返す',
              body: 'デフォルトゲートウェイであるルータが、自分のLAN側インタフェースのMACアドレスを返します。',
            },
            {
              label: '4',
              title: 'PCがL2フレームを作れるようになる',
              body: 'PCはWebサーバ宛てのIPパケットを、デフォルトゲートウェイ宛てのEthernetフレームに入れて送ります。',
            },
          ],
        },
      ],
      callouts: [
        {
          type: 'pitfall',
          title: '別ネットワーク宛てでWebサーバのMACアドレスは使わない',
          body: [
            'PCが最初に必要とするのは、同じLAN内で次に渡す相手のMACアドレスです。Webサーバが別ネットワークにいるなら、最初の宛先MACアドレスはWebサーバではなくデフォルトゲートウェイです。',
          ],
        },
      ],
    },
    {
      heading: '動く図解: PCからWebサーバへ届くまで',
      body: [
        'ここまでの内容を、PCからWebサーバへアクセスする一連の流れとして見てみましょう。文字だけで理解しようとすると、L2とL3の話が混ざりやすいところです。',
        '見るポイントは、各ステップで「どの機器が」「どのヘッダを見て」「何を判断しているか」です。[[blue:IPアドレスは最終的な端末]]を示し、[[green:MACアドレスは次のリンク上の相手]]を示します。',
        '再生しながら、ARP要求、ARP応答、TCP通信の開始、ルータでのL2付け替えを順に追ってください。通信は一直線に飛ぶのではなく、区間ごとにL2フレームとして運ばれます。',
      ],
      diagrams: [
        {
          type: 'interactive-flow',
          title: '動く図解',
          description:
            'ARPで次の一歩を調べてから、Webサーバ宛ての通信が進む様子を追えます。ステップごとの説明とヘッダの注目点を合わせて見てください。',
          points: [
            'ARPは[[amber:デフォルトゲートウェイのMACアドレス]]を知るために使われます。',
            'L2SWは[[green:宛先MACアドレス]]を見てフレームを転送します。',
            'ルータは[[blue:宛先IPアドレス]]を見て経路を選び、次のリンク用のL2フレームを作ります。',
          ],
          scenario: layerOneThreeScenario,
        },
      ],
    },
    {
      heading: 'VLANとブロードキャストドメイン',
      body: [
        'VLANは、L2の範囲を論理的に分ける仕組みです。物理的には同じスイッチにつながっていても、VLANが違えば同じブロードキャストドメインではありません。',
        'ARP要求のようなブロードキャストは、原則として同じVLAN内にだけ届きます。VLAN 10のPCがVLAN 20のサーバと通信したい場合は、ルータやL3SWによる[[blue:L3の中継]]が必要です。',
        'ネスペ午後では、VLAN ID、アクセスポート、トランクポート、L3SWがよく一緒に出ます。まずは、[[green:VLANはL2の届く範囲を分けるもの]]、[[blue:VLAN間通信はL3の話]]と切り分けましょう。',
      ],
      diagrams: [
        {
          type: 'segment',
          title: 'VLANでブロードキャストドメインを分ける',
          description:
            'この図は、同じ物理スイッチ上でもVLANが違うとブロードキャストが届く範囲が分かれることを表しています。',
          points: [
            'VLAN 10のARP要求は、VLAN 10内にだけ広がります。',
            'VLAN 20へ通信するには、ルータまたはL3SWでL3転送が必要です。',
            'トランクポートでは、複数のVLANを識別するためにVLANタグを使います。',
          ],
          domains: [
            {
              title: 'VLAN 10',
              description: '業務PC用セグメント。ARPやブロードキャストはこの範囲に閉じる。',
              accent: 'sky',
              members: ['PC-A', 'PC-B', 'プリンタ'],
            },
            {
              title: 'L3SW / ルータ',
              description: 'VLAN間通信を中継する境目。ここからL3の判断になる。',
              accent: 'emerald',
              members: ['SVI', 'デフォルトゲートウェイ', '経路表'],
            },
            {
              title: 'VLAN 20',
              description: 'サーバ用セグメント。VLAN 10とは別のブロードキャストドメイン。',
              accent: 'rose',
              members: ['Webサーバ', 'DBサーバ', '監視サーバ'],
            },
          ],
        },
      ],
    },
    {
      heading: 'ネスペ午後では構成図の境目を読む',
      body: [
        '午後問題の構成図は、機器が並んでいるだけの絵ではありません。どこまでが同じL2の範囲か、どこでL3の判断が入るか、どこまでブロードキャストが届くかを読み取るための地図です。',
        '「同一セグメント」「VLAN」「デフォルトゲートウェイ」「L2SW」「ルータ」「L3SW」という語が出てきたら、まず同じLAN内の話なのか、別ネットワークへ進む話なのかを切り分けます。',
        '実務の障害対応でも同じです。PCからデフォルトゲートウェイへ届くのか、名前解決はできているのか、ルータを越えた先で詰まっているのか。L2、L3、L4を分けて見るだけで、調査の順番が落ち着きます。',
      ],
      diagrams: [
        {
          type: 'sequence',
          title: '構成図を読むときの順番',
          description:
            '午後問題では、いきなり設問の答えを探すより、まず通信がどの境目を越えるかを整理すると読みやすくなります。',
          points: [
            '最初に、送信元と宛先が同じネットワークかを確認します。',
            '次に、同じVLAN内で完結するのか、デフォルトゲートウェイへ進むのかを見ます。',
            '最後に、どの機器がどのヘッダを見て判断するかを設問に合わせて説明します。',
          ],
          steps: [
            {
              label: '1',
              title: 'IPアドレスとサブネットを確認する',
              body: '送信元と宛先が同じネットワークにいるかを見ます。ここで、同一LAN内の通信か、ルータを越える通信かの大枠が決まります。',
            },
            {
              label: '2',
              title: 'VLANとL2の範囲を見る',
              body: '同じスイッチにつながっていても、VLANが違えば別のブロードキャストドメインです。ARPがどこまで届くかを確認します。',
            },
            {
              label: '3',
              title: 'デフォルトゲートウェイを探す',
              body: '別ネットワーク宛てなら、最初の次ホップはデフォルトゲートウェイです。PCが最初に作るL2フレームの宛先MACにも関わります。',
            },
            {
              label: '4',
              title: '機器ごとの判断材料を書く',
              body: 'L2SWはMACアドレス、ルータやL3SWはIPアドレス、端末はポート番号やアプリケーションの情報も見ます。設問ではこの切り分けを言葉にします。',
            },
          ],
        },
      ],
    },
  ],
  examFocus: [
    'L2SWは[[green:MACアドレス]]、ルータやL3SWは[[blue:IPアドレス]]を主な判断材料にする、と説明できる',
    '別ネットワーク宛ての通信で、PCが最初に使う[[green:宛先MACアドレス]]がデフォルトゲートウェイになる理由を説明できる',
    'VLANによって[[green:ブロードキャストドメイン]]が分かれ、VLAN間通信には[[blue:L3転送]]が必要だと読める',
  ],
  practicalFocus: [
    '障害切り分けでは、同一LAN内で届かないのか、デフォルトゲートウェイを越えた先で詰まっているのかを分けて見る',
    'パケットキャプチャを見るときは、Ethernet、IP、TCP/UDPのどのヘッダを見ているかを意識する',
    '構成図を読むときは、物理的な配線だけでなく、VLANやサブネットによる論理的な境目を見る',
  ],
  pitfalls: [
    'IPアドレスが分かれば、そのまま相手へ送れると思ってしまう',
    '別ネットワーク宛てなのに、最初の宛先MACアドレスをWebサーバのMACアドレスだと考えてしまう',
    '同じスイッチにつながっていれば、必ず同じブロードキャストドメインだと思ってしまう',
  ],
  summary: [
    'OSI参照モデルは、通信を層に分けて見るための[[blue:地図]]です。',
    '送信側では、データにL4、L3、L2の情報が順に付く[[amber:カプセル化]]が行われます。',
    '[[green:MACアドレス]]は次のリンク上の相手、[[blue:IPアドレス]]は最終的な端末、[[amber:ポート番号]]は端末上のアプリケーションを識別します。',
    'ARPは、同じLAN内でL2フレームを作るために必要なMACアドレスを調べる仕組みです。',
    'VLANはL2の届く範囲を分け、VLAN間通信はL3の中継として考えます。',
  ],
}

function draftChapter(
  id: string,
  order: number,
  title: string,
  description: string,
): TextbookChapter {
  return {
    id,
    order,
    title,
    description,
    status: 'draft',
    estimatedMinutes: 0,
    intro: [],
    sections: [],
    examFocus: [],
    practicalFocus: [],
    pitfalls: [],
    summary: [],
  }
}

export const textbookChapters: TextbookChapter[] = [
  layerOneThreeChapter,
  draftChapter('layer4-7', 2, 'レイヤ4,7基礎', 'TCP/UDP、HTTP、セッション、アプリケーション通信を流れで理解する'),
  draftChapter('firewall', 3, 'ファイアウォール', '通信を許可・遮断する考え方と、FW/IDS/IPS/WAFの役割を整理する'),
  draftChapter('wireless', 4, '無線LAN', '電波、認証、暗号化、WLC、ローミングを初学者向けに結び直す'),
  draftChapter('routing', 5, 'ルーティング', 'RIP、OSPF、BGPを、経路を選ぶ仕組みとして理解する'),
  draftChapter('vrrp', 6, 'VRRP', 'デフォルトゲートウェイ冗長化の動きと切替時の見方を学ぶ'),
  draftChapter('wan', 7, 'WAN', '拠点間接続、IP-VPN、広域イーサネット、SD-WANの違いを整理する'),
  draftChapter('load-balancer', 8, '負荷分散装置（LB）', 'リクエストを複数サーバへ分ける仕組みとセッション維持を理解する'),
  draftChapter('dhcp', 9, 'DHCP', 'IPアドレス払い出しの流れ、リレー、スヌーピングを動きで理解する'),
  draftChapter('dns', 10, 'DNS', '名前解決の流れ、キャッシュ、ゾーン、主要レコードを読む'),
  draftChapter('mail', 11, 'メール', 'SMTP、POP3、IMAP4、SPF、DKIMの役割を配送の流れで理解する'),
  draftChapter('voip', 12, '音声とVoIP', 'SIP、RTP、呼制御、音声品質を通信の流れとして見る'),
  draftChapter('ipsec', 13, 'IPsecとGRE', 'VPNトンネル、IKE、ESP、GRE over IPsecを順番に理解する'),
  draftChapter('sdn', 14, 'SDN', '制御と転送を分ける考え方、OpenFlow、OFC/OFSを学ぶ'),
  draftChapter('ssl-tls', 15, 'SSL/TLS・PKI', '証明書、認証局、TLSハンドシェイク、暗号化の流れを理解する'),
  draftChapter('security', 16, 'セキュリティ', '認証、認可、標的型攻撃、SSO、VPNの考え方を整理する'),
  draftChapter('threat', 17, '脅威・攻撃手法', 'DDoS、SYNフラッド、ARPスプーフィングなどを通信の弱点から見る'),
  draftChapter('ipv6', 18, 'IPv6', 'IPv6アドレス、NDP、SLAAC、移行技術をIPv4との違いで理解する'),
  draftChapter('proxy', 19, 'プロキシサーバ', '代理通信、PAC、CONNECT、HTTPS復号の動きを理解する'),
  draftChapter('network-mgmt', 20, 'ネットワーク管理', 'ping、syslog、SNMP、監視、障害切り分けの考え方を学ぶ'),
]

export function getTextbookChapter(chapterId: string | undefined): TextbookChapter | undefined {
  if (!chapterId) return undefined
  return textbookChapters.find((chapter) => chapter.id === chapterId)
}

export function getPublishedTextbookChapters(): TextbookChapter[] {
  return textbookChapters.filter((chapter) => chapter.status === 'published')
}
