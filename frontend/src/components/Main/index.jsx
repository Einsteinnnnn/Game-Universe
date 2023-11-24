import React from 'react';
import './index.css';
import Header from '../Header';
import Login from '../Login';
import Register from '../Register';
import Home from '../Home';
import Search from '../Search';
import Favorite from '../Favorite';
import { Typography } from 'antd';
import Detail from '../Detail';
import backend from '../../backend';
import apis from '../../api';

function Main() {

    const [currentPage, setCurrentPage] = React.useState('home');
    const [user, setUser] = React.useState(null);

    React.useEffect(() => {
        backend.request(apis.userInfo, {}, (response) => {
            if (response.status === 'ok') {
                var userData = {
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
            {currentPage === 'login' && <Login currentPage={currentPage} setCurrentPage={setCurrentPage} user={user}/>}
            {currentPage === 'register' && <Register currentPage={currentPage} setCurrentPage={setCurrentPage} user={user}/>}
            {currentPage !== 'login' && currentPage !== 'register' && <>
                <Header currentPage={currentPage} setCurrentPage={setCurrentPage} user={user}/>
            </>}
            {currentPage === 'home' && <Home currentPage={currentPage} setCurrentPage={setCurrentPage} user={user}/>}
            {currentPage === 'search' && <Search currentPage={currentPage} setCurrentPage={setCurrentPage} user={user}/>}
            {currentPage === 'favorite' && <Favorite currentPage={currentPage} setCurrentPage={setCurrentPage} user={user}/>}
            {currentPage === 'detail' && <Detail currentPage={currentPage} setCurrentPage={setCurrentPage} user={user}/>}
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
