import React from 'react';
import { Dropdown, Menu, Typography, Button, theme, Divider } from 'antd';
import { UserOutlined, HomeOutlined, HeartOutlined, SearchOutlined } from '@ant-design/icons';
import './index.css';

const { useToken } = theme;


function Header({ currentPage, setCurrentPage }) {
    const onClick = (e) => {
        setCurrentPage(e.key);
    };

    const items = [
        {
            label: <Typography.Text strong style={{ fontSize: '17px' }}>My Account</Typography.Text>,
            key: 'myAccount',
            icon: <UserOutlined />
        },
        {
            label: (<div onClick={() => setCurrentPage('favorite')}><Typography.Text strong style={{ fontSize: '17px' }}>Favorite Games</Typography.Text></div>),
            // label: <Typography.Text strong style={{ fontSize: '17px' }}>Favorite Games</Typography.Text>,
            key: 'myFavorites',
            icon: <HeartOutlined />
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
                        <rect stroke="#bad3ff" stroke-width="2" fill-opacity="0" id="svg_1" height="44.08163" width="294.28572" y="3.2653" x="3.26531" fill="#c0d4f7" />
                        <text text-anchor="start" font-family="'Open Sans'" font-size="44" id="svg_2" y="40.40816" x="10.61224" stroke-width="0" stroke="#000" fill="#87a1d0">G</text>
                        <text text-anchor="start" font-family="'Open Sans'" font-size="40" id="svg_3" y="41.22449" x="154.69387" stroke-width="0" stroke="#000" fill="#eaf2ff">niverse</text>
                        <text text-anchor="start" font-family="'Open Sans'" font-size="44" id="svg_4" y="42.04081" x="124.89796" stroke-width="0" stroke="#000" fill="#87a1d0">U</text>
                        <text text-anchor="start" font-family="'Open Sans'" font-size="40" id="svg_5" y="40.40816" x="42.85714" stroke-width="0" stroke="#000" fill="#eff5ff">ame</text>
                    </g>
                </svg>
                <div style={{ display: 'flex', minWidth: '50%', justifyContent: 'flex-end' }}>
                    <div style={{ marginTop: '0px' }}>
                        <Menu onClick={onClick} selectedKeys={[currentPage]} mode="horizontal" items={headerItems} />
                    </div>
                    <Dropdown menu={{ items }}
                        dropdownRender={(menu) => (
                            <div style={contentStyle}>
                                <Typography.Text style={{ marginBottom: '0px', marginLeft: '15px' }}>Welcome back,</Typography.Text>
                                <Typography.Title style={{ marginTop: '0px', marginLeft: '15px' }} level={5} >User</Typography.Title>
                                <Divider style={{ margin: '4px 0' }} />
                                {React.cloneElement(menu, {
                                    style: menuStyle,
                                })}
                            </div>
                        )}>
                        <div>
                            <Button onClick={() => { setCurrentPage('login') }} type="primary" icon={<UserOutlined />} shape='circle' style={{ marginLeft: '50px', marginTop: '2px' }}></Button>
                        </div>
                    </Dropdown>
                </div>
            </div>
        </div>
    );
}

export default Header;
