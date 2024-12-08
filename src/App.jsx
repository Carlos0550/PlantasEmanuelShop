import { Routes, Route } from "react-router-dom"
import Login from "./Admin/pages/Auth/Login"
import "./App.css"
import Register from "./Admin/pages/Auth/Register"
function App() {
  return (
    <Routes>
      {/* Rutas de administrador */}
      <Route path="/" element={<Login />}/>
      <Route path="/register" element={<Register />}/>


      {/* Rutas para los clientes */}
    </Routes>
   

  )
}

export default App