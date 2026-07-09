import type { AddressTableFigure, PacketFlowFigure, SequenceFigure, TextbookChapter, TimelineFigure, Topology } from '../types'

// 第13章 認証・認可・SSO・PKI。第4章「サーバ証明書で本物か確かめる」の発展＝今度は利用者側を確かめる。
// 認証と認可の区別 → RADIUSで認証を一元化 → SSO → 証明書チェーン(PKI)。第14章 802.1X の土台。
// 構成図の差分: 認証サーバ(RADIUS) 192.168.10.40 を内部LANに追加（台帳どおり）。

// §1 認証 vs 認可（address-table 対比カード。軸は fieldLabels で「問い/よりどころ/例」に差し替え）。
const authAuthzTable: AddressTableFigure = {
  kind: 'address-table',
  id: 'ch13-auth-authz',
  title: '認証と認可——2つの問い',
  caption: '[[blue:認証]]と[[violet:認可]]、それぞれが答える問いを見比べます。',
  takeaway: 'ログインの成功（認証）と、操作できる範囲（認可）は別もの。両方そろって初めて使えます。',
  fieldLabels: { carries: '答える問い', scope: '判断のよりどころ', example: '例' },
  rows: [
    {
      name: '認証',
      layer: '本人確認',
      carries: '「あなたは誰か」',
      scope: '本人だけが示せるもの——パスワード・ICカード・生体・証明書',
      example: 'IDとパスワードでログイン',
      tone: 'blue',
    },
    {
      name: '認可',
      layer: '権限',
      carries: '「何をしてよいか」',
      scope: '役割や所属ごとに、あらかじめ決めたアクセス権の設定',
      example: '一般社員は閲覧のみ・管理者は変更も可',
      tone: 'violet',
    },
  ],
}

// §2 構成図の差分: 内部LANに認証サーバが加わる（第2章と同じ tree のズームイン）＋
// 認証の前後でPCの扱いが遮断→通過と切り替わる動き（verdict チップ。第9章FWの再利用）。
// 葉の先頭を認証サーバにして、L2SW—認証サーバの枝を focus link で光らせる（leafSegs は数珠つなぎのため）。
const mapTopology: Topology = {
  layout: 'graph',
  edgeLabels: [{ a: 'l2sw', b: 'r', label: '' }],
  zones: [{ id: 'lan', label: '内部LAN', tone: 'sky' }],
  nodes: [
    { id: 'l2sw', label: 'L2SW', role: 'switch', zoneId: 'lan', sub: '内部LAN' },
    { id: 'r', label: 'ルータ', role: 'router', sub: 'デフォルトGW' },
    { id: 'auth', label: '認証サーバ', role: 'server', zoneId: 'lan', sub: '192.168.10.40' },
    { id: 'pc', label: 'PC', role: 'pc', zoneId: 'lan', sub: '192.168.10.10' },
    { id: 'dns', label: 'DNSサーバ', role: 'dns', zoneId: 'lan', sub: '192.168.10.53' },
    { id: 'dhcp', label: 'DHCPサーバ', role: 'server', zoneId: 'lan', sub: '192.168.10.67' },
  ],
  links: [
    { a: 'auth', b: 'l2sw' },
    { a: 'pc', b: 'l2sw' },
    { a: 'dns', b: 'l2sw' },
    { a: 'dhcp', b: 'l2sw' },
    { a: 'l2sw', b: 'r' },
  ],
}

const mapFigure: PacketFlowFigure = {
  kind: 'packet-flow',
  id: 'ch13-map',
  title: '認証サーバが加わり、LANの入口が開くまで',
  caption: 'ステップを送ると、PCの扱いが[[red:遮断]]から[[green:通過]]へ切り替わる瞬間までをたどれます。',
  takeaway: 'つないだだけでは、まだLANを使えません。入口を開ける条件が[[blue:認証の合格]]です。',
  topology: mapTopology,
  hideHeaders: true,
  steps: [
    {
      focus: { type: 'node', id: 'auth' },
      packetLabel: '',
      headers: { l2: '', l3: '' },
      explanation: '内部LANの新顔が認証サーバ（RADIUS）。DNS・DHCPと並ぶ、係のサーバの1台です。',
    },
    {
      focus: { type: 'node', id: 'pc' },
      verdict: 'block',
      packetLabel: '',
      headers: { l2: '', l3: '' },
      explanation: 'つないだ直後のPC。認証が済むまで、L2SWは通信をLANへ通しません。',
    },
    {
      focus: { type: 'link', a: 'l2sw', b: 'auth' },
      packetLabel: '',
      headers: { l2: '', l3: '' },
      explanation: 'L2SWが利用者の情報をこの線の先へ問い合わせ、可否の応答を待ちます。',
    },
    {
      focus: { type: 'node', id: 'pc' },
      verdict: 'pass',
      packetLabel: '',
      headers: { l2: '', l3: '' },
      explanation: '認証OK。L2SWが通信を通し、PCは内部LANを使えるようになります。',
    },
  ],
}

// §2 RADIUS の3者シーケンス（利用者PC｜L2SW＝取り次ぎ｜認証サーバ）。第14章 802.1X の素地。
const radiusFigure: SequenceFigure = {
  kind: 'sequence',
  id: 'ch13-radius',
  title: 'LANにつなぐときの認証の流れ（RADIUS）',
  caption: '取り次ぐ[[green:L2SW]]と、確かめる[[blue:認証サーバ]]。役割の分かれ方に注目です。',
  takeaway: 'L2SWが確かめているのではなく、[[blue:認証サーバ]]が判断します。機器は[[green:取り次ぐだけ]]です。',
  actors: [
    { id: 'pc', label: '利用者のPC', role: 'pc' },
    { id: 'sw', label: 'L2SW', sub: '取り次ぎ役', role: 'switch' },
    { id: 'auth', label: '認証サーバ', sub: 'RADIUS', role: 'server' },
  ],
  messages: [
    {
      from: 'pc',
      to: 'sw',
      label: '① 接続とID提示',
      note: '利用者がLANにつなぎ、IDとパスワードを示します。この時点ではまだLANへ出られません。',
    },
    {
      from: 'sw',
      to: 'auth',
      label: '② 認証要求',
      note: 'L2SWは自分で確かめず、預かった情報を認証サーバ（RADIUS）へ問い合わせます。',
    },
    {
      from: 'auth',
      to: 'sw',
      label: '③ 許可の応答',
      note: '認証サーバが登録情報と照合し、「この利用者はOK」と可否を応答します。',
    },
    {
      from: 'sw',
      to: 'pc',
      label: '④ 接続を許可',
      note: '応答を受けたL2SWが接続を許可し、PCは内部LANを使えるようになります。',
    },
  ],
}

// §4 証明書チェーン（timeline 再利用）。上が下を署名する連鎖＝第4章サーバ証明書の伏線回収。
const certChainFigure: TimelineFigure = {
  kind: 'timeline',
  id: 'ch13-cert-chain',
  title: 'サーバ証明書を支える署名の連鎖',
  caption: '上の認証局が、すぐ下の証明書に[[blue:署名]]して「本物」を保証します。',
  takeaway: 'ブラウザは[[amber:下から上]]へ署名をたどり、[[rose:ルートCA]]へ行き着けば信頼。起点は端末の中にあります。',
  items: [
    {
      badge: 'ルートCA',
      label: '信頼の起点となる認証局',
      detail: 'PCやスマホにあらかじめ登録済み。自分で自分に署名しています。',
      tone: 'rose',
    },
    {
      badge: '中間CA',
      label: 'ルートCAが署名した認証局',
      detail: '実際のサーバ証明書の発行を受け持ちます。ルートCAの署名が本物の証です。',
      tone: 'violet',
    },
    {
      badge: 'サーバ',
      label: '中間CAが署名したサーバ証明書',
      detail: '第4章でWebサーバが提示したもの。連鎖をたどれるから信頼できます。',
      tone: 'amber',
    },
  ],
}

export const ch13AuthSsoPki: TextbookChapter = {
  id: 'auth-sso-pki',
  order: 13,
  title: '認証・認可・SSO・PKI',
  summary:
    '「あなたは誰か」を確かめる認証と、「何をしてよいか」を決める認可の区別を出発点に、認証を一元管理するRADIUS、一度の認証で複数のサービスを使うSSO、署名の連鎖で証明書の本物を保証するPKIを理解します。第4章のサーバ証明書の「なぜ信じられるか」に、ここで答えます。',
  status: 'published',
  estimatedMinutes: 15,
  intro: [
    {
      kind: 'text',
      text: '第4章のTLSでは、Webサーバが[[amber:サーバ証明書]]を示し、ブラウザが「本物のサーバか」を確かめました。今度は立場が逆です。サービスを使おうとする[[blue:利用者]]が何者かを、ネットワークの側が確かめる番。',
    },
    {
      kind: 'text',
      text: 'この章では、「誰か」を確かめる[[blue:認証]]と「何をしてよいか」を決める[[violet:認可]]の区別から始め、認証を一元化する[[blue:RADIUS]]、一度の認証で複数サービスを使う[[blue:SSO]]、証明書の信頼を支える[[blue:PKI]]まで——ネットワークの「確かめる仕組み」をまとめて整理します。',
    },
  ],
  sections: [
    {
      heading: '認証と認可——「誰か」と「何をしてよいか」',
      blocks: [
        {
          kind: 'text',
          text: 'ログイン画面でIDとパスワードを入れる——これは「[[blue:あなたは誰か]]」を確かめる[[blue:認証]]です。一方、ログインした人がどのフォルダを開けるか、設定を変えられるかを決めるのが[[violet:認可]]。答える問いが違う、別の仕組みです。',
        },
        { kind: 'figure', figure: authAuthzTable },
        {
          kind: 'text',
          text: '順番も決まっています。誰か分からない相手に権限は選べないので、必ず[[blue:認証]]が先、[[violet:認可]]が後。午後の記述でも、この2語の使い分けが問われます。',
        },
        {
          kind: 'callout',
          tone: 'warn',
          title: 'ログインできる＝何でもできる、ではありません',
          body: '認証に通っても、[[violet:認可]]されていない操作はできません。「ログインはできるのに共有フォルダが開けない」は、認証ではなく[[violet:認可]]の設定を疑う場面です。',
        },
      ],
    },
    {
      heading: 'RADIUS——認証の一元化',
      blocks: [
        {
          kind: 'text',
          text: '社内には、利用者を確かめたい機器がいくつもあります。LANの入口のL2SW、無線のAP、社外から接続を受けるVPN装置。1台1台が利用者のIDとパスワードを別々に持つと、入社・退職のたびに全機器を直して回ることになり、修正漏れも生まれます。',
        },
        {
          kind: 'text',
          text: 'そこで、確かめる仕事を1台の[[blue:認証サーバ]]へ集めます。機器と認証サーバの間で使う標準の仕組みが[[blue:RADIUS]]。構成図の内部LANに、この認証サーバが加わります。',
        },
        { kind: 'figure', figure: mapFigure },
        {
          kind: 'text',
          text: '機器の仕事は[[green:取り次ぎ]]だけ。利用者から預かったIDを認証サーバへ送り、返ってきた可否の応答に従います。3者が何をやり取りしているのか、会話の中身を見てみましょう。',
        },
        { kind: 'figure', figure: radiusFigure },
        {
          kind: 'callout',
          tone: 'info',
          title: 'この3者の並びは、第14章でもう一度',
          body: '利用者｜取り次ぐ機器｜認証サーバという3者の形は、無線LANの[[blue:IEEE802.1X]]認証でそのまま主役になります。ここで見慣れておくと、第14章がぐっと楽になります。',
        },
      ],
    },
    {
      heading: 'SSO——一度の認証で、複数のサービスへ',
      blocks: [
        {
          kind: 'text',
          text: '認証を1か所に集める発想は、Webサービスの世界にもあります。業務で使うサービスが10個あり、それぞれでID・パスワードを別々に管理すると、利用者も管理者も手が回りません。そこで[[blue:SSO]]（シングルサインオン）です。',
        },
        {
          kind: 'text',
          text: 'SSOでは、最初に一度だけ認証の窓口でログインし、各サービスはその結果を信頼して利用者を受け入れます。[[blue:一度の認証で、複数のサービスへ]]——RADIUSが社内機器の認証をまとめたように、SSOはサービス側の認証をまとめます。',
        },
        {
          kind: 'callout',
          tone: 'info',
          title: 'SAMLとOIDCは、名前だけで十分',
          body: 'SSOを実現する代表的な方式が[[blue:SAML]]と[[blue:OIDC]]。ネスペでは仕組みの深掘りまでは問われないので、「SSOを実現する方式の名前」と押さえれば十分です。',
        },
      ],
    },
    {
      heading: '証明書チェーンとPKI——「本物」を保証する連鎖',
      blocks: [
        {
          kind: 'text',
          text: '最後に、第4章の宿題を回収します。TLSハンドシェイクでWebサーバは証明書を提示しました。では、その証明書自体が偽物だったら？ ブラウザが偽物を見抜ける理由が、[[blue:署名の連鎖]]です。',
        },
        {
          kind: 'text',
          text: 'サーバ証明書には、発行元の[[blue:認証局]]（CA）による署名（発行元が確かに認めた印）が入っています。その認証局が本物かは、さらに上位の認証局の署名が保証。この連鎖をさかのぼった頂点が[[rose:ルートCA]]です。',
        },
        { kind: 'figure', figure: certChainFigure },
        {
          kind: 'text',
          text: '証明書と認証局で信頼を支えるこの仕組み全体が[[blue:PKI]]（公開鍵基盤）。第4章の「証明書で本物を確かめる」は、この土台の上に成り立っていました。',
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: '信頼の起点はルートCA',
          body: '「なぜルートCAは信じられるのか」——答えは、[[rose:端末にあらかじめ入っている]]からです。逆に、連鎖のどこか1つでも署名を確認できなければ、ブラウザは警告を出します。',
        },
      ],
    },
    {
      heading: '午後の着眼点——認証の流れと証明書の管理',
      blocks: [
        {
          kind: 'text',
          text: '午後の認証問題は、[[blue:誰が・どこを経て・どこへ問い合わせるか]]の流れを、構成図の上で追わせるのが定番です。RADIUSなら、取り次ぐ機器と認証サーバの位置を図から読み取り、通信の順番を答えます。',
        },
        {
          kind: 'check',
          label: '設問例',
          items: [
            {
              question:
                '利用者が社内LANへ接続するとき、L2SWは利用者のIDとパスワードを自分では確かめず、内部LANのサーバ（192.168.10.40）へ問い合わせ、可否の応答に従って接続を許可しています。このサーバの役割は何か。',
              answer:
                '認証サーバ（RADIUSサーバ）です。認証をまとめて引き受ける役割で、各機器は利用者の情報を取り次ぎ、応答に従うだけです。利用者の追加・削除も、このサーバ1台の変更で全機器に行き渡ります。',
            },
          ],
        },
        {
          kind: 'text',
          text: '証明書側の定番は[[amber:有効期限]]。期限切れはブラウザの警告となり、サービス停止事故の原因になります。期限内でも秘密鍵が漏れたら証明書を[[red:失効]]させ、失効していないかを確かめる仕組みとして[[blue:CRL]]と[[blue:OCSP]]の名前が挙がります。',
        },
      ],
    },
  ],
  takeaways: [
    '[[blue:認証]]は「あなたは誰か」、[[violet:認可]]は「何をしてよいか」。別の問いで、順番は必ず認証→認可です。',
    '[[blue:RADIUS]]は認証を認証サーバへ集める標準の仕組み。IDの登録・変更を機器ごとに繰り返さずに済みます。',
    '[[blue:SSO]]は一度の認証で複数のサービスを使う仕組み。実現方式としてSAML・OIDCの名前があります。',
    'サーバ証明書は、[[rose:ルートCA]]→中間CA→サーバへと続く[[blue:署名の連鎖]]で本物と保証されます。この土台が[[blue:PKI]]です。',
  ],
  checks: [
    {
      question: 'ログインには成功したのに、共有フォルダへのアクセスは拒否されました。認証と認可のどちらの問題か。',
      answer:
        '認可の問題です。「あなたは誰か」の確認（認証）は通っていますが、そのフォルダを使ってよいという権限（認可）が与えられていません。',
    },
    {
      question: '認証サーバ（RADIUS）を置かず、L2SWやAPが利用者IDを個別に持つと、どんな困りごとが起きるか。',
      answer:
        '利用者の追加・削除・変更のたびに全機器の設定を直す必要があり、修正漏れや食い違いが生まれます。認証サーバに集めれば、1か所の変更で済みます。',
    },
    {
      question: 'ブラウザがサーバ証明書の署名の連鎖をさかのぼるとき、最後に信頼のよりどころとするものは何か。',
      answer:
        'ルートCAの証明書です。PCやスマホにあらかじめ登録されており、ここへ行き着ければ連鎖全体を本物と判断できます。',
    },
  ],
}
