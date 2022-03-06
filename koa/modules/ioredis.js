//配置连接ioredis的基础
const Redis = require('ioredis')

const redis = new Redis({
  host:'localhost',
  port:6379
})

//暴露配置
module.exports = redis