/*
**文章列表相关请求
 */

import { Get, Post, Delete } from '@/utils/request'

// 获取文章列表数据
export const getArticles = (params) => {
    return Get('/app/v1_1/articles', params)
}

// 获取文章详情数据
export const getArticlePage = (articleId) => {
    return Get(`/app/v1_0/articles/${articleId}`)
}

// 收藏文章
export const addCollect = (articleId) => {
    return Post('/app/v1_0/article/collections', { target: articleId })
}
// 取消收藏文章
export const removeCollect = (articleId) => {
    return Delete(`/app/v1_0/article/collections/${articleId}`)
}

// 点赞文章
export const addLikeArticle = (articleId) => {
    return Post('/app/v1_0/article/likings', { target: articleId })
}

// 取消点赞文章
export const removeLikeArticle = (articleId) => {
    return Delete(`/app/v1_0/article/likings/${articleId}`)
}
