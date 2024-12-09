import React from 'react'
import { Row, Col, Card } from 'antd'
import AddCategories from './Forms/AddCategories'
import AddProducts from './Forms/AddProducts'
import CategoriesTable from './Tables/CategoriesTable'
function ProductsManager() {
  return (
    <React.Fragment>
      <h2>Sección de productos</h2>
      <h3>Administra aqui tu lista de stock</h3>
      <Row gutter={[16, 16]}>
        <Col lg={24} xl={12}>
          <Card title="Agregar nuevo producto">
              <AddProducts/>
          </Card>
          <Card title="Listado de productos">

          </Card>
        </Col>
        <Col lg={24} xl={12}>
          <Card title="Agregar nueva categoria">
              <AddCategories/>
          </Card>
          <Card title="Listado de categorias" style={{padding: "0px"}}>
              <CategoriesTable/>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  )
}

export default ProductsManager