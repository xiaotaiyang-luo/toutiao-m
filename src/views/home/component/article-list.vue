<!-- 文章列表组件-->
<template>
  <div class="article-container">
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh" :success-text="refreshText" success-duration='1000' :head-height='100'>
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" :error.sync="error" error-text="请求失败，点击重新加载">
        <!-- 文章列表  -->
        <article-item v-for="(article,index) in list" :key="index" :article='article'></article-item>
        <!-- /文章列表  -->

      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
name: "ArticleList";
import { getArticles } from "@/api/article";
import ArticleItem from "@/components/article-item/index";
export default {
  data() {
    return {
      list: [], // 存储列表数据的数组
      loading: false, // 控制加载中 loading 状态
      finished: false, // 控制数据加载结束的状态

      //   文章列表请求获取下一页的时间戳
      timestamp: null,
      //   文章列表是否加载失败
      error: false,
      refreshing: false, // 控制是否下拉刷新
      refreshText: "刷新成功",
    };
  },
  components: {
    ArticleItem,
  },
  props: {
    channel: {
      type: Object, // 表示数据为对象类型数据
      required: true, // 表示数据为必须数据，当接收不到时就报错
    },
  },
  methods: {
    //   获取文章列表数据
    // 初始化或滚动到底部的时候会触发调用 onLoad
    async onLoad() {
      // 发起异步请求更新数据
      const res = await getArticles({
        channel_id: this.channel.id,
        timestamp: this.timestamp || Date.now(), // 查询下一页，或者第一页
        with_top: 1,
      });
      //   模拟请求失败的情况，检查加载失败是否成功
      //   if (Math.random() >= 0.5) {
      //     res.status = 400;
      //   }
      //   console.log(res.status);
      if (res.status === 200) {
        const { results } = res.data.data;
        this.list.push(...results); // 不能直接赋值，因为会覆盖掉，没什么意义，只能结构然后一项一项的插入到list数组中去。才能进行数据的查询
        // console.log(this.list);
        this.loading = false;
        //   判断数据是否加载结束;
        if (results.length) {
          // 更新获取下一页数据的时间戳
          this.timestamp = res.data.data.pre_timestamp;
        } else {
          // 没有数据了，设置加载状态结束，不再触发上拉加载更多了
          this.finished = true;
        }
      } else {
        // this.$toast("获取文章列表失败");
        // 加载失败的处理
        this.loading = false; // 关闭 loading 效果
        this.error = true; // 开启错误提示
      }
    },
    // 当下拉刷新时调用的函数
    async onRefresh() {
      const res = await getArticles({
        channel_id: this.channel.id,
        timestamp: Date.now(), // 刷新肯定是直接显示在第一页，所以只需要获取第一页数据就可以
        with_top: 1,
      });

      if (res.status === 200) {
        //   刷新成功，将新的数据最加到列表顶部显示
        const { results } = res.data.data;
        this.list.unshift(...results); // 不能直接赋值，因为会覆盖掉，没什么意义，只能结构然后一项一项的插入到list数组中去。才能进行数据的查询
        //    关闭下拉刷新
        this.refreshing = false;
      } else {
        this.refreshText = "刷新失败";
        //   关闭下拉刷新的loading状态
        this.refreshing = false;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.article-container {
  // 给每个列表设置独自的滚动区域，不然滚动区域是公共的body，就无法记录滚动的位置。给每个列表都单独设置了滚动区域的话，彼此之间的滚动就不会受影响了
  height: calc(
    100vh - 180px - 100px
  ); // 根据页面中的其他的内容高度，计算余下可作为滚动区域的高度
  overflow: auto;
}
</style>