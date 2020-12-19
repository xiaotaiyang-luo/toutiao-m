

// 导入各个组件
const Layout = () => import('@/views/layout') //  底部主导航组件
const Home = () => import('@/views/home')
const My = () => import('@/views/my')
const Qa = () => import('@/views/qa')
const Video = () => import('@/views/video')
const Search = () => import('@/views/search')
const Article = () => import('@/views/article')
export default [{
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [{
        path: '/home',
        component: Home
    },
    {
        path: '/my',
        component: My
    },
    {
        path: '/qa',
        component: Qa
    },
    {
        path: '/video',
        component: Video
    },
    ],
}, {
    path: '/search',
    name: 'search',
    component: Search
},
{
    // 动态路由，接收文章id1
    path: '/article/:articleId',
    name: 'article',
    component: Article,
    props: true // 开启 props 传参，说白了局势把路由参数映射到组件的props属性中去，达到解耦路由参数的作用
}]