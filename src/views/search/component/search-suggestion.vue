<!-- 搜索联想建议组件 -->
<template>
  <div class="search-suggestion">
    <van-cell v-for="(suggestion,index) in suggestionList" :key="index" :title="suggestion" icon="search" @click="$emit('search',suggestion)">
      <template v-slot:title>
        <span v-html="highLight(suggestion)"></span>
      </template>
    </van-cell>

  </div>
</template>

<script>
import { getSuggestionData } from "@/api/search.js";
// 按需导入需要用到的lodash中的方法
import { debounce } from "lodash";
export default {
  name: "SearchSuggestion",
  components: {},
  props: {
    searchText: {
      type: String,
      require: true,
    },
  },
  data() {
    return {
      suggestionList: [], // 搜索建议
      // timer: "", // 用于原生js防抖处理的定时器名称
    };
  },
  computed: {},
  watch: {
    // 侦听搜索框文本内容的数据变化
    searchText: {
      // 当searchText发生变化时，会调用handler回调
      // handler是watch侦听器的固定回调写法
      /*
      不用插件进行防抖处理，否则会每输入一个字符就发起一次请求。
      防抖处理之后就在一定时间段内用户输入完成之后才会发起请求，如果在这个时间内，用户继续输入，则重新计时，直到输入完成
      handler: function (value) {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.loadSearchSuggestion(value);
        }, 500);
      },
      */

      //  使用插件进行防抖处理
      // debounce 函数
      // 参数一： 一个函数
      // 参数二：延迟时间，单位是毫秒
      // 返回值：防抖之后的函数
      handler: debounce(function (val) {
        this.loadSearchSuggestion(val);
      }, 300),
      // 首次监视触发
      immediate: true,
      /* 该回调将会在侦听开始之后被立即调用，
       ** watch 最初绑定时是不会执行的，需要等监听的内容改变时才执行监听计算
       ** 简单来讲就是只有在第一次数据发生变化之后才会执行监听，这样会导致第一次改变数据的时候无法调用 handler 回调，
       ** 所以此时需要调用该方法，从而实现只要发送变化就侦听数据，而不是第一次触发后才开始侦听
       */
    },
  },
  created() {},
  methods: {
    async loadSearchSuggestion(value) {
      const res = await getSuggestionData({ q: value });
      // console.log(res);
      this.suggestionList = res.data.data.options;
    },
    // 高亮处理
    highLight(text) {
      // 对含有搜索框内容的字符进行高亮处理
      const htmlStr = `<span class='active'>${this.searchText}</span>`;
      // 创建一个正则表达式构造函数，校验出搜索建议中含有搜索内容的字符
      // 使用正则表达式构造函数的原因是正则表达式中只能写正则验证规则，写在 / / 中的字符都是验证规则，不识别动态变化的变量

      const reg = new RegExp(this.searchText, "gi");
      return text.replace(reg, htmlStr);
    },
  },
};
</script>

<style scoped lang='less'>
.search-suggestion {
  /deep/ .active {
    color: #3296fa;
  }
}
</style>