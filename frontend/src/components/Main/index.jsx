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

function Main() {

    const [currentPage, setCurrentPage] = React.useState('home');

    return (
        <div>
            {currentPage === 'login' && <Login currentPage={currentPage} setCurrentPage={setCurrentPage} />}
            {currentPage === 'register' && <Register currentPage={currentPage} setCurrentPage={setCurrentPage} />}
            {currentPage !== 'login' && currentPage !== 'register' && <>
                <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />
            </>}
            {currentPage === 'home' && <Home currentPage={currentPage} setCurrentPage={setCurrentPage} />}
            {currentPage === 'search' && <Search currentPage={currentPage} setCurrentPage={setCurrentPage} />}
            {currentPage === 'favorite' && <Favorite currentPage={currentPage} setCurrentPage={setCurrentPage} />}
            {currentPage === 'detail' && <Detail currentPage={currentPage} setCurrentPage={setCurrentPage} />}
            {currentPage !== 'login' && currentPage !== 'register' && <>
                <div className='Footer'>
                    <div style={{ paddingTop:'30px', paddingBottom:'30px', textAlign:'center'}}>
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
