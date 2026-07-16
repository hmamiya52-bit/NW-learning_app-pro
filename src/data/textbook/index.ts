import { ch01Osi } from './chapters/ch01-osi'
import { ch02DnsDhcp } from './chapters/ch02-dns-dhcp'
import { ch03TcpUdpPort } from './chapters/ch03-tcp-udp-port'
import { ch04WebTlsHttp } from './chapters/ch04-web-tls-http'
import { ch05L2VlanStp } from './chapters/ch05-l2-vlan-stp'
import { ch06IpSubnet } from './chapters/ch06-ip-subnet'
import { ch07Routing } from './chapters/ch07-routing'
import { ch08InternetNatBgp } from './chapters/ch08-internet-nat-bgp'
import { ch09SecurityFwDmz } from './chapters/ch09-security-fw-dmz'
import { ch10LbProxyCdn } from './chapters/ch10-lb-proxy-cdn'
import { ch11Availability } from './chapters/ch11-availability'
import { ch12VpnWanSdwan } from './chapters/ch12-vpn-wan-sdwan'
import { ch13AuthSsoPki } from './chapters/ch13-auth-sso-pki'
import { ch14WirelessLan } from './chapters/ch14-wireless-lan'
import { ch15Ipv6 } from './chapters/ch15-ipv6'
import { ch16Mail } from './chapters/ch16-mail'
import { ch17VirtualizationCloud } from './chapters/ch17-virtualization-cloud'
import { ch18VoipQosMulticast } from './chapters/ch18-voip-qos-multicast'
import { ch19Operations } from './chapters/ch19-operations'
import type { TextbookChapter } from './types'

export type { TextbookChapter, Block, Section, Figure } from './types'

// 第2章以降は準備中（draft）。docs/textbook-curriculum-design.md のマップ（4部構成・
// 構成図の段階的成長）に沿って順に作る。順序＝学習の積み上げ＋構成図が育つ順。
const DRAFTS: [number, string, string, string][] = [
  // 第4部 運用と総合
  [20, 'afternoon-reading', '午後問題の読み方・総合演習', '積み上げた全体図と設問を使い、午後の構成図読解を総合演習します。'],
]

const drafts: TextbookChapter[] = DRAFTS.map(([order, id, title, summary]) => ({
  id,
  order,
  title,
  summary,
  status: 'draft',
  estimatedMinutes: 0,
  intro: [],
  sections: [],
  takeaways: [],
}))

export const textbookChapters: TextbookChapter[] = [ch01Osi, ch02DnsDhcp, ch03TcpUdpPort, ch04WebTlsHttp, ch05L2VlanStp, ch06IpSubnet, ch07Routing, ch08InternetNatBgp, ch09SecurityFwDmz, ch10LbProxyCdn, ch11Availability, ch12VpnWanSdwan, ch13AuthSsoPki, ch14WirelessLan, ch15Ipv6, ch16Mail, ch17VirtualizationCloud, ch18VoipQosMulticast, ch19Operations, ...drafts].sort((a, b) => a.order - b.order)

export function getTextbookChapter(chapterId: string | undefined): TextbookChapter | undefined {
  if (!chapterId) return undefined
  return textbookChapters.find((chapter) => chapter.id === chapterId)
}

export function getPublishedTextbookChapters(): TextbookChapter[] {
  return textbookChapters.filter((chapter) => chapter.status === 'published')
}
