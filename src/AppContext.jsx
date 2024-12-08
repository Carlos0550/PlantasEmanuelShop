import { createContext, useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types';
import { apis } from './utils/apis';
import { processRequests } from './utils/processRequests';
import { message, notification } from "antd"
import { useNavigate } from 'react-router-dom';
const AppContext = createContext()

export const useAppContext = () => {
    const ctx = useContext(AppContext);
    if (!ctx) {
        throw new Error("useAppContext must be used within a AppProvider");
    }
    return ctx
}

export const AppProvider = ({ children }) => {
    const navigate = useNavigate()
    const registerUser = async (userData) => {
        try {
            const response = await fetch(`${apis.backend}/api/users/register-user`, {
                method: "POST",
                body: userData
            })

            const responseData = await processRequests(response)
            if (!response.ok) throw new Error(responseData.msg)
            message.success(`${responseData.msg}`)
            notification.success({
                message: responseData.msg,
                description: "Ahora podrá iniciar sesión con los datos que proporcionaste.",
                duration: 3,
                pauseOnHover: false,
                showProgress: true
            })
            return true
        } catch (error) {
            console.log(error)
            notification.error({
                message: "No fue posible registrarte",
                description: error.message,
                duration: 5,
                pauseOnHover: false,
                showProgress: true
            })
            return false
        }
    }

    const [loginData, setLoginData] = useState({})
    const [isAdmin, setIsAdmin] = useState(false)
    const loginUser = async (userData) => {
        try {
            const response = await fetch(`${apis.backend}/api/users/login-user`, {
                body: userData,
                method: "POST"
            })

            const responseData = await processRequests(response)

            if (!response.ok) throw new Error(responseData.msg)
            notification.success({
                message: responseData.msg,
            });
            setLoginData(responseData.user)
            if(responseData.user.admin) setIsAdmin(true)
            localStorage.setItem("user", JSON.stringify(responseData.user))
            return true
        } catch (error) {
            console.log(error)
            notification.error({
                message: "No fue posible iniciar sesión",
                description: error.message,
                duration: 5,
                pauseOnHover: false,
                showProgress: true
            })
            return false
        }
    }
    
    const retrieveUserData = () =>{
        try {
            const user = JSON.parse(localStorage.getItem("user"))
            console.log(user)
            if(user) setLoginData(user)
            else navigate("/")
        } catch (error) {
            console.log(error)
            notification.error({
                message: "Error al verificar su sesión",
                duration: 3,
                pauseOnHover: false,
                showProgress: true
            })
            localStorage.removeItem("user")
            return navigate("/")
        }
    }

    useEffect(()=>{
        retrieveUserData()
    },[])
    useEffect(()=>{
        if(isAdmin) navigate("/dashboard")
    },[isAdmin])
    return (
        <AppContext.Provider
            value={{
                registerUser, loginUser, loginData, isAdmin
            }}
        >
            {children}
        </AppContext.Provider>
    )
}

AppProvider.propTypes = {
    children: PropTypes.node.isRequired
}