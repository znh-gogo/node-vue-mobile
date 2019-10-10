<template>
    <div style="width: 100%;height: 100vh;background-color: #fafafa;">
        <mt-header title="订单详情" style="background-color:#f1f1f1;color: #222222;font-size: 1.2rem;height:4rem">
            <mt-button icon="back" slot="left" @click="$router.go(-1)"></mt-button>
        </mt-header>
        <div style="margin:4rem auto 2rem;text-align:center;" :class="[{'grey':goodinfo.buyflag === 0},{'red':goodinfo.buyflag === 1}]"><span style="font-size:3rem;">{{goodinfo.pro_price}}</span>元</div>
        <div style="width:100%;text-align:center;font-size:1.2rem;" :class="[{'grey':goodinfo.buyflag === 0},{'red':goodinfo.buyflag === 1}]">{{goodinfo.buyflag === 0?'未付款':'已付款'}}</div>
        <div style="width:100%;text-align:center;font-weight:700;margin:2rem 0">Tips:犹豫间有可能会被别人抢先哦~</div>
        <div class="line"></div>
        <div style="width:100%;padding:1rem;" v-if="addressflag">
            <div style="width:100%;justify-content:space-between;display:flex;">
                <div>
                    <span style="font-weight:700">{{buyaddress.re_name}}</span>
                    <span style="margin-left:2rem;">{{buyaddress.re_phone}}</span>
                </div>
                <a style="color:#409EFF;margin-right:1rem" @click="$router.push('/mine/receaddress')">管理地址</a>
            </div>
            <div style="margin-top:0.5rem;padding-right:1rem;">{{buyaddress.re_address}}</div>
        </div>
        <div v-if="!addressflag" style="width:100%;padding:1rem;text-align:center">您还没设置默认收货地址哦，<span style="color:#409EFF;" @click="$router.push('/mine/receaddress')">去设置</span></div>
        <div class="line"></div>
        <div style="width:100%;padding:1rem;">
            <div style="width:100%;justify-content:space-between;display:flex;">
                <div>
                    <div style="display:inline-block" v-if="goodinfo.pro_imgs"><img :src="goodinfo.pro_imgs[0]" alt="" style="width:3rem;height:3rem"></div>
                    <div style="display:inline-block;margin-left:1rem">
                        <div style="margin-bottom:0.7rem;font-weight:700;max-width:12rem;text-overflow:ellipsis;overflow:hidden;white-space:nowrap;">{{goodinfo.pro_description}}</div>
                        <div style="font-size:0.8rem;color:#666">数量X1</div>
                    </div>
                </div>
                <a style="color:#409EFF;margin-right:1rem" @click="sendMsg">联系卖家</a>
            </div>
        </div>
        <div class="line"></div>
        <div class="listinfo">
            <div>买家昵称</div>
            <div>{{userinfo.nickname}}</div>
        </div>
        <div class="listinfo">
            <div>买家账号</div>
            <div>{{userinfo.account}}</div>
        </div>
        <div class="listinfo">
            <div>订单编号</div>
            <div>{{goodinfo._id}}</div>
        </div>
        <div class="listinfo" style="margin-bottom:1rem;">
            <div>交易时间</div>
            <div v-if="goodinfo.buyflag === 0">{{formats}}</div>
            <div v-if="goodinfo.buyflag === 1">{{format(goodinfo.updatedAt)}}</div>
        </div>
        <div class="line"></div>
        <div style="padding:1rem;width:100%;text-align:center">
            <mt-button style="width:45%;background:#ccc;color:#000;margin-right:1rem;" @click="$router.go(-1)">关闭交易</mt-button>
            <mt-button style="width:45%;background:#3CB371;color:#000" @click="buyit" v-if="goodinfo.buyflag === 0">我要付款</mt-button>
            <mt-button style="width:45%;background:#F56C6C;color:#000" @click="payback" v-if="goodinfo.buyflag === 1">我要退款</mt-button>
        </div>
    </div>
</template>

<script>
import api from '../../api'
import format from '../../common/common'
import { MessageBox,Indicator } from 'mint-ui';
export default {
    data(){
        return{
            times:Date.now(),
            userinfo:{},
            goodinfo:{},
            buyaddress:{},
            addressflag:false,
            format
        }
    },
    methods:{
        getProdetail(){
            let gid = this.$route.query.gid
            let uid = sessionStorage.id
            api.orderDetail({uid,gid}).then(res=>{
                this.userinfo = res.user
                this.goodinfo = res.good
                for(let i =0;i<res.user.rece_info.length;i++){
                    if(res.user.rece_info[i].checked === 1){
                        this.buyaddress = res.user.rece_info[i]
                        this.addressflag = true
                    }
                }
                if(this.goodinfo.pro_price === parseInt(this.goodinfo.pro_price)){
                    this.goodinfo.pro_price = this.goodinfo.pro_price + '.00' 
                }
            })
        },
        sendMsg(){
            let that = this
            this.$router.push({
                path:'/social/privateletter',
                query:{
                    receiveid:that.goodinfo.seller._id,
                    username:that.goodinfo.seller.nickname,
                }
            })
        },
        buyit(){
            Indicator.open('交易中...')
            setTimeout(()=>{
                if(this.userinfo.money<this.goodinfo.pro_price){
                    Indicator.close()
                    MessageBox('提示', '你的余额不足，请先充值');
                } else {
                    let gid = this.$route.query.gid
                    let uid = sessionStorage.id
                    api.buyGood({uid,gid,money:this.userinfo.money,price:this.goodinfo.pro_price}).then(res=>{
                        Indicator.close()
                        MessageBox('提示', res.message);
                        this.getProdetail()
                    })
                }
            },1500)
        },
        payback(){
            Indicator.open('退款中...')
            setTimeout(()=>{
                    let gid = this.$route.query.gid
                    let uid = sessionStorage.id
                    api.payBack({uid,gid,money:this.userinfo.money,price:this.goodinfo.pro_price}).then(res=>{
                        Indicator.close()
                        MessageBox('提示', res.message);
                        this.getProdetail()
                    })
            },1500)
        }
    },
    computed:{
        formats(){
            var time = new Date(this.times);
            var y = time.getFullYear();
            var m = time.getMonth() + 1;
            var d = time.getDate();
            var h = time.getHours();
            var mm = time.getMinutes();
            var s = time.getSeconds();
            if(mm>=0&&mm<10){
                mm = '0'+mm
            } else if(h>=0&&h<10){
                h = '0'+h
            } else if(s>=0&&s<10){
                s = '0'+s
            }
            var result = y + '-' + m + '-' + d+' '+ h+':'+mm+':'+s
            return result
        }
    },
    mounted(){
        this.getProdetail()
    }
}
</script>

<style lang="scss" scoped>
.line{
    width: 90%;
    height:0.1rem;
    background:#dadada;
    margin:0 auto;
}
.listinfo{
    width:100%;
    justify-content:space-between;
    display:flex;
    color:#999;
    padding:0 1rem;
    font-size:0.8rem;
    margin-top:1rem;
}
.grey{
    color:#999;
}
.red{
    color: red;
}
</style>