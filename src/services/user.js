import request from '@/utils/request'
import qs from 'qs'

// 用户登录接口
export const login = data => {
  return request({
    url: '/front/user/login',
    method: 'POST',
    // headers: { 'content-type': 'application/x-www-form-urlencoded' },
    // urlencode 格式： 名 = 值&名 = 值
    data: qs.stringify(data)
  })
}
// 用户基本信息接口
export const getUserInfo = () => {
  // console.log('store.state.user.access_token', store.state.user.access_token)
  return request({
    url: '/front/user/getInfo',
    method: 'GET'
  })
}
