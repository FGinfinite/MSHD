import request from '../utils/request';
import { getBaseURL, get, post, deletes, postFormData } from "../api/requests";
export const fetchData = () => {
    return request({
        url: './table.json',
        method: 'get'
    });
};
const HttpManager = {
    testHttpPost2: (params:any) => post('/MAHD/user/register', JSON.stringify(params)),
    testHttpPost1: (params:any) => post('/MSHD/user/login', JSON.stringify(params)),
    // testHttpPost2: (params) => post('/remix/user/addUser', params),
    testHttpPost_postTrack: (params:any) => postFormData('/MSHD/track/createTrack', params),
  
};
export { HttpManager };