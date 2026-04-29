import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'
import { VERSION_LABEL } from '../version'

export default function Login() {
  const { isAuthenticated, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/'

  const [id, setId] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // 既にログイン済みなら元の場所へ
  useEffect(() => {
    if (isAuthenticated) navigate(from, { replace: true })
  }, [isAuthenticated, from, navigate])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (submitting) return
    setError('')
    setSubmitting(true)
    const result = await login(id, password)
    setSubmitting(false)
    if (result.ok) {
      navigate(from, { replace: true })
    } else {
      setError(result.reason)
    }
  }

  return (
    <div className="min-h-screen px-4 py-8" style={{ backgroundColor: '#f8fafc' }}>
      <div className="w-full max-w-sm mx-auto">
        {/* ロゴ・タイトル */}
        <div className="text-center mb-5">
          <img
            src="/pwa-192x192.png"
            alt=""
            className="w-16 h-16 mx-auto rounded-2xl shadow-md mb-3"
          />
          <h1 className="text-lg font-black" style={{ color: '#1a3a5c' }}>
            ネットワークスペシャリスト学習アプリ
          </h1>
          <p className="text-xs text-slate-400 mt-1">{VERSION_LABEL}</p>
        </div>

        {/* フォーム */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4"
        >
          {/* 申請フォーム案内（フォーム枠の中・ID入力欄の上） */}
          <p className="text-[11px] text-slate-500 leading-relaxed bg-blue-50 border border-blue-100 rounded-lg px-3 py-2">
            アカウント未登録の方は、
            <a
              href="https://forms.gle/9w5ofDFeYDx3y4aq9"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 underline font-semibold"
            >
              申請フォーム
            </a>
            から登録してください。
          </p>

          <div>
            <label htmlFor="login-id" className="text-xs font-bold text-slate-500 block mb-1">
              ID
            </label>
            <input
              id="login-id"
              type="text"
              autoComplete="username"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              value={id}
              onChange={(e) => setId(e.target.value)}
              disabled={submitting}
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50"
              required
            />
          </div>
          <div>
            <label htmlFor="login-pw" className="text-xs font-bold text-slate-500 block mb-1">
              パスワード
            </label>
            <input
              id="login-pw"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={submitting}
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50"
              required
            />
          </div>

          {error && (
            <div
              role="alert"
              className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg px-3 py-2"
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 rounded-xl text-sm font-bold text-white transition-colors disabled:opacity-60"
            style={{ backgroundColor: '#1a3a5c' }}
          >
            {submitting ? '確認中…' : 'ログイン'}
          </button>
        </form>

        {/* ===== ログインフォームの下：アプリ概要 ===== */}
        <div className="mt-6 space-y-4">
          {/* このアプリは何？ */}
          <section className="bg-white rounded-2xl border border-slate-200 px-4 py-4">
            <h2 className="text-sm font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
              <span aria-hidden="true">📘</span> このアプリについて
            </h2>
            <p className="text-[12px] text-slate-600 leading-relaxed">
              情報処理技術者試験「ネットワークスペシャリスト（ネスペ）」の合格を
              目指す学習者向けの Web アプリです。著者の復習ノートに準拠した
              314 問の演習と、22 分野の暗記ノートを 1 つにまとめています。
            </p>
          </section>

          {/* 対象者 */}
          <section className="bg-white rounded-2xl border border-slate-200 px-4 py-4">
            <h2 className="text-sm font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
              <span aria-hidden="true">🎯</span> こんな方におすすめ
            </h2>
            <ul className="text-[12px] text-slate-600 leading-relaxed space-y-1 list-disc ml-5">
              <li>ネスペ午前 II・午後の対策をしたい受験者</li>
              <li>スキマ時間で重要キーワードを反復したい方</li>
              <li>過去問の周回管理と弱点補強を一元化したい方</li>
            </ul>
          </section>

          {/* 主な機能 */}
          <section className="bg-white rounded-2xl border border-slate-200 px-4 py-4">
            <h2 className="text-sm font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
              <span aria-hidden="true">🛠</span> 主な機能
            </h2>
            <ul className="text-[12px] text-slate-600 leading-relaxed space-y-1.5">
              <li className="flex items-start gap-2">
                <span className="text-teal-600 font-bold">📖</span>
                <span>
                  <strong className="text-slate-800">ノートモード</strong>：
                  22 分野の重要知識を 1 ページで確認。赤字を隠した暗記テストにも対応。
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">✍</span>
                <span>
                  <strong className="text-slate-800">問題演習</strong>：
                  4 択／記述の 2 モード。弱点克服・ランダム出題・重要問題のみの
                  絞り込みも可能。
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold">📝</span>
                <span>
                  <strong className="text-slate-800">午後問題演習補助</strong>：
                  過去問の周回・最高点・解答記録を管理（補助ツール）。
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 font-bold">🏅</span>
                <span>
                  <strong className="text-slate-800">学習ゲーミフィケーション</strong>：
                  正答数に応じて経験値・ランク・勲章を獲得。継続学習を支援。
                </span>
              </li>
            </ul>
          </section>

          {/* フッター注記 */}
          <p className="text-center text-[11px] text-slate-400 leading-relaxed pt-1">
            ご不明点・不具合は LINE でお知らせください。
          </p>
        </div>
      </div>
    </div>
  )
}
