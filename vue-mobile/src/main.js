import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
Vue.config.productionTip = false
import './style.scss'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'
import { Step, Steps,PasswordInput, NumberKeyboard,Search } from 'vant';
Vue.use(VueAwesomeSwiper)
Vue.use(MintUI)
Vue.use(Step).use(Steps).use(PasswordInput).use(NumberKeyboard).use(Search);
window.addEventListener('popstate', function (e) {
  router.isBack = true
},false)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
