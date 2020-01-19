<template>
    <div>
        <mt-header title="用户信息" style="background-color:#fafafa;color: #222222;font-size: 1.2rem;height:4rem">
                <mt-button icon="back" slot="left" @click="$router.go(-1)"></mt-button>
            <!--            <mt-button icon="more" slot="right"></mt-button>-->
        </mt-header>
        <div class="head">
            <div class="head-detail">
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
            <div class="like">
                <div>关注：{{likeNum}}</div>
                <div>粉丝：{{likedNum}}</div>
                <van-button round type="primary" size="small" icon="plus" @click="doLike">{{likeFlag?'取消关注':'关注'}}</van-button>
            </div>
            <div style="margin-bottom:0.5rem">邮箱：{{userinfo.email}}</div>
            <div>个性签名：{{userinfo.description}}</div>

        </div>
        <div style="width:100%;text-align:center;margin-top:5rem" v-show="$route.query.flag==true">
            <mt-button type="primary" style="width:80%" @click="priLetter">私信</mt-button>
        </div>
        <div style="width:100%;text-align:center;margin-top:5rem">
            <van-divider content-position="left" :style="{ color: '#1989fa', borderColor: '#1989fa'}">他正在上架的商品</van-divider>
            <div v-if="hisprolist.length!==0" style="width:100%;padding-top:1rem;">
                <div style="overflow-y: auto;height:auto;">
                <div class="goodbox" >
                    <div v-for="(item,index) in hisprolist" :key="index">
                    <div class="goodcontent" v-if="item.buyflag===0" @click="$router.push({path:'/good-detail',query:{gid:item._id}})">
                        <img src="../../../assets/lose.jpg" alt="" style="width:100%;height:auto;border-radius:0.8rem;" v-if="item.pro_imgs.length === 0">
                        <img :src="item.pro_imgs[0]" alt=""  style="width:100%;height:auto;border-radius:0.8rem;" v-else>
                        <div style="font-weight:bold;line-height:1.2rem;height:2.4rem;overflow:hidden;padding:0.2rem;text-align:left;">{{item.pro_description}}</div>
                        <div style="display:flex;justify-content:space-between;margin:0.5rem 0;padding:0 0.5rem;">
                        <div style="color:red;">￥<span style="font-size:1.5rem">{{item.pro_price}}</span></div>
                        <div v-if="item.pro_attention">{{item.pro_attention.length}}人关注</div>
                        </div>
                        <!-- <div style="width:90%;height:1px;background:#eee;margin:0 auto"></div>
                        <div style="width:100%;padding:0.5rem;display:flex" v-if="item.seller">
                        <img :src="item.seller.headImg" alt="" style="width:2rem;height:2rem;border-radius:0.3rem">
                        <div style="margin-left:0.5rem;margin-top:0.2rem;">{{item.seller.nickname}}</div>
                        </div> -->
                    </div>
                    </div>
                </div>
                </div>
            </div>
        </div>
        
    </div>
</template>

<script>
import api from '../../../api'
import { Toast } from 'mint-ui'
export default {
    data(){
        return{
            userinfo:'',
            hisprolist:[],
            like:'关注',
            likeFlag:false,
            likedNum:0,
            likeNum:0
        }
    },
    methods:{
        getUser(){
            
            api.showAccount({id:this.$route.query.id}).then((res)=>{
                this.userinfo = res.model
                this.likeNum = res.model.like.length
                // console.log(res)
                this.likedNum = res.model.liked.length
                this.likeFlag = res.model.liked.find((v)=>{
                    return v._id === sessionStorage.id
                })
                // console.log(this.likeFlag)
                if(!this.likeFlag){
                    this.likeFlag = false
                } else {
                    this.likeFlag = true
                }
            })
        },
        priLetter(){
            let that = this
            this.$router.push({
                path:'/social/privateletter',
                query:{
                    username:that.userinfo.nickname,
                    receiveid:that.userinfo._id
                }
            })
        },
        showhissold(){
            let id = this.$route.query.id
            api.showmymMobilePro({id}).then(res=>{
                this.hisprolist = res
                if(res.length === 0){
                    this.showflag2 = false
                }
            })
        },
        doLike(){
            let id = sessionStorage.id
            if(id === this.$route.query.id){
                Toast('自己不能关注自己哦！')
                return
            }
            if(this.likeFlag){
                api.like({bid:id,sid:this.$route.query.id,like:false}).then(res=>{
                    this.likeFlag = !this.likeFlag
                    this.getUser()
                    Toast(res.message)
                })
            } else {
                api.like({bid:id,sid:this.$route.query.id,like:true}).then(res=>{
                    this.likeFlag = !this.likeFlag
                    this.getUser()
                    Toast(res.message)
                })
            }
        }
    },
    mounted(){
        this.getUser()
        this.showhissold()
    },
    created(){
        
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
    .like{
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 0;
        font-size: 1.5rem;
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
    margin-bottom:1rem;
    padding-bottom: 0.5rem;
    box-shadow: 0.2rem 0.2rem 0.2rem 0.2rem #eee;
  }
}
</style>