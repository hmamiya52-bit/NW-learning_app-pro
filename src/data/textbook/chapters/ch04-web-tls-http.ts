import type { SequenceFigure, TextbookChapter, TimelineFigure } from '../types'

// 第4章 ポート443の中身を開く。TCP(第3章)の上にTLS、その中にHTTP。第1部の締め。

const tlsFigure: SequenceFigure = {
  kind: 'sequence',
  id: 'ch4-tls',
  title: 'TLSハンドシェイク',
  caption: 'あいさつ→証明書→鍵→暗号化開始。版による違いは扱いません。',
  takeaway: '暗号化（盗み見防止）と証明書（なりすまし防止）、役割は別。',
  actors: [
    { id: 'pc', label: 'PC', role: 'pc' },
    { id: 'web', label: 'Webサーバ', role: 'server' },
  ],
  messages: [
    {
      from: 'pc',
      to: 'web',
      label: '① あいさつ',
      note: 'PCが「この方式で暗号化したい」と伝えて始めます。',
    },
    {
      from: 'web',
      to: 'pc',
      label: '② 証明書を提示',
      note: 'サーバが自分の証明書を返します。これで「本物のサーバか」を確かめられます。',
    },
    {
      from: 'pc',
      to: 'web',
      label: '③ 鍵を共有',
      note: '盗み見されないよう、暗号化に使う鍵を相互に用意します。',
    },
    {
      from: 'web',
      to: 'pc',
      label: '④ 暗号化で開始',
      note: 'ここから先は暗号化された通信。HTTPはこのトンネルの中を流れます。',
    },
  ],
}

const httpFigure: SequenceFigure = {
  kind: 'sequence',
  id: 'ch4-http',
  title: 'HTTPの要求と応答',
  caption: '要求（GET）と応答（200）の1往復。',
  takeaway: 'HTTPSでも、中を流れるのは同じHTTP。',
  actors: [
    { id: 'pc', label: 'PC（ブラウザ）', role: 'pc' },
    { id: 'web', label: 'Webサーバ', role: 'server' },
  ],
  messages: [
    {
      from: 'pc',
      to: 'web',
      label: '① GET（ページください）',
      note: 'ブラウザが「このページをください」と、メソッドGETで要求します。',
    },
    {
      from: 'web',
      to: 'pc',
      label: '② 200 OK（ページ）',
      note: 'サーバがステータス200で「OK」と応え、ヘッダと本文を返します。',
    },
  ],
}

const panoramaFigure: TimelineFigure = {
  kind: 'timeline',
  id: 'ch4-panorama',
  title: 'URLを開いてからページが返るまで',
  caption: '第1部の全段。1本のWebアクセスに、1〜4章のすべてが乗っています。',
  takeaway: 'ばらばらの仕組みが、ぜんぶ「1本のWebアクセス」につながる。',
  items: [
    { badge: 'DHCP', label: '自分の住所の取得', detail: '第2章', tone: 'emerald' },
    { badge: 'DNS', label: '相手の住所の確認', detail: '第2章', tone: 'violet' },
    { badge: 'ARP', label: '出口（GW）のMAC解決', detail: '第1章', tone: 'emerald' },
    { badge: 'TCP', label: '3wayで接続', detail: '第3章', tone: 'blue' },
    { badge: 'TLS', label: '暗号トンネルの確立', detail: 'この章', tone: 'amber' },
    { badge: 'HTTP', label: 'ページの要求と受信', detail: 'この章', tone: 'amber' },
  ],
}

export const ch04WebTlsHttp: TextbookChapter = {
  id: 'web-tls-http',
  order: 4,
  title: 'Web通信の中身（TLS・HTTP）',
  summary: 'HTTPSの443の中で起きるTLSハンドシェイクと証明書、HTTPの要求応答を追います。',
  status: 'published',
  estimatedMinutes: 16,
  intro: [
    {
      kind: 'text',
      text: '第1章では、Webサーバへの通信を「ポート443でHTTPSのアプリへ渡す」ところで止めました。その443の封を開けると、何が入っているのでしょうか。',
    },
    {
      kind: 'text',
      text: '下からTCP（第3章）、その上にTLS、いちばん内側にHTTP。第1章のOSIでいう上位の層へ、ここで戻ってきます。この章で、第1部「URLを開いてページが返るまで」を完成させます。',
    },
  ],
  sections: [
    {
      heading: '本物だと確かめ、盗み見を防ぐ ―― TLS',
      blocks: [
        {
          kind: 'text',
          text: 'HTTPSのSは、Secure（安全）のS。安全には2つの意味があります。[[blue:盗み見されない]]ことと、[[blue:相手が本物だ]]と確かめられることです。',
        },
        {
          kind: 'text',
          text: '通信を始める前に、TLSがこの2つを用意します。暗号化の方式を取り決め、サーバの[[blue:証明書]]を受け取って「本物か」を確かめます。この一連のやり取りがTLSハンドシェイクです。',
        },
        { kind: 'figure', figure: tlsFigure },
        {
          kind: 'callout',
          tone: 'warn',
          title: '暗号化と本人確認は別の役割',
          body: '暗号化は中身を盗み見させないため、証明書は相手のなりすましを防ぐため。鍵の数学には踏み込まず、この2つの役割だけ押さえれば十分です。証明書の仕組み（だれが本物だと保証するか）は第13章で扱います。',
        },
      ],
    },
    {
      heading: 'ページを要求して受け取る ―― HTTP',
      blocks: [
        {
          kind: 'text',
          text: '暗号のトンネルができたら、その中をHTTPが流れます。HTTPはとてもシンプルで、[[amber:要求]]と[[amber:応答]]の1往復が基本です。',
        },
        {
          kind: 'text',
          text: 'ブラウザが「このページをください（GET）」と要求し、サーバが「はい、どうぞ（200）」と本文を返します。やり取りの先頭には、種類を表すメソッドや、結果を表すステータスコードが付きます。',
        },
        { kind: 'figure', figure: httpFigure },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'HTTPSはHTTPの置き換えではない',
          body: 'HTTPSは、HTTPが別物に変わったわけではありません。[[blue:HTTPを、TLSのトンネルで包んだもの]]。中を流れているのは、同じHTTPです。',
        },
      ],
    },
    {
      heading: 'URLを開いてページが返るまで（第1部の全景）',
      blocks: [
        {
          kind: 'text',
          text: 'これで第1部がそろいました。ブラウザにURLを打ち込んでからページが表示されるまで、裏側ではこれだけの準備と通信が、順番に進んでいます。',
        },
        { kind: 'figure', figure: panoramaFigure },
        {
          kind: 'text',
          text: '第1〜4章でばらばらに見えた仕組みが、ぜんぶ「1本のWebアクセス」につながりました。ここから第2部では、この通信が走る[[blue:ネットワークそのものの作り]]に踏み込みます。',
        },
      ],
    },
    {
      heading: '午後問題では「暗号の区間」と「証明書の位置」を読む',
      blocks: [
        {
          kind: 'text',
          text: 'ネスペ午後では、HTTPSの構成図がよく登場します。どの区間が暗号化されているか、証明書をどの機器に置くか ―― そこが読みどころです。',
        },
        {
          kind: 'callout',
          tone: 'info',
          title: 'TLSをどこでほどくか',
          body: 'TLSの暗号化を、Webサーバの手前の機器（リバースプロキシやロードバランサ）でほどく構成もよく出ます（第10章）。「暗号はどの区間か」「証明書はどの機器か」を読めると、HTTPSの構成図が見通せます。',
        },
      ],
    },
  ],
  takeaways: [
    'HTTPSは、TCPの上にTLS、その中にHTTP。',
    'TLSの役割は2つ ―― [[blue:暗号化]]（盗み見を防ぐ）と、[[blue:証明書]]による本人確認（なりすましを防ぐ）。',
    'HTTPは要求（GET）と応答（200）の1往復が基本。HTTPSでも中身は同じHTTP。',
    '第1部で、URLを開いてページが返るまでの全段がひとつに ―― [[green:DHCP→DNS→ARP→TCP→TLS→HTTP]]。',
  ],
}
