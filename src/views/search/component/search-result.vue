<!-- 搜索结果组件 -->
<template>
  <div class="search-result">
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" :error.sync='error' error-text="请求失败，点击重新加载">
      <van-cell v-for="(item,index) in list" :key="index" :title="item.title" />
    </van-list>
  </div>
</template>

<script>
import { getSearchResult } from "@/api/search.js";
export default {
  name: "SearchResult",
  components: {},
  props: {
    searchText: {
      type: String,
      require: true,
    },
  },
  data() {
    return {
      loading: false,
      finished: false,
      list: [],
      query: {
        page: 1, // 页码
        per_page: 15, // 每页显示的内容条数
        q: "", // 查询关键字
      },
      // 错误提示是否开启
      error: false,
    };
  },
  computed: {},
  watch: {},
  created() {},
  methods: {
    // 加载搜索结果
    async onLoad() {
      // list列表插件加载数据到加载完毕的过程
      // 1.请求获取数据
      this.query.q = this.searchText;
      // 发起请求，获取搜索结果数据
      const res = await getSearchResult(this.query);
      // console.log(res);

      if (res.status !== 200) {
        // 开启错误提示，
        this.error = true;
        // 并关闭加载
        this.loading = false;
      }
      // 2.将数据添加到数组列表中  只能用push方法，然后将数据解构后push到数组中
      this.list.push(...res.data.data.results);
      // 3.将本次加载中的loading关闭
      this.loading = false;
      // 4.判断是否还有数据
      if (this.list.length) {
        //  如果有则更新获取下一个数据的页码
        this.query.page++;
      } else {
        finished;
        // 没有数据则表示加载完毕，关闭加载状态 finished 设置为 结束
        this.finished = true;
      }
    },
  },
};
</script>

<style scoped lang='less'>
</style>