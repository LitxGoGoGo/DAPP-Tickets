<template>
  <div>
    <!-- 展示第几期的标题 -->
    <h2>欢迎来到幸运投注第{{round}}期</h2>
    <!-- 投注列表 -->
    <van-checkbox-group max="1" v-model="result">
      <van-cell-group>
        <van-cell
          v-for="(item) in options"
          :key="item.luckyIndex"
          :title="item.lunckyNumber"
        >
          <template #right-icon>
            <van-checkbox @click="checkbox()" :name="item" ref="checkboxes" :disabled="item.isSold" />
          </template>
        </van-cell>
      </van-cell-group>
    </van-checkbox-group>
    <!-- 分割线 -->
    <van-divider
      :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '0 16px' }"
    >
      赌博有风险,投注需谨慎
    </van-divider>
    <!-- 投注状态栏 -->
    <van-cell-group inset>
      <van-cell title="您的投注状态" :value="isJoin" />
    </van-cell-group>
    <!-- 投注按钮 -->
    <van-button @click="buy" type="primary" icon="gem-o" block>使用{{wei}}投注</van-button>
  </div>
</template>

<script>
import web3 from '../web3'
import contract from '../contract/index'
import axios from 'axios'
import { Toast } from 'vant'
export default {
  name:'Open',
  props:['active'],
  data() {
    return {
      options:[],
      result:[],
      confirmPool:[],
      round:'',
      wei:'',
      value:'',
      money:0,
      stateOfJoin:false
    }
  },
  computed: {
    isJoin(){
      if(this.stateOfJoin){
        return '已参与'
      }else{
        return '未参与'
      }
    }
  },
  methods: {
    checkbox(){
      //console.log(this.result[0].luckyIndex)
    },
    setValue(index){
      this.value = index
    },
    async buy(){
      //购买操作
      //判断在localStorage中是否有登录信息
      if (!window.localStorage.getItem('login')) {
        Toast('请登录后进行投注')
        setTimeout(() => {
          this.$router.push('/user')
        }, 2000);
      }else{
        const index = parseInt(this.result[0].luckyIndex)
        //console.log(index)
        const number = this.options[index].lunckyNumber //购买的号码
        //console.log(number)
        const loginObject = JSON.parse(window.localStorage.getItem('login'))
        const {eoa,username} = loginObject //获取手机号和eoa地址
        const round = this.round
        const _wei = this.wei
        //向mongodb所在的koa服务器发送ajiax请求
        const postResult = await axios.post('http://localhost:9999/members/buy',{
          number:number,
          eoa:eoa,
          wei:_wei,
          phone:username, //因为在mongo中设置的Schema为phone为了方便解构赋值
          round:round
        })
        //利用传回来的值判断后进行上链
        if(postResult.data.error === 0){
          const ticketsContract = await contract.getInstance()
          await ticketsContract.methods.buyTicket(index).send({
            from:eoa,
            gas:6000000,
            value:this.money
          })
          Toast('购买成功')
          this.stateOfJoin = true
          //更新状态列表
          const opts = this.options
          opts[index].isSold = true
          this.options = opts
          this.result = []
        }
      }
    }
  },
  async mounted() {
    //获取合约实例,合约的所有方法和数据都在ticketsContract中
    const ticketsContract = await contract.getInstance()
    //获取彩票池
    const numbersPool = await ticketsContract.methods.getNumbers().call()
    //console.log(numbersPool,'类型',typeof(numbersPool[0]))
    
    //获取确认池,确认池为每个号码的索引
    const confirmPool = await ticketsContract.methods.getCurrentIndexes().call()
    this.confirmPool = confirmPool
    //console.log(confirmPool)
    //获取期数
    const currentRound = await ticketsContract.methods.round().call()
    this.round = currentRound
    //获取当前投注需要的金额
    const _wei = await ticketsContract.methods._wei().call()
    this.wei = web3.utils.fromWei(String(_wei)) + 'ether'
    this.money = _wei
    numbersPool.forEach((item,index) => {
      const obj = {
        luckyIndex:index,
        lunckyNumber:`幸运彩票${item}号`
      }
      obj.isSold = confirmPool.indexOf(String(index)) === -1 ? false : true
      const res = confirmPool.indexOf(String(index)) === -1 ? false : true
      //console.log(res)
      this.options.push(obj)
    });
    //console.log(this.options)
  },
}
</script>

<style scoped>
  h2 {
    text-align: center;
    margin: 10px auto;
  }
</style>