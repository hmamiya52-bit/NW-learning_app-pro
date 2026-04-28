import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'
import { VERSION_LABEL } from '../version'

export default function Login() {
  const { isAuthenticated, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/'
  const features = [
    'カテゴリ別クイズ',
    '重要問題・弱点復習',
    '復習ノート',
    '午後問題の点数管理',
  ]

  const [id, setId] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // 既にログイン済みなら元の場所へ戻す
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
    <div className="min-h-screen overflow-x-hidden bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-6xl gap-8 lg:grid-cols-2 lg:items-center">
        <section className="order-1 min-w-0">
          <div className="mb-5 inline-flex max-w-full break-all rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-[11px] font-bold leading-relaxed text-blue-700">
            対象: ネットワークスペシャリスト試験の合格を目指す方
          </div>
          <h1 className="max-w-full break-all text-3xl font-black leading-tight text-slate-900 sm:text-4xl">
            ネットワークスペシャリスト対策を、午前知識から午後演習まで一つに
          </h1>
          <p className="mt-4 max-w-xl break-all text-sm leading-7 text-slate-600 sm:text-base">
            カテゴリ別クイズ、重要問題、復習ノート、午後問題の点数管理をまとめて行える学習アプリです。
          </p>

          <div className="mt-6 grid max-w-full grid-cols-1 gap-2 sm:max-w-lg sm:grid-cols-2">
            {features.map((feature) => (
              <div
                key={feature}
                className="min-w-0 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-sm"
              >
                {feature}
              </div>
            ))}
          </div>

          <div className="mt-7 w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400">学習ダッシュボード</p>
                <p className="mt-1 text-sm font-black text-slate-800">今日の進捗</p>
              </div>
              <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                62%
              </div>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              {['午前問題', '重要問題', '午後演習'].map((label, index) => (
                <div key={label} className="rounded-lg bg-slate-50 p-3">
                  <p className="text-[11px] font-bold text-slate-500">{label}</p>
                  <div className="mt-3 h-2 rounded-full bg-slate-200">
                    <div
                      className="h-2 rounded-full bg-blue-600"
                      style={{ width: `${[72, 45, 58][index]}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 rounded-lg bg-slate-900 px-3 py-2 text-[11px] font-bold text-white">
              次の復習: 重要問題 12問
            </div>
          </div>
        </section>

        <section className="order-2 w-full max-w-sm justify-self-center lg:justify-self-end">
          <div className="mb-6 text-center">
            <img
              src="/pwa-192x192.png"
              alt=""
              className="mx-auto mb-3 h-16 w-16 rounded-2xl shadow-md"
            />
            <p className="text-xs font-bold text-slate-400">{VERSION_LABEL}</p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div>
              <h2 className="text-lg font-black text-slate-800">ログイン</h2>
              <p className="mt-1 text-xs text-slate-500">発行済みのIDとパスワードを入力してください。</p>
            </div>

            <div>
              <label htmlFor="login-id" className="mb-1 block text-xs font-bold text-slate-500">
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
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50"
                required
              />
            </div>
            <div>
              <label htmlFor="login-pw" className="mb-1 block text-xs font-bold text-slate-500">
                パスワード
              </label>
              <input
                id="login-pw"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={submitting}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50"
                required
              />
            </div>

            {error && (
              <div
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl py-2.5 text-sm font-bold text-white transition-colors disabled:opacity-60"
              style={{ backgroundColor: '#1a3a5c' }}
            >
              {submitting ? '確認中...' : 'ログイン'}
            </button>
          </form>

          <div className="mt-5 space-y-2 text-center">
            <p className="text-[11px] leading-relaxed text-slate-500">
              アカウント未登録の方は、
              <a
                href="https://forms.gle/9w5ofDFeYDx3y4aq9"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-blue-600 underline hover:text-blue-700"
              >
                申請フォーム
              </a>
              から登録してください。
            </p>
            <p className="text-[11px] leading-relaxed text-slate-400">
              パスワードを忘れた・変更したい場合は<br />
              管理者へ連絡してください。
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
