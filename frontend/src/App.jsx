import { Route, Routes } from "react-router-dom"
import Header from "./components/common/Header"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import About from "./pages/About"



function App() {

  return (
    <>
      <div>
        <Header />
        <Routes >
          <Route path="/" element = {<Home />} />
          <Route path="/Login" element = {<Login />} />
          <Route path="/Register" element = {<Register />} />
          <Route path="/About" element = {<About />} />
        </Routes>
        <Home />
      </div>
    </>
  )
}

export default App