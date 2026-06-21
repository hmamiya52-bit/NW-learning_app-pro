import type { PacketFlowFigure, TextbookChapter, Topology } from '../types'

// 第1章で使う最小構成のトポロジ（PC—L2SW—L3SW—Webサーバ）
const arpTopology: Topology = {
  zones: [{ id: 'internal', label: '内部LAN 192.168.10.0/24', tone: 'sky' }],
  nodes: [
    { id: 'pc', label: 'PC', role: 'pc', zoneId: 'internal', sub: '192.168.10.10' },
    { id: 'l2sw', label: 'L2SW', role: 'switch', zoneId: 'internal', sub: '内部LAN' },
    { id: 'l3sw', label: 'L3SW', role: 'router', zoneId: 'internal', sub: '出口ルータ 192.168.10.1' },
  ],
  links: [
    { a: 'pc', b: 'l2sw' },
    { a: 'l2sw', b: 'l3sw' },
  ],
}

const webTopology: Topology = {
  zones: [
    { id: 'internal', label: '内部LAN 192.168.10.0/24', tone: 'sky' },
    { id: 'server', label: 'サーバLAN 172.16.0.0/24', tone: 'amber' },
  ],
  nodes: [
    { id: 'pc', label: 'PC', role: 'pc', zoneId: 'internal', sub: '192.168.10.10' },
    { id: 'l2sw', label: 'L2SW', role: 'switch', zoneId: 'internal', sub: '内部LAN' },
    { id: 'l3sw', label: 'L3SW', role: 'router', sub: '出口ルータ' },
    { id: 'web', label: 'Webサーバ', role: 'server', zoneId: 'server', sub: '172.16.0.20' },
  ],
  links: [
    { a: 'pc', b: 'l2sw' },
    { a: 'l2sw', b: 'l3sw' },
    { a: 'l3sw', b: 'web' },
  ],
}

const arpFigure: PacketFlowFigure = {
  kind: 'packet-flow',
  id: 'ch1-arp',
  title: 'PCが出口ルータのMACを調べる（ARP）',
  caption: 'ARPの問い合わせは同じLANの全員へ。出口ルータが自分のMACを返します。',
  takeaway: 'LANの外宛てでも、最初に調べるMACは相手ではなく[[green:出口ルータ]]のもの。',
  topology: arpTopology,
  steps: [
    {
      focus: { type: 'link', a: 'pc', b: 'l2sw' },
      packetLabel: 'ARP要求',
      headers: { l2: 'あて先MAC = 全員あて（ブロードキャスト）', l3: 'IPヘッダなし（ARPはL2で動く）' },
      explanation: 'PCが「192.168.10.1の人、MACを教えてください」と、同じLANの全員へ問い合わせます。',
    },
    {
      focus: { type: 'link', a: 'l2sw', b: 'l3sw' },
      packetLabel: 'ARP要求',
      headers: { l2: 'あて先MAC = 全員あて（ブロードキャスト）', l3: 'IPヘッダなし' },
      explanation: 'L2SWは全員あてのフレームを、同じLANのポートすべてへ配ります。',
    },
    {
      focus: { type: 'link', a: 'l3sw', b: 'pc' },
      packetLabel: 'ARP応答',
      headers: { l2: 'あて先MAC = PC', l3: 'IPヘッダなし' },
      explanation: '出口ルータが「それは私です。MACはこれです」とPCへ返します。',
    },
  ],
}

const webFlowFigure: PacketFlowFigure = {
  kind: 'packet-flow',
  id: 'ch1-web',
  title: 'PCからWebサーバへ届くまで',
  caption: '青く光る区間が「いま」。封筒のあて名（下の表）で、何が変わり何が変わらないかを見比べてください。',
  takeaway: '区間ごとに変わる[[green:あて先MAC]]、最後まで変わらない[[blue:あて先IP]]。ルータの仕事はMACの付け替え。',
  topology: webTopology,
  steps: [
    {
      focus: { type: 'link', a: 'pc', b: 'l2sw' },
      packetLabel: 'TCP SYN',
      headers: { l2: 'あて先MAC = 出口ルータ', l3: 'あて先IP = 172.16.0.20（Webサーバ）', l4: 'あて先ポート = 443' },
      status: { l3: 'same', l4: 'same' },
      explanation: 'PCはあて先IPをWebサーバにしたまま、最初のフレームのあて先MACを出口ルータにして送り出します。',
    },
    {
      focus: { type: 'link', a: 'l2sw', b: 'l3sw' },
      packetLabel: 'TCP SYN',
      headers: { l2: 'あて先MAC = 出口ルータ', l3: 'あて先IP = 172.16.0.20', l4: 'あて先ポート = 443' },
      status: { l2: 'same', l3: 'same', l4: 'same' },
      explanation: 'L2SWはあて先MACを見て中継するだけ。ヘッダは何も書き換えません。',
    },
    {
      focus: { type: 'node', id: 'l3sw' },
      packetLabel: 'MACを付け替え',
      headers: { l2: 'あて先MAC = Webサーバ（書き換え）', l3: 'あて先IP = 172.16.0.20（そのまま）', l4: 'あて先ポート = 443' },
      status: { l2: 'change', l3: 'same', l4: 'same' },
      explanation: '出口ルータはL2をいったん外し、あて先IPを見て進む道を選び、次の区間用のL2を付け直します。書き換わるのはMACだけです。',
    },
    {
      focus: { type: 'link', a: 'l3sw', b: 'web' },
      packetLabel: 'TCP SYN',
      headers: { l2: 'あて先MAC = Webサーバ', l3: 'あて先IP = 172.16.0.20', l4: 'あて先ポート = 443' },
      status: { l3: 'same', l4: 'same' },
      explanation: '新しいフレームでWebサーバへ届きます。あて先IPは、出発したときからずっとWebサーバのままです。',
    },
    {
      focus: { type: 'node', id: 'web' },
      packetLabel: '受信して開封',
      headers: { l2: 'L2ヘッダを外す', l3: 'L3ヘッダを外す', l4: 'ポート443 → HTTPSへ渡す' },
      status: { l2: 'strip', l3: 'strip' },
      explanation: 'Webサーバは外側からL2・L3の順に外し、最後にL4のポート443を見て、HTTPSのアプリへデータを渡します。これがデカプセル化です。',
    },
  ],
}

export const ch01Osi: TextbookChapter = {
  id: 'osi-communication',
  order: 1,
  title: 'OSI参照モデルと通信の全体像',
  summary: '小さな構成図の上でパケットを動かしながら、L2/L3/L4・カプセル化・ARPを最初からつなげて理解します。',
  status: 'published',
  estimatedMinutes: 25,
  intro: [
    {
      kind: 'text',
      text: 'この教科書モードは、ネットワークの学習を始めたばかりの方に向けた、最初のインプット用の教材です。応用情報技術者試験に合格し、これからインフラの実務やネスペ対策に進んでいく方を想定しています。',
    },
    {
      kind: 'text',
      text: 'ねらいは、用語を一つずつ丸暗記することではありません。ネットワーク構成図を見たときに、[[blue:どの機器が、何を見て、どう判断して次へ渡すのか]]を、自分の言葉で説明できるようになることです。',
    },
    {
      kind: 'text',
      text: '第1章のゴールは、PCからWebサーバへ通信が届くまでの流れを、構成図の上で一区間ずつたどれるようになること。OSI参照モデル、カプセル化、MAC・IP・ポート、ARPを、ばらばらの知識ではなく一本の線でつなげていきます。',
    },
  ],
  sections: [
    {
      heading: 'まず全体の地図をつくる ―― OSI参照モデル',
      blocks: [
        {
          kind: 'text',
          text: '通信は、役割ごとにいくつもの層（レイヤ）に分かれています。その全体像を示した地図が、OSI参照モデルです。',
        },
        {
          kind: 'text',
          text: '層は全部で7つ。ただし、今すぐ全部を覚える必要はありません。この章の主役は、下から4つ ―― [[amber:L4]]・[[blue:L3]]・[[green:L2]]・L1です。上の3つ（L5〜L7）は、名前と位置だけ確認して先へ進みます。',
        },
        {
          kind: 'figure',
          figure: {
            kind: 'osi-stack',
            id: 'ch1-osi-stack',
            title: 'OSI参照モデルの7層',
            caption: 'まずは全体の地図。この章では下の[[green:L1〜L4]]を中心に読みます。',
            takeaway: 'OSIは暗記表ではなく、いまどの層の話かを指さすための地図。',
            layers: [
              { label: 'L7', name: 'アプリケーション層', desc: 'HTTPやDNSなど、人やアプリに近い通信の意味を扱う', example: 'HTTP, DNS', tone: 'slate', highlight: false },
              { label: 'L6', name: 'プレゼンテーション層', desc: '文字コードや暗号化など、表現の変換を扱う', example: 'TLSの暗号化', tone: 'slate', highlight: false },
              { label: 'L5', name: 'セッション層', desc: '通信の開始から終了までのまとまりを扱う', example: 'セッション管理', tone: 'slate', highlight: false },
              { label: 'L4', name: 'トランスポート層', desc: 'ポート番号で「相手の中のどのアプリか」を区別する', example: 'TCP, UDP, ポート', tone: 'amber' },
              { label: 'L3', name: 'ネットワーク層', desc: 'IPアドレスで、別ネットワークまでの道筋を決める', example: 'IP, ルーティング', tone: 'blue' },
              { label: 'L2', name: 'データリンク層', desc: '同じリンク上の隣へ、MACアドレスで届ける', example: 'Ethernet, MAC, ARP', tone: 'emerald' },
              { label: 'L1', name: '物理層', desc: 'ケーブルや電波で 0/1 の信号そのものを運ぶ', example: 'UTP, 光, 電波', tone: 'slate' },
            ],
          },
        },
      ],
    },
    {
      heading: 'データは「包んで」送り、「開いて」受け取る',
      blocks: [
        {
          kind: 'text',
          text: 'アプリが送るデータは、そのままケーブルに流れるわけではありません。下の層へ渡すたびに、その層のあて名や制御情報を、ヘッダとして外側に巻きつけていきます。この仕組みがカプセル化です。',
        },
        {
          kind: 'text',
          text: 'データはL4・L3・L2の順に包まれ、下の図のような入れ子になります。どこまで包んだかで呼び名が変わり、L4までを[[amber:セグメント]]、L3までを[[blue:パケット]]、L2までを[[green:フレーム]]と呼びます。',
        },
        {
          kind: 'text',
          text: 'そして、送って終わりではありません。受け取った側は外側から順にヘッダを外し、中のデータを取り出します。この逆向きの作業がデカプセル化です。相手が開いて、はじめて通信が成立します。',
        },
        {
          kind: 'figure',
          figure: {
            kind: 'encap',
            id: 'ch1-encap',
            title: 'フレーム・パケット・セグメントの入れ子',
            caption: '同じデータを「どこまで包んだか」で呼び分けます。送信は外へ包み、受信は外から外します。',
            takeaway: '別々の3つではなく、ひとつのデータの「包んだ深さ」の違い。',
            dataLabel: 'データ',
            levels: [
              { unit: 'Ethernetフレーム', layerLabel: 'L2', header: 'L2ヘッダ（MAC）', trailer: 'FCS', tone: 'emerald' },
              { unit: 'IPパケット', layerLabel: 'L3', header: 'L3ヘッダ（IP）', tone: 'blue' },
              { unit: 'TCPセグメント', layerLabel: 'L4', header: 'L4ヘッダ（ポート）', tone: 'amber' },
            ],
          },
        },
      ],
    },
    {
      heading: 'MAC・IP・ポートは役割が違う',
      blocks: [
        {
          kind: 'text',
          text: 'ヘッダの中でとくに大事なのが、3つの「あて名」です。よく混同するので、ここで一度きっぱり分けておきます。',
        },
        {
          kind: 'text',
          text: '結論から言えば ―― [[green:MACアドレスは「すぐ隣の相手」]]、[[blue:IPアドレスは「最終的な相手」]]、[[amber:ポート番号は「相手の中のどのアプリか」]]。',
        },
        {
          kind: 'figure',
          figure: {
            kind: 'address-table',
            id: 'ch1-address',
            title: 'MAC・IPアドレス・ポート番号の早見表',
            caption: '3つのあて名を、同じ目線で並べました。',
            takeaway: '[[green:MACは区間ごとに変わる]]、[[blue:IPは基本そのまま]]。この違いが次の節で効いてきます。',
            rows: [
              { name: 'MACアドレス', layer: 'L2', carries: 'すぐ隣の相手', scope: '同じリンクの中だけ。ルータを越えると次の区間用に変わる', example: '00:11:22:33:44:55', tone: 'emerald' },
              { name: 'IPアドレス', layer: 'L3', carries: '最終的な相手', scope: '端から端まで。基本的に途中で変わらない', example: '172.16.0.20', tone: 'blue' },
              { name: 'ポート番号', layer: 'L4', carries: '相手の中のアプリ', scope: '相手の端末の中。443ならHTTPS', example: 'TCP/443', tone: 'amber' },
            ],
          },
        },
      ],
    },
    {
      heading: 'LANの外へ出る前に ―― 出口ルータとARP',
      blocks: [
        {
          kind: 'text',
          text: '同じLANの中の相手に送るだけなら簡単です。相手のMACを調べて、そのまま渡せばよいだけ。むずかしいのは、LANの外（別ネットワーク）にいるWebサーバへ送るときです。',
        },
        {
          kind: 'text',
          text: 'LANの外宛ての通信は、まず[[blue:出口のルータ]]に預けます。この出口役のルータを、デフォルトゲートウェイと呼びます。PCには必ず1つ設定されていて、「自分のLAN以外への通信は、ここに渡す」という決まった出口です。',
        },
        {
          kind: 'text',
          text: 'つまりPCが最初にフレームを渡す相手は、Webサーバではなく出口ルータ。ところがPCは、その出口ルータのMACをまだ知りません。そこで「このIPの人、MACを教えて」と同じLANへ問い合わせます。これがARPです。',
        },
        { kind: 'figure', figure: arpFigure },
        {
          kind: 'callout',
          tone: 'warn',
          title: 'よくある勘違い',
          body: '「IPが分かれば相手のMACもすぐ分かる」と思いがちですが、LANの外にいる相手のMACは調べません。最初のフレームのあて先MACは、いつも“すぐ隣”の出口ルータです。',
        },
      ],
    },
    {
      heading: 'PCからWebサーバまで、通して見る',
      blocks: [
        {
          kind: 'text',
          text: '材料がそろいました。いよいよ本番です。HTTPS（ポート443）でPCからWebサーバへつながるまでを、構成図の上で一区間ずつ追いかけます。',
        },
        {
          kind: 'text',
          text: '見てほしいのは1点だけ。区間ごとに[[green:あて先MACは書き換わる]]のに、[[blue:あて先IPは最後までWebサーバのまま]]だということ。下の表の「変わる／そのまま」に注目しながら、「次へ」で進めてください。',
        },
        { kind: 'figure', figure: webFlowFigure },
      ],
    },
    {
      heading: '午後問題では「境界」と「次に渡す相手」を読む',
      blocks: [
        {
          kind: 'text',
          text: 'ここまでの見方は、そのままネスペ午後の構成図読解に使えます。図を渡されたら、まず「どこがLANの境界か」「この通信は次にどの機器へ渡すのか」を探します。',
        },
        {
          kind: 'text',
          text: '「なぜ通信できないのか」と問われたら、機器ごとの判断材料へ戻ります。[[green:L2SWはMAC]]、[[blue:ルータはIP]]を見て動きます。どの層で止まっているのかを切り分けることが、答えの根拠になります。',
        },
        {
          kind: 'callout',
          tone: 'info',
          title: '実務でも順番は同じ',
          body: '障害の切り分けも同じ考え方です。出口ルータまで届いているか、名前解決はできているか、相手のポートは開いているか。層で分けると、どこを調べればよいかが見えてきます。',
        },
      ],
    },
  ],
  takeaways: [
    'OSI参照モデルは、いまどの層の話かを指さすための地図。',
    '通信は外へ包んで送り（カプセル化）、外から開いて受け取る（デカプセル化）。送って終わりではありません。',
    '[[green:MACはすぐ隣]]・[[blue:IPは最終的な相手]]・[[amber:ポートは相手の中のアプリ]]。',
    'LANの外宛ての最初のあて先MACは、相手ではなく出口ルータ（デフォルトゲートウェイ）。',
    'ルータを越えても変わらない[[blue:あて先IP]]、区間ごとに書き換わる[[green:MAC]]。',
  ],
}
