/*
**文章列表相关请求
 */

import { Get, Post } from '@/utils/request'

// 获取文章列表数据
export const getArticles = (params) => {
    return Get('/app/v1_1/articles', params)
}

// 获取文章详情数据
export const getArticlePage = (articleId) => {
    return Get(`/app/v1_0/articles/${articleId}`)
}

