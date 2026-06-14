import type { ExamNetworkDiagram, TextbookChapter } from './textbookChapters'

const companyNetworkBase = {
  viewBox: { width: 1000, height: 520 },
  zones: [
    {
      id: 'company',
      label: 'A社ネットワーク',
      x: 40,
      y: 55,
      width: 920,
      height: 410,
      kind: 'dashed',
      caption: 'この章では、内部LANとサーバLANの間を通る通信に絞ります。',
      tone: 'slate',
    },
    {
      id: 'internal',
      label: '内部LAN / 192.168.10.0/24',
      x: 75,
      y: 190,
      width: 360,
      height: 220,
      kind: 'dashed',
      caption: 'PC、L2SW、L3SWの内部側インタフェースが属する範囲',
      tone: 'sky',
    },
    {
      id: 'server-lan',
      label: 'サーバLAN / 172.16.0.0/24',
      x: 625,
      y: 190,
      width: 300,
      height: 220,
      kind: 'dashed',
      caption: 'Webサーバが属する別ネットワーク',
      tone: 'amber',
    },
  ],
  nodes: [
    {
      id: 'l3sw',
      label: 'L3SW',
      caption: 'GW: 192.168.10.1',
      x: 465,
      y: 295,
      width: 135,
      height: 58,
      role: 'router',
      tone: 'blue',
    },
    {
      id: 'l2sw',
      label: 'L2SW',
      caption: '内部LAN収容',
      x: 240,
      y: 320,
      width: 115,
      height: 50,
      role: 'switch',
      tone: 'emerald',
    },
    {
      id: 'pc',
      label: 'PC',
      caption: '192.168.10.10',
      x: 95,
      y: 365,
      width: 110,
      height: 48,
      role: 'pc',
      tone: 'sky',
    },
    {
      id: 'internal-dns',
      label: '社内DNS',
      caption: '192.168.10.53',
      x: 95,
      y: 270,
      width: 110,
      height: 48,
      role: 'dns',
      tone: 'violet',
    },
    {
      id: 'server-sw',
      label: 'L2SW',
      caption: 'サーバLAN収容',
      x: 675,
      y: 320,
      width: 120,
      height: 50,
      role: 'switch',
      tone: 'emerald',
    },
    {
      id: 'web',
      label: 'Webサーバ',
      caption: '172.16.0.20',
      x: 780,
      y: 260,
      width: 120,
      height: 48,
      role: 'server',
      tone: 'amber',
    },
  ],
  links: [
    {
      id: 'l3sw-l2sw',
      points: [{ x: 465, y: 324 }, { x: 355, y: 345 }],
      label: '内部LAN',
      tone: 'sky',
      labelPosition: { x: 410, y: 315 },
    },
    {
      id: 'l2sw-pc',
      points: [{ x: 240, y: 345 }, { x: 205, y: 389 }],
      tone: 'sky',
    },
    {
      id: 'l2sw-dns',
      points: [{ x: 240, y: 345 }, { x: 205, y: 294 }],
      dashed: true,
      tone: 'violet',
    },
    {
      id: 'l3sw-server-sw',
      points: [{ x: 600, y: 324 }, { x: 675, y: 345 }],
      label: 'サーバLAN',
      tone: 'amber',
      labelPosition: { x: 640, y: 315 },
    },
    {
      id: 'server-sw-web',
      points: [{ x: 735, y: 320 }, { x: 840, y: 308 }],
      tone: 'amber',
    },
  ],
} satisfies Pick<ExamNetworkDiagram, 'viewBox' | 'zones' | 'nodes' | 'links'>

const structureOverviewDiagram: ExamNetworkDiagram = {
  type: 'exam-network',
  title: 'ネスペで出る構成図として通信を見る',
  description:
    'この章では、このような構成図を前提にして読み進めます。丸暗記ではなく、[[blue:どの機器がどのヘッダを見て判断するか]]を図の上で追います。',
  points: [
    '構成図は「機器の配置」だけでなく、通信が通る境界を示す地図です。',
    '内部LANとサーバLANのような範囲を分けて読むと、L2とL3の話が混ざりにくくなります。',
    'この章の動く図では、同じ構成図の上でARP、L2転送、L3転送を追います。',
  ],
  ...companyNetworkBase,
}

const arpLearningDiagram: ExamNetworkDiagram = {
  type: 'exam-network',
  title: 'ARPは内部LANの中で次ホップを探す',
  description:
    'この図では、ARPの理解に必要な内部LANだけを表示します。PCが知りたいのは、同じLAN内にいる[[green:デフォルトゲートウェイのMACアドレス]]です。',
  points: [
    'ARP要求は同じLAN内へのブロードキャストです。',
    '最終宛先が別ネットワークにある場合、PCはデフォルトゲートウェイのMACアドレスを調べます。',
    'ARPはIPパケットではありません。Ethernetフレームとして運ばれ、ARPの中に送信元/対象のIPアドレス情報を持ちます。',
  ],
  viewBox: { width: 1000, height: 360 },
  zones: [
    {
      id: 'internal-arp',
      label: '内部LAN / 192.168.10.0/24',
      x: 70,
      y: 80,
      width: 860,
      height: 220,
      kind: 'dashed',
      caption: 'ARP要求が届く範囲。PC、L2SW、L3SWの内部側インタフェースが属します。',
      tone: 'sky',
    },
  ],
  nodes: [
    {
      id: 'pc',
      label: 'PC',
      caption: '192.168.10.10',
      x: 120,
      y: 195,
      width: 120,
      height: 54,
      role: 'pc',
      tone: 'sky',
    },
    {
      id: 'l2sw',
      label: 'L2SW',
      caption: '内部LAN収容',
      x: 420,
      y: 195,
      width: 120,
      height: 54,
      role: 'switch',
      tone: 'emerald',
    },
    {
      id: 'l3sw',
      label: 'L3SW',
      caption: 'GW: 192.168.10.1',
      x: 715,
      y: 195,
      width: 145,
      height: 54,
      role: 'router',
      tone: 'blue',
    },
  ],
  links: [
    {
      id: 'l2sw-pc',
      points: [{ x: 240, y: 222 }, { x: 420, y: 222 }],
      label: 'L2フレーム',
      tone: 'sky',
      labelPosition: { x: 330, y: 198 },
    },
    {
      id: 'l3sw-l2sw',
      points: [{ x: 540, y: 222 }, { x: 715, y: 222 }],
      label: '同じLAN内',
      tone: 'emerald',
      labelPosition: { x: 628, y: 198 },
    },
  ],
  steps: [
    {
      id: 'arp-request-pc-l2sw',
      title: 'PCがARP要求をブロードキャストする',
      packetLabel: 'ARP要求',
      activeLinkIds: ['l2sw-pc'],
      packet: { from: { x: 250, y: 222 }, to: { x: 390, y: 222 } },
      description:
        'PCは通信したい宛先IPアドレスが自分のネットワーク外だと判断し、次ホップをデフォルトゲートウェイ192.168.10.1にします。そのMACアドレスを知らないため、ARP要求を送ります。',
      deviceAction:
        'PCの処理: 「192.168.10.1を持つ機器はMACアドレスを教えてください」と、同じLAN内へ問い合わせます。',
      capture: {
        point: 'PC - L2SW間',
        l2: '宛先MAC ff:ff:ff:ff:ff:ff / 送信元MAC 00:10:10:10:10:10 / EtherType ARP',
        l3: 'IPヘッダなし。ARPの対象プロトコルアドレスとして 192.168.10.1 を指定',
        l4: 'なし',
        note: 'ARP要求はブロードキャストなので、同じLAN内の機器に届きます。',
      },
    },
    {
      id: 'arp-request-l2sw-l3sw',
      title: 'L2SWが同じLAN内へARP要求を転送する',
      packetLabel: 'ARP要求',
      activeLinkIds: ['l3sw-l2sw'],
      packet: { from: { x: 550, y: 222 }, to: { x: 690, y: 222 } },
      description:
        'L2SWは宛先MACアドレスがブロードキャストであることを見て、同じLANに属するポートへフレームを転送します。IPアドレスで経路選択しているわけではありません。',
      deviceAction:
        'L2SWの処理: L2フレームの宛先MACアドレスを見て、同じLAN内へフレームを出します。',
      capture: {
        point: 'L2SW - L3SW間',
        l2: '宛先MAC ff:ff:ff:ff:ff:ff / 送信元MAC 00:10:10:10:10:10 / EtherType ARP',
        l3: 'IPヘッダなし。対象プロトコルアドレスは 192.168.10.1',
        l4: 'なし',
        note: 'L2SWはARPの意味を理解して経路を選んでいるのではなく、L2フレームとして転送しています。',
      },
    },
    {
      id: 'arp-reply-l3sw-l2sw',
      title: 'L3SWがARP応答を返す',
      packetLabel: 'ARP応答',
      activeLinkIds: ['l3sw-l2sw'],
      packet: { from: { x: 690, y: 222 }, to: { x: 550, y: 222 } },
      description:
        'L3SWは内部LAN側インタフェースで192.168.10.1を持っているため、自分のMACアドレスをPCへ返します。',
      deviceAction:
        'L3SWの処理: デフォルトゲートウェイとして、自分の内部LAN側MACアドレスを応答します。',
      capture: {
        point: 'L3SW - L2SW間',
        l2: '宛先MAC 00:10:10:10:10:10 / 送信元MAC aa:aa:aa:aa:10:01 / EtherType ARP',
        l3: 'IPヘッダなし。送信元プロトコルアドレスは 192.168.10.1',
        l4: 'なし',
        note: 'PCはこの応答によって、次ホップへ送るEthernetフレームを作れるようになります。',
      },
    },
    {
      id: 'arp-reply-l2sw-pc',
      title: 'PCが次ホップのMACアドレスを記録する',
      packetLabel: 'ARP応答',
      activeLinkIds: ['l2sw-pc'],
      packet: { from: { x: 390, y: 222 }, to: { x: 250, y: 222 } },
      description:
        'PCはARP応答を受け取り、192.168.10.1とaa:aa:aa:aa:10:01の対応をARPテーブルに保存します。ここから別ネットワーク宛てのIPパケットを、デフォルトゲートウェイ宛てのEthernetフレームに入れて送れます。',
      deviceAction:
        'PCの処理: 最終宛先IPは変えず、宛先MACだけを次ホップであるL3SWにします。',
      capture: {
        point: 'L2SW - PC間',
        l2: '宛先MAC 00:10:10:10:10:10 / 送信元MAC aa:aa:aa:aa:10:01 / EtherType ARP',
        l3: 'IPヘッダなし。送信元プロトコルアドレスは 192.168.10.1',
        l4: 'なし',
        note: 'ARPが終わって初めて、通常のIP通信を入れたL2フレームを送れる状態になります。',
      },
    },
  ],
}

const webFlowDiagram: ExamNetworkDiagram = {
  type: 'exam-network',
  title: '動く構成図: PCからサーバLANのWebサーバへHTTPS通信する',
  description:
    '同じ構成図の上で、Webサーバ宛ての通信を区間ごとに追います。重要なのは、[[green:L2ヘッダはリンクごとに変わる]]一方で、[[blue:IPヘッダの宛先IPは最終宛先を示し続ける]]ことです。',
  points: [
    'PCからL3SWまでは、宛先MACがデフォルトゲートウェイになります。',
    'L3SWは、受信したL2ヘッダ/トレーラを取り外し、IPヘッダを見て次の転送先を判断します。',
    'TCPの宛先ポート443は、Webサーバ上のHTTPSサービスへ渡すための情報です。',
  ],
  ...companyNetworkBase,
  steps: [
    {
      id: 'tcp-pc-l2sw',
      title: 'PCがWebサーバ宛てのIPパケットをL2フレームに入れる',
      packetLabel: 'TCP SYN',
      activeLinkIds: ['l2sw-pc'],
      packet: { from: { x: 188, y: 385 }, to: { x: 228, y: 360 } },
      description:
        'PCは宛先IPアドレスを172.16.0.20にしたIPパケットを作ります。ただし最初のリンクでの宛先MACアドレスは、WebサーバではなくデフォルトゲートウェイのMACアドレスです。',
      deviceAction:
        'PCの処理: L4ヘッダ、L3ヘッダを付加した後、内部LANで使うL2ヘッダ/トレーラを付加して送信します。',
      capture: {
        point: 'PC - L2SW間',
        l2: '宛先MAC aa:aa:aa:aa:10:01 / 送信元MAC 00:10:10:10:10:10 / EtherType IPv4',
        l3: '送信元IP 192.168.10.10 / 宛先IP 172.16.0.20 / TTL 64',
        l4: 'TCP 送信元ポート 51520 / 宛先ポート 443 / SYN',
        note: '宛先IPはWebサーバ、宛先MACは次ホップです。この違いが最初の重要点です。',
      },
    },
    {
      id: 'tcp-l2sw-l3sw',
      title: 'L2SWが宛先MACアドレスを見て転送する',
      packetLabel: 'TCP SYN',
      activeLinkIds: ['l3sw-l2sw'],
      packet: { from: { x: 360, y: 342 }, to: { x: 455, y: 326 } },
      description:
        'L2SWはEthernetフレームの宛先MACアドレスを見て、L3SWへ向かうポートへ転送します。中のIPパケットを使って経路選択しているわけではありません。',
      deviceAction:
        'L2SWの処理: MACアドレステーブルを参照し、L2フレームを内部LAN内で転送します。',
      capture: {
        point: 'L2SW - L3SW間',
        l2: '宛先MAC aa:aa:aa:aa:10:01 / 送信元MAC 00:10:10:10:10:10 / EtherType IPv4',
        l3: '送信元IP 192.168.10.10 / 宛先IP 172.16.0.20',
        l4: 'TCP 51520 -> 443 / SYN',
        note: 'L2SWを通っても、同じLAN内のL2ヘッダは基本的にそのままです。',
      },
    },
    {
      id: 'tcp-l3sw-server-lan',
      title: 'L3SWがIPヘッダを見てサーバLANへ転送する',
      packetLabel: 'IP転送',
      activeLinkIds: ['l3sw-server-sw'],
      packet: { from: { x: 600, y: 326 }, to: { x: 665, y: 342 } },
      description:
        'L3SWは受信したEthernetフレームのL2ヘッダ/トレーラを取り外し、IPヘッダの宛先IPアドレスを見ます。宛先がサーバLAN側だと判断したら、サーバLANで使う新しいL2ヘッダ/トレーラを付加して送ります。',
      deviceAction:
        'L3SWの処理: L2をデカプセル化し、L3で経路を判断し、次のリンク用にL2を再カプセル化します。',
      capture: {
        point: 'L3SW - サーバLAN側L2SW間',
        l2: '宛先MAC dd:dd:dd:dd:16:02 / 送信元MAC bb:bb:bb:bb:16:01 / EtherType IPv4',
        l3: '送信元IP 192.168.10.10 / 宛先IP 172.16.0.20 / TTL 63',
        l4: 'TCP 51520 -> 443 / SYN',
        note: 'IPの送信元/宛先は変わらず、L2のMACアドレスだけが次のリンク用に変わります。',
      },
    },
    {
      id: 'tcp-server-sw-web',
      title: 'サーバLAN側のL2SWがWebサーバへ転送する',
      packetLabel: 'TCP SYN',
      activeLinkIds: ['server-sw-web'],
      packet: { from: { x: 735, y: 320 }, to: { x: 835, y: 308 } },
      description:
        'サーバLAN側のL2SWは、宛先MACアドレスを見てWebサーバへ向かうポートにEthernetフレームを転送します。ここでもL2SWの判断材料はMACアドレスです。',
      deviceAction:
        'L2SWの処理: サーバLAN内で、宛先MACアドレスに対応するポートへフレームを出します。',
      capture: {
        point: 'サーバLAN側L2SW - Webサーバ間',
        l2: '宛先MAC 00:20:20:20:20:20 / 送信元MAC dd:dd:dd:dd:16:01 / EtherType IPv4',
        l3: '送信元IP 192.168.10.10 / 宛先IP 172.16.0.20 / TTL 63',
        l4: 'TCP 51520 -> 443 / SYN',
        note: 'サーバLAN内のL2転送でも、中のIPパケットはPCからWebサーバ宛てのままです。',
      },
    },
    {
      id: 'tcp-web-decapsulation',
      title: 'Webサーバがヘッダを確認してアプリケーションへ渡す',
      packetLabel: '受信処理',
      activeLinkIds: ['server-sw-web'],
      packet: { from: { x: 820, y: 312 }, to: { x: 850, y: 308 } },
      description:
        'WebサーバはL2ヘッダを確認し、宛先MACアドレスが自分宛てであることを見ます。次にIPヘッダで宛先IPアドレスが自分宛てであることを確認し、TCPヘッダの宛先ポート443を見てHTTPSの処理へ渡します。',
      deviceAction:
        'Webサーバの処理: L2、L3、L4の順にデカプセル化し、最後にアプリケーションへデータを渡します。',
      capture: {
        point: 'Webサーバ受信時',
        l2: '宛先MAC 00:20:20:20:20:20 / 送信元MAC dd:dd:dd:dd:16:01 / EtherType IPv4',
        l3: '送信元IP 192.168.10.10 / 宛先IP 172.16.0.20',
        l4: 'TCP 51520 -> 443 / SYN',
        note: '受信側では、外側のL2から順に確認し、不要になったヘッダを取り外して上位層へ渡します。',
      },
    },
  ],
}

const vlanNetworkDiagram: ExamNetworkDiagram = {
  type: 'exam-network',
  title: 'VLANは物理構成と論理構成を分けて読む',
  description:
    '同じL2SWにつながっていても、VLANが違えば同じブロードキャストドメインではありません。構成図では、[[green:配線としての物理構成]]と[[blue:通信範囲としての論理構成]]を分けて読みます。',
  points: [
    '上段は物理的な配線、下段はVLANごとの論理的な範囲です。',
    'VLAN 10のARP要求は、VLAN 10のブロードキャストドメイン内に閉じます。',
    'VLAN 10からVLAN 20へ通信するには、L3SWのSVIなどによるL3転送が必要です。',
  ],
  viewBox: { width: 1000, height: 560 },
  zones: [
    {
      id: 'physical',
      label: '物理構成（配線）',
      x: 40,
      y: 45,
      width: 920,
      height: 220,
      kind: 'solid',
      caption: 'ケーブル上は「どの機器に接続されているか」を見る',
      tone: 'slate',
    },
    {
      id: 'vlan10',
      label: 'VLAN 10 業務PC / 192.168.10.0/24',
      x: 70,
      y: 335,
      width: 275,
      height: 170,
      kind: 'dashed',
      caption: '業務PC用のブロードキャストドメイン',
      tone: 'sky',
    },
    {
      id: 'l3',
      label: 'L3SW / SVI',
      x: 390,
      y: 335,
      width: 220,
      height: 170,
      kind: 'dashed',
      caption: 'VLAN間通信の境界',
      tone: 'blue',
    },
    {
      id: 'vlan20',
      label: 'VLAN 20 サーバ / 192.168.20.0/24',
      x: 655,
      y: 335,
      width: 275,
      height: 170,
      kind: 'dashed',
      caption: 'サーバ用のブロードキャストドメイン',
      tone: 'amber',
    },
  ],
  nodes: [
    { id: 'pc-a', label: 'PC-A', caption: 'VLAN 10', x: 120, y: 100, width: 110, height: 46, role: 'pc', tone: 'sky' },
    { id: 'pc-b', label: 'PC-B', caption: 'VLAN 10', x: 120, y: 175, width: 110, height: 46, role: 'pc', tone: 'sky' },
    { id: 'l2sw-vlan', label: 'L2SW', caption: 'アクセスポート/トランク', x: 395, y: 135, width: 140, height: 54, role: 'switch', tone: 'emerald' },
    { id: 'l3sw-vlan', label: 'L3SW', caption: 'VLAN間ルーティング', x: 610, y: 135, width: 145, height: 54, role: 'router', tone: 'blue' },
    { id: 'web-vlan', label: 'Webサーバ', caption: 'VLAN 20', x: 815, y: 145, width: 120, height: 46, role: 'server', tone: 'amber' },
    { id: 'vlan10-pc-a', label: 'PC-A', caption: '192.168.10.10', x: 105, y: 405, width: 105, height: 46, role: 'pc', tone: 'sky' },
    { id: 'vlan10-pc-b', label: 'PC-B', caption: '192.168.10.11', x: 220, y: 405, width: 105, height: 46, role: 'pc', tone: 'sky' },
    { id: 'vlan-gw-10', label: 'SVI 10', caption: '192.168.10.1', x: 435, y: 390, width: 130, height: 46, role: 'router', tone: 'blue' },
    { id: 'vlan-gw-20', label: 'SVI 20', caption: '192.168.20.1', x: 435, y: 445, width: 130, height: 46, role: 'router', tone: 'blue' },
    { id: 'vlan20-web', label: 'Webサーバ', caption: '192.168.20.20', x: 745, y: 415, width: 130, height: 46, role: 'server', tone: 'amber' },
  ],
  links: [
    {
      id: 'pc-a-l2sw',
      points: [{ x: 230, y: 123 }, { x: 395, y: 155 }],
      tone: 'sky',
    },
    {
      id: 'pc-b-l2sw',
      points: [{ x: 230, y: 198 }, { x: 395, y: 165 }],
      tone: 'sky',
    },
    {
      id: 'l2sw-l3sw-trunk',
      points: [{ x: 535, y: 162 }, { x: 610, y: 162 }],
      label: 'トランク',
      tone: 'emerald',
      labelPosition: { x: 572, y: 137 },
    },
    {
      id: 'l3sw-web',
      points: [{ x: 755, y: 162 }, { x: 815, y: 168 }],
      tone: 'amber',
    },
    {
      id: 'logical-vlan10-to-svi',
      points: [{ x: 345, y: 486 }, { x: 390, y: 486 }],
      label: 'VLAN 10からSVIへ',
      tone: 'sky',
      labelPosition: { x: 368, y: 468 },
    },
    {
      id: 'svi10-svi20',
      points: [{ x: 500, y: 436 }, { x: 500, y: 445 }],
      label: 'L3判断',
      tone: 'blue',
      labelPosition: { x: 590, y: 392 },
    },
    {
      id: 'logical-vlan20',
      points: [{ x: 565, y: 468 }, { x: 745, y: 438 }],
      label: 'VLAN 20へ',
      tone: 'amber',
      labelPosition: { x: 650, y: 426 },
    },
  ],
}

export const layerOneThreeChapter: TextbookChapter = {
  id: 'layer1-3',
  order: 1,
  title: 'OSI参照モデルと構成図の読み方',
  description: 'ネスペで出るネットワーク構成図を題材に、L2/L3/L4、カプセル化、ARP、VLANを最初からつなげて理解します',
  status: 'published',
  estimatedMinutes: 38,
  intro: [
    'ネットワークの初学者が最初につまずくのは、用語そのものよりも「いま、構成図のどの場所で、どの層の話をしているのか」が見えなくなることです。MACアドレス、IPアドレス、ポート番号、フレーム、パケット、セグメントが同時に出ると、説明が霧のように散らばります。',
    'この章では、ネスペ午後問題で出てくるような[[blue:ネットワーク構成図]]を最初から使います。その図の上で、[[green:L2の転送]]、[[blue:L3の経路選択]]、[[amber:L4のアプリケーション識別]]を順番に追います。',
    '目標は、細かいコマンドや暗記ではありません。構成図を見たときに「この機器は何を見て判断するのか」「この区間ではどのヘッダが使われるのか」を、自分の言葉で説明できるようになることです。',
  ],
  sections: [
    {
      heading: 'OSI参照モデルを通信の地図として置く',
      body: [
        '最初に置くべき地図はOSI参照モデルです。OSI参照モデルは、通信を7つの層に分けて見るための考え方です。これは試験用の飾りではなく、構成図の中で「いま何の話をしているか」を迷わないための基準になります。',
        'OSI参照モデルはL1からL7まであります。L5のセッション層、L6のプレゼンテーション層も含めて7層です。この章では全体像を押さえたうえで、ネスペで特に問われやすい[[green:L2]]、[[blue:L3]]、[[amber:L4]]を中心に読み進めます。',
        'たとえば、PCからサーバLANのWebサーバへアクセスするとき、L2SWは主にL2の情報を見ます。L3SWはL3の情報を見て別ネットワークへ転送します。Webサーバは最後にL4から上位層へデータを渡します。層を分けると、構成図上の役割が見えます。',
      ],
      diagrams: [
        {
          type: 'layer-stack',
          title: 'OSI参照モデルの7層',
          description:
            'まず7層すべてを確認します。この章では[[green:L2]]、[[blue:L3]]、[[amber:L4]]を中心に、構成図の読み方へつなげます。',
          points: [
            'L5とL6もOSI参照モデルに含まれます。この章では名前と位置を押さえ、詳細は後の章に回します。',
            'L2は同じリンク上でフレームを届ける層です。',
            'L3はIPアドレスを見て、別ネットワークへ進む経路を選ぶ層です。',
            'L4はTCP/UDPとポート番号で、端末上の通信を識別する層です。',
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
              label: 'L6',
              title: 'プレゼンテーション層',
              description: '文字コード、データ形式、暗号化表現などを扱う',
              example: '文字コード, データ形式, 暗号化表現',
              color: 'amber',
            },
            {
              label: 'L5',
              title: 'セッション層',
              description: '通信の開始、維持、終了といった会話の単位を扱う',
              example: 'セッション管理',
              color: 'amber',
            },
            {
              label: 'L4',
              title: 'トランスポート層',
              description: 'TCP/UDPとポート番号で端末間の通信を整理する',
              example: 'TCP, UDP, ポート番号',
              color: 'amber',
            },
            {
              label: 'L3',
              title: 'ネットワーク層',
              description: 'IPアドレスを使い、別ネットワークへ進む経路を選ぶ',
              example: 'IP, ルーティング, ルータ, L3SW',
              color: 'blue',
            },
            {
              label: 'L2',
              title: 'データリンク層',
              description: '同じリンク上で、MACアドレスを使ってフレームを届ける',
              example: 'Ethernet, MACアドレス, L2SW, ARP',
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
        structureOverviewDiagram,
      ],
    },
    {
      heading: 'カプセル化とデカプセル化でヘッダの位置を理解する',
      body: [
        '送信端末では、アプリケーションのデータがそのままケーブルへ流れるわけではありません。下位層へ渡すたびに、その層が処理で使う情報をヘッダとして付加します。この処理を[[amber:カプセル化]]と呼びます。',
        'HTTPS通信を例にすると、アプリケーションデータにTCPヘッダが付加されて[[amber:TCPセグメント]]になります。そこへIPヘッダが付加されて[[blue:IPパケット]]になります。最後にEthernetヘッダとFCSが付加されて[[green:Ethernetフレーム]]としてリンク上を流れます。',
        '受信側では逆に、外側から順にヘッダを確認し、取り外しながら上位層へ渡します。これが[[blue:デカプセル化]]です。途中のルータやL3SWは、受信したL2フレームをデカプセル化してIPヘッダを確認し、次のリンク用にL2ヘッダ/トレーラを付加し直します。',
      ],
      diagrams: [
        {
          type: 'encapsulation-flow',
          title: '送信時にヘッダを付加していく流れ',
          description:
            'アプリケーションデータにL4、L3、L2の情報が順に付加されます。ここでは「何がどの層の情報か」を見ます。',
          points: [
            'L4ではTCP/UDPヘッダが付加されます。ポート番号はここにあります。',
            'L3ではIPヘッダが付加されます。送信元IPアドレスと宛先IPアドレスはここにあります。',
            'L2ではEthernetヘッダとFCSが付加されます。MACアドレスはここにあります。',
          ],
          stages: [
            {
              label: '1',
              title: 'アプリケーションデータ',
              description: 'HTTPリクエストなど、アプリケーションが送りたい内容。',
              parts: [{ label: 'データ', accent: 'slate' }],
            },
            {
              label: '2',
              title: 'L4ヘッダを付加',
              description: 'TCPならポート番号やシーケンス番号などを付加する。',
              parts: [
                { label: 'TCPヘッダ', accent: 'amber' },
                { label: 'データ', accent: 'slate' },
              ],
            },
            {
              label: '3',
              title: 'L3ヘッダを付加',
              description: 'IPアドレスなど、最終的な送信元と宛先を示す情報を付加する。',
              parts: [
                { label: 'IPヘッダ', accent: 'blue' },
                { label: 'TCP', accent: 'amber' },
                { label: 'データ', accent: 'slate' },
              ],
            },
            {
              label: '4',
              title: 'L2ヘッダ/FCSを付加',
              description: '次ホップへ届けるためのMACアドレスなどを付加する。',
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
              title: 'ルータやL3SWで起きること',
              body: '受信したL2ヘッダ/トレーラを取り外し、IPヘッダを見て、次のリンク用のL2ヘッダ/トレーラを付加して送信します。',
              accent: 'blue',
            },
            {
              title: 'リンク上を流れる単位',
              body: '別ネットワーク宛ての通信でも、各リンク上ではそのリンク用のEthernetフレームとして運ばれます。',
              accent: 'emerald',
            },
          ],
        },
        {
          type: 'packet-frame',
          title: 'フレーム、パケット、セグメントの関係',
          description:
            'L2、L3、L4の情報は同列ではありません。Ethernetフレームの中にIPパケットがあり、その中にTCPセグメントがあります。',
          points: [
            'Ethernetフレームは、同じリンク上の次ホップへ届けるための単位です。',
            'IPパケットは、最終的な送信元IPアドレスと宛先IPアドレスを持ちます。',
            'TCPセグメントは、ポート番号などを持ち、端末上のアプリケーション通信を識別します。',
          ],
          layers: [
            {
              title: 'Ethernetフレーム（L2）',
              subtitle: 'リンク上で次ホップへ届ける',
              accent: 'emerald',
              fields: ['宛先MAC', '送信元MAC', 'タイプ', '中身: IPパケット', 'FCS'],
            },
            {
              title: 'IPパケット（L3）',
              subtitle: '最終的な送信元と宛先を示す',
              accent: 'blue',
              fields: ['送信元IP', '宛先IP', 'TTL', '中身: TCPセグメント'],
            },
            {
              title: 'TCPセグメント（L4）',
              subtitle: 'アプリケーション間の通信を識別する',
              accent: 'amber',
              fields: ['送信元ポート', '宛先ポート', 'シーケンス番号', 'データ'],
            },
          ],
          notes: [
            {
              title: 'L2はリンクごとに変わる',
              body: 'ルータを越えるたびに、次のリンクで使うMACアドレスへ付け替えられます。',
              accent: 'emerald',
            },
            {
              title: 'L3は最終宛先を示す',
              body: '通常のルーティングでは、送信元IPと宛先IPは途中のルータを通っても最終端末を示します。',
              accent: 'blue',
            },
            {
              title: 'L4はサービスを示す',
              body: '宛先ポート443なら、宛先端末上のHTTPSサービスへ渡す通信だと分かります。',
              accent: 'amber',
            },
            {
              title: '午後問題での使い方',
              body: '「何を見て判断したか」を聞かれたら、L2、L3、L4のどのヘッダかを先に分けます。',
              accent: 'slate',
            },
          ],
        },
      ],
    },
    {
      heading: 'MACアドレス、IPアドレス、ポート番号を分けて読む',
      body: [
        'MACアドレス、IPアドレス、ポート番号は、どれも通信を識別する情報です。ただし、[[green:見ている層]]と[[blue:識別している範囲]]が違います。ここを表で分けておくと、構成図を読んだときに混乱しにくくなります。',
        '最初に押さえる結論は、[[green:MACアドレスは次ホップ]]、[[blue:IPアドレスは最終的な端末]]、[[amber:ポート番号は端末上のアプリケーション]]を示す、ということです。',
      ],
      diagrams: [
        {
          type: 'address-role-table',
          title: 'MACアドレス、IPアドレス、ポート番号の比較表',
          description:
            'この表は、3つの識別子を同じ軸で比較したものです。構成図では、まず「どの層の情報を見ているのか」を切り分けます。',
          points: [
            'MACアドレスはL2ヘッダに入り、同じリンク上の次ホップを示します。',
            'IPアドレスはL3ヘッダに入り、最終的な送信元と宛先を示します。',
            'ポート番号はL4ヘッダに入り、端末上のアプリケーションを示します。',
          ],
          rows: [
            {
              name: 'MACアドレス',
              layer: 'L2',
              header: 'Ethernetヘッダ',
              identifies: '同じリンク上で次に渡す相手',
              scope: 'リンクごと。ルータやL3SWを越えると次のリンク用に変わる',
              example: '00:11:22:33:44:55',
              examHint: 'PCが最初に使う宛先MACは、Webサーバではなくデフォルトゲートウェイになることが多い。',
              accent: 'emerald',
            },
            {
              name: 'IPアドレス',
              layer: 'L3',
              header: 'IPヘッダ',
              identifies: '最終的な送信元端末と宛先端末',
              scope: 'エンドツーエンド。通常のルーティングでは途中機器を通っても宛先IPは変わらない',
              example: '192.168.10.10 / 172.16.0.20',
              examHint: 'ルータやL3SWは宛先IPアドレスを見て、次の転送先を判断する。',
              accent: 'blue',
            },
            {
              name: 'ポート番号',
              layer: 'L4',
              header: 'TCP/UDPヘッダ',
              identifies: '端末上のどのアプリケーションの通信か',
              scope: '端末上の通信。サーバの待受ポートや通信の種類として読む',
              example: 'TCP/443',
              examHint: 'HTTPS通信なら宛先ポート443。宛先端末のどのサービスへ渡す通信かを表す。',
              accent: 'amber',
            },
          ],
        },
      ],
    },
    {
      heading: '構成図では境界と次ホップを先に見る',
      body: [
        'ネスペ午後問題の構成図は、機器名の暗記表ではありません。どの範囲が内部LANか、どこから別ネットワークか、どの機器を通ると次のネットワークへ進むかを読むための地図です。',
        '最初に見るのは、送信元と宛先の位置です。PCは内部LANにあり、WebサーバはサーバLANにあります。この時点で、同じLAN内で完結する通信ではなく、L3SWを通る通信だと分かります。',
        '次に見るのは次ホップです。PCがサーバLANのWebサーバへ直接L2フレームを送るわけではありません。PCが最初にL2フレームを渡す相手は、同じ内部LANにいるデフォルトゲートウェイです。',
      ],
      diagrams: [structureOverviewDiagram],
      callouts: [
        {
          type: 'exam',
          title: '午後問題では「構成図を説明できるか」が問われる',
          body: [
            '設問文の条件を構成図へ書き込むつもりで読むと、答えの根拠が見つけやすくなります。送信元、宛先、次ホップ、通過する境界を先に確認してください。',
          ],
        },
      ],
    },
    {
      heading: 'ARPで最初のL2フレームを作れる状態にする',
      body: [
        'PCが別ネットワーク宛てに通信するとき、最初に必要なのは最終宛先のMACアドレスではありません。PCと同じLAN内で次に渡す相手、つまりデフォルトゲートウェイのMACアドレスです。',
        'ARPは、IPv4アドレスに対応するMACアドレスを調べるためのプロトコルです。ただし、単に定義を覚えるよりも、[[green:Ethernetフレームを作るための前処理]]だと理解した方が実用的です。',
        'ARP要求はブロードキャストとして同じLAN内に届きます。該当するIPアドレスを持つ機器がARP応答を返し、PCはその対応をARPテーブルに保存します。',
      ],
      diagrams: [arpLearningDiagram],
      callouts: [
        {
          type: 'pitfall',
          title: '別ネットワーク宛てで最終宛先のMACアドレスを使うわけではない',
          body: [
            'PCが最初に送るEthernetフレームの宛先MACアドレスは、同じLAN内の次ホップです。最終宛先が別ネットワークにあるなら、最初の宛先MACアドレスはデフォルトゲートウェイになります。',
          ],
        },
      ],
    },
    {
      heading: '動く構成図でPCからWebサーバまでを追う',
      body: [
        'ここまでの内容を、実際の構成図の上でつなげます。PCからサーバLANのWebサーバへHTTPS通信する流れを、区間ごとのL2ヘッダ、IPヘッダ、TCPヘッダとして見ます。',
        'ポイントは、[[green:L2ヘッダは区間ごとに変わる]]ことです。PCからL3SWへ行く区間、L3SWからサーバLAN側のL2SWへ行く区間、そこからWebサーバへ行く区間では、それぞれリンク上の送信元MACアドレスと宛先MACアドレスが変わります。',
        '一方で、[[blue:IPヘッダの宛先IPアドレスはWebサーバ]]を示し続けます。途中機器を通っても、送信元IPと宛先IPはエンド端末を示す情報として読みます。',
      ],
      diagrams: [webFlowDiagram],
    },
    {
      heading: 'VLANは物理構成と論理構成を分けて理解する',
      body: [
        'ここで初めてVLANを扱います。VLANは、L2の範囲を論理的に分ける仕組みです。同じL2SWにつながっていても、VLANが違えば同じブロードキャストドメインではありません。',
        '物理構成だけを見ると、複数の端末が同じスイッチに接続されているように見えます。しかし論理構成では、業務PC用のVLAN 10とサーバ用のVLAN 20のように、別のL2範囲として分かれていることがあります。',
        'VLAN 10のPCがVLAN 20のサーバと通信するには、L2SWだけでは完結しません。L3SWのSVIやルータがデフォルトゲートウェイとなり、L3で経路選択して別のVLANへ転送します。',
      ],
      diagrams: [vlanNetworkDiagram],
      callouts: [
        {
          type: 'important',
          title: '同じスイッチ配下でも、同じLANとは限らない',
          body: [
            'ネスペ午後では、物理的な配線図とVLAN設計が別々に示されることがあります。物理的に近いかどうかではなく、同じVLANかどうかを確認してください。',
          ],
        },
      ],
    },
    {
      heading: '午後問題では「どの機器が何を見たか」で説明する',
      body: [
        '最後に、試験で使える読み方へまとめます。構成図を見たら、まず送信元と宛先のネットワークを確認します。次に、同じLAN内で完結するのか、デフォルトゲートウェイを越えるのかを見ます。',
        '設問で「なぜ通信できないか」「どの設定を追加するか」「どのアドレスを指定するか」と聞かれたら、機器ごとの判断材料へ戻ります。L2SWはMACアドレス、L3SW/ルータはIPアドレス、端末はポート番号やアプリケーションの情報も見ます。',
        '実務でも同じです。PCからデフォルトゲートウェイへ届くのか、名前解決はできているのか、Webサーバのポートが待ち受けているのか。層を分けて考えると、調査の順番が落ち着きます。',
      ],
      diagrams: [
        {
          type: 'sequence',
          title: '構成図を読む手順',
          description:
            '午後問題では、いきなり答えを探すより、構成図上の通信経路を層ごとに分けると根拠を作りやすくなります。',
          points: [
            '送信元と宛先のIPアドレス、サブネット、配置場所を確認します。',
            '同じLAN内の通信か、デフォルトゲートウェイを越える通信かを分けます。',
            '通過する機器ごとに、L2、L3、L4のどの情報を見るかを書き出します。',
          ],
          steps: [
            {
              label: '1',
              title: '送信元と宛先を構成図に置く',
              body: 'PC、サーバ、DNS、L2SW、L3SWなどの位置を確認し、どのネットワークに属しているかを見ます。',
            },
            {
              label: '2',
              title: '同じLAN内か別ネットワークかを判断する',
              body: '同じLAN内ならL2中心、別ネットワークならデフォルトゲートウェイとL3転送を中心に考えます。',
            },
            {
              label: '3',
              title: '次ホップと通過機器を並べる',
              body: 'PCからL2SW、L3SW、サーバLAN側L2SW、Webサーバのように、通信が通る順番を書きます。',
            },
            {
              label: '4',
              title: '各機器の判断材料を説明する',
              body: 'L2SWは宛先MACアドレス、L3SW/ルータは宛先IPアドレス、端末はポート番号やアプリケーション情報を見る、と層で説明します。',
            },
          ],
        },
      ],
    },
  ],
  examFocus: [
    '構成図上で、送信元、宛先、次ホップ、通過する境界を説明できる',
    'L2SWは[[green:宛先MACアドレス]]、L3SW/ルータは[[blue:宛先IPアドレス]]を主な判断材料にする、と説明できる',
    '別ネットワーク宛ての通信で、最初の宛先MACアドレスが[[green:デフォルトゲートウェイ]]になる理由を説明できる',
    'VLANによって[[green:ブロードキャストドメイン]]が分かれ、VLAN間通信には[[blue:L3転送]]が必要だと読める',
  ],
  practicalFocus: [
    '障害切り分けでは、同じLAN内で届かないのか、デフォルトゲートウェイを越えた先で詰まっているのかを分けて見る',
    'パケットキャプチャを見るときは、Ethernet、IP、TCP/UDPのどのヘッダを見ているかを意識する',
    'L3SWやサーバの設定を見る前に、送信元/宛先IP、ポート番号、通過経路を構成図上で整理する',
  ],
  pitfalls: [
    'IPアドレスが分かれば、そのまま相手へ送れると思ってしまう',
    '別ネットワーク宛てなのに、最初の宛先MACアドレスをWebサーバのMACアドレスだと考えてしまう',
    '同じスイッチにつながっていれば、必ず同じブロードキャストドメインだと思ってしまう',
    'ルータやL3SWでL2ヘッダが付け替えられることを忘れ、フレームとパケットを同じものとして説明してしまう',
  ],
  summary: [
    'OSI参照モデルは、構成図の中で[[blue:いま何の層の話か]]を迷わないための地図です。',
    '送信側ではヘッダを順に付加する[[amber:カプセル化]]、受信側ではヘッダを順に確認して取り外す[[blue:デカプセル化]]が行われます。',
    '[[green:MACアドレス]]は同じリンク上の次ホップ、[[blue:IPアドレス]]は最終的な端末、[[amber:ポート番号]]は端末上のアプリケーションを識別します。',
    'ARPは、同じLAN内でL2フレームを作るために必要なMACアドレスを調べる仕組みです。',
    'VLANはL2の範囲を論理的に分け、VLAN間通信はL3の中継として考えます。',
  ],
}
