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
    fetchInfoData: (params:any) => postFormData('/mshd/disaster/fetchInfoData', params),//查询表单数据接口
    tryLogin: (params:any) => postFormData('/mshd/user/login', params),//登录接口
    tryRegister: (params:any) => postFormData('/mshd/user/register', params),//注册接口
    tryChangePassword: (params:any) => postFormData('/mshd/user/changePassword', params),//修改密码接口
    tryLogoff: (params:any) => postFormData('/mshd/user/logoff', params),//注销接口
};
export { HttpManager };