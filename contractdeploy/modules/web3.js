const Web3 = require("web3")
//获取web3的实例
const web3 = new Web3()  

//使用提供者的方式连接ganache-cli 
web3.setProvider("http://127.0.0.1:8545")


module.exports = web3 