
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Transactions from './pages/Transactions'


function App() {
 

  return (
      <BrowserRouter>
       <Routes>
      
        <Route path='/' element={<Transactions></Transactions>}></Route>

       </Routes>
      
      </BrowserRouter>
  )
}

export default App
