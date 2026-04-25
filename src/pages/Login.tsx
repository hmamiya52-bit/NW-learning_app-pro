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
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#f8fafc' }}>
      <div className="w-full max-w-sm">
        {/* ロゴ・タイトル */}
        <div className="text-center mb-6">
          <img
            src="/pwa-192x192.png"
            alt=""
            className="w-16 h-16 mx-auto rounded-2xl shadow-md mb-3"
          />
          <h1 className="text-lg font-black text-slate-800">NWスペシャリスト学習</h1>
          <p className="text-xs text-slate-400 mt-1">{VERSION_LABEL}</p>
        </div>

        {/* フォーム */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4"
        >
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

        {/* 注記 */}
        <div className="mt-5 space-y-2 text-center">
          <p className="text-[11px] text-slate-500 leading-relaxed">
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
          <p className="text-[11px] text-slate-400 leading-relaxed">
            パスワードを忘れた・変更したい場合は<br />
            管理者へ連絡してください。
          </p>
        </div>
      </div>
    </div>
  )
}
