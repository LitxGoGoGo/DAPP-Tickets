//配置koa服务器
const Koa = require('koa')
const Static = require('koa-static')
const body = require('koa-better-body')
const convert = require("koa-convert")
const Router = require("koa-router")()
const path = require("path") 
const render = require('koa-art-template')
const session = require("koa-session") 
const cors = require('koa-cors') 

const app = new Koa()
const port = 9999
app.listen(port,()=>{
  console.log(`koa服务器端口${port}开启成功`)
})
//使用跨域
app.use(cors())

app.keys = ['dfjalsdfjlubo345394834095&*^%$$q4xcsd']

app.use(session({
  maxAge:86400000
},app))

//处理post请求
app.use(convert(body({

})))

render(app, {
  root: path.join(__dirname, 'templates'),
  extname: '.html',
  debug: process.env.NODE_ENV !== 'production'
})

//配置子路由
Router.use('/members',require('./routers/members_sub'))

//使用配置过的路由
app.use(Router.routes())

//监听静态资源部分
app.use(Static('./statics'))