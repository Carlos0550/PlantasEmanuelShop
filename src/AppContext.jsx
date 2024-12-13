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
            if(response.status === 404){
                return setCategories([])
            };
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

    const [editingProduct, setEditingProduct] = useState(false)
    const [showProductForm, setShowProductForm] = useState(false)
    const [showAlertProductForm, setShowAlertProductForm] = useState(false)
    const [productId, setProductId] = useState(null)
    const [isDeletingProduct, setIsDeletingProduct] = useState(false)
    const handleProducts = (editing = false, productId = null, showProductForm = false, showAlertProuctsForm = false, deletingProduct = false) => {
        setEditingProduct(editing)
        setProductId(productId)
        setShowProductForm(showProductForm)
        setShowAlertProductForm(showAlertProuctsForm)
        setIsDeletingProduct(deletingProduct)
    }

    const editProducts = async(productValues, productId) => {
        try {
            const response = await fetch(`${apis.backend}/api/products/edit-product/${productId}`, {
                method: "PUT",
                body: productValues
            });

            const responseData = await processRequests(response)
            if(!response.ok) throw new Error(responseData.msg)
           
            return true
        } catch (error) {
            console.log(error)
            notification.error({
                message: "No fue posible actualizar el producto",
                description: error.message,
                duration: 5,
                pauseOnHover: false,
                showProgress: true
            })
            return false
        }
    }

    const deleteProducts = async(productID) => {
        if(!productID) return
        try {
            const response = await fetch(`${apis.backend}/api/products/delete-product/${productID}`, {
                method: "DELETE"
            });

            const responseData = await processRequests(response)
            if(!response.ok) throw new Error(responseData.msg)
            message.success(`${responseData.msg}`)
            getProducts()
            return true
        } catch (error) {
            console.log(error)
            notification.error({
                message: "No fue posible eliminar el producto",
                description: error.message,
                duration: 5,
                pauseOnHover: false,
                showProgress: true
            })
            return false
        }
    }

    const [editingCategory, setEditingCategory] = useState(false)
    const [showCategoryForm, setShowCategoryForm] = useState(false)
    const [showAlertCategories, setShowAlertCategories] = useState(false)
    const [categoryId, setCategoryId] = useState(null)
    const [isDeletingCategory, setIsDeletingCategory] = useState(false)
    const handlerCategories = async(editing = false, categoryId = null, showCategoryForm = false, showAlertCategories = false, deletingCategory = false) => {
        setEditingCategory(editing)
        setCategoryId(categoryId)
        setShowCategoryForm(showCategoryForm)
        setShowAlertCategories(showAlertCategories)
        setIsDeletingCategory(deletingCategory)
    }

    const editCategory = async(categoryValues, categoryId) => {
        try {
            const response = await fetch(`${apis.backend}/api/categories/edit-category/${categoryId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({category_name: categoryValues})
            });

            const responseData = await processRequests(response)
            if(!response.ok) throw new Error(responseData.msg)
            message.success(`${responseData.msg}`)
            return true
        } catch (error) {
            console.log(error)
            notification.error({
                message: "No fue posible actualizar la categoría",
                description: error.message,
                duration: 5,
                pauseOnHover: false,
                showProgress: true
            })
            return false
        }
    }

    
    const getCountProductsWithCategory = async(categoryID) => {
        console.log(categoryID)
        try {
            const response = await fetch(`${apis.backend}/api/categories/get-count-products-with-category/${categoryID || categoryId}`)

            const responseData = await processRequests(response)
            console.log(responseData)
            if(!response.ok) throw new Error(responseData.msg)
            return responseData.countPrWithCat
        } catch (error) {
            console.log(error)
            return 0
        }
    }

    const deleteCategory = async(categoryID) => {
        if(!categoryID) return
        try {
            const response = await fetch(`${apis.backend}/api/categories/delete-category/${categoryID}`, {
                method: "DELETE"
            });

            const responseData = await processRequests(response)
            if(!response.ok) throw new Error(responseData.msg)
            message.success(`${responseData.msg}`)
            getCategories()
            return true
        } catch (error) {
            console.log(error)
            notification.error({
                message: "No fue posible eliminar la categoría",
                description: error.message,
                duration: 5,
                pauseOnHover: false,
                showProgress: true
            })
            return false
        }
    }

    useEffect(()=>{
        retrieveUserData()
    },[])
    useEffect(()=>{
        if(isAdmin) navigate("/dashboard")
    },[isAdmin])

    const [width, setWidth] = useState(window.innerWidth)

    useEffect(() => {
        const handleResize = () => {
            setWidth(window.innerWidth)
        }
        window.addEventListener('resize', handleResize)
        return () => {
            window.removeEventListener('resize', handleResize)
        }
    },[])
    return (
        <AppContext.Provider
            value={{
                registerUser, loginUser, loginData, isAdmin,
                saveCategory, getCategories, categories, saveProduct,
                productsList, getProducts, handleProducts, editingProduct, productId, showProductForm, showAlertProductForm,isDeletingProduct,
                editProducts, deleteProducts, handlerCategories, editingCategory, categoryId, showCategoryForm, showAlertCategories, isDeletingCategory,
                editCategory, width, getCountProductsWithCategory, deleteCategory
            }}
        >
            {children}
        </AppContext.Provider>
    )
}

AppProvider.propTypes = {
    children: PropTypes.node.isRequired
}