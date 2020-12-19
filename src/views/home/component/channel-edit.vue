<!-- 频道编辑内容组件 -->
<template>
  <div class="channel-edit">
    <van-cell title="我的频道" :border="false">
      <!-- isChannelEditShow = !isChannelEditShow 表示isChannelEditShow等于它自己取反，简而言之就是如果是true就取false，是false就取true -->
      <van-button class="edit-btn" size="mini" round type="danger" plain @click="isIconShow = !isIconShow">{{isIconShow ? '完成':'编辑'}}</van-button>
    </van-cell>
    <van-grid :border="false" :gutter="10">
      <van-grid-item class="channel-item" v-for="(channel,index) in myChannels" :key="channel.id" @click="onMyChannels(channel,index)">
        <template v-slot:text>
          <!-- v-bind:class 语法
            一个对象：对象中的 key 表示作用的 css 类名  这里是active
                    对象中的 value 要计算出布尔值
                    true：表示作用该类名
                    false：表示不作用该类名

                简单来讲就是key为 css 类名，只有当后面的条件成立的时候才会使用这个类名，反之则不使用该类名
                这里也可以用三元表达式来写  myActive === index ？ 'active':''
                这里是给当前正在浏览的频道进行高光处理
             -->
          <span :class="{active:myActive === index} " class="text">{{channel.name}}</span>
        </template>
        <template v-slot:icon>
          <van-icon v-show="isIconShow && !fiexdChannels.includes(channel.id)" name="clear" />
        </template>
      </van-grid-item>
    </van-grid>
    <van-cell title="频道推荐" :border="false"></van-cell>
    <van-grid :border="false" class="recommend-grid" :gutter="10">
      <van-grid-item class="channel-item" v-for="(channel) in recommendChannels" :key="channel.id" :text="channel.name" icon="plus" @click="addChannel(channel)" />
    </van-grid>
  </div>
</template>

<script>
import {
  getAllChannel,
  addUserChannel,
  deleteUserChannel,
} from "@/api/channel";
import { setItem, removeItem, getItem } from "@/utils/storage";
import { mapState } from "vuex";
export default {
  name: "ChannelEdit",
  components: {},
  props: {
    myChannels: {
      type: Array,
      required: true,
    },
    myActive: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      // 点击编辑，是否显示删除图标
      isIconShow: false,
      //   全部频道列表数据
      allChannels: [],
      //   固定频道，不允许删除,给个数据的话方便修改，而且数组中可以放多个频道id。指定固定频道
      fiexdChannels: [0],
    };
  },
  computed: {
    ...mapState(["user"]),
    //   根据我的频道与全部频道，返回所需要的推荐频道  所有频道中不包含推荐这个频道
    recommendChannels() {
      // 利用筛选 filter() 方法，筛选所有频道中 id等于 我的频道中id 的项 取反，就是频道推荐的数据
      return this.allChannels.filter((channel) => {
        return !this.myChannels.find((item) => item.id === channel.id);
      });
    },
  },
  watch: {},
  created() {
    this.loadAllChannel();
  },
  methods: {
    // 加载获取全部的频道列表数据
    async loadAllChannel() {
      const res = await getAllChannel();
      if (res.status !== 200) {
        return this.$toast("获取频道列表数据失败");
      }
      this.allChannels = res.data.data.channels;
      //   console.log(11, this.allChannels);
    },

    // 添加 我的频道中的 频道
    async addChannel(channel) {
      // 一般情况下子组件不允许直接修改父组件的数据（props中接收到的数据），但是，如果是  引用型数据（ps：简单数据类型不允许这样操作，当然它也没办法这么操作），可以‘间接性’的修改，也就是不直接赋值去修改数据，而是利用 push、splice、unshift等方法去修改数据，这是被运行的
      this.myChannels.push(channel); // 因为有利用 myChannels 计算获取频道推荐数据，所以这里改变 myChannels 数据，频道推荐也会改变，只是刷新之后又会恢复成未修改前，因为并非持久化的数据

      // console.log(this.user);
      if (this.user) {
        // 如果登录了，则进行线上更新

        const res = await addUserChannel({
          id: channel.id, // 频道 id
          seq: this.myChannels.length, // 频道的 序号
        });
        if (res.status !== 201) {
          this.$toast("保存失败，请稍后重试");
        }
        // console.log(res);
      } else {
        // 未登录 则将修改的频道进行本地存储
        setItem("TOUTIAO_CHANNELS", this.myChannels);
      }
    },

    // 编辑频道或跳转频道
    onMyChannels(channel, index) {
      //   console.log(channel, index);

      if (this.isIconShow) {
        // 编辑状态，则是删除频道
        // 1.固定的频道不能删除
        if (this.fiexdChannels.includes(channel.id)) {
          return;
        }
        // 2.根据索引删除当前所点击的项，从而间接的修改父组件的数据
        this.myChannels.splice(index, 1);

        // 3.如果删除的是激活频道的前面的项，则就要更新激活频道的选项值,也就是当前的激活频道的绑定数据 减 1 即可
        if (index <= this.myActive) {
          this.$emit("toggle-channel", this.myActive - 1, true);
        }
        // console.log(this.myActive);

        // console.log(index);
        // 4.处理数据持久化
        this.deleteChannel(channel);
      } else {
        // 非编辑状态则是跳转频道
        this.$emit("toggle-channel", index, false); // 简单数据类型，所以需要自定义事件向父组件传递数据用于修改父组件数据
      }
    },
    // 封装的删除频道的方法
    async deleteChannel(channel) {
      // 判断是否登录了，登录了则发起请求，删除线上的，反之则删除本地存储的
      if (this.user) {
        // 登录，删除线上
        const res = await deleteUserChannel(channel.id);
        // console.log(res);
        if (res.status !== 204) {
          this.$toast("操作失败，请稍后重试");
        }
      } else {
        // 未登录，删除本地，也就是把删除后的数据再存储一遍
        setItem("TOUTIAO_CHANNELS", this.myChannels);
      }
    },
  },
};
</script>

<style scoped lang='less'>
.channel-edit {
  padding: 0 10px;
  box-sizing: border-box;

  .van-cell {
    padding: 0px 20px 46px 20px;
    &:not(:first-child) {
      padding-top: 72px;
    }
    .edit-btn {
      width: 100px;
      height: 46px;
      font-size: 26px;
      color: #f96f6f;
    }
  }
  .channel-item {
    width: 160px;
    height: 86px;
    /deep/ .van-grid-item__content {
      position: relative;
      border-radius: 10px;
      background-color: #f5f5f6;
      .van-grid-item__text,
      .text {
        color: #222;
        font-size: 26px;
        margin-top: 0;
        white-space: nowrap;
      }
      .active {
        color: #f96f6f;
      }
      .van-grid-item__icon-wrapper {
        position: unset;
      }
    }
  }

  /deep/ .recommend-grid {
    .van-grid-item__content {
      flex-direction: row;
      color: #222;
      border-radius: 10px;
      .van-icon {
        font-size: 24px;
      }

      .van-grid-item__text {
        font-size: 28px;
      }
    }
  }
  /deep/ .van-icon-clear {
    position: absolute;
    right: -10px;
    top: -10px;
    font-size: 30px;
    color: #ccc;
    z-index: 2;
  }
}
</style>