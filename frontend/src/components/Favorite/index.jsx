import React from 'react';
import './index.css';
import { List, Avatar, Button, Typography } from 'antd';


const Favorite = ({currentPage, setCurrentPage}) => {
    const list = [
        {
            "gender": "female",
            "name": {
                "last": "Favorite Game"
            },
            "email": "mrym.qsmy@example.com",
            "picturSe": {
                "large": "https://randomuser.me/api/portraits/women/89.jpg",
                "medium": "https://randomuser.me/api/portraits/med/women/89.jpg",
                "thumbnail": "https://randomuser.me/api/portraits/thumb/women/89.jpg"
            },
            "nat": "IR"
        },
        {
            "gender": "female",
            "name": {
                "last": "Favorite Game"
            },
            "email": "mrym.qsmy@example.com",
            "picturSe": {
                "large": "https://randomuser.me/api/portraits/women/89.jpg",
                "medium": "https://randomuser.me/api/portraits/med/women/89.jpg",
                "thumbnail": "https://randomuser.me/api/portraits/thumb/women/89.jpg"
            },
            "nat": "IR"
        },
        {
            "gender": "female",
            "name": {
                "last": "Favorite Game"
            },
            "email": "mrym.qsmy@example.com",
            "picturSe": {
                "large": "https://randomuser.me/api/portraits/women/89.jpg",
                "medium": "https://randomuser.me/api/portraits/med/women/89.jpg",
                "thumbnail": "https://randomuser.me/api/portraits/thumb/women/89.jpg"
            },
            "nat": "IR"
        },
        {
            "gender": "female",
            "name": {
                "last": "Favorite Game"
            },
            "email": "mrym.qsmy@example.com",
            "picturSe": {
                "large": "https://randomuser.me/api/portraits/women/89.jpg",
                "medium": "https://randomuser.me/api/portraits/med/women/89.jpg",
                "thumbnail": "https://randomuser.me/api/portraits/thumb/women/89.jpg"
            },
            "nat": "IR"
        },
        {
            "gender": "female",
            "name": {
                "last": "Favorite Game"
            },
            "email": "mrym.qsmy@example.com",
            "picturSe": {
                "large": "https://randomuser.me/api/portraits/women/89.jpg",
                "medium": "https://randomuser.me/api/portraits/med/women/89.jpg",
                "thumbnail": "https://randomuser.me/api/portraits/thumb/women/89.jpg"
            },
            "nat": "IR"
        },
    ];

    return (
        <div className='Favorite'>
            <Typography.Title level={2} style={{ color: '#fff', textAlign: 'center' }}>My Favorite Games</Typography.Title>
            <div className='Favorite-list'>
            <List
                className="demo-loadmore-list"
                itemLayout="horizontal"
                dataSource={list}
                renderItem={(item) => (
                    <List.Item
                        actions={[<Button key="list-delete">delete</Button>]}
                    >
                        <List.Item.Meta
                            avatar={<Avatar src={item.picturSe.thumbnail} />}
                            title={<a href={true} onClick={() => {setCurrentPage('detail')}}>{item.name?.last}</a>}
                            description="This is the game description"
                        />
                    </List.Item>
                )}
            />
            </div>
            <div style={{ textAlign:'center'}}>
                <Button type="primary" onClick={() => {setCurrentPage('search')}} style={{ marginTop: '20px', textAlign:'center' }}>Add more games</Button>
            </div>
        </div>
    );
};

export default Favorite;
