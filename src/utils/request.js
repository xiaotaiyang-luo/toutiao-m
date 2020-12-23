import axios from 'axios'
import store from '@/store'
import router from '@/router'
//  导入json-bigint插件
import JSONBig from 'json-bigint'

// 通过axios的create的方法创建一个axios的实例，在这个实例中配置公共配置
const request = axios.create({
    baseURL: "http://ttapi.research.itcast.cn/",// 基础路径


    //  transformResponse  自定义后端返回的原始数据
    // data：后端返回的原始数据，说白了就是 JSON 格式字符串转为 JavaScript 对象
    /* 因为在做文章详情时需要用到文章id，这个id的数字已经超出了JavaScript 的整数可用范围，
    会产生数据请求报错，为了确保请求数据能够顺利，在此处修改服务器返回的数据，
    利用json-bigint插件使得其转换为能够有效发起请求的对象  
    至于发起请求时需要转换为字符串就不需要担心了
    在封装的请求方式中，使用了拼接字符串的形式，已经隐式转换为字符串了*/
    transformResponse: [function (data) {
        try {
            // 如果是json格式的字符串，就转换为对象
            return JSONBig.parse(data)
        } catch (error) {
            // 不是正确的json字符串就直接输出返回的数据
            return data
        }

        // return data;
    }],
})

// 请求拦截器
request.interceptors.request.use(function (config) {

    const user = store.state.user;  // store中存储的user，也就是token信息
    // console.log(user);
    // 拦截请求，统一配置token  如果有user并且user内存有token才能进行配置
    if (user && user.token) {
        config.headers.Authorization = `Bearer ${user.token}`
    }
    // console.log(config);
    return config
},
    function (error) {
        // Do something with request error
        return Promise.reject(error);
    })

// 响应拦截器
request.interceptors.response.use(function (response) {
    // 响应成功，直接返回响应结果即可    
    return response
}, async function (error) {
    // console.dir(error)
    // console.log(error.response);
    if (error.response && error.response.status === 401) {
        const user = store.state.user
        // 在token失效时
        // 如果没有任何token信息（user中存储的token和refresh_token），或者没有refresh_token，就证明需要重新登录
        if (!user || !user.refresh_token) {
            router.push('/login')
            return
        }
        // 不适用try...catch
        const res = await axios({
            method: 'PUT',
            url: 'http://ttapi.research.itcast.cn/app/v1_0/authorizations',
            headers: {
                Authorization: `Bearer ${user.refresh_token}`
            }
        })
        // console.log(111, res);
        if (res.status === 201) {
            // 如果获取成功，则把新的 token 更新到容器中
            console.log("刷新 token  成功", res);
            store.commit("setToken", {
                token: res.data.data.token, // 最新获取的可用 token
                refresh_token: user.refresh_token // 还是原来的 refresh_token
            });
            // 把之前失败的用户请求继续发出去
            // config 是一个对象，其中包含本次失败请求相关的那些配置信息，例如 url、method 都有
            // return 把 request 的请求结果继续返回给发请求的具体位置
            return request(error.config);
        } else {
            // 如果获取失败，直接跳转 登录页
            console.log("请求刷新 token 失败", error);
            router.push("/login");
        }
    }
    // console.log(error.response);
    return Promise.resolve(error.response);  // 这里不是使用try。。。catch的话，需要返回一个成功的对象，这样在发起请求的时候，才能在响应数据中接收到拦截器返回的值

    // 如果有refresh_token，则请求获取新的 token 
    // try {
    //     const res = await axios({
    //         method: 'PUT',
    //         url: 'http://ttapi.research.itcast.cn/app/v1_0/authorizations',
    //         headers: {
    //             Authorization: `Bearer ${user.refresh_token}`
    //         }
    //     })
    //     // 如果获取成功，则把新的 token 更新到容器中
    //     console.log("刷新 token  成功", res);
    //     store.commit("setToken", {
    //         token: res.data.data.token, // 最新获取的可用 token
    //         refresh_token: user.refresh_token // 还是原来的 refresh_token
    //     });
    //     // 把之前失败的用户请求继续发出去
    //     // config 是一个对象，其中包含本次失败请求相关的那些配置信息，例如 url、method 都有
    //     // return 把 request 的请求结果继续返回给发请求的具体位置
    //     return request(error.config);
    // } catch (err) {
    //     // 如果获取失败，直接跳转 登录页
    //     console.log("请求刷新 token 失败", err);
    //     router.push("/login");
    // }
    // }
    // return Promise.reject(error);



})


// 封装请求方法
export const Get = (url, params) => {
    return request.get(url, { params: params })
}

export const Delete = (url, params) => {
    return request.delete(url, { params: params })
}

export const Post = (url, params) => {
    return request.post(url, params)
}

export const Put = (url, params) => {
    return request.put(url, params)
}
export const Patch = (url, params) => {

    return request.patch(url, params)
}

