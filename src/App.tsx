import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Landing from './pages/Landing'
import Bench from './pages/Bench'
import Footer from './components/ui/Footer'

function App() {

  return (
    <div className=" bg-gradient-to-br from-green-500 to-green-900 min-h-screen">
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/workbench" element={<Bench />} />
        </Routes>
    </Router>
      <Footer />
    </div>
  )
}
    

export default App
