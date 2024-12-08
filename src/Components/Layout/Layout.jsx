import './LayoutComponent.css';
import logoImg from "../../public/assets/logo.png"
import { HomeOutlined, MenuOutlined, OrderedListOutlined, ProductOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
function LayoutComponent({ component }) {
    const navigate = useNavigate()
    const [resizeSideBar, setResizeSideBar] = useState(false)
    return (
        <div className="layout">
            <header className="header">
                <picture className='logo-container'>
                    <img src={logoImg} alt="logoImg" />
                </picture>
                <button className='logout-btn'>Cerrar sesión</button>
            </header>

            <div className="main-layout">
                <aside className={resizeSideBar ? "sider active" : "sider"}>
                    {!resizeSideBar ? <p>Plantas Emanuel</p> : <p style={{marginBottom: "18px"}}></p>}
                    <span onClick={() => setResizeSideBar(!resizeSideBar)} className={resizeSideBar ? "menu-icon active" : "menu-icon"}><MenuOutlined style={{fontSize: "24px"}}/></span>
                    <ul>
                        <li onClick={()=> navigate("/dashboard")}><HomeOutlined style={{fontSize: "22px"}}/> {!resizeSideBar ? "Dashboard" : null}</li>
                        <li onClick={()=> navigate("/manage-products")}><ProductOutlined style={{fontSize: "22px"}}/> {!resizeSideBar ? "Productos" : null}</li>
                        <li><UserOutlined style={{fontSize: "22px"}}/> {!resizeSideBar ? "Usuarios" : null}</li>
                        <li><OrderedListOutlined style={{fontSize: "22px"}}/> {!resizeSideBar ? "Pedidos" : null}</li>
                        <li><SettingOutlined style={{fontSize: "22px"}}/> {!resizeSideBar ? "Ajustes" : null}</li>
                    </ul>
                </aside>

                <main className="content">
                    {component}
                </main>
            </div>
        </div>
    );
}

export default LayoutComponent;
