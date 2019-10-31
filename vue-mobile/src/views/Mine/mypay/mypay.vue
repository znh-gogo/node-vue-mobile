<template>
    <div style="width: 100%;height: 100vh;background-color: #fff;">
        <mt-header title="我的钱包" style="background-color:#f1f1f1;color: #222222;font-size: 1.2rem;height:4rem">
            <router-link to="/mine" slot="left">
                <mt-button icon="back"></mt-button>
            </router-link>
            <mt-button icon="more" slot="right" @click="$router.push('/mine/mypay/setpaypassword')"></mt-button>
            <!-- <div slot="right" style="font-size:1.3rem;color:#222222" @click="change">
                完成
            </div> -->
        </mt-header>
        <div style="width:100%;text-align:center">
            <img src="../../../assets/钱袋.png" alt="" style="margin-top:1rem">
            <div>我的零钱</div>
            <div style="font-size:3rem;font-weight:bold;margin-top:1.5rem">￥{{money}}</div>
            <mt-button type="primary" style="width: 30%;margin-top:5rem;" @click="$router.push('/mine/mypay/recharge')">充值</mt-button>
        </div>
    </div>
</template>

<script>
import api from '../../../api'
export default {
    data (){
        return{
            money:''
        }
    },
    methods:{
        getmoney(){
            let id = window.sessionStorage.getItem('id')
            api.showMyMoney({id}).then(res =>{
                this.money = res.money
                if(this.money === parseInt(this.money)){
                    this.money = this.money + '.00' 
                }
            })
        }
    },
    mounted(){
        this.getmoney()
    }
}
</script>