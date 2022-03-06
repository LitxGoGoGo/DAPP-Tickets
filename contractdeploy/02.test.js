//由于现在是在node端使用脚本测试合约，所以不需要有ajax，所以我们需要连接redis服务器
const redis = require("./modules/ioredis")
//把web3获取，用于构造合约对象
const web3 = require("./modules/web3")

function sleep(ms) {
    return new Promise( resolve=>{
        setTimeout(()=>{
            resolve() 
        },ms)
    } )
}



;(async ()=>{
    
    const accounts = await web3.eth.getAccounts() 
    //由于很多地方都需要使用交易，因此可以定义一个交易的对象
    const tx = {
            from:accounts[0],
            gas:6000000
    }
    //获取redis的合约内容
    const key = "contract:Tickets"
    const contractInfo = await redis.hgetall(key) 
    //console.log("redis中的地址:", contractInfo.address)
    //console.log("redis中的abi:", contractInfo.abi) 
    const abi = JSON.parse(contractInfo.abi) 

    //构造合约
    const contract = new web3.eth.Contract(abi,contractInfo.address) 

    const randData = [] 
    for(let i=1;i<=6;i++) {
        await sleep(1000) 
        let num = await contract.methods.rand(100 + i).call() 
        randData.push( parseInt(num)+100)
    }
    //这段代码保证了彩票池中的号码绝对不重复
    const result = randData.sort((a,b)=>a-b).reduce( (res,item)=>{
        if(res.length===0 || res[res.length-1]!==item) {
            res.push(item)
        }
        return res 
     },[]) 

    //生成彩票池
    await contract.methods.setNumbers(result).send(tx) 
    //获取彩票池
    const numbersData = await contract.methods.getNumbers().call() 

    console.log(numbersData) 

})()