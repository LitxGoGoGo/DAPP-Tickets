<template>
  <div>
    <!-- 顶部容器 -->
    <van-nav-bar class="topNavBar" :title="title"/>

    <!-- 中部容器 -->
    <div>
      <router-view>
      </router-view>
    </div>
    <!-- 底部导航内容 -->
    <van-tabbar placeholder  v-model="active">
      <van-tabbar-item icon="cash-back-record" to="/open">彩票中心</van-tabbar-item>
      <van-tabbar-item icon="points" to="/mine">我的彩票</van-tabbar-item>
      <van-tabbar-item icon="certificate" to="/history">开奖历史</van-tabbar-item>
      <van-tabbar-item icon="user-o" to="/User">用户中心</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script> 
  export default {
    name: 'App',
    components:{},
    // 初始化一部分页面数据
    data() {
      return {
        active:0,
        title:'欢迎来到彩票中心'
      }
    },
    mounted() {
    },
  }
</script>

<style scoped>
  .topNavBar{
    background-color: skyblue;
  }
</style>>

</style>
