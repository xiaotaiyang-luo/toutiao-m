<!-- 搜索历史组件 -->
<template>
  <div class="search-history">
    <van-cell-group>
      <van-cell title="搜索历史">
        <div v-if="isDeleteShow">
          <!-- <span @click="searchHistory.splice(0)">全部删除</span>  方法一，修改历史搜索记录数组，-->
          <span @click="$emit('delete-history')">全部删除</span>
          &nbsp;
          <span @click="isDeleteShow = false">完成</span>
        </div>
        <van-icon v-else name="delete" @click="isDeleteShow = true" />
      </van-cell>
      <van-cell :title="item" v-for="(item,index) in searchHistory" :key="index" @click="deleteHistory(item,index)">
        <van-icon name="close" v-show="isDeleteShow" />
      </van-cell>
    </van-cell-group>
  </div>

</template>

<script>
// import { getUserSearchHistory } from "@/api/search";
export default {
  name: "SearchHistory",
  components: {},
  props: {
    searchHistory: {
      type: Array,
      require: true,
    },
  },
  data() {
    return {
      isDeleteShow: false,
    };
  },
  computed: {},
  watch: {},
  created() {
    // this.loadSearchHistory();
  },
  methods: {
    async loadSearchHistory() {
      // const res = await getUserSearchHistory();
      // console.log(res);
    },
    // 删除历史记录
    deleteHistory(val, index) {
      // 先判断是否为删除状态
      if (this.isDeleteShow) {
        // 删除状态则是删除当前点击的项
        this.searchHistory.splice(index, 1);
      } else {
        // 不是删除状态则是点击当前历史记录进行搜索,要更新搜索关键词，搜索历史以及结果，所以要将数据传递给父组件进行数据的修改
        this.$emit("search", val);
      }
    },
  },
};
</script>

<style scoped lang='less'>
.search-history {
  .van-icon-delete {
    // font-size: 26px;
    line-height: 26px;
  }
}
</style>