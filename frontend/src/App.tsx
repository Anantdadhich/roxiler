
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Transactions from './pages/Transactions'
import Statistics from './pages/Statistics'
import Barchart from './pages/Barchart'
import { HomePage } from './pages/HomePage'

function App() {
 

  return (
      <BrowserRouter>
       <Routes>
        <Route path='/' element={<HomePage></HomePage>}></Route>
        <Route path='/transactions' element={<Transactions></Transactions>}></Route>
        <Route path='/stats' element={<Statistics></Statistics>}></Route>
        <Route path='/chart' element={<Barchart></Barchart>}></Route>
       </Routes>
      
      </BrowserRouter>
  )
}

export default App
