<!-- 评论展示列表组件 -->
<template>
  <div class="comment-list">
    <van-cell class="title" title="全部评论" />
    <van-list :mmediate-check='false' v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" :error.sync='error' error-text="加载失败，请点击重试">
      <comment-item :comment='item' v-for="(item,index) in list" :key="index" />
    </van-list>
  </div>
</template>

<script>
import { getCommentList } from "@/api/comment";
import CommentItem from "./comment-item";
export default {
  name: "CommentList",
  components: {
    CommentItem,
  },
  props: {
    source: {
      type: [Number, String, Object],
      required: true,
    },
    list: {
      type: Array,
      default: () => [], // 默认值像数组，对象不能直接写，需要通过函数返回
    },
  },
  data() {
    return {
      //   list: [],
      loading: false, // 是否处于加载状态
      finished: false,
      offset: null, // 获取下一页数据的标记
      limit: 10, // 每页显示的评论条数
      //   是否开启错误信息
      error: false,
    };
  },
  computed: {},
  watch: {},
  created() {
    this.loading = true; // 打开loading效果，当文章较短的时候，能有一个loading效果，并且在loading过程中，不会触发load事件，这样就不会当文章很短的时候触发两次load事件了
    // 因为列表list插件有一个特性，必须要滑动到该插件所在位置才会进行渲染发起请求，这样不在评论区域时，无法获取评论总数
    this.onLoad();
  },
  methods: {
    async onLoad() {
      // 异步更新数据

      //   1.获取数据
      const res = await getCommentList({
        type: "a",
        source: this.source.toString(),
        offset: this.offset,
        limit: this.limit,
      });
      //   console.log(res);
      if (res.status === 200) {
        const { results } = res.data.data;
        //  2. 存储数据进行视图渲染
        this.list.push(...results);

        // 将评论总数传递给父组件
        this.$emit("comment-data", res.data.data);
        // 3.加载完成 关闭加载状态结束
        this.loading = false;
        //   4.判断是否还有数据
        if (results.length) {
          //   有就更新获取到下一页数据
          this.offset = res.data.data.last_id;
        } else {
          //   没有就将 finished 设置结束
          this.finished = true;
        }
      } else {
        //   如果错误，则开启错误提示
        this.error = true;
        // 并关闭loading效果
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped lang='less'>
</style>