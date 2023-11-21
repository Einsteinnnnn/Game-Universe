import { message } from "antd";

export const handleResponse = (response) => {
    if (response.status !== 'ok') {
        message.error(response.message);
        return false;
    } else {
        return true;
    }
}