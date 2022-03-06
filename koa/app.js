//koa服务器的基本配置
//需要引入的npm包为koa,koa-cors,koa-router
const Koa = require('koa')
const Router = require('koa-router')()
const cors = require('koa-cors') //用于解决跨域问题
//创建Koa的实例app
const app = new Koa
// 本服务器监听的端口
const port = 8686
//跨域设置必须写在路由前面应用于之后所有的程序执行
app.use(cors())
//实例监听端口8686
app.listen(port,()=>{
  console.log('koa-serve start:', + port)
})
//配置子路由的路径
Router.use('/contract',require('./routers/contract_sub'))

//配置过的路由在实例上进行使用
app.use(Router.routes())