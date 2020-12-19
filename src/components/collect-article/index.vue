<!-- 收藏功能组件 -->
<template>
  <van-icon :class="{collected:isCollected}" :loading='isLoading' :name="isCollected ? 'star':'star-o'" @click="onCollect" />
</template>

<script>
import { removeCollect, addCollect } from "@/api/user";
export default {
  name: "CollectArticle",
  components: {},
  model: {
    prop: "isCollected",
    event: "updata-collect",
  },
  props: {
    articleId: {
      type: [Number, String, Object],
      require: true,
    },
    isCollected: {
      type: Boolean,
      require: true,
    },
  },
  data() {
    return {
      // 是否在加载数据时显示loading
      isLoading: false,
    };
  },
  computed: {},
  watch: {},
  created() {},
  methods: {
    async onCollect() {
      // 加载数据，开始loading
      this.isLoading = true;
      if (this.isCollected) {
        const res = await removeCollect(this.articleId);
        // this.isCollected = false;
        console.log(res);
        if (res.status !== 204) {
          this.$toast("操作失败，请稍后重试");
        }
      } else {
        const res = await addCollect(this.articleId);
        if (res.status !== 201) {
          this.$toast("操作失败，请稍后重试");
        }
        // this.isCollected = true;
        console.log(res);
      }
      this.$emit("updata-collect", !this.isCollected); // 这个自定义事件修改数据并不是立即的，
      // 因为自定义事件修改数据并不是立即的，所以这里的判断条件要和修改的一致的关，就需要取反
      this.$toast.success(!this.isCollected ? "收藏成功" : "取消收藏");
      // 数据加载完成。关闭loading
      this.isLoading = false;
    },
  },
};
</script>

<style scoped lang='less'>
.collected {
  color: #ff9100;
}
</style>