<!-- 评论回复组件 -->
<template>
  <div class="comment-reply">
    <van-nav-bar :title="comment.reply_count > 0 ? `${comment.reply_count}条评论`:'暂无评论'">
      <template #left>
        <van-icon name="cross" size="18" @click="$emit('click-close')" />
      </template>
    </van-nav-bar>
    <comment-item :comment='comment'></comment-item>
    <comment-list :sourceId='comment.com_id' type='c' :list='replyComenntList'></comment-list>
    <van-button type="info" plain size="large" class="reply-btn" @click="isPostShow = true">评论</van-button>
    <van-popup v-model="isPostShow" position="bottom">
      <comment-post :show='isPostShow' :artId='articleId' :article-id='comment.com_id' @post-success='onPostSuccess'></comment-post>
    </van-popup>
  </div>

</template>

<script>
import CommentItem from "./comment-item";
import CommentList from "./comment-list"; // 导入评论列表组件
import CommentPost from "./comment-post"; // 导入评论输入发布组件
import { getCommentList } from "@/api/comment";
export default {
  name: "CommentReply",
  components: {
    CommentItem,
    CommentList,
    CommentPost,
  },
  props: {
    comment: {
      type: Object,
      required: true,
    },
    articleId: {
      type: [Number, String, Object],
      required: true,
    },
  },
  data() {
    return {
      replyComenntList: [],

      isPostShow: false,
    };
  },
  computed: {},
  watch: {},
  created() {},
  methods: {
    onPostSuccess(data) {
      this.isPostShow = false;
      console.log(1, data);
      this.replyComenntList.unshift(data.new_obj);
    },
  },
};
</script>

<style scoped lang='less'>
.comment-reply {
  padding-bottom: 90px;
  .reply-btn {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 90px;
  }
}
</style>