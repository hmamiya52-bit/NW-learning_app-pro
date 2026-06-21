import type { PacketFlowFigure, TextbookChapter, Topology } from '../types'

// 第1章で使う最小構成のトポロジ（PC—L2SW—L3SW—Webサーバ）
const arpTopology: Topology = {
  zones: [{ id: 'internal', label: '内部LAN 192.168.10.0/24', tone: 'sky' }],
  nodes: [
    { id: 'pc', label: 'PC', role: 'pc', zoneId: 'internal', sub: '192.168.10.10' },
    { id: 'l2sw', label: 'L2SW', role: 'switch', zoneId: 'internal', sub: '内部LAN' },
    { id: 'l3sw', label: 'L3SW', role: 'router', zoneId: 'internal', sub: 'GW 192.168.10.1' },
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
    { id: 'l3sw', label: 'L3SW', role: 'router', sub: 'GW / 経路判断' },
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
  title: '動く図：ARPで「隣のあて先」を調べる',
  caption: 'ARP要求はLAN全体へ。GWが自分のMACを返します。',
  takeaway: '別ネットワーク宛てでも、最初に調べるMACは最終宛先ではなく[[green:GW]]。',
  topology: arpTopology,
  steps: [
    {
      focus: { type: 'link', a: 'pc', b: 'l2sw' },
      packetLabel: 'ARP要求',
      headers: { l2: 'あて先MAC: ブロードキャスト', l3: 'IPヘッダなし（ARP）' },
      concept: { l2: 'LAN内だけに届く' },
      explanation: 'PCが「192.168.10.1を持っている人、MACを教えて」とLAN全体へ呼びかけます。',
    },
    {
      focus: { type: 'link', a: 'l2sw', b: 'l3sw' },
      packetLabel: 'ARP要求',
      headers: { l2: 'あて先MAC: ブロードキャスト', l3: 'IPヘッダなし（ARP）' },
      explanation: 'L2SWはあて先MACを見て、同じLANの全ポートへフレームを配ります。',
    },
    {
      focus: { type: 'link', a: 'l3sw', b: 'l2sw' },
      packetLabel: 'ARP応答',
      headers: { l2: 'あて先MAC: PC', l3: 'IPヘッダなし（ARP）' },
      explanation: 'GW（L3SW）が「それは私です、MACはこれ」とPCへ返します。',
    },
    {
      focus: { type: 'link', a: 'l2sw', b: 'pc' },
      packetLabel: 'ARP応答',
      headers: { l2: 'あて先MAC: PC', l3: 'IPヘッダなし（ARP）' },
      explanation: 'PCはGWのMACを覚えました。これでやっと、最初のフレームを作れます。',
    },
  ],
}

const webFlowFigure: PacketFlowFigure = {
  kind: 'packet-flow',
  id: 'ch1-web',
  title: '動く図：PCからWebサーバまで通して見る',
  caption: '光っている区間が「いまの説明」。下の表でMACとIPの変化を見比べてください。',
  takeaway: 'ルータ(L3SW)は[[green:L2を付け替える]]だけ。[[blue:あて先IP]]は最初から最後までWebサーバ。',
  topology: webTopology,
  steps: [
    {
      focus: { type: 'link', a: 'pc', b: 'l2sw' },
      packetLabel: 'TCP SYN',
      headers: { l2: 'あて先MAC: GW(L3SW)', l3: 'あて先IP: 172.16.0.20', l4: 'あて先ポート: 443' },
      concept: { l2: '区間ごとに変わる', l3: '最終宛先のまま' },
      explanation: 'PCはWebサーバ宛てのIPはそのままに、最初のフレームのあて先MACをGWにして送り出します。',
    },
    {
      focus: { type: 'link', a: 'l2sw', b: 'l3sw' },
      packetLabel: 'TCP SYN',
      headers: { l2: 'あて先MAC: GW(L3SW)', l3: 'あて先IP: 172.16.0.20', l4: 'あて先ポート: 443' },
      concept: { l2: '区間ごとに変わる', l3: '最終宛先のまま' },
      explanation: 'L2SWはあて先MACだけを見てGWへ中継します。中のIPは見ていません。',
    },
    {
      focus: { type: 'node', id: 'l3sw' },
      packetLabel: '付け替え',
      headers: { l2: 'あて先MAC: 次ホップへ', l3: 'あて先IP: 172.16.0.20（不変）', l4: 'あて先ポート: 443' },
      concept: { l3: 'ここでも変わらない' },
      explanation: 'L3SWはL2をいったん外し、IPを見て道を選び、次の区間用のL2を付け直します。変わるのはMACだけです。',
    },
    {
      focus: { type: 'link', a: 'l3sw', b: 'web' },
      packetLabel: 'TCP SYN',
      headers: { l2: 'あて先MAC: Webサーバ', l3: 'あて先IP: 172.16.0.20', l4: 'あて先ポート: 443' },
      concept: { l2: 'また変わった', l3: 'まだ同じ' },
      explanation: '新しいフレームでWebサーバへ。あて先MACはWebサーバ、あて先IPは最初からずっとWebサーバです。',
    },
    {
      focus: { type: 'node', id: 'web' },
      packetLabel: '受信',
      headers: { l2: 'L2を外す', l3: 'L3を外す', l4: 'ポート443→HTTPSへ' },
      explanation: 'Webサーバは外側からL2→L3→L4と開けて、ポート443のHTTPSへデータを渡します。',
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
      text: 'ネットワークの勉強を始めて最初にぶつかる壁は、用語の多さそのものより「いま、構成図のどこの話をしているのか」が分からなくなることです。',
    },
    {
      kind: 'text',
      text: 'MACアドレス、IPアドレス、ポート番号、フレーム、パケット…… これらがいっぺんに出てくると頭の中が散らかります。この章は、その散らかりを片付ける「地図」を最初に手に入れる回です。',
    },
    {
      kind: 'text',
      text: '難しいコマンドや暗記はしません。小さな構成図の上で、パケットがPCからWebサーバへ届くまでを、実際に動かしながら追いかけます。',
    },
  ],
  sections: [
    {
      heading: '通信は「層」で見ると迷わない',
      blocks: [
        {
          kind: 'text',
          text: '通信は、役割ごとに層（レイヤ）が分かれています。この層分けの地図がOSI参照モデルです。7つの層に分けて、「いまはどの層の話か」を見分けるための物差しだと思ってください。',
        },
        {
          kind: 'text',
          text: '全部を一度に覚える必要はありません。この章で主役になるのは下の4つ ―― [[amber:L4]]・[[blue:L3]]・[[green:L2]]・L1です。上の3つ（L5〜L7）は名前と位置だけ押さえて先へ進みます。',
        },
        {
          kind: 'figure',
          figure: {
            kind: 'osi-stack',
            id: 'ch1-osi-stack',
            title: 'OSI参照モデルの7層',
            caption: 'まず7層の地図。この章では下の[[green:L1〜L4]]を中心に読みます。',
            takeaway: 'OSIは暗記表ではなく、「いまどの層の話か」を指さすための地図。',
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
      heading: 'データは送るとき、順番に"包まれて"いく',
      blocks: [
        {
          kind: 'text',
          text: 'アプリが送りたいデータは、そのままケーブルに流れるわけではありません。下の層へ渡すたびに、その層の宛名や制御情報を「ヘッダ」として外側に巻きつけていきます。これがカプセル化です。',
        },
        {
          kind: 'text',
          text: '下の図の再生ボタンを押すと、データにL4→L3→L2の順でヘッダが付いていく様子が見えます。',
        },
        {
          kind: 'figure',
          figure: {
            kind: 'encap',
            id: 'ch1-encap',
            title: '動く図：ヘッダが外側へ1枚ずつ付く',
            caption: '再生すると、ヘッダが外側へ1枚ずつ付いていきます。',
            takeaway: '付ける順は内→外でL4→L3→L2。受け取った側は外側から順に開けます。',
            steps: [
              { label: '送る前', title: 'アプリのデータ', desc: 'ブラウザが送りたい中身そのもの。', parts: [{ label: 'データ', tone: 'slate' }] },
              { label: 'L4', title: 'ポート番号を付ける', desc: '「相手のどのアプリ宛てか」を示すL4ヘッダ。', parts: [{ label: 'L4', tone: 'amber' }, { label: 'データ', tone: 'slate' }] },
              { label: 'L3', title: 'IPアドレスを付ける', desc: '「最終的にどの相手か」を示すL3ヘッダ。', parts: [{ label: 'L3', tone: 'blue' }, { label: 'L4', tone: 'amber' }, { label: 'データ', tone: 'slate' }] },
              { label: 'L2', title: 'MACアドレスを付ける', desc: '「すぐ隣のどの相手へ渡すか」を示すL2ヘッダと、末尾の点検用FCS。', parts: [{ label: 'L2', tone: 'emerald' }, { label: 'L3', tone: 'blue' }, { label: 'L4', tone: 'amber' }, { label: 'データ', tone: 'slate' }, { label: 'FCS', tone: 'emerald' }] },
            ],
          },
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'フレーム・パケット・セグメントは入れ子',
          body: 'L2まで包んだものを[[green:フレーム]]、L3まで包んだ中身を[[blue:パケット]]、L4まで包んだ中身を[[amber:セグメント]]と呼びます。別物が3つあるのではなく、同じデータを「どこまで包んだ状態で呼んでいるか」の違いです。',
        },
      ],
    },
    {
      heading: 'MAC・IP・ポートは、似ているようで役割が違う',
      blocks: [
        {
          kind: 'text',
          text: 'ヘッダの中でとくに大事なのが、3つの「あて先」です。混同しやすいので、ここで一度きっぱり分けておきます。',
        },
        {
          kind: 'text',
          text: 'ひとことで言うと ―― [[green:MACアドレスは「すぐ隣の相手」]]、[[blue:IPアドレスは「最終的な相手」]]、[[amber:ポート番号は「相手の中のどのアプリか」]]。',
        },
        {
          kind: 'figure',
          figure: {
            kind: 'address-table',
            id: 'ch1-address',
            title: '3つのあて先の早見表',
            caption: '3つのあて先を、同じ目線で並べました。',
            takeaway: '[[green:MACは区間ごとに変わる]]。[[blue:IPは基本そのまま]]。ここが後で効いてきます。',
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
      heading: '通信の最初の一歩 ―― ARPで「隣のあて先」を調べる',
      blocks: [
        {
          kind: 'text',
          text: 'PCが別ネットワークのWebサーバへ送りたいとき、最初に必要なのはWebサーバのMAC……ではありません。必要なのは、同じLANにいる出口、つまりデフォルトゲートウェイ（GW）のMACです。',
        },
        {
          kind: 'text',
          text: 'ところがPCは、まだGWのMACを知りません。そこで「192.168.10.1を持っている人、MACを教えて」とLAN全体に呼びかけます。これがARPです。下の図で動きを追ってみてください。',
        },
        { kind: 'figure', figure: arpFigure },
        {
          kind: 'callout',
          tone: 'warn',
          title: 'ここを間違えやすい',
          body: '「IPが分かれば相手のMACもすぐ分かる」と思いがちですが、別ネットワークの相手のMACは調べません。最初のフレームのあて先MACは、いつも“すぐ隣”のGWです。',
        },
      ],
    },
    {
      heading: 'PCからWebサーバまで、通して動かす',
      blocks: [
        {
          kind: 'text',
          text: '材料がそろいました。いよいよ本番です。HTTPS（ポート443）でPCからWebサーバへつながるまでを、構成図の上で一区間ずつ追いかけます。',
        },
        {
          kind: 'text',
          text: '注目してほしいのは2つだけ。[[green:あて先MACは区間ごとに変わる]]のに、[[blue:あて先IPはずっとWebサーバのまま]]だということ。再生して確かめてください。',
        },
        { kind: 'figure', figure: webFlowFigure },
      ],
    },
    {
      heading: '午後問題では「境界」と「次ホップ」を読む',
      blocks: [
        {
          kind: 'text',
          text: 'ここまで見てきた目線は、そのままネスペ午後の構成図読解に使えます。図を渡されたら、まず「どこがLANの境界か」「この通信の“次の一歩”はどの機器か」を探します。',
        },
        {
          kind: 'text',
          text: '「なぜ通信できないか」と問われたら、機器ごとに見ている情報へ戻ります。[[green:L2SWはMAC]]、[[blue:ルータ/L3SWはIP]]。どの層で詰まっているかを切り分けるのが、答えの根拠になります。',
        },
        {
          kind: 'callout',
          tone: 'info',
          title: '実務でも順番は同じ',
          body: '障害切り分けも考え方は同じです。GWまで届いているか、名前解決はできているか、相手のポートは開いているか。層で分けると、どこを調べればいいかが落ち着きます。',
        },
      ],
    },
  ],
  takeaways: [
    'OSI参照モデルは暗記表ではなく、「いまどの層の話か」を指さす地図。',
    '送るときは外側へ[[green:L2]]→[[blue:L3]]→[[amber:L4]]の中身を包み（カプセル化）、受けるときは外側から開ける。',
    '[[green:MACは隣]]・[[blue:IPは最終相手]]・[[amber:ポートは相手の中のアプリ]]。',
    '別ネットワーク宛ての最初のあて先MACは、最終宛先ではなくデフォルトゲートウェイ。',
    'ルータを越えても[[blue:あて先IPは変わらない]]。変わるのは[[green:区間ごとのMAC]]。',
  ],
}
