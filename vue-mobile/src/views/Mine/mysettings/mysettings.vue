<template>
    <div style="width: 100%;height: 100vh;background-color: #fafafa;">
        <mt-header title="我的设置" style="background-color:#f1f1f1;color: #222222;font-size: 1.2rem;height:4rem">
            <router-link to="/mine" slot="left">
                <mt-button icon="back"></mt-button>
            </router-link>
            <!-- <div slot="right" style="font-size:1.3rem;color:#222222" @click="change">
                完成
            </div> -->
        </mt-header>
        <div style="margin:1rem 0">
            <div style="margin:0 0.8rem 0.5rem;color:#999">自动登陆控制：(仅仅是该浏览器生效)</div>
            <mt-cell title="自动登陆" style="margin:0;">
                <mt-switch v-model="value" @change="updateAuto">{{value === false?'关闭':'开启'}}</mt-switch>
            </mt-cell>
            <div @click="$router.push('/mine/receaddress')">
            <mt-cell title="管理我的收货地址" style="margin: 1rem 0;" is-link>
                <!-- <img slot="icon" src="../../assets/setting.png" width="24" height="24"> -->
            </mt-cell>
        </div>
        </div>

    </div>
</template>

<script>
// import api from '../../../api'
import { Toast } from 'mint-ui'
export default {
    data(){
        return{
            value:false,
            accountId:null
        }
    },
    methods:{
        showflag(){
            // this.accountId = window.sessionStorage.getItem('id')
            if(window.localStorage.account !== window.sessionStorage.getItem('account')){
                window.localStorage.account = window.sessionStorage.getItem('account')
            }
            if(window.localStorage.autoLogin == 1) {
                this.value = true
            } else if(window.localStorage.autoLogin == 0){
                this.value = false
            }
             
            // api.showAutoLogin({id:this.accountId}).then((res)=>{
            //     // console.log(res)
            //     this.value = res.autoLogin
            // })
        },
        updateAuto(e){
            if(!e){
                window.localStorage.autoLogin = 1
                window.localStorage.account = window.sessionStorage.getItem('account')
                Toast('修改成功')
                // api.updateAutoLogin({id:this.accountId,autoLogin:true}).then((res)=>{
                //     // console.log(res)
                //     Toast(res.message)
                // })
            } else if(e) {
                window.localStorage.autoLogin = 0
                window.localStorage.removeItem('account')
                Toast('修改成功')
                // api.updateAutoLogin({id:this.accountId,autoLogin:false}).then((res)=>{
                //     // console.log(res)
                //     Toast(res.message)
                // })
            }
        }
    },
    mounted(){
        this.showflag()
    }
}
</script>