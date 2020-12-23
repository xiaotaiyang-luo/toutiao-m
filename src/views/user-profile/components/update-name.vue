<!-- 用户昵称 -->
<template>
  <div cclass="usr-name">
    <!-- 导航栏 -->
    <van-nav-bar left-text="取消" right-text="完成" title="昵称" @click-left="closePopup" @click-right='finisheUpdateName' />
    <!-- /导航栏 -->
    <!-- 输入框 -->
    <div class="field-warp">
      <van-field v-model.trim="localName" rows="2" autosize type="textarea" maxlength="7" placeholder="请输入昵称" show-word-limit />
    </div>
    <!-- /输入框 -->
  </div>
</template>

<script>
import { editUserInfo } from "@/api/user";
export default {
  name: "UpdateName",
  components: {},
  props: {
    // v-model传递过过来的数据的默认名称value，自定义事件为input
    value: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      localName: this.value,
    };
  },
  computed: {},
  watch: {},
  created() {},
  methods: {
    async finisheUpdateName() {
      // 开启loading，这个toast的loading不需要手动结束，只要是toast成功或失败都会关闭这个loading
      this.$toast.loading({
        message: "保存中",
        forbidClick: true, // 禁止背景点击
        duration: 0, // 持续展示
      });
      const loacName = this.localName;
      // 判断昵称是否为空，为空进行提示，不再向下执行
      if (!loacName.length) {
        this.$toast("昵称不能为空");
        return;
      }
      // 不为空，则发起更新请求
      const res = await editUserInfo({
        name: loacName,
      });
      // console.log(res);
      // 请求错误
      if (res.status !== 201) {
        return this.$toast.fail("更新失败");
      }
      // 更新视图
      this.$emit("input", loacName);
      // 关闭弹出层
      this.$emit("close");
      // 提示更新成功
      this.$toast.success("更新成功");
    },
    closePopup() {
      this.$emit("close");
      this.localName = this.value;
    },
  },
};
</script>

<style scoped lang='less'>
.field-warp {
  padding: 15px;
}
</style>