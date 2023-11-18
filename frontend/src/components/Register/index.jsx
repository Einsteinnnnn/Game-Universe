import React from 'react';
import './index.css';
import { Card, Form, Input, Button } from 'antd';
import { UserOutlined, KeyOutlined, MailOutlined, MobileOutlined } from '@ant-design/icons';

function Register({currentPage, setCurrentPage}) {
    return (
        <div className='Register'>
            <svg width="300" height="52" xmlns="http://www.w3.org/2000/svg" onClick={() => { window.location.reload() }} style={{ userSelect: 'none', cursor: 'pointer' }}>
                <g>
                    <title>Layer 1</title>
                    <rect stroke="#bad3ff" stroke-width="2" fill-opacity="0" id="svg_1" height="44.08163" width="294.28572" y="3.2653" x="3.26531" fill="#c0d4f7" />
                    <text text-anchor="start" font-family="'Open Sans'" font-size="44" id="svg_2" y="40.40816" x="10.61224" stroke-width="0" stroke="#000" fill="#87a1d0">G</text>
                    <text text-anchor="start" font-family="'Open Sans'" font-size="40" id="svg_3" y="41.22449" x="154.69387" stroke-width="0" stroke="#000" fill="#eaf2ff">niverse</text>
                    <text text-anchor="start" font-family="'Open Sans'" font-size="44" id="svg_4" y="42.04081" x="124.89796" stroke-width="0" stroke="#000" fill="#87a1d0">U</text>
                    <text text-anchor="start" font-family="'Open Sans'" font-size="40" id="svg_5" y="40.40816" x="42.85714" stroke-width="0" stroke="#000" fill="#eff5ff">ame</text>
                </g>
            </svg>

            <Card title="Register" style={{ width: 300, borderColor: '#abc2ea', marginTop: '30px' }}>

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
                >
                    <div style={{marginBottom:'10px'}}>
                        Username
                    </div>
                    <Form.Item
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: 'Username missing!',
                            },
                            {
                                min: 3,
                                message: 'Username too short!'
                            },
                            {
                                max: 16,
                                message: 'Username too long!'
                            },
                        ]}
                    >
                        <Input prefix={<UserOutlined/>}/>
                    </Form.Item>
                    <div style={{ marginTop: '20px' }}></div>
                    <div style={{marginBottom:'10px'}}>
                        Email
                    </div>
                    <Form.Item
                        name="email"
                        rules={[
                            {
                                required: true,
                                message: 'Email missing!',
                            },
                            {
                                type: 'email',
                                message: 'Invalid email'
                            },
                            {
                                max: 32,
                                message: 'Email too long!'
                            }
                        ]}
                    >
                        <Input prefix={<MailOutlined />}/>
                    </Form.Item>
                    <div style={{ marginTop: '20px' }}></div>
                    <div style={{marginBottom:'10px'}}>
                        Phone Number
                    </div>
                    <Form.Item
                        name="phone"
                        rules={[
                            {
                                required: true,
                                message: 'Phone missing!',
                            },
                            {
                                pattern: new RegExp(/^[0-9]+$/),
                                message: 'Invalid phone number'
                            },
                            {
                                min: 10,
                                message: 'Phone number too short!'
                            },
                            {
                                max: 11,
                                message: 'Phone number too long!'
                            }
                        ]}
                    >
                        <Input prefix={<MobileOutlined />}/>
                    </Form.Item>
                    <div style={{ marginTop: '20px' }}></div>
                    <div style={{marginBottom:'10px'}}>
                        Password
                    </div>
                    <Form.Item
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Password missing!',
                            },
                            {
                                min: 6,
                                message: 'Password too short!'
                            },
                            {
                                max: 16,
                                message: 'Password too long!'
                            }
                        ]}
                    >
                        <Input.Password prefix={<KeyOutlined/>}/>
                    </Form.Item>
                    <div style={{ marginTop: '20px' }}></div>
                    <div style={{marginBottom:'10px'}}>
                        Re-enter Password
                    </div>
                    <Form.Item
                        name="re-password"
                        rules={[
                            {
                                required: true,
                                message: 'Password missing!',
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                  if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                  }
                                  return Promise.reject(new Error('Password does not match!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password prefix={<KeyOutlined/>}/>
                    </Form.Item>
                    <div style={{ marginTop: '40px' }}></div>
                    <Form.Item
                        wrapperCol={{
                            offset: 8,
                            span: 16,
                        }}
                    >
                        <Button type="primary" htmlType="submit">
                            Register
                        </Button>
                    </Form.Item>
                    
                </Form>
            </Card>
            <div style={{ marginTop:'10px', width: 300, display: 'flex', justifyContent: 'space-between' }}>
                <a className='register-button' href={true} onClick={() => {setCurrentPage('home')}}>Back to Home</a>
                <a className='register-button' href={true} onClick={() => {setCurrentPage('login')}}>Login</a>
            </div>
        </div>
    );
}

export default Register;
