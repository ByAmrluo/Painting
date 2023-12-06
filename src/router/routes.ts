
// 定义常量路由
export const routes = [
    {
        path: '/',
        name: 'Root',
        redirect: '/home'
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/Login/Login.vue')
    },
    {
        path: '/home',
        name: 'Home',
        component: () => import('@/views/Home/Home.vue'),

    },
    {
        path: '/add',
        name: 'Add',
        component: () => import('@/views/Add/AddArticle.vue'),
    },
    {
        path: '/preview',
        name: 'Preview',
        component: () => import('@/views/Preview/preview.vue'),
    },
    {
        path: '/detail/:id',
        name: 'Detail',
        component: () => import('@/views/Preview/preview.vue'),
    },
    {
        path: '/designer',
        name: 'Designer',
        component: () => import('@/views/Designer/Designer.vue'),
    },
    {
        path: '/mypage/:userid',
        name: 'MyPage',
        component: () => import('@/views/MyPage/MyPage.vue'),
    },
    {
        path: '/:pathMatch(.*)*',
        //动态导入
        redirect: '/404',
        name: 'Any',

    },
    {
        path: '/404',
        name: '404',
        component: () => import('@/views/404/404.vue')
    },
    {
        path: '/Search',
        name: 'Search',
        component: () => import('@/views/Search/Seach.vue')
    },
    {
        path: '/Appoint',
        name: '/appoint',
        component: () => import('@/views/Appoint/Appoint.vue')
    }
]
