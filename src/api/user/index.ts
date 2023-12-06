//配置登录请求
import request from "@/util/request";
enum API {
    LOGIN_URL = '/login',
    SIGNUP_URL = '/user/register',
    GETACCESS_URL = '/visitor',
    GETUSERINFO_URL = '/user/',
    UPDATEINFO_URL = '/user',
    POSTFOLLOW_URL = '/static/fans',
    GETFOLLOW_URL = '/static/myLove',
    ASSIGNROLE_URL = '/role/'

}
export const reqLogin = (data: any) => { return request.post(API.LOGIN_URL, data) }
export const reqRegister = (data: any) => { return request.post(API.SIGNUP_URL, data) }
// 获取访问者的信息
export const reqVistor = (userId: number) => { return request.get(API.GETACCESS_URL + '/' + userId) }
// 访问别人
export const reqPostVistor = (userId: number) => { return request.post(API.GETACCESS_URL + '/' + userId) }
export const reqUserInfo = (userId: number) => { return request.get(API.GETUSERINFO_URL + userId) }
export const reqUpdateUserInfo = (userInfo) => { return request.put(API.UPDATEINFO_URL, userInfo) }
// 新增关注
export const reqAddFollow = (userId: number, flag: boolean) => { return request.post(API.POSTFOLLOW_URL + '?' + `loveId=${userId}&flag=${flag}`) }
// 获取关注列表
export const reqFollowList = () => { return request.get(API.GETFOLLOW_URL) }
// 给某个用户分配角色 传递角色ID 1==admin 4==designer 5==commonUser
export const reqAssignRole = (RoleId: number) => { return request.put(API.ASSIGNROLE_URL + RoleId) }