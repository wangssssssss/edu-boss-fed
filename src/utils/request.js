import axios from 'axios'
// 引入 vuex 的数据
import store from '@/store'
// 通过局部引入的方式引入 Element 的 Message 组件功能
import { Message } from 'element-ui'
// 引入 router
import router from '@/router'
// 引入 qs 用于请求参数处理
import qs from 'qs'

// create 创建 axios 实例
const request = axios.create({

})
function getBaseURL (url) {
  if (url.startsWith('/boss')) {
    return 'http://eduboss.lagou.com'
  } else {
    return 'http://edufront.lagou.com'
  }
}
// 请求拦截器
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

// 跳转到登录页
function redirectLogin () {
  router.push({
    name: 'login',
    query: {
      // currentRoute就是存储了路由信息的对象
      redirect: router.currentRoute.fullPath
    }
  })
}
// 存储是否正在更新 token 的状态
let isRefreshing = false
// 存储因为等到 token 刷新而挂起的请求
let requests = []
// 响应拦截器
request.interceptors.response.use(function (response) {
  // 状态码为 2xx 会执行
  console.log('响应成功了', response)
  return response
}, function (err) {
  if (err.response) {
    // 请求发送成功，响应接收完毕，但状态码为失败的情况
    // 1.判断失败的状态码的情况（主要处理401的情况）
    const { status } = err.response
    let errorMessage = ''
    if (status === 400) {
      errorMessage = '请求参数错误'
    } else if (status === 401) {
      // 1.无 Token 信息
      if (!store.state.user) {
        redirectLogin()
        return Promise.reject(err)
      }

      // 检测是否已经存在了正在刷新 Token 的请求
      if (isRefreshing) {
        // 将当前失败的请求，存储到请求列表中
        return requests.push(() => {
          // 当前函数调用后，会自动发送本次失败的请求
          request(err.config)
        })
      }
      isRefreshing = true
      // 2.Token 无效（错误Token，过期Token）
      // 发送请求获取新的 access_token
      return request({
        url: '/front/user/refresh_token',
        method: 'POST',
        data: qs.stringify({
          refreshtoken: store.state.user.refresh_token
        })
      }).then((res) => {
        console.log('res', res)
        // token 刷新失败
        if (res.data.state !== 1) {
          // 清除无效的用户信息
          store.commit('setUser', null)
          redirectLogin()
          return Promise.reject(err)
        }
        // 刷新 token 成功
        // 存储新的 token
        store.commit('setUser', res.data.content)
        // 重新发送失败的请求(根据request_arr发送所有失败的请求)
        requests.forEach((item) => {
          item()
        })
        // 发送完毕清除request_arr内容
        requests = []
        // 将本次请求发送
        return request(err.config)
      }).catch((err) => {
        console.log('err', err)
      }).finally(() => {
        // 请求发送完毕，响应处理完毕，将刷新状态更改为 false
        isRefreshing = false
      })
    } else if (status === 403) {
      errorMessage = '没有权限，请联系管理员'
    } else if (status === 404) {
      errorMessage = '请求资源不存在'
    } else if (status >= 500) {
      errorMessage = '服务端错误，请联系管理员'
    }
    console.log(errorMessage)
    Message.error(errorMessage)
  } else if (err.request) {
    // 请求发送成功，但位收到响应
    Message.error('请求超时，请重试')
  } else {
    // 意料之外的错误
    Message.error(err.message)
  }
  // 将本次请求的错误继续向后抛出，让接收响应的处理函数进行操作
  return Promise.reject(err)
})
export default request
