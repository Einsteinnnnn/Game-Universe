
import React from 'react';
import './index.css';
import { Input, Affix, Typography, List, Row, Col, Space, Button, Skeleton, Card, Select, Form, InputNumber, Slider } from 'antd';
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

function Search({ currentPage, setCurrentPage, user, searchResult, setSearchResult, searchKeyword, setSearchKeyword, setDetailGame }) {

    const [advancedSearch, setAdvancedSearch] = React.useState(false);

    const startSearch = (e) => {
        var keyword = e.target.value;
        if (keyword !== '') {
            setSearchResult(null);
            backend.request(apis.basicSearch, { keyword: searchKeyword }, (res) => {
                if (handleResponse(res)) {
                    setSearchResult(processSearchResult(res.data));
                }
            });
        }
    }

    const startAdvancedSearch = (values) => {
        setSearchResult(null);
        backend.request(apis.advancedSearch, values, (res) => {
            console.log(res);
            if (handleResponse(res)) {
                setSearchResult(processSearchResult(res.data));
            }
        });
    }

    return (
        <div className='Search'>
            <div className='search-search'>
                <Typography.Title level={2} style={{ color: '#DCE3EF', marginBottom: '20px' }}>Discover the best.<Button type='text' style={{ marginLeft: '10px', marginBottom: '5px' }} onClick={() => { setAdvancedSearch(!advancedSearch) }}><RightOutlined />{advancedSearch ? 'Return to Normal Search' : 'Try Advanced Search'}</Button></Typography.Title>
                {advancedSearch ?
                    <><Form
                        name="basic"
                        initialValues={{ remember: true }}
                        onFinish={startAdvancedSearch}
                        autoComplete="off"
                        labelAlign='left'
                    >
                        <Card style={{ borderRadius: '20px' }}>
                            <Row>
                                <Col span={8}>
                                    <Form.Item
                                        initialValue="All"
                                        label="Genre"
                                        name="genre">
                                        <Select
                                            defaultValue="Any"
                                            style={{ width: '60%' }}
                                            bordered={false}
                                            options={[
                                                { value: 'All', label: 'Any' },
                                                { value: 'nongame', label: 'Non-Game' },
                                                { value: 'indie', label: 'Indie' },
                                                { value: 'action', label: 'Action' },
                                                { value: 'adventure', label: 'Adventure' },
                                                { value: 'casual', label: 'Casual' },
                                                { value: 'strategy', label: 'Strategy' },
                                                { value: 'rpg', label: 'RPG' },
                                                { value: 'simulation', label: 'Simulation' },
                                                { value: 'sports', label: 'Sports' },
                                                { value: 'racing', label: 'Racing' }
                                            ]}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        initialValue="All"
                                        label="Category"
                                        name="category">
                                        <Select
                                            defaultValue="Any"
                                            style={{ width: '60%' }}
                                            bordered={false}
                                            options={[
                                                { value: 'All', label: 'Any' },
                                                { value: 'singleplayer', label: 'Single Player' },
                                                { value: 'multiplayer', label: 'Multi Player' },
                                                { value: 'coop', label: 'Cooperation Game' },
                                                { value: 'mmo', label: 'Massive Multi Player (MMO)' },
                                                { value: 'inapppurchase', label: 'In-app-purchase' },
                                                { value: 'includesrcsdk', label: 'Include Source SDK' },
                                                { value: 'includeleveleditor', label: 'Include Level Editor' },
                                                { value: 'vrsupport', label: 'VR Support' },
                                            ]}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        initialValue="All"
                                        label="OS Platforms"
                                        name="os_platforms">
                                        <Select
                                            defaultValue="Any"
                                            style={{ width: '60%' }}
                                            bordered={false}
                                            options={[
                                                { value: 'All', label: 'Any' },
                                                { value: 'windows', label: 'Windows' },
                                                { value: 'linux', label: 'Linux' },
                                                { value: 'mac', label: 'Mac' },
                                            ]}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        initialValue="All"
                                        label="Language"
                                        name="language">
                                        <Select
                                            defaultValue="Any"
                                            style={{ width: '60%' }}
                                            bordered={false}
                                            options={[
                                                { value: 'All', label: 'Any' },
                                                { value: 'Arabic', label: 'Arabic' },
                                                { value: 'Bengali', label: 'Bengali' },
                                                { value: 'Bhojpuri', label: 'Bhojpuri' },
                                                { value: 'Burmese', label: 'Burmese' },
                                                { value: 'Chinese', label: 'Chinese' },
                                                { value: 'English', label: 'English' },
                                                { value: 'Filipino', label: 'Filipino' },
                                                { value: 'French', label: 'French' },
                                                { value: 'German', label: 'German' },
                                                { value: 'Gujarati', label: 'Gujarati' },
                                                { value: 'Hausa', label: 'Hausa' },
                                                { value: 'Hindi', label: 'Hindi' },
                                                { value: 'Indonesian', label: 'Indonesian' },
                                                { value: 'Iranian Persian', label: 'Iranian Persian' },
                                                { value: 'Italian', label: 'Italian' },
                                                { value: 'Japanese', label: 'Japanese' },
                                                { value: 'Javanese', label: 'Javanese' },
                                                { value: 'Kannada', label: 'Kannada' },
                                                { value: 'Korean', label: 'Korean' },
                                                { value: 'Malayalam', label: 'Malayalam' },
                                                { value: 'Marathi', label: 'Marathi' },
                                                { value: 'Odia', label: 'Odia' },
                                                { value: 'Polish', label: 'Polish' },
                                                { value: 'Portuguese', label: 'Portuguese' },
                                                { value: 'Punjabi', label: 'Punjabi' },
                                                { value: 'Russian', label: 'Russian' },
                                                { value: 'Spanish', label: 'Spanish' },
                                                { value: 'Swahili', label: 'Swahili' },
                                                { value: 'Sunda', label: 'Sunda' },
                                                { value: 'Tamil', label: 'Tamil' },
                                                { value: 'Telugu', label: 'Telugu' },
                                                { value: 'Thai', label: 'Thai' },
                                                { value: 'Turkish', label: 'Turkish' },
                                                { value: 'Ukrainian', label: 'Ukrainian' },
                                                { value: 'Urdu', label: 'Urdu' },
                                                { value: 'Vietnamese', label: 'Vietnamese' },
                                                { value: 'Yoruba', label: 'Yoruba' }
                                            ]}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        initialValue={0}
                                        label="Age Restriction"
                                        name="required_age">
                                        <InputNumber prefix='>' defaultValue={0} min={0} max={18} style={{ width: '60%' }} step={1} precision={0} />
                                    </Form.Item>
                                    <Form.Item
                                        initialValue={0}
                                        label="Meta Critic"
                                        name="metacritic_lowerbnd">
                                        <InputNumber prefix=">" defaultValue={0} min={0} max={100} style={{ width: '60%' }} step={1} />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        initialValue={0}
                                        label="Steam Spy Owners"
                                        name="steamspyowners">
                                        <InputNumber prefix=">" defaultValue={0} min={0} style={{ width: '60%' }} step={1} />
                                    </Form.Item>
                                    <Form.Item
                                        initialValue={[0, 100]}
                                        label="Price Range"
                                        name="price">
                                        <Slider defaultValue={[0, 100]} range={true} marks={{ 0: '$0', 100: '$1000' }} style={{ width: '70%' }} tooltip={{ formatter: (value) => `$${value * 10}` }} step={0.1} />
                                    </Form.Item>

                                </Col>
                            </Row>
                        </Card>
                        <Form.Item >
                            <div style={{ textAlign: 'right', marginTop: '30px' }}>
                                <Button type="primary" htmlType="submit" style={{ marginBottom: '0px' }}>
                                    Filter
                                </Button>
                            </div>
                        </Form.Item>
                    </Form>
                    </> :
                    <Affix offsetTop={80}>
                        <Input placeholder="Search for games" size='large' style={{ borderRadius: '40px' }} prefix={<SearchOutlined />} value={searchKeyword} onChange={(e) => { setSearchKeyword(e.target.value) }} onPressEnter={(e) => { startSearch(e) }} />
                    </Affix>
                }

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
                                    title={<a href={true} onClick={() => { setDetailGame(item.gameid); setCurrentPage('detail') }}>{item.title}</a>}
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
