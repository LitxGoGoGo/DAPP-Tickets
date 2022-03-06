<template>
  <div>
    <div v-if="histories.length === 0">当前没有任何开奖记录</div>
    <van-button v-if="isMinter" @click="openReward" class="btn" plain hairline type="primary" block>开奖</van-button>
    <div>
      <ul>
        <li v-for="(item,index) in histories" :key="index">
          <p>彩票期数:<span>{{item.round}}</span></p>
          <p>中奖号码:<span>{{item[2]}}</span></p>
          <p>中奖金额:<span>{{item[1] | transEth}}</span></p>
          <p>中奖账号:<span style="font-size:10px;">{{item[0]}}</span></p>
          <hr>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import web3 from '../web3'
import { Toast } from 'vant'
import contract from '../contract/index'
export default {
  name:'History',
  data() {
    return {
      isMinter:'',
      histories:[]
    }
  },
  //设置过滤器
  filters:{
    transEth(value){
        return web3.utils.fromWei(value) + "ether" 
    }
  },
  methods: {
    async openReward(){
      const ticketsContract = await contract.getInstance()
      const minterAddress = await ticketsContract.methods.minter().call()
      //定义交易对象,用于开奖后再次创建随机彩票池子的创建
      const tx = {
        from:minterAddress,
        gas:6000000
      }
      await ticketsContract.methods.reward().send({
        from:minterAddress,
        gas:6000000
      })
      //开奖后可进行下一期的彩票池设置
      //构建随机数组
      function sleep(ms) {
        return new Promise( resolve=>{
            setTimeout(()=>{
                resolve() 
            },ms)
        } )
      }
      const randData = [] 
      for(let i=1;i<=6;i++) {
        await sleep(1000) 
        let num = await ticketsContract.methods.rand(100 + i).call() 
        randData.push( parseInt(num)+100)
      }
      const result = randData.sort((a,b)=>a-b).reduce( (res,item)=>{
        if(res.length===0 || res[res.length-1]!==item) {
            res.push(item)
        }
        return res 
      },[]) 
      //生成彩票池,需要传入的参数为随机池子和部署的账户地址信息tx
      await ticketsContract.methods.setNumbers(result).send(tx)
      this.$router.push('/open')
    }
  },
  async mounted() {
    //判断eoa账户是否为庄家
    const ticketsContract = await contract.getInstance()
    //获取庄家地址
    const minterAddress = await ticketsContract.methods.minter().call()
    // 做出判断后给isMinter赋值
    const loginObject = JSON.parse(window.localStorage.getItem('login'))
    const {eoa} = loginObject
    if (eoa === minterAddress.toLowerCase()) {
      this.isMinter = true
    }else{
      this.isMinter = false
    }
    //获取当前期数
    const round = await ticketsContract.methods.round().call()
    //遍历每一期的数据并且推入histories
    for (let i = 1; i < round; i++) {
      const history = await ticketsContract.methods.getHistoryByRound(i).call()
      history.round = i
      if(parseInt(history[1])!==0 && parseInt(history[2])!==0){
        this.histories.push(history)
      }
    }
  },
}
</script>

<style scoped>
  ul,li {
    margin: 0;
    padding: 0;
    list-style-type: none;
    list-style: none;
  }
  span {
    color: red;
  } 
</style>