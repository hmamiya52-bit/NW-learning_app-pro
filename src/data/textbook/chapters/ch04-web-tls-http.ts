import type { RecordTableFigure, SequenceFigure, TextbookChapter, TimelineFigure } from '../types'

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
  takeaway: 'ばらばらの仕組みが、ぜんぶ「1本のWebアクセス」につながります。',
  items: [
    { badge: 'DHCP', label: '自分の住所の取得', detail: '第2章', tone: 'emerald' },
    { badge: 'DNS', label: '相手の住所の確認', detail: '第2章', tone: 'violet' },
    { badge: 'ARP', label: '出口（GW）のMAC解決', detail: '第1章', tone: 'emerald' },
    { badge: 'TCP', label: '3ウェイで接続', detail: '第3章', tone: 'blue' },
    { badge: 'TLS', label: '暗号トンネルの確立', detail: 'この章', tone: 'amber' },
    { badge: 'HTTP', label: 'ページの要求と受信', detail: 'この章', tone: 'amber' },
  ],
}

const httpTableFigure: RecordTableFigure = {
  kind: 'record-table',
  id: 'ch4-http-table',
  title: 'HTTPのメソッドとステータスコード',
  caption: 'GET・POSTが要求の[[amber:メソッド]]、数字が応答の[[blue:ステータスコード]]。',
  takeaway: 'メソッドで「何をしたいか」、ステータスで「結果」が分かります。',
  rowHeader: true,
  columns: [
    { key: 'ex', label: 'メソッド／コード' },
    { key: 'mean', label: '意味' },
  ],
  rows: [
    { ex: 'GET', mean: 'ページやデータの取得を求める要求' },
    { ex: 'POST', mean: 'データの送信・登録を求める要求' },
    { ex: '200 OK', mean: '成功' },
    { ex: '301 / 302', mean: '別のURLへ転送（リダイレクト）' },
    { ex: '404', mean: '見つからない' },
    { ex: '500', mean: 'サーバ側でエラーが発生' },
  ],
}

// §4 HTTP/1.1 と HTTP/2 の対比。1本の接続の使い方が変わる、という一点に絞る。
const httpVersionFigure: RecordTableFigure = {
  kind: 'record-table',
  id: 'ch4-http-version',
  title: 'HTTP/1.1とHTTP/2の違い',
  caption: '同じHTTPでも、[[blue:1本の接続の使い方]]が変わります。',
  takeaway: 'HTTP/2は複数のやり取りを1本の接続に[[green:相乗り]]させます。順番待ちが消え、張る[[blue:接続の数]]も減ります。',
  rowHeader: true,
  emphasizeKey: 'conn',
  columns: [
    { key: 'ver', label: 'バージョン' },
    { key: 'use', label: '1本の接続の使い方' },
    { key: 'wait', label: '次を送れるか' },
    { key: 'conn', label: '張る接続の数' },
  ],
  rows: [
    {
      ver: 'HTTP/1.1',
      use: '要求と応答を1組ずつ順番に',
      wait: '前の応答が終わるまで待つ',
      conn: '並行させるため何本も張る',
    },
    {
      ver: 'HTTP/2',
      use: '複数のやり取りを相乗り（多重化）',
      wait: '待たずに次を送れる',
      conn: '1本にまとまる',
    },
  ],
}

// §4 HTTP/2 の多重化（sequence 2者）。要求2本を続けて出し、先に用意できたほうから返る順序を見せる。
const http2Figure: SequenceFigure = {
  kind: 'sequence',
  id: 'ch4-http2',
  title: 'HTTP/2は応答を待たずに次を送れる',
  caption: '要求Aの[[blue:応答を待たずに]]要求Bを送り、先に用意できたほうから返ります。',
  takeaway: 'すべて[[green:同じ1本の接続]]の中の出来事。順番が入れ替わっても、番号で区別できるので混ざりません。',
  actors: [
    { id: 'cl', label: 'ブラウザ', role: 'pc' },
    { id: 'sv', label: 'Webサーバ', sub: '172.16.0.20', role: 'server' },
  ],
  messages: [
    {
      from: 'cl',
      to: 'sv',
      label: '① 要求A（CSS）',
      note: '同じページで使う2つのファイル。まずAを要求します。',
    },
    {
      from: 'cl',
      to: 'sv',
      label: '② 要求B（画像）',
      note: 'Aの応答を待たずにBも要求します。HTTP/1.1ではここで待たされました。',
    },
    {
      from: 'sv',
      to: 'cl',
      label: '③ 応答B',
      note: '先に用意できたBから返します。順番は入れ替わってもかまいません。',
    },
    {
      from: 'sv',
      to: 'cl',
      label: '④ 応答A',
      note: '続いてA。どのやり取りの断片かは番号で分かるので混ざりません。',
    },
  ],
}

export const ch04WebTlsHttp: TextbookChapter = {
  id: 'web-tls-http',
  order: 4,
  title: 'Web通信の中身（TLS・HTTP）',
  summary: 'HTTPSの443の中で起きるTLSハンドシェイクと証明書、HTTPの要求応答とメソッド・ステータスを追います。',
  status: 'published',
  estimatedMinutes: 17,
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
      heading: 'TLSで本物を確かめ、盗み見を防ぐ',
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
          kind: 'text',
          text: 'はじめの「あいさつ」では、どの暗号方式を使うかをPCとサーバですり合わせます。方式の名前は数多くありますが、「最初に方式をそろえてから暗号化を始める」という流れがつかめれば先へ進めます。',
        },
        {
          kind: 'callout',
          tone: 'warn',
          title: '暗号化と本人確認は別の役割',
          body: '暗号化は中身を盗み見させないため、証明書は相手のなりすましを防ぐため。鍵の数学には踏み込まず、この2つの役割だけ押さえれば十分です。証明書の仕組み（だれが本物だと保証するか）は第13章で扱います。',
        },
      ],
    },
    {
      heading: 'HTTPでページを要求して受け取る',
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
      heading: 'メソッドとステータス、そして状態を持たないHTTP',
      blocks: [
        {
          kind: 'text',
          text: '要求の先頭には「何をしたいか」を表す[[amber:メソッド]]、応答の先頭には「結果」を表す[[blue:ステータスコード]]が付きます。よく出る顔ぶれは決まっています。',
        },
        { kind: 'figure', figure: httpTableFigure },
        {
          kind: 'callout',
          tone: 'info',
          title: '1回ごとに完結するHTTP（ステートレス）',
          body: 'HTTPは、1回の要求と応答で完結し、前のやり取りを覚えません（ステートレス）。「ログインしたまま」を保つために、ブラウザとサーバはクッキーなどで合言葉をやり取りします。複数のWebサーバへ振り分けるとき、この合言葉を毎回どのサーバへ届けるか（セッション維持）が課題になります。詳しくは第10章で扱います。',
        },
      ],
    },
    {
      heading: '1本の接続に相乗りさせるHTTP/2',
      blocks: [
        {
          kind: 'text',
          text: 'ここまで見てきたのは[[blue:HTTP/1.1]]です。1本のTCP接続で、要求と応答を1組ずつ順番にやり取りします。ところが今のWebページは、HTMLのほかにCSSや画像を何十個も読み込みます。1組ずつだと[[amber:前が終わるまで次が待たされ]]、先頭が遅れると後ろが全部遅れます。ブラウザは接続を何本も張って並行させ、これをしのいでいました。',
        },
        {
          kind: 'text',
          text: '[[blue:HTTP/2]]は、1本の接続の中に複数のやり取りを[[green:相乗り]]させます（多重化）。前の応答を待たずに次を送れて、先に用意できたほうから返ります。並行させるために接続を何本も張る必要がなくなり、[[blue:接続の数]]も減ります。',
        },
        { kind: 'figure', figure: httpVersionFigure },
        { kind: 'figure', figure: http2Figure },
        {
          kind: 'callout',
          tone: 'info',
          title: '接続の数が減ると、境界の機器も楽になる',
          body: '接続がまとまることは、通信を1本ずつ数えている機器にも効きます。第8章で扱う[[blue:NAPT]]の変換表は、通信1本につき1行を使います。接続の数が減れば、その行の数も減ります。科目Bでは「HTTP/2にすると何が減るか」という形で問われるので、[[blue:接続の数]]という答えを持っておくと迷いません。',
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'ヘッダの圧縮とHTTP/3',
          body: 'HTTP/2は、毎回ほとんど同じ内容が並ぶ[[blue:ヘッダを圧縮]]して、送る量も減らします。さらに新しい[[blue:HTTP/3]]は、TCPではなく[[blue:UDP]]の上で動きます（QUIC）。第3章で見たUDPの身軽さを使って、つなぎ直しを速くする狙いです。名前と「UDPの上で動く」ことだけ押さえれば十分です。',
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
      heading: '科目Bでは「暗号の区間」と「証明書の位置」を読む',
      blocks: [
        {
          kind: 'text',
          text: 'ネスペ科目Bでは、HTTPSの構成図がよく登場します。どの区間が暗号化されているか、証明書をどの機器に置くか。そこが読みどころです。',
        },
        {
          kind: 'callout',
          tone: 'info',
          title: 'TLSをどこでほどくか',
          body: 'TLSの暗号化を、Webサーバの手前の機器（リバースプロキシやロードバランサ）でほどく構成もよく出ます（第10章）。「暗号はどの区間か」「証明書はどの機器か」を読めると、HTTPSの構成図が見通せます。',
        },
        {
          kind: 'check',
          label: '設問例',
          items: [
            {
              question: 'TLSハンドシェイクで、サーバの「なりすまし」を防ぐためにPCが確かめるものは何か。',
              answer: 'サーバ証明書。暗号化（盗み見の防止）とは別の役割です。',
            },
          ],
        },
      ],
    },
  ],
  takeaways: [
    'HTTPSは、TCPの上にTLS、その中にHTTP。',
    'TLSの役割は2つ。[[blue:暗号化]]で盗み見を防ぎ、[[blue:証明書]]による本人確認でなりすましを防ぎます。',
    'HTTPは要求（GET）と応答（200）の1往復が基本。HTTPSでも中身は同じHTTP。',
    '要求の種類は[[amber:メソッド]]（GET・POST）、応答の結果は[[blue:ステータスコード]]（200・404・500）。HTTPは1回ごとに完結（ステートレス）。',
    '[[blue:HTTP/2]]は1本の接続に複数のやり取りを[[green:相乗り]]させます（多重化）。順番待ちが消え、張る[[blue:接続の数]]が減ります。',
    '第1部で、URLを開いてページが返るまでの全段がひとつにつながりました。[[green:DHCP→DNS→ARP→TCP→TLS→HTTP]]。',
  ],
  checks: [
    {
      question: 'HTTP/1.1をHTTP/2にすると、ブラウザとサーバの間で何が減るか。減ると何がうれしいか。',
      answer: '張るTCP接続の数が減ります。1本の接続に複数のやり取りを相乗りさせるためです。接続を1本ずつ数えている境界の機器（第8章のNAPT変換表など）の負担も、あわせて軽くなります。',
    },
    {
      question: 'HTTPSの中身を、下の層から順に並べると？',
      answer: 'TCP → TLS → HTTP。TLSのトンネルの中を、同じHTTPが流れます。',
    },
    {
      question: 'TLSが用意する「2つの安全」とは何か。',
      answer: '暗号化（盗み見を防ぐ）と、サーバ証明書による本人確認（なりすましを防ぐ）。',
    },
    {
      question: 'GET と 200 は、それぞれ何を表すか。',
      answer: 'GETは要求のメソッド（取得したい）、200は応答のステータスコード（成功）。',
    },
  ],
}
