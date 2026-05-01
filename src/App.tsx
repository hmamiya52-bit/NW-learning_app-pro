import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Quiz from './pages/Quiz'
import Protocols from './pages/Protocols'
import Search from './pages/Search'
import Settings from './pages/Settings'
import Notes from './pages/Notes'
import NoteDetail from './pages/NoteDetail'
import Badges from './pages/Badges'
import AfternoonProblems from './pages/AfternoonProblems'
import AfternoonAnswerDetail from './pages/AfternoonAnswerDetail'
import AfternoonMyAnswer from './pages/AfternoonMyAnswer'
import Column from './pages/Column'
import HowToUse from './pages/HowToUse'
import ActivityHistory from './pages/ActivityHistory'
import Login from './pages/Login'
import AuthGuard from './auth/AuthGuard'
import DeviceSync from './pages/DeviceSync'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ログイン画面（認証不要） */}
        <Route path="/login" element={<Login />} />

        {/* Quiz はサイドバーなし（没入型）— 要認証 */}
        <Route
          path="/quiz"
          element={
            <AuthGuard>
              <Quiz />
            </AuthGuard>
          }
        />

        {/* その他すべてのページはサイドバー付きLayout — 要認証 */}
        <Route
          element={
            <AuthGuard>
              <Layout />
            </AuthGuard>
          }
        >
          <Route path="/" element={<Home />} />
          <Route path="/protocols" element={<Protocols />} />
          <Route path="/search" element={<Search />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/notes/:categoryId" element={<NoteDetail />} />
          <Route path="/badges" element={<Badges />} />
          <Route path="/afternoon" element={<AfternoonProblems />} />
          <Route path="/afternoon/problems" element={<Navigate to="/afternoon" replace />} />
          <Route path="/afternoon/tracker" element={<Navigate to="/afternoon" replace />} />
          <Route path="/afternoon/answers" element={<Navigate to="/afternoon" replace />} />
          <Route path="/afternoon/answers/:id" element={<AfternoonAnswerDetail />} />
          <Route path="/afternoon/answers/:id/myAnswer" element={<AfternoonMyAnswer />} />
          <Route path="/column" element={<Column />} />
          <Route path="/how-to-use" element={<HowToUse />} />
          <Route path="/history" element={<ActivityHistory />} />
          <Route path="/sync" element={<DeviceSync />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
