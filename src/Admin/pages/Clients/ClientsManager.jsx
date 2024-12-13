import { Card, Col, Row } from 'antd'
import Title from 'antd/es/typography/Title'
import React from 'react'

function ClientsManager() {
    return (
        <React.Fragment>
            <Title>Clientes</Title>
            <Title level={3}>Administra aqui tus clientes</Title>
            <Row gutter={[16, 16]}>
                <Col xl={12} lg={24} xs={24}>
                    <Card title="Listado de clientes">

                    </Card>
                </Col>

                <Col xl={12} lg={24} xs={24}>
                    <Card title="Agregar un nuevo cliente">

                    </Card>
                </Col>
            </Row>
        </React.Fragment>
    )
}

export default ClientsManager