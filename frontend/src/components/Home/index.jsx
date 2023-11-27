import React from 'react';
import './index.css';
import { Input, ConfigProvider, Typography, List, Avatar, Space } from 'antd';
import { SearchOutlined, FireOutlined } from '@ant-design/icons';
import backend from '../../backend';
import apis from '../../api';
import { handleResponse, processSearchResult } from '../../utils';

const trendingData = Array.from({ length: 10 }).map((_, i) => ({
    href: 'https://ant.design',
    title: `Game ranked ${i+1}`,
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



function Home({currentPage, setCurrentPage, user, setSearchResult, setSearchKeyword}) {

    const startSearch = (e) => {
        var keyword = e.target.value;
        if (keyword !== ''){
            setSearchResult(null);
            setCurrentPage('search');
            setSearchKeyword(keyword)
            backend.request(apis.basicSearch, {keyword: keyword}, (res) => {
                if (handleResponse(res)){
                    setSearchResult(processSearchResult(res.data));
                }
            });
        }
    }

    return (
        <div className='Home'>
            <div className='home-search'>
                <ConfigProvider
                    theme={{
                        components: {
                            Input: {
                                paddingInlineLG: 14
                            },
                        },
                    }}
                >
                    <Typography.Title level={2} style={{ color: '#DCE3EF', marginBottom: '20px', textAlign: 'center' }}>Discover, Play, and Conquer.</Typography.Title>
                    <Input placeholder="Search for games" size='large' style={{ borderRadius: '40px' }} prefix={<SearchOutlined />} onPressEnter={(e) => startSearch(e)}/>
                </ConfigProvider>
                <div className='home-trending'>
                    <Typography.Title level={3} style={{ color: '#DCE3EF', marginBottom: '20px' }}>Trending <span style={{ fontSize: '20px' }}><FireOutlined /></span></Typography.Title>

                    <List
                        itemLayout="vertical"
                        size="large"
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
        </div>
    );
}

export default Home;
