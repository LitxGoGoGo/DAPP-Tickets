//args[0] 是合约的名称 Voting ===> constracts/Voting.sol 
//args[1] -f 表示强制编译当前合约,如果没有改参数则不会重复编译合约

const args = process.argv.slice(2) //获取命令行中所有的脚本参数

if( args.length===0 ) {
    console.log("必须传入命令行参数")
    return
}

let prameters = [] 
let tmp = []
if(args[1]==="-f") {
    if(args[2]==="-n"){
        tmp = args.slice(3) //获取了-n后的所有参数
    }
}else if(args[1]==="-n"){
    tmp = args.slice(2) //获取了-n后的所有参数
}

for(let item of tmp) {
	if( item.indexOf("[")!==-1 && item.indexOf("]")!==-1 ){
		item = item.replace( new RegExp("'","gm"),'"' ) 
		prameters.push(JSON.parse(item))
	}else{
		//prameters.push( parseInt(item) ) 
		prameters.push(item) 
	}

}
console.log("构造函数参数内容:",prameters )

//return 

//引入solcjs
const solcjs = require("solc") 
const path = require("path")
const fs = require("fs")
//引入ioredis
const redis = require("./modules/ioredis") 

//定义合约名称
const ContractName = args[0]
//定义redis-hash的key名
const hashKey = `contract:${ContractName}` // node deployContracts.js Tickets  contract:Tickets


;(async ()=>{
    //先判断当前合约是否已经编译过
    const exists = await redis.exists(hashKey)

    if(exists===1 && args[1]!=="-f") {
        console.log("此合约已经编译过了，无需重新编译")
        process.exit() //退出
    }

    console.log("合约开始编译...")
 
    //创建一个hash对象
    const hashContract = {
        abi:"",
        byteCode:""
    }

    //创建合约地址的绝对路径
    const contractPath = path.resolve(`./contracts/${ContractName}.sol`) 

    console.log("合约存放的位置:",contractPath) 

    //获取合约中的内容
    let solidity = fs.readFileSync( contractPath )
    //把solidity的字节转为string
    solidity  = solidity.toString()


    //使用solcjs来进行，编译abi,相当于: solcjs --abi 合约绝对路径
    const result = solcjs.compile(solidity)  
    ////更新合约哈希对象,获取abi的json字符串
    hashContract["abi"] = result.contracts[`:${ContractName}`].interface 
    ////更新合约哈希对象,使用solcjs来进行，编译byteCode,相当于: solcjs --bin 合约绝对路径
    hashContract["byteCode"] = "0x" + result.contracts[`:${ContractName}`].bytecode 

    const res = await redis.hmset(hashKey,hashContract)
    if(res==="OK") {
        console.log("合约编译成功，开始部署合约...")
        //获取web对象
        const web3 = require("./modules/web3") 
        //获取用户
        const accounts = await web3.eth.getAccounts()
        //定义合约的部署者
        const minter = accounts[0]
        //合约的部署者信息
        console.log("合约的部署者账户(msg.sender):",minter) 
        //创建Abi对象:注意我们自己的编译的abi是json字符串，不是对象，所以要反序列化
        const abiObject = JSON.parse(result.contracts[`:${ContractName}`].interface)
        const abiInstance = new web3.eth.Contract(abiObject) 
        //使用abi对象获取部署对象：处于待部署状态
        const deployer = await abiInstance.deploy({
            data:"0x" + result.contracts[`:${ContractName}`].bytecode,
            value:0,
            arguments:prameters
			
        })
        //发送交易进行部署上链
        const _contractInstance = await deployer.send({
            from:minter,
            gas:6000000,
        })
        //打印部署合约信息
        if(_contractInstance.options.address){
        
            //把合约地址写入到redis中
            await redis.hset(hashKey,{address:_contractInstance.options.address}) 
            console.log("部署成功,合约地址:",_contractInstance.options.address)  
        }else{
            console.log("合约地址部署失败:",_contractInstance)  
        }
    }else{
        console.log("编译失败")
       
    }

    process.exit() //退出
})()






















