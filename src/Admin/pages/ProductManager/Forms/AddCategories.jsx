import { Button, Form, Input } from 'antd'
import React, { useState } from 'react'
import { useAppContext } from '../../../../AppContext';

function AddCategories() {
    const [form] = Form.useForm();
    const { saveCategory, getCategories } = useAppContext()
    const [uploading, setUploading] = useState(false)
    const onFinish = async(values) => {
        setUploading(true)
        const result = await saveCategory(values.category_name)
        setUploading(false)
        if(result){
            getCategories()
            form.resetFields()
        }
    }
  return (
    <React.Fragment>
        <Form
            form={form}
            onFinish={onFinish}
            layout='vertical'
            autoComplete="off"
            style={{ minWidth: "100%" }}
        >
            <Form.Item
                label="Categoría"
                name="category_name"
                rules={[{ required: true, message: 'Por favor ingrese una categoría' }]}
            >
                <Input placeholder='Ingrese el nombre de la categoría'/>
            </Form.Item>

            <Form.Item>
                <Button type='primary' htmlType='submit' loading={uploading}>Guardar</Button>
            </Form.Item>
        </Form>
    </React.Fragment>
  )
}

export default AddCategories