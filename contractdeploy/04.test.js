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
            gas:6000000,
            value:web3.utils.toWei("1") //msg.value 
    }
    //获取redis的合约内容
    const key = "contract:Tickets"
    const contractInfo = await redis.hgetall(key) 
    //console.log("redis中的地址:", contractInfo.address)
    //console.log("redis中的abi:", contractInfo.abi) 
    const abi = JSON.parse(contractInfo.abi) 

    //构造合约
    const contract = new web3.eth.Contract(abi,contractInfo.address) 

    // zs购买彩票
    const zs = accounts[1];
    const ls = accounts[2];
    const ww = accounts[3];
    const zl = accounts[4];
    const bqt = accounts[5];
    const gsc = accounts[6];

    const zsBalance = await web3.eth.getBalance(zs)
    console.log( "zs of Balance:" ,  web3.utils.fromWei(zsBalance) ) 


    const lsBalance = await web3.eth.getBalance(ls)
    console.log( "ls of Balance:" ,  web3.utils.fromWei(lsBalance) ) 

    
    const wwBalance = await web3.eth.getBalance(ww)
    console.log( "ww of Balance:" ,  web3.utils.fromWei(wwBalance) ) 

    const zlBalance = await web3.eth.getBalance(zl)
    console.log( "zl of Balance:" ,  web3.utils.fromWei(zlBalance) ) 

    const bqtBalance = await web3.eth.getBalance(bqt)
    console.log( "bqt of Balance:" ,  web3.utils.fromWei(bqtBalance) ) 

    const gscBalance = await web3.eth.getBalance(gsc)
    console.log( "gsc of Balance:" ,  web3.utils.fromWei(gscBalance) ) 



    //获取合约有多少钱
    const contractOfBalance = await contract.methods.getContractBalance().call() 
    console.log( "Contract of Balance:" ,  web3.utils.fromWei(contractOfBalance) )

    //当前共有多少彩民参与
    const total = await contract.methods.getCurrentPlayersTotal().call() 
    console.log( "Total:" ,  total )




})()