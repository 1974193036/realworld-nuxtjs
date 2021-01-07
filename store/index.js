/**
 * Nuxt内部集成了Vuex
 */

const cookieparser = process.server ? require('cookieparser') : undefined

// 在服务端渲染期间运行都是同一个实例
// 为了防止数据冲突，务必要把 state 定义成一个函数，返回数据对象
export const state = () => {
  return {
    // 当前登录用户的登录状态
    user: null
  }
}

export const mutations = {
  setUser(state, user) {
    state.user = user
  }
}

export const actions = {
  // nuxtServerInit：是一个特殊的 action 方法
  // 这个 action 会在服务端渲染期间自动调用（刷新页面的时候调用这个方法）
  // 作用：初始化容器数据，传递给客户端使用，为了防止刷新页面数据丢失，把登录状态存储到Vuex中
  nuxtServerInit ({ commit }, { req }) {
    // console.log('nuxtServerInit')
    let user = null
    if (req.headers.cookie) {
      // 使用 cookieparser 把 cookie 字符串转换为对象
      const parsed = cookieparser.parse(req.headers.cookie)
      try {
        user = JSON.parse(parsed.user)
      } catch (err) {
        // No valid cookie found
      }
    }
    commit('setUser', user)
  }
}
