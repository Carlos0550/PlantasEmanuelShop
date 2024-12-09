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

    const saveCategory = async(categoryName) => {
        try {
            const response = await fetch(`${apis.backend}/api/categories/save-category`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({category_name: categoryName})
            })

            const responseData = await processRequests(response)
            if(!response.ok) throw new Error(responseData.msg)
            message.success(`${responseData.msg}`)
            return true
        } catch (error) {
            console.log(error)
            notification.error({
                message: "No fue posible registrar la categoría",
                description: error.message,
                duration: 5,
                pauseOnHover: false,
                showProgress: true
            })
            return false
        }
    }
    const [categories, setCategories] = useState([])
    const getCategories = async() => {
        try {
            const response = await fetch(`${apis.backend}/api/categories/get-categories`)

            const responseData = await processRequests(response)
            if(response.status === 404) return;
            if(!response.ok) throw new Error(responseData.msg)
            setCategories(responseData.categories)
            return true
        } catch (error) {
            console.log(error)
            notification.error({
                message: "No fue posible encontrar las categorías",
                description: error.message,
                duration: 5,
                pauseOnHover: false,
                showProgress: true
            })
            return false
        }
    }

    const saveProduct = async(productData) => {
        try {
            const response = await fetch(`${apis.backend}/api/products/save-product`, {
                method: "POST",
                
                body: productData
            });

            const responseData = await processRequests(response)
            if(!response.ok) throw new Error(responseData.msg)
            message.success(`${responseData.msg}`)
            return true
        } catch (error) {
            console.log(error)
            notification.error({
                message: "No fue posible registrar el producto",
                description: error.message,
                duration: 5,
                pauseOnHover: false,
                showProgress: true
            })
            return false
        }
    }

    const [productsList, setProductsList] = useState([])

    const getProducts = async() => {
        try {
            const response = await fetch(`${apis.backend}/api/products/get-products`)

            const responseData = await processRequests(response)
            if(response.status === 404) return;
            if(!response.ok) throw new Error(responseData.msg)
            setProductsList(responseData.products)
        } catch (error) {
            console.log(error)
            notification.error({
                message: "No fue posible encontrar los productos",
                description: error.message,
                duration: 5,
                pauseOnHover: false,
                showProgress: true
            })
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
                registerUser, loginUser, loginData, isAdmin,
                saveCategory, getCategories, categories, saveProduct,
                productsList, getProducts
            }}
        >
            {children}
        </AppContext.Provider>
    )
}

AppProvider.propTypes = {
    children: PropTypes.node.isRequired
}