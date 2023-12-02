import { message } from "antd";

export const handleResponse = (response) => {
    if (response.status !== 'ok') {
        message.error({
            key: 'globalmessage',
            content: response.message,
        });
        return false;
    } else {
        return true;
    }
}

export const loading = () => {
    message.loading({
        key: 'globalmessage',
        content: 'Please wait...',
    });
}

export const success = (m) => {
    message.success({
        key: 'globalmessage',
        content: m,
    });
}

export const processSearchResult = (data) => {
    const processedResult = data.map(item => {
        return {
            gameid: item[0],
            title: item[2],
            description: 'Released on: ' + item[4],
            content: item[24],
            img: item[30],
            recommendations: item[11],
        };
    });
    return processedResult;
}