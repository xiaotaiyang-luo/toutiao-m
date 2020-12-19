import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const TOKEN_KEY = 'TOUTIAO_USER'//使用常量的好处就是，当常量写错的时候会报错，而字符串不会，这样可以减小写错命名的情况

// 导入本地存储封装好的方法
import { setItem, getItem } from '@/utils/storage.js'
export default new Vuex.Store({
  state: {
    // user:null 
    // user: JSON.parse(window.localStorage.getItem(TOKEN_KEY)) // 为了刷新页面时，初始化时vuex中仍然可以获取到token。也就是从本地存储中获取到
    user: getItem(TOKEN_KEY), // 利用封装好的本地存储方式

    searchText: '' // 搜索框内容绑定的数据
  },
  mutations: {
    // 存储token
    setToken(state, data) {
      state.user = data
      // 使用本地存储的目的是让Vuex 容器中的token持久化
      // vuex中的数据是实时更新的，也就是当页面刷新的时候，页面就初始化了，那么vuex中的数据也会初始化，那么就没办法起持久的保存token。所以需要利用本地存储
      // window.localStorage.setItem(TOKEN_KEY, JSON.stringify(state.user))  // 本地存储要存储字符串,这样操作本地存储过于麻烦，所以进行了本地存储的封装
      setItem(TOKEN_KEY, state.user)
    },

  },
  actions: {
  },
  modules: {
  }
})
