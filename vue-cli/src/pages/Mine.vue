<template>
  <div>
    <div v-if="!isLogin">
      <div class="loginBox">您尚未登录请先登录</div>
      <div style="text-align:center">
        <van-button @click="toLogin" plain type="primary">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;登录&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</van-button>
      </div>
    </div>
    <div v-if="mineData.length === 0">
      当前没有任何购买记录,可前往开奖中心进行投注
    </div>
    <div v-if="isLogin">
      <ul>
        <li v-for="(item,index) in mineData" :key="index">
          <p>彩票期数:<span>{{item.round}}</span></p>
          <p>幸运号码:<span>{{item.number}}</span></p>
          <p>购买金额<span>{{item.wei}}</span></p>
          <van-divider :style="{ color: '#07c160', borderColor: '#07c160', padding: '0 16px' }"></van-divider>
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
  name:'Mine',
  data() {
    return {
      isLogin:'',
      mineData:[]
    }
  },
  methods: {
    toLogin(){
      this.$router.push('/user')
    },
  },
  computed:{
 
  },
  async mounted() {
    //判断用户是否登录
    if (window.localStorage.getItem('login')) {
      this.isLogin = true
      const loginMsg = await JSON.parse(window.localStorage.getItem('login'))
      const {eoa} = loginMsg
      //console.log(loginMsg)
      const res = await axios.post("http://localhost:9999/members/products",{eoa}) 
      this.mineData = res.data.data
    }else{
      this.isLogin = false
    }
    //console.log(this.mineData)

  },
}
</script>

<style scoped>
  btn{
    margin: 100px auto;
  }
  ul,li {
    margin: 0;
    padding: 0;
    list-style-type: none;
    list-style: none;
  }
  span {
    color: green;
  }
  .loginBox{
    text-align: center;
    font-weight: 400;
    margin-top: 40px; 
  }
</style>