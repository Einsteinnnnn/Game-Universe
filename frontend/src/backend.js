
import axios from 'axios';
import config from './config';

class Backend {
    constructor() {
        this.baseUrl = config.backendUrl;
    }

    get(path, data, callback) {
        if (data === undefined) {
            data = {};
        }
        axios.get(path, { params: { ...data } })
            .then(function (response) {
                if (callback) {
                    callback(response.data);
                }
            })
            .catch(function (error) {
                console.log(`GET request to ${path} with data ${data} receives error: `, error);
            });
    }

    post(path, data, callback) {
        axios.post(path, { ...data })
            .then(function (response) {
                if (callback) {
                    callback(response.data);
                }
            })
            .catch(function (error) {
                console.log(`POST request to ${path} with data ${data} receives error: `, error);
            });
    }

    request(api, data, callback) {
        let path = this.baseUrl + api.url;
        if (api.method === 'get') {
            this.get(path, data, callback);
        } else if (api.method === 'post') {
            this.post(path, data, callback);
        }
    }

}

const backend = new Backend();
export default backend;