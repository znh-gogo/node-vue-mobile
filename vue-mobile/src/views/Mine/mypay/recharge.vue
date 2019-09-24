<template>
    <div style="width: 100%;height: 100vh;background-color: #fafafa;">
        <mt-header title="零钱充值" style="background-color:#f1f1f1;color: #222222;font-size: 1.2rem;height:4rem">
            <router-link to="/mine/mypay" slot="left">
                <mt-button icon="back"></mt-button>
            </router-link>
            <!-- <div slot="right" style="font-size:1.3rem;color:#222222" @click="change">
                完成
            </div> -->
        </mt-header>
        <div style="width:90%;background:#fff;margin:1rem auto;padding:1rem">
            <div>充值金额</div>
            <div style="margin-top:2rem;display:flex;border-bottom:1px solid #eee">
                <span style="font-size:2rem;line-height:2rem">￥</span><input type="text" placeholder="0.00" style="border:0;font-size:2rem;width:100%" v-model="money">
            </div>
            <div style="color:#666;margin-top:0.3rem">请输入充值金额，但不可大于10000</div>
            <mt-button type="primary" style="width: 100%;margin-top:2rem;" @click="recharges">充值</mt-button>
        </div>
    </div>
</template>

<script>
import api from '../../../api'
import { MessageBox } from 'mint-ui';
export default {
    data(){
        return{
            money:''
        }
    },
    methods:{
        recharges(){
            if(this.money === ''){
                MessageBox('提示', '输入金额不能为空')
                return
            }
            let id = window.sessionStorage.getItem('id')            
            api.recharge({id,money:this.money}).then(res => {
                MessageBox('提示', res.message).then(action => {
                    this.$router.go(-1)
                });
            })
        }
    }
}
</script>