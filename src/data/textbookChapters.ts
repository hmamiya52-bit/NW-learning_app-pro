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
    '同じLAN内の一歩目はMACアドレスで進み、別ネットワークへの判断はIPアドレスで進む。この違いを、パケットの動きとして追いかけます。',
  nodes: [
    {
      id: 'pc',
      label: 'PC',
      role: 'pc',
      hint: '利用者の端末。Webサーバへアクセスしたい。',
      x: 14,
      y: 52,
    },
    {
      id: 'switch',
      label: 'L2SW',
      role: 'switch',
      hint: '同じLAN内で、宛先MACアドレスを見てフレームを転送する。',
      x: 37,
      y: 52,
    },
    {
      id: 'router',
      label: 'ルータ',
      role: 'router',
      hint: '別ネットワークへ向かう入口。宛先IPアドレスを見て次へ送る。',
      x: 62,
      y: 52,
    },
    {
      id: 'web',
      label: 'Webサーバ',
      role: 'server',
      hint: '最終目的地。HTTPのリクエストを受け取る。',
      x: 86,
      y: 52,
    },
  ],
  steps: [
    {
      id: 'arp-request-to-switch',
      title: 'まずはデフォルトゲートウェイのMACアドレスを探す',
      from: 'pc',
      to: 'switch',
      packetLabel: 'ARP要求',
      explanation:
        'PCはWebサーバが別ネットワークにいると判断し、最初の送り先をデフォルトゲートウェイに決めます。ただし、同じLAN内で届けるにはルータのMACアドレスが必要なので、ARP要求をブロードキャストします。',
      deviceFocus: 'PCは「192.168.1.1を持っている機器は誰ですか」と同じLAN全体へ聞いている。',
      headerFocus: {
        destinationMac: 'ff:ff:ff:ff:ff:ff',
        sourceIp: '192.168.1.10',
        destinationIp: '192.168.1.1',
        protocol: 'ARP',
      },
    },
    {
      id: 'arp-request-to-router',
      title: 'L2SWはブロードキャストを同じLANへ広げる',
      from: 'switch',
      to: 'router',
      packetLabel: 'ARP要求',
      explanation:
        'L2SWはARP要求の宛先MACアドレスがブロードキャストであることを見て、同じVLAN内のポートへ広げます。この時点では、L2SWはIPアドレスでルーティングしているわけではありません。',
      deviceFocus: 'L2SWが見ている主役はMACアドレス。IPの経路判断はしていない。',
      headerFocus: {
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
        'ルータは「192.168.1.1は自分です」と応答します。これでPCは、別ネットワークへ向かう最初の一歩をどのMACアドレス宛てに送ればよいか分かります。',
      deviceFocus: 'ルータはデフォルトゲートウェイとして、同じLAN側インタフェースのMACアドレスを返す。',
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
        'L2SWはPC側へARP応答を転送します。PCのARPテーブルには、デフォルトゲートウェイのIPアドレスとMACアドレスの対応が入ります。',
      deviceFocus: '次からPCはルータ宛てにフレームを送れる。',
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
      title: 'Webサーバ宛てのIPパケットを、ルータ宛てフレームに入れる',
      from: 'pc',
      to: 'switch',
      packetLabel: 'TCP SYN',
      explanation:
        'ここが初学者の山場です。IPの宛先はWebサーバのままですが、イーサネットフレームの宛先MACアドレスはルータになります。遠くの目的地と、次の一歩の相手は別です。',
      deviceFocus: 'PCは「最終目的地はWebサーバ、次の一歩はルータ」と考えている。',
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
        'L2SWはフレームの宛先MACアドレスを見て、ルータが接続されているポートへ転送します。ここでも、L2SWが見ている中心はMACアドレスです。',
      deviceFocus: 'L2SWの判断材料は宛先MACアドレス。',
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
      title: 'ルータは宛先IPアドレスを見て次のネットワークへ送る',
      from: 'router',
      to: 'web',
      packetLabel: 'TCP SYN',
      explanation:
        'ルータは受け取ったフレームからIPパケットを取り出し、宛先IPアドレスを見て次の転送先を決めます。区間が変わるので、L2のMACアドレスは付け替わります。',
      deviceFocus: 'ルータの判断材料は宛先IPアドレス。次の区間ではMACアドレスが変わる。',
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
      packetLabel: 'HTTP応答',
      explanation:
        'Webサーバからの応答も同じ考え方で戻ります。最終宛先IPアドレスはPCですが、各区間では次の機器へ届けるためのMACアドレスが使われます。',
      deviceFocus: '戻り道でも、L3の目的地とL2の次の一歩を分けて見る。',
      headerFocus: {
        sourceMac: 'cc:cc:cc:cc:cc:20',
        destinationMac: 'bb:bb:bb:bb:bb:01',
        sourceIp: '203.0.113.20',
        destinationIp: '192.168.1.10',
        protocol: 'HTTP/TLS',
        port: '443',
      },
    },
  ],
}

const layerOneThreeChapter: TextbookChapter = {
  id: 'layer1-3',
  order: 1,
  title: 'レイヤ1〜3基礎',
  description: '通信の通り道、MACアドレス、IPアドレス、スイッチ、ルータ、ARP、VLANを最初の地図としてつかむ',
  status: 'published',
  estimatedMinutes: 18,
  intro: [
    'ネットワークを学び始めたとき、最初に難しく感じるのは、用語そのものよりも「どの話がどの範囲の話なのか」が見えにくいことです。',
    'この章では、通信を「近くへ届ける」と「遠くへ届ける」に分けて眺めます。ここが見えると、MACアドレス、IPアドレス、スイッチ、ルータ、ARP、VLANが、ばらばらの暗記事項ではなく一つの流れとしてつながります。',
  ],
  sections: [
    {
      heading: '通信は一気に届くのではなく、隣へ隣へ運ばれる',
      body: [
        'PCでWebサイトを開くと、画面には一瞬でページが表示されます。でもネットワークの中では、PCからWebサーバへ一直線に飛んでいるわけではありません。',
        '実際には、PCからスイッチへ、スイッチからルータへ、ルータから次のネットワークへ、というように、近くの相手へ渡す小さな配送を何度も繰り返しています。',
        'ネスペ午後の構成図を読むときも、この「次の一歩」を追えるかどうかが大事です。いきなり最終目的地だけを見るのではなく、今この機器は次にどこへ渡そうとしているのかを見ます。',
      ],
      diagrams: [
        {
          type: 'network-flow',
          title: 'PCからWebサーバまでのざっくりした通り道',
          description:
            'この図は、通信が複数の機器を経由して進むことを表しています。ポイントは、PCがWebサーバへ直接ケーブルでつながっているわけではなく、途中の機器が少しずつ中継していることです。',
          points: [
            'PCから見た最初の相手は、たいてい同じLAN内のスイッチやデフォルトゲートウェイです。',
            'スイッチは同じLAN内の転送を助けます。',
            'ルータは別ネットワークへ出ていく判断をします。',
          ],
          nodes: [
            { id: 'pc', label: 'PC', caption: '通信の出発点', role: 'pc' },
            { id: 'switch', label: 'L2SW', caption: '同じLAN内で転送', role: 'switch' },
            { id: 'router', label: 'ルータ', caption: '別ネットワークへ中継', role: 'router' },
            { id: 'web', label: 'Webサーバ', caption: '通信の目的地', role: 'server' },
          ],
          links: [
            { from: 'pc', to: 'switch', label: 'フレーム' },
            { from: 'switch', to: 'router', label: 'フレーム' },
            { from: 'router', to: 'web', label: 'パケット' },
          ],
        },
      ],
      callouts: [
        {
          type: 'analogy',
          title: '住所と配達員で考える',
          body: [
            'IPアドレスは最終的な住所に近く、MACアドレスは次に手渡す相手の名札に近いです。遠くの住所を知っていても、まずは目の前の配送担当へ渡せないと荷物は進みません。',
          ],
        },
      ],
    },
    {
      heading: 'L1、L2、L3は何を分担しているか',
      body: [
        'レイヤという言葉は抽象的ですが、まずは役割分担として見れば十分です。L1は信号を運ぶ土台、L2は同じネットワーク内で届ける仕組み、L3は別ネットワークへ届ける仕組みです。',
        '試験では「どのレイヤの情報を見て判断しているか」がよく効きます。L2SWならMACアドレス、ルータならIPアドレス、という対応を丸暗記するより、なぜそうなるかを流れで理解しましょう。',
      ],
      diagrams: [
        {
          type: 'layer-stack',
          title: 'L1/L2/L3の役割',
          description:
            'この図は、低いレイヤほど物理的な運び方に近く、高いレイヤほどネットワークをまたいだ届け方に近づくことを表しています。',
          points: [
            'L1はビットを信号として運ぶための土台です。',
            'L2は同じLAN内でフレームを届けます。',
            'L3はIPアドレスを使って別ネットワークへパケットを届けます。',
          ],
          layers: [
            {
              label: 'L3',
              title: 'ネットワーク層',
              description: 'IPアドレスを見て、別ネットワークへ進む道を決める',
              example: 'IP、ルーティング、ルータ',
              color: 'blue',
            },
            {
              label: 'L2',
              title: 'データリンク層',
              description: '同じLAN内で、MACアドレスを使ってフレームを届ける',
              example: 'Ethernet、MAC、L2SW、VLAN、ARP',
              color: 'green',
            },
            {
              label: 'L1',
              title: '物理層',
              description: '電気信号、光、電波としてビットを運ぶ',
              example: 'LANケーブル、光ファイバ、無線の物理信号',
              color: 'amber',
            },
          ],
        },
      ],
    },
    {
      heading: 'MACアドレスとIPアドレスは役割が違う',
      body: [
        'MACアドレスとIPアドレスは、どちらも通信相手を表す情報なので混ざりやすいです。ただし、見ている範囲が違います。',
        'MACアドレスは、同じLAN内で次に届ける相手を示します。IPアドレスは、最終的にどのネットワーク上のどの相手へ届けたいかを示します。',
        '別ネットワークへ通信するとき、宛先IPアドレスはWebサーバのままですが、宛先MACアドレスはまずデフォルトゲートウェイになります。この感覚がつかめると、構成図の読み方が一段楽になります。',
      ],
      diagrams: [
        {
          type: 'comparison',
          title: 'MACアドレスとIPアドレスの見ている範囲',
          description:
            'この比較では、MACアドレスを「次の一歩」、IPアドレスを「最終目的地」として見ます。実際の通信では両方が同時に使われます。',
          points: [
            '同じLAN内ではMACアドレスが配送の中心になります。',
            'ネットワークをまたぐ判断ではIPアドレスが中心になります。',
            '別ネットワーク宛てでも、IPの宛先は最終目的地のままです。',
          ],
          columns: [
            {
              title: 'MACアドレス',
              subtitle: '近くへ届けるための情報',
              accent: 'teal',
              items: [
                '同じLAN内で使う',
                'イーサネットフレームに入る',
                'L2SWが主に見る',
                '区間が変わると付け替わる',
              ],
            },
            {
              title: 'IPアドレス',
              subtitle: '遠くの目的地を示す情報',
              accent: 'indigo',
              items: [
                'ネットワークをまたいで使う',
                'IPパケットに入る',
                'ルータが主に見る',
                '基本的に最終宛先のまま進む',
              ],
            },
          ],
        },
      ],
      callouts: [
        {
          type: 'pitfall',
          title: '「WebサーバのMACアドレス宛てに送る」はたいてい違う',
          body: [
            'PCとWebサーバが別ネットワークにいる場合、PCが最初に送るフレームの宛先MACアドレスはWebサーバではなくデフォルトゲートウェイです。ここは午後問題でも説明文の根拠になりやすいポイントです。',
          ],
        },
      ],
    },
    {
      heading: 'スイッチは同じネットワーク内、ルータは別ネットワークへ進める',
      body: [
        'スイッチとルータは、どちらも通信を中継する機器です。ただし、見ている情報と責任範囲が違います。',
        'L2SWは、フレームの宛先MACアドレスを見て、どのポートへ出すかを決めます。ルータは、IPパケットの宛先IPアドレスを見て、どのネットワークへ送るかを決めます。',
        'この違いを押さえると、障害問題で「どこまでは届いていて、どこから届いていないのか」を切り分けやすくなります。',
      ],
      diagrams: [
        {
          type: 'comparison',
          title: 'L2SWとルータの役割の違い',
          description:
            'この図は、同じ「中継する機器」でも、L2SWとルータでは判断材料が違うことを表しています。',
          points: [
            'L2SWはMACアドレスとポート対応を学習します。',
            'ルータは宛先IPアドレスと経路情報を見ます。',
            '午後問題では、どの機器でどの情報が使われるかを見ます。',
          ],
          columns: [
            {
              title: 'L2SW',
              subtitle: '同じLANの中で届ける',
              accent: 'teal',
              items: [
                '主にMACアドレスを見る',
                'フレームを転送する',
                'VLANで論理的にLANを分ける',
                'ブロードキャストを同じVLAN内へ広げる',
              ],
            },
            {
              title: 'ルータ',
              subtitle: '別ネットワークへ届ける',
              accent: 'indigo',
              items: [
                '主にIPアドレスを見る',
                'パケットを転送する',
                '経路表を使って次の転送先を決める',
                'ブロードキャストを通常は越えさせない',
              ],
            },
          ],
        },
      ],
    },
    {
      heading: 'ARPはIPアドレスからMACアドレスを知る仕組み',
      body: [
        'PCは宛先IPアドレスを知っていても、それだけでは同じLAN内にフレームを流せません。イーサネットで届けるには、次に渡す相手のMACアドレスが必要です。',
        'そこでARPが登場します。ARPは「このIPアドレスを持っている人は、自分のMACアドレスを教えてください」と同じLAN内に問い合わせる仕組みです。',
        '別ネットワーク宛ての場合、PCがARPで探すのは最終宛先のWebサーバではなく、デフォルトゲートウェイのMACアドレスです。',
      ],
      diagrams: [
        {
          type: 'sequence',
          title: 'ARPの基本的な流れ',
          description:
            'この図は、PCがデフォルトゲートウェイのMACアドレスを知るまでの流れです。ARP要求はブロードキャスト、ARP応答は基本的に問い合わせたPCへ返ります。',
          points: [
            'ARP要求は同じLAN内に広がります。',
            '該当するIPアドレスを持つ機器だけが応答します。',
            'PCは得られた対応をARPテーブルに一定時間保存します。',
          ],
          steps: [
            {
              label: '1',
              title: 'PCがARP要求を送る',
              body: '192.168.1.1のMACアドレスを知っている機器はいますか、と同じLANへ問い合わせる。',
            },
            {
              label: '2',
              title: 'L2SWが同じVLAN内へ広げる',
              body: '宛先MACアドレスがブロードキャストなので、該当VLANのポートへ転送する。',
            },
            {
              label: '3',
              title: 'ルータがARP応答を返す',
              body: '192.168.1.1は自分です。このMACアドレスへ送ってください、とPCへ返す。',
            },
            {
              label: '4',
              title: 'PCがARPテーブルに覚える',
              body: '次からはデフォルトゲートウェイ宛てのフレームを作れる。',
            },
          ],
        },
      ],
    },
    {
      heading: '動きで見ると、L2とL3の境目が見えてくる',
      body: [
        'ここまでの話は、文字だけだと少し固く感じます。そこで、PCがWebサーバへアクセスするまでの流れを、パケットの動きとして見てみましょう。',
        '見るポイントは一つです。IPアドレスは最終目的地を示し続けますが、MACアドレスは次の一歩に合わせて変わります。',
      ],
      diagrams: [
        {
          type: 'interactive-flow',
          title: 'パケットフロービジュアライザ',
          description:
            '再生すると、ARPで次の一歩を調べてから、Webサーバ宛ての通信が進む様子を追えます。ステップごとの説明とヘッダの注目点を合わせて見てください。',
          points: [
            'ARPはデフォルトゲートウェイのMACアドレスを知るために使われます。',
            'L2SWはMACアドレスを見て転送します。',
            'ルータはIPアドレスを見て別ネットワークへ転送します。',
          ],
          scenario: layerOneThreeScenario,
        },
      ],
      callouts: [
        {
          type: 'important',
          title: '動きの中で一番おいしいところ',
          body: [
            'Webサーバ宛てのIPパケットを、ルータ宛てのイーサネットフレームに入れて送るところです。この二重構造が見えると、L2とL3の理解がぐっと楽になります。',
          ],
        },
      ],
    },
    {
      heading: 'VLANは1台のスイッチを論理的に分ける考え方',
      body: [
        'VLANは、1台のスイッチの中に複数の論理的なLANを作る技術です。物理的には同じスイッチにつながっていても、VLANが違えば同じブロードキャストドメインではありません。',
        'これは、部署ごとにネットワークを分けたい、音声用と業務PC用を分けたい、検証環境を本番環境から分けたい、といった場面でよく使われます。',
        'ネスペ午後では、VLAN ID、アクセスポート、トランクポート、L3SWによるVLAN間ルーティングがつながって出てきます。まずは「VLANはL2の範囲を論理的に分けるもの」と押さえましょう。',
      ],
      diagrams: [
        {
          type: 'segment',
          title: 'VLANでブロードキャストドメインを分ける',
          description:
            'この図は、同じスイッチ上でもVLANが違えばブロードキャストが届く範囲が分かれることを表しています。',
          points: [
            'VLAN 10のブロードキャストはVLAN 10内に閉じます。',
            'VLAN 20の端末へ通信するには、L3の中継が必要です。',
            'トランクポートではVLANタグを使って複数VLANを運びます。',
          ],
          domains: [
            {
              title: 'VLAN 10',
              description: '業務PC用セグメント',
              accent: 'sky',
              members: ['PC-A', 'PC-B', 'プリンタ'],
            },
            {
              title: 'VLAN 20',
              description: 'サーバ管理用セグメント',
              accent: 'emerald',
              members: ['管理PC', '監視サーバ'],
            },
            {
              title: 'VLAN 30',
              description: 'ゲスト用セグメント',
              accent: 'rose',
              members: ['来客端末', '検証端末'],
            },
          ],
        },
      ],
    },
    {
      heading: 'ネスペ午後では、構成図の境目を読む',
      body: [
        '午後問題の構成図は、ただの絵ではありません。どこが同じセグメントか、どこからルーティングが発生するか、どこでMACアドレスの話からIPアドレスの話へ切り替わるかを読むための地図です。',
        '問題文で「同一セグメント」「デフォルトゲートウェイ」「ARP」「VLAN」「L3SW」といった言葉が出たら、今どのレイヤの話をしているのかを確認します。',
        '最初から全てのプロトコルを完璧に覚える必要はありません。まずは、L2の話なのか、L3の話なのかを見分ける。これだけで、午後問題の文章はかなり読みやすくなります。',
      ],
      callouts: [
        {
          type: 'exam',
          title: '午後問題での見方',
          body: [
            '構成図を見たら、端末、L2SW、L3SW、ルータの位置を確認します。そのうえで、同じVLAN内の通信なのか、別ネットワークへの通信なのかを分けて読むと、設問の根拠を探しやすくなります。',
          ],
        },
      ],
    },
  ],
  examFocus: [
    'L2SWはMACアドレス、ルータはIPアドレスを見るという役割分担を説明できる',
    '別ネットワーク宛て通信で、最初の宛先MACアドレスがデフォルトゲートウェイになる理由を説明できる',
    'VLANによってブロードキャストドメインが分かれることを構成図上で読める',
  ],
  practicalFocus: [
    '障害切り分けでは、まず同一セグメント内で届くのか、デフォルトゲートウェイを越えた先で詰まっているのかを見る',
    'L2の問題とL3の問題を分けるだけで、調査の順番がかなり整理される',
    'VLAN設計は、物理配線ではなく論理的な分離として扱える',
  ],
  pitfalls: [
    'IPアドレスだけ分かっていれば同じLAN内へ送れると思ってしまう',
    '別ネットワーク宛てなのに、最初からWebサーバのMACアドレス宛てに送ると考えてしまう',
    '同じスイッチにつながっていれば必ず同じセグメントだと思ってしまう',
  ],
  summary: [
    'L1は信号を運ぶ土台、L2は同じLAN内で届ける仕組み、L3は別ネットワークへ届ける仕組みです。',
    'MACアドレスは次の一歩、IPアドレスは最終目的地を見るための情報です。',
    'L2SWはMACアドレスを見てフレームを転送し、ルータはIPアドレスを見てパケットを転送します。',
    'ARPは、同じLAN内で次に届ける相手のMACアドレスを知るために使います。',
    'VLANは、L2の範囲を論理的に分ける技術です。',
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
  draftChapter('protocol-review', 21, 'プロトコル総復習', '主要プロトコルをレイヤ、ポート、用途の地図として整理する'),
  draftChapter('iot', 22, 'IoT+補足', 'CoAP、MQTT、LPWA、指数再送など近年出題テーマを補う'),
]

export function getTextbookChapter(chapterId: string | undefined): TextbookChapter | undefined {
  if (!chapterId) return undefined
  return textbookChapters.find((chapter) => chapter.id === chapterId)
}

export function getPublishedTextbookChapters(): TextbookChapter[] {
  return textbookChapters.filter((chapter) => chapter.status === 'published')
}
