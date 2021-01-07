/**
 * 基于 axios 封装的请求模块
 */

import axios from 'axios'

// 创建请求对象
export const request = axios.create({
  baseURL: 'https://conduit.productionready.io'
})

// 通过插件机制获取到上下文对象（query, params, req, res, app, store）
// 插件导出函数必须作为 default 成员
export default context => {
  // console.log(context)
  const { store } = context
  // 请求拦截器
  request.interceptors.request.use(
    config => {
      // do something before request is sent
      const { user } = store.state
      if (user && user.token) {
        config.headers['Authorization'] = `Token ${user.token}`
      }
    
      // 返回 config 请求配置对象
      return config
    },
    error => {
      // 如果请求失败，此时请求还没发出去，就会进入这里
      // do something with request error
      console.log(error) // for debug
      return Promise.reject(error)
    }
  )

  // 响应拦截器

}
