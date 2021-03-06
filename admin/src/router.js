import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

/**
 * bug:修复router的promise问题。
 * 也可以install @3.1.1以上的router也可以解决这个问题
 */
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const router = new Router({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path:'/login',
      name:'login',
      component:() => import('./views/login.vue'),
      meta:{ isPublic:true,name:'登陆页'}
    },
    {
      path:'/origin',
      name:'origin',
      component:() => import('./views/origin.vue'),
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
          meta:{name:'管理首页',tab:true}
        },
        {
          path: '/sellerpage',
          name: 'sellerpage',
          component: () => import('./views/sellerpage.vue'),
          meta:{name:'商家首页',tab:true}
        },
        //用户发售商品
        {
          path: '/selling',
          name: 'selling',
          component: () => import('./views/Seller/seller.vue'),
          meta:{name:'发售商品',tab:true}
        },
        {
          path: '/editseller/:id',
          name: 'seller',
          component: () => import('./views/Seller/seller.vue'),
          props:true,
          meta:{name:'编辑商品',tab:true}
        },
        {
          path: '/myprolist',
          name: 'myprolist',
          component: () => import('./views/Seller/myprolist.vue'),
          meta:{name:'我的商品列表',tab:true}
        },
        // 用户
        {
          path: '/userAdd',
          name: 'userAdd',
          component: () => import('./views/User/userAdd.vue'),
          meta:{name:'我的商品列表',tab:true}
        },
        {
          path: '/userEdit',
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
          meta:{name:'编辑商品',tab:true}
        },
        {
          path: '/goodsEdit/:id',
          name: 'goodsEdit',
          component: () => import('./views/Goods/goodsAdd.vue'),
          props:true,
          meta:{name:'编辑商品',tab:true}
        },
        {
          path: '/goodsList',
          name: 'goodsList',
          component: () => import('./views/Goods/goodsList.vue'),
          meta:{name:'商品列表',tab:true}
        },
        //文章
        {
          path: '/articleClassAdd',
          name: 'articleClassAdd',
          component: () => import('./views/Article/articleClassAdd.vue'),
          meta:{name:'添加文章类别',tab:true}
        },
        {
          path: '/articleClassEdit/:id',
          name: 'articleClassEdit',
          component: () => import('./views/Article/articleClassAdd.vue'),
          meta:{name:'修改文章类别',tab:true},
          props:true,
        },
        {
          path: '/articleClassList',
          name: 'articleClassList',
          component: () => import('./views/Article/articleClassList.vue'),
          meta:{name:'文章类别列表',tab:true}
        },
        {
          path: '/articleAdd',
          name: 'articleAdd',
          component: () => import('./views/Article/articleAdd.vue'),
          meta:{name:'添加文章',tab:true}
        },
        {
          path: '/articleEdit/:id',
          name: 'articleEdit',
          component: () => import('./views/Article/articleAdd.vue'),
          props:true,
          meta:{name:'修改文章',tab:true}
        },
        {
          path: '/articleList',
          name: 'articleList',
          component: () => import('./views/Article/articleList.vue'),
          meta:{name:'文章列表',tab:true}
        },
        //管理员
        {
          path: '/adminAdd',
          name: 'adminAdd',
          component: () => import('./views/AdminUser/adminAdd.vue'),
          meta:{name:'添加管理员',tab:true}
        },
        {
          path: '/adminEdit',
          name: 'adminEdit',
          component: () => import('./views/AdminUser/adminAdd.vue'),
          props:true,
          meta:{name:'修改管理员',tab:true}
        },
        {
          path: '/adminList',
          name: 'adminList',
          component: () => import('./views/AdminUser/adminList.vue'),
          meta:{name:'管理员列表',tab:true}
        },
        //计划
        {
          path: '/planmakerAdd',
          name: 'planmakerAdd',
          component: () => import('./views/Plans/planmakerAdd.vue'),
          meta:{name:'添加计划人',tab:true}
        },
        {
          path: '/planmakerList',
          name: 'planmakerList',
          component: () => import('./views/Plans/planmakerList.vue'),
          meta:{name:'计划人列表',tab:true}
        },
        {
          path: '/planmakerEdit/:id',
          name: 'planmakerEidt',
          component: () => import('./views/Plans/planmakerAdd.vue'),
          meta:{name:'计划人编辑',tab:true},
          props:true
        },
        {
          path: '/planAdd',
          name: 'planAdd',
          component: () => import('./views/Plans/planAdd.vue'),
          meta:{name:'添加计划',tab:true}
        },
        {
          path: '/planList',
          name: 'planList',
          component: () => import('./views/Plans/planList.vue'),
          meta:{name:'计划列表',tab:true}
        },
        {
          path: '/planEdit/:id',
          name: 'planEidt',
          component: () => import('./views/Plans/planAdd.vue'),
          meta:{name:'计划编辑',tab:true},
          props:true
        },
        //mobile账户
        {
          path: '/accountList',
          name: 'accountList',
          component: () => import('./views/Account/accountList.vue'),
          meta:{name:'用户列表',tab:true}
        },
        //反馈
        {
          path: '/feedbackList',
          name: 'feedbackList',
          component: () => import('./views/Feedback/feedback.vue'),
          meta:{name:'反馈列表',tab:true}
        },
        //广告
        {
          path: '/setAd',
          name: 'setAd',
          component: () => import('./views/Ad/adEdit.vue'),
          meta:{name:'广告价钱与时长管理',tab:true}
        },
        {
          path: '/Adlist',
          name: 'Adlist',
          component: () => import('./views/Ad/adList.vue'),
          meta:{name:'广告申请列表管理',tab:true}
        },
        {
          path: '/Adapply',
          name: 'Adapply',
          component: () => import('./views/Ad-seller/adApply.vue'),
          meta:{name:'广告申请',tab:true}
        },
        {
          path: '/Adapplyedit/:id',
          name: 'Adapplyedit',
          component: () => import('./views/Ad-seller/adApply.vue'),
          meta:{name:'广告申请修改',tab:true},
          props:true
        },
        {
          path: '/myAdList',
          name: 'myAdList',
          component: () => import('./views/Ad-seller/myAdList.vue'),
          meta:{name:'我的广告列表',tab:true}
        },
        //日志
        {
          path: '/logList',
          name: 'logList',
          component: () => import('./views/Log/LogList.vue'),
          meta:{name:'操作日志管理',tab:true}
        },
      ]
    },
    {
      path:'*',
      name:'404',
      component:() => import('./views/404/index.vue'),
      meta:{ isPublic:true}
    }
  ]
})

router.beforeEach((to,from,next)=>{
  if(!to.meta.isPublic && !sessionStorage.token){
    return next('/login')
  }
  window.document.title = '农商服务平台-'+to.meta.name || '农产品电商服务平台'
  next()
})


export default router