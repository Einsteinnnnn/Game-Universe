import React from 'react';
import { Dropdown, Menu, Typography, Button, theme, Divider, Tooltip } from 'antd';
import { UserOutlined, HomeOutlined, HeartOutlined, SearchOutlined, LogoutOutlined } from '@ant-design/icons';
import backend from '../../backend';
import apis from '../../api';
import './index.css';
import { handleResponse, loading, success } from '../../utils';

const { useToken } = theme;


function Header({ currentPage, setCurrentPage, user }) {

    const onClick = (e) => {
        setCurrentPage(e.key);
    };

    const logout = () => { 
        loading();
        backend.request(apis.logout, {}, (response) => {
            if (handleResponse(response)) {
                success('Logged out');
                window.location.reload();
            }
        })
    }

    const items = [
        {
            label: (<div onClick={() => setCurrentPage('account')}><Typography.Text strong style={{ fontSize: '17px' }}>My Account</Typography.Text></div>),
            key: 'myAccount',
            icon: <UserOutlined />
        },
        {
            label: (<div onClick={() => setCurrentPage('favorite')}><Typography.Text strong style={{ fontSize: '17px' }}>Favorite Games</Typography.Text></div>),
            key: 'myFavorites',
            icon: <HeartOutlined />
        },
        {
            label: (<div onClick={() => logout()}><Typography.Text strong style={{ fontSize: '17px' }}>Logout</Typography.Text></div>),
            key: 'myLogout',
            icon: <LogoutOutlined />
        }
    ];

    const headerItems = [
        {
            label: <Typography.Text strong style={{ color: currentPage === 'home' ? '#87A1D0' : '#fff', transition: '0.2s', fontSize: '17px' }}>Home</Typography.Text>,
            key: 'home',
            icon: <HomeOutlined />
        },
        {
            label: <Typography.Text strong style={{ color: currentPage === 'search' ? '#87A1D0' : '#fff', transition: '0.2s', fontSize: '17px' }}>Search</Typography.Text>,
            key: 'search',
            icon: <SearchOutlined />
        }
    ];

    const { token } = useToken();
    const contentStyle = {
        backgroundColor: token.colorBgElevated,
        borderRadius: token.borderRadiusLG,
        boxShadow: token.boxShadowSecondary,
        paddingTop: '10px',
    };
    const menuStyle = {
        boxShadow: 'none',
    };

    return (
        <div className='Header'>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <svg viewBox="0 0 300 52" width="225" height="39" xmlns="http://www.w3.org/2000/svg" onClick={() => { window.location.reload() }} style={{ userSelect: 'none', cursor: 'pointer' }}>
                    <g>
                        <title>GameUniverse</title>
                        <rect stroke="#bad3ff" strokeWidth="2" fillOpacity="0" id="svg_1" height="44.08163" width="294.28572" y="3.2653" x="3.26531" fill="#c0d4f7" />
                        <text textAnchor="start" fontFamily="'Open Sans'" fontSize="44" id="svg_2" y="40.40816" x="10.61224" strokeWidth="0" stroke="#000" fill="#87a1d0">G</text>
                        <text textAnchor="start" fontFamily="'Open Sans'" fontSize="40" id="svg_3" y="41.22449" x="154.69387" strokeWidth="0" stroke="#000" fill="#eaf2ff">niverse</text>
                        <text textAnchor="start" fontFamily="'Open Sans'" fontSize="44" id="svg_4" y="42.04081" x="124.89796" strokeWidth="0" stroke="#000" fill="#87a1d0">U</text>
                        <text textAnchor="start" fontFamily="'Open Sans'" fontSize="40" id="svg_5" y="40.40816" x="42.85714" strokeWidth="0" stroke="#000" fill="#eff5ff">ame</text>
                    </g>
                </svg>
                <div style={{ display: 'flex', minWidth: '50%', justifyContent: 'flex-end' }}>
                    <div style={{ marginTop: '0px' }}>
                        <Menu onClick={onClick} selectedKeys={[currentPage]} mode="horizontal" items={headerItems} />
                    </div>
                    {user ?
                        <>
                            <Dropdown menu={{ items }}
                                dropdownRender={(menu) => (
                                    <div style={contentStyle}>
                                        <Typography.Text style={{ marginBottom: '0px', marginLeft: '15px' }}>Welcome back,</Typography.Text>
                                        <Typography.Title style={{ marginTop: '0px', marginLeft: '15px' }} level={5} >{user.username}</Typography.Title>
                                        <Divider style={{ margin: '4px 0' }} />
                                        {React.cloneElement(menu, {
                                            style: menuStyle,
                                        })}
                                    </div>
                                )}>
                                <div>
                                    <Button onClick={() => { setCurrentPage('home') }} type="primary" icon={<UserOutlined />} shape='circle' style={{ marginLeft: '50px', marginTop: '2px' }}></Button>
                                </div>
                            </Dropdown>
                        </> :
                        <>
                            <Tooltip title="Click on to login">
                                <Button onClick={() => { setCurrentPage('login') }} type="primary" icon={<UserOutlined />} shape='circle' style={{ backgroundColor: '#ccc', marginLeft: '50px', marginTop: '2px' }}></Button>
                            </Tooltip>
                        </>}
                </div>
            </div>
        </div>
    );
}

export default Header;
