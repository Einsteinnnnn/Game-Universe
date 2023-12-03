import React from 'react';
import './index.css';
import { Row, Col, List, Avatar, Image, Button, Input, Statistic, Typography, Skeleton } from 'antd';
import backend from '../../backend';
import apis from '../../api';
import { handleResponse, loading, success } from '../../utils';


const processGameData = (gameData) => {
    var temp2 = {
        'Release Date': gameData.released,
        'Developer': gameData.developer,
        'Publisher': gameData.publisher,
        'Supported Platform': gameData.supported_platform,
        'Supported Language': gameData.supported_language,
        'Genre': gameData.genre,
        'Age Restriction': gameData.age_restriction,
        'Metacritic Score': gameData.meta_score,
        'Recommendations': gameData.recommendation,
    };
    return Object.keys(temp2).map((key) => {
        return {
            key: key,
            value: temp2[key]
        }
    })
}


const Detail = ({ currentPage, setCurrentPage, user, detailGame }) => {

    const [comments, setComments] = React.useState(null);
    const [myComment, setMyComment] = React.useState(null);
    const [newComment, setNewComment] = React.useState(null);
    const [gameDataList, setGameDataList] = React.useState(null);
    const [gameData, setGameData] = React.useState(null);

    React.useEffect(() => {
        getComment();
    }, []);

    React.useEffect(() => {
        backend.request(apis.getGameInfo, { gameid: detailGame }, (response) => {
            if (handleResponse(response)) {
                setGameDataList(processGameData(response.data));
                setGameData(response.data);
            }
        })
    }, []);


    const getComment = () => {
        backend.request(apis.getComments, { gameid: detailGame }, (response) => {
            if (handleResponse(response)) {
                setComments(response.data);
                var flag = false;
                for (var i = 0; i < response.data.length; i++) {
                    if (response.data[i][0] === user.username) {
                        setMyComment(response.data[i][2]);
                        flag = true;
                        break;
                    }
                }
                if (!flag) {
                    setMyComment(null);
                }
            }
        })
    };

    const addComment = () => {
        loading('Please wait...');
        backend.request(apis.addComment, { gameid: detailGame, review: newComment }, (response) => {
            if (handleResponse(response)) {
                success('Review entered!');
                window.scrollTo(0, 0);
                setComments(null);
                getComment();
            }
        })
    };

    const editComment = () => {
        if (newComment === null) {
            success('Review updated!');
        }
        loading('Please wait...');
        backend.request(apis.editComment, { gameid: detailGame, new_review: newComment }, (response) => {
            if (handleResponse(response)) {
                success('Review updated!');
                window.scrollTo(0, 0);
                setComments(null);
                getComment();
            }
        })
    };

    const deleteComment = () => {
        loading('Please wait...');
        backend.request(apis.deleteComment, { gameid: detailGame, review: myComment }, (response) => {
            if (handleResponse(response)) {
                success('Review deleted!');
                window.scrollTo(0, 0);
                setComments(null);
                getComment();
            }
        })
    };

    const addFavorite = () => {
        loading('Please wait...');
        backend.request(apis.addFavoriteGame, { gameid: detailGame }, (response) => {
            if (handleResponse(response)) {
                success(response.message);
            }
        })
    };


    return (
        <div className='Detail'>
            <Row>
                <Col span={12}>
                    <Skeleton loading={gameDataList === null} active style={{ marginLeft: '10%', width: '80%' }}></Skeleton>
                    <Skeleton loading={gameDataList === null} active style={{ marginLeft: '10%', width: '80%' }}></Skeleton>
                    <Skeleton loading={gameDataList === null} active style={{ marginLeft: '10%', width: '80%' }}></Skeleton>

                    {gameDataList !== null &&
                        <div className='detail-game'>
                            <div className='detail-game-image'>
                                <Image
                                    width='60%'
                                    src={gameData.img}
                                />
                                <div style={{ textAlign: 'end' }}>
                                    <Statistic title="Original Price" value={gameData.original_price} prefix='$' />
                                    <Statistic title="Current Price" value={gameData.current_price} prefix='$' />
                                </div>
                            </div>
                            <div style={{ marginTop: '20px' }}>
                                <Typography.Title level={1} style={{ color: '#DCE3EF' }}>{gameData.name}</Typography.Title>
                            </div>
                            <Typography.Paragraph style={{ color: '#aaaaaa' }} ellipsis={{ rows: 2, expandable: true, symbol: 'more' }}>{gameData.description}</Typography.Paragraph>
                            {gameDataList.map((item) => (
                                <div className='detail-game-description-row'>
                                    <Typography.Text style={{ color: '#dce3ef9f', fontSize: '16px' }}>{item.key} </Typography.Text>
                                    <Typography.Text style={{ color: '#fff', fontSize: '16px', maxWidth: '50%' }} ellipsis={{ rows: 1, expandable: false, tooltip: item.value }}>{item.value}</Typography.Text>
                                </div>
                            ))}
                            <Button type="primary" block onClick={() => { addFavorite() }} style={{ marginTop: '30px', textAlign: 'center' }}>Add to Favorite</Button>
                            {myComment !== null && <div>
                                <Typography.Title level={4} style={{ color: '#DCE3EF', marginTop: '30px' }}>My Review</Typography.Title>
                                <Input.TextArea rows={4} defaultValue={myComment} onChange={(e) => { setNewComment(e.target.value) }} />
                                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <Button onClick={() => { editComment() }} style={{ marginTop: '10px' }}>Update</Button>
                                    <Button onClick={() => { deleteComment() }} style={{ marginTop: '10px', marginLeft: '10px' }}>Delete</Button>
                                </div>
                                </div>}
                            {myComment === null && <div>
                                <Typography.Title level={4} style={{ color: '#DCE3EF', marginTop: '30px' }}>Add My Review</Typography.Title>
                                <Input.TextArea rows={4} onChange={(e) => { setNewComment(e.target.value) }} />
                                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <Button onClick={() => { addComment() }} style={{ marginTop: '10px' }}>Submit</Button>
                                </div>
                            </div>}
                        </div>}

                </Col>
                <Col span={11}>
                    <Typography.Title level={2} style={{ color: '#DCE3EF', marginBottom: '20px' }}>Comments</Typography.Title>
                    <List
                        itemLayout="horizontal"
                        dataSource={comments === null ? [{}, {}, {}] : comments}
                        size='large'
                        split={false}
                        renderItem={(item, index) => (
                            <Skeleton loading={comments === null} active style={{ marginBottom: '30px' }}>
                                <List.Item>
                                    <List.Item.Meta
                                        avatar={<Avatar src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${index}`} />}
                                        title={<a href={true}>{item[0]}</a>}
                                        description={item[2]}
                                    />
                                </List.Item>
                            </Skeleton>
                        )}
                    />
                </Col>
            </Row>
        </div>
    );
};

export default Detail;
