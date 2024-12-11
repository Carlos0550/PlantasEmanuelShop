import React from 'react'
import { Row, Col, Card } from 'antd'
import AddCategories from './Forms/AddCategories'
import AddProducts from './Forms/AddProducts'
import CategoriesTable from './Tables/CategoriesTable'
import ProductsTable from './Tables/ProductsTable'
function ProductsManager() {
  return (
    <React.Fragment>
      <h2>Sección de productos</h2>
      <h3>Administra aqui tu lista de stock</h3>
      <Row gutter={[16, 16]}>
            <Col xl={12} lg={24}>
                <Card title="Agregar nuevo producto">
                    <AddProducts/>
                </Card>
            </Col>

            <Col xl={12} lg={24}>
                <Card title="Agregar nueva categoría">
                    <AddCategories />
                </Card>
            </Col>

            <Col xs={24}>
                <Card title="Listado de productos">
                    <ProductsTable/>
                </Card>
            </Col>

            <Col xs={24}>
                <Card title="Listado de categorías">
                    <CategoriesTable/>
                </Card>
            </Col>
        </Row>
    </React.Fragment>
  )
}

export default ProductsManager