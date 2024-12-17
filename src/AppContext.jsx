import { createContext, useContext, useEffect, useRef, useState } from 'react'
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
    const loginAdmin = async (userData) => {
        try {
            const response = await fetch(`${apis.backend}/api/admins/login-admin`, {
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
            else setIsAdmin(false)
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

    const verifyAccountUser = async(user_email) => {
        try {
            const response = await fetch(`${apis.backend}/api/admins/verify-admin-data/${user_email}`)
            const responseData = await processRequests(response)
            
            if(response.status === 403){
                notification.warning({
                    description: responseData.message,
                    duration: 5,
                    pauseOnHover: false,
                    showProgress: true
                })
                return 403
            }
            if(!response.ok) throw new Error(responseData.msg)
            return 200
        } catch (error) {
            console.log(error)
            notification.error({
                message: "No fue posible verificar la cuenta",
                description: error.message,
                duration: 5,
                pauseOnHover: false,
                showProgress: true
            })
            return 400
        }
    }

    const verifyOtpAdminCode = async(otpCode, admin_email) => {
        try {
            const response = await fetch(`${apis.backend}/api/admins/verify-admin-otp/${otpCode}?admin_email=${admin_email}`)
            const responseData = await processRequests(response)
            console.log(responseData)
            if(!response.ok) throw new Error(responseData.msg)
                notification.success({
                    message: "Código OTP correcto",
                    description: "Ahora puedes ingresar la contraseña de tu cuenta"
                })
            return true
        } catch (error) {
            console.log(error)
            notification.error({
                message: "No fue posible verificar el OTP",
                description: error.message,
                duration: 5,
                pauseOnHover: false,
                showProgress: true
            })
            return false
        }
    }

    const updateAdminPassword = async(password, admin_email) => {
        try {
            const response = await fetch(`${apis.backend}/api/admins/set-admin-psw/${admin_email}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({password})
            });

            const responseData = await processRequests(response)
            if(!response.ok) throw new Error(responseData.msg)
            message.success(`${responseData.msg}`)
            return true
        } catch (error) {
            console.log(error)
            notification.error({
                message: "No fue posible actualizar la contraseña",
                description: error.message,
                duration: 5,
                pauseOnHover: false,
                showProgress: true
            })
            return false
        }
    }

    const savePromotion = async(promotionValues) => {
        try {
            const response = await fetch(`${apis.backend}/api/promotions/save-promotion`,{
                method: "POST",
                body: promotionValues
            })

            const responseData = await processRequests(response)
            if(!response.ok) throw new Error(responseData.msg)
                console.log(responseData)
            message.success(`${responseData.msg}`)
            getAllPromotions()
            return true
        } catch (error) {
            console.log(error)
            notification.error({
                message: "No fue posible guardar la promoción",
                description: error.message,
                duration: 5,
                pauseOnHover: false,
                showProgress: true
            })
            return false
        }
    }

    const [promotions, setPromotions] = useState([])
    const getAllPromotions = async() => {
        try {
            const response = await fetch(`${apis.backend}/api/promotions/get-promotions`)
            const responseData = await processRequests(response)
            if(response.status === 404) return;
            if(!response.ok) throw new Error(responseData.msg)
            setPromotions(responseData.promotions)
        } catch (error) {
            console.log(error)
            notification.error({
                message: "No fue posible obtener las promociones",
                description: error.message,
                duration: 5,
                pauseOnHover: false,
                showProgress: true
            })
            return false
        }
    };

    const deletePromotion = async(promotionID) => {
        try {
            const response = await fetch(`${apis.backend}/api/promotions/delete-promotion/${promotionID}`,{
                method: "DELETE"
            })

            const responseData = await processRequests(response)
            if(!response.ok) throw new Error(responseData.msg)
            message.success(`${responseData.msg}`) 
        } catch (error) {
            console.log(error)
            notification.error({
                message: "No fue posible eliminar la promocion",
                description: error.message,
                duration: 5,
                pauseOnHover: false,
                showProgress: true
            })
        }
    }

    // const alreadyRetrieveUser = useRef(false)
    // useEffect(()=>{
    //     (async()=>{
    //         if(!loginData && !alreadyRetrieveUser.current){
    //             alreadyRetrieveUser.current = true
    //             await loginAdmin()
    //         }
    //     })()
    //     console.log(loginData)
    // },[loginData])

    const appIsReady = useRef(false)
    useEffect(()=>{
        (async()=>{
            if(!appIsReady.current && loginData.id){
                const hiddenMessage = message.loading("Iniciando sistema", 0)
                appIsReady.current = true
                try {
                    await Promise.all([
                       getCategories(),
                       getProducts(),
                       getAllPromotions()
                    ]);
                    
                 } catch (error) {
                    message.error("Hubo un error al cargar los datos")
                    console.error(error)
                 }finally{
                    hiddenMessage()
                    message.success("Sistema listo", 2)
                 } 
            }
        })()
    },[loginData])

    useEffect(()=>{
        console.log("Categorias", categories)
        console.log("Productos", productsList)
        console.log("Promociones", promotions)
    },[promotions, productsList, categories])

    
    useEffect(()=>{
        if(!loginData.id) {
            console.log("No hay login data")
            navigate("/")
            return
        }
        console.log("loginData: ",loginData)
        if(isAdmin) navigate("/dashboard")
    },[isAdmin, loginData])

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
                registerUser, loginAdmin, loginData, isAdmin, verifyAccountUser,
                saveCategory, getCategories, categories, saveProduct,
                productsList, getProducts, handleProducts, editingProduct, productId, showProductForm, showAlertProductForm,isDeletingProduct,
                editProducts, deleteProducts, handlerCategories, editingCategory, categoryId, showCategoryForm, showAlertCategories, isDeletingCategory,
                editCategory, width, getCountProductsWithCategory, deleteCategory, verifyOtpAdminCode, updateAdminPassword,
                savePromotion, promotions, getAllPromotions, deletePromotion
            }}
        >
            {children}
        </AppContext.Provider>
    )
}

AppProvider.propTypes = {
    children: PropTypes.node.isRequired
}