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
  title: 'ARPでゲートウェイのMACを調べる',
  caption: 'ARP要求はLAN全体へ。GWが自分のMACを返します。',
  takeaway: '別ネットワーク宛てでも、最初に調べるMACは最終宛先ではなく[[green:GW]]。',
  topology: arpTopology,
  steps: [
    {
      focus: { type: 'link', a: 'pc', b: 'l2sw' },
      packetLabel: 'ARP要求',
      headers: { l2: 'あて先MAC: ブロードキャスト', l3: 'IPヘッダなし（ARP）' },
      concept: { l2: 'LAN内だけに届く' },
      explanation: 'PCが「192.168.10.1を持っているのは誰ですか」と、LAN全体へ呼びかけます。',
    },
    {
      focus: { type: 'link', a: 'l2sw', b: 'l3sw' },
      packetLabel: 'ARP要求',
      headers: { l2: 'あて先MAC: ブロードキャスト', l3: 'IPヘッダなし（ARP）' },
      explanation: 'L2SWはあて先MACを見て、同じLANのポートすべてへフレームを配ります。',
    },
    {
      focus: { type: 'link', a: 'l3sw', b: 'l2sw' },
      packetLabel: 'ARP応答',
      headers: { l2: 'あて先MAC: PC', l3: 'IPヘッダなし（ARP）' },
      explanation: 'GW（L3SW）が「それは私です。MACはこれです」とPCへ返します。',
    },
    {
      focus: { type: 'link', a: 'l2sw', b: 'pc' },
      packetLabel: 'ARP応答',
      headers: { l2: 'あて先MAC: PC', l3: 'IPヘッダなし（ARP）' },
      explanation: 'PCはGWのMACを覚えました。これでようやく、最初のフレームを作れます。',
    },
  ],
}

const webFlowFigure: PacketFlowFigure = {
  kind: 'packet-flow',
  id: 'ch1-web',
  title: 'PCからWebサーバへ届くまで',
  caption: '光っている区間が「いまの説明」。下の表でMACとIPの変化を見比べてください。',
  takeaway: 'ルータ（L3SW）は[[green:L2を付け替える]]だけ。[[blue:あて先IP]]は最初から最後までWebサーバ。',
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
      explanation: 'L2SWはあて先MACだけを見て、GWへ中継します。中のIPアドレスは見ていません。',
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
      explanation: '新しいフレームでWebサーバへ届けます。あて先MACはWebサーバ、あて先IPは最初からずっとWebサーバです。',
    },
    {
      focus: { type: 'node', id: 'web' },
      packetLabel: '受信',
      headers: { l2: 'L2を外す', l3: 'L3を外す', l4: 'ポート443→HTTPSへ' },
      explanation: 'Webサーバは外側からL2・L3・L4の順に外し、ポート443のHTTPSへデータを渡します。',
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
      heading: 'データは「包んで」送る ―― カプセル化',
      blocks: [
        {
          kind: 'text',
          text: 'アプリが送るデータは、そのままケーブルに流れるわけではありません。下の層へ渡すたびに、その層の「あて名」や制御情報を、ヘッダとして外側に巻きつけていきます。この仕組みがカプセル化です。',
        },
        {
          kind: 'text',
          text: '下の図を「次へ」で進めてみてください。データにL4・L3・L2のヘッダが外側へ順に付き、どこまで包んだかによって、呼び名がセグメント・パケット・フレームと変わっていきます。',
        },
        {
          kind: 'figure',
          figure: {
            kind: 'encap',
            id: 'ch1-encap',
            title: 'ヘッダが付いていく順番',
            caption: '「次へ」でヘッダが外側へ1枚ずつ付き、呼び名も変わります。',
            takeaway: '付ける順は内から外へ。受け取った側は、外から順に開きます。',
            steps: [
              {
                label: '送る前',
                title: 'アプリのデータ',
                desc: 'ブラウザが送りたい中身そのもの。',
                parts: [{ label: 'データ', tone: 'slate' }],
              },
              {
                label: 'L4',
                title: 'L4ヘッダを付ける（ポート番号）',
                desc: '「相手のどのアプリ宛てか」を示します。ここまで包んだ中身をセグメントと呼びます。',
                parts: [
                  { label: 'L4ヘッダ', tone: 'amber' },
                  { label: 'データ', tone: 'slate' },
                ],
                unit: { label: 'TCPセグメント', tone: 'amber' },
              },
              {
                label: 'L3',
                title: 'L3ヘッダを付ける（IPアドレス）',
                desc: '「最終的にどの相手か」を示します。ここまで包んだ中身をパケットと呼びます。',
                parts: [
                  { label: 'L3ヘッダ', tone: 'blue' },
                  { label: 'L4ヘッダ', tone: 'amber' },
                  { label: 'データ', tone: 'slate' },
                ],
                unit: { label: 'IPパケット', tone: 'blue' },
              },
              {
                label: 'L2',
                title: 'L2ヘッダとFCSを付ける（MACアドレス）',
                desc: '「すぐ隣のどの相手へ渡すか」を示します。ここまで包めば、リンク上を流れるフレームの完成です。',
                parts: [
                  { label: 'L2ヘッダ', tone: 'emerald' },
                  { label: 'L3ヘッダ', tone: 'blue' },
                  { label: 'L4ヘッダ', tone: 'amber' },
                  { label: 'データ', tone: 'slate' },
                  { label: 'FCS', tone: 'emerald' },
                ],
                unit: { label: 'Ethernetフレーム', tone: 'emerald' },
              },
            ],
          },
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: '呼び名は「どこまで包んだか」で変わる',
          body: 'L4まで包んだ中身が[[amber:セグメント]]、L3まで包めば[[blue:パケット]]、L2まで包めば[[green:フレーム]]です。別々の3つがあるのではなく、同じデータを「どこまで包んだか」で呼び分けているだけ。',
        },
      ],
    },
    {
      heading: 'MAC・IP・ポートは役割が違う',
      blocks: [
        {
          kind: 'text',
          text: 'ヘッダの中でとくに大事なのが、3つの「あて先」です。よく混同するので、ここで一度きっぱり分けておきます。',
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
            caption: '3つのあて先を、同じ目線で並べました。',
            takeaway: '[[green:MACは区間ごとに変わる]]、[[blue:IPは基本そのまま]]。ここが後で効いてきます。',
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
      heading: '通信の最初の一歩 ―― ARP',
      blocks: [
        {
          kind: 'text',
          text: 'PCが別ネットワークのWebサーバへ送るとき、最初に要るのはWebサーバのMACではありません。同じLANにいる出口、つまりデフォルトゲートウェイ（GW）のMACです。',
        },
        {
          kind: 'text',
          text: 'でも、PCはまだGWのMACを知りません。そこで「192.168.10.1を持っているのは誰ですか。MACを教えてください」とLAN全体へ呼びかけます。これがARPです。下の図で、要求と応答の流れを追ってみてください。',
        },
        { kind: 'figure', figure: arpFigure },
        {
          kind: 'callout',
          tone: 'warn',
          title: 'よくある勘違い',
          body: '「IPが分かれば相手のMACもすぐ分かる」と思いがちですが、別ネットワークの相手のMACは調べません。最初のフレームのあて先MACは、いつも“すぐ隣”のGWです。',
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
          text: '見てほしいのは2つだけ。[[green:あて先MACは区間ごとに変わる]]のに、[[blue:あて先IPはずっとWebサーバのまま]]ということ。「次へ」で1区間ずつ確かめてください。',
        },
        { kind: 'figure', figure: webFlowFigure },
      ],
    },
    {
      heading: '午後問題では「境界」と「次ホップ」を読む',
      blocks: [
        {
          kind: 'text',
          text: 'ここまでの見方は、そのままネスペ午後の構成図読解に使えます。図を渡されたら、まず「どこがLANの境界か」「この通信の“次の一歩”はどの機器か」を探します。',
        },
        {
          kind: 'text',
          text: '「なぜ通信できないのか」と問われたら、機器ごとの判断材料へ戻ります。[[green:L2SWはMAC]]、[[blue:ルータ／L3SWはIP]]。どの層で止まっているかを切り分けることが、答えの根拠になります。',
        },
        {
          kind: 'callout',
          tone: 'info',
          title: '実務でも順番は同じ',
          body: '障害の切り分けも同じ考え方です。GWまで届いているか、名前解決はできているか、相手のポートは開いているか。層で分けると、どこを調べればよいかが見えてきます。',
        },
      ],
    },
  ],
  takeaways: [
    'OSI参照モデルは、いまどの層の話かを指さすための地図。',
    '送るときは外へ向けてヘッダを重ねる「カプセル化」、受けるときは外から開く「デカプセル化」。',
    '[[green:MACは隣]]・[[blue:IPは最終的な相手]]・[[amber:ポートは相手の中のアプリ]]。',
    '別ネットワーク宛てでも、最初のあて先MACはデフォルトゲートウェイ。',
    'ルータを越えても変わらない[[blue:あて先IP]]、区間ごとに変わる[[green:MAC]]。',
  ],
}
