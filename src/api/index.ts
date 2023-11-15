import request from '../utils/request';
import { getBaseURL, get, post, deletes, postFormData } from "../api/requests";
export const fetchData = (param: any) => {
    return request({
        url: './table.json',
        method: 'get',
        params: param,
    });
};
const HttpManager = {
    testHttpPost2: (params:any) => postFormData('mshd/disaster/createDisasterInformation', params),//文件上传接口
    testHttpPost1: (params:any) =>postFormData('/mshd/disaster/createDisasterId', params),//表单上传接口
    searchDisaster: (params:any) => postFormData('/mshd/disaster/searchDisaster', params),//查询表单数据接口
    fetchSourceInfoData: (params:any) => postFormData('/mshd/disaster/fetchSourceInfoData', params),//查询表单数据接口
  
};
export { HttpManager };