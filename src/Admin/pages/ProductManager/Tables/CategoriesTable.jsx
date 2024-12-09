import { Button, Table } from "antd"
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
        <Button onClick={()=>getCategories()}>Refrescar</Button>
        <Table
        columns={columns}
        dataSource={categories}
        rowKey={"category_id"}
        
    />
    </React.Fragment>
  )
}

export default CategoriesTable