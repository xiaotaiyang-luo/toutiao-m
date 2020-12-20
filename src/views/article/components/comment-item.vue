<!-- 评论列表项组件 -->
<template>
  <van-cell class="comment-item">
    <template #title>
      <div class="user-info">
        <van-image class="avatar" slot="icon" round fit="cover" :src="comment.aut_photo" />
        <span class="user-name">{{comment.aut_name}}</span>
      </div>
      <div class="comment-conent">{{comment.content}}</div>
    </template>

    <template #label>
      <div class="label-content">
        <span>{{comment.pubdate | relativeTime}}</span>
        <van-button class="reply-btn" round size='mini' @click="replyComment">回复 {{comment.reply_count}}</van-button>
      </div>
    </template>
    <template #right-icon>
      <div class="right-icon" :class="{active:comment.is_liking }">
        <van-icon :loading='commentLoading' @click="onCommentLike" :name=" comment.is_liking ? 'good-job': 'good-job-o'" class="search-icon" />
        <span>{{comment.like_count ? comment.like_count :'赞'}}</span>
      </div>
    </template>

  </van-cell>
</template>

<script>
import { addCommentLike, deleteCommentLike } from "@/api/comment";
export default {
  name: "CommentItem",
  components: {},
  props: {
    comment: {
      type: Object,
      required: true,
    },
    replyShow: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      commentLoading: false,
    };
  },
  computed: {},
  watch: {},
  created() {},
  methods: {
    async onCommentLike() {
      if (this.comment.is_liking) {
        const res = await deleteCommentLike(this.comment.com_id);
        this.comment.like_count--; // 只是进行这个组件页面的视图更新，所以不需要传递给父组件修改数据，数据的修改，请求会发送出去到服务器修改
        if (res.status !== 204) {
          this.$toast("操作失败，请稍后重试");
        }
      } else {
        const res = await addCommentLike(this.comment.com_id);
        this.comment.like_count++; // 进行视图更新
        if (res.status !== 201) {
          this.$toast("操作失败，请稍后重试");
        }
      }
      this.comment.is_liking = !this.comment.is_liking; // 进行视图更新
    },

    // 回复评论
    replyComment() {
      console.log(1);
      console.log(!this.replyShow);
      this.$emit("updata-reply", !this.replyShow);
    },
  },
};
</script>

<style scoped lang='less'>
.comment-item {
  .user-info,
  .label-content,
  .right-icon {
    display: flex;
    align-items: center;
  }
  .right-icon {
    .search-icon {
      padding-right: 10px;
    }
    span {
      font-size: 20px;
    }
  }
  /deep/.van-cell__label {
    .label-content {
      margin-left: 75px;
      font-size: 12px;

      .reply-btn {
        width: 100px;
        height: 40px;
        margin-left: 15px;
      }
    }
  }
  .user-info {
    .avatar {
      width: 60px;
      height: 60px;
    }
    .user-name {
      margin-left: 15px;
      color: #0673d8;
      font-size: 25px;
    }
  }

  .comment-conent {
    margin: 20px 75px 0;
    font-size: 26px;
  }
  .active {
    color: #ff9100;
  }
}
</style>