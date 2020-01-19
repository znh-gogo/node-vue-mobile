<template>
    <div style="width: 100%;min-height: 100vh;background-color: #fafafa;">
        <mt-header title="我的购物中心" style="background-color:#f1f1f1;color: #222222;font-size: 1.2rem;height:4rem">
            <router-link to="/mine" slot="left">
                <mt-button icon="back"></mt-button>
            </router-link>
            <!-- <div slot="right" style="font-size:1.3rem;color:#222222" @click="change">
                完成
            </div> -->
        </mt-header>
        <div style="width:100%;height:3rem;display:flex;border-bottom:1px solid #ccc">
            <div style="flex:1;text-align:center;line-height:3rem" :class="{'current':nowIndex === 1}" @click="getmybuy">我买到的商品</div>
            <div style="flex:1;text-align:center;line-height:3rem" :class="{'current':nowIndex === 2}" @click="showmysold">我上架的商品</div>
            <div style="flex:1;text-align:center;line-height:3rem" :class="{'current':nowIndex === 3}" @click="showmyseller">我关注的卖家</div>
        </div>
        <div v-if="nowIndex ===1">
            <div style="text-align: center" v-if="!showflag">
                <img src="../../../assets/空购物车.png" alt="" style="margin:2rem auto">
                <div>亲，购物车还是空的哦</div>
                <div style="width: 100%;text-align: center;margin-top: 1rem;">
                    <mt-button type="primary" @click="$router.push('/home')" style="width: 90%;">回到商城挑选商品</mt-button>
                </div>
            </div>
            <div v-if="showflag" style="width:100%">
                <div class="listbox" v-for="(item,index) in mybuylist" :key="index" @click="$router.push({path:'/order-detail',query:{gid:item._id}})">
                    <div style="display:flex;width:100%;padding:1rem">
                        <div v-if="item.pro_imgs.length!==0"><img :src="item.pro_imgs[0]" alt="" style="width:5rem;height:5rem"></div>
                        <div v-else><img src="../../../assets/lose.jpg" style="width:5rem;height:5rem" alt=""></div>
                        <div style="margin-left:1rem;width:100%">
                            <div style="font-weight:700;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;width:12rem;">{{item.pro_description}}</div>
                            <div style="color:red;font-weight:700;margin:0.8rem 0">{{item.pro_price}}元</div>
                            <div v-if="item.paybackflag===1" style="color:red;">退款中</div>
                            <div v-else>交易成功</div>
                        </div>
                    </div>
                    <div style="width:90%;height:0.2rem;background:#ddd;margin:1rem auto"></div>
                    <div v-if="item.seller" style="padding: 0 1rem">
                        <a style="color:#409EFF;margin-left:1rem">联系卖家</a>
                        <!-- <div style="display:inline-block"><img :src="item.seller.headImg" alt="" style="width:3rem;height:3rem"></div>
                        <div style="display:inline-block;font-weight:700;margin-left:1rem;margin-bottom:1rem">{{item.seller.nickname}}</div> -->
                    </div>
                </div>
            </div>
        </div>
        <div v-if="nowIndex ===2">
            <div style="text-align: center;margin-top:1rem;color:#ccc;" v-if="!showflag2">您还未有出售的商品，快去上架吧！</div>
            <div style="width:100%;padding-top:1rem;">
                <div style="overflow-y: auto;height:auto;">
                <div class="goodbox" >
                    <div v-for="(item,index) in myselllist" :key="index">
                    <div class="goodcontent" @click="$router.push({path:'/good-detail',query:{gid:item._id}})">
                        <img src="../../../assets/lose.jpg" alt="" style="width:100%;height:auto;border-radius:0.8rem;" v-if="item.pro_imgs.length === 0">
                        <img :src="item.pro_imgs[0]" alt=""  style="width:100%;height:auto;border-radius:0.8rem;" v-else>
                        <div style="font-weight:bold;line-height:1.2rem;height:2.4rem;overflow:hidden;padding:0.2rem">{{item.pro_description}}</div>
                        <div style="display:flex;justify-content:space-between;margin:0.5rem 0;padding:0 0.5rem;">
                        <div style="color:red;">￥<span style="font-size:1.5rem">{{item.pro_price}}</span></div>
                        <div v-if="item.pro_attention">{{item.pro_attention.length}}人关注</div>
                        </div>
                        <!-- <div style="width:90%;height:1px;background:#eee;margin:0 auto"></div>
                        <div style="width:100%;padding:0.5rem;display:flex" v-if="item.seller">
                        <img :src="item.seller.headImg" alt="" style="width:2rem;height:2rem;border-radius:0.3rem">
                        <div style="margin-left:0.5rem;margin-top:0.2rem;">{{item.seller.nickname}}</div>
                        </div> -->
                        <div class="sold" v-if="item.buyflag!==0">
                            <img src="../../../assets/sold.png" alt="">
                        </div>
                    </div>
                    </div>
                </div>
                </div>
            </div>
        </div>
        <div v-if="nowIndex ===3">
            <div style="text-align: center;margin-top:1rem;color:#ccc;" v-if="!showflag3">您还未有特别关注的卖家，快去关注吧！</div>
            <div class="listbox2" v-for="(item,index) in mylikelist" :key="index">
                <div class="likeItem">
                    <div class="likeImg" @touchstart="$router.push({path:'/social/info',query:{id:item._id,flag:item._id==accoundid?false:true}})"><img :src="item.headImg" alt=""></div>
                    <div class="likeDes" @touchstart="$router.push({path:'/social/info',query:{id:item._id,flag:item._id==accoundid?false:true}})">
                        <div class="sname">{{item.nickname}}</div>
                        <div class="van-multi-ellipsis--l2">{{item.description}}</div>
                        <div class="snum" v-if="item.liked">{{item.liked.length}}位粉丝</div>
                    </div>
                    <div class="likeBtn"><van-button plain hairline size="small" type="primary" icon="plus" @click.stop="cancel(item._id)">已关注</van-button></div> 
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import api from '../../../api'
import { Toast,MessageBox } from 'mint-ui'
export default {
    data(){
        return{
            mybuylist:[],
            myselllist:[],
            mylikelist:[],
            showflag2:true,
            showflag:true,
            nowIndex:1,
            showflag3:true,
            likedNum:0,
            accoundid:''
        }
    },
    methods:{
        getmybuy(){
            this.nowIndex = 1
            sessionStorage.index = 1
            // let id = sessionStorage.id
            api.showMyBuy({id:this.accoundid}).then(res=>{
                this.mybuylist = res
                if(res.length === 0){
                    this.showflag = false
                }
            })
        },
        showmysold(){
            this.nowIndex = 2
            sessionStorage.index = 2
            // let id = sessionStorage.id
            api.showmymMobilePro({id:this.accoundid}).then(res=>{
                this.myselllist = res
                if(res.length === 0){
                    this.showflag2 = false
                }
            })
        },
        showmyseller(){
            this.nowIndex = 3
            sessionStorage.index = 3
            // let id = sessionStorage.id
            api.showAccount({id:this.accoundid}).then((res)=>{
                this.mylikelist = res.model.like
                // this.likedNum = res.model.liked.length
                if(this.mylikelist === 0){
                    this.showflag3 = false
                }
            })
        },
        cancel(sid){
            MessageBox.confirm('是否取消关注?').then(() => {
                api.like({bid:this.accoundid,sid:sid,like:false}).then(res=>{
                    // this.likeFlag = !this.likeFlag
                    this.showmyseller()
                    Toast(res.message)
            })
            }).catch(()=>{})
        }
    },
    mounted(){
        this.accoundid = sessionStorage.id
        if(sessionStorage.index==2){
            this.showmysold()
        } else if(sessionStorage.index==3) {
            this.showmyseller()
        } else {
            this.getmybuy()
        }
        
        
    }
}
</script>

<style lang="scss" scoped>
.listbox{
    width:90%;
    // height:10rem;
    // border:1px solid #aaa;
    margin:1rem auto;
    box-shadow:0 4px 8px #ccc;
    // margin:2rem;
    border-radius: 0.5rem;
    padding-bottom:1rem ;
}
.listbox2{
    width:90%;
    // height:10rem;
    // border:1px solid #aaa;
    margin:1rem auto;
    box-shadow:0 4px 8px #ccc;
    border-radius: 0.5rem;
    // margin:2rem;
    // padding-bottom:1rem ;
    .likeItem{
        display: flex;
        align-items: center;
        padding:1rem;
        .likeImg{
            width:4rem;
            img{
                width:100%;
                height:4rem;
            }
        }
        .likeDes{
            flex:1;
            margin-top: 1rem;
            margin-left: 1rem;
            // margin: 1rem;
            .sname{
                font-size:1.2rem;
                font-weight: bold;
                margin-bottom: 0.5rem;
            }
            .snum{
                margin-top: 1rem;
                color: #ccc;
            }
        }
        .likeBtn{
            padding: 0 1rem;
        }
    }
}
.current{
    color:#0399d3;
    border-bottom:0.2rem solid #0399d3;
}
.goodbox{
  padding:2%;
  width:100%;
  height:100%;
  // display: flex;
  // flex-flow:row wrap;
  -moz-column-count:2; /* Firefox */
  -webkit-column-count:2; /* Safari 和 Chrome */
  column-count:2;
  -moz-column-gap: 1rem;
  -webkit-column-gap: 1rem;
  column-gap: 1rem;
  // margin: 0 auto;
  // white-space:wrap;
  // overflow: hidden;
  .goodcontent{
    // width:48%;
    // height:100%;
    // float:left;
    break-inside: avoid;
    -webkit-column-break-inside: avoid;
    -moz-page-break-inside: avoid;
    background: #fff;
    // margin-right:1%;
    border-radius:0.8rem;
    padding-bottom: 0.5rem;
    margin-bottom:1rem;
    box-shadow: 0.2rem 0.2rem 0.2rem 0.2rem #eee;
    position: relative;
    .sold{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background: rgba($color: #000000, $alpha: 0.2);
        border-radius:0.8rem;
    }
  }
}
</style>