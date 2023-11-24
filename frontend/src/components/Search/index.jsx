
import React from 'react';
import './index.css';
import { Input, Affix, Typography, List, Avatar, Space, Button } from 'antd';
import { SearchOutlined, FireOutlined, RightOutlined } from '@ant-design/icons';

const trendingData = Array.from({ length: 200 }).map((_, i) => ({
    href: 'https://ant.design',
    title: `Search Result ${i + 1}`,
    avatar: `https://xsgames.co/randomusers/avatar.php?g=pixel&key=${i}`,
    description:
        'This game is fucking good. ',
    content:
        'This game is fucking good, This game is fucking good, This game is fucking good, This game is fucking good, This game is fucking good, This game is fucking good, This game is fucking good, ',
}));

const IconText = ({ icon, text }) => (
    <Space>
        {React.createElement(icon)}
        {text}
    </Space>
);

function Search({currentPage, setCurrentPage, user}) {

    const [advancedSearch, setAdvancedSearch] = React.useState(false);

    return (
        <div className='Search'>
            <div className='search-search'>
                <Typography.Title level={2} style={{ color: '#DCE3EF', marginBottom: '20px' }}>Discover the best.<Button type='text' style={{marginLeft:'10px', marginBottom:'5px'}} onClick={() => {setAdvancedSearch(!advancedSearch)}}><RightOutlined />{advancedSearch? 'Return to Normal Search': 'Try Advanced Search'}</Button></Typography.Title>
                
                <Affix offsetTop={60}>
                        <Input placeholder="Search for games" size='large' style={{ borderRadius: '40px' }} prefix={<SearchOutlined />} />
                </Affix>
            </div>
            <div className='search-result'>
                <List
                    itemLayout="vertical"
                    size="large"
                    pagination={{
                        onChange: (page) => {
                          window.scrollTo(0, 0);
                        },
                        pageSize: 10,
                      }}
                    dataSource={trendingData}
                    renderItem={(item) => (
                        <List.Item
                            key={item.title}
                            actions={[
                                <IconText icon={FireOutlined} text="156" key="list-vertical-star-o" />,
                            ]}
                            extra={
                                <img
                                    width={272}
                                    alt="logo"
                                    src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                                />
                            }
                        >
                            <List.Item.Meta
                                avatar={<Avatar src={item.avatar} />}
                                title={<a href={true} onClick={() => {setCurrentPage('detail')}}>{item.title}</a>}
                                description={item.description}
                            />
                            {item.content}
                        </List.Item>
                    )}
                />
            </div>
        </div>
    );
}

export default Search;
