import type { Question } from '../../types'

export const ipsecQuestions: Question[] = [
  {
    id: 'q-070',
    topicId: 'ipsec',
    questionText: 'IPsecにおいてVPN装置間の通信を行うモードを{{blank}}という。',
    correctAnswer: 'トンネルモード',
    choices: ['トンネルモード', 'トランスポートモード', 'アグレッシブモード', 'メインモード'],
    isImportant: false,
    explanation: 'トンネルモードはVPN装置間でIPsec通信を行う。PCに個別のIPsec設定が不要なため企業間でよく使われる。トランスポートモードは端末間で直接IPsec通信を行う。',
    difficulty: 2,
  },
  {
    id: 'q-071',
    topicId: 'ipsec',
    questionText: 'IPsecのプロトコルのうち、認証のみを行い暗号化を行わないものを{{blank}}という。',
    correctAnswer: 'AH（Authentication Header）',
    choices: ['AH（Authentication Header）', 'ESP', 'IKE', 'ISAKMP'],
    isImportant: true,
    explanation: 'AH（Authentication Header）はIPヘッダを含むパケット全体を認証するが暗号化しない。ESP（Encapsulating Security Payload）はペイロードを暗号化し認証も行う。実運用ではESPが主に使われる。',
    difficulty: 2,
  },
  {
    id: 'q-072',
    topicId: 'ipsec',
    questionText: 'IPsecのSA（Security Association）を確立するために使われるプロトコルを{{blank}}という。',
    correctAnswer: 'IKE（Internet Key Exchange）',
    choices: ['IKE（Internet Key Exchange）', 'AH', 'ESP', 'ISAKMP'],
    isImportant: true,
    explanation: 'IKE（現行はIKEv2）はUDP 500番ポートを使用してIPsecのSAを確立する。フェーズ1でIKE SA（管理チャネル）、フェーズ2でIPsec SAを交換する。',
    difficulty: 2,
  },
  {
    id: 'q-073',
    topicId: 'ipsec',
    questionText: 'IPsecのNATトラバーサルで使用するプロトコルとポート番号は{{blank}}である。',
    correctAnswer: 'UDP 4500番',
    choices: ['UDP 4500番', 'TCP 1701番', 'UDP 500番', 'TCP 443番'],
    isImportant: false,
    explanation: 'NAPTを経由するIPsec通信はAH/ESPのポートがなくNATに不向き。NATトラバーサル（NAT-T）はESPをUDP 4500でカプセル化してNAPT越えを実現する。',
    difficulty: 3,
  },
]
