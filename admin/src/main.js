import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import http from './api/http'
import VueAwesomeSwiper from 'vue-awesome-swiper';
import 'swiper/dist/css/swiper.css';
import 'ionicons/dist/css/ionicons.css';
Vue.use(VueAwesomeSwiper, /* { default global options } */);
// import echarts from 'echarts'
Vue.use(element)
Vue.config.productionTip = false
Vue.prototype.$http=http
// Vue.prototype.$echarts = echarts

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
