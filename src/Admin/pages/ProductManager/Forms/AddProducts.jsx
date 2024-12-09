import React, { useEffect, useState } from 'react';
import { Form, Input, Select, Upload, message, Button } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { useAppContext } from '../../../../AppContext';
const { Dragger } = Upload;
import { v4 as uuidv4 } from 'uuid';
import { resizeAndConvertImages } from '../../../../utils/ResizeImages';

function AddProducts() {
    const [form] = Form.useForm();
    const { categories } = useAppContext();
    const [fileList, setFileList] = useState([]);

    const uploadProps = {
        name: 'file',
        multiple: true,
        beforeUpload: async (file) => {
            try {
                const compressedFiles = await resizeAndConvertImages(file);
                console.log(compressedFiles)
                const newFileList = compressedFiles.map((file) => ({
                    uid: uuidv4(),
                    name: file.name,
                    status: 'done',
                    originFileObj: file,
                }));

                setFileList((prevList) => [...prevList, ...newFileList]);
            } catch (error) {
                message.error('Error al redimensionar la imagen');
                console.error('Error al redimensionar la imagen:', error);
            }

            return false; 
        },
        fileList,
        onRemove: (file) => {
            console.log(file)
            setFileList((prevList) => prevList.filter((item) => item.name.split(".")[0] !== file.name.split(".")[0]));
        },
        
    };

    const onFinish = async (values) => {
        console.log('Valores recibidos del formulario:', { ...values, product_images: fileList });

        for (const file of fileList) {
            const formData = new FormData();
            formData.append('file', file.originFileObj);

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
