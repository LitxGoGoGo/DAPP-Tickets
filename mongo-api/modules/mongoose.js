const mongoose = require('mongoose')
//连接到数据库tickets
mongoose.connect('mongodb://localhost:27017/tickets',{ useUnifiedTopology: true,useNewUrlParser: true })

//检查当前的数据库连接是否成功
mongoose.connection.once("open",(err)=>{
    if(!err) {
        console.log("mongodb连接成功") 
    }
})

// 在数据库tickets中创建两张表members和products,并且定义schema

const membersSchema = new mongoose.Schema({
  username:String,
  password:String,
  eoa:String
})
const members = mongoose.model('members',membersSchema)

const productsSchema = new mongoose.Schema({
  number:String,
  round:Number,
  phone:String,
  eoa:String,
  wei:String 
})
const products = mongoose.model('products',productsSchema)

mongoose.Tables = {members,products}

// 对外暴露
module.exports = mongoose