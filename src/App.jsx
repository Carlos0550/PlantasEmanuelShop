import { Routes, Route } from "react-router-dom"
import Login from "./Admin/pages/Auth/Login"
import "./App.css"
import Register from "./Admin/pages/Auth/Register"
import Dashboard from "./Admin/pages/Dashboard/Dashboard"
import LayoutComponent from "./Components/Layout/Layout"
import ProductsManager from "./Admin/pages/ProductManager/ProductsManager"
import ClientsManager from "./Admin/pages/Clients/ClientsManager"
function App() {
  return (
    <Routes>
      {/* Rutas de administrador */}
      <Route path="/" element={<Login />}/>
      <Route path="/register" element={<Register />}/>
      <Route path="/dashboard" element={<LayoutComponent component={<Dashboard/>}/>}/>
      <Route path="/manage-products" element={<LayoutComponent component={<ProductsManager/>}/>}/>
      <Route path="/manage-categories" element={<LayoutComponent component={<ClientsManager/>}/>}/>

      {/* Rutas para los clientes */}
    </Routes>
   

  )
}

export default App