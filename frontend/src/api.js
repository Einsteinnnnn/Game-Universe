import mock from 'mockjs';
import backend from './backend';
import config from './config';

const enableMock = config.enableMock;

// an js object that defines all apis, its urls, methods, and mock rules
const apis = {
    login: {
        url: '/login',
        method: 'post',
        mock: {
            status: 'ok',
        },
        enableMock: false
    },
    logout: {
        url: '/logout',
        method: 'post',
        mock: {
            status: 'ok',
        },
        enableMock: false
    },
    userInfo: {
        url: '/user',
        method: 'get',
        mock: {
            status: 'ok',
            data: 'hha',
        },
        enableMock: false,
    },
    register: {
        url: '/register',
        method: 'post',
        mock: {
            status: 'ok',
        },
        enableMock: false,
    },
    basicSearch: {
        url: '/basic-search',
        method: 'get',
        mock: {
            status: 'ok',
            data: [],
        },
        enableMock: false,
    },
    advancedSearch: {
        url: '/advanced-search',
        method: 'post',
        mock: {
            status: 'ok',
            data: [],
        },
        enableMock: false,
    },
    getFavoriteGames: {
        url: '/favorite-games',
        method: 'get',
        mock: {
            status: 'ok',
            data: [],
        },
        enableMock: false,
    },
    addFavoriteGame: {
        url: '/favorite-games-add',
        method: 'post',
        mock: {
            status: 'ok',
        },
        enableMock: false,
    },
    deleteFavoriteGame: {
        url: '/favorite-games-delete',
        method: 'post',
        mock: {
            status: 'ok',
        },
        enableMock: false,
    },
}

if (enableMock) {
    for (let api in apis) {
        if (apis[api].enableMock && enableMock) {
            mock.mock(backend.baseUrl + apis[api].url, apis[api].method, apis[api].mock);
        }
    }
}

export default apis;