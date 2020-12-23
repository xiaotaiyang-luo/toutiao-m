<!-- 编辑用户资料组件 -->
<template>
  <div class="user-profile">
    <!-- 头部导航栏 -->
    <van-nav-bar class="page-nav-bar" title="个人信息" left-arrow @click-left="$router.push('/my')" />
    <!-- /头部导航栏 -->
    <!-- 用户可编辑的个人信息 -->
    <div class="user-info">
      <input type="file" hidden ref='file' @change='onAvatarChange'>
      <van-cell title="头像" is-link @click="$refs.file.click()">
        <van-image class="avatar" round fit="cover" :src="user.photo" />
      </van-cell>
      <van-cell title="昵称" is-link :value="user.name" @click="editName">
      </van-cell>
      <van-cell title="性别" is-link :value="user.gender === 1 ? '女':'男'" @click="isUpadtaGenderShow=true">
      </van-cell>
      <van-cell title=" 生日" :value="user.birthday" is-link @click="isUpadtaBirthdayShow =true">
      </van-cell>
    </div>
    <!-- / 用户可编辑信息 -->
    <!-- 编辑昵称 -->
    <van-popup v-model="isUpadtaNameShow" position="bottom" :style="{ height: '100%' }">
      <!-- 又要传递参数，又要对参数进行修改，所以直接使用v-model给这个子组件传值 -->
      <update-name v-model='user.name' @close='isUpadtaNameShow= false'></update-name>
    </van-popup>
    <!-- /编辑昵称 -->
    <!-- 编辑性别 -->
    <van-popup v-model="isUpadtaGenderShow" position="bottom">
      <update-gender v-if="isUpadtaGenderShow" v-model="user.gender" @close='isUpadtaGenderShow= false'></update-gender>
    </van-popup>
    <!-- /编辑性别 -->
    <!-- 编辑生日 -->
    <van-popup v-model="isUpadtaBirthdayShow" position="bottom">
      <update-birthday :user="user" @close='isUpadtaBirthdayShow= false'></update-birthday>
    </van-popup>
    <!-- /编辑生日 -->
    <!-- 编辑头像 -->
    <van-popup v-model="isUpadtaPhotoShow" position="bottom" :style="{ height: '100%' }">
      <update-photo :user='user' :img='img' @close='isUpadtaPhotoShow =false'></update-photo>
    </van-popup>
    <!-- /编辑头像 -->
  </div>
</template>

<script>
import { getUserInfo } from "@/api/user";
import UpdateName from "./components/update-name.vue";
import UpdateGender from "./components/update-gender.vue";
import UpdateBirthday from "./components/update-birthday.vue";
import UpdatePhoto from "./components/update-photo";
export default {
  name: "UserProfile",
  components: {
    UpdateName,
    UpdateGender,
    UpdateBirthday,
    UpdatePhoto,
  },
  props: {},
  data() {
    return {
      isUpadtaNameShow: false,
      isUpadtaGenderShow: false,
      isUpadtaBirthdayShow: false,
      isUpadtaPhotoShow: false,
      img: null,
      user: {},
    };
  },
  computed: {},
  watch: {},
  created() {
    this.loadUserIfon();
  },
  methods: {
    async loadUserIfon() {
      const res = await getUserInfo();
      // console.log(res);
      if (res.status !== 200) {
        return this.$toast("获取用户信息失败");
      }
      this.user = res.data.data;
    },

    editName() {
      this.isUpadtaNameShow = true;
    },
    // 选择文件时，也就是input的change时间
    onAvatarChange() {
      const file = this.$refs.file.files[0]; // 获取文件对象
      // console.log(file);
      // 基于文件对象 获取 blob 数据
      // this.img = window.URL.createObjectURL(file);
      // URL.createObjectURL不能自动回收内存（垃圾回收）
      // 垃圾回收：标记清除、引用计数、v8空间转换
      // 所有使用 h5 中的 FileReader 代替它，因为这个方式可以自动的回收内存，清除垃圾
      const reader = new FileReader();
      reader.readAsDataURL(file);
      // 文件读取成功 时执行的方法 onload

      reader.onload = (res) => {
        // reader.result 里面是 图片的 base64
        this.img = reader.result;
        // 关闭弹出层
        this.isUpadtaPhotoShow = true;
        // input-file 有一个特性，上次和本次选择的是同一个文件，不会触发选择文件的窗口，所以清空选择的文件，从而避免下次选择同一个文件时不会触发选择文件的弹窗
        this.$refs.file.value = "";
      };
      // console.log(data);
    },
  },
};
</script>

<style scoped lang='less'>
.user-profile {
  .van-popup {
    // background: red;
    background: #f5f7f9;
  }

  .van-cell {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .avatar {
    width: 60px;
    height: 60px;
    vertical-align: middle;
  }
}
</style>