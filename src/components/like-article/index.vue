<!-- 点赞文章组件 -->
<template>
  <van-icon @click="onLike" :class="isLike == 1 ? 'like-article':''" :name="isLike == 1 ? 'good-job':'good-job-o'" />

</template>

<script>
import { removeLikeArticle, addLikeArticle } from "@/api/user";
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
      type: [Number, String],
      required: true,
    },
  },
  data() {
    return {};
  },
  computed: {},
  watch: {},
  created() {},
  methods: {
    async onLike() {
      if (this.isLike === 1) {
        const res = await removeLikeArticle(this.articleId);
        this.isLike = -1;
        if (res.status !== 204) {
          this.$toast("操作失败，请稍后重试");
        }
      } else if (this.isLike === -1) {
        await addLikeArticle(this.articleId);
        this.isLike = 1;
        if (res.status !== 201) {
          this.$toast("操作失败，请稍后重试");
        }
      }
    },
  },
};
</script>

<style scoped lang='less'>
.like-article {
  color: #00a2ff;
}
</style>