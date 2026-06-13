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
    '同じLAN内の一歩目は[[green:MACアドレス]]で進み、別ネットワークへ出る判断は[[blue:IPアドレス]]で進みます。この違いを、フレームとパケットの動きで追いかけます。',
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
        'PCは、Webサーバが自分とは別ネットワークにいると判断します。そこで最初の送り先を[[amber:デフォルトゲートウェイ]]に決めますが、同じLAN内で届けるには相手の[[green:MACアドレス]]が必要です。そのため、ARP要求をブロードキャストします。',
      deviceFocus: 'PCは「192.168.1.1を持っている機器はいますか」と同じLAN全体へ聞いています。',
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
        'L2SWは、ARP要求の宛先MACアドレスがブロードキャストであることを見て、同じVLAN内のポートへ広げます。この時点でL2SWは[[blue:IPアドレスで経路選択しているわけではありません]]。',
      deviceFocus: 'L2SWが見ている主役は[[green:MACアドレス]]です。IPの経路判断はしていません。',
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
        'ルータは「192.168.1.1は自分です」と応答します。これでPCは、別ネットワークへ向かう最初の一歩を、どの[[green:MACアドレス]]宛てに送ればよいか分かります。',
      deviceFocus: 'ルータはデフォルトゲートウェイとして、同じLAN側インタフェースのMACアドレスを返します。',
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
        'L2SWはPC側へARP応答を転送します。PCのARPテーブルには、デフォルトゲートウェイの[[blue:IPアドレス]]と[[green:MACアドレス]]の対応が入ります。',
      deviceFocus: '次からPCは、ルータ宛てのイーサネットフレームを作れます。',
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
        'ここが最重要です。[[blue:IPの宛先はWebサーバのまま]]ですが、[[green:イーサネットフレームの宛先MACアドレスはルータ]]になります。遠くの目的地と、次の一歩の相手は別です。',
      deviceFocus: 'PCは「最終目的地はWebサーバ、次の一歩はルータ」と分けて考えています。',
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
        'L2SWはフレームの[[green:宛先MACアドレス]]を見て、ルータが接続されているポートへ転送します。ここでも、L2SWが見ている中心はMACアドレスです。',
      deviceFocus: 'L2SWの判断材料は[[green:宛先MACアドレス]]です。',
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
      title: 'ルータはIPを見て、次区間のL2フレームを作り直す',
      from: 'router',
      to: 'web',
      packetLabel: 'TCP SYN',
      explanation:
        'ルータは受け取ったフレームのL2ヘッダを外し、中のIPパケットを見ます。[[blue:宛先IPアドレス]]で次の転送先を決めたら、次区間で使う[[green:新しいL2フレーム]]に入れ直して送ります。',
      deviceFocus: 'ルータは[[green:L2をデカプセル化]]し、[[blue:IPで経路判断]]し、次のリンク用に[[green:再カプセル化]]します。',
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
        'Webサーバからの応答も同じ考え方で戻ります。[[blue:最終宛先IPアドレスはPC]]ですが、各区間では次の機器へ届けるための[[green:MACアドレス]]が使われます。',
      deviceFocus: '戻り道でも、L3の目的地とL2の次の一歩を分けて見ます。',
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
  description: '通信の通り道、MACアドレス、IPアドレス、スイッチ、ルータ、ARP、VLANを「最初の地図」としてつかむ',
  status: 'published',
  estimatedMinutes: 18,
  intro: [
    'ネットワークを学び始めたときに難しく感じるのは、用語の数そのものよりも「どの話が、どの範囲の話なのか」が見えにくいことです。',
    'この章では、通信を[[green:近くへ届ける]]話と、[[blue:遠くへ届ける]]話に分けて眺めます。ここが見えると、MACアドレス、IPアドレス、スイッチ、ルータ、ARP、VLANが、ばらばらの暗記事項ではなく一つの流れとしてつながります。',
  ],
  sections: [
    {
      heading: '通信は一気に届くのではなく、隣へ隣へ運ばれる',
      body: [
        'PCでWebサイトを開くと、画面には一瞬でページが表示されます。けれども、ネットワークの中でPCからWebサーバへ一直線の線が引かれているわけではありません。',
        '実際には、PCからスイッチへ、スイッチからルータへ、ルータから次のネットワークへ、というように、[[amber:近くの相手へ手渡す動作]]を何度も繰り返しています。',
        'ネスペ午後の構成図を読むときも、この[[amber:次の一歩]]を追えるかどうかが大事です。最終目的地だけを見るのではなく、「今この機器は次にどこへ渡そうとしているのか」を見ます。',
      ],
      diagrams: [
        {
          type: 'network-flow',
          title: 'PCからWebサーバまでの通り道',
          description:
            'この図は、通信が複数の機器を経由して進むことを表しています。各区間では[[green:L2フレーム]]として運ばれ、その中に[[blue:IPパケット]]が入っています。ルータを越えるときは、L2を外してIPを見て、次区間のL2に入れ直します。',
          points: [
            'どのリンクでも、物理的に流れる単位は[[green:L2フレーム]]です。',
            'フレームの中の[[blue:IPパケット]]は、最終目的地のWebサーバを示し続けます。',
            'ルータは[[green:L2を外す]]、[[blue:IPを見る]]、[[green:次区間のL2を作る]]という処理をします。',
          ],
          nodes: [
            { id: 'pc', label: 'PC', caption: '通信の出発点', role: 'pc' },
            { id: 'switch', label: 'L2SW', caption: '同じLAN内で転送', role: 'switch' },
            { id: 'router', label: 'ルータ', caption: 'IPを見てL2を作り直す', role: 'router' },
            { id: 'web', label: 'Webサーバ', caption: '通信の目的地', role: 'server' },
          ],
          links: [
            { from: 'pc', to: 'switch', label: 'L2フレーム' },
            { from: 'switch', to: 'router', label: 'L2フレーム' },
            { from: 'router', to: 'web', label: '新しいL2フレーム' },
          ],
        },
      ],
      callouts: [
        {
          type: 'analogy',
          title: '住所と配達員で考える',
          body: [
            '[[blue:IPアドレス]]は最終的な住所、[[green:MACアドレス]]は次に手渡す相手の名札に近い情報です。遠くの住所を知っていても、まず目の前の配送担当へ渡せなければ荷物は進みません。',
          ],
        },
      ],
    },
    {
      heading: 'L1、L2、L3は何を分担しているか',
      body: [
        'レイヤという言葉は抽象的ですが、最初は役割分担として見れば十分です。[[amber:L1]]は信号を運ぶ土台、[[green:L2]]は同じネットワーク内で届ける仕組み、[[blue:L3]]は別ネットワークへ届ける仕組みです。',
        '試験では「どのレイヤの情報を見て判断しているか」がよく効きます。L2SWなら[[green:MACアドレス]]、ルータなら[[blue:IPアドレス]]という対応を、丸暗記ではなく通信の流れで理解しましょう。',
      ],
      diagrams: [
        {
          type: 'layer-stack',
          title: 'L1/L2/L3の役割',
          description:
            'この図は、低いレイヤほど物理的な運び方に近く、高いレイヤほどネットワークをまたいだ届け方に近づくことを表しています。',
          points: [
            '[[amber:L1]]はビットを信号として運ぶための土台です。',
            '[[green:L2]]は同じLAN内でフレームを届けます。',
            '[[blue:L3]]はIPアドレスを使って別ネットワークへパケットを届けます。',
          ],
          layers: [
            {
              label: 'L3',
              title: 'ネットワーク層',
              description: '[[blue:IPアドレス]]を見て、別ネットワークへ進む道を決める',
              example: 'IP、ルーティング、ルータ',
              color: 'blue',
            },
            {
              label: 'L2',
              title: 'データリンク層',
              description: '同じLAN内で、[[green:MACアドレス]]を使ってフレームを届ける',
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
        '[[green:MACアドレス]]は、同じLAN内で次に届ける相手を示します。[[blue:IPアドレス]]は、最終的にどのネットワーク上のどの相手へ届けたいかを示します。',
        '別ネットワークへ通信するとき、[[blue:宛先IPアドレスはWebサーバのまま]]ですが、[[green:宛先MACアドレスはまずデフォルトゲートウェイ]]になります。この感覚がつかめると、構成図の読み方がかなり楽になります。',
      ],
      diagrams: [
        {
          type: 'comparison',
          title: 'MACアドレスとIPアドレスの見ている範囲',
          description:
            'この比較では、[[green:MACアドレス]]を「次の一歩」、[[blue:IPアドレス]]を「最終目的地」として見ます。実際の通信では両方が同時に使われます。',
          points: [
            '同じLAN内では[[green:MACアドレス]]が配送の中心になります。',
            'ネットワークをまたぐ判断では[[blue:IPアドレス]]が中心になります。',
            '別ネットワーク宛てでも、[[blue:IPの宛先は最終目的地のまま]]です。',
          ],
          columns: [
            {
              title: 'MACアドレス',
              subtitle: '近くへ届けるための情報',
              accent: 'teal',
              items: [
                '同じLAN内で使う',
                '[[green:イーサネットフレーム]]に入る',
                '[[green:L2SW]]が主に見る',
                '区間が変わると付け替わる',
              ],
            },
            {
              title: 'IPアドレス',
              subtitle: '遠くの目的地を示す情報',
              accent: 'indigo',
              items: [
                'ネットワークをまたいで使う',
                '[[blue:IPパケット]]に入る',
                '[[blue:ルータ]]が主に見る',
                '基本的に最終宛先のまま進む',
              ],
            },
          ],
        },
        {
          type: 'packet-frame',
          title: 'フレームとパケットの入れ子',
          description:
            '送信側では、アプリケーションデータに[[amber:L4ヘッダ]]を付け、そこに[[blue:L3ヘッダ]]を付け、最後に[[green:L2ヘッダとトレーラ]]を付けます。PCが別ネットワークへ通信するときは、[[blue:Webサーバ宛てのIPパケット]]を[[green:ルータ宛てのイーサネットフレーム]]に入れて運びます。',
          points: [
            '外側の[[green:Ethernetフレーム]]は、同じリンク上の次の相手へ届けるために使います。',
            '内側の[[blue:IPパケット]]は、最終目的地のWebサーバを示し続けます。',
            'ルータでは外側のL2を外し、次のリンク用のL2を付け直します。',
          ],
          layers: [
            {
              title: 'Ethernetフレーム（L2）',
              subtitle: '同じLAN内で次の相手へ届ける外側の箱',
              accent: 'emerald',
              fields: ['宛先MAC', '送信元MAC', 'タイプ', '中身: IPパケット', 'FCS'],
            },
            {
              title: 'IPパケット（L3）',
              subtitle: '最終目的地まで運ぶ内側の箱',
              accent: 'blue',
              fields: ['送信元IP', '宛先IP', 'TTL', '中身: TCPセグメント'],
            },
            {
              title: 'TCPセグメント（L4）',
              subtitle: 'エンドホスト間の通信を識別するさらに内側の情報',
              accent: 'amber',
              fields: ['送信元ポート', '宛先ポート', '制御ビット', 'データ'],
            },
          ],
          notes: [
            {
              title: 'ここを見れば混ざらない',
              body: '[[green:MACアドレス]]はリンクごとに使う外側の情報、[[blue:IPアドレス]]はエンドツーエンドの内側の情報です。どちらも同時に使いますが、見ている範囲が違います。',
              accent: 'slate',
            },
            {
              title: '午後問題で効く見方',
              body: '「どの機器が、どのヘッダを見て判断したか」を問われたら、L2SWは外側のL2情報、ルータはL2を外した後のL3情報を見る、と切り分けます。',
              accent: 'blue',
            },
          ],
        },
        {
          type: 'sequence',
          title: 'カプセル化とデカプセル化の流れ',
          description:
            'この図は、ヘッダがどの順番で付くか、ルータでは何が外されて何が付け直されるかを表しています。[[red:別ネットワークだからIPパケットをむき出しで送る]]わけではありません。',
          points: [
            '送信側ではL4、L3、L2の順に外側へ包んでいきます。',
            'ルータはL2を外してL3を見ますが、L4ヘッダを付け直す機器ではありません。',
            '次のリンクへ出すときは、そのリンク用のL2フレームを新しく作ります。',
          ],
          steps: [
            {
              label: '1',
              title: 'L4ヘッダを付ける',
              body: 'PCのTCP処理が、送信元ポート、宛先ポート、シーケンス番号などを付けて[[amber:TCPセグメント]]を作る。',
            },
            {
              label: '2',
              title: 'L3ヘッダを付ける',
              body: 'IP処理が、送信元IPと宛先IPを付けて[[blue:IPパケット]]を作る。宛先IPはWebサーバを示す。',
            },
            {
              label: '3',
              title: 'L2ヘッダとトレーラを付ける',
              body: 'Ethernet処理が、次ホップの宛先MACを付けて[[green:L2フレーム]]を作る。別ネットワーク宛てなら、最初の宛先MACはデフォルトゲートウェイになる。',
            },
            {
              label: '4',
              title: 'ルータでL2を外してIPを見る',
              body: 'ルータは受信したL2フレームをデカプセル化し、[[blue:宛先IPアドレス]]と経路表を見て次の出力インタフェースを決める。',
            },
            {
              label: '5',
              title: '次区間用のL2に入れ直す',
              body: 'ルータは次のリンクで使う宛先MACと送信元MACを付けて、[[green:新しいL2フレーム]]として送り出す。IPパケットはTTLなど必要な値を更新して転送される。',
            },
          ],
        },
      ],
      callouts: [
        {
          type: 'pitfall',
          title: '「WebサーバのMACアドレス宛てに送る」はたいてい違う',
          body: [
            'PCとWebサーバが別ネットワークにいる場合、PCが最初に送るフレームの[[green:宛先MACアドレス]]はWebサーバではなく[[amber:デフォルトゲートウェイ]]です。ここは午後問題でも説明文の根拠になりやすいポイントです。',
          ],
        },
      ],
    },
    {
      heading: 'スイッチは同じネットワーク内、ルータは別ネットワークへ進める',
      body: [
        'スイッチとルータは、どちらも通信を中継する機器です。ただし、見ている情報と責任範囲が違います。',
        'L2SWは、フレームの[[green:宛先MACアドレス]]を見て、どのポートへ出すかを決めます。ルータは、IPパケットの[[blue:宛先IPアドレス]]を見て、どのネットワークへ送るかを決めます。',
        'この違いを押さえると、障害対応でも「同じLAN内で詰まっているのか」「ルータを越えた先で詰まっているのか」を切り分けやすくなります。',
      ],
      diagrams: [
        {
          type: 'comparison',
          title: 'L2SWとルータの役割の違い',
          description:
            'この図は、同じ「中継する機器」でも、L2SWとルータでは判断材料が違うことを表しています。',
          points: [
            'L2SWは[[green:MACアドレス]]とポート対応を学習します。',
            'ルータは[[blue:宛先IPアドレス]]と経路情報を見ます。',
            '午後問題では、どの機器でどの情報が使われるかを見ます。',
          ],
          columns: [
            {
              title: 'L2SW',
              subtitle: '同じLANの中で届ける',
              accent: 'teal',
              items: [
                '主に[[green:MACアドレス]]を見る',
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
                '主に[[blue:IPアドレス]]を見る',
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
        'PCは[[blue:宛先IPアドレス]]を知っていても、それだけでは同じLAN内にフレームを流せません。イーサネットで届けるには、次に渡す相手の[[green:MACアドレス]]が必要です。',
        'そこでARPが登場します。ARPは「このIPアドレスを持っている機器は、自分のMACアドレスを教えてください」と同じLAN内に問い合わせる仕組みです。',
        '別ネットワーク宛ての場合、PCがARPで探すのは最終宛先のWebサーバではなく、[[amber:デフォルトゲートウェイのMACアドレス]]です。',
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
            'PCは得られた対応を[[amber:ARPテーブル]]に一定時間保存します。',
          ],
          steps: [
            {
              label: '1',
              title: 'PCがARP要求を送る',
              body: '192.168.1.1の[[green:MACアドレス]]を知っている機器はいますか、と同じLANへ問い合わせる。',
            },
            {
              label: '2',
              title: 'L2SWが同じVLAN内へ広げる',
              body: '[[green:宛先MACアドレス]]がブロードキャストなので、該当VLANのポートへ転送する。',
            },
            {
              label: '3',
              title: 'ルータがARP応答を返す',
              body: '192.168.1.1は自分です。この[[green:MACアドレス]]へ送ってください、とPCへ返す。',
            },
            {
              label: '4',
              title: 'PCがARPテーブルに覚える',
              body: '次からは[[amber:デフォルトゲートウェイ]]宛てのフレームを作れる。',
            },
          ],
        },
      ],
    },
    {
      heading: '動きで見ると、L2とL3の境目が見えてくる',
      body: [
        'ここまでの話は、文字だけだと少し固く感じます。そこで、PCがWebサーバへアクセスするまでの流れを、動く図解で見てみましょう。',
        '見るポイントは一つです。[[blue:IPアドレスは最終目的地を示し続ける]]一方で、[[green:MACアドレスは次の一歩に合わせて変わります]]。',
      ],
      diagrams: [
        {
          type: 'interactive-flow',
          title: '動く図解',
          description:
            '再生すると、ARPで次の一歩を調べてから、Webサーバ宛ての通信が進む様子を追えます。ステップごとの説明とヘッダの注目点を合わせて見てください。',
          points: [
            'ARPは[[amber:デフォルトゲートウェイのMACアドレス]]を知るために使われます。',
            'L2SWは[[green:MACアドレス]]を見て転送します。',
            'ルータは[[blue:IPアドレス]]を見て別ネットワークへ転送します。',
          ],
          scenario: layerOneThreeScenario,
        },
      ],
      callouts: [
        {
          type: 'important',
          title: 'ここが重要: IPパケットをL2フレームに入れて運ぶ',
          body: [
            '[[blue:Webサーバ宛てのIPパケット]]を、[[green:ルータ宛てのイーサネットフレーム]]に入れて送ります。この二重構造が見えると、L2とL3の理解がぐっと楽になります。',
          ],
        },
      ],
    },
    {
      heading: 'VLANは1台のスイッチを論理的に分ける考え方',
      body: [
        'VLANは、1台のスイッチの中に複数の論理的なLANを作る技術です。物理的には同じスイッチにつながっていても、[[green:VLANが違えば同じブロードキャストドメインではありません]]。',
        'これは、部署ごとにネットワークを分けたい、音声用と業務PC用を分けたい、検証環境を本番環境から分けたい、といった場面でよく使われます。',
        'ネスペ午後では、VLAN ID、アクセスポート、トランクポート、L3SWによるVLAN間ルーティングがつながって出てきます。まずは「[[green:VLANはL2の範囲を論理的に分けるもの]]」と押さえましょう。',
      ],
      diagrams: [
        {
          type: 'segment',
          title: 'VLANでブロードキャストドメインを分ける',
          description:
            'この図は、同じスイッチ上でもVLANが違えばブロードキャストが届く範囲が分かれることを表しています。',
          points: [
            'VLAN 10のブロードキャストは[[green:VLAN 10内]]に閉じます。',
            'VLAN 20の端末へ通信するには、[[blue:L3の中継]]が必要です。',
            'トランクポートでは[[amber:VLANタグ]]を使って複数VLANを運びます。',
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
        '午後問題の構成図は、ただの絵ではありません。どこが同じセグメントか、どこからルーティングが発生するか、どこで[[green:MACアドレス]]の話から[[blue:IPアドレス]]の話へ切り替わるかを読むための地図です。',
        '問題文で「同一セグメント」「デフォルトゲートウェイ」「ARP」「VLAN」「L3SW」といった言葉が出たら、今どのレイヤの話をしているのかを確認します。',
        '最初から全てのプロトコルを完璧に覚える必要はありません。まずは、[[green:L2の話]]なのか、[[blue:L3の話]]なのかを見分ける。これだけで、午後問題の文章はかなり読みやすくなります。',
      ],
      callouts: [
        {
          type: 'exam',
          title: '午後問題での見方',
          body: [
            '構成図を見たら、端末、L2SW、L3SW、ルータの位置を確認します。そのうえで、[[green:同じVLAN内の通信]]なのか、[[blue:別ネットワークへの通信]]なのかを分けて読むと、設問の根拠を探しやすくなります。',
          ],
        },
      ],
    },
  ],
  examFocus: [
    'L2SWは[[green:MACアドレス]]、ルータは[[blue:IPアドレス]]を見るという役割分担を説明できる',
    '別ネットワーク宛て通信で、最初の[[green:宛先MACアドレス]]がデフォルトゲートウェイになる理由を説明できる',
    'VLANによって[[green:ブロードキャストドメイン]]が分かれることを構成図上で読める',
  ],
  practicalFocus: [
    '障害切り分けでは、まず[[green:同一セグメント内]]で届くのか、[[blue:デフォルトゲートウェイを越えた先]]で詰まっているのかを見る',
    'L2の問題とL3の問題を分けるだけで、調査の順番がかなり整理される',
    'VLAN設計は、物理配線ではなく論理的な分離として扱える',
  ],
  pitfalls: [
    'IPアドレスだけ分かっていれば同じLAN内へ送れると思ってしまう',
    '別ネットワーク宛てなのに、最初からWebサーバのMACアドレス宛てに送ると考えてしまう',
    '同じスイッチにつながっていれば必ず同じセグメントだと思ってしまう',
  ],
  summary: [
    'L1は信号を運ぶ土台、[[green:L2]]は同じLAN内で届ける仕組み、[[blue:L3]]は別ネットワークへ届ける仕組みです。',
    '[[green:MACアドレス]]は次の一歩、[[blue:IPアドレス]]は最終目的地を見るための情報です。',
    'L2SWは[[green:MACアドレス]]を見てフレームを転送し、ルータは[[blue:IPアドレス]]を見てパケットを転送します。',
    'ARPは、同じLAN内で次に届ける相手の[[green:MACアドレス]]を知るために使います。',
    'VLANは、[[green:L2の範囲]]を論理的に分ける技術です。',
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
