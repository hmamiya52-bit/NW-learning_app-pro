export interface Protocol {
  name: string
  port?: string
  layer: string
  transport?: string
  description: string
  category: string
}

export const protocols: Protocol[] = [
  // ── L2・データリンク ──────────────────────────
  { name: 'Ethernet', layer: 'L2', description: 'IEEE 802.3準拠の有線LAN規格。フレーム単位でデータ転送を行う。', category: 'L2・データリンク' },
  { name: 'STP', layer: 'L2', description: 'Spanning Tree Protocol。L2ループを防止するプロトコル（IEEE 802.1D）。', category: 'L2・データリンク' },
  { name: 'RSTP', layer: 'L2', description: 'Rapid STP。STPの高速版（IEEE 802.1w）。コンバージェンス時間を数秒に短縮。', category: 'L2・データリンク' },
  { name: 'VLAN', layer: 'L2', description: 'Virtual LAN。L2SWを論理的なネットワークに分割する技術（IEEE 802.1Q）。', category: 'L2・データリンク' },
  { name: 'LACP', layer: 'L2', description: 'Link Aggregation Control Protocol。複数リンクを束ねるリンクアグリゲーション制御（IEEE 802.3ad）。', category: 'L2・データリンク' },
  { name: 'ARP', layer: 'L2/L3', description: 'Address Resolution Protocol。IPアドレスからMACアドレスを解決する。', category: 'L2・データリンク' },

  // ── L3・ネットワーク ──────────────────────────
  { name: 'IP', layer: 'L3', description: 'Internet Protocol。パケット単位でベストエフォート転送を行う（IPv4/IPv6）。', category: 'L3・ネットワーク' },
  { name: 'ICMP', layer: 'L3', transport: 'IP', description: 'Internet Control Message Protocol。疎通確認（ping）やエラー通知に使用。', category: 'L3・ネットワーク' },
  { name: 'OSPF', layer: 'L3', description: 'Open Shortest Path First。リンクステート型IGP。コストを基にSPFで最短経路を算出。', category: 'L3・ネットワーク' },
  { name: 'BGP', layer: 'L3', port: 'TCP 179', description: 'Border Gateway Protocol。AS間ルーティングに使うパスベクタ型EGP。', category: 'L3・ネットワーク' },
  { name: 'RIP', layer: 'L3', port: 'UDP 520', description: 'Routing Information Protocol。ホップ数をメトリックとするディスタンスベクタ型IGP。最大15ホップ。', category: 'L3・ネットワーク' },
  { name: 'VRRP', layer: 'L3', description: 'Virtual Router Redundancy Protocol。仮想IPでデフォルトゲートウェイを冗長化する（RFC 5798）。', category: 'L3・ネットワーク' },
  { name: 'NDP', layer: 'L3', description: 'Neighbor Discovery Protocol。IPv6のARPに相当。NS/NA/RS/RAでアドレス解決・ルータ探索を行う（ICMPv6使用）。', category: 'L3・ネットワーク' },

  // ── L4・トランスポート ──────────────────────────
  { name: 'TCP', layer: 'L4', description: 'Transmission Control Protocol。3ウェイハンドシェイク・再送・順序保証を提供する信頼性の高いプロトコル。', category: 'L4・トランスポート' },
  { name: 'UDP', layer: 'L4', description: 'User Datagram Protocol。コネクションレスで低遅延。DNS・VoIP・ストリーミングに使用。', category: 'L4・トランスポート' },
  { name: 'QUIC', layer: 'L4', transport: 'UDP', description: 'Quick UDP Internet Connections。HTTP/3の基盤。TLS 1.3統合・HOLブロッキング解消。', category: 'L4・トランスポート' },

  // ── DNS・名前解決 ──────────────────────────
  { name: 'DNS', layer: 'L7', port: 'UDP/TCP 53', description: 'Domain Name System。ドメイン名とIPアドレスの相互変換を行う分散データベース。', category: 'DNS・名前解決' },
  { name: 'DNSSEC', layer: 'L7', description: 'DNS Security Extensions。DNSレコードにデジタル署名を付加し改ざんを防止する。', category: 'DNS・名前解決' },
  { name: 'mDNS', layer: 'L7', port: 'UDP 5353', description: 'Multicast DNS。DNSサーバなしでローカルネットワーク内の名前解決を行う。', category: 'DNS・名前解決' },

  // ── アドレス管理 ──────────────────────────
  { name: 'DHCP', layer: 'L7', port: 'UDP 67/68', description: 'Dynamic Host Configuration Protocol。IPアドレスをクライアントに動的に割り当てる（DORA）。', category: 'アドレス管理' },
  { name: 'DHCPv6', layer: 'L7', port: 'UDP 546/547', description: 'IPv6用のDHCP。SLAACと組み合わせてDNSサーバ情報を配布するStateless DHCPv6が多い。', category: 'アドレス管理' },

  // ── HTTP・Web ──────────────────────────
  { name: 'HTTP/1.1', layer: 'L7', port: 'TCP 80', description: 'HyperText Transfer Protocol。テキストベースのWebプロトコル。パイプライン対応（HOLブロッキングあり）。', category: 'HTTP・Web' },
  { name: 'HTTP/2', layer: 'L7', port: 'TCP 443', description: 'マルチプレキシング・HPACK圧縮・サーバプッシュを採用。TLSが事実上必須。', category: 'HTTP・Web' },
  { name: 'HTTP/3', layer: 'L7', transport: 'QUIC', port: 'UDP 443', description: 'QUIC上で動作。TCPのHOLブロッキングを根本解決。TLS 1.3統合。', category: 'HTTP・Web' },
  { name: 'HTTPS', layer: 'L7', port: 'TCP 443', description: 'HTTP over TLS。サーバ証明書による認証と暗号化通信を行う。', category: 'HTTP・Web' },
  { name: 'WebSocket', layer: 'L7', port: 'TCP 80/443', description: 'HTTP接続をアップグレードして全二重通信を実現するプロトコル。リアルタイムアプリに使用。', category: 'HTTP・Web' },

  // ── メール ──────────────────────────
  { name: 'SMTP', layer: 'L7', port: 'TCP 25 / 587', description: 'Simple Mail Transfer Protocol。メール転送プロトコル。クライアント→サーバはSubmission（587/465）を使用。', category: 'メール' },
  { name: 'POP3', layer: 'L7', port: 'TCP 110 / 995', description: 'Post Office Protocol v3。メールをサーバからダウンロードして削除する。POP3S（SSL）は995番。', category: 'メール' },
  { name: 'IMAP', layer: 'L7', port: 'TCP 143 / 993', description: 'Internet Message Access Protocol。メールをサーバ上で管理する。複数デバイス間の同期が可能。', category: 'メール' },
  { name: 'DKIM', layer: 'L7', description: 'DomainKeys Identified Mail。メールに電子署名を付加して送信元ドメインの正当性を証明する。', category: 'メール' },
  { name: 'SPF', layer: 'L7', description: 'Sender Policy Framework。DNSのTXTレコードで送信元IPを検証してなりすましを防止する。', category: 'メール' },
  { name: 'DMARC', layer: 'L7', description: 'SPF/DKIMの結果に基づくメール処理ポリシー（none/quarantine/reject）を定義する仕組み。', category: 'メール' },

  // ── SSL/TLS・暗号 ──────────────────────────
  { name: 'TLS', layer: 'L7', port: 'TCP 443', description: 'Transport Layer Security。現行の標準暗号化プロトコル。TLS 1.3が最新（1.0/1.1は廃止）。', category: 'SSL/TLS・暗号' },
  { name: 'OCSP', layer: 'L7', port: 'TCP 80/443', description: 'Online Certificate Status Protocol。証明書の失効状態をリアルタイムで確認するプロトコル。', category: 'SSL/TLS・暗号' },

  // ── VPN・トンネル ──────────────────────────
  { name: 'IPsec', layer: 'L3', description: 'IP Security。L3レベルの暗号化VPNプロトコル。AH（認証のみ）とESP（暗号化+認証）で構成。', category: 'VPN・トンネル' },
  { name: 'IKE / IKEv2', layer: 'L7', port: 'UDP 500', description: 'Internet Key Exchange。IPsecのSAを確立するための鍵交換プロトコル。NAT越えはUDP 4500を使用。', category: 'VPN・トンネル' },
  { name: 'L2TP', layer: 'L2', port: 'UDP 1701', description: 'Layer 2 Tunneling Protocol。PPPフレームをカプセル化するトンネルプロトコル。通常IPsecと組み合わせる。', category: 'VPN・トンネル' },
  { name: 'SSL-VPN', layer: 'L7', port: 'TCP 443', description: 'SSL/TLSを使ったVPN。Webブラウザからクライアントレス接続が可能。FW越えが容易。', category: 'VPN・トンネル' },

  // ── 認証・認可 ──────────────────────────
  { name: 'RADIUS', layer: 'L7', port: 'UDP 1812/1813', description: 'Remote Authentication Dial-In User Service。NASがRADIUSサーバに認証・認可・課金を委託するAAAプロトコル。', category: '認証・認可' },
  { name: 'LDAP', layer: 'L7', port: 'TCP 389 / 636', description: 'Lightweight Directory Access Protocol。ディレクトリサービスへのアクセスプロトコル。LDAPS（TLS）は636番。', category: '認証・認可' },
  { name: 'IEEE 802.1X', layer: 'L2', description: 'ポートベースのネットワークアクセス制御。サプリカント・Authenticator（AP/SW）・RADIUSの3者構成。', category: '認証・認可' },
  { name: 'SAML', layer: 'L7', description: 'Security Assertion Markup Language。XMLベースのSSOフェデレーション規格。IdPとSP間でアサーションを交換する。', category: '認証・認可' },
  { name: 'Kerberos', layer: 'L7', port: 'TCP/UDP 88', description: 'チケットベースの認証プロトコル。KDC（AS+TGS）がTGTとサービスチケットを発行する。Active Directoryで使用。', category: '認証・認可' },

  // ── 監視・管理 ──────────────────────────
  { name: 'SNMP', layer: 'L7', port: 'UDP 161/162', description: 'Simple Network Management Protocol。ネットワーク機器の監視・管理プロトコル。v3で認証・暗号化を追加。', category: '監視・管理' },
  { name: 'syslog', layer: 'L7', port: 'UDP 514', description: 'システムログを収集・転送するプロトコル。ファシリティとセベリティ（0:緊急〜7:デバッグ）でメッセージを分類。', category: '監視・管理' },
  { name: 'NTP', layer: 'L7', port: 'UDP 123', description: 'Network Time Protocol。ネットワーク機器の時刻同期プロトコル。階層構造（Stratum）で同期を行う。', category: '監視・管理' },
  { name: 'NetFlow / IPFIX', layer: 'L7', description: 'フロー情報（IPアドレス・ポート・バイト数）を収集してトラフィックを分析する技術。', category: '監視・管理' },

  // ── VoIP ──────────────────────────
  { name: 'SIP', layer: 'L7', port: 'UDP/TCP 5060', description: 'Session Initiation Protocol。VoIPのシグナリングプロトコル。INVITE/BYEでセッションを制御。', category: 'VoIP' },
  { name: 'RTP', layer: 'L4', transport: 'UDP', description: 'Real-time Transport Protocol。音声・映像をリアルタイム転送する。シーケンス番号とタイムスタンプを持つ。', category: 'VoIP' },
  { name: 'RTCP', layer: 'L4', transport: 'UDP', description: 'RTP Control Protocol。RTPと対で動作しQoS統計（パケットロス率・ジッタ）を報告する。', category: 'VoIP' },

  // ── IoT ──────────────────────────
  { name: 'MQTT', layer: 'L7', port: 'TCP 1883 / 8883', description: 'Message Queuing Telemetry Transport。Pub/Sub型の軽量メッセージングプロトコル。QoS 0/1/2をサポート。', category: 'IoT' },
  { name: 'CoAP', layer: 'L7', port: 'UDP 5683', description: 'Constrained Application Protocol。制約機器向けの軽量RESTfulプロトコル。UDP上で動作（RFC 7252）。', category: 'IoT' },
  { name: 'LoRaWAN', layer: 'L2', description: 'LPWAの一種。チャープ変調（CSS）により920MHz帯で数kmの長距離通信を実現する。', category: 'IoT' },
  { name: 'Sigfox', layer: 'L2', description: 'LPWAの一種。Ultra-Narrow Band変調で月単位の電池駆動を実現。1メッセージ最大12バイト。', category: 'IoT' },
  { name: 'NB-IoT', layer: 'L1/L2', description: '3GPP標準のLPWA技術。既存LTE基地局を活用。NB-IoT・LTE-MはキャリアのIoT向け接続に使用。', category: 'IoT' },
]

export const protocolCategories = [
  'L2・データリンク',
  'L3・ネットワーク',
  'L4・トランスポート',
  'DNS・名前解決',
  'アドレス管理',
  'HTTP・Web',
  'メール',
  'SSL/TLS・暗号',
  'VPN・トンネル',
  '認証・認可',
  '監視・管理',
  'VoIP',
  'IoT',
] as const
