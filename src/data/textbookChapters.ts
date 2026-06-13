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
  title: 'OSI参照モデルと通信の全体像',
  description: 'OSI参照モデル、カプセル化、機器ごとの見方から、通信全体の流れを順番に学ぶ章です',
  status: 'published',
  estimatedMinutes: 0,
  intro: [],
  sections: [
    {
      heading: 'OSI参照モデルは通信を見るための地図',
      body: [
        '**ねらい:** OSI参照モデルを「7階層の丸暗記」ではなく、通信を分解して見るための[[blue:地図]]として導入する。',
        '**扱う要点:** L1は信号、L2は同じリンク内の転送、L3はネットワーク間の転送、L4は端末間の会話、L7はアプリケーションの意味を扱う。最初から全層を深掘りせず、1章では[[green:L2]]、[[blue:L3]]、[[amber:L4]]の境目を中心に見る。',
        '**図解の方向:** OSIの縦積み図に、PC、L2SW、ルータ、Webサーバを重ねて、各機器が主にどの層の情報を見るのかを示す。',
      ],
    },
    {
      heading: 'データは下のレイヤへ渡されるたびに包まれる',
      body: [
        '**ねらい:** カプセル化を先に理解させ、フレーム、パケット、セグメントという言葉が何を指すのかを混同しないようにする。',
        '**扱う要点:** アプリケーションのデータに[[amber:L4ヘッダ]]が付き、そこへ[[blue:L3ヘッダ]]が付き、最後に[[green:L2ヘッダとトレーラ]]が付く。受信側では逆順に外していく。',
        '**図解の方向:** データの箱にL4、L3、L2のヘッダが順番に付いていく動きを見せる。ルータではL2だけを外し、IPを見て、次のリンク用のL2を付け直すことも同じ図の中で扱う。',
      ],
    },
    {
      heading: 'クライアント、ネットワーク、サーバは同じデータを違う見方で扱う',
      body: [
        '**ねらい:** 通信を「PCからサーバへ一直線に飛ぶもの」と見ず、端末と中継機器で見ている情報が違うことを理解させる。',
        '**扱う要点:** クライアントはアプリケーションの要求を作り、宛先IPと次ホップを決める。L2SWはL2フレームを転送し、ルータはIPパケットを見て次のネットワークへ送る。サーバは受け取ったデータをアプリケーションとして処理する。',
        '**図解の方向:** 画面上段にPC、L2SW、ルータ、Webサーバの経路、下段に各地点で注目するヘッダを並べ、同じ通信でも見る層が切り替わる様子を示す。',
      ],
    },
    {
      heading: 'MACアドレス、IPアドレス、ポート番号の役割',
      body: [
        '**ねらい:** MACアドレス、IPアドレス、ポート番号を、単なる識別子ではなく通信のどの範囲を識別する情報かで整理する。',
        '**扱う要点:** [[green:MACアドレス]]は次のリンク上の相手、[[blue:IPアドレス]]は最終的な端末、[[amber:ポート番号]]は端末内のアプリケーションを識別する。L2SW、ルータ、端末が見る情報の違いとセットで説明する。',
        '**図解の方向:** 1つのHTTPS通信を例に、Ethernetフレーム、IPパケット、TCPセグメントを入れ子で描き、それぞれの宛先が何を指しているかをラベルで示す。',
      ],
    },
    {
      heading: 'ARPはL2フレームを作るために必要になる',
      body: [
        '**ねらい:** ARPを「IPアドレスからMACアドレスを調べる暗記事項」ではなく、[[green:L2フレームを作る前処理]]として理解させる。',
        '**扱う要点:** 同じLAN内へフレームを送るには宛先MACアドレスが必要になる。別ネットワーク宛ての場合、PCがARPで調べるのはWebサーバのMACアドレスではなく、[[amber:デフォルトゲートウェイのMACアドレス]]である。',
        '**図解の方向:** ARP要求のブロードキャスト、ARP応答、ARPテーブルへの登録、登録後にTCP通信を開始する流れを、同じLANの範囲が分かる図で示す。',
      ],
    },
    {
      heading: '動く図解: PCからWebサーバへ届くまで',
      body: [
        '**ねらい:** ここまでの節で整理したOSI、カプセル化、アドレス、ARPを、PCからWebサーバへアクセスする一連の流れとしてつなげる。',
        '**扱う要点:** 各ステップで「どの機器が、どのヘッダを見て、何を判断しているか」を追う。[[blue:IPの最終宛先]]と[[green:L2の次ホップ]]を分けて見ることを確認する。',
        '**図解の方向:** 既存の動く図を使い、ステップごとにヘッダ情報と機器の判断点を読む。後で本文化するときは、カプセル化の動く図と接続して理解できるようにする。',
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
    },
    {
      heading: 'VLANとブロードキャストドメイン',
      body: [
        '**ねらい:** VLANを「スイッチの設定項目」ではなく、L2の届く範囲を論理的に分ける考え方として理解させる。',
        '**扱う要点:** 同じ物理スイッチにつながっていても、VLANが違えば同じブロードキャストドメインではない。ARP要求がどこまで届くか、VLAN間通信にはL3の中継が必要になることを説明する。',
        '**図解の方向:** 1台のL2SWの中にVLAN 10、VLAN 20を色分けして描き、ブロードキャストが同じVLAN内にだけ広がる様子と、VLAN間通信でルータまたはL3SWを通る様子を示す。',
      ],
    },
    {
      heading: 'ネスペ午後では構成図の境目を読む',
      body: [
        '**ねらい:** 1章の知識を、ネスペ午後問題の構成図を読む力につなげる。用語を覚えるだけでなく、図のどこがL2の境目で、どこからL3の判断になるかを読む。',
        '**扱う要点:** セグメント、VLAN、デフォルトゲートウェイ、L2SW、ルータ、L3SWという語が出たら、同一LAN内の話か、別ネットワークへ進む話かを切り分ける。障害切り分けでも同じ見方が使える。',
        '**図解の方向:** 午後問題風の小さな構成図に、L2の範囲、L3の境目、ARPが届く範囲、ルーティングが発生する点を色で重ねて示す。',
      ],
    },
  ],
  examFocus: [],
  practicalFocus: [],
  pitfalls: [],
  summary: [],
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
