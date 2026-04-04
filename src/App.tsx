import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Quiz from './pages/Quiz'
import Protocols from './pages/Protocols'
import Search from './pages/Search'
import Settings from './pages/Settings'
import Notes from './pages/Notes'
import NoteDetail from './pages/NoteDetail'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Quiz はサイドバーなし（没入型） */}
        <Route path="/quiz" element={<Quiz />} />

        {/* その他すべてのページはサイドバー付きLayout */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/protocols" element={<Protocols />} />
          <Route path="/search" element={<Search />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/notes/:categoryId" element={<NoteDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
