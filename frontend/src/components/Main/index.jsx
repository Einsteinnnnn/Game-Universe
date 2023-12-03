import React from 'react';
import './index.css';
import Header from '../Header';
import Login from '../Login';
import Register from '../Register';
import Home from '../Home';
import Search from '../Search';
import Favorite from '../Favorite';
import Account from '../Account';
import { Typography } from 'antd';
import Detail from '../Detail';
import backend from '../../backend';
import apis from '../../api';

function Main() {

    const [currentPage, _setCurrentPage] = React.useState('home');
    const [user, setUser] = React.useState(null);
    const [searchResult, setSearchResult] = React.useState([]);
    const [searchKeyword, setSearchKeyword] = React.useState('');
    const [detailGame, setDetailGame] = React.useState(null);

    const setCurrentPage = (page) => {
        window.scrollTo(0, 0);
        _setCurrentPage(page);
    }

    React.useEffect(() => {
        backend.request(apis.userInfo, {}, (response) => {
            if (response.status === 'ok') {
                var userData = {
                    uid: response.data[0][0],
                    username: response.data[0][1],
                    password: response.data[0][2],
                    email: response.data[0][3],
                    phone: response.data[0][4],
                }
                setUser(userData);
            }
        })
    }, []);


    return (
        <div>
            <div style={{ minHeight: '100%' }}>
                {currentPage === 'login' && <Login currentPage={currentPage} setCurrentPage={setCurrentPage} user={user} />}
                {currentPage === 'register' && <Register currentPage={currentPage} setCurrentPage={setCurrentPage} user={user} />}
                {currentPage !== 'login' && currentPage !== 'register' && <>
                    <Header currentPage={currentPage} setCurrentPage={setCurrentPage} user={user} />
                </>}
                {currentPage === 'home' && <Home currentPage={currentPage} setCurrentPage={setCurrentPage} user={user} setSearchResult={setSearchResult} setSearchKeyword={setSearchKeyword} setDetailGame={setDetailGame}/>}
                {currentPage === 'search' && <Search currentPage={currentPage} setCurrentPage={setCurrentPage} user={user} searchResult={searchResult} setSearchResult={setSearchResult} searchKeyword={searchKeyword} setSearchKeyword={setSearchKeyword}  setDetailGame={setDetailGame}/>}
                {currentPage === 'account' && <Account currentPage={currentPage} setCurrentPage={setCurrentPage} user={user} />}
                {currentPage === 'favorite' && <Favorite currentPage={currentPage} setCurrentPage={setCurrentPage} user={user} setDetailGame={setDetailGame}/>}
                {currentPage === 'detail' && <Detail currentPage={currentPage} setCurrentPage={setCurrentPage} user={user} detailGame={detailGame}/>}
            </div>

            {currentPage !== 'login' && currentPage !== 'register' && <>
                <div className='Footer'>
                    <div style={{ paddingTop: '30px', paddingBottom: '30px', textAlign: 'center' }}>
                        <Typography.Text>
                            CopyRight © 2023 GameUniverse, All Rights Reserved.
                        </Typography.Text>
                    </div>
                </div>
            </>}
        </div>
    );
}

export default Main;
