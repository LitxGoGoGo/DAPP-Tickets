//创建vuex中的store
import Vue from 'vue'
//引入vuex
import Vuex from 'vuex'
import listOption from './list'
import navbarOption from './navbar'

//应用vuex插件
Vue.use(Vuex)

//创建并且暴露store
export default new Vuex.Store({
  modules:{
    listAbount:listOption,
    navbarAbaount:navbarOption
  }
})