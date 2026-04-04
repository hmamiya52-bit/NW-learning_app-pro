import type { Question } from '../../types'

export const wanQuestions: Question[] = [
  {
    id: 'q-130',
    topicId: 'wan',
    questionText: 'MPLSにおいてルータがパケットに付加する短い識別子を{{blank}}という。',
    correctAnswer: 'ラベル',
    choices: ['ラベル', 'タグ', 'ヘッダ', 'マーカー'],
    isImportant: false,
    explanation: 'MPLS（Multi-Protocol Label Switching）はIPアドレスでなくラベルでパケットを転送する。ラベルは入口ルータ（LER）で付加され、コアルータ（LSR）でスワップされ、出口LERで除去される。',
    difficulty: 2,
  },
  {
    id: 'q-131',
    topicId: 'wan',
    questionText: 'インターネットVPNのうち、SSL/TLSを使ってWebブラウザからVPN接続できる方式を{{blank}}という。',
    correctAnswer: 'SSL-VPN',
    choices: ['SSL-VPN', 'IPsec VPN', 'L2TP VPN', 'PPTP VPN'],
    isImportant: true,
    explanation: 'SSL-VPNはHTTPS（TCP 443）を使うためFWの制限を受けにくい。リバースプロキシ型・L3トンネル型・L2トンネル型がある。クライアントレス接続が可能な点がIPsec VPNと大きく異なる。',
    difficulty: 2,
  },
  {
    id: 'q-132',
    topicId: 'wan',
    questionText: 'xDSLのうち、短距離の電話線で高速通信を実現し集合住宅のFTTB構成で使われる技術を{{blank}}という。',
    correctAnswer: 'VDSL（Very high-speed DSL）',
    choices: ['VDSL（Very high-speed DSL）', 'ADSL', 'SDSL', 'HDSL'],
    isImportant: false,
    explanation: 'VDSLは短距離（数百m程度）の電話線で高速通信を実現する。FTTHの延長として集合住宅内の既存配線を活用するFTTB+VDSLの構成で使われることが多い。',
    difficulty: 3,
  },
]
