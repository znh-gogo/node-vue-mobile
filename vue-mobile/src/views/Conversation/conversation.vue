<template>
    <div style="width: 100%;height: 100vh;background-color: #fafafa;position:relative" @click.stop="delFlag = false , addConFlag = false">
        <div style="position:fixed;top:0;left:0;width:100%">
        <mt-header title="会话" style="background-color:#f1f1f1;color: #222222;font-size: 1.2rem;height:4rem;">
            <div slot="right" style="font-size:1.3rem;color:#222222" @click.stop="addConFlag = !addConFlag,delFlag = false">
                <img src="../../assets/加.png" alt="">
            </div>
        </mt-header>
        </div>
        <transition name="moveT">
        <div class="moreadd" v-show="addConFlag" @click="addConversation">
            <div><img src="../../assets/添加会话.png" alt=""></div>
            <div>添加会话</div>
        </div>
        </transition>
        <div style="height:100%;width:100%;padding-top:4rem;">
            <div
            class="item-content"
            v-for="(item,index) in newdataList"
            :key="index"
            @click="priLetter(item)"
            @touchend="delend"
            @touchmove="delcom(item,index)">
                <div v-if="item.sendrelative._id !== accountId"><img :src="item.sendrelative.headImg" alt="" style="width:4rem;height:4rem;border-radius:0.3rem"></div>
                <div class="content-detail" v-if="item.sendrelative._id !== accountId">
                    <div style="font-size:1.5rem;font-weight:bold">{{item.sendrelative.nickname}}</div>
                    <div
                    style="font-size:1.5rem;margin:0.5rem 0;color:#F56C6C"
                    v-if="item.comcontent[item.comcontent.length-1].talker._id !== accountId">您有新的消息未回</div>
                    <div style="font-size:1.5rem;margin:0.5rem 0;color:#666" v-else>暂时未有新的消息</div>
                    <div style="color:#999">{{timeago(item.updatedAt)}}</div>
                </div>
                <transition name="van-slide-right">
                <div
                class="delBtn"
                v-show="delFlag"
                @click.stop="delConversation(item._id)"
                v-if="nowIndex === index &&item.sendrelative._id !== accountId">
                    删除
                </div>
                </transition>

                <div v-if="item.receiverelative._id !== accountId"><img :src="item.receiverelative.headImg" alt="" style="width:4rem;height:4rem;border-radius:0.3rem"></div>
                <div class="content-detail" v-if="item.receiverelative._id !== accountId">
                    <div style="font-size:1.5rem;font-weight:bold">{{item.receiverelative.nickname}}</div>
                    <div
                    style="font-size:1.5rem;margin:0.5rem 0;color:#F56C6C"
                    v-if="item.comcontent[item.comcontent.length-1].talker._id !== accountId">您有新的消息未回</div>
                    <div style="font-size:1.5rem;margin:0.5rem 0;color:#666" v-else>暂时未有新的消息</div>
                    <div style="color:#999">{{timeago(item.updatedAt)}}</div>
                </div>
                <transition name="van-slide-right">
                <div
                class="delBtn"
                v-show="delFlag"
                @click.stop="delConversation(item._id)"
                v-if="nowIndex === index &&item.receiverelative._id !== accountId">删除</div>
                </transition>
            </div>
        </div>
    </div>
</template>

<script>
import api from '../../api'
import format from '../../common/common'
import timeago from '../../common/date'
export default {
    data (){
        return {
            accountId:'',
            format,
            timeago,
            check:{
                sendrelative:null,
                receiverelative:null
            },
            conversationList:[],
            delFlag:false,
            controlFlag: false,
            nowIndex:-1,
            addConFlag: false
        }
    },
    methods:{
        getConversation(){
            this.accountId = window.sessionStorage.getItem('id')
            this.check.sendrelative = this.accountId
            this.check.receiverelative = this.accountId
            api.showConversation(this.check).then((res) => {
                this.conversationList = res
                // console.log(this.conversationList)
            })
        },
        sortKey(array, key) {
            return array.sort(function(a, b) {
            var x = a[key];
            var y = b[key];
            return x > y ? -1 : x < y ? 1 : 0;
            });
        },
        delcom(info,index){
            this.nowIndex = index
            this.addConFlag = false
            if(!this.controlFlag){
                if(this.delFlag === false) {
                    this.delFlag = true
                } else if(this.delFlag === true){
                    this.delFlag = false
                } 
            this.controlFlag = true
            }
        },
        delend(){
            this.controlFlag = false
            //   console.log('123')
        },
        delConversation(id){
            console.log(id)
            api.delConversation({id}).then((res)=>{
                if(res){
                    this.getConversation()
                    this.nowIndex = -1
                }
            })
        },
        priLetter(item){
            // let that = this
            // console.log(item)
            if(item.receiverelative._id !== this.accountId) {
                this.$router.push({
                    path:'/social/privateletter',
                    query:{
                        username:item.receiverelative.nickname,
                        receiveid:item.receiverelative._id
                    }
                })
            } else if(item.sendrelative._id !== this.accountId) {
                this.$router.push({
                    path:'/social/privateletter',
                    query:{
                        username:item.sendrelative.nickname,
                        receiveid:item.sendrelative._id
                    }
                })
            }
        },
        addConversation(){
            this.$router.push({path:'/conversation/addconversation'})
            // console.log('12')
        }
    },
    computed: {
      newdataList: function() {
        return this.sortKey(this.conversationList, "updatedAt");
      }
    },
    mounted(){
        this.getConversation()
    }
}
</script>

<style lang="scss" scoped>
    .item-content{
        width: 100%;
        // height: 100%;
        display: flex;
        padding: 1rem;
        background:#fff;
        .content-detail{
            margin-left: 1rem;
            border-bottom: 1px solid #ccc;
            flex: 1
        }
        .delBtn{
            width: 5rem;
            height: 4rem;
            line-height: 4rem;
            background-color: red;
            text-align: center;
            color: #fff;
        }
    }
    .moreadd{
        position: absolute;
        right: 1rem;
        top: 3rem;
        // width: 5rem;
        background-color: #303133;
        z-index: 96;
        color: #fff;
        text-align: center;
        padding: 1rem;
        border-radius: 0.5rem;
        // border-bottom: 1px solid #f1f1f1;

    }
    .moveR-enter-active,  .moveR-leave-active {
        transition: all 0.3s linear;
        transform: translateX(-20%);
    }
    .moveR-enter,  .moveR-leave ,.moveR-leave-to{
        // transition: all 0.3s linear;
        transform: translateX(0%);
    }

    .moveT-enter-active,  .moveT-leave-active {
        transition: all 0.2s linear;
        transform: translateY(0%);
    }
    .moveT-enter,  .moveT-leave ,.moveT-leave-to{
        // transition: all 0.3s linear;
        transform: translateY(-20%);
    }
</style>
