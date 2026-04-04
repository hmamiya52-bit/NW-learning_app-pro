import type { Question } from '../../types'

export const firewallQuestions: Question[] = [
  {
    id: 'q-080',
    topicId: 'firewall',
    questionText: 'ファイアウォールがTCPコネクションの状態を管理し、確立済みセッションのパケットのみを通過させる機能を{{blank}}という。',
    correctAnswer: 'ステートフルインスペクション',
    choices: ['ステートフルインスペクション', 'パケットフィルタリング', 'アプリケーションゲートウェイ', 'ディープパケットインスペクション'],
    isImportant: true,
    explanation: 'ステートフルインスペクションはセッションテーブルでTCPの状態（SYN/SYN-ACK/ACK）を追跡し、確立済みの戻りパケットを自動許可する。単純なパケットフィルタリングより安全。',
    difficulty: 2,
  },
  {
    id: 'q-081',
    topicId: 'firewall',
    questionText: 'NAPTにおいて、プライベートIPアドレスとポート番号を変換してグローバルIPアドレス1つで複数端末がインターネット通信できる技術を{{blank}}という。',
    correctAnswer: 'NAPT（IPマスカレード）',
    choices: ['NAPT（IPマスカレード）', '静的NAT', 'DNATポートフォワード', 'プロキシ'],
    isImportant: true,
    explanation: 'NAPT（Network Address Port Translation）はIPアドレスとポート番号のペアを変換する。1つのグローバルIPで最大約65000の同時セッションを区別できる。LinuxではIPマスカレードとも呼ばれる。',
    difficulty: 1,
  },
  {
    id: 'q-082',
    topicId: 'firewall',
    questionText: '外部公開サーバを内部LAN・外部ネットワークのどちらとも分離して配置するネットワーク領域を{{blank}}という。',
    correctAnswer: 'DMZ（非武装地帯）',
    choices: ['DMZ（非武装地帯）', '内部セグメント', 'バックエンドゾーン', 'トラストゾーン'],
    isImportant: true,
    explanation: 'DMZ（Demilitarized Zone）はWebサーバ・メールサーバ等を配置する中間ネットワーク。外部からDMZのみアクセスを許可し内部LANへの侵害を防ぐ。ファイアウォールで三つのゾーンに分割する構成が一般的。',
    difficulty: 1,
  },
  {
    id: 'q-083',
    topicId: 'firewall',
    questionText: 'NAPTとポートフォワードを組み合わせて、外部からの特定ポートへのアクセスを内部サーバの特定ポートに転送する設定を{{blank}}という。',
    correctAnswer: 'DNAT（宛先NAT）',
    choices: ['DNAT（宛先NAT）', 'SNAT', 'PAT', 'ヘアピンNAT'],
    isImportant: false,
    explanation: 'DNAT（Destination NAT）は受信パケットの宛先IPアドレス（またはポート）を書き換える。NAPTのポートフォワーディングはDNATの一種。外部からDMZのWebサーバへの公開に使用する。',
    difficulty: 2,
  },
]
