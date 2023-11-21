export const env = 'prod';

const allConfig = {
    dev: {
        backendUrl: 'http://localhost:3000/api',
        enableMock: true,
    },
    prod: {
        backendUrl: 'http://127.0.0.1:5000/api',
        enableMock: false,
    },
}

const config = allConfig[env];
export default config;