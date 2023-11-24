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