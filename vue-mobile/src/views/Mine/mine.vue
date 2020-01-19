<template>
    <div style="width: 100%;height: 100vh;background-color: #eeeeee;">
        <div class="head">
            <div class="head-detail" @click="$router.push('/mine/myinfo')">
                <div><img :src="accountInfo.headImg" alt=""></div>
                <div style="display: flex;;flex-direction: column;justify-content: space-between;width: 100%;">
                    <div style="font-weight: 700;font-size: 1.8rem;margin-top: 0.5rem">{{this.accountInfo.nickname}}</div>
                    <div style="display: flex;margin-bottom: 0.2rem; color: #aaa;font-size: 1.4rem;justify-content: space-between;width: 100%;">
                        <div style="vertical-align: middle;display: inline-block;line-height: 2rem">账号：{{accountInfo.account}}</div>
                        <img src="../../assets/left.png" alt="" style="width: 1.2rem;height: 1.2rem;margin-right: 0;margin-top: 0.5rem">
                    </div>
                </div>
            </div>
        </div>
        <div @click="$router.push('/mine/mypay')">
            <mt-cell title="我的钱包" style="margin: 1rem 0;" is-link>
                <img slot="icon" src="../../assets/pay.png" width="24" height="24">
            </mt-cell>
        </div>
        <div @click="$router.push('/mine/mysave')">
        <mt-cell title="我的收藏" style="border-bottom: 1px solid #eee" is-link>
            <img slot="icon" src="../../assets/box.png" width="24" height="24">
        </mt-cell>
        </div>
        <div @click="$router.push('/mine/mycart')">
            <mt-cell title="我的购物中心" style="border-bottom: 1px solid #eee" is-link>
                <img slot="icon" src="../../assets/shopcar1.png" width="24" height="24">
            </mt-cell>
        </div>
        <div @click="$router.push('/mine/mymarket')">
            <mt-cell title="成为商家" style="" is-link>
                <img slot="icon" src="../../assets/market.png" width="24" height="24">
            </mt-cell>
        </div>
        <div @click="$router.push('/mine/myfeedback')">
            <mt-cell title="意见反馈" style="" is-link>
                <img slot="icon" src="../../assets/feedback.png" width="24" height="24">
            </mt-cell>
        </div>
        <div @click="$router.push('/mine/mysettings')">
            <mt-cell title="我的设置" style="margin: 1rem 0;" is-link>
                <img slot="icon" src="../../assets/setting.png" width="24" height="24">
            </mt-cell>
        </div>
        <div class="version">
            当前版本 1.2.2
        </div>
    </div>
</template>

<script>
import api from '../../api'
export default {
    data(){
        return{
            accountId:'',
            accountInfo:''
        }
    },
    methods:{
        getUser(){
            api.showAccount({id:this.accountId}).then((res)=>{
                this.accountInfo = res.model
            })
        },
        
    },
    mounted (){
        this.getUser()
  },
  created(){
    this.accountId = window.sessionStorage.getItem('id')
  }
}
</script>

<style lang="scss" scoped>
    .head{
        background-color: #fff;
        padding: 3rem 1.1rem;
        .head-detail{
            display: flex;
            img {
                width: 5rem;
                height: 5rem;
                margin-right: 2rem;
            }
        }
    }
    .version{
        margin: 0 auto;
        text-align: center;
        height: 2rem;
        line-height: 2rem;
        font-size: 0.6rem;
        color: grey;
    }

</style>
