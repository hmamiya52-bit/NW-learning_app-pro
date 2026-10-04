/**
 * R4 午後Ⅰ 問3 の図3〜図5（SRV レコード）の中身
 *
 * `|` は折り返してよい所（ドメイン名はドットの後ろでだけ割る）。部品は R4G13Srv.tsx。
 */

/** SRV レコードの欄（図3 のフォーマットと、図4・図5 の見出し） */
export const SRV_FIELDS = ['_Service.|_Proto.|Name', 'TTL', 'Class', 'SRV', 'Priority', 'Weight', 'Port', 'Target']

/** 欄の位置（強調する欄を名前で指すため） */
export const COL = { name: 0, ttl: 1, class: 2, srv: 3, priority: 4, weight: 5, port: 6, target: 7 } as const

const KERBEROS = '_kerberos.|_tcp.|naibulan.|y-sha.jp.'

/** 図4 ケルベロス認証向けの SRV レコードの内容（2行） */
export const FIG4_ROWS: string[][] = [
  [KERBEROS, '43200', 'IN', 'SRV', '120', '2', '88', 'DS1.|naibulan.|y-sha.jp.'],
  [KERBEROS, '43200', 'IN', 'SRV', '120', '1', '88', 'DS2.|naibulan.|y-sha.jp.'],
]

/** 図5 変更後の SRV レコードの内容（1行） */
export const FIG5_ROWS: string[][] = [[KERBEROS, '43200', 'IN', 'SRV', '120', '1', '88', 'DS.|naibulan.|y-sha.jp.']]
