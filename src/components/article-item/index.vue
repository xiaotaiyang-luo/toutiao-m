<!-- 文章列表项组件 
顶部的标签导航加载文章列表的时候都会用到该页面，所以将其封装成公共组件，便于使用
-->
<template>
  <div class="article-item">
    <!-- 利用单元格的路由跳转属性 to 进行页面跳转
    因为Cell 单元格的 to 属性 与路由在router-link 导航组件中的使用方法一致
    所以有以下三种方式进行跳转的书写：
    :to="'/article/'+article.art_id"  普通字符串拼接
    :to="`/article/${article.art_id}`"  es6的模板字符拼接法
    
    :to="{
      根据路由名称进行跳转
      name:article，
      传递路由动态参数
      params:{
        （articleId是）属性名：与路由路径中设计的动态参数名称一致
        （article.art_id）为动态参数
        articleId:article.art_id
      }
    }"
     -->
    <van-cell class="article-item" :to="'/article/'+article.art_id">
      <template #title>
        <span class="title van-multi-ellipsis--l2">{{article.title}}</span>
      </template>
      <template #label>
        <div class="cover-wrap" v-if='article.cover.type === 3'>
          <div class="cover-itme" v-for="(img,index) in article.cover.images" :key="index">
            <van-image class="bottom-cover" fit="cover" :src="img" />
          </div>

        </div>
        <div class="custom-label">
          <span>{{article.aut_name}}</span>
          <span>{{article.comm_count}}评论</span>
          <!-- 利用过滤组件过滤时间 -->
          <span>{{article.pubdate | relativeTime}}</span>
        </div>

      </template>
      <template #default v-if="article.cover.type === 1">
        <van-image fit="cover" :src="article.cover.images[0]" class="right-cover" />
      </template>
    </van-cell>
  </div>
</template>

<script>
export default {
  name: "ArticleItem",
  components: {},
  props: {
    // 文章基本信息数据
    article: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {};
  },
  computed: {},
  watch: {},
  created() {},
  methods: {},
};
</script>

<style scoped lang='less'>
.article-item {
  .van-cell__value {
    flex: unset;
    width: 232px;
    height: 146px;
    padding-left: 25px;
  }
  .title {
    font-size: 32px;
    word-wrap: break-word;
  }
  .custom-label span {
    font-size: 23px;
    margin-right: 20px;
  }
  .right-cover {
    width: 100%;
    height: 146px;
  }
  .cover-wrap {
    display: flex;
    padding: 30px 0;
    .cover-itme {
      flex: 1;
      height: 146px;
      &:not(:last-child) {
        margin-right: 4px;
      }
      .bottom-cover {
        width: 100%;
        height: 146px;
      }
    }
  }
}
</style>