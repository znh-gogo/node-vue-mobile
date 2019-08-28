<template>
    <div style="positon:relative;margin-bottom: 5rem;">
        <!-- <mt-header title="社交中心" style="background-color:#f1f1f1;color: #222222;font-size: 1.2rem;height:4rem;position:fixed:top:0;left:0">
        </mt-header> -->
        <div class="social_top" :style="{backgroundImage: 'url(' + accountInfo.backgroundImg + ')'}">
            <div class="top_content">
                <div style="font-size:1.5rem;line-height:4rem;margin-right:2rem;color:#222">{{accountInfo.nickname}}</div>
                <img :src="accountInfo.headImg" alt="" style="width:4rem;height:4rem;border-radius:0.3rem" @click="$router.push({path:'/social/info',query:{id:accountId}})">
            </div>
        </div>
        <div class="social_content" v-for="(item,index) in topicList" :key="index">
            <div class="contents" v-if="item.relative">
                <div><img :src="item.relative.headImg" alt="" style="width:4rem;height:4rem;background-size:100%;"
                @click="$router.push({path:'/social/info',query:{id:item.relative._id}})"></div>
                <div class="contents-right">
                    <div class="username">{{item.relative.nickname}}</div>
                    <div class="topiccontent">{{item.topiccontent}}</div>
                    <img src="../../assets/p2.jpg" alt="" style="width:10rem;height:10rem">
                    <div class="content-bottom">
                        <div style="color:#666;height:2rem;line-height:2rem">{{item.createdAt.split('T').reverse().pop()}}
                            <span style="color:red;font-size:0.8rem;margin-left:1rem" v-if="item.relative._id === accountId" @click="delTopic(item._id)">删除</span></div>
                        <!-- <div style="display:flex"> -->
                        <transition name="moveR">
                            <div class="controlbtn" v-show="showBtn"  v-if="nowIndex === index">
                                <span style="margin-right:1rem">点赞</span> |
                                <span style="margin-left:1rem" @click="comment(item._id)">评论</span>
                            </div>
                        </transition>
                        <img src="../../assets/more.png" alt="" style="width:2rem;height:2rem" @click="showMore(index)">
                        <!-- </div> -->
                    </div>
                    <div class="replybox" v-if="item.thinkgood.length!==0 || item.topiccomment.length!==0">
                        <div class="thinkgood" v-if="item.thinkgood.length!==0">
                            <img src="../../assets/like.png" alt="" style="width:1rem;height:1rem">
                            <div>123</div><span style="color:#222">、</span>
                        </div>
                        <div v-if="item.topiccomment.length!==0">
                            <div v-for="(c,i) in item.topiccomment" :key="i" :class="['reply',{'current':item.topiccomment.length==i}]">
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
            <div style="position:fixed;width:100%;bottom:5rem;left:0:z-index: 20;border-top:1px solid #ccc;background:#fff" v-if="commentFlag">
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

    </div>
</template>

<script>
import api from '../../api'
import { Toast } from 'mint-ui'
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
        }
    },
    methods:{
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
                        border-bottom: 1px solid #ccc;
                        padding-bottom: 0.3rem;
                        display: flex;
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