import './App.css'
import MainPage from './mainPage.tsx'
import Login from './login.tsx'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Test from './test.tsx'

function App() {
  

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/main" element={<MainPage />} />
          <Route path="/test/:groupId" element={<Test />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
