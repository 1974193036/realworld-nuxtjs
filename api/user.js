import { request } from '@/plugins/request'

// 用户登录
// 帐号：1974193036@qq.com
// 密码：dcl123456
export const login = data => {
  return request({
    method: 'POST',
    url: '/api/users/login',
    data: data
  })
}

// 用户注册
export const register = data => {
  return request({
    method: 'POST',
    url: '/api/users',
    data: data
  })
}