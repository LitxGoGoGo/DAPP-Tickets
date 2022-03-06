//该文件用于连接web3
import Web3 from 'web3'
//连接ganache-cli
const _web3 = new Web3()
_web3.setProvider('http://localhost:8545')

//对外暴露
export default _web3