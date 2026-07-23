import type { NoteData } from './types'

export const mail: NoteData = {
  summary: '復習ノート「メール」準拠。SMTP系・POP3/IMAP4・SMTPセッション・OP25B・SPF・DKIM・配置を整理。',
  sections: [
    {
      heading: 'メール送信プロトコル',
      richItems: [
        [
          { text: 'SMTP：メール送信プロトコル（SimpleにMailをTransferする）。ポート番号：', style: 'plain' },
          { text: '25', style: 'red' },
          { text: '。認証機能が無い', style: 'plain' },
        ],
        [
          { text: 'SMTPを改良して認証を加えたプロトコル例：', style: 'plain' },
          { text: 'POP', style: 'red' },
          { text: ' before ', style: 'plain' },
          { text: 'SMTP', style: 'red' },
          { text: '／', style: 'plain' },
          { text: 'SMTP AUTH', style: 'red' },
          { text: '（ユーザ名とパスワードで認証、ポート番号：', style: 'plain' },
          { text: '587', style: 'red' },
          { text: '）', style: 'plain' },
        ],
        [
          { text: 'SMTPS（SMTP over TLS）：非暗号のSMTP通信をTLSで暗号化するもの。ポート番号：', style: 'plain' },
          { text: '465', style: 'red' },
        ],
      ],
    },
    {
      heading: 'メール受信プロトコル',
      richItems: [
        [
          { text: 'POP3：メール受信プロトコル。ポート番号：', style: 'plain' },
          { text: '110', style: 'red' },
          { text: '。問題点：', style: 'plain' },
          { text: '複数のPC', style: 'red' },
          { text: ' から ', style: 'plain' },
          { text: '同じメールを読む', style: 'red' },
          { text: ' ことが不可能', style: 'plain' },
        ],
        [
          { text: 'POP3を改良したプロトコル：', style: 'plain' },
          { text: 'IMAP4', style: 'red' },
          { text: '。ポート番号：', style: 'plain' },
          { text: '143', style: 'red' },
          { text: '。サーバ上でメールを保管・管理する', style: 'plain' },
        ],
        [
          { text: 'POP3S：POP通信をSSLで暗号化するプロトコル。ポート番号：', style: 'plain' },
          { text: '995', style: 'red' },
        ],
      ],
    },
    {
      heading: 'SMTPセッション・エンベロープ情報',
      richItems: [
        [
          { text: 'HELO', style: 'red' },
          { text: '（または EHLO）：通信の開始', style: 'plain' },
        ],
        [
          { text: 'MAIL FROM', style: 'red' },
          { text: '：送信元メールアドレスの通知', style: 'plain' },
        ],
        [
          { text: 'RCPT TO', style: 'red' },
          { text: '：宛先メールアドレスの通知', style: 'plain' },
        ],
        [
          { text: 'DATA：本文', style: 'plain' },
        ],
        [
          { text: 'エンベロープ情報のメアド：Envelope-FROM', style: 'plain' },
        ],
        [
          { text: 'メールヘッダのメアド：', style: 'plain' },
          { text: 'Header', style: 'red' },
          { text: ' FROM', style: 'plain' },
        ],
      ],
    },
    {
      heading: 'メールセキュリティ',
      richItems: [
        [
          { text: 'メールサーバにおいて、他社から他社へのメールが転送できてしまう状態：', style: 'plain' },
          { text: 'オープンリレー', style: 'red' },
          { text: '（迷惑メールの踏み台に使われるリスク大）', style: 'plain' },
        ],
        [
          { text: 'メールの踏み台の対策として自社メールサーバで行う設定：', style: 'plain' },
          { text: '宛先が自社以外のメールアドレス以外は中継処理しない', style: 'red' },
        ],
        [
          { text: 'SMTPは認証をせずにメールを送れるので、攻撃者が自分の身元を隠して大量の迷惑メール送信が可能', style: 'plain' },
        ],
        [
          { text: 'OP25B', style: 'red' },
          { text: '：動的IPアドレスのPCから外部のネットワークへのSMTP送信（', style: 'plain' },
          { text: '25', style: 'red' },
          { text: '番ポート）を禁止する仕組み。', style: 'plain' },
          { text: '内部のメールサーバ', style: 'red' },
          { text: ' への送信と、', style: 'plain' },
          { text: '固定IPアドレス', style: 'red' },
          { text: ' からの送信は禁止されない', style: 'plain' },
        ],
        [
          { text: '外部のメールサーバを利用してメールを送信したい場合：', style: 'plain' },
          { text: 'サブミッション', style: 'red' },
          { text: ' ポート（ポート番号 ', style: 'plain' },
          { text: '587', style: 'red' },
          { text: '）を使い、SMTP-AUTHによって認証する', style: 'plain' },
        ],
      ],
    },
    {
      heading: 'SPFによるなりすまし防止',
      richItems: [
        [
          { text: 'DNSのTXTレコードに記載された送信メールサーバの ', style: 'plain' },
          { text: 'IPアドレス', style: 'red' },
          { text: ' と、受信したパケットの送信元IPアドレスを比較して認証する', style: 'plain' },
        ],
        [
          { text: '注意：DNSのMXレコードに記載されるメールサーバは ', style: 'plain' },
          { text: '受信', style: 'red' },
          { text: ' サーバの ', style: 'plain' },
          { text: 'FQDN', style: 'red' },
          { text: '／DNSのTXTレコードに記載されるメールサーバは ', style: 'plain' },
          { text: '送信', style: 'red' },
          { text: ' メールサーバの ', style: 'plain' },
          { text: 'IPアドレス', style: 'red' },
        ],
        [
          { text: '受信したパケットのメールアドレスは、', style: 'plain' },
          { text: 'Envelope', style: 'red' },
          { text: '-FROMを使って検証する', style: 'plain' },
        ],
        [
          { text: 'SPF運用：送信側 — ', style: 'plain' },
          { text: 'DNSサーバのTXTレコードに送信サーバのIPア', style: 'red' },
          { text: 'ドレスを入れる', style: 'red' },
        ],
        [
          { text: 'SPF運用：受信側 — メールサーバを ', style: 'plain' },
          { text: 'SPF対応', style: 'red' },
          { text: ' にする（送信側のメールサーバにTXTレコードを問い合わせる動作をさせる）', style: 'plain' },
        ],
      ],
    },
    {
      heading: 'DKIM・配置',
      richItems: [
        [
          { text: 'DKIM：送信メールサーバでデジタル署名を電子メールのヘッダに付与して、受信側メールサーバで検証する', style: 'plain' },
        ],
        [
          { text: '外部メールサーバ：', style: 'plain' },
          { text: 'DMZ', style: 'red' },
          { text: ' に設置（', style: 'plain' },
          { text: 'インターネット', style: 'red' },
          { text: ' からの通信を受け付ける必要があるから）', style: 'plain' },
        ],
        [
          { text: '内部メールサーバ：社内LANに設置（外部から通信できないセグメントにメールボックスを設置するため）', style: 'plain' },
        ],
      ],
    },
  ],
  exam_tips: [
    'SMTP=25 / SMTP AUTH=587 / SMTPS=465 / POP3=110 / POP3S=995 / IMAP4=143',
    'SMTP コマンド HELO → MAIL FROM → RCPT TO → DATA',
    'OP25Bは==動的IP==からの==25==番ポートSMTP送信を禁止',
    'SPFの送信側はDNSの==TXT==レコードにIPを登録、受信側はEnvelope-FROMで照合',
    'DKIMは==デジタル署名==でなりすましと改ざんを検知',
  ],
}
