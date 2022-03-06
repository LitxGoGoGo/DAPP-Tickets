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

    console.log("彩民zs:",accounts[1]);
    console.log("彩民ls:",accounts[2]);
    console.log("彩民ww:",accounts[3]);
    console.log("彩民zl:",accounts[4]);
    console.log("彩民bqt:",accounts[5]);
    console.log("彩民gsc:",accounts[6]);

    //获取彩票池
    const numberData = await contract.methods.getNumbers().call() 
    console.log("彩票号码是:",numberData) 


    //zs购买
    tx.from = zs 
    await contract.methods.buyTicket(0).send(tx) 

    //ls购买
    tx.from = ls
    await contract.methods.buyTicket(1).send(tx) 

    //ww购买
    tx.from = ww
    await contract.methods.buyTicket(2).send(tx) 

    //zl购买
    tx.from = zl
    await contract.methods.buyTicket(3).send(tx) 

    //bqt购买
    tx.from = bqt
    await contract.methods.buyTicket(4).send(tx) 


    //bqt购买
    tx.from = gsc
    await contract.methods.buyTicket(5).send(tx) 

    //查询确认池
    const currentIndexesData =  await contract.methods.getCurrentIndexes().call() 
    console.log("确认池中的数据:",currentIndexesData)


    
})()