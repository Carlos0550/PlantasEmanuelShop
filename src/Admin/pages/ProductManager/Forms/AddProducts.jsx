import React, { useEffect, useState } from 'react';
import { Form, Input, Select, Upload, message, Button } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { useAppContext } from '../../../../AppContext';
import { v4 as uuidv4 } from 'uuid';
import { resizeAndConvertImages } from '../../../../utils/ResizeImages';

import { EditorState, ContentState, convertToRaw, convertFromHTML } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

const { Dragger } = Upload;

function AddProducts() {
    const [form] = Form.useForm();
    const { categories, saveProduct, getProducts, editingProduct, 
        productId, handleProducts, productsList, editProducts

    } = useAppContext();
    console.log(productId)
    const [fileList, setFileList] = useState([]);
    const [editorState, setEditorState] = useState(EditorState.createEmpty());

    const onEditorStateChange = (newState) => {
        setEditorState(newState);
        const rawContext = convertToRaw(newState.getCurrentContent());
        const plainText = rawContext.blocks.map(block => block.text).join('\n');
        form.setFieldsValue({
            product_description: plainText,
        });
    };
    const [uploadProps, setUploadProps] = useState({name: 'file',
        multiple: true,
        beforeUpload: async (file) => {
            try {
                const [compressedFile] = await resizeAndConvertImages([file]);
                const newFileList = {
                    uid: uuidv4(),
                    name: compressedFile.name,
                    status: 'done',
                    originFileObj: compressedFile,
                    thumbUrl: URL.createObjectURL(compressedFile) 
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
            setFileList((prevList) => prevList.filter((item) => item.name.split(".")[0] !== file.name.split(".")[0]));
        },});
    
        useEffect(()=>{
            setUploadProps((prevProps) => ({
                ...prevProps,
                fileList, 
            }));
        },[fileList])
        
    const onFinish = async (values) => {
        console.log(values)
        const htmlDescription = stateToHTML(editorState.getCurrentContent());

        const formData = new FormData();
        for (const key in values) {
            if(key !== "product_images" && key !== "product_description") {
                formData.append(key, values[key] || "");
            }
        }
        formData.append('product_description', htmlDescription);
        fileList.forEach((file) => {
            formData.append('images', file.originFileObj);
        });

        const result = editingProduct ? await editProducts(formData, productId) : await saveProduct(formData)
        if(result){
            if(editingProduct) message.success('Producto editado con exito') 
            else message.success('Producto registrado con exito')

            form.resetFields()
            setFileList([])
            setEditorState(EditorState.createEmpty())
            getProducts()
            handleProducts()
        }
    };

    useEffect(()=>{
        if(editingProduct && productId){
            const selectedProduct = productsList.find(product => product.id === productId)
            console.log(selectedProduct)
            form.setFieldsValue({
                product_name: selectedProduct.product_name,
                product_category: selectedProduct.product_category,
                product_price: selectedProduct.product_price,
                product_description: selectedProduct.product_description,
                
            })
            const blockFromHTML = convertFromHTML(selectedProduct.product_description);
            const contentState = ContentState.createFromBlockArray(blockFromHTML.contentBlocks, blockFromHTML.entityMap);
            const editorState = EditorState.createWithContent(contentState);
            setEditorState(editorState)

            const formattedImages = selectedProduct.images.map((image) => ({
                uid: uuidv4(),
                name: image.image_name,
                status: 'done',
                originFileObj: new File([image.image_data], image.image_name, { type: image.image_type }),
                
            }))
    
            setFileList(formattedImages)
            
        }else{
            form.resetFields()
            setFileList([])
            setEditorState(EditorState.createEmpty())

        }
    },[editingProduct, productId])

useEffect(()=>{
    form.setFieldsValue({
        product_images: fileList
    })
},[fileList])

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
                <Editor
                    editorState={editorState}
                    onEditorStateChange={onEditorStateChange}
                    placeholder='Ingrese la descripción del producto'
                    
                    toolbar={{
                        options: ['inline', 'list', 'textAlign', 'link', 'history'],
                    }}
                />
            </Form.Item>

            <Form.Item
                name="product_images"
                label="Imágenes"
                rules={[{ required: true, message: 'Por favor suba al menos una imagen' }]}
                valuePropName="fileList"
               
                getValueFromEvent={(e) => e && e.fileList}
            >
                <Dragger {...uploadProps} fileList={fileList}>
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
