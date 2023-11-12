import request from '../utils/request';
import { getBaseURL, get, post, deletes, postFormData } from "../api/requests";
export const fetchData = (param) => {
    return request({
        url: './table.json',
        method: 'get'
        params: params,
    });
};
const HttpManager = {
    testHttpPost2: (params:any) => postFormData('/MSHD/track/createTrack', params),//文件上传接口
    testHttpPost1: (params:any) =>postFormData('/MSHD/track/createTrack', params),//表单上传接口
    testHttpPost_postTrack: (params:any) => postFormData('/MSHD/track/createTrack', params),
    
  
};
export { HttpManager };