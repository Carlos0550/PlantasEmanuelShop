import { Form } from 'antd'
import React from 'react'

function AddClients() {
    const [form] = Form.useForm()

    const onFinish = async(values) => {
        console.log(values)
    }
  return (
    <Form
        form={form}
        onFinish={onFinish}
        autoComplete="off"
        layout="vertical"

    >
        <Form.Item></Form.Item>
    </Form>
  )
}

export default AddClients