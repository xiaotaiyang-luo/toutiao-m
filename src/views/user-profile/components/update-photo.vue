<!-- 修改头像组件 -->
<template>
  <div class="update-img">
    <img class="img" :src="img" alt="" ref="img">
    <div class="text">
      <div class="cancal" @click="$emit('close')">取消</div>
      <div class="confirm" @click="onConfirm">完成</div>
    </div>
  </div>
</template>

<script>
import "cropperjs/dist/cropper.css";
import Cropper from "cropperjs";
import { editUserPhoto } from "@/api/user";
export default {
  name: "UpdatePhoto",
  components: {},
  props: {
    user: {
      type: Object,
      required: true,
    },
    img: {
      type: [String, Object],
      required: true,
    },
  },
  data() {
    return {
      cropper: null,
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    //   要操作dom元素，所以需要在mounted钩子函数内进行操作
    const image = this.$refs.img; // 获取图片预览区域的图片的节点
    this.cropper = new Cropper(image, {
      viewMode: 1,
      dragMode: "move",
      aspectRatio: 1,
      autoCropArea: 1,
      cropBoxMovable: false,
      cropBoxResizable: false,
      background: false,
    });
  },
  methods: {
    onConfirm() {
      this.cropper.getCroppedCanvas().toBlob((blob) => {
        // console.log(blob); // blob就是  input 的file 类型获取到的文件对象(也就是file文件对象)
        // 错误写法：
        // 接口中请求头要求数据格式为formData数据，Content-Type	multipart/form-data
        // 所以这里这样写是不正确的，这种普通的js 对象数据类型适用于Content-Type	application/json
        //   const res = await editUserPhoto({
        //       photo:blob
        //   });
        //   正确写法：
        this.loadPhoto(blob);
      });
    },
    async loadPhoto(blob) {
      this.$toast.loading({
        message: "保存中",
        forbidClick: true,
        duration: 0,
      });
      console.log(blob);
      const formData = new FormData();
      formData.append("photo", blob);
      console.log(formData);
      const res = await editUserPhoto(formData);
      if (res.status !== 201) {
        this.$toast.fail("更新头像失败");
      }
      this.$emit("close");
      this.user.photo = res.data.data.photo;
      this.$toast.success("更新头像成功");

      //   console.log(res);
    },
  },
};
</script>

<style scoped lang='less'>
.update-img {
  height: 100%;
  background: #000;
}
.img {
  display: block;
  max-width: 100%;
}
.text {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 30px;
  .cancal,
  .confirm {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100px;
    height: 100px;
    color: #fff;
  }
}
</style>