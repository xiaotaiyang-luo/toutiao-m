/*
**用户相关请求模块 
*/

// 按需导入封装好的请求方式 
import { Get, Post, Delete, Patch } from '@/utils/request.js'

// 登录请求
export const login = (data) => {
    return Post('/app/v1_0/authorizations', data)
}

// 发送验证码请求  注意，每个手机一分钟内容只能发送一次
export const getSms = (data) => {
    return Get(`/app/v1_0/sms/codes/${data}`)
}

// 发起获取用户自己的信息 
export const getUserSelfMsg = () => {
    return Get('/app/v1_0/user')
}

// 获取频道列表数据
export const getUserChannels = () => {
    return Get('/app/v1_0/user/channels')
}

// 关注用户
export const addFollowUser = (userId) => {
    return Post('/app/v1_0/user/followings', { target: userId })
}

// 取消关注用户
export const removeFollowUser = (userId) => {
    return Delete(`/app/v1_0/user/followings/${userId}`)
}

// 获取用户个人信息
export const getUserInfo = (target) => {
    return Get('/app/v1_0/user/profile', target)
}
// 编辑用户信息 需要什么传什么
export const editUserInfo = (params) => {
    return Patch('/app/v1_0/user/profile', params)
}

// 编辑用的照片资料
export const editUserPhoto = photo => {
    return Patch('/app/v1_0/user/photo', photo)
}


