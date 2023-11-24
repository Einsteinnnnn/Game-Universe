import React from 'react';
import './index.css';
import { Card, Form, Input, Button } from 'antd';
import { UserOutlined, KeyOutlined } from '@ant-design/icons';
import backend from '../../backend';
import apis from '../../api';
import { handleResponse, loading, success } from '../../utils';

function Login({ currentPage, setCurrentPage, user }) {

    const login = (values) => {
        loading();
        const handleLogin = (response) => {
            console.log(response);
            if (handleResponse(response)) {
                success('Login success');
                window.location.reload();
            }
        }
        backend.request(apis.login, values, handleLogin);
    }

    return (
        <div className='Login'>
            <svg width="300" height="52" xmlns="http://www.w3.org/2000/svg" onClick={() => { window.location.reload() }} style={{ userSelect: 'none', cursor: 'pointer' }}>
                <g>
                    <title>GameUniverse</title>
                    <rect stroke="#bad3ff" strokeWidth="2" fillOpacity="0" id="svg_1" height="44.08163" width="294.28572" y="3.2653" x="3.26531" fill="#c0d4f7" />
                    <text textAnchor="start" fontFamily="'Open Sans'" fontSize="44" id="svg_2" y="40.40816" x="10.61224" strokeWidth="0" stroke="#000" fill="#87a1d0">G</text>
                    <text textAnchor="start" fontFamily="'Open Sans'" fontSize="40" id="svg_3" y="41.22449" x="154.69387" strokeWidth="0" stroke="#000" fill="#eaf2ff">niverse</text>
                    <text textAnchor="start" fontFamily="'Open Sans'" fontSize="44" id="svg_4" y="42.04081" x="124.89796" strokeWidth="0" stroke="#000" fill="#87a1d0">U</text>
                    <text textAnchor="start" fontFamily="'Open Sans'" fontSize="40" id="svg_5" y="40.40816" x="42.85714" strokeWidth="0" stroke="#000" fill="#eff5ff">ame</text>
                </g>
            </svg>

            <Card title="Login" style={{ width: 300, borderColor: '#abc2ea', marginTop: '30px' }}>

                <Form
                    name="basic"
                    wrapperCol={{
                        span: 24,
                    }}
                    style={{
                        maxWidth: 600,
                    }}
                    initialValues={{
                        remember: true,
                    }}
                    autoComplete="off"
                    onFinish={(values) => { login(values) }}
                >
                    <div style={{ marginBottom: '10px' }}>
                        Username
                    </div>
                    <Form.Item
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: 'Username missing!',
                            },
                        ]}
                    >
                        <Input prefix={<UserOutlined />} placeholder='Input Username' />
                    </Form.Item>
                    <div style={{ marginTop: '20px' }}></div>
                    <div style={{ marginBottom: '10px' }}>
                        Password
                    </div>
                    <Form.Item
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Password missing!',
                            },
                        ]}
                    >
                        <Input.Password prefix={<KeyOutlined />} placeholder='Input Password' />
                    </Form.Item>
                    <div style={{ marginTop: '40px' }}></div>
                    <Form.Item
                        wrapperCol={{
                            offset: 9,
                            span: 16,
                        }}
                    >
                        <Button type="primary" htmlType="submit">
                            Login
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
            <div style={{ marginTop: '10px', width: 300, display: 'flex', justifyContent: 'space-between' }}>
                <a className='register-button' href={true} onClick={() => { setCurrentPage('home') }}>Back to Home</a>
                <a className='register-button' href={true} onClick={() => { setCurrentPage('register') }}>Register</a>
            </div>

        </div>
    );
}

export default Login;
