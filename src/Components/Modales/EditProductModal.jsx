import { Modal } from 'antd'
import React from 'react'
import { useAppContext } from '../../AppContext'
import AddProducts from '../../Admin/pages/ProductManager/Forms/AddProducts'

function EditProductModal() {
    const { handleProducts } = useAppContext()

  return (
   <Modal
    open={true}
    title="Editar Producto"
    footer={null}
    onCancel={()=>handleProducts()}
   >
    <AddProducts/>
   </Modal>
  )
}

export default EditProductModal