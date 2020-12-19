<!-- 关注用户的按钮组件  
多次需要使用到关注用户按钮，所以封装为组件，方便复用
 -->
<template>
  <!-- 这里之所以没有放在一个根节点中是因为 这两个按钮是每次只会根据 v-if 的条件渲染一个出来按钮，所以实际上还是只有一个根节点 -->
  <van-button v-if="isFollow" class="follow-btn" round size="small" @click="onFollow" :loading='followLoading'>已关注</van-button>
  <van-button v-else class="follow-btn" type="info" color="#3296fa" round size="small" icon="plus" @click="onFollow" :loading='followLoading'>关注</van-button>
</template>

<script>
import { addFollowUser, removeFollowUser } from "@/api/user";
export default {
  name: "FollowBtn",
  components: {},
  props: {
    //   父组件传递的用户id
    userId: {
      type: [Number, Object, String],
      required: true,
    },
    // 父组件传递的关注状态
    isFollow: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      // 是否显示loading
      followLoading: false,
    };
  },
  computed: {},
  watch: {},
  created() {},
  methods: {
    // 关注用户与取消关注用户
    async onFollow() {
      // 点击关注或取消关注的时候，开启loading
      // 使用loading的好处是在用户点击了关注，取消关注时，数据未刷新成功时给一个反馈给用户，且在loading期间用户无法一直点击按钮，就不会因为用户一直点发起多次请求了
      this.followLoading = true;
      if (this.articleList.is_followed) {
        // 取消关注
        const res = await removeFollowUser(this.userId);
        // console.log(res);
        if (res.status !== 204) {
          this.$toast("操作失败，请稍后重试");
        }
      } else {
        // 添加关注
        const res = await addFollowUser(this.isFollow);
        // console.log(res);
        let massage = "";
        if (res.status !== 201) {
          this.$toast("操作失败，请稍后重试");
        } else if (res.status === 400) {
          this.$toast("你不能关注你自己");
        }
      }
      // 更新视图
      this.$emit("update-follow", !this.isFollow);
      // 数据请求完成之后关闭loading
      this.followLoading = false;
    },
  },
};
</script>

<style scoped lang='less'>
</style>