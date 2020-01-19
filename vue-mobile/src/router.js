import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home/home.vue'
import Conversation from './views/Conversation/conversation.vue'
import Social from './views/Social/social.vue'
import Mine from './views/Mine/mine.vue'
import Main from './views/Main.vue'
import { Toast } from 'mint-ui'


Vue.use(Router)

const router = new Router({
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
        return savedPosition
    } else {
        return {
            x: 0,
            y: 0
        }
    }
},
  // mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path:'/login',
      name:'login',
      component: () => import('./views/Login/login.vue'),
      meta:{ isPublic:true}
    },
    {
      path:'/register',
      name:'register',
      component: () => import('./views/Login/register.vue'),
      meta:{ isPublic:true}
    },
    {
      path: '/',
      name: 'Main',
      component: Main,
      children:[
        {
          path: '/',
          redirect:'/home',
          meta:{keepAlive:true}
        },
        {
          path:'/home',
          name:'home',
          component:Home,
          meta:{keepAlive:true}
        },
        {
          path: '/conversation',
          name: 'conversation',
          component:Conversation
        },
        {
          path: '/social',
          name: 'social',
          component: Social,
          // meta:{keepAlive:true}
        },
        {
          path: '/mine',
          name: 'mine',
          component: Mine
        },
        {
          path:'/good-detail',
          name:'good-detail',
          component: () => import('./views/Home/GoodDetail.vue'),
          meta:{keepAlive:true}
        },
        {
          path:'/order-detail',
          name:'order-detail',
          component: () => import('./views/Home/OrderDetail.vue')
        },
      ]
    },
    {
      path:'/mine/myinfo',
      name:'myinfo',
      component: () => import('./views/Mine/myinfo/myinfo.vue')
    },
    {
      path:'/mine/myinfo/changenickname',
      name:'changenickname',
      component: () => import('./views/Mine/myinfo/changenickname.vue')
    },
    {
      path:'/mine/myinfo/changeemail',
      name:'changeemail',
      component: () => import('./views/Mine/myinfo/changeemail.vue')
    },
    {
      path:'/mine/myinfo/changetelephone',
      name:'changetelephone',
      component: () => import('./views/Mine/myinfo/changetelephone.vue')
    },
    {
      path:'/mine/myinfo/changepassword',
      name:'changepassword',
      component: () => import('./views/Mine/myinfo/changepassword.vue')
    },
    {
      path:'/mine/myinfo/changedescription',
      name:'changedescription',
      component: () => import('./views/Mine/myinfo/changedescription.vue')
    },
    {
      path:'/mine/myinfo/changeheadimg',
      name:'changeheadimg',
      component: () => import('./views/Mine/myinfo/changeheadimg.vue')
    },
    {
      path:'/mine/myinfo/changeaddress',
      name:'changeaddress',
      component: () => import('./views/Mine/myinfo/changeaddress.vue')
    },
    {
      path:'/mine/mysettings',
      name:'mysettings',
      component: () => import('./views/Mine/mysettings/mysettings.vue')
    },
    {
      path:'/mine/mysave',
      name:'mysave',
      component: () => import('./views/Mine/mysave/mysave.vue')
    },
    {
      path:'/mine/mycart',
      name:'mycart',
      component: () => import('./views/Mine/mycart/mycart.vue')
    },
    {
      path:'/mine/myfeedback',
      name:'myfeedback',
      component: () => import('./views/Mine/myfeedback/myfeedback.vue')
    },
    {
      path:'/mine/mymarket',
      name:'mymarket',
      component: () => import('./views/Mine/mymarket/beseller.vue')
    },
    {
      path:'/mine/mypay',
      name:'mypay',
      component: () => import('./views/Mine/mypay/mypay.vue')
    },
    {
      path:'/mine/mypay/setpaypassword',
      name:'setpaypassword',
      component: () => import('./views/Mine/mypay/setpaypassword.vue')
    },
    {
      path:'/mine/mypay/recharge',
      name:'recharge',
      component: () => import('./views/Mine/mypay/recharge.vue')
    },
    {
      path:'/mine/checkmyfeedback',
      name:'checkmyfeedback',
      component: () => import('./views/Mine/myfeedback/checkmyfeedback.vue')
    },
    {
      path:'/mine/receaddress',
      name:'receaddress',
      component: () => import('./views/Mine/mysettings/receaddress.vue')
    },
    {
      path:'/social/info',
      name:'info',
      component: () => import('./views/Social/Socialinfo/socialinfo.vue')
    },
    {
      path:'/social/sendtopic',
      name:'sendtopic',
      component: () => import('./views/Social/Socialinfo/sendtopic.vue')
    },
    {
      path:'/social/privateletter',
      name:'privateletter',
      component: () => import('./views/Social/Socialinfo/privateletter.vue')
    },
    {
      path:'/social/news-content',
      name:'news-content',
      component: () => import('./views/Social/News/news-content.vue')
    },
    {
      path:'/social/news',
      name:'news',
      component: () => import('./views/Social/News/news.vue')
    },
    {
      path:'/conversation/addconversation',
      name:'addconversation',
      component: () => import('./views/Conversation/addconversation.vue')
    },
    // {
    //   path:'/good-detail',
    //   name:'good-detail',
    //   component: () => import('./views/Home/GoodDetail.vue')
    // },

    {
      path: '*',
      redirect: '/home'
    }
  ]
})


router.beforeEach((to,from,next)=>{
  if(!to.meta.isPublic && !sessionStorage.getItem("token")){
    Toast('请重新登陆')
    return next('/login')
  }
  next()
})


export default router