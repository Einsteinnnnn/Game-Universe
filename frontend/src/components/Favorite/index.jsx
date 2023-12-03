import React from 'react';
import './index.css';
import { List, Button, Typography, Skeleton } from 'antd';
import backend from '../../backend';
import apis from '../../api';
import { handleResponse, loading, processSearchResult, success } from '../../utils';


const Favorite = ({ currentPage, setCurrentPage, user, setDetailGame }) => {

    const [favoriteGames, setFavoriteGames] = React.useState(null);

    React.useEffect(() => {
        backend.request(apis.getFavoriteGames, {}, (res) => {
            if (handleResponse(res)) {
                console.log(res.data);
                setFavoriteGames(processSearchResult(res.data));
            }
        });
    }, []);

    const deleteFavorite = (gameid) => {
        loading('Please wait...');
        backend.request(apis.deleteFavoriteGame, { gameid: gameid }, (res) => {
            if (handleResponse(res)) {
                success('Delete successfully!');
                setFavoriteGames(favoriteGames.filter(item => item.gameid !== gameid));
            }
        });
    };

    return (
        <div className='Favorite'>
            <Typography.Title level={2} style={{ color: '#fff', textAlign: 'center' }}>My Favorite Games</Typography.Title>
            <div className='Favorite-list'>
                <List
                    className="demo-loadmore-list"
                    itemLayout="horizontal"
                    dataSource={favoriteGames === null ? [{}, {}, {}] : favoriteGames}
                    size='large'
                    pagination={{
                        onChange: (page) => {
                            window.scrollTo(0, 0);
                        },
                        pageSize: 30,
                    }}
                    renderItem={(item) => (
                        <Skeleton loading={favoriteGames === null} active style={{marginBottom:'40px'}}>
                            <List.Item
                                actions={[<Button onClick={() => {deleteFavorite(item.gameid)}}>delete</Button>]}
                            >
                                <List.Item.Meta
                                    title={<a href={true} onClick={() => { setDetailGame(item.gameid); setCurrentPage('detail') }}>{item.title}</a>}
                                    description={<Typography.Text ellipsis={{ rows: 3 }}>{item.content}</Typography.Text>}
                                />
                            </List.Item>
                        </Skeleton>
                    )}
                />
            </div>
            <div style={{ textAlign: 'center', marginTop:'30px' }}>
                <Button type="primary" onClick={() => { setCurrentPage('search') }} style={{ marginTop: '20px', textAlign: 'center' }}>Add more games</Button>
            </div>
        </div>
    );
};

export default Favorite;
