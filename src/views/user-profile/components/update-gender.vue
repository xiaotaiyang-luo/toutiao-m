<!-- 修改性别的组件 -->
<template>
  <div class="update-gender">
    <van-picker title="性别" :default-index="value" show-toolbar :columns="columns" @confirm="onConfirm" @cancel="onCancel" @change="onChange" />
  </div>
</template>

<script>
import { editUserInfo } from "@/api/user";

export default {
  name: "UpdateGender",
  components: {},
  props: {
    value: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      columns: ["男", "女"],
      localGender: "",
    };
  },
  computed: {},
  watch: {},
  created() {},
  methods: {
    async onConfirm(value, index) {
      this.$toast.loading({
        message: "保存中",
        forbidClick: true, // 禁止背景点击
        duration: 0, // 持续展示
      });
      const localGender = this.localGender;
      const res = await editUserInfo({
        gender: localGender,
      });
      // console.log(res);
      // 请求错误
      if (res.status !== 201) {
        return this.$toast.fail("更新失败");
      }
      // 更新视图
      this.$emit("input", localGender);
      // 关闭弹出层
      this.$emit("close");
      // 提示更新成功
      this.$toast.success("更新成功");
    },
    onChange(picker, value, index) {
      this.localGender = index;
    },
    onCancel() {
      this.$emit("close");
    },
  },
};
</script>

<style scoped lang='less'>
</style>