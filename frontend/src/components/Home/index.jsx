import React from 'react';
import './index.css';
import { Input, ConfigProvider, Typography, List, Space, Divider, Card, Form, Button, Skeleton, Select } from 'antd';
import { SearchOutlined, FireOutlined } from '@ant-design/icons';
import backend from '../../backend';
import apis from '../../api';
import { handleResponse, loading, processSearchResult, success } from '../../utils';

const IconText = ({ icon, text }) => (
    <Space>
        {React.createElement(icon)}
        {text}
    </Space>
);


const processTrendingResult = (data) => {
    const processedResult = data.map(item => {
        return {
            gameid: item[0],
            title: item[1],
            content: item[2],
            img: item[3],
            recommendations: item[4],
        };
    });
    return processedResult;
}

function Home({ currentPage, setCurrentPage, user, setSearchResult, setSearchKeyword, setDetailGame }) {

    const [trendingData, setTrendingData] = React.useState({ top: null, bottom: null });

    React.useEffect(() => {
        backend.request(apis.trending, {}, (res) => {
            if (handleResponse(res)) {
                setTrendingData({
                    top: processTrendingResult(res.data.top),
                    bottom: processTrendingResult(res.data.bottom),
                });
            }
        });
    }, []);

    const startSearch = (e) => {
        var keyword = e.target.value;
        if (keyword !== '') {
            setSearchResult(null);
            setCurrentPage('search');
            setSearchKeyword(keyword)
            backend.request(apis.basicSearch, { keyword: keyword }, (res) => {
                if (handleResponse(res)) {
                    setSearchResult(processSearchResult(res.data));
                }
            });
        }
    };

    const addGame = (values) => {
        loading('Please wait...');
        backend.request(apis.addGame, values, (res) => {
            if (handleResponse(res)) {
                success('Game added!');
            }
        });
    };

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
                    <Input placeholder="Search for games" size='large' style={{ borderRadius: '40px' }} prefix={<SearchOutlined />} onPressEnter={(e) => startSearch(e)} />
                </ConfigProvider>
                <div className='home-trending'>
                    <Typography.Title level={3} style={{ color: '#DCE3EF', marginBottom: '20px' }}>Trending <span style={{ fontSize: '20px' }}><FireOutlined /></span></Typography.Title>
                    <List
                        itemLayout="vertical"
                        size="large"
                        dataSource={trendingData.top === null ? [{}, {}, {}] : trendingData.top}
                        renderItem={(item) => (
                            <Skeleton loading={trendingData.top === null} active avatar>
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
                                    />
                                    <Typography.Paragraph ellipsis={{ rows: 5, expandable: false, symbol: 'more' }}>{item.content}</Typography.Paragraph>
                                </List.Item>
                            </Skeleton>
                        )}
                    />
                    <Divider style={{ marginTop: '50px', marginBottom: '50px' }} />
                    <Typography.Title level={3} style={{ color: '#DCE3EF', marginBottom: '20px' }}>Niche, but still worth to try.. </Typography.Title>
                    <List
                        itemLayout="vertical"
                        size="large"
                        dataSource={trendingData.bottom === null ? [{}, {}, {}] : trendingData.bottom}
                        renderItem={(item) => (
                            <Skeleton loading={trendingData.bottom === null} active avatar>
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
                                    />
                                    <Typography.Paragraph ellipsis={{ rows: 5, expandable: false, symbol: 'more' }}>{item.content}</Typography.Paragraph>
                                </List.Item>
                            </Skeleton>
                        )}
                    />
                </div>
                {user && user.username === 'admin' &&
                    <div className='add-game'>
                        <Divider style={{ marginTop: '50px' }} children='The following sections is only visible if you are admin' />
                        <Typography.Title level={5} style={{ color: '#DCE3EF', marginBottom: '20px' }}></Typography.Title>
                        <Card title='Add Game' style={{ width: '100%', borderColor: '#abc2ea' }} >
                            <Form
                                name="add-game"
                                wrapperCol={{
                                    span: 32,
                                }}
                                style={{
                                    maxWidth: '100%',
                                }}
                                initialValues={{
                                    remember: true,
                                }}
                                autoComplete="off"
                                onFinish={(values) => { addGame(values) }}
                            >
                                <div style={{ marginBottom: '10px' }}>
                                    Game Name
                                </div>
                                <Form.Item
                                    name="name"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Name missing!',
                                        },
                                    ]}
                                >
                                    <Input placeholder='Input Game Name' />
                                </Form.Item>
                                <div style={{ marginTop: '20px' }}></div>

                                <div style={{ marginBottom: '10px' }}>
                                    Developer
                                </div>
                                <Form.Item
                                    name="developer"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Developer missing!',
                                        },
                                    ]}
                                >
                                    <Input placeholder='Input Game Developer' />
                                </Form.Item>
                                <div style={{ marginTop: '20px' }}></div>

                                <div style={{ marginBottom: '10px' }}>
                                    Publisher
                                </div>
                                <Form.Item
                                    name="publisher"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Publisher missing!',
                                        },
                                    ]}
                                >
                                    <Input placeholder='Input Game Publisher' />
                                </Form.Item>
                                <div style={{ marginTop: '20px' }}></div>

                                <div style={{ marginBottom: '10px' }}>
                                    Cover Img URL
                                </div>
                                <Form.Item
                                    name="img"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Cover missing!',
                                        },
                                        {
                                            type: 'url',
                                            message: 'Invalid URL!',
                                        },

                                    ]}
                                >
                                    <Input placeholder='Input Cover URL' />
                                </Form.Item>
                                <div style={{ marginTop: '20px' }}></div>

                                <div style={{ marginBottom: '10px' }}>
                                    Game Genre
                                </div>
                                <Form.Item
                                    name="genre"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Genre missing!',
                                        }
                                    ]}
                                >
                                    <Select
                                        allowClear
                                        style={{
                                            width: '100%',
                                        }}
                                        placeholder="Select Genre"
                                        options={[
                                            { value: 'nongame', label: 'Non-Game' },
                                            { value: 'indie', label: 'Indie' },
                                            { value: 'action', label: 'Action' },
                                            { value: 'adventure', label: 'Adventure' },
                                            { value: 'casual', label: 'Casual' },
                                            { value: 'strategy', label: 'Strategy' },
                                            { value: 'rpg', label: 'RPG' },
                                            { value: 'simulation', label: 'Simulation' },
                                            { value: 'sports', label: 'Sports' },
                                            { value: 'racing', label: 'Racing' },
                                            { value: 'earlyaccess', label: 'Early Access' },
                                            { value: 'freetoplay', label: 'Free to Play' },
                                        ]}
                                    />
                                </Form.Item>
                                <div style={{ marginTop: '20px' }}></div>

                                <div style={{ marginBottom: '10px' }}>
                                    Platform
                                </div>
                                <Form.Item
                                    name="platform"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Platform missing!',
                                        }
                                    ]}
                                >
                                    <Select
                                        allowClear
                                        style={{
                                            width: '100%',
                                        }}
                                        placeholder="Select Platform"
                                        options={[
                                                { value: 'windows', label: 'Windows' },
                                                { value: 'linux', label: 'Linux' },
                                                { value: 'mac', label: 'Mac' },
                                        ]}
                                    />
                                </Form.Item>
                                <div style={{ marginTop: '20px' }}></div>

                                <div style={{ marginBottom: '10px' }}>
                                    Language
                                </div>
                                <Form.Item
                                    name="language"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Language missing!',
                                        }
                                    ]}
                                >
                                    <Select
                                        mode='multiple'
                                        allowClear
                                        style={{
                                            width: '100%',
                                        }}
                                        placeholder="Select Language"
                                        options={[
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
                                <div style={{ marginTop: '20px' }}></div>

                                <div style={{ marginTop: '40px' }}></div>
                                <Form.Item
                                    wrapperCol={{
                                        offset: 11,
                                        span: 16,
                                    }}
                                >
                                    <Button type="primary" htmlType="submit">
                                        Add
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Card>
                    </div>
                }
            </div>
        </div>
    );
}

export default Home;
