// 引入web3和axios来构建通讯,获取合约内容与合约的方法
import axios from 'axios'
import web3 from '../web3/index'

export default {
  //获取合约实例
  getInstance(){
    // 先在localStorage中判断是否存在合约缓存,存在则不用发送axios请求,可以直接用来构建合约
    if (window.localStorage.getItem('cached')) {
      return new Promise(resolve => {
        const tickets = JSON.parse(window.localStorage.getItem('cached'))
        const adr = tickets.address
        const _abi = JSON.parse(tickets.abi)
        resolve(new web3.eth.Contract(_abi,adr))
        //记住一定要new才能得到实例
      })
      }
      return axios.get('http://localhost:8686/contract?contract=Tickets').then((tickets) => {
      //拿到地址和abi
        const address = tickets.data.data.address
        const abi = JSON.parse(tickets.data.data.abi)
        //第一次请求回来的abi和adr写入到localStorage中保存状态
        return new Promise(resolve => {
          const cached = {
            address:address,
            abi:tickets.data.data.abi
          }
          window.localStorage.setItem('cached',JSON.stringify(cached))
          console.log('这是在获取合约地址和abi的ajiax请求')
          resolve(new web3.eth.Contract(abi,address))
        })
      })
  }
}