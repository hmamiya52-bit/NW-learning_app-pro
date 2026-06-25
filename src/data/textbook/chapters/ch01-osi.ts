import type { PacketFlowFigure, TextbookChapter, Topology } from '../types'

// 第1章で使う最小構成のトポロジ（PC—L2SW—ルータ—Webサーバ）
const arpTopology: Topology = {
  zones: [{ id: 'internal', label: '内部LAN 192.168.10.0/24', tone: 'sky' }],
  nodes: [
    { id: 'pc', label: 'PC', role: 'pc', zoneId: 'internal', sub: '192.168.10.10' },
    { id: 'l2sw', label: 'L2SW', role: 'switch', zoneId: 'internal', sub: '内部LAN' },
    { id: 'l3sw', label: 'ルータ', role: 'router', zoneId: 'internal', sub: 'デフォルトGW・192.168.10.1' },
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
    { id: 'l3sw', label: 'ルータ', role: 'router', sub: 'デフォルトGW' },
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
  title: 'PCがデフォルトゲートウェイのMACを調べる（ARP）',
  caption: 'ARPの問い合わせは同じLANの全員へ。デフォルトゲートウェイが自分のMACを返します。',
  takeaway: '別ネットワーク宛てのとき、最初に調べるMACは相手ではなく[[green:デフォルトゲートウェイ]]のもの。',
  topology: arpTopology,
  steps: [
    {
      focus: { type: 'link', a: 'pc', b: 'l2sw' },
      packetLabel: 'ARP要求',
      headers: { l2: 'あて先MAC = 全員あて（ブロードキャスト）', l3: 'IPヘッダなし（ARPはL2で動く）' },
      explanation: 'PCが「192.168.10.1のMACを教えて」と、同じLANの全員へ問い合わせます。',
    },
    {
      focus: { type: 'link', a: 'l2sw', b: 'l3sw' },
      packetLabel: 'ARP要求',
      headers: { l2: 'あて先MAC = 全員あて（ブロードキャスト）', l3: 'IPヘッダなし' },
      explanation: 'L2SWは全員あてのフレームを、同じLANの全ポートへ配ります。',
    },
    {
      focus: { type: 'link', a: 'l3sw', b: 'l2sw' },
      packetLabel: 'ARP応答',
      headers: { l2: 'あて先MAC = PC', l3: 'IPヘッダなし' },
      explanation: 'デフォルトゲートウェイが「私です」と応答。今度は全員あてではなく、PCあての1対1です。',
    },
    {
      focus: { type: 'link', a: 'l2sw', b: 'pc' },
      packetLabel: 'ARP応答',
      headers: { l2: 'あて先MAC = PC', l3: 'IPヘッダなし' },
      explanation: 'PCはそのMACを受け取って記録。これで最初のフレームを作れる状態になりました。',
    },
  ],
}

const webFlowFigure: PacketFlowFigure = {
  kind: 'packet-flow',
  id: 'ch1-web',
  title: 'PCからWebサーバへ届くまで',
  caption: 'いま説明している区間が青く光ります。下の表（封筒のあて名）で、区間ごとに何が変わり何が変わらないかを見比べてください。',
  takeaway: '区間ごとに変わる[[green:あて先MAC]]、最後まで変わらない[[blue:あて先IP]]。ルータは[[blue:あて先IP]]で道を選び、次の区間用に[[green:MAC]]を付け替えます。',
  topology: webTopology,
  steps: [
    {
      focus: { type: 'link', a: 'pc', b: 'l2sw' },
      packetLabel: 'TCP SYN',
      headers: { l2: 'あて先MAC = ルータ', l3: 'あて先IP = 172.16.0.20（Webサーバ）', l4: 'あて先ポート = 443' },
      status: { l2: 'same', l3: 'same', l4: 'same' },
      explanation: 'あて先IPはWebサーバのまま、最初のあて先MACをルータにして送り出します。',
    },
    {
      focus: { type: 'link', a: 'l2sw', b: 'l3sw' },
      packetLabel: 'TCP SYN',
      headers: { l2: 'あて先MAC = ルータ', l3: 'あて先IP = 172.16.0.20', l4: 'あて先ポート = 443' },
      status: { l2: 'same', l3: 'same', l4: 'same' },
      explanation: 'L2SWはあて先MACを見て中継するだけ。ヘッダは書き換えません。',
    },
    {
      focus: { type: 'node', id: 'l3sw' },
      packetLabel: 'MACを付け替え',
      headers: { l2: 'あて先MAC = Webサーバ（書き換え）', l3: 'あて先IP = 172.16.0.20（そのまま）', l4: 'あて先ポート = 443' },
      status: { l2: 'change', l3: 'same', l4: 'same' },
      explanation: 'ルータはL2を外し、あて先IPで進む道を選んで、新しいL2を付け直します。',
    },
    {
      focus: { type: 'link', a: 'l3sw', b: 'web' },
      packetLabel: 'TCP SYN',
      headers: { l2: 'あて先MAC = Webサーバ', l3: 'あて先IP = 172.16.0.20', l4: 'あて先ポート = 443' },
      status: { l2: 'same', l3: 'same', l4: 'same' },
      explanation: '新しいフレームでWebサーバへ到着。あて先IPは出発時からずっと同じです。',
    },
    {
      focus: { type: 'node', id: 'web' },
      packetLabel: '受信して開封',
      headers: { l2: 'L2ヘッダを外す', l3: 'L3ヘッダを外す', l4: 'ポート443 → HTTPSへ渡す' },
      status: { l2: 'strip', l3: 'strip' },
      explanation: 'L2・L3を外し、ポート443を見てHTTPSのアプリへ。これがデカプセル化です。',
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
          text: '層は全部で7つ。ただし、今すぐ全部を覚える必要はありません。この章の主役は、下の4つ ―― L1・[[green:L2]]・[[blue:L3]]・[[amber:L4]]です。上の3つ（L5〜L7）は、名前と位置だけ確認して先へ進みます。',
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
              { label: 'L7', name: 'アプリケーション層', desc: 'HTTPやDNSなど、人やアプリに近い通信の意味', example: 'HTTP, DNS', tone: 'slate', highlight: false },
              { label: 'L6', name: 'プレゼンテーション層', desc: '文字コードや暗号化など、表現の変換', example: 'TLSの暗号化', tone: 'slate', highlight: false },
              { label: 'L5', name: 'セッション層', desc: '通信の開始から終了までのまとまり', example: 'セッション管理', tone: 'slate', highlight: false },
              { label: 'L4', name: 'トランスポート層', desc: 'ポート番号で見分ける、相手の中のアプリ', example: 'TCP, UDP, ポート', tone: 'amber' },
              { label: 'L3', name: 'ネットワーク層', desc: 'IPアドレスで決める、別ネットワークまでの道筋', example: 'IP, ルーティング', tone: 'blue' },
              { label: 'L2', name: 'データリンク層', desc: 'MACアドレスで届ける、同じリンク上のすぐ隣', example: 'Ethernet, MAC, ARP', tone: 'emerald' },
              { label: 'L1', name: '物理層', desc: 'ケーブルや電波で運ぶ、0/1の信号そのもの', example: 'UTP, 光, 電波', tone: 'slate' },
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
            caption: '「次へ」で1枚ずつ包み、受信側では同じ順を逆にたどって外します。包む順と外す順は対称です。',
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
            takeaway: '[[green:MACは区間ごとに変わり]]、[[blue:IPは基本そのまま]]。この違いが次の節で効いてきます。',
            rows: [
              { name: 'MACアドレス', layer: 'L2', carries: 'すぐ隣の相手', scope: '同じリンクの中だけ。ルータを越えるたびに次の区間用へ付け替え', example: '00:11:22:33:44:55', tone: 'emerald' },
              { name: 'IPアドレス', layer: 'L3', carries: '最終的な相手', scope: '端から端まで。途中では基本的に不変', example: '172.16.0.20', tone: 'blue' },
              { name: 'ポート番号', layer: 'L4', carries: '相手の中のアプリ', scope: '相手の端末の中。443ならHTTPS', example: 'TCP/443', tone: 'amber' },
            ],
          },
        },
      ],
    },
    {
      heading: 'LANの外へ出る前に ―― デフォルトゲートウェイとARP',
      blocks: [
        {
          kind: 'text',
          text: '同じLANの中の相手に送るだけなら簡単です。相手のMACを調べて、そのまま渡せばよいだけ。むずかしいのは、LANの外（別ネットワーク）にいるWebサーバへ送るときです。',
        },
        {
          kind: 'text',
          text: 'では、PCはどうやって「同じLANか、外か」を見分けるのでしょうか。使うのはIPアドレスの[[blue:ネットワーク部]]です。192.168.10.0/24 の「/24」は「先頭24ビットが同じなら同じネットワーク（セグメント）」という意味。PCは相手のIPのこの部分を自分と見比べ、[[green:同じネットワークなら相手へ直接]]、[[blue:違えば出口（デフォルトゲートウェイ）へ]]渡します。ビット単位の計算は第6章で詳しく扱います。',
        },
        {
          kind: 'text',
          text: '今回のWebサーバ（172.16.0.20）は、PC（192.168.10.10）とは別ネットワーク。だからまず[[blue:LANの出口にあるルータ]]に渡します。このルータを、デフォルトゲートウェイと呼びます。PCには「自分のネットワーク以外への通信は、ここへ渡す」という既定の渡し先として、1つ設定されています。',
        },
        {
          kind: 'text',
          text: 'つまりPCが最初にフレームを渡す相手は、Webサーバではなくデフォルトゲートウェイです。ところがPCは、そのMACをまだ知りません。そこで「このIPの人、MACを教えて」と同じLANへ問い合わせます。これがARPです。',
        },
        { kind: 'figure', figure: arpFigure },
        {
          kind: 'callout',
          tone: 'warn',
          title: 'よくある勘違い',
          body: '「IPが分かれば相手のMACもすぐ分かる」と思いがちですが、そうではありません。同じネットワークの相手なら直接そのMACを、別ネットワークならデフォルトゲートウェイのMACをARPで調べます。',
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
        {
          kind: 'callout',
          tone: 'tip',
          title: '送信元も同じ規則',
          body: '同じことが送信元側でも起きています。送信元MACは区間ごとに変わり、送信元IPはPCのまま。午後問題で「送信元／あて先」を問われたら、この対称性を思い出してください。',
        },
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
          body: '障害の切り分けも同じ考え方です。デフォルトゲートウェイまで届いているか、名前解決（名前からIPを調べる手順）はできているか、相手のポートは開いているか。層で分けると、どこを調べればよいかが見えてきます。',
        },
      ],
    },
  ],
  takeaways: [
    'OSI参照モデルは、いまどの層の話かを指さすための地図。',
    '通信は外へ包んで送り、外から開いて受け取ります（カプセル化／デカプセル化）。送って終わりではありません。',
    '[[green:MACはすぐ隣]]・[[blue:IPは最終的な相手]]・[[amber:ポートは相手の中のアプリ]]。',
    '別ネットワーク宛ての最初のあて先MACは、相手ではなくデフォルトゲートウェイ（LANの出口にあるルータ）。',
    'ルータを越えても変わらない[[blue:あて先IP]]、区間ごとに書き換わる[[green:MAC]]。',
  ],
}
