import { QuestionCircleFilled } from '@ant-design/icons'
import { Card, Col, Row } from 'antd'
import Title from 'antd/es/typography/Title'
import React from 'react'
import BannersForm from './Forms/BannersForm'
import BannersTable from './Tables/BannersTable'
import { useAppContext } from '../../../AppContext'

function PrincipalManager() {
    const { editingBanner } = useAppContext()
  return (
    <React.Fragment>
        <Title>Principal</Title>
        <Title level={3}>Administra aqui banners y anuncios</Title>
        <Title level={5}><QuestionCircleFilled/> Los anuncios y Banners se verán en la misma sección</Title>
        <Row gutter={[16, 16]}>
            <Col xl={12} lg={24} md={24}>
                <Card title="Agregar un Banner" style={{opacity: editingBanner ? 0.2 : 1}}>
                    <BannersForm/>
                </Card>
            </Col>

            <Col xl={12} lg={24} md={24}>
                <Card title="Agregar un Anuncio"></Card>
            </Col>

            <Col xl={12} lg={24} md={24}>
                <Card title="Lista de Banners" >
                    <BannersTable/>
                </Card>
            </Col>

            <Col xl={12} lg={24} md={24}>
                
            </Col>
        </Row>
    </React.Fragment>
  )
}

export default PrincipalManager