
import React from 'react';
import './index.css';
import { Input, Affix, Typography, List, Avatar, Space, Button, Skeleton } from 'antd';
import { SearchOutlined, FireOutlined, RightOutlined } from '@ant-design/icons';
import backend from '../../backend';
import apis from '../../api';
import { handleResponse, processSearchResult } from '../../utils';

const IconText = ({ icon, text }) => (
    <Space>
        {React.createElement(icon)}
        {text}
    </Space>
);

function Search({ currentPage, setCurrentPage, user, searchResult, setSearchResult, searchKeyword, setSearchKeyword }) {

    const [advancedSearch, setAdvancedSearch] = React.useState(false);

    const startSearch = (e) => {
        var keyword = e.target.value;
        if (keyword !== ''){
            setSearchResult(null);
            backend.request(apis.basicSearch, {keyword: searchKeyword}, (res) => {
                if (handleResponse(res)){
                    setSearchResult(processSearchResult(res.data));
                }
            });
        }
    }

    return (
        <div className='Search'>
            <div className='search-search'>
                <Typography.Title level={2} style={{ color: '#DCE3EF', marginBottom: '20px' }}>Discover the best.<Button type='text' style={{ marginLeft: '10px', marginBottom: '5px' }} onClick={() => { setAdvancedSearch(!advancedSearch) }}><RightOutlined />{advancedSearch ? 'Return to Normal Search' : 'Try Advanced Search'}</Button></Typography.Title>

                <Affix offsetTop={80}>
                    <Input placeholder="Search for games" size='large' style={{ borderRadius: '40px' }} prefix={<SearchOutlined />} value={searchKeyword} onChange={(e) => { setSearchKeyword(e.target.value) }} onPressEnter={(e) => { startSearch(e) }} />
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
                    dataSource={searchResult === null ? [{}, {}, {}] : searchResult}
                    renderItem={(item) => (
                        <Skeleton loading={searchResult === null} active avatar>
                            <List.Item
                                key={item.title}
                                actions={[
                                    <IconText icon={FireOutlined} text={item.recommendations} key="list-vertical-star-o" />,
                                ]}
                                extra={
                                    <img
                                        width={272}
                                        alt="logo"
                                        src={item.img}
                                    />
                                }
                            >
                                <List.Item.Meta
                                    title={<a href={true} onClick={() => { setCurrentPage('detail') }}>{item.title}</a>}
                                    description={item.description}
                                />
                                <Typography.Paragraph ellipsis={{ rows: 2, expandable: false, symbol: 'more' }}>
                                    {item.content}
                                </Typography.Paragraph>
                                
                            </List.Item>
                        </Skeleton>
                    )}
                />
            </div>
        </div>
    );
}

export default Search;
