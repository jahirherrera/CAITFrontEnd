import './App.css'
import MainPage from './mainPage.tsx'
import Login from './login.tsx'
import {BrowserRouter, Routes, Route} from 'react-router-dom'

function App() {
  

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/main" element={<MainPage />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
