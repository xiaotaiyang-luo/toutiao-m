<!-- 搜索页面 -->
<template>
  <div class="search-container">
    <!-- 顶部搜索栏 -->
    <!-- Tips: 在 van-search 外层增加 form 标签，且 action 不为空，即可在 iOS 输入法中显示搜索按钮。 -->
    <form action="/">
      <van-search v-model="searchText" show-action placeholder="请输入搜索关键词" @search="onSearch" @cancel="onCancel" @focus='isResultShow = false' shape="round" background="#5babfb" />
    </form>
    <!-- /顶部搜索栏 -->

    <!-- 搜索的建议和历史记录的显示可以根据是否有搜索内容进行判断,搜索结果可根据自行设定的一个控制其显示的布尔值来判断
    1.根据isSearchResultShow  的值决定是否显示搜索结果
    2.如果搜索框有内容，则进行搜索建议  searchText 有内容
    3.如果没有内容，则显示历史记录
    这样做的好处还有一个，当用户搜索过之后，如果需要再次搜索，当搜索框获得焦点时，则显示搜索建议，隐藏搜索结果
     -->
    <!-- 搜索结果 -->
    <search-result v-if='isResultShow' :search-text='searchText'></search-result>
    <!--/搜索结果 -->

    <!-- 搜索联想建议-->
    <search-suggestion v-else-if="searchText" :search-text='searchText' @search='onSearch'></search-suggestion>

    <!--/搜索联想建议-->

    <!-- 搜索历史记录 -->
    <search-history v-else :searchHistory='SearchHistoryList' @search='onSearch' @delete-history='SearchHistoryList = []'></search-history>
    <!-- /搜索历史记录 -->
  </div>
</template>

<script>
// 导入搜索时的不同状态的组件
import SearchHistory from "@/views/search/component/search-history";
import SearchResult from "@/views/search/component/search-result";
import SearchSuggestion from "@/views/search/component/search-suggestion";
import { getItem, setItem } from "@/utils/storage";
export default {
  name: "SearchPage",
  components: {
    SearchHistory,
    SearchResult,
    SearchSuggestion,
  },
  props: {},
  data() {
    return {
      // 搜索框内容绑定的数据
      searchText: "",
      //   是否渲染搜索结果
      isResultShow: false,
      // 搜索历史记录
      SearchHistoryList: getItem("TOUTIAO-SEARCH-HISTORY") || [], // 当本地存储有历史记录的时候，就使用本地存储的记录，当本地存储中没有数据的时候，此时本地存储返回一个null。容易报错，所以当没有的时候，输出一个空数组。避免报错
    };
  },
  computed: {},
  watch: {
    // 此项目中，线上虽然会在搜索的时候就进行历史记录的一个存储，但是只会存储4条数据，数据过少，线上的历史记录可以起到不同设备的同步作用。但此处并不满足数据条数的需求，所以可以直接进行本地存储就够了
    // 不管是直接进行搜索，还是通过历史记录以及搜索建议进行搜索，历史记录数据都会发送变化，分开一个个去监视它的变化过于麻烦
    // 此时需要用到watch侦听器,只要数据发生变化就可以监听到,就能将其进行存储
    SearchHistoryList(val) {
      setItem("TOUTIAO-SEARCH-HISTORY", val);
    },
  },
  created() {},
  methods: {
    onSearch(val) {
      // 每次搜索都需要进行的步骤

      // 更新文本框内容
      this.searchText = val;

      // 存储搜索历史记录  在渲染搜索结果之前记录
      // 要求：不能有相同的记录，新的记录要查到数组最前面
      const index = this.SearchHistoryList.indexOf(val);
      if (index !== -1) {
        // 如果有相同的，则将这条记录清除，并把这条记录追加到最前面
        this.SearchHistoryList.splice(index, 1);
      }
      this.SearchHistoryList.unshift(val); // 追加到最前面

      // 渲染搜索结果
      this.isResultShow = true;
    },
    onCancel(e) {
      var timeOutEvent = 0;
      // Toast("取消");
      this.$router.push("/home");
    },
  },
};
</script>

<style scoped lang='less'>
.search-container {
  .van-search {
    padding: 18px 36px;
  }
  .van-search__content {
    border-radius: 6px;
  }
  .van-search__action {
    color: #fff;
  }
}
</style>