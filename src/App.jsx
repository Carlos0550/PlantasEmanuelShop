import { Routes, Route } from "react-router-dom"
import Login from "./Admin/pages/Auth/Login"
import "./App.css"
import Register from "./Admin/pages/Auth/Register"
import Dashboard from "./Admin/pages/Dashboard/Dashboard"
import LayoutComponent from "./Components/Layout/Layout"
import ProductsManager from "./Admin/pages/ProductManager/ProductsManager"
import ClientsManager from "./Admin/pages/Clients/ClientsManager"
import PromotionsManager from "./Admin/pages/Promotions/PromotionsManager"
import PrincipalManager from "./Admin/pages/Principal/PrincipalManager"
function App() {
  return (
    <Routes>
      {/* Rutas de administrador */}
      <Route path="/" element={<Login />}/>
      <Route path="/register" element={<Register />}/>
      <Route path="/dashboard" element={<LayoutComponent component={<Dashboard/>}/>}/>
      <Route path="/manage-products" element={<LayoutComponent component={<ProductsManager/>}/>}/>
      <Route path="/manage-clients" element={<LayoutComponent component={<ClientsManager/>}/>}/>
      <Route path="/manage-promotions" element={<LayoutComponent component={<PromotionsManager/>}/>}/>
      <Route path="/manage-principal" element={<LayoutComponent component={<PrincipalManager/>}/>}/>
      {/* Rutas para los clientes */}
    </Routes>
   

  )
}

export default App