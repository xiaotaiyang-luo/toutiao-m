import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 导入Vant 核心组件
import Vant from 'vant';
// 导入 Vant 全局样式
import 'vant/lib/index.css';


import '@/components/css/index.css'

Vue.config.productionTip = false

// 注册使用 Vant 组件库
Vue.use(Vant);
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
