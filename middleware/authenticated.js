/**
 * 中间件允许您定义一个自定义函数运行在一个页面或一组页面渲染之前
 * 每一个中间件应放置在 middleware/ 目录。文件名的名称将成为中间件名称 (如middleware/auth.js将成为 auth 中间件)
 * 使用中间件的目的是：兼容客户端和服务端渲染
 * 
 * 可以在指定页面中使用
 * middleware: 'authenticated'，多个中间件使用：middleware: [xx1, xx2]
 */

// 验证是否登录的中间件
export default function ({ store, redirect }) {
  // If the user is not authenticated
  if (!store.state.user) {
    return redirect('/login')
  }
}
