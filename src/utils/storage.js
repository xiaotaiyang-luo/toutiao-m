// 封装本地存储的方式

/*
** 本地存储---获取数据
*/
export const getItem = (key, name) => {
    const data = window.localStorage.getItem(key)
    try {
        // 也就是尝试着进行将数据转换为对象，能转换则返回转换后的对象数据，不能则抛出错误，也就代表不是对象数据，直接输出数据
        return JSON.parse(data)
    } catch (err) {
        // 不能进行转换，直接抛出数据
        return data
    }
}

/*
 ** 本地存储----存储数据 
 */
export const setItem = (key, data) => {
    // 判断数据是不是数组或对象，如果是，则就将其转为字符串进行存储，数组也是对象，所以判断是不是对象类型即可
    if (typeof data === 'object') {
        data = JSON.stringify(data)
    }
    window.localStorage.setItem(key, data)
}

/*
** 本地存储---删除数据
 */
export const removeItem = (key) => {
    window.localStorage.removeItem(key)
}