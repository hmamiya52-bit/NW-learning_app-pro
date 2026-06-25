import type { RecordTableFigure, SequenceFigure, TextbookChapter } from '../types'

// 第3章 第1章で出した「TCP SYN」「ポート443」の中身。会話をズームする（構成図は増やさない）。

const handshakeFigure: SequenceFigure = {
  kind: 'sequence',
  id: 'ch3-3way',
  title: 'つなぐ（3wayハンドシェイク）',
  caption: 'データを送る前の、つなぐための3往復（SYN→SYN・ACK→ACK）。',
  takeaway: '送る前にまず「つなぐ」。3往復で互いの準備を確かめます。',
  actors: [
    { id: 'pc', label: 'PC', role: 'pc' },
    { id: 'web', label: 'Webサーバ', role: 'server' },
  ],
  messages: [
    {
      from: 'pc',
      to: 'web',
      label: '① SYN',
      note: 'PCが「つなぎたい」と合図します。第1章で最初に飛んでいったのが、このSYNでした。',
    },
    {
      from: 'web',
      to: 'pc',
      label: '② SYN・ACK',
      note: 'Webサーバが「いいですよ。そちらも準備できていますか？」と応えます。',
    },
    {
      from: 'pc',
      to: 'web',
      label: '③ ACK',
      note: 'PCが「こちらもOK」と返して接続が成立。ここではじめてデータを送れます。',
    },
  ],
}

const tcpUdpFigure: RecordTableFigure = {
  kind: 'record-table',
  id: 'ch3-tcp-udp',
  title: 'TCPとUDPの違い',
  caption: '確実さをとるか、速さをとるか。同じL4でも性格が逆です。',
  takeaway: 'TCP＝確実（確認・順序・再送）、UDP＝軽快（確認しない）。',
  rowHeader: true,
  columns: [
    { key: 'item', label: '項目' },
    { key: 'tcp', label: 'TCP' },
    { key: 'udp', label: 'UDP' },
  ],
  rows: [
    { item: 'つなぐ', tcp: 'つないでから送信', udp: 'いきなり送信' },
    { item: '届いたか', tcp: '確認し、抜けたら再送', udp: '確認なし（取りこぼし許容）' },
    { item: '順序', tcp: '順番どおりに整列', udp: '整列なし' },
    { item: '速さ・重さ', tcp: '確実だがやや重め', udp: '軽量・高速' },
    { item: '主な用途', tcp: 'Web・メール・ファイル転送', udp: '音声・動画・DNS' },
  ],
}

const tupleFigure: RecordTableFigure = {
  kind: 'record-table',
  id: 'ch3-tuple',
  title: '1本の通信を見分ける5つの情報',
  caption: '同じPCから同じサーバへの2本も、[[amber:送信元ポート]]が違えば別物。',
  takeaway: '送信元IP・宛先IP・プロトコル・送信元ポート・宛先ポートの5つで通信は一意。',
  rowHeader: true,
  emphasizeKey: 'srcport',
  columns: [
    { key: 'name', label: '通信' },
    { key: 'srcip', label: '送信元IP' },
    { key: 'dstip', label: '宛先IP' },
    { key: 'proto', label: 'プロトコル' },
    { key: 'srcport', label: '送信元ポート' },
    { key: 'dstport', label: '宛先ポート' },
  ],
  rows: [
    { name: '① 1本目', srcip: '192.168.10.10', dstip: '172.16.0.20', proto: 'TCP', srcport: '51000', dstport: '443' },
    { name: '② 2本目（同時）', srcip: '192.168.10.10', dstip: '172.16.0.20', proto: 'TCP', srcport: '51001', dstport: '443' },
  ],
}

export const ch03TcpUdpPort: TextbookChapter = {
  id: 'tcp-udp-port',
  order: 3,
  title: 'TCP・UDPとポート番号',
  summary: 'コネクションを張るTCPの3wayハンドシェイク、UDPとの違い、ポートでの通信の見分け方を読めるようにします。',
  status: 'published',
  estimatedMinutes: 18,
  intro: [
    {
      kind: 'text',
      text: '第1章で、PCからWebサーバへ最初に飛んでいくパケットを「TCP SYN」と呼びました。あれは何の始まりだったのか。この章で、その正体を見ます。',
    },
    {
      kind: 'text',
      text: 'データをいきなり送りつけるのではなく、TCPはまず[[blue:つなぐ]]作業から始めます。つないでから送る ―― その仕組みと、似て非なるUDP、そして通信を見分ける[[amber:ポート]]を扱います。',
    },
  ],
  sections: [
    {
      heading: 'まず「つなぐ」 ―― 3wayハンドシェイク',
      blocks: [
        {
          kind: 'text',
          text: '電話で「もしもし、聞こえますか」「はい、そちらは」「聞こえています」と確かめてから話し始めるように、TCPもデータの前に3回やり取りして「準備できたね」を確認します。',
        },
        {
          kind: 'text',
          text: 'これが3wayハンドシェイク。SYN（つなぎたい）→ SYN・ACK（いいですよ、そちらは）→ ACK（こちらもOK）の3往復で接続が成立し、ここからデータを送れます。',
        },
        { kind: 'figure', figure: handshakeFigure },
      ],
    },
    {
      heading: '確実なTCP、軽快なUDP',
      blocks: [
        {
          kind: 'text',
          text: 'TCPは、送ったデータが届いたかを確認し、順番を整え、抜けていれば送り直します。確実な代わりに、やり取りが増えて少し重くなります。',
        },
        {
          kind: 'text',
          text: '対するUDPは、確認も送り直しもしません。届いたかは気にせず、軽く速く送ります。取りこぼしてもよいから速さがほしい通信 ―― 音声や動画、DNSの問い合わせ ―― に向きます。',
        },
        { kind: 'figure', figure: tcpUdpFigure },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'UDPは手抜きではない',
          body: 'UDPは[[blue:速さ優先の割り切り]]です。やり直していたら間に合わない通信では、むしろUDPが正解。通信の性格に合わせて使い分けます。',
        },
      ],
    },
    {
      heading: 'どのサービスへ？ ―― ポートと5つの情報',
      blocks: [
        {
          kind: 'text',
          text: '1台のサーバでは、Webやメールなど複数のサービスが同時に動いています。届いたデータをどのサービスへ渡すか ―― それを決めるのが[[amber:ポート番号]]です。443ならHTTPS、というように、よく使う番号は決まっています（ウェルノウンポート）。',
        },
        {
          kind: 'text',
          text: '宛先ポートで「相手のどのサービスか」、送信元ポートで「自分のどの通信か」を区別します。結局、1本の通信は次の5つで一意に決まります ―― [[blue:送信元IP・宛先IP・プロトコル・送信元ポート・宛先ポート]]。この5つの組み合わせで、通信を1本ずつ区別できます。',
        },
        { kind: 'figure', figure: tupleFigure },
        {
          kind: 'callout',
          tone: 'warn',
          title: '同じ相手に2本同時に開ける理由',
          body: '同じPCから同じサーバへ、ページを2つ同時に開けるのはなぜか。宛先も宛先ポートも同じなのに別物として扱えるのは、[[amber:送信元ポートが違う]]からです。この見分け方は、第8章のNATや第9章のファイアウォールでそのまま効いてきます。',
        },
      ],
    },
    {
      heading: '午後問題では5つの情報で通信を特定する',
      blocks: [
        {
          kind: 'text',
          text: 'ネスペ午後では、通信を5つの情報で特定し、「この通信は許可されるか」「どのサービス宛てか」を読ませる問題が定番です。',
        },
        {
          kind: 'callout',
          tone: 'info',
          title: '後半セキュリティ章の土台',
          body: 'ファイアウォールの許可ルールも、NATの変換表も、見ているのはこの5つの情報。さらにTCPには「つながっている最中（ESTABLISHED）」という状態があり、これを利用した制御を第9章で扱います。ポートとこの5つは、後半の土台です。',
        },
      ],
    },
  ],
  takeaways: [
    'TCPは3wayハンドシェイクで、つないでからデータを送ります。',
    'TCP＝確実（確認・順序・再送）、UDP＝軽快（確認しない）。速さがほしい通信はUDP。',
    'ポート番号で相手のサービスを指定（[[amber:443＝HTTPS]]）。よく使う番号は決まっています。',
    '1本の通信は次の5つ（[[blue:送信元IP・宛先IP・プロトコル・送信元ポート・宛先ポート]]）で一意。',
    '同じ相手への複数同時通信は、送信元ポートで見分けます。NAT・FWの土台。',
  ],
}
