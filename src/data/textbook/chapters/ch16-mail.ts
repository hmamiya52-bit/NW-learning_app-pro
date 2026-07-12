import type { PacketFlowFigure, RecordTableFigure, SequenceFigure, TextbookChapter, Topology } from '../types'

// 第16章 メール。第2章DNS(MX)・第9章DMZ・第4章TLSの合流点。
// 送信(SMTP)はサーバ間のバケツリレー、受信(IMAP/POP)は別経路。なりすまし対策(SPF/DKIM/DMARC)はDNSを土台にする。
// 構成図の差分: DMZに自社メールサーバ(mail) 172.16.0.25、外部に相手のメールサーバ(MX)。新role 'mail'。

// §1 構成図(stack)。上=相手メール／インターネット／境界ルータ／FW／下=自社メール(DMZ)・送信PC(内部)。
// メールはWebと違い「自社サーバがいったん預かって、相手サーバへ配る」。その置き場所を俯瞰する。
const mapTopology: Topology = {
  layout: 'graph',
  stack: true,
  zones: [
    { id: 'dmz', label: 'DMZ', tone: 'amber' },
    { id: 'lan', label: '内部LAN', tone: 'sky' },
    { id: 'ext', label: '社外', tone: 'slate' },
  ],
  nodes: [
    { id: 'inet', label: 'インターネット', role: 'internet' },
    { id: 'br', label: '境界ルータ', role: 'router', sub: '外側 203.0.113.1' },
    { id: 'fw', label: 'FW', role: 'firewall', sub: 'ファイアウォール' },
    { id: 'peer', label: '相手メールサーバ', role: 'mail', zoneId: 'ext', sub: '相手ドメインのMX' },
    { id: 'mail', label: '自社メールサーバ', role: 'mail', zoneId: 'dmz', sub: '172.16.0.25' },
    { id: 'pc', label: '送信PC', role: 'pc', zoneId: 'lan', sub: '192.168.10.10' },
  ],
  links: [
    { a: 'inet', b: 'peer' },
    { a: 'inet', b: 'br' },
    { a: 'br', b: 'fw' },
    { a: 'fw', b: 'mail' },
    { a: 'fw', b: 'pc' },
  ],
}

const mapFigure: PacketFlowFigure = {
  kind: 'packet-flow',
  id: 'ch16-map',
  title: 'メールはどこを通って相手へ届くか',
  caption: 'PCから自社サーバ、インターネットを越えて相手サーバへ。ステップで[[blue:通り道]]が光ります。',
  takeaway: '自社と相手の[[amber:2つのメールサーバ]]が仲立ちします。PCは送るだけで、相手のPCと直接はつながりません。',
  topology: mapTopology,
  hideHeaders: true,
  steps: [
    {
      focus: { type: 'node', id: 'pc' },
      packetLabel: '',
      headers: { l2: '', l3: '' },
      explanation: '送信PCが、自社メールサーバへメールを渡します。ここまでは社内です。',
    },
    {
      focus: { type: 'node', id: 'mail' },
      packetLabel: '',
      headers: { l2: '', l3: '' },
      explanation: '自社メールサーバが受け取り、相手を探して配送を始めます。',
    },
    {
      focus: { type: 'link', a: 'br', b: 'inet' },
      bubbles: ['宛先 相手メールサーバ'],
      packetLabel: '',
      headers: { l2: '', l3: '' },
      explanation: 'FW・境界ルータを通り、インターネットへ出ます。宛先は相手サーバ。',
    },
    {
      focus: { type: 'link', a: 'inet', b: 'peer' },
      bubbles: ['宛先 相手メールサーバ'],
      packetLabel: '',
      headers: { l2: '', l3: '' },
      explanation: 'インターネットを越え、相手メールサーバへ届きます。',
    },
    {
      focus: { type: 'node', id: 'peer' },
      packetLabel: '',
      headers: { l2: '', l3: '' },
      explanation: '相手メールサーバが受信箱に保存。取り出す仕組みは次の節で。',
    },
  ],
}

// §2 送信(SMTP)。3者: 送信PC｜自社メールサーバ｜相手メールサーバ。DNSのMX解決はnoteで。
const sendFigure: SequenceFigure = {
  kind: 'sequence',
  id: 'ch16-send',
  title: 'メールが相手へ届くまで（SMTP）',
  caption: 'サーバからサーバへ順に受け渡し。相手の居場所は[[blue:DNS]]で調べます。',
  takeaway: '送信は[[blue:SMTP]]でサーバ間を渡ります。相手サーバの居場所は、DNSの[[blue:MX]]で分かります。',
  actors: [
    { id: 'pc', label: '送信PC', role: 'pc' },
    { id: 'own', label: '自社メールサーバ', sub: 'MTA', role: 'mail' },
    { id: 'peer', label: '相手メールサーバ', sub: 'MX', role: 'mail' },
  ],
  messages: [
    {
      from: 'pc',
      to: 'own',
      label: '① 送信（SMTP）',
      note: '送信PCが、自社メールサーバへメールを預けます。この受け渡しがSMTPです。',
    },
    {
      from: 'own',
      to: 'peer',
      label: '② 相手を調べて配送',
      note: '自社サーバが相手ドメインの受け取り窓口（MX）をDNSで調べ、その相手サーバへSMTPで配送します。',
    },
    {
      from: 'peer',
      to: 'own',
      label: '③ 受領の応答',
      note: '相手サーバが受け取り、応答を返します。メールは相手の受信箱（メールボックス）に保存されます。',
    },
  ],
}

// §3 受信(IMAP/POP)。2者: 自社の利用者｜自社メールサーバ。送信とは別の経路。同じ自社サーバが送受信を担う。
const recvFigure: SequenceFigure = {
  kind: 'sequence',
  id: 'ch16-recv',
  title: '届いたメールを取りに行く（IMAP／POP）',
  caption: '受信は、利用者が自分のメールサーバへ[[blue:取りに行く]]別の仕組みです。',
  takeaway: '送信（SMTP）が「押し込む」なら、受信（IMAP／POP）は「取りに行く」。行きと帰りで仕組みが違います。',
  actors: [
    { id: 'user', label: '自社の利用者', role: 'pc' },
    { id: 'srv', label: '自社メールサーバ', sub: '受信箱', role: 'mail' },
  ],
  messages: [
    {
      from: 'user',
      to: 'srv',
      label: '① 新着を確認',
      note: '自社の利用者が、自社メールサーバへ新着を問い合わせます（IMAPやPOP）。',
    },
    {
      from: 'srv',
      to: 'user',
      label: '② メールを渡す',
      note: '受信箱のメールを渡します。SMTPが運び込んだ分を、ここで受け取ります。',
    },
  ],
}

// §4 なりすまし対策(record-table)。SPF/DKIM/DMARC。3つとも土台はDNS。
const authTable: RecordTableFigure = {
  kind: 'record-table',
  id: 'ch16-auth',
  title: '送信ドメイン認証のSPF・DKIM・DMARC',
  caption: '差出人の[[red:なりすまし]]を防ぐ3点。役割は「IP・署名・方針」で分かれます。',
  takeaway: '3つはすべて[[blue:DNS]]を土台にします。SPF＝IP、DKIM＝署名、DMARC＝失敗時の方針、と役割で覚えます。',
  rowHeader: true,
  columns: [
    { key: 'name', label: '仕組み' },
    { key: 'check', label: '何で確かめるか' },
    { key: 'dns', label: 'DNSの使い方' },
  ],
  rows: [
    { name: 'SPF', check: '送信元サーバのIPが正規か', dns: '許可する送信サーバのIPをDNSに公開' },
    { name: 'DKIM', check: '本文が改ざんされていないか（電子署名）', dns: '署名を検証する公開鍵をDNSに公開' },
    { name: 'DMARC', check: 'SPF/DKIMが失敗したメールをどう扱うか', dns: '拒否・隔離などの方針をDNSに公開' },
  ],
}

export const ch16Mail: TextbookChapter = {
  id: 'mail',
  order: 16,
  title: 'メール',
  summary:
    'メールはWebと違い「ためて転送」する仕組みです。送信はSMTPでサーバからサーバへバケツリレーし、相手の居場所はDNSのMXで調べます。受信は利用者が取りに行くIMAP／POPで、送信とは別経路。なりすまし対策のSPF・DKIM・DMARCも、すべてDNSを土台にします。第2章DNS・第9章DMZ・第4章TLSが、ここで合流します。',
  status: 'published',
  estimatedMinutes: 15,
  intro: [
    {
      kind: 'text',
      text: 'Webは、相手のサーバへ[[blue:その場でつなぎ]]、ページを受け取る通信でした。メールは違います。相手が今いなくても届けたいので、[[blue:いったんサーバに預けて、あとから転送]]する仕組みになっています。イメージは[[blue:郵便]]に近く、ポスト役のメールサーバに預ければ、相手が不在でも運ばれ、相手はあとから自分の私書箱を見に行きます。',
    },
    {
      kind: 'text',
      text: 'そのため、メールには「[[blue:送る]]」と「[[blue:受け取る]]」で別々の仕組みがあります。この章では、送信の[[blue:SMTP]]、受信の[[blue:IMAP／POP]]、そして差出人のなりすましを防ぐ[[blue:SPF・DKIM・DMARC]]を追います。第2章のDNS、第9章のDMZが、そろって効いてきます。',
    },
  ],
  sections: [
    {
      heading: 'メールサーバがどこに立つか',
      blocks: [
        {
          kind: 'text',
          text: 'メールは、PCどうしが直接やり取りするのではありません。自社の[[amber:メールサーバ]]がいったん預かり、相手の[[slate:メールサーバ]]へ配ります。この自社サーバは、外とやり取りする公開サーバなので、置き場所は第9章の[[amber:DMZ]]です。',
        },
        { kind: 'figure', figure: mapFigure },
        {
          kind: 'callout',
          tone: 'info',
          title: 'MXレコードは「メールの受け取り窓口」',
          body: '相手サーバの場所は、相手ドメインの[[blue:MXレコード]]をDNSで調べて分かります。第2章では名前からWebサーバのIP（Aレコード）を調べましたが、メールでは受け取り窓口を指す[[blue:MX]]を引きます。',
        },
      ],
    },
    {
      heading: '送信はサーバ間のバケツリレー',
      blocks: [
        {
          kind: 'text',
          text: '送信のプロトコルが[[blue:SMTP]]です。送信PCが自社メールサーバへ渡し、自社サーバが相手サーバへ渡します。この[[blue:サーバからサーバへのバケツリレー]]で、相手に届きます。',
        },
        { kind: 'figure', figure: sendFigure },
        {
          kind: 'text',
          text: '途中で出てきたMXの解決が、第2章のDNSです。相手の居場所を知らないと配送できないので、メールとDNSは切っても切れません。',
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'ポート番号と暗号化',
          body: 'SMTPはサーバ間の配送に[[amber:25番]]、利用者のPCからの送信に[[amber:587番]]を使います。配送の途中も、第4章の[[blue:TLS]]で暗号化できます（STARTTLSという名前だけ押さえれば十分です）。',
        },
      ],
    },
    {
      heading: '受信は「取りに行く」別の仕組み',
      blocks: [
        {
          kind: 'text',
          text: 'ここまでは自社が送る側でした。今度は[[blue:受け取る側]]で考えます。同じ自社メールサーバは、外から届いたメールを受信箱にためる役目もします。自社の利用者は、それを自分のメールサーバへ[[blue:取りに行き]]ます。この受信のプロトコルが[[blue:IMAP]]や[[blue:POP]]。送信のSMTPとは、まったく別の仕組みです。',
        },
        { kind: 'figure', figure: recvFigure },
        {
          kind: 'callout',
          tone: 'info',
          title: 'IMAPとPOPの違い',
          body: '[[blue:IMAP]]はメールをサーバに置いたまま読むので、複数の端末で同じ状態を見られます。[[blue:POP]]は手元にダウンロードして取り込む昔ながらの方式。いまはIMAPが主流と考えておけば大丈夫です。',
        },
      ],
    },
    {
      heading: 'なりすましを防ぐ送信ドメイン認証',
      blocks: [
        {
          kind: 'text',
          text: 'メールは差出人を[[red:偽りやすい]]という弱点があります。そこで、届いたメールが「本当にそのドメインから出たものか」を受信側が確かめる仕組みが、[[blue:送信ドメイン認証]]です。代表が[[blue:SPF]]・[[blue:DKIM]]・[[blue:DMARC]]の3つ。',
        },
        { kind: 'figure', figure: authTable },
        {
          kind: 'text',
          text: '3つの共通点は、いずれも[[blue:DNS]]に情報を公開して成り立つこと。送信側がDNSに手がかりを置き、受信側がそれを引いて確かめます。ここでも、第2章のDNSがメールの土台です。',
        },
      ],
    },
    {
      heading: '午後は経路と配置、そして認証を読む',
      blocks: [
        {
          kind: 'text',
          text: '午後では、メールサーバの[[blue:DMZ配置]]、送信（SMTP）と受信（IMAP／POP）の[[blue:経路の違い]]、そして[[blue:送信ドメイン認証]]の役割分担がよく問われます。とくにSPF・DKIM・DMARCは、どれが何を確かめるかを取り違えないことが大切です。',
        },
        {
          kind: 'check',
          label: '設問例',
          items: [
            {
              question:
                '自社から送ったメールが、受信側でなりすましと疑われないようにしたい。送信元サーバのIPアドレスが正規のものかを受信側に確かめさせる仕組みは、SPF・DKIM・DMARCのどれか。',
              answer:
                'SPFです。自社が「このIPアドレスから送ります」という許可リストをDNSに公開し、受信側は送信元IPがそこに含まれるかを照合します。署名で改ざんを防ぐのがDKIM、両者の失敗時の扱いを決めるのがDMARCです。',
            },
          ],
        },
        {
          kind: 'text',
          text: '「送ったのに届かない」の切り分けでは、DNSのMXが正しいか、FWでSMTP（25／587）が通っているか、送信ドメイン認証で弾かれていないか。第2章・第9章・この章が、そのまま点検の順になります。',
        },
      ],
    },
  ],
  takeaways: [
    '送信は[[blue:SMTP]]でサーバからサーバへのバケツリレー。相手サーバの居場所は、DNSの[[blue:MX]]で調べます。',
    '受信は[[blue:IMAP／POP]]で利用者が取りに行く、送信とは別の仕組みです。',
    'なりすまし対策の[[blue:SPF]]（IP）・[[blue:DKIM]]（署名）・[[blue:DMARC]]（方針）は、役割で分けて覚えます。',
    'MXも送信ドメイン認証も土台は[[blue:DNS]]。メールサーバの置き場所は公開区画の[[amber:DMZ]]です。',
  ],
  checks: [
    {
      question: 'メールの送信（SMTP）と受信（IMAP／POP）は、どう違う仕組みか。',
      answer:
        '送信はSMTPで、サーバからサーバへメールを押し込むように配送します。受信はIMAPやPOPで、利用者が自分のメールサーバへメールを取りに行きます。送る側と受け取る側で、別のプロトコルを使います。',
    },
    {
      question: '自社メールサーバは、相手のメールサーバの場所をどうやって知るか。',
      answer:
        '相手ドメインのMXレコードをDNSで調べます。MXはそのドメインのメールの受け取り窓口を指すレコードで、これがなければ配送先が分かりません。',
    },
    {
      question: 'SPF・DKIM・DMARCは、それぞれ何を担当するか。',
      answer:
        'SPFは送信元サーバのIPが正規かを確かめ、DKIMは電子署名で本文の改ざんを検知し、DMARCはSPF/DKIMが失敗したメールの扱い（拒否・隔離など）を決めます。3つとも、判定の手がかりをDNSに公開します。',
    },
  ],
}
