// 按需导入封装好的请求方式 
import { Get, Post, Delete } from '@/utils/request.js'

// 获取评论数据 或评论回复
export const getCommentList = (params) => {
    return Get('/app/v1_0/comments', params)
}

// 评论点赞 或 评论回复点赞
export const addCommentLike = (commentId) => {
    return Post('/app/v1_0/comment/likings', { target: commentId })
}
// 取消评论点赞 或 评论回复点赞
export const deleteCommentLike = (commentId) => {
    return Delete(`/app/v1_0/comment/likings/${commentId}`)
}


// 添加评论 或 评论回复
export const addComment = (params) => {
    return Post('/app/v1_0/comments', params)
}

