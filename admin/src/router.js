import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path:'/login',
      name:'login',
      component:() => import('./views/login.vue'),
      meta:{ isPublic:true}
    },
    {
      path: '/',
      name: 'home',
      component: Home,
      redirect:'/userList',
      children:[
        // 用户
        {
          path: '/userAdd',
          name: 'userAdd',
          component: () => import('./views/User/userAdd.vue')
        },
        {
          path: '/userEdit/:id',
          name: 'userEdit',
          component: () => import('./views/User/userAdd.vue'),
          props:true
        },
        {
          path: '/userList',
          name: 'userList',
          component: () => import('./views/User/userList.vue')
        },
        // 商品
        {
          path: '/goodsAdd',
          name: 'goodsAdd',
          component: () => import('./views/Goods/goodsAdd.vue')
        },
        {
          path: '/goodsEdit/:id',
          name: 'goodsEdit',
          component: () => import('./views/Goods/goodsAdd.vue'),
          props:true
        },
        {
          path: '/goodsList',
          name: 'goodsList',
          component: () => import('./views/Goods/goodsList.vue')
        },
        //文章
        {
          path: '/articleClassAdd',
          name: 'articleClassAdd',
          component: () => import('./views/Article/articleClassAdd.vue')
        },
        {
          path: '/articleClassEdit/:id',
          name: 'articleClassEdit',
          component: () => import('./views/Article/articleClassAdd.vue'),
          props:true
        },
        {
          path: '/articleClassList',
          name: 'articleClassList',
          component: () => import('./views/Article/articleClassList.vue')
        },
        {
          path: '/articleAdd',
          name: 'articleAdd',
          component: () => import('./views/Article/articleAdd.vue')
        },
        {
          path: '/articleEdit/:id',
          name: 'articleEdit',
          component: () => import('./views/Article/articleAdd.vue'),
          props:true
        },
        {
          path: '/articleList',
          name: 'articleList',
          component: () => import('./views/Article/articleList.vue')
        },
        //管理员
        {
          path: '/adminAdd',
          name: 'adminAdd',
          component: () => import('./views/AdminUser/adminAdd.vue')
        },
        {
          path: '/adminEdit/:id',
          name: 'adminEdit',
          component: () => import('./views/AdminUser/adminAdd.vue'),
          props:true
        },
        {
          path: '/adminList',
          name: 'adminList',
          component: () => import('./views/AdminUser/adminList.vue')
        },
        //计划
        {
          path: '/planmakerAdd',
          name: 'planmakerAdd',
          component: () => import('./views/Plans/planmakerAdd.vue')
        },
        {
          path: '/planmakerList',
          name: 'planmakerList',
          component: () => import('./views/Plans/planmakerList.vue')
        },
        {
          path: '/planmakerEdit/:id',
          name: 'planmakerEidt',
          component: () => import('./views/Plans/planmakerAdd.vue'),
          props:true
        },
        {
          path: '/planAdd',
          name: 'planAdd',
          component: () => import('./views/Plans/planAdd.vue')
        },
        {
          path: '/planList',
          name: 'planList',
          component: () => import('./views/Plans/planList.vue')
        },
        {
          path: '/planEdit/:id',
          name: 'planEidt',
          component: () => import('./views/Plans/planAdd.vue'),
          props:true
        },
        //mobile账户
        {
          path: '/accountList',
          name: 'accountList',
          component: () => import('./views/Account/accountList.vue')
        },
        //反馈
        {
          path: '/feedbackList',
          name: 'feedbackList',
          component: () => import('./views/Feedback/feedback.vue')
        },
      ]
    },

  ]
})

router.beforeEach((to,from,next)=>{
  if(!to.meta.isPublic && !sessionStorage.token){
    return next('/login')
  }
  next()
})


export default router