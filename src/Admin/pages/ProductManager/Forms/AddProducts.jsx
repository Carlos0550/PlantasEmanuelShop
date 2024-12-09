import React, { useEffect, useState } from 'react';
import { Form, Input, Select, Upload, message, Button } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { useAppContext } from '../../../../AppContext';
import { v4 as uuidv4 } from 'uuid';
import { resizeAndConvertImages } from '../../../../utils/ResizeImages';

const { Dragger } = Upload;

function AddProducts() {
    const [form] = Form.useForm();
    const { categories, saveProduct, getProducts } = useAppContext();
    const [fileList, setFileList] = useState([]);

    const uploadProps = {
        name: 'file',
        multiple: true,
        beforeUpload: async (file) => {
            try {
                const [compressedFile] = await resizeAndConvertImages([file]);
                const newFileList = {
                    uid: uuidv4(),
                    name: compressedFile.name,
                    status: 'done',
                    originFileObj: compressedFile, 
                };

                setFileList((prevList) => [...prevList, newFileList]);
            } catch (error) {
                message.error('Error al redimensionar la imagen');
                console.error('Error al redimensionar la imagen:', error);
            }

            return false; 
        },
        fileList,
        onRemove: (file) => {
            setFileList((prevList) => prevList.filter((item) => item.uid !== file.uid));
        },
    };

    const onFinish = async (values) => {
        const formData = new FormData();
        for (const key in values) {
            if(key !== "product_images"){
                formData.append(key, values[key] || "");
            }
        }

        fileList.forEach((file) => {
            formData.append('images', file.originFileObj);
        });

        const result = await saveProduct(formData)
        if(result){
            message.success('Producto registrado con exito')
            form.resetFields()
            setFileList([])
            getProducts()
        }
    };

    return (
        <Form
            form={form}
            onFinish={onFinish}
            layout='vertical'
            autoComplete="off"
            style={{ width: "100%" }}
        >
            <Form.Item
                name="product_name"
                label="Nombre del producto"
                rules={[{ required: true, message: 'Por favor ingrese el nombre del producto' }]}
            >
                <Input placeholder='Ingrese el nombre del producto' />
            </Form.Item>

            <Form.Item
                name="product_category"
                label="Categoría"
                rules={[{ required: true, message: 'Por favor seleccione la categoría' }]}
            >
                {categories.length > 0 ? (
                    <Select placeholder="Seleccione una categoría">
                        {categories.map((category) => (
                            <Select.Option key={category.id} value={category.id}>
                                {category.category_name}
                            </Select.Option>
                        ))}
                    </Select>
                ) : (
                    <p>No hay categorías disponibles.</p>
                )}
            </Form.Item>

            <Form.Item
                name="product_price"
                label="Precio"
                rules={[{ required: true, message: 'Por favor ingrese el precio' }]}
            >
                <Input placeholder='Ingrese el precio' />
            </Form.Item>

            <Form.Item
                name="product_description"
                label="Descripción"
                rules={[{ required: true, message: 'Por favor ingrese la descripción' }]}
            >
                <Input.TextArea placeholder='Ingrese la descripción' />
            </Form.Item>

            <Form.Item
                name="product_images"
                label="Imágenes"
                rules={[{ required: true, message: 'Por favor suba al menos una imagen' }]}
                valuePropName="fileList"
                getValueFromEvent={(e) => e && e.fileList}
            >
                <Dragger {...uploadProps}>
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Haga clic o arrastre archivos a esta área para subir</p>
                    <p className="ant-upload-hint">
                        Soporte para una o varias imágenes. No suba archivos prohibidos o datos confidenciales.
                    </p>
                </Dragger>
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Agregar Producto
                </Button>
            </Form.Item>
        </Form>
    );
}

export default AddProducts;
