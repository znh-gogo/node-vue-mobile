<template>
<mt-loadmore :top-method="loadTop" :top-status.sync="topStatus" ref="loadmore">
    <div slot="top" class="mint-loadmore-top" style="text-align:center">
        <span v-show="topStatus !== 'loading'" :class="{ 'rotate': topStatus === 'drop' }">↓</span>
        <span style="display:flex;justify-content:space-around;">
        <mt-spinner v-show="topStatus == 'loading'" color="#26a2ff"></mt-spinner>
        <span v-show="topStatus == 'loading'">加载中...</span>
        </span>

        <!-- <mt-spinner v-show="topStatus == 'loading'" type="fading-circle"></mt-spinner> -->
    </div>
    <div style="positon:relative;margin-bottom: 5rem;height:100%" @click.stop="cancelAll">
        <!-- <mt-header title="社交中心" style="background-color:#f1f1f1;color: #222222;font-size: 1.2rem;height:4rem;position:fixed:top:0;left:0">
        </mt-header> -->
        <div class="social_top" :style="{backgroundImage: 'url(' + accountInfo.backgroundImg + ')'}">
            <div class="top_content">
                <div style="font-size:1.5rem;line-height:4rem;margin-right:2rem;color:#222">{{accountInfo.nickname}}</div>
                <img :src="accountInfo.headImg" alt="" style="width:4rem;height:4rem;border-radius:0.3rem" @click="$router.push({path:'/social/info',query:{id:accountId,flag:false}})">
            </div>
        </div>
        <div v-if="topicList.length === 0" style="width:100%;height:100%;margin-top:10rem;text-align:center;">
            <span style="width:5rem;height:1px;background:#999;display:inline-block;"></span>
            <span style="display:inline-block;height:1rem;line-height:1rem;">暂时没有发现话题哦</span>
            <span style="width:5rem;height:1px;background:#999;display:inline-block"></span>
        </div>
        <div class="social_content" v-for="(item,index) in topicList" :key="index">
            <div class="contents" v-if="item.relative">
                <div><img :src="item.relative.headImg" alt="" style="width:4rem;height:4rem;border-radius:0.3rem;background-size:100%;"
                @click="$router.push({path:'/social/info',query:{id:item.relative._id,flag:item.relative._id===accountId?false:true}})"></div>
                <div class="contents-right">
                    <div class="username"
                    @click="$router.push({path:'/social/info',query:{id:item.relative._id,flag:item.relative._id===accountId?false:true}})">
                    {{item.relative.nickname}}
                    </div>
                    <div class="topiccontent">{{item.topiccontent}}</div>
                    <div v-if="item.topicImg.length !== 0" style="display:flex;width:100%;flex-flow:row wrap;">
                        <div v-for="(img,imgindex) in item.topicImg" :key="imgindex">
                            <img
                            :src="img"
                            @click="zoomIn(img)"
                            :class="[{'singleImg':item.topicImg.length === 1},{'mulImg': item.topicImg.length > 1}]">
                        </div>
                    </div>
                    <div class="content-bottom">
                        <div style="color:#666;height:2rem;line-height:2rem">{{format(item.createdAt)}}
                            <span style="color:red;font-size:0.8rem;margin-left:1rem" v-if="item.relative._id === accountId" @click="delTopic(item._id)">删除</span></div>
                        <transition name="moveR">
                            <div class="controlbtn" v-show="showBtn"  v-if="nowIndex === index">
                                <span style="margin-right:1rem" @click="thinkgood(item._id)">{{item.goodflag === 1?'取消点赞':'点赞'}}</span>
                                 |
                                <span style="margin-left:1rem" @click.stop="comment(item._id)">评论</span>
                            </div>
                        </transition>
                        <img src="../../assets/more.png" alt="" style="width:2rem;height:2rem;" @click.stop="showMore(index)">
                    </div>
                    <div class="replybox" v-if="item.thinkgood.length!==0 || item.topiccomment.length!==0">
                        <div v-if="item.thinkgood.length!==0" style="display:flex">
                            <div class="thinkgood" v-for="(good,num) in item.thinkgood" :key="num">
                                <img src="../../assets/like.png" alt="" style="width:1rem;height:1rem">
                                <div>{{good.nickname}}</div><span style="color:#222" v-if="item.thinkgood.length !== 1 && item.thinkgood.length !== (num+1)">、</span>
                            </div>
                        </div>
                        <div style="width:100%;height:1px;background:#ccc;margin-bottom:0.3rem" v-if="item.thinkgood.length!==0 && item.topiccomment.length!==0"></div>
                        <div v-if="item.topiccomment.length!==0">
                            <div v-for="(c,i) in item.topiccomment" :key="i" :class="['reply',{'current':item.topiccomment.length==(i+1)}]">
                                <span style="color:#0399d3;" v-if="c.commentuser">{{c.commentuser.nickname}}</span>
                                <span v-if="c.commentuser">：{{c.comment}}</span>
                                <span style="float:right;color:red" v-if="c.commentuser._id === accountId" @click="delcomment(c._id)">删除</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <transition name="moveT">
            <div style="position:fixed;width:100%;bottom:5rem;left:0:z-index: 20;border-top:1px solid #ccc;background:#fff" v-if="commentFlag" @click.stop="">
                <mt-field placeholder="请输入评论内容" type="textarea" rows="2" v-model="model.comment">
                    <div>
                        <mt-button type="primary" size="small" @click="sendcomment">发表评论</mt-button>
                        <mt-button type="default" size="small" plain @click="commentFlag = false">取消</mt-button>
                    </div>
                </mt-field>
            </div>
        </transition>
        <div class="sendBtn" @click="$router.push({path:'/social/sendtopic',query:{id:accountId}})" v-if="!commentFlag">
            <img src="../../assets/sendtopic.png" alt="" style="width:3rem;height:3rem;border-radius: 50%;">
        </div>
        <div class="zoom" @click="zoomOut" v-if="zoomFlag">
            <img :src="zoomImg" style="width:100%;max-height:80%">
        </div>
    </div>
    </mt-loadmore>
</template>

<script>
import api from '../../api'
import { Toast } from 'mint-ui'
import format from '../../common/common'
import { Spinner } from 'mint-ui'
export default {
    data (){
        return{
            showBtn: false,
            introduction:'',
            commentFlag:false,
            accountId:'',
            accountInfo:'',
            topicList:[],
            nowIndex: -1,
            model:{},
            topicid:null,
            zoomImg:'',
            zoomFlag:false,
            format,
            topStatus:''
        }
    },
    methods:{
        cancelAll(){
            this.showBtn = false
            this.commentFlag = false
        },
        thinkgood(tid){
            api.thinkGood({ userid:this.accountId,topicid:tid }).then((res)=>{
                if(res){
                    this.showBtn = false
                    this.getTopicList()
                }
            })
        },
        comment (id){
            this.commentFlag = !this.commentFlag
            this.showBtn = false
            this.topicid = id
        },
        showMore(index){
            this.showBtn = !this.showBtn
            this.nowIndex = index
        },
        getUser(){
            api.showAccount(this.accountId,null).then((res)=>{
                this.accountInfo = res
            })
        },
        getTopicList(){
            api.showTopicList().then(res => {
                if(res){
                    this.topicList = res.reverse()
                    for( let i =0; i<this.topicList.length;i++){
                        if(this.topicList[i].relative._id){
                            for(let j = 0;j<this.topicList[i].thinkgood.length;j++){
                                if(this.accountId === this.topicList[i].thinkgood[j]._id) {
                                    this.$set(this.topicList[i],'goodflag',1)
                                } 
                                else {
                                    this.$set(this.topicList[i],'goodflag',0)
                                }
                            }
                        }
                    }
                }
            })
        },
        sendcomment(){
            this.$set(this.model,'commentuser',this.accountId)
            this.$set(this.model,'topicid',this.topicid)
            api.topicComment(this.model).then(res =>{
                if(res){
                    this.getTopicList()
                    this.commentFlag=false
                    this.model={}
                }
            })
        },
        delcomment(id){
            api.delComment({id}).then((res)=>{
                if(res){
                    Toast(res.message)
                    this.getTopicList()
                }
            })
        },
        delTopic(id){
            api.delTopic({id}).then((res) => {
                if(res){
                    Toast(res.message)
                    this.getTopicList()
                }
            })
        },
        zoomIn(img){
            this.zoomImg = img
            this.zoomFlag = true
            document.body.style.overflow='hidden';
        },
        zoomOut(){
            this.zoomFlag = false
            document.body.style.overflow='';
        },
        handleTopChange(status) {
            this.topStatus = status;
        },
        loadTop() {
            // load more data
            this.handleTopChange("loading");
            setTimeout(() => {
                this.getTopicList()
                this.handleTopChange("loadingEnd")
                this.$refs.loadmore.onTopLoaded();
            },1500)
        }
    },
    mounted (){
        this.getUser()
        this.getTopicList()
  },
    created(){
        this.accountId = window.sessionStorage.getItem('id')
    }
    
}
</script>

<style lang="scss" scoped>
    .social_top{
        width: 100%;
        height: 15rem;
        background-repeat:no-repeat;
        background-size:100% 100%;
        position: relative;
        .top_content{
            display: flex;
            position: absolute;
            right: 1rem;
            bottom: -1rem
        }
    }
    .social_content{
        width: 100%;
        height: 100%;
        .contents{
            display: flex;
            padding: 2rem;
            border-bottom: 1px solid #eee;
            .contents-right{
                margin-left: 1rem;
                width: 100%;
                .username{
                    font-size: 1.4rem;
                    color:#0399d3;
                    margin-bottom: 0.5rem;
                }
                .topiccontent{
                    font-size: 1.4rem;
                    line-height: 1.4rem;
                    margin-bottom: 0.5rem;
                }
                .mulImg{
                    width: 7rem;
                    height: 7rem;
                    margin-right: 0.7rem;
                    margin-bottom: 0.7rem;
                    flex-flow:row wrap;
                }
                .singleImg{
                    width:12rem;
                    height:12rem
                }
                .content-bottom{
                    margin-top: 0.5rem;
                    display: flex;
                    justify-content: space-between;
                    position: relative;
                    .controlbtn{
                        background-color: #555;
                        color: #fff;
                        padding: 0 1rem;
                        border-radius: 0.3rem;
                        position:absolute;
                        line-height:2rem;
                        right: 2.2rem;
                        overflow: hidden;
                    }
                }
                .replybox{
                    background-color: #f1f1f1;
                    border-radius: 0.2rem;
                    padding: 0.4rem;
                    .thinkgood{
                        color:#0399d3;
                        padding-top: 0.1rem; ;
                        padding-bottom: 0.1rem;
                        display: flex;
                        // display: inline-block
                    }
                    .reply{
                        margin-bottom: 0.5rem;
                    }
                }
            }
        }
    }
    .sendBtn{
        border-radius: 50%;
        position: fixed;
        bottom: 10rem;
        right: 1rem;
        z-index: 30;
        background-color: #f1f1f1;
        width: 3rem;
        height: 3rem;
        line-height: 3rem;
    }
    .zoom{
        position: fixed;
        width: 100%;
        height: 100%;
        padding-top: 20%;
        background-color: #000;
        z-index: 99;
        top: 0;
        left: 0;
    }
    .current{
        margin-bottom: 0!important;
    }
    .moveR-enter-active,  .moveR-leave-active {
        transition: all 0.3s linear;
        transform: translateX(-10%);
    }
    .moveR-enter,  .moveR-leave ,.moveR-leave-to{
        // transition: all 0.3s linear;
        transform: translateX(5%);
    }
    .moveT-enter-active,  .moveT-leave-active {
        transition: all 0.2s linear;
        transform: translateY(-10%);
    }
    .moveT-enter,  .moveT-leave ,.moveT-leave-to{
        // transition: all 0.3s linear;
        transform: translateY(5%);
    }
</style>