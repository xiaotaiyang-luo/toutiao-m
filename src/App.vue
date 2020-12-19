<template>
  <div id="app">

    <!-- keep-alive 是 Vue 的内置组件，当它包裹动态组件时，会缓存不活动的组件实例，而不是销毁它们 -->
    <!--include表示需要缓存的组件  LayoutIndex表示需要缓存的组件  name-->
    <keep-alive include="LayoutIndex">
      <!-- 路由占位符 -->
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: "App", // 组件名称，
};
</script>

<style lang="less">
</style>
