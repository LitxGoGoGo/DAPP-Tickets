import Vue from 'vue'
import App from './App.vue'
//引入store
import store from './store/index'
//引入vueRouter
import VueRouter from 'vue-router'
//引入路由器
import router from './router/index'
Vue.config.productionTip = false

//应用插件
Vue.use(VueRouter)
//按需引入并且使用组件
import { Button } from 'vant';
import { Tabbar, TabbarItem } from 'vant';
import { Icon } from 'vant';
import { NavBar } from 'vant';
import { Field } from 'vant';
import { Cell, CellGroup } from 'vant';
import { Checkbox, CheckboxGroup } from 'vant';
import { Divider } from 'vant';

Vue.use(Divider);
Vue.use(Checkbox);
Vue.use(CheckboxGroup);
Vue.use(Cell);
Vue.use(CellGroup);
Vue.use(Field);
Vue.use(NavBar);
Vue.use(Icon);
Vue.use(Tabbar);
Vue.use(TabbarItem);
Vue.use(Button);

new Vue({
  render: h => h(App),
  router:router,
  store,
  beforeCreate() {
    Vue.prototype.$bus = this
  },
}).$mount('#app')
