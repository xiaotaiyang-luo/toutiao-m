<template>
  <div class="layout-container">
    <!-- 页面路由占位符 -->
    <keep-alive exclude="search,article">
      <router-view></router-view>
    </keep-alive>

    <!-- 底部的导航条 -->
    <van-tabbar route>
      <van-tabbar-item to='/home'>
        <template v-slot:icon>
          <i class="toutiao toutiao-shouye"></i>
        </template>
        <span class="text">首页</span>
      </van-tabbar-item>
      <van-tabbar-item to='/qa'>
        <template v-slot:icon>
          <i class="toutiao toutiao-wenda"></i>
        </template>
        <span class="text">问答</span>
      </van-tabbar-item>
      <van-tabbar-item to='/video'>
        <template v-slot:icon>
          <i class="toutiao toutiao-shipin"></i>
        </template>
        <span class="text">视频</span>
      </van-tabbar-item>
      <van-tabbar-item to='/my'>
        <template v-slot:icon>
          <i class="toutiao toutiao-wode"></i>
        </template>
        <span class="text">{{$store.state.user ? '我的':'未登录'}}</span>
      </van-tabbar-item>
    </van-tabbar>

  </div>
</template>

<script>
export default {
  name: "LayoutIndex",
  computed: {},
};
</script>
 
<style lang="less" scoped>
.layout-container {
  .toutiao {
    font-size: 40px;
  }
  span.text {
    font-size: 20px;
  }
}
</style> 