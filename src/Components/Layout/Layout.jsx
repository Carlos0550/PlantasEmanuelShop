import './LayoutComponent.css';
import logoImg from "../../public/assets/logo.png"
import { HomeOutlined, MenuOutlined, OrderedListOutlined, ProductOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../AppContext';

function LayoutComponent({ component }) {
    const navigate = useNavigate()
    const [resizeSideBar, setResizeSideBar] = useState(false)
    const { width } = useAppContext()

    useEffect(() => {
        if (width > 868) setResizeSideBar(false)
        else setResizeSideBar(true)
    }, [width])
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
                    {!resizeSideBar ? <p>Plantas Emanuel</p> : <p style={{ marginBottom: "18px" }}></p>}
                    {width < 868 && <span onClick={() => setResizeSideBar(!resizeSideBar)} className={resizeSideBar ? "menu-icon active" : "menu-icon"}>
                        <MenuOutlined style={{ fontSize: "24px" }} />
                    </span>}

                    <ul>
                        {
                            (width >= 868 || (resizeSideBar === false && width < 868))
                                ? (
                                    <React.Fragment>
                                        <li onClick={() => {
                                            navigate("/dashboard")
                                            if (width < 868) setResizeSideBar(true)
                                        }}>
                                            <HomeOutlined style={{ fontSize: "22px" }} /> Dashboard
                                        </li>
                                        <li onClick={() => {
                                            if (width < 868) setResizeSideBar(true)
                                            navigate("/manage-products")
                                        }}>
                                            <ProductOutlined style={{ fontSize: "22px" }} /> Productos
                                        </li>
                                        <li>
                                            <UserOutlined style={{ fontSize: "22px" }} /> Usuarios
                                        </li>
                                        <li>
                                            <OrderedListOutlined style={{ fontSize: "22px" }} /> Pedidos
                                        </li>
                                        <li>
                                            <SettingOutlined style={{ fontSize: "22px" }} /> Ajustes
                                        </li>
                                    </React.Fragment>
                                )
                                : null
                        }
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
