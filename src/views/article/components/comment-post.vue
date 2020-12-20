<!-- 评论输入框组件 -->
<template>
  <div class="comment-post">
    <van-field class="post-field" ref="input" v-model.trim="inputComment" rows="2" autosize type="textarea" maxlength="50" placeholder="优质评论将会被优先展示" show-word-limit />
    <van-button type="primary" size="small" class="post-btn" :disabled='!inputComment.length' @click="publishComment">发布</van-button>
  </div>
</template>

<script>
import { addComment } from "@/api/comment";
export default {
  name: "CommentPost",
  components: {},
  props: {
    show: {
      type: Boolean,
      defalut: true,
    },
    articleId: {
      type: [Number, String, Object],
      required: true,
    },
  },
  data() {
    return {
      inputComment: "",
    };
  },
  computed: {},
  watch: {
    //   侦听评论弹出层，当其为true时，评论输入框获取焦点
    show: {
      handler(show) {
        // console.log(this.show);
        if (show) {
          //   console.log(this.$refs.input);
          this.$nextTick(() => {
            // console.log(this.$refs.input);
            this.$refs.input.focus();
          });
        }
      },
      // 首次监视触发
      immediate: true,
    },
  },
  created() {
    // this.load();
  },

  methods: {
    async publishComment() {
      const query = {
        target: this.articleId, // 评论的目标id（评论文章即为文章id，评论回复即为评论id）
        content: this.inputComment, // 评论内容
        art_id: null, // 文章id，对评论内容发表回复时，需要传递此参数，表明所属文章id，对文章进行评论，不要传此参数
      };
      const res = await addComment(query);
      //   console.log(res);
      if (res.status === 201) {
        this.$toast("评论成功");
      } else if (res.status === 403) {
        this.$toast("文章已关闭评论");
      } else {
        this.$toast("操作失败，请稍后重试");
      }
      this.$emit("post-success", res.data.data); // 像这种需要修改多个数据的，且并不是全部在父组件内的数据，可以直接将数据想办法统一放到父组件进行修改
      this.inputComment = ""; // 清空文本域的内容
    },
  },
};
</script>

<style scoped lang='less'>
.comment-post {
  display: flex;
  align-items: center;
  padding: 32px 0 32px 32px;
  .post-field {
    background-color: #f5f7f9;
  }
  .post-btn {
    width: 150px;
    border: none;
    padding: 0;
    color: #6ba3d8;
    background: none;
    &::before {
      display: none;
    }
  }
}
</style>