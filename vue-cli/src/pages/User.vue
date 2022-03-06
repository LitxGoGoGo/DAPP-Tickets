<template>
  <div>
    <div id="login">
      <div class="user-image">
        <img src="./images/3.jpg" alt="用户头像">
      </div>
      <van-cell-group>
        <van-field @blur="legalUsername" v-model="username" size="large" type="tel" size:large label-align="right" colon label="用户名" placeholder="请输入用户名" />
        <van-field v-model="password" size="large" type="password" size:large label-align="right" colon label="输入密码" placeholder="密码" />
      </van-cell-group>
      <van-button @click="login" class="btn" icon-position="right" type="info" size="large">登录</van-button>
      <div class="register">
        <router-link to="/register">
          注册成为会员
        </router-link>
      </div>
    </div>
  </div>

</template>

<script>
  import axios from 'axios'
  import { Toast } from 'vant';
  export default {
    name:'User',
    props:['active'],
    data() {
      return {
        username:'',
        password:'',
        usernameState:'',
        isLogin:true
      }
    },
    methods: {
      legalUsername(){
      var bool = !this.username || /^13[0-9]{1}[0-9]{8}$|^14[1456789]{1}[0-9]{8}$|^15[012356789]{1}[0-9]{8}$|^18[0-9]{1}[0-9]{8}$|^17[012345678]{1}[0-9]{8}$|^19[189]{1}[0-9]{8}$|^16[67]{1}[0-9]{8}$/.test(this.username)
      if (bool) {
        this.usernameState = 'success'
      }else{Toast('请输入正确的用户名')}
      },
      //登录配置
      async login(){
        if (!this.username) {
          Toast('请输入用户名')
        }else{
          if (!this.password || this.usernameState !== 'success') {
            Toast('请输入正确密码或用户名')
          }else{
          //初步验证完成后开始发送Ajax请求,利用post,先引入axios
          //连接到metamask
          const metaMask = await window.ethereum.enable()
          const eoa = metaMask[0]
          const {username,password} = this
          const postLoginResult =await axios.post('http://localhost:9999/members/login',{
            username,password,eoa
          })
          Toast(postLoginResult.data.message)
          const userInfo = JSON.stringify(postLoginResult.data.data)
          if (postLoginResult.data.error === 0) {
            window.localStorage.setItem('login',userInfo)
          }
          setTimeout(() => {
            this.$router.push('/open')
          }, 2000);
          }
        }
      },
    },
    mounted() {
  },
  }
</script>

<style>
  .user-image{
    height: 85px;
    width: 85px;
    margin: 155px auto;
    margin-bottom: 35px;
  }
  img{
    width:100%;
    border-radius: 50%;
  }
  .btn {
    display: block;
    margin: 10px auto;
  }
  .register{
    text-align: center;
  }
</style>