// 分野（カテゴリ）と「午後問題キーワード」「教科書の章」の対応表
//
// 午後Ⅰの頻出度は、この表を使って afternoonProblems の keywords から集計する。
// キーワードを直接カテゴリIDに持たせていないのは、1つのキーワードが複数分野にまたがる
// （例: 「冗長化」は VRRP と LB の双方が主役になる）ため。
//
// afternoonKeywords: その分野が主役として問われるキーワード
// textbookChapterId: 対応する教科書の章 id（src/data/textbook/chapters/ の各章 id）

export interface CategoryFocus {
  categoryId: string
  afternoonKeywords: string[]
  textbookChapterId?: string
}

export const categoryFocus: CategoryFocus[] = [
  { categoryId: 'layer1-3', afternoonKeywords: ['スイッチング'], textbookChapterId: 'l2-vlan-stp' },
  { categoryId: 'layer4-7', afternoonKeywords: ['HTTP・CDN'], textbookChapterId: 'tcp-udp-port' },
  { categoryId: 'firewall', afternoonKeywords: ['セキュリティ'], textbookChapterId: 'security-fw-dmz' },
  { categoryId: 'wireless', afternoonKeywords: ['無線LAN'], textbookChapterId: 'wireless-lan' },
  { categoryId: 'routing', afternoonKeywords: ['ルーティング', 'マルチキャスト'], textbookChapterId: 'routing' },
  { categoryId: 'vrrp', afternoonKeywords: ['冗長化'], textbookChapterId: 'availability' },
  { categoryId: 'wan', afternoonKeywords: ['WAN', 'クラウド'], textbookChapterId: 'vpn-wan-sdwan' },
  { categoryId: 'load-balancer', afternoonKeywords: ['冗長化', 'HTTP・CDN'], textbookChapterId: 'lb-proxy-cdn' },
  { categoryId: 'dhcp', afternoonKeywords: ['DHCP'], textbookChapterId: 'dns-dhcp' },
  { categoryId: 'dns', afternoonKeywords: ['DNS'], textbookChapterId: 'dns-dhcp' },
  { categoryId: 'mail', afternoonKeywords: ['メールセキュリティ'], textbookChapterId: 'mail' },
  { categoryId: 'voip', afternoonKeywords: ['VoIP・IP電話', 'QoS'], textbookChapterId: 'voip-qos-multicast' },
  { categoryId: 'ipsec', afternoonKeywords: ['VPN'], textbookChapterId: 'vpn-wan-sdwan' },
  { categoryId: 'sdn', afternoonKeywords: ['SDN・自動化', '仮想化'], textbookChapterId: 'virtualization-cloud' },
  // TLS は「HTTP・CDN」「ゼロトラスト・SWG」の問題で中心技術として問われる
  { categoryId: 'ssl-tls', afternoonKeywords: ['HTTP・CDN', 'ゼロトラスト・SWG'], textbookChapterId: 'web-tls-http' },
  { categoryId: 'security', afternoonKeywords: ['認証・SSO'], textbookChapterId: 'auth-sso-pki' },
  { categoryId: 'threat', afternoonKeywords: ['セキュリティ'], textbookChapterId: 'security-fw-dmz' },
  { categoryId: 'ipv6', afternoonKeywords: ['IPv6', 'NAT・IPv6移行'], textbookChapterId: 'ipv6' },
  { categoryId: 'proxy', afternoonKeywords: ['ゼロトラスト・SWG'], textbookChapterId: 'lb-proxy-cdn' },
  { categoryId: 'network-mgmt', afternoonKeywords: ['運用管理・監視'], textbookChapterId: 'operations' },
  // 直前確認用のまとめ。午後の特定分野に対応しない
  { categoryId: 'protocol-review', afternoonKeywords: [], textbookChapterId: 'tcp-udp-port' },
  { categoryId: 'iot', afternoonKeywords: ['IoT'] },
]

export function getCategoryFocus(categoryId: string): CategoryFocus | undefined {
  return categoryFocus.find((f) => f.categoryId === categoryId)
}
