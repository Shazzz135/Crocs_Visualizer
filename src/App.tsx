import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Landing from './pages/Landing'
import Bench from './pages/Bench'

function App() {
  return (
    <div className="min-h-screen w-screen">
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/workbench" element={<Bench />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App