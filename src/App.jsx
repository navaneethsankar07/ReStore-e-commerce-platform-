import {BrowserRouter as Router, Route,Routes} from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Sell from './pages/Sell'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import AuthListener from './components/AuthListner'
import ProtectedRoute from './components/ProtectedRoute'
import AddProduct from './pages/AddProducts'
import ErrorBoundary from './components/ErrorBoundary'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Calculator from './components/Calculator'

function App() {
  return (
    
    <Router>
          <ErrorBoundary>
          <AuthListener /> 
        <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={ <Login/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/myproduct' element={<ErrorBoundary><ProtectedRoute><Sell/></ProtectedRoute></ErrorBoundary> }/>
        <Route path='/addProduct' element={<ErrorBoundary><ProtectedRoute><AddProduct/></ProtectedRoute></ErrorBoundary> }/>
        <Route path='/cart' element={<ErrorBoundary><ProtectedRoute><Cart/></ProtectedRoute> </ErrorBoundary> }/>
        <Route path='/checkout' element = {<ErrorBoundary><ProtectedRoute><Checkout/></ProtectedRoute></ErrorBoundary> }/>
                <Route path='/calc' element={<Calculator/>}/>

          </Routes>
          <ToastContainer
          position="top-right"
          autoClose={3000}
          newestOnTop={false}
          closeOnClick
          draggable
        />
        </ErrorBoundary>
        </Router>
  )
}

export default App
