// 该文件专门用于创建整个应用的路由器
import VueRouter from 'vue-router'
//引入组件
import User from '../pages/User.vue'
import Open from '../pages/Open.vue'
import History from '../pages/History.vue'
import Mine from '../pages/Mine.vue'
import Register from '../pages/Register.vue'

//创建并暴露一个路由器

export default new VueRouter({
  routes: [
    //重定向配置路由,让用户一打开默认跳转到以下页面
    {
      path: '*', redirect: '/user'
    },
    //配置用户中心的路由信息
    {
      path:'/user',
      component:User,
      props(route){
        return{
          active:3
        }
      }
    },
    //配置开奖路由信息
    {
      path:'/open',
      component:Open,
      props(route){
        return{
          active:0
        }
      }
    },
    //配置历史记录路由信息
    {
      path:'/history',
      component:History,
      // props:{active:'你好'}
      props(route){
        return{
          active:2
        }
      }
    },
    //配置我的彩票信息
    {
      path:'/mine',
      component:Mine,
      props(route){
        return{
          active:1
        }
      }
    },
      //配置注册页面
    {
      path:'/register',
      component:Register,
      props(route){
        return{
          active:3
        }
      }
    },
  ]
})