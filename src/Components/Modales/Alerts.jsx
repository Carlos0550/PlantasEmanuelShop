import { Modal } from 'antd'
import { useAppContext } from '../../AppContext'

function Alerts({title, message}) {
    const { 
        handleCategories,
        handleProducts,
        editingCategory, 
        categoryId, 
        showCategoryForm, 
        showAlertCategories,
        editingProduct, 
        productId, 
        showProductForm, 
        showAlertProductForm,
        isDeletingCategory,
        isDeletingProduct
     } = useAppContext()
  return (
    <Modal title={title} open={true} footer={null}>
        <p>{message}</p>
        
    </Modal>
  )
}

export default Alerts