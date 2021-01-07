// Nuxt.js 配置文件

module.exports = {
  router: {
    base: '/',
    linkActiveClass: 'active',
    // 自定义路由规则
    extendRoutes(routes, resolve) {
      // console.log(routes)
      // 清除 Nuxt.js 基于 pages目录 默认生成的路由表规则
      routes.splice(0)
      routes.push(...[
        {
          path: '/',
          component: resolve(__dirname, 'pages/layout/index.vue'),
          children: [
            {
              path: '', // 默认子路由
              name: 'home',
              component: resolve(__dirname, 'pages/home/index.vue')
            },
            {
              path: '/login',
              name: 'login',
              component: resolve(__dirname, 'pages/login/index.vue')
            },
            {
              path: '/register',
              name: 'register',
              component: resolve(__dirname, 'pages/login/index.vue')
            },
            {
              path: '/profile/:username',
              name: 'profile',
              component: resolve(__dirname, 'pages/profile/index.vue')
            },
            {
              path: '/settings',
              name: 'settings',
              component: resolve(__dirname, 'pages/settings/index.vue')
            },
            {
              path: '/editor',
              name: 'editor',
              component: resolve(__dirname, 'pages/editor/index.vue')
            },
            {
              path: '/article/:slug',
              name: 'article',
              component: resolve(__dirname, 'pages/article/index.vue')
            }
          ]
        },
        {
          path: '*',
          name: 'custom',
          component: resolve(__dirname, 'pages/404.vue') // 页面找不到的时候，指向一个自定义的 404 页面
        }
      ])
    }
  },

  server: {
    host: '0.0.0.0', // 监听所有外网地址。在生产环境服务器上外网环境就能访问到了，在本地的话，局域网都能访问到了
    port: 3000
  },

  // 注册插件
  plugins: [
    '~plugins/request.js', // 波浪线开头表示从根路径出发
    '~plugins/day.js'
  ]
}