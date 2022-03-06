//登录验证和注册验证走members路由,在这配置连接mongodb
const sub = require('koa-router')()
const mongoose = require('../modules/mongoose')


//配置注册接口

//1.先查询手机号是否被注册
sub.get("/phoneExists",async (ctx)=>{

  const phoneNumber = ctx.query.username

  const res = await mongoose.Tables.members.findOne({username:phoneNumber}) 

  console.log(res) 

  if(res) {
      ctx.body = {
          error:0,
          message:"用户名已存在",
          data:res
      }
  }else{
      ctx.body = {
          error:0,
          message:"当前用户能注册",
          data:[]
      }
  }

} )

//配置注册接口
sub.post('/register',async (ctx) => {
  //拿到网页传来的信息
  const phoneNumber = ctx.request.fields.username
  const password = ctx.request.fields.password
  const eoa = ctx.request.fields.eoa
  const res = await mongoose.Tables.members.findOne({username:phoneNumber})
  //找不到就能进行注册
  if (!res) {
    const result = await mongoose.Tables.members.create({
      username:phoneNumber,
      password:password,
      eoa:eoa
    })
    if (result._id) {
      ctx.body = {
        error:0,
        message:'恭喜你注册成功',
        data:result
      }
    }else{
      ctx.body ={
        error:101,
        message:'抱歉注册失败',
        data:[]
      }
    }
    console.log(result)
  }
})

//配置登录接口
sub.post('/login',async (ctx) => {
  const phoneNumber = ctx.request.fields.username
  const password = ctx.request.fields.password
  const eoa = ctx.request.fields.eoa
  const res = await mongoose.Tables.members.findOne({username:phoneNumber})
  console.log(res)
  //找不到res为null
  if (res === null) {
    ctx.body = {
      error:101,
      message:'登录失败,当前用户不存在',
      data:[]
    }
  }else{
    if (res.password !== password) {
      ctx.body = {
        error:102,
        message:'登录失败,密码错误',
        data:[]
      }
    }else{
      if (res.eoa !== eoa) {
        ctx.body = {
          error:103,
          message:'登录失败,eoa账户不匹配',
          data:[]
        }
      }else{

        ctx.body = {
          error:0,
          message:'登录成功,即将跳转开奖页面',
          data:{
            username:res.username,
            eoa:res.eoa
          }
        }
      }
    }
  }
})

//配置购买记录录入接口
sub.post('/buy',async (ctx) => {
  //从页面获取来的信息
  const {number,round,phone,eoa,wei} = ctx.request.fields
  const res = await mongoose.Tables.products.create({number,round,phone,eoa,wei})
  if (res._id) {
    ctx.body = {
      error:0,
      message:'恭喜你投注成功',
      data:res
    }
  }else{
    ctx.body = {
      error:201,
      message:'投注失败',
      data:[]
    }
  }
})

//配置购买记录查询接口
sub.post('/products',async ctx =>{
  //结构函数拿到当前浏览器端传来的eoa地址
  const {eoa} = ctx.request.fields
  //从mongodb中查询到的所有结果放入res中
  res = await mongoose.Tables.products.find({eoa})
  ctx.body = {
    error:0,
    message:'查询成功',
    data:res
  }
})





//对外暴露路由
module.exports = sub.routes()