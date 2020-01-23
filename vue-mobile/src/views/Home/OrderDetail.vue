<template>
    <div style="width: 100%;min-height: 100vh;background-color: #fafafa;position:relative">
        <mt-header title="订单详情" style="background-color:#f1f1f1;color: #222222;font-size: 1.2rem;height:4rem">
            <mt-button icon="back" slot="left" @click="$router.go(-1)"></mt-button>
        </mt-header>
        <van-steps :active="active" style="background-color: #fafafa;">
            <van-step>买家下单</van-step>
            <van-step>买家付款</van-step>
            <van-step>已发货</van-step>
            <van-step>交易完成</van-step>
        </van-steps>
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
        <div class="line" v-if="goodinfo.sendOrderList"></div>
        <div v-if="goodinfo.sendOrderList" style="padding:1rem;display:flex;justify-content:space-between;">
            <div>运单号：{{goodinfo.sendOrderList}}</div>
            <div style="color:#409EFF;margin-right:1rem" @click="showTrans">物流详情</div>
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
            <div>发货地址</div>
            <div>{{goodinfo.pro_address}}</div>
        </div>
        <div class="listinfo">
            <div>订单编号</div>
            <div>{{goodinfo._id}}</div>
        </div>
        <div class="listinfo" style="margin-bottom:1rem;">
            <div>交易时间</div>
            <div v-if="goodinfo.buyflag === 0">{{formats}}</div>
            <div v-if="goodinfo.buyflag === 1||goodinfo.buyflag === 2">{{format(goodinfo.updatedAt)}}</div>
        </div>
        <div class="line"></div>
        <div style="padding:1rem;width:100%;text-align:center">
            <mt-button style="width:45%;background:#ccc;color:#000;margin-right:1rem;" @click="$router.go(-1)" v-if="goodinfo.buyflag === 0||goodinfo.buyflag === 2">关闭交易</mt-button>
            <mt-button style="width:45%;background:#3CB371;color:#000" @click="buyit" v-if="goodinfo.buyflag === 0">我要付款</mt-button>
            <mt-button style="width:45%;background:#F56C6C;color:#000;margin-right:1rem;" @click="payback" v-if="goodinfo.buyflag === 1">{{paybacktext}}</mt-button>
            <mt-button style="width:45%;background:#3CB371;color:#000" @click="sureit" v-if="goodinfo.buyflag === 1">确认收货</mt-button>
            <mt-button style="width:45%;background:#F56C6C;color:#000;" @click="payback" v-if="goodinfo.buyflag === 2">{{paybacktext}}</mt-button>
        </div>
        <div class="inputPassword" v-if="showPaypassword">
            <!-- 密码输入框 -->
            <van-password-input
            :value="value"
            info="请输入为 6 位数字的支付密码"
            :focused="showKeyboard"
            @focus="showKeyboard = true"
            />
            <div style="text-align:center;margin-top:1rem;"><a style="color:#999;text-decoration:underline;font-size:1.4rem;" @click="showPaypassword=false,value=''">取消</a></div>
            <!-- 数字键盘 -->
            <van-number-keyboard
            :show="showKeyboard"
            @input="onInput"
            @delete="onDelete"
            @blur="showKeyboard = false"
            />
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
            format,
            active:0,
            paybacktext:'我要退款',
            paypasswordflag:false,
            value: '',
            showKeyboard: true,
            showPaypassword:false
        }
    },
    watch:{
        value(){
            if(this.value.length===6){
                this.checkPaypassword()
            }
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
                if(this.goodinfo.buyflag === 1){
                    this.active= 1
                }
                if(this.goodinfo.sendOrderList){
                    this.active= 2
                }
                if(this.goodinfo.buyflag === 2){
                    this.active= 3
                }
                if(this.goodinfo.pro_price === parseInt(this.goodinfo.pro_price)){
                    this.goodinfo.pro_price = this.goodinfo.pro_price.toFixed(2)
                }
                if(this.goodinfo.paybackflag === 1){
                   this.paybacktext = '退款中'
                }
                if(this.goodinfo.paybackflag === 2){
                    //商家同意退款，在提示一遍买家
                    this.payback()
                }
                if(this.goodinfo.paybackflag === 3){
                    //商家不同意退款
                    MessageBox('提示', '退款失败，商家拒绝');
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
            if(!this.addressflag){
                MessageBox('提示', '请先设置默认收货地址');
                return
            }
            if(!this.paypasswordflag){
                MessageBox('提示', '请先设置支付密码');
                this.$router.push('/mine/mypay/setpaypassword')
                return
            }
            this.showPaypassword = true
        },
        checkPaypassword(){
            let id = sessionStorage.id
            api.checkPaypassword({id,paypassword:this.value}).then(res=>{
                if(res.status ===200){
                    this.showPaypassword = false
                    this.value = ''
                    Indicator.open('交易中...')
                    setTimeout(()=>{
                        if(this.userinfo.money<this.goodinfo.pro_price){
                            Indicator.close()
                            MessageBox('提示', '你的余额不足，请先充值');
                        } else {
                            let gid = this.$route.query.gid
                            let uid = sessionStorage.id
                            let sid = this.goodinfo.seller._id
                            api.buyGood({uid,gid,sid,money:this.userinfo.money,price:this.goodinfo.pro_price}).then(res=>{
                                Indicator.close()
                                MessageBox('提示', res.message);
                                this.getProdetail()
                            })
                        }
                    },1500)
                } else if(res.status === 401){
                    MessageBox('提示', res.message);
                    this.showPaypassword = false
                    this.value = ''
                }
            })
        },
        sureit(){
            MessageBox.confirm('确定收货后将不能更改，是否确认?').then(() => {
                let gid = this.$route.query.gid
                let sid = this.goodinfo.seller._id
                api.sureReceive({price:this.goodinfo.pro_price,gid,sid}).then(res=>{
                    MessageBox('提示', res.message);
                    this.getProdetail()
                })
            }).catch(()=>{})
        },
        payback(){
            if(this.goodinfo.paybackflag === 0||this.goodinfo.paybackflag === 3){
                let gid = this.$route.query.gid
                MessageBox.confirm('是否申请退款?').then(()=>{
                    if(this.goodinfo.buyflag === 2){
                        api.paybackApply({gid,paybackflag:1}).then(res=>{
                            this.getProdetail()
                            MessageBox('提示', res.message);
                        })
                    } else {
                        MessageBox('提示', '请先确认收货后再申请退款');
                    }
                }).catch(()=>{})
            } else if(this.goodinfo.paybackflag === 1){
                MessageBox('提示', '正在申请退款中，请耐心等待');
            } else if(this.goodinfo.paybackflag === 2){
                MessageBox.confirm('是否确定退款,商家已经同意?').then(() => {
                    Indicator.open('退款中...')
                    setTimeout(()=>{
                            let gid = this.$route.query.gid
                            let uid = sessionStorage.id
                            let sid = this.goodinfo.seller._id
                            api.payBack({uid,gid,sid,money:this.userinfo.money,price:this.goodinfo.pro_price}).then(res=>{
                                Indicator.close()
                                MessageBox('提示', res.message);
                                // this.getProdetail()
                                this.$router.push('/home/good')
                            })
                    },1500)
                }).catch(()=>{
                    let gid = this.$route.query.gid
                    api.paybackApply({gid,paybackflag:0}).then(res=>{
                        MessageBox('提示', res.message);
                        this.getProdetail()
                    })
                })
            }
        },
        showTrans(){
            MessageBox('提示', '物流中心暂未完成');
        },
        showIfPassword(){
            let id = window.sessionStorage.getItem('id')
            api.showIfPaypassword({id}).then(res=>{
                this.paypasswordflag = res.paypasswordflag
            })
        },
        onInput(key) {
            this.value = (this.value + key).slice(0, 6);
        },
        onDelete() {
            this.value = this.value.slice(0, this.value.length - 1);
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
        this.showIfPassword()
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
.inputPassword{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #fff;
    z-index: 60;
    padding-top: 10rem;;
    // display: flex;
    // justify-content: center;
    // align-items: center;
}
</style>