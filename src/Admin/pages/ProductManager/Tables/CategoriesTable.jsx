import { Button, message, notification, Table } from "antd"
import { useAppContext } from "../../../../AppContext"
import { DeleteOutlined, EditOutlined } from "@ant-design/icons"
import React, { useEffect } from "react"

function CategoriesTable() {
    const { categories, getCategories } = useAppContext()


    useEffect(()=>{
        getCategories()
    },[])
    const columns = [
        {
            title: "Categoría",
            dataIndex: "category_name",
            key: "category_name"
        },{
            render:(_,record) => {
                return (
                    <div>
                        <Button type='primary' icon={<EditOutlined/>}></Button>
                        <Button type='primary' danger icon={<DeleteOutlined />}></Button>
                    </div>
                )
            }
        }
    ]
  return (
    <React.Fragment>
        <Button onClick={async()=>{
            const hiddenMessage = message.loading("Cargando categorías...")
            await getCategories()
            hiddenMessage()
            notification.info({
                message: "Lista de categorias actualizada.",
                description: `Se encontraron ${categories.length} categorías`,
            })
        }} style={{marginBottom: "10px"}}>Refrescar</Button>
        <Table
        columns={columns}
        dataSource={categories}
        rowKey={"category_id"}
        
    />
    </React.Fragment>
  )
}

export default CategoriesTable