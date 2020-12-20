<!-- 点赞文章组件 -->
<template>
  <van-icon :loading='isLoading' @click="onLike" :class="isLike == 1 ? 'like-article':''" :name="isLike == 1 ? 'good-job':'good-job-o'" />

</template>

<script>
import { removeLikeArticle, addLikeArticle } from "@/api/article";
export default {
  name: "likeArticle",
  components: {},
  model: {
    prop: "isLike",
    event: "update-like",
  },
  props: {
    articleId: {
      type: [Object, Number, String],
      required: true,
    },
    isLike: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      isLoading: false,
    };
  },
  computed: {},
  watch: {},
  created() {},
  methods: {
    async onLike() {
      // 加载数据，开启loading
      this.isLoading = true;
      let status = -1;
      if (this.isLike === 1) {
        // 已点赞，取消点赞
        const res = await removeLikeArticle(this.articleId);
        if (res.status !== 204) {
          this.$toast("操作失败，请稍后重试");
        }
        status = -1;
        // this.$toast.success("取消点赞");
      } else if (this.isLike === -1) {
        // 未点赞，进行点赞
        const res = await addLikeArticle(this.articleId);

        if (res.status !== 201) {
          this.$toast("操作失败，请稍后重试");
        }
        status = 1;
        // this.$toast.success("点赞成功");
      }
      // 将数据传回给父组件修改数据，进行视图更新
      this.$emit("update-like", status);

      this.$toast.success(status === 1 ? "点赞成功" : "取消点赞");

      // 加载数据完成，关闭loading
      this.isLoading = false;
    },
  },
};
</script>

<style scoped lang='less'>
.like-article {
  color: #00a2ff;
}
</style>