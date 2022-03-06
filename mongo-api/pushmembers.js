const mongoose = require('./modules/mongoose')

const membersSchema = new mongoose.Schema({
  usename:String,
  password:String,
  eoa:String
})
const members = mongoose.model('members',membersSchema)

members.create({
  usename:'17802005585',
  password:'Litx3nhj',
  eoa:'0x820635792cc904D4fD5AFe95667c15fBc95ae925'
},(err) => {
  if(!err){
    console.log('插入成功')
  }
})