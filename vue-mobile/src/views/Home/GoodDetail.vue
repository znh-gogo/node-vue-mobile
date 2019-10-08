<template>
    <div style="width: 100%;height: 100vh;background-color: #fafafa;">
        <mt-header title="商品详情" style="background-color:#f1f1f1;color: #222222;font-size: 1.2rem;height:4rem">
            <mt-button icon="back" slot="left" @click="$router.go(-1)"></mt-button>
        </mt-header>
        <div class="footer">
            <div style="padding:0.3rem;text-align:center;margin-left:2rem;margin-top:0.7rem" @click="commentFlag = !commentFlag">
                <img src="../../assets/留言.png" alt="" style="width:2rem;height:2rem">
                <div style="color:#707070">留言</div>
            </div>
            <div style="padding:0.3rem;text-align:center;margin-left:1rem;margin-top:0.7rem" @click="savePro" v-if="saveFlag">
                <img src="../../assets/save-null.png" alt="" style="width:2rem;height:2rem">
                <div style="color:#707070">收藏</div>
            </div>
            <div style="padding:0.3rem;text-align:center;margin-left:1rem;margin-top:0.7rem" @click="savePro" v-if="!saveFlag">
                <img src="../../assets/save-full.png" alt="" style="width:2rem;height:2rem">
                <div style="color:#707070">取消收藏</div>
            </div>
            <div style="line-height:5rem;margin-left:1rem" v-if="infoDetail.seller">
                <mt-button type="primary" size="small" style="height:4rem;" @click="sendMsg" :disabled="accoundid === infoDetail.seller._id?true:false">
                    <img src="../../assets/私聊null.png" height="20" width="20" slot="icon">
                    私聊
                </mt-button>
            </div>
            <div style="line-height:5rem;margin-left:1rem;flex:1">
                <mt-button size="small" style="height:4rem;width:90%;background-color:orange;color:#fff">
                    <!-- <img src="../../assets/私聊null.png" height="20" width="20" slot="icon"> -->
                    立即购买
                </mt-button>
            </div>
        </div>
        <div class="header">
            <div v-if="infoDetail.seller"><img :src="infoDetail.seller.headImg" alt="" style="width:4rem;height:4rem;border-radius:0.5rem;margin-left:1rem"></div>
            <div v-if="infoDetail.seller" class="name-time">
                <div style="font-weight:bold;font-size:1.2rem;margin-top:0.2rem">{{infoDetail.seller.nickname}}</div>
                <div style="color:#666;margin-bottom:0.5rem;font-size:0.8rem;">{{format(infoDetail.updatedAt)}} 发布于{{infoDetail.seller.address}}</div>
            </div>
        </div>
        <div class="line"></div>
        <div style="color:red;margin:1rem 1.5rem;">￥<span style="font-size:1.5rem;font-weight:bold">{{infoDetail.pro_price}}</span></div>
        <div style="font-weight:bold;font-size:1.5rem;margin:1rem 1.5rem;line-height:2rem;">{{infoDetail.pro_description}}</div>
        <div style="margin:1rem 1.5rem;">
            <img :src="item" alt="" v-for="(item,index) in infoDetail.pro_imgs" :key="index" style="width:100%;height:auto;border-radius:0.5rem;">
        </div>
        <div style="margin:1rem 1.5rem;display: flex;justify-content: space-between;">
            <div><img src="../../assets/支付宝.png" alt="" style="width:1rem;height:1rem"><span style="color:#409EFF">担保交易</span></div>
            <div style="color:#999" v-if="infoDetail.pro_attention">{{infoDetail.pro_attention.length}}人关注</div>
        </div>
        <div style="width:100%;height:0.7rem;background:#f1f1f1"></div>
        <div v-if="infoDetail.comments" style="background:#fff">
            <div style="margin:1rem 0rem;padding:0 1rem;font-size:1.5rem;font-weight:700">全部留言 · {{infoDetail.comments.length}}</div>
            <div class="line"></div>
            <div v-if="infoDetail.comments.length !== 0">
                <div v-for="(com,num) in commentList" :key="num" style="margin:1rem 1.5rem;">
                    <div style="width:100%;" v-if="com.relative&&infoDetail.seller">
                        <div
                        v-if="com.relative._id===accoundid||infoDetail.seller._id===accoundid"
                        @click="delComment(com._id)"
                        style="color:red;float:right;margin:0.5rem">删除</div>
                    </div>
                    <div v-if="com.relative"><img :src="com.relative.headImg" style="width:3rem;height:3rem;border-radius:0.5rem;">
                    <span style="font-size:1.2rem;font-weight:700;vertical-align:top;display:inline-block;margin:0.5rem 1rem">{{com.relative.nickname}}</span>
                    </div>
                    <div style="margin-left:4rem;font-weight:700;margin-bottom:0.7rem;">{{com.com_content}}</div>
                    <div style="margin-left:4rem;color:#666">{{format(com.com_time)}}</div>
                    <div class="line" style="margin:0.5rem 0"></div>
                </div>
            </div>
            <div v-if="infoDetail.comments.length === 0" style="width:100%;text-align:center;padding:1rem 0;">
                <img src="../../assets/沙发.png" alt="">
                <div style="color:#999;margin: 1rem 0;">还没有人留言，还不快来抢沙发...</div>
                <mt-button size="small" style="background-color:green;color:#000;width:5rem" @click.native="commentFlag = !commentFlag">
                    留言
                </mt-button>
            </div>
        </div>
        <div style="width:100%;height:0.7rem;background:#f1f1f1;margin-bottom:5rem"></div>
        <transition name="moveT">
            <div style="position:fixed;width:100%;bottom:5rem;left:0:z-index: 20;border-top:1px solid #ccc;background:#fff" v-if="commentFlag" @click.stop="">
                <mt-field placeholder="请输入留言内容" type="textarea" rows="2" v-model="comments">
                    <div>
                        <mt-button type="primary" size="small" @click="leaveMsg" :disabled="comments===''">发表留言</mt-button>
                        <mt-button type="default" size="small" plain @click="commentFlag = false">取消</mt-button>
                    </div>
                </mt-field>
            </div>
        </transition>
    </div>
</template>

<script>
import api from '../../api'
import format from '../../common/common'
export default {
    data(){
        return{
            infoDetail:{},
            format,
            accoundid:'',
            commentFlag:false,
            comments:'',
            saveFlag:true,
            commentList:[]
        }
    },
    methods:{
        getInfo(){
            this.accoundid = sessionStorage.id
            api.showMyProdetail({id:this.$route.query.gid}).then(res=>{
                this.infoDetail = res
                this.commentList = res.comments.reverse()
                let flag = 0
                this.saveFlag = true
                for(let i = 0 ;i<this.infoDetail.pro_attention.length;i++){
                    if(this.infoDetail.pro_attention[i] == this.accoundid){
                        this.saveFlag = false
                        // console.log(123)
                    }
                }

            })
        },
        sendMsg(){
            let that = this
            this.$router.push({
                path:'/social/privateletter',
                query:{
                    receiveid:that.infoDetail.seller._id,
                    username:that.infoDetail.seller.nickname,
                }
            })
        },
        savePro(){
            let uid = sessionStorage.id
            let id = this.infoDetail._id
            api.saveProduct({id,uid}).then(res=>{
                this.getInfo()
            })
        },
        leaveMsg(){
            let model = {
                id:this.infoDetail._id,
                comment:this.comments,
                cid:this.accoundid
            }
            api.ProLeaving(model).then(res=>{
                this.comments = ''
                this.commentFlag = false
                this.getInfo()
            })
        },
        delComment(cid){
            let id = this.infoDetail._id
            api.delLeaving({cid,id}).then(res=>{
                this.getInfo()
            })
        }
    },
    mounted(){
        
        this.getInfo()
    }
}
</script>

<style lang="scss" scoped>
.footer{
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 5rem;
    background-color: #eee;
    display: flex;
    z-index: 30;
}
.header{
    display: flex;
    padding: 0.5rem;
    width:100%;
    .name-time{
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        margin-left: 1rem;
    }
}
.line{
    width:90%;
    height:1px;
    background: #f1f1f1;
    margin:0 auto;
}
    .moveT-enter-active,  .moveT-leave-active {
        transition: all 0.2s linear;
        transform: translateY(-10%);
    }
    .moveT-enter,  .moveT-leave ,.moveT-leave-to{
        // transition: all 0.3s linear;
        transform: translateY(0%);
    }
</style>