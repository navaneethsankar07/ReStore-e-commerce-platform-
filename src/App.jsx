import {BrowserRouter as Router, Route,Routes} from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Sell from './pages/Sell'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Products from './pages/Products'

function App() {

  return (
        <Router>
          <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/sellproduct' element={<Sell/>}/>
        <Route path='/cart' element={<Cart/>}/>
        <Route path='/products' element={<Products/>}/>
        <Route path='/checkout' element={<Checkout/>}/>

          </Routes>
        </Router>
  )
}

export default App
