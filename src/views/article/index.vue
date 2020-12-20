<!-- 文章详情页面组件 -->
<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" left-arrow title="黑马头条" @click-left='$router.push("/home")'></van-nav-bar>
    <!-- /导航栏 -->

    <div class="main-wrap">
      <!-- 加载中 -->
      <div class="loading-wrap" v-if="isLoad">
        <van-loading color="#3296fa" vertical>加载中</van-loading>
      </div>
      <!-- /加载中 -->

      <!-- 加载完成-文章详情 -->
      <div class="article-detail" v-else-if="articleList.title">
        <!-- 文章标题 -->
        <h1 class="article-title">{{articleList.title}}</h1>
        <!-- /文章标题 -->

        <!-- 用户信息 -->
        <van-cell class="user-info" center :border="false">
          <van-image class="avatar" slot="icon" round fit="cover" :src="articleList.aut_photo" />
          <div slot="title" class="user-name">{{articleList.aut_name}}</div>
          <div slot="label" class="publish-date">{{articleList.pubdate | relativeTime}}</div>
          <!-- 关注的按钮组件  -->
          <!-- 模版中的$event 是事件参数，也就是子组件传递过来的参数
          当传递给子组件的数据既要使用还要修改，
          除了可以通过父子组件传参的形式传递数据，还可以通过 v-model 实现父组件传值给子组件，
          在父组件使用的这个组件的标签上利用 v-model 向子组件传参，
          子组件中在props中接收两个默认参数，value：表示接收的数据，input表示子组件传参时$emit绑定的事件
          这两个默认的参数名称可以在子组件的  model 中进行自定义 model:{prop:'自定义的接收数据名称'，event:'自定义的事件名称'}
          这个v-model 相当于下面的传递和修改的简写方式
          传递：
          :is-follow='articleList.is_followed'
          修改：
           @update-follow='articleList.is_followed = $event' 
          需要注意的是：
              **在子组件中依旧需要使用 props 进行数据的接收。数据名称与自定义数据名称一致，如果有自定义的话，没有的话则为value
              ** 子组件修改父组件数据信息的时候，依旧需要传一个事件进修改 $emit('自定义的事件名称'，需要传递的数据)
           -->
          <follow-btn class="follow-btn" v-model="articleList.is_followed" :user-id='articleList.aut_id'></follow-btn>
          <!-- 使用父子组件通信传递数据 和传递修改的数据 <follow-btn class="follow-btn" @update-follow='articleList.is_followed = $event' :user-id='articleList.aut_id' :is-follow='articleList.is_followed'></follow-btn> -->
          <!-- /关注的按钮组件  -->
        </van-cell>
        <!-- /用户信息 -->

        <!-- 文章内容 -->
        <div class="article-content markdown-body" v-html="articleList.content" ref='contentRef'></div>
        <van-divider>正文结束</van-divider>
        <!-- 评论列表  -->
        <comment-list :list='commentList' ref="comment-box" :source="articleList.art_id" @comment-data='commentData = $event.total_count'></comment-list>
        <!-- 评论列表  -->
        <!-- 底部区域 -->
        <div class="article-bottom">
          <van-button class="comment-btn" type="default" round size="small" @click="isPostShow = true">写评论</van-button>
          <van-icon name="comment-o" :badge="commentData" color="#777" @click="toComment" />
          <!-- 收藏文章按钮组件 -->
          <collect-article class="btn-item" v-model="articleList.is_collected " :article-id='articleList.art_id'></collect-article>
          <!-- / 收藏文章按钮组件 -->
          <!-- 点赞文章组件 -->
          <like-article v-model="articleList.attitude" :article-id='articleList.art_id '> </like-article>
          <!-- /点赞文章组件 -->
          <van-icon name="share" color="#777777"></van-icon>
        </div>
        <!-- /底部区域 -->
        <!-- 评论弹窗 -->
        <van-popup v-model="isPostShow" position="bottom">
          <comment-post :show='isPostShow' :article-id='articleList.art_id' @post-success='onPostSuccess'></comment-post>
        </van-popup>
        <!-- /评论弹窗 -->

      </div>
      <!-- /加载完成-文章详情 -->

      <!-- 加载失败：404 -->
      <div class="error-wrap" v-else-if="errStatus === 404">
        <van-icon name="failure" />
        <p class="text">该资源不存在或已删除！</p>
      </div>
      <!-- /加载失败：404 -->

      <!-- 加载失败：其它未知错误（例如网络原因或服务端异常） -->
      <div class="error-wrap" v-else>
        <van-icon name="failure" />
        <p class="text">内容加载失败！</p>
        <van-button class="retry-btn" @click="loadArticle">点击重试</van-button>
      </div>
      <!-- /加载失败：其它未知错误（例如网络原因或服务端异常） -->
    </div>
    <!-- 评论回复弹出层 -->

    <van-popup v-model="isReply" position="bottom" :style="{ height: '90%' }"> 
      
    </van-popup>
    <!-- /评论回复弹出层 -->
  </div>
</template>

<script>
import { getArticlePage } from "@/api/article"; //导入获取文章详情数据请求
import { ImagePreview } from "vant"; // 这个预览图片的插件与别的插件不同，不是通过html结构的形式来使用，而是通过函数调用的方式，所以必须要单独引入它的函数
import FollowBtn from "@/components/follow-user"; // 导入关注的组件
import CollectArticle from "@/components/collect-article"; // 导入收藏组件
import likeArticle from "@/components/like-article"; // 导入点赞组件
import CommentList from "./components/comment-list"; // 导入评论列表组件
import CommentPost from "./components/comment-post"; // 导入评论输入发布组件
export default {
  name: "ArticleIndex",
  components: {
    FollowBtn,
    CollectArticle,
    likeArticle,
    CommentList,
    CommentPost,
  },
  props: {
    //   接收传参，路由传参，父组件传参都可以，复用性更好更便于维护
    articleId: {
      type: [Number, String, Object], //因为数据可能是字符串（通过输入url跳转页面）也可能是数字（点击文章列表中的某一项进行页面跳转），所以写两个数据类型
      required: true,
    },
  },
  data() {
    return {
      articleList: {}, // 文章详情数据
      isLoad: true, // 是否显示 文章 加载中
      errStatus: 0, // 错误响应状态码
      commentData: 0, // 评论总数
      isPostShow: false, // 控制是否显示弹出层
      isReply: false, // 评论回复时的弹出层是否显示
      // 评论列表的数据
      commentList: [],
    };
  },
  computed: {},
  watch: {},
  created() {
    this.loadArticle();
  },
  methods: {
    async loadArticle() {
      // 当出现不明错误时，需要点击按钮重新加载内容，那么还需要重新打开loading
      this.isLoad = true;

      const res = await getArticlePage(this.articleId);
      // console.log(1, res);
      // 测试其他错误
      // if (Math.random() > 0.5) {
      //   res.status = 507;
      // }
      if (res.status === 200) {
        this.articleList = res.data.data;
        // 当请求成功的时候，就调用预览图片的插件
        // 具体实现图片预览分析
        // 1.点击图片，调用预览插件
        // 1.1点击图片需要先获取到img节点才能绑定点击事件
        // 1.2这里的文章内容的节点通过 v-html 指令进行的渲染显示，无法直接获取到
        // 1.3 通过this.$refs也无法直接获取到节点，因为数据驱动视图，是一个异步的过程，当数据改变后，视图并没有立即就发送变化，所以必须在数据驱动视图完成之后，才能获取到数据改变后的节点元素
        // ImagePreview({
        //   images: [
        //     "https://img.yzcdn.cn/vant/apple-1.jpg",
        //     "https://img.yzcdn.cn/vant/apple-2.jpg",
        //   ],
        //   startPosition: 0,
        // });
        // 利用定时器，确保能够获取到节点元素
        setTimeout(() => {
          // console.log(this.$refs.contentRef); // 顺利拿到了内容的html结构
          this.previewImg(); // 调用将图片预览功能封装到的函数
        }, 0);
      } else if (res.status === 404) {
        this.errStatus = 404;
      }

      // // 无论成功与否，都要关闭loading
      this.isLoad = false;
    },
    // 图片预览
    previewImg() {
      const allActionDone = this.$refs.contentRef; // 获取内容的html结构
      // 拿到所有的 img 节点
      const imgs = allActionDone.querySelectorAll("img");
      // console.log(img);
      const imgUrl = []; // 定义一个空数组，用于存储 img 的 src 路径
      imgs.forEach((img, index) => {
        // console.log(img);
        imgUrl.push(img.src); // 将每个img的src属性push到存放img的url地址数组中去
        //  给每个img绑定单击事件
        img.onclick = () => {
          //  调用预览图片的函数
          ImagePreview({
            images: imgUrl, // 需要预览的图片的图片路径数组
            startPosition: index, // 预览图片的最初起始位置，这里根据点击的图片的index作为起始位置
          });
        };
      });
    },
    // 点击评论图标 平滑滚动到评论区域
    toComment() {
      // console.log(this.$refs["comment-box"].$el);
      const dom = this.$refs["comment-box"].$el; // 获取评论区域的根节点
      dom.scrollIntoView({
        behavior: "smooth",
      });
    },

    // 发布评论成功
    onPostSuccess(data) {
      this.isPostShow = false; // 关闭评论弹出层
      // console.log(data.new_obj);
      this.commentList.unshift(data.new_obj); //将发布的评论插入到评论数据列表的最前面
    },
  },
};
</script>

<style scoped lang='less'>
@import "./github-markdown.css"; // 导入文章样式文件
.article-container {
  .main-wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 92px;
    bottom: 88px;
    overflow-y: scroll;
    background-color: #fff;
  }
  .article-detail {
    .article-title {
      font-size: 40px;
      padding: 50px 32px;
      margin: 0;
      color: #3a3a3a;
    }

    .user-info {
      padding: 0 32px;
      .avatar {
        width: 70px;
        height: 70px;
        margin-right: 17px;
      }
      .van-cell__label {
        margin-top: 0;
      }
      .user-name {
        font-size: 24px;
        color: #3a3a3a;
      }
      .publish-date {
        font-size: 23px;
        color: #b7b7b7;
      }
      .follow-btn {
        width: 170px;
        height: 58px;
      }
    }

    .article-content {
      padding: 55px 32px;
      /deep/ p {
        text-align: justify;
      }
    }
  }

  .loading-wrap {
    padding: 200px 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
  }

  .error-wrap {
    padding: 200px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    .van-icon {
      font-size: 122px;
      color: #b4b4b4;
    }
    .text {
      font-size: 30px;
      color: #666666;
      margin: 33px 0 46px;
    }
    .retry-btn {
      width: 280px;
      height: 70px;
      line-height: 70px;
      border: 1px solid #c3c3c3;
      font-size: 30px;
      color: #666666;
    }
  }

  .article-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    height: 88px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    .comment-btn {
      width: 282px;
      height: 46px;
      border: 2px solid #eeeeee;
      font-size: 30px;
      line-height: 46px;
      color: #a7a7a7;
    }
    /deep/ .van-icon {
      font-size: 40px;
      .van-info {
        font-size: 16px;
        background-color: #e22829;
      }
    }
    // .btn-item {
    //   border: none;
    //   padding: 0;
    //   height: 40px;
    //   line-height: 40px;
    // }
  }
}
</style>