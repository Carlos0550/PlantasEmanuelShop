import React, { useState } from "react"
import { Button, Flex, Form, Input } from "antd"
import "./Login.css"
import { useNavigate } from "react-router-dom"
import { useAppContext } from "../../../AppContext"
function Login() {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const [switchInput, setSwitchInput] = useState(true)
    const { loginUser } = useAppContext()
    const onFinish = (values) => {
        const formData = new FormData()
    }

    return (
        <React.Fragment>
            <div className="login-container">
                <div className="login__wrapper">
                    <h1>Iniciar sesión</h1>
                    <Form
                        name="login__form"
                        onFinish={onFinish}
                        layout="vertical"
                        autoComplete="off"

                        style={{ width: "100%" }}
                    >
                        {
                            switchInput && <Form.Item
                                label="Email"
                                className="form-item"
                                name="user_login_name"
                                rules={[
                                    {
                                        required: true,
                                        message: "Por favor ingresa tu email!",
                                    },
                                ]}
                            >
                                <Input placeholder="Introduce tu email" />
                            </Form.Item>
                        }

                        {
                            !switchInput && <Form.Item
                                label="Email"
                                className="form-item"
                                name="user_email"
                                rules={[
                                    {
                                        required: true,
                                        message: "Por favor ingresa tu email!",
                                    },
                                ]}
                            >
                                <Input placeholder="Introduce tu email" />
                            </Form.Item>
                        }
                        <Button onClick={() => setSwitchInput(!switchInput)}>Quiero usar mi {!switchInput ? "email" : "usuario"}</Button>
                        <Form.Item
                            label="Contraseña"

                            name="user_password"
                            rules={[
                                {
                                    required: true,
                                    message: "Por favor ingresa tu contrasena!",
                                },
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item>
                            <Flex wrap justify="space-between" gap={10}>
                                <Button type="primary" htmlType="submit">Iniciar sesión</Button>
                                <Button onClick={() => navigate("/register")}>No tengo cuenta</Button>
                            </Flex>
                        </Form.Item>
                    </Form>
                    <button className="recover-password-btn">Recuperar contraseña</button>
                </div>
            </div>
        </React.Fragment>
    )
}

export default Login