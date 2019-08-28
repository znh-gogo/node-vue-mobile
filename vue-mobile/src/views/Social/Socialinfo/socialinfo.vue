<template>
    <div>
        <mt-header title="用户信息" style="background-color:#fafafa;color: #222222;font-size: 1.2rem;height:4rem">
            <router-link to="/social" slot="left">
                <mt-button icon="back"></mt-button>
            </router-link>
            <!--            <mt-button icon="more" slot="right"></mt-button>-->
        </mt-header>
        <div class="head">
            <div class="head-detail" @click="$router.push('/mine/myinfo')">
                <img :src="userinfo.headImg" alt="">
                <div style="display: flex;;flex-direction: column;justify-content: space-between;width: 100%;">
                    <div style="font-weight: 700;font-size: 1.8rem;margin-top: 0.5rem">{{userinfo.nickname}}</div>
                    <div style="display: flex;margin-bottom: 0.2rem; color: #aaa;font-size: 1.4rem;justify-content: space-between;width: 100%;">
                        <div style="vertical-align: middle;display: inline-block;line-height: 2rem">账号：{{userinfo.account}}</div>
                        <!-- <img src="../../../assets/left.png" alt="" style="width: 1.2rem;height: 1.2rem;margin-right: 0;margin-top: 0.5rem"> -->
                    </div>
                </div>
            </div>
        </div>
        <div style="padding:0 2rem;font-size:1.2rem">
            <div style="margin-bottom:0.5rem">邮箱：{{userinfo.email}}</div>
            <div>个性签名：{{userinfo.description}}</div>
        </div>
    </div>
</template>

<script>
import api from '../../../api'
export default {
    data(){
        return{
            userinfo:''
        }
    },
    methods:{
        getUser(){
            api.showAccount(this.$route.query.id,null).then((res)=>{
                this.userinfo = res
                console.log(res)
            })
        },
    },
    mounted(){
        this.getUser()
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
                width: 6rem;
                height: 5rem;
                margin-right: 2rem;
            }
        }
    }
</style>