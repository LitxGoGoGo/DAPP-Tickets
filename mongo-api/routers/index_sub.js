const sub = require("koa-router")() 
const mongoose = require("../modules/mongoose")



sub.get("/",async (ctx)=>{
    const res = await mongoose.Tables.members.find( {} ) 

    ctx.body = res 

} )



module.exports = sub.routes() 