//该路由采用get请求拿到参数,需要和ioredis进行通讯,并且拿到内容展示到页面上
//采用自己配置的ioredis入口进行引入
//引入koa-router包并且调用
const sub = require('koa-router')()
//引入redis
const redis = require('../modules/ioredis')

//配置路由
sub.get("/",async(ctx)=>{
  //获取get参数
  let contractName = ctx.query.contract
  if(!contractName){
    ctx.body = {
      error:'101',
      message:'合约参数不能为空',
      data:[]
    }
  }else{
    //进入ioredis中获取对应的内容
    // ioredis中的数据结构为contract:'contractName'
    const theHashKeyValue = `contract:${contractName}`
    //通过existsState判断当前合约是否部署
    const existsState = await redis.exists(theHashKeyValue)
    if(!existsState){
      ctx.body = {
        error:'102',
        message:'当前合约不存在无法获取合约内容',
        data:[]
      }
    }else{
      //从ioredis中获取合约对象
      const contractInstance = await redis.hgetall(theHashKeyValue)
      ctx.body = {
        error:'0',
        message:`获取合约${contractName}内容成功`,
        data:contractInstance
      }
    }
  }
})

//暴露路由
module.exports = sub.routes()