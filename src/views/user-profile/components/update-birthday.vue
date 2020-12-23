<!-- 修改生日组件 -->
<template>
  <div class="update-birthday">
    <van-datetime-picker v-model="currentDate" type="date" title="选择年月日" :min-date="minDate" :max-date="maxDate" @cancel='onClose' @confirm='UpdateBirthday' />
  </div>
</template>

<script>
import { editUserInfo } from "@/api/user";
import dayjs from "dayjs";
export default {
  name: "UpdateBirthday",
  components: {},
  props: {
    user: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      minDate: new Date(1930, 0, 1), // 可选的最小日期
      maxDate: new Date(2025, 10, 1), // 可选的最大日期
      currentDate: new Date(this.user.birthday), // 双向数据绑定了日期选择器，可以设置日期选择器的默认值，也可以同步日期选择器的日期
    };
  },
  computed: {},
  watch: {},
  created() {},
  methods: {
    async UpdateBirthday() {
      // 因为后端所需要的数据格式不是这个日期选择器返回的格式，所以还需要使用这个之前使用过的daujs将其转换为我们所需要的格式.也可以不用插件，直接使用 原生的方式进行处理 new Date()
      const currentDate = dayjs(this.currentDate).format("YYYY-MM-DD");
      this.$toast.loading({
        message: "保存中",
        forbidClick: true, // 禁止背景点击
        duration: 0, // 持续展示
      });

      const res = await editUserInfo({
        birthday: currentDate,
      });
      //   console.log(res);
      // 请求错误
      if (res.status !== 201) {
        return this.$toast.fail("更新失败");
      }
      // 更新视图
      //   this.$emit("input", loacName);
      this.user.birthday = currentDate;
      // 关闭弹出层
      this.$emit("close");
      // 提示更新成功
      this.$toast.success("更新成功");
    },
    onClose() {
      this.$emit("close");
      this.currentDate = this.user.birthday;
    },
  },
};
</script>

<style scoped lang='less'>
</style>