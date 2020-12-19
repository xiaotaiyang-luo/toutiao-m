

import { Get } from '@/utils/request'
// 根据搜索框的内容获取搜索建议的数据
export const getSuggestionData = (params) => {
    return Get('/app/v1_0/suggestion', params)
}
// 获取搜索结果
export const getSearchResult = (data) => {
    return Get('/app/v1_0/search', data)
}

// 获取用户搜索历史
export const getUserSearchHistory = () => {
    return Get(' /app/v1_0/search/histories')
}