import { Modal } from 'antd'
import React from 'react'
import { useAppContext } from '../../AppContext'
import AddProducts from '../../Admin/pages/ProductManager/Forms/AddProducts'
import AddCategories from '../../Admin/pages/ProductManager/Forms/AddCategories'

function EditorModal() {
  const {
    handlerCategories,
    handleProducts,
    editingCategory,
    editingProduct,
  } = useAppContext()

  return (
    <Modal
      open={true}
      title={editingProduct ? "Editar Producto" : "Editar categoría"}
      footer={null}
      onCancel={() => {
        editingProduct ? handleProducts() : handlerCategories()
      }}
    >
      {editingProduct && <AddProducts />}
      {editingCategory && <AddCategories />}
    </Modal>
  )
}

export default EditorModal