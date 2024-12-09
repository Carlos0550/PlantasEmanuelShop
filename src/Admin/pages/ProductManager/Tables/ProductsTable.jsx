import { Button, Space, Table } from "antd"
import { useAppContext } from "../../../../AppContext"
import { useEffect } from "react"
import "./ProductsTable.css"
import { DeleteOutlined, EditOutlined } from "@ant-design/icons"
function ProductsTable() {
    const { getProducts, productsList } = useAppContext()

    const tableColumns = [
        {
            render:(_,record)=> {
                return (
                    <picture className="product-image-minified">
                    <img src={record.images[0].image_data} alt={record.image_name} />
                </picture>
                )
            }
        },
        {
            title: "Producto",
            dataIndex: "product_name",
        },
        {
            title: "Precio",
            dataIndex: "product_price",
            render:(_,record)=> {
                return (
                    <span>{parseFloat(record.product_price).toLocaleString("es-AR",{style: "currency", currency: "ARS"})}</span>
                )
            }
        },
        {
            title: "Categoría",
            dataIndex: "product_category",
            render:(_,record)=> {
                return (
                    <span>{record.product_category}</span>
                )
            }
        },
        {
            render:(_,record) => (
                <Space>
                    <Button type='primary' icon={<EditOutlined/>}></Button>
                    <Button type='primary' danger icon={<DeleteOutlined />}></Button>
                </Space>
            )
        }
    ]

    useEffect(()=>{
        getProducts()
    },[])

    useEffect(()=>{
        console.log(productsList)
    },[productsList])
  return (
    <Table
        columns={tableColumns}
        dataSource={productsList}
    />
  )
}

export default ProductsTable