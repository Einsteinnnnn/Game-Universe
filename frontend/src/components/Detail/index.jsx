import React from 'react';
import './index.css';
import { Row, Col, List, Avatar, Image, Button, Input, Statistic, Typography } from 'antd';

const comments = [
    {
        title: 'User 1',
        description: 'Best game ever! Best game ever! Best game ever! Best game ever!'
    },
    {
        title: 'User 2',
        description: 'Rabbish. '
    },
    {
        title: 'User 3',
        description: 'GOATED!'
    },
    {
        title: 'User 4',
        description: "Don't waste your time. That's all I can say. Don't waste your time. That's all I can say. Don't waste your time. That's all I can say. Don't waste your time. That's all I can say."
    },
    {
        title: 'User 5',
        description: "literally the best game ever"
    },
    {
        title: 'User 6',
        description: "等等，我叫User 6，是不是意味着GTA6就要出了！（错乱"
    },
    {
        title: 'User 7',
        description: '我是R星的狗'
    },
    {
        title: 'User 8',
        description: '🕆R门🕆🕆R门🕆🕆R门🕆🕆R门🕆🕆R门🕆🕆R门🕆🕆R门🕆🕆R门🕆🕆R门🕆'
    },
    {
        title: 'User 9',
        description: '典'
    },
    {
        title: 'User 10',
        description: "R孝子差不多得了"
    },
    {
        title: 'User 11',
        description: "R*怎么你了"
    },
    {
        title: 'User 12',
        description: "原神，启动！"
    },
];

const gameData = {
    'Developer': 'Rockstar Games',
    'Publisher': 'Rockstar Games',
    'Supported Platform': 'Windows',
    'Supported Language': 'English',
    'Genre': 'Action, Adventure, RPG',
    'Age Restriction': '18+',
    'Number of Players': '1',
}

const gameDataList = Object.keys(gameData).map((key) => ({
    key,
    value: gameData[key]
}));


const Detail = ({ currentPage, setCurrentPage, user }) => {
    return (
        <div className='Detail'>
            <Row>
                <Col span={12}>
                    <div className='detail-game'>
                        <div className='detail-game-image'>
                            <Image
                                width='60%'
                                src="https://i.redd.it/a7qlyr6n4nq31.png"
                            />
                            <div style={{textAlign:'end'}}>
                                <Statistic title="Original Price" value={200} prefix='$'/>
                                <Statistic title="Lowest Price" value={100} prefix='$'/>
                                <Statistic title="Current Price" value={300} prefix='$'/>
                            </div>
                        </div>
                        <div style={{ marginTop: '20px' }}>
                            <Typography.Title level={1} style={{ color: '#DCE3EF' }}>Red Dead Redemption II</Typography.Title>
                        </div>
                        {gameDataList.map((item) => (
                            <div className='detail-game-description-row'>
                                <Typography.Text style={{ color: '#dce3ef9f', fontSize: '16px' }}>{item.key} </Typography.Text>
                                <Typography.Text style={{ color: '#fff', fontSize: '16px' }}>{item.value}</Typography.Text>
                            </div>
                        ))}
                        <Button type="primary" block onClick={() => { setCurrentPage('search') }} style={{ marginTop: '30px', textAlign: 'center' }}>Add to Favorite</Button>
                        <Typography.Title level={4} style={{ color: '#DCE3EF', marginTop: '30px' }}>Add my comments</Typography.Title>
                        <Input.TextArea rows={4} />
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button onClick={() => { setCurrentPage('search') }} style={{ marginTop: '10px' }}>Submit</Button>
                        </div>
                    </div>
                </Col>
                <Col span={12}>
                    <Typography.Title level={2} style={{ color: '#DCE3EF', marginBottom: '20px' }}>Comments</Typography.Title>
                    <List
                        itemLayout="horizontal"
                        dataSource={comments}
                        size='large'
                        split={false}
                        renderItem={(item, index) => (
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<Avatar src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${index}`} />}
                                    title={<a href={true}>{item.title}</a>}
                                    description={item.description}
                                />
                            </List.Item>
                        )}
                    />
                </Col>
            </Row>
        </div>
    );
};

export default Detail;
