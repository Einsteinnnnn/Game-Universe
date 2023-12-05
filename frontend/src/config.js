export const env = 'dev';

const allConfig = {
    dev: {
        backendUrl: 'http://localhost:3000/api',
        enableMock: true,
    },
    staging: {
        backendUrl: 'http://127.0.0.1:5000/api',
        enableMock: false,
    },
    prod: {
        backendUrl: 'https://gameuniverse.site/api',
        enableMock: false,
    },
}

const config = allConfig[env];
export default config;