import axios from 'axios'
// 引入 vuex 的数据
import store from '@/store'

// create 创建 axios 实例
const request = axios.create({

})
function getBaseURL (url) {
  if (url.startsWith('/boss')) {
    return 'http://eduboss/lagou.com'
  } else {
    return 'http://edufront.lagou.com'
  }
}
request.interceptors.request.use(function (config) {
  // console.log(config)
  // 判断 config.url 的前缀，来进行请求 baseURL 的设置
  config.baseURL = getBaseURL(config.url)
  // 统一设置 token 信息
  const { user } = store.state
  if (user && user.access_token) {
    //  接口鉴权
    config.headers.Authorization = user.access_token
  }
  return config
})
export default request
