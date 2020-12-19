import { Get, Patch, Delete } from '@/utils/request'
// 获取全部频道数据
export const getAllChannel = () => {
    return Get('/app/v1_0/channels')
}

// 获取修改后的频道数据
export const addUserChannel = (data) => {
    return Patch('/app/v1_0/user/channels', data)
}
// 删除指定用户频道
export const deleteUserChannel = (channelId) => {
    return Delete(`/app/v1_0/user/channels/${channelId}`)
}