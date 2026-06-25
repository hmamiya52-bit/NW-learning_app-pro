import type { SequenceFigure, TextbookChapter, TimelineFigure } from '../types'

// 第2章「自分の住所(DHCP)」「相手の住所(DNS)」を、最小構成の上で順に追う。

const dhcpFigure: SequenceFigure = {
  kind: 'sequence',
  id: 'ch2-dhcp',
  title: 'PCが住所をもらう（DHCP）',
  caption: '探す→提案→要求→確定の4ステップ。最初の2つは[[green:全員あて]]です。',
  takeaway: 'もらうのはIPだけでなく、マスク・出口（GW）・DNSの4点セット。',
  actors: [
    { id: 'pc', label: 'PC', sub: '住所がまだ無い', role: 'pc' },
    { id: 'dhcp', label: 'DHCPサーバ', sub: '住所を配る', role: 'server' },
  ],
  messages: [
    {
      from: 'pc',
      to: 'dhcp',
      label: '① Discover',
      style: 'broadcast',
      note: '住所が無いPCが「どなたか住所を貸してください」と、同じLANの全員へ呼びかけます。',
    },
    {
      from: 'dhcp',
      to: 'pc',
      label: '② Offer',
      note: 'DHCPサーバが「この住所はどうですか」と、空いているIPアドレスを提案します。',
    },
    {
      from: 'pc',
      to: 'dhcp',
      label: '③ Request',
      style: 'broadcast',
      note: 'PCが「その住所をください」と要求します。',
    },
    {
      from: 'dhcp',
      to: 'pc',
      label: '④ Ack',
      note: 'DHCPサーバが確定。IP・サブネットマスク・デフォルトゲートウェイ・DNSサーバをまとめて渡します。',
    },
  ],
}

const dnsFigure: SequenceFigure = {
  kind: 'sequence',
  id: 'ch2-dns',
  title: '名前をIPに変える（DNS）',
  caption: 'PCはキャッシュDNSに丸投げ（[[green:再帰]]）、キャッシュが上位をたどります（[[green:反復]]）。',
  takeaway: 'PCが自分でたどるのではなく、キャッシュDNSが代わりに調べてくれます。',
  actors: [
    { id: 'pc', label: 'PC', role: 'pc' },
    { id: 'cache', label: 'キャッシュDNS', sub: '代わりに調べる', role: 'dns' },
    { id: 'upper', label: '上位DNS', sub: 'ルート/TLD/権威', role: 'internet' },
  ],
  messages: [
    {
      from: 'pc',
      to: 'cache',
      label: '① 問い合わせ',
      note: 'PCがキャッシュDNSに「www.example.com のIPを代わりに調べて」と頼みます（再帰）。',
    },
    {
      from: 'cache',
      to: 'upper',
      label: '② ルート→TLD→権威へ',
      note: 'キャッシュDNSが、ルート→TLD（.comの担当）→権威（その名前の正解を持つ）の順にたどって聞きます（反復）。上位DNSはインターネット側で、つなぎ方は第8章。',
    },
    {
      from: 'upper',
      to: 'cache',
      label: '③ 答え',
      note: '最後にたどり着いた権威DNSが「172.16.0.20」と正解を返します。',
    },
    {
      from: 'cache',
      to: 'pc',
      label: '④ 回答',
      note: 'キャッシュDNSがPCへ回答します。結果はしばらく覚えるので（キャッシュ）、次に同じ名前を引くときは速いです。',
    },
  ],
}

const panoramaFigure: TimelineFigure = {
  kind: 'timeline',
  id: 'ch2-panorama',
  title: '通信が始まるまでの準備',
  caption: '第1章の通信は、この順番の準備の上に成り立っていました。',
  takeaway: 'URLを開く裏側で、住所→名前→出口→接続の順に整っていきます。',
  items: [
    { badge: 'DHCP', label: '自分の住所の取得', detail: 'IP・マスク・GW・DNSの4点セット', tone: 'emerald' },
    { badge: 'DNS', label: '相手の住所の確認', detail: 'www.example.com → 172.16.0.20', tone: 'violet' },
    { badge: 'ARP', label: '出口（GW）のMAC解決', detail: '第1章。最初のフレームのあて先MAC', tone: 'emerald' },
    { badge: 'TCP', label: '接続して送信', detail: '3wayハンドシェイク（第3章）', tone: 'blue' },
  ],
}

export const ch02DnsDhcp: TextbookChapter = {
  id: 'dns-dhcp',
  order: 2,
  title: '名前解決とアドレス配布（DNS・DHCP）',
  summary: '名前からIPを引くDNSと、IP・GW・DNSを配るDHCPで、通信を始める前の準備を理解します。',
  status: 'published',
  estimatedMinutes: 18,
  intro: [
    {
      kind: 'text',
      text: '第1章では、PCがWebサーバのIPアドレスを知っている前提で通信を追いました。けれど実際は、通信を始める前に2つの準備が要ります。',
    },
    {
      kind: 'text',
      text: 'ひとつは[[blue:自分の住所]] ―― PCが自分のIPアドレスをどうやって持つのか。もうひとつは[[blue:相手の住所]] ―― 「www.example.com」のような名前から、相手のIPアドレスをどう調べるのか。この章で、その出発前を埋めます。',
    },
  ],
  sections: [
    {
      heading: 'まず自分の住所をもらう ―― DHCP',
      blocks: [
        {
          kind: 'text',
          text: 'ネットワークにつないだばかりのPCは、まだ自分のIPアドレスを持っていません。住所が無いので、「どなたか住所を貸してください」と[[green:同じLANの全員]]へ呼びかけます。これに応えるのがDHCPサーバです。',
        },
        {
          kind: 'text',
          text: 'やり取りは4ステップ。探す（Discover）→ 提案（Offer）→ 要求（Request）→ 確定（Ack）の順で進み、頭文字をとってDORAと呼びます。',
        },
        { kind: 'figure', figure: dhcpFigure },
        {
          kind: 'callout',
          tone: 'warn',
          title: 'なぜ最初は「全員あて」なのか',
          body: 'まだ自分のIPアドレスが無く、DHCPサーバの場所も知らないからです。住所が決まる前は、特定の相手を指定できないので、全員に呼びかけるしかありません。',
        },
        {
          kind: 'text',
          text: 'ここで受け取るのは、IPアドレスだけではありません。[[blue:サブネットマスク]]（自分のネットワークの範囲を表す数。詳しくは第6章）、[[blue:デフォルトゲートウェイ]]、[[blue:DNSサーバ]]の場所まで、まとめて受け取ります。第1章で「PCに設定済み」としたデフォルトゲートウェイは、ここで配られていたのです。',
        },
      ],
    },
    {
      heading: '相手の名前をIPに変える ―― DNS',
      blocks: [
        {
          kind: 'text',
          text: '住所が決まったPCは、次に相手を探します。私たちは「www.example.com」のような名前で相手を指定しますが、通信に必要なのはIPアドレス。この名前からIPへの変換がDNSです。',
        },
        {
          kind: 'text',
          text: 'PCは、DHCPで教わった[[blue:キャッシュDNS]]に「この名前のIPを代わりに調べて」と頼みます（[[green:再帰]]）。頼まれたキャッシュDNSは、インターネット側の上位のDNSを ルート → TLD → 権威 と順にたどって、答えを集めてきます（[[green:反復]]）。DNSやDHCPは、UDPという軽い運び方を使います（第3章）。',
        },
        { kind: 'figure', figure: dnsFigure },
        {
          kind: 'callout',
          tone: 'tip',
          title: '二度目が速いわけ',
          body: '一度調べた名前は、キャッシュDNSもPCも[[blue:しばらく覚えます]]（キャッシュ）。だから次に同じ名前を引くときは、上位までたどらずすぐ返せます。覚えておく時間がTTLです。',
        },
      ],
    },
    {
      heading: 'つながる直前まで、通してみる',
      blocks: [
        {
          kind: 'text',
          text: 'これで材料がそろいました。第1章の通信は、じつはこんな準備の上に成り立っていたのです。',
        },
        {
          kind: 'text',
          text: '[[green:DHCP]]で自分の住所をもらい、[[green:DNS]]で相手のIPを調べ、第1章の[[green:ARP]]で出口（デフォルトゲートウェイ）のMACを調べ、[[green:TCP]]でつなぐ。ブラウザでURLを開いた裏側では、この順で準備が進んでいます。',
        },
        { kind: 'figure', figure: panoramaFigure },
      ],
    },
    {
      heading: '午後問題では「どの準備でつまずいたか」を切り分ける',
      blocks: [
        {
          kind: 'text',
          text: 'ネスペ午後では、DNSとDHCPは「つながらない」の切り分けでよく問われます。どの準備で止まっているのかを見分けるのが第一歩です。',
        },
        {
          kind: 'callout',
          tone: 'info',
          title: '切り分けの入口',
          body: '名前では開けないのに、IPアドレス直打ちなら開ける ―― そんなときは名前解決（DNS）を疑います。そもそもIPアドレスが取れていないなら、DHCPの不調（配布できるアドレスが尽きた等）を疑う。症状から、つまずいた準備を絞り込みます。',
        },
      ],
    },
  ],
  takeaways: [
    '通信の前に「自分の住所（DHCP）」と「相手の住所（DNS）」を用意します。',
    'DHCPでもらうのは4点セット ―― [[blue:IP・サブネットマスク・デフォルトゲートウェイ・DNSサーバ]]。',
    'DNSは名前→IPの変換。PCはキャッシュDNSに頼み（再帰）、上位DNSをたどって（反復）答えを得ます。',
    '一度引いた名前はしばらく覚えます（キャッシュ／TTL）。だから二度目は速くなります。',
    '第1章の通信は、[[green:DHCP→DNS→ARP→TCP]]という準備の上に成り立っていました。',
  ],
}
