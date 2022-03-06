<template>
  <div>
    <div id="login">
      <div class="user-image">
        <img src="./images/3.jpg" alt="用户头像">
      </div>
      <van-cell-group>
        <van-field @blur="legalPhone" v-model="username" size="large" type="tel" size:large label-align="right" colon label="用户名" placeholder="请输入用户名" />
        <van-field @blur="legalPassword" v-model="password" size="large" type="password" size:large label-align="right" colon label="请输入密码" placeholder="请输入密码" />
        <van-field @blur="confirmPassword" v-model="confirm" size="large" type="password" size:large label-align="right" colon label="再次输入密码" placeholder="请再次输入密码" />
      </van-cell-group>
      <van-button @click="register"  class="btn" icon-position="right" type="info" size="large">注册成为会员</van-button>
      <div class="register">
        <router-link to="/user">
          已成为会员,马上登录
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { Toast } from 'vant';
export default {
  name:'Register',
  props:['active'],
  data() {
    return {
      username:'',
      password:'',
      confirm:'',
      usernameState:'',
      paswordState:'',
      confirmState:''
    }
  },
  methods: {
    legalPhone(){
      if(this.username===""){
        Toast('输入的手机号码不能为空')
        this.usernameState = "error"
        return
      }
      var bool = !this.username || /^13[0-9]{1}[0-9]{8}$|^14[1456789]{1}[0-9]{8}$|^15[012356789]{1}[0-9]{8}$|^18[0-9]{1}[0-9]{8}$|^17[012345678]{1}[0-9]{8}$|^19[189]{1}[0-9]{8}$|^16[67]{1}[0-9]{8}$/.test(this.username)

      if (bool) {
        this.usernameState = 'success'
      }else{
        Toast('请输入正确的手机号')
      }
    },
    legalPassword(){
      if (this.password === "") {
        this.paswordState === "error"
        Toast('请输入密码')
        return
      }

      var bool = !this.password ||  /^[a-zA-Z]\w{5,17}$/.test(this.password) 

      if(bool){
        this.paswordState = "success"
      }else{
        this.paswordState = "error"
        Toast('密码以字母开头，长度在6~18之间，只能包含字母、数字和下划线')
      }
    },
    confirmPassword(){
      if(this.password === this.confirm && this.paswordState==="success"){
        this.confirmState = 'success'
      } 
    },
    async register(){
      if (this.confirmState === 'success' && this.usernameState === 'success') {
        const {username,password} = this
        const result = await axios.get('http://localhost:9999/members/phoneExists',{
          params:{username}
        })
        Toast(result.data.message + '即将跳转登录页面')
        setTimeout(() => {
          this.$router.push('/user')
        }, 2000);
        if (Array.isArray(result.data.data)) {
          //通过第一道后即可访问register路由进行注册
          const metaMask = await window.ethereum.enable()
          const eoa = metaMask[0].toLowerCase()
          const postResult = await axios.post('http://localhost:9999/members/register',{
            username,password,eoa
          })
          Toast(postResult.data.message + '即将跳转登录页面')
          setTimeout(() => {
            this.$router.push('/open')
          }, 2000);
        }
      }
    }
  },
  mounted() {
  },
}
</script>

<style>

</style>