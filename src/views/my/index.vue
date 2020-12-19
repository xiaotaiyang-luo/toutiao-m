  <!-- 用心中心--我的页面组件 -->

<template>
  <div class="my-container">
    <!-- 登录状态 -->
    <div class="header user-info" v-if='user'>
      <div class="data-info">
        <div class="left">
          <van-image class="avatar" fit='cover' round :src="userInfo.photo" />
          <span class="text">{{userInfo.name}}</span>
        </div>
        <div class="right">
          <van-button class="edit-btn" round plain type="default" size="mini">编辑资料</van-button>
        </div>
      </div>
      <div class="data-stats">
        <div class="stats-item">
          <span class="text-num">{{userInfo.art_count}}</span>
          <span class="text">头条</span>
        </div>
        <div class="stats-item">
          <span class="text-num">{{userInfo.follow_count}}</span>
          <span class="text">关注</span>
        </div>
        <div class="stats-item">
          <span class="text-num">{{userInfo.fans_count}}</span>
          <span class="text">粉丝</span>
        </div>
        <div class="stats-item">
          <span class="text-num">{{userInfo.like_count}}</span>
          <span class="text">点赞</span>
        </div>

      </div>
    </div>
    <!-- /登录状态 -->

    <!-- 未登录状态 -->
    <div class="header no-login" v-else>
      <div class="login-btn" @click="$router.push('/login')">
        <img class="login-img" src="@/assets/mobile.png" alt="">
        <span class="text">登录 / 注册</span>
      </div>
    </div>
    <!-- /未登录状态 -->
    <!-- 收藏  历史区域 -->
    <van-grid class="grid-nav" clickable :column-num="2">
      <van-grid-item class="star" icon="star-o" text=" 收藏" />
      <van-grid-item class="clock" icon="clock-o" text="历史" />
    </van-grid>
    <!-- / 收藏  历史区域 -->
    <!-- 功能区域 -->
    <div class="handle">
      <van-cell title="消息通知" is-link />
      <van-cell title="小六同学" is-link />
    </div>
    <van-button class="exit-login" type="default" size="large" @click="handleExitLogin" v-if='user'>退出按钮</van-button>
  </div>
  <!-- /功能区域 -->
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { removeItme } from "@/utils/storage.js";
import { getUserSelfMsg } from "@/api/user.js";
export default {
  name: "myIndex",
  data() {
    return {
      userInfo: {},
    };
  },
  created() {
    // // 获取用户自己信息
    this.loadUserInfo();
    // console.log(res);
  },
  computed: {
    ...mapState(["user"]),
  },
  methods: {
    ...mapMutations(["setToken"]),
    // 退出登录
    handleExitLogin() {
      // 在组件中调用dialog插件直接this.$dialog
      this.$dialog
        .confirm({
          title: "退出登录",
          message: "退出登录将删除所有账号信息",
        })
        .then(() => {
          // 确认退出，清除登录状态 也就是vuex中存储的token相关和本地存储与token相关的数据
          const data = null;
          this.setToken(data);
        })
        .catch(() => {
          return;
        });
    },
    // 登录成功，获取用户信息
    async loadUserInfo() {
      const res = await getUserSelfMsg();
      console.log(res);
      if (res.status !== 200) {
        this.$toast("获取数据失败，请稍后重试");
      }

      this.userInfo = res.data.data;
      // console.log(res.data.data);
    },
  },
};
</script>

<style lang="less" scoped>
.my-container {
  .header {
    height: 360px;
    background: url(~@/assets/banner.png);
    background-size: cover;
  }
  .no-login {
    display: flex;
    justify-content: center;
    align-items: center;
    .login-btn {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .login-img {
        width: 132px;
        height: 132px;
        margin-bottom: 15px;
      }
      .text {
        font-size: 28px;
        color: #fff;
      }
    }
  }
  .user-info {
    .data-info {
      height: 230px;
      display: flex;
      justify-content: space-between;
      box-sizing: border-box;
      padding: 0 30px;
      .left {
        display: flex;
        align-items: center;
        .avatar {
          width: 132px;
          height: 132px;
          margin-right: 14px;
          border: 1px solid rgba(255, 255, 255, 0.7);
        }
        .text {
          font-size: 30px;
          color: #fff;
        }
      }
      .right {
        display: flex;
        align-items: center;
        .edit-btn {
          color: #666;
        }
      }
    }
    .data-stats {
      display: flex;
      .stats-item {
        height: 130px;
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: #fff;
        .text-num {
          font-size: 36px;
        }
        .text {
          font-size: 23px;
        }
      }
    }
  }
  .grid-nav {
    .star {
      color: #eb5354;
    }
    .clock {
      color: #ff9d1d;
    }
  }
  .handle {
    margin: 10px 0;
  }
  .exit-login {
    color: #d86262;
  }
}
</style>