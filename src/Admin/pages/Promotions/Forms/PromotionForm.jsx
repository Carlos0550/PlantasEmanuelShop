import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Button, DatePicker, Flex, Form, Input, message, notification, Select, Space, Switch, Upload } from 'antd'
import { EditorState, ContentState, convertToRaw, convertFromHTML } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import { stateToHTML } from 'draft-js-export-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { useAppContext } from '../../../../AppContext';
import { resizeAndConvertImages } from '../../../../utils/ResizeImages';
const { Dragger } = Upload
import { v4 as uuidv4 } from 'uuid';
import dayjs from "dayjs"

import { InboxOutlined } from "@ant-design/icons";
import "./PromotionForm.css"
function PromotionForm() {
    const [form] = Form.useForm();
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [isSinglePromotion, setIsSinglePromotion] = useState(false)
    const { productsList, width, savePromotion } = useAppContext()
    const [fileList, setFileList] = useState([]);
    const [promotionStartDate, setPromotionStartDate] = useState();
    const [promotionEndsDate, setPromotionEndsDate] = useState();
    const [totalProducts, setTotalProducts] = useState(0);
    const [saving, setSaving] = useState(false);
    const [products, setProducts] = useState([]);
    const onFinish = async (values) => {
        setSaving(true)
        const htmlDescription = stateToHTML(editorState.getCurrentContent());
        const formData = new FormData();
        const promotionType = isSinglePromotion ? "single" : "multiple";

        Object.entries(values).forEach(([key, value]) => {
            if (!["promotion_images", "promotion_description", "promotion_start_date", "promotion_end_date", "promotion_products"].includes(key)) {
                formData.append(key, value || "");
            }
        });

        formData.append("promotion_type", promotionType);
        formData.append("promotion_description", htmlDescription);
        formData.append("promotion_start_date", dayjs(promotionStartDate).format("YYYY-MM-DD"));
        formData.append("promotion_end_date", dayjs(promotionEndsDate).format("YYYY-MM-DD"));
        fileList.forEach((file) => {
            formData.append("promotion_images", file.originFileObj)
        })

        formData.append("promotion_products", JSON.stringify(products));
        formData.append("promotion_value", totalProducts || "");
        console.log(formData.get("promotion_products"))
        const result = await savePromotion(formData)
        setSaving(false)
        if (result) {
            form.resetFields()
            setFileList([])
            setEditorState(EditorState.createEmpty())
            setTotalProducts(0)
            setProducts([])
        }

    };


    const onEditorStateChange = (newState) => {
        setEditorState(newState);
        const rawContext = convertToRaw(newState.getCurrentContent());
        const plainText = rawContext.blocks.map(block => block.text).join('\n');
        form.setFieldsValue({
            promotion_description: plainText,
        });
    };

    const uploadProps = useMemo(() => ({
        name: "file",
        multiple: true,
        beforeUpload: async (file) => {
            if (fileList.length >= 3) {
                message.warning("Solo puedes subir hasta 3 imagenes")
                return false;
            }
            try {

                const [compressedFiles] = await resizeAndConvertImages([file])

                const newFileList = {
                    uid: compressedFiles.uid,
                    name: compressedFiles.name,
                    originFileObj: compressedFiles,
                    editing: false,
                    thumbUrl: URL.createObjectURL(compressedFiles)
                }
                setFileList((prevList) => [...prevList, newFileList]);
            } catch (error) {
                console.error('Error al redimensionar la imagen:', error);
            }
            return false
        },
        fileList,
        onRemove: (file) => {
            setFileList((prevList) => prevList.filter((item) => item.name.split(".")[0] !== file.name.split(".")[0]));
        }
    }), [fileList])

    useEffect(() => {
        form.setFieldsValue({
            promotion_images: fileList
        })

    }, [fileList])

    const handleVerifyProducts = (products) => {
        if (!products || products.length === 0) return ["La lista de productos no puede estar vacía"];

        const errors = [];
        let total = 0
        let productsList = []

        products.trim().split("\n").forEach((prod, idx) => {
            const productsParts = prod.trim().split(" ");
            const quantity = productsParts[0];
            const productName = productsParts.slice(1, -1).join(" ");
            const productPrice = productsParts[productsParts.length - 1];
            if (!quantity || !productName || !productPrice) {
                errors.push(`Error en la línea ${idx + 1}: Formato incorrecto. Usa "cantidad | producto | precio".`);
            }


            if (!/^\d+$/.test(quantity)) {
                errors.push(`Error en la línea ${idx + 1}: La cantidad debe ser un número entero positivo.`);
            }

            if (!productName || productName.trim().length === 0) {
                errors.push(`Error en la línea ${idx + 1}: El nombre del producto es requerido.`);
            }

            if (!/^\d+(\.\d+)?$/.test(productPrice)) {
                errors.push(`Error en la línea ${idx + 1}: El precio del producto debe ser un número válido.`);
            }

            if (productPrice && quantity) {
                total += parseInt(quantity) * parseFloat(productPrice)
            }

            if (productPrice && productName && quantity) {
                productsList.push({ quantity, productName, productPrice })
            }
        });

        if (errors.length > 0) {
            return errors;
        }
        setTotalProducts(total)
        setProducts(productsList)
        return true;
    };

    const validationTimeout = useRef(null);

    return (
        <Form
            onFinish={onFinish}
            form={form}
            layout="vertical"
            autoComplete="off"
            style={{ width: "100%" }}
        >


            <Form.Item
                name={"promotion_name"}
                label="Nombre de la promoción"
                rules={[
                    {
                        required: true,
                        message: "El nombre de la promoción es requerido",
                    },
                ]}
            >
                <Input placeholder='Oferta de Verano' />
            </Form.Item>

            <Form.Item
                name={"promotion_discount"}
                label="Descuento a aplicar"
            >
                <Input placeholder='20%' style={{ maxWidth: width < 568 ? "100%" : "30%" }}/>
            </Form.Item>

            <Flex wrap gap={10} justify='space-around' vertical>
                <p>Tipo de promoción</p>
                <span>
                    <Switch
                        onChange={(e) => setIsSinglePromotion(e)}
                        checked={isSinglePromotion}

                    />{" "} Promoción {isSinglePromotion ? "de stock" : "personalizada"}
                </span>
            </Flex>
            {!isSinglePromotion && <p style={{ color: "#a0a0a0" }}>Describe un conjunto de productos con sus precios aunque no los tengas en stock.</p>}
            {isSinglePromotion && <p style={{ color: "#a0a0a0" }}>Oferta de un producto en particular en tu lista de stock</p>}

            {isSinglePromotion &&
                <Form.Item
                    name={"product_id"}
                    label="Producto a ofertar"
                >
                    <Select placeholder="Seleccione un producto" style={{ maxWidth: width < 568 ? "100%" : "50%" }}
                        showSearch optionFilterProp="children"
                        filterOption={(input, option) => {
                            return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }}
                    >
                        {productsList && productsList.map((product) => (
                            <Option value={product.id} key={product.id}>{product.product_name}</Option>
                        ))}
                    </Select>
                </Form.Item>
            }

            {!isSinglePromotion &&
                <Form.Item
                    name="promotion_products"
                    label="Productos a ofertar"
                    tooltip="Ingresa tus productos uno debajo del otro en formato: cantidad | producto | precio"
                    rules={[
                        {
                            required: true,
                            message: "Los productos de la promoción son requeridos",
                        },
                        {
                            validator: (_, value) => {

                                if (validationTimeout.current) clearTimeout(validationTimeout.current);

                                return new Promise((resolve, reject) => {
                                    validationTimeout.current = setTimeout(() => {
                                        if (!value) {
                                            setTotalProducts(0);
                                            resolve();
                                            return;
                                        }

                                        const errors = handleVerifyProducts(value);
                                        if (errors !== true) {
                                            const errorMessage = errors.join("\n");
                                            reject(new Error(errorMessage));
                                        } else {
                                            resolve();
                                        }
                                    }, 400);
                                });
                            }
                        }
                    ]}
                >
                    <Input.TextArea style={{ resize: "none", height: "100px" }} />
                </Form.Item>
            }
            <p style={{ marginBottom: "10px" }}><strong>Total de productos:</strong> {totalProducts.toLocaleString("es-AR", { style: "currency", currency: "ARS" })}</p>


            <Space wrap>
                <Form.Item
                    name={"promotion_start_date"}
                    label="Fecha de inicio"
                    rules={[
                        {
                            required: true,
                            message: "La fecha de inicio de la promoción es requerida",
                        },
                        {
                            validator: (_, value) => {
                                if (value) {
                                    const selectedDate = dayjs(value);
                                    const currentDate = dayjs();
                                    if (!selectedDate || !selectedDate.isValid()) return Promise.resolve()
                                    if (selectedDate.isBefore(currentDate)) {
                                        return Promise.reject("La fecha de inicio debe ser posterior a la fecha actual");
                                    }
                                }
                                return Promise.resolve();
                            }
                        }
                    ]}
                >
                    <DatePicker style={{ width: "100%" }} onChange={(date) => setPromotionStartDate(date)} />
                </Form.Item>

                <Form.Item
                    name={"promotion_end_date"}
                    label="Fecha de fin"
                    rules={[
                        {
                            required: true,
                            message: "La fecha de inicio de la promoción es requerida",
                        },
                        {
                            validator: (_, value) => {
                                if (value) {
                                    const selectedDate = dayjs(value);
                                    const currentDate = dayjs();
                                    if (!selectedDate || !selectedDate.isValid()) return Promise.resolve()

                                    if (selectedDate.isBefore(form.getFieldValue("promotion_start_date"))) {
                                        return Promise.reject("La fecha de fin debe ser posterior a la fecha de inicio")
                                    }
                                }
                                return Promise.resolve();
                            }
                        }
                    ]}
                >
                    <DatePicker style={{ width: "100%" }} onChange={(date) => setPromotionEndsDate(date)} />
                </Form.Item>
            </Space>

            <Form.Item
                name={"promotion_description"}
                label="Descripcion de la promoción"

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

            <div>
                <p className='preview_p'>Vista previa</p>
                <div className='preview_images'>
                {fileList.map((file) => (
                    <div key={file.name} className='preview_image'>
                        {console.log(file)}
                        <img src={file.thumbUrl} alt={file.name} />
                    </div>
                ))}
                </div>
            </div>

            <Form.Item
                name="promotion_images"
                label="Imágenes"
                help="La primer imagen será la portada de la promoción"
                rules={
                    [
                        { required: true, message: 'Por favor suba al menos una imagen' },
                        {
                            validator: (_, value) => {

                                if (value && value.length > 3) return Promise.reject("Solo puedes subir hasta 3 imágenes")
                                return Promise.resolve()
                            }
                        }
                    ]
                }
                valuePropName="fileList"

                getValueFromEvent={(e) => e && e.fileList}
            >
                <Dragger {...uploadProps} fileList={fileList} onPreview={(pre) => URL.createObjectURL(pre.originFileObj)} >
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
                <Button loading={saving} htmlType='submit' type='primary'>Guardar Promoción</Button>
            </Form.Item>
        </Form>
    )
}

export default PromotionForm