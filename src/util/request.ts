//封装axios：使用请求与响应拦截器
import axios from 'axios'
import { ElMessage } from 'element-plus';
import { useCounterStore } from '@/stores/user'
import router from '@/router';
//引入用户仓库 获取用户TOKEN

//create 创建axios实例（配置基础路径、超时时间）
//axios.create方法可以创建一个自定义的实例，在这个实例中可以对axios的基础配置进行自定义配置，并且可以使用拦截器，返回的是自定义的Axios对象
//axios 方法 返回的是默认的全局Axios对象，事前已经对基础配置进行了配置，
let request = axios.create({
    //基础路径
    baseURL: import.meta.env.VITE_APP_BASE_API,//配置基础路径 导入开发环境变量

    //超时时间 5s
    timeout: 5000,
})
//request实例添加请求与响应拦截器
request.interceptors.request.use((config) => {
    //请求拦截器需要返回配置对象,配置对象内部存在headers属性，经常用于携带公共参数
    //config对象内部是基础的配置，例如超时时间，请求方式请求头等等
    //发送请求获取仓库对象
    const userStore = useCounterStore()
    config.headers.token = userStore.token //向服务端传递token请求头
    return config
});
//配置响应拦截器 存在两个会回调函数，分别是成功的回调与失败的回调
request.interceptors.response.use((response) => {
    //请求成功直接返回数据promise对象
    console.log(response);

    let data = response.data
    let msg = ''
    let status = response.status
    if (status == 401) {
        msg = 'token过期'
        router.push('/login')
    } else if (status == 403) {
        msg = '请重新登录'
        router.push('/login')
    } else if (status == 403) {
        msg = '没有权限访问'
    } else if (status == 500) {
        msg = '服务器丢失！'
    } else if (status == 200) {
        if (response.data.code == 403) {
            msg = '请重新登录'
            router.push('/login')
        } else {
            return data
        }

    } else {
        msg = '请求失败'
        console.log(msg);

    }
    ElMessage({
        type: 'warning',
        message: msg
    })

}, (error: any) => {
    //失败回调：处理http网络错误请求
    let msg = '';
    console.log(error);
    let status = error.response?.status
    if (status == 401) {
        msg = 'token过期'
        router.push('/login')
    } else if (status == 403) {
        msg = '没有权限访问'
    } else if (status == 403) {
        msg = '没有权限访问'
    } else if (status == 500) {
        msg = '服务器丢失！'
    } else {
        msg = '请求失败'
        console.log(msg);

    }
    ElMessage({
        type: 'error',
        message: msg
    })
    return Promise.reject(error)
})
export default request