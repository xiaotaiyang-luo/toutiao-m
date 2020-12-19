import Vue from 'vue'
// 导入dayjs
import dayjs from 'dayjs'

// 先配置加载中文语言包
import 'dayjs/locale/zh-cn'
// 配置使用处理相对时间的插件
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)
// 然后配置为全局可用
dayjs.locale('zh-cn') // 全局使用 要全局可用，还要记得在全局配置的文件中main.js中导入该dayjs.js
// dayjs() 获取当前时间
// dayjs().format('YYYY-MM-DD') 

// 注册全局过滤器  value为过滤接收过来的参数，relativeTime为过滤器名称
Vue.filter('relativeTime', value => {
    return dayjs().to(dayjs(value))   // 根据现在的时间，和过滤器接收的时间，计算出距离现在时间是多久之前
})