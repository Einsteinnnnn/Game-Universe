import React from 'react';
import './index.css';
import { Typography, Row, Col, Card } from 'antd';

const Account = ({ currentPage, setCurrentPage, user }) => {
    return (
        <div className='Account'>
            <Typography.Title level={2} style={{ color: '#fff', textAlign: 'center' }}>My Account</Typography.Title>
            <div style={{ marginLeft: '10%', marginRight: '10%', marginTop: '30px' }}>
                <Row>
                    <Col span={12}>
                        <Card title='Account Information' style={{ width: '80%' }} hoverable>
                            <Typography.Text style={{ color: '#fff' }}>UID</Typography.Text>
                            <div className='Account-value'>
                                <Typography.Title level={5} strong style={{ color: '#fff' }}>{user.uid}</Typography.Title>
                            </div>
                            <div className='Account-label'>
                                <Typography.Text style={{ color: '#fff' }}>Username</Typography.Text>
                            </div>
                            <div className='Account-value'>
                                <Typography.Title level={5} strong style={{ color: '#fff' }}>{user.username}</Typography.Title>
                            </div>
                            <div className='Account-label'>
                                <Typography.Text style={{ color: '#fff' }}>Email</Typography.Text>
                            </div>
                            <div className='Account-value'>
                                <Typography.Title level={5} strong style={{ color: '#fff' }}>{user.email}</Typography.Title>
                            </div>
                            <div className='Account-label'>
                                <Typography.Text style={{ color: '#fff' }}>Phone Number</Typography.Text>
                            </div>
                            <div className='Account-value'>
                                <Typography.Title level={5} strong style={{ color: '#fff' }}>{user.phone}</Typography.Title>
                            </div>
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Typography.Title level={4} style={{ color: '#fff' }}>Statistics</Typography.Title>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default Account;
