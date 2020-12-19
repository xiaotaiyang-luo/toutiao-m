<template>
  <div class="home-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" :fixed='true'>
      <template v-slot:title>
        <van-button round type="info" icon="search" class="search-btn" to='/search'>搜索</van-button>
      </template>
    </van-nav-bar>
    <!-- 导航栏/ -->

    <!-- 频道列表 -->
    <!-- v-model  绑定当前激活标签对应的索引值，默认情况下启用第一个标签 
    animated 开启切换标签内容时的转场动画
    swipeable  开启滑动切换标签页
     Tab 标签页组件本身支持标签内容是懒渲染，如果不需要可以通过配置 `:lazy-render="false"` 来关闭这个效果
    -->
    <van-tabs :swipe-threshold='1' class="channel-tabs" v-model="active" animated swipeable title-inactive-color="#777777" title-active-color='#333333' color='#3296fa' line-width='30px' line-height='4px'>
      <van-tab v-for="item in  channelsList" :key="item.id" :title="item.name">
        <!-- 文章列表组件标签  -->
        <article-list :channel='item'></article-list>
        <!-- /文章列表组件标签   -->
      </van-tab>

      <template v-slot:nav-right>
        <div slot='nav-right' class="placeholder"></div>
        <div class="hamburger-btn" @click="editChannel">
          <i class="toutiao toutiao-gengduo" />
        </div>
      </template>
    </van-tabs>
    <!-- /频道列表 -->
    <!-- 频道编辑 -->
    <van-popup class="edit-channel-popup" round v-model="isChannelEditShow" position="bottom" :style="{ height: '100%' }" closeable close-icon-position="top-left">
      <!-- 频道编辑内容组件标签 -->
      <channel-edit :my-channels='channelsList' :my-active='active' @toggle-channel='onUpatetActive'></channel-edit>
      <!--/ 频道编辑内容组件标签 -->

    </van-popup>
    <!-- /频道编辑 -->
  </div>
</template>

<script>
import { getUserChannels } from "@/api/user.js";
// 默认导入文章列表组件
import ArticleList from "./component/article-list";
import ChannelEdit from "./component/channel-edit";
import { getItem } from "@/utils/storage";
import { mapState } from "vuex";
export default {
  name: "HomeIndex",
  data() {
    return {
      active: 0, // 当前选中的标签索引号
      //  定义数据接收频道列表
      channelsList: [],
      isChannelEditShow: false, // 是否弹出弹框
    };
  },
  created() {
    this.loadChannels();
  },
  methods: {
    // 获取首页频道数据
    async loadChannels() {
      let channelsRender = [];
      // 判断登录状态，登录成功加载登录的频道数据,未登录,又要进行判断,判断是否有本地存储，根据情况分别获取本地的和默认的频道
      if (this.user) {
        // 登录状态
        const res = await getUserChannels();
        // console.log(res);
        if (res.status !== 200) {
          this.$toast("获取频道列表数据失败");
        }
        channelsRender = res.data.data.channels;
      } else {
        // 未登录,又要进行判断,判断是否有本地存储，

        const localChannels = getItem("TOUTIAO_CHANNELS");
        if (localChannels) {
          // 有则加载未登录的本地存储的频道数据;
          channelsRender = localChannels;
        } else {
          // 没有则获取默认的频道列表
          const res = await getUserChannels();
          // console.log(res);
          if (res.status !== 200) {
            this.$toast("获取频道列表数据失败");
          }
          channelsRender = res.data.data.channels;
        }
      }
      this.channelsList = channelsRender;
      // console.log(this.channelsList);
    },

    // 点击更多，编辑频道
    editChannel() {
      this.isChannelEditShow = true;
    },

    onUpatetActive(index, boo) {
      // 更新激活的频道项
      this.active = index;
      // console.log(1, index);
      // 关闭编辑频道弹层
      this.isChannelEditShow = boo;
    },
  },
  components: {
    "article-list": ArticleList,
    ChannelEdit,
  },
  computed: {
    ...mapState(["user"]),
  },
};
</script>

<style lang="less" scoped>
.home-container {
  padding-top: 176px;
  padding-bottom: 100px; // 因为底部的导航栏是一个固定定位的，也就是脱离了标准了，如果不设置一下底部的内边距，这个导航栏会挡住它所在位置的标准流内容
  .page-nav-bar {
    // /deep/ 表示深入的查找到这个不在我们文件中存在，而是这个vant自动生成的选择器，找到它，便于操作
    /deep/ .van-nav-bar__title {
      max-width: unset;
    }
    .search-btn {
      width: 555px;
      height: 64px;
      background: #5babfb;
      border: 0;
      font-size: 28px;
      .van-icon {
        font-size: 32px;
      }
    }
  }
  /deep/ .channel-tabs {
    .van-tabs__wrap {
      position: fixed;
      top: 92px;
      z-index: 1;
      width: 100%;
      right: 0;
      left: 0;

      height: 84px;
    }
    .van-tabs__nav {
      padding-bottom: 0;
    }
    .van-tab {
      border-right: 1px solid #eee;
      min-width: 200px;
      font-size: 30px;
    }
    .van-tabs__line {
      position: absolute;
      bottom: 8px !important;
    }
    .hamburger-btn {
      position: fixed;
      right: 0;
      width: 66px;
      height: 84px;
      display: flex;
      justify-content: center;
      align-items: center;
      background: #fff;
      opacity: 0.92;
      i.toutiao {
        font-size: 33px;
      }
      &::before {
        content: "";
        position: absolute;
        left: 0;
        width: 1px;
        height: 100%;
        background-image: url(~@/assets/gradient-gray-line.png);
        background-size: contain;
      }
    }
    .placeholder {
      flex-shrink: 0;
      width: 66px;
      height: 82px;
    }
  }
  .edit-channel-popup {
    padding-top: 100px;
    box-sizing: border-box;
  }
}
</style>