//由于现在是在node端使用脚本测试合约，所以不需要有ajax，所以我们需要连接redis服务器
const redis = require("./modules/ioredis")
//把web3获取，用于构造合约对象
const web3 = require("./modules/web3")

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
    //console.log(contract)
    //获取庄家的信息
    const minter = await  contract.methods.minter().call()
    console.log("庄家是:",minter) 
    //修改庄家的账号为0x739F2F3924Fb87cCcc8f9A6Cd7648C909066F523
    await contract.methods.setMasterAccount(accounts[9]).send(tx)
    //修改成功后获取庄家账户
    const masterAccount = await contract.methods.masterAccount().call()  
    console.log("庄家账号是:",masterAccount) 
})()