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
      redirect:(item)=>{
        // console.log(item,sessionStorage.authflag)
       return sessionStorage.authflag==='1'?'/homepage':'/sellerpage'
      },
      children:[
        //首页
        {
          path: '/homepage',
          name: 'homepage',
          component: () => import('./views/homepage.vue'),
          meta:{name:'首页'}
        },
        {
          path: '/sellerpage',
          name: 'sellerpage',
          component: () => import('./views/sellerpage.vue'),
          meta:{name:'首页'}
        },
        //用户发售商品
        {
          path: '/selling',
          name: 'selling',
          component: () => import('./views/Seller/seller.vue'),
          meta:{name:'发售商品'}
        },
        {
          path: '/editseller/:id',
          name: 'seller',
          component: () => import('./views/Seller/seller.vue'),
          props:true,
          meta:{name:'编辑商品'}
        },
        {
          path: '/myprolist',
          name: 'myprolist',
          component: () => import('./views/Seller/myprolist.vue'),
          meta:{name:'我的商品列表'}
        },
        // 用户
        {
          path: '/userAdd',
          name: 'userAdd',
          component: () => import('./views/User/userAdd.vue'),
          meta:{name:'我的商品列表'}
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
          component: () => import('./views/Goods/goodsAdd.vue'),
          meta:{name:'编辑商品'}
        },
        {
          path: '/goodsEdit/:id',
          name: 'goodsEdit',
          component: () => import('./views/Goods/goodsAdd.vue'),
          props:true,
          meta:{name:'编辑商品'}
        },
        {
          path: '/goodsList',
          name: 'goodsList',
          component: () => import('./views/Goods/goodsList.vue'),
          meta:{name:'商品列表'}
        },
        //文章
        {
          path: '/articleClassAdd',
          name: 'articleClassAdd',
          component: () => import('./views/Article/articleClassAdd.vue'),
          meta:{name:'添加文章类别'}
        },
        {
          path: '/articleClassEdit/:id',
          name: 'articleClassEdit',
          component: () => import('./views/Article/articleClassAdd.vue'),
          props:true,
          meta:{name:'修改文章类别'}
        },
        {
          path: '/articleClassList',
          name: 'articleClassList',
          component: () => import('./views/Article/articleClassList.vue'),
          meta:{name:'文章类别列表'}
        },
        {
          path: '/articleAdd',
          name: 'articleAdd',
          component: () => import('./views/Article/articleAdd.vue'),
          meta:{name:'添加文章'}
        },
        {
          path: '/articleEdit/:id',
          name: 'articleEdit',
          component: () => import('./views/Article/articleAdd.vue'),
          props:true,
          meta:{name:'修改文章'}
        },
        {
          path: '/articleList',
          name: 'articleList',
          component: () => import('./views/Article/articleList.vue'),
          meta:{name:'文章列表'}
        },
        //管理员
        {
          path: '/adminAdd',
          name: 'adminAdd',
          component: () => import('./views/AdminUser/adminAdd.vue'),
          meta:{name:'添加管理员'}
        },
        {
          path: '/adminEdit/:id',
          name: 'adminEdit',
          component: () => import('./views/AdminUser/adminAdd.vue'),
          props:true,
          meta:{name:'修改管理员'}
        },
        {
          path: '/adminList',
          name: 'adminList',
          component: () => import('./views/AdminUser/adminList.vue'),
          meta:{name:'管理员列表'}
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
          component: () => import('./views/Account/accountList.vue'),
          meta:{name:'用户列表'}
        },
        //反馈
        {
          path: '/feedbackList',
          name: 'feedbackList',
          component: () => import('./views/Feedback/feedback.vue'),
          meta:{name:'反馈列表'}
        },
        //广告
        {
          path: '/setAd',
          name: 'setAd',
          component: () => import('./views/Ad/adEdit.vue'),
          meta:{name:'广告价钱与时长管理'}
        },
        {
          path: '/Adlist',
          name: 'Adlist',
          component: () => import('./views/Ad/adList.vue'),
          meta:{name:'广告申请列表管理'}
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