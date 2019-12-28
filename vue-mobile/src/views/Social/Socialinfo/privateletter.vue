<template>
    <div style="width:100%;height:100vh;position:relative;padding-top:4rem;background-color: #fafafa;">
        <div class="priTop">
            <mt-header :title="$route.query.username" style="background-color:#f1f1f1;color: #222222;font-size: 1.2rem;height:4rem;">
                <mt-button icon="back" slot="left" @click="$router.go(-1)"></mt-button>
        </mt-header>
        </div>
        <div  ref="contentScroll" class="contentScroll">
            <div class="center-content">
                <div v-for="(item,index) in privateinfo.comcontent" :key="index">
                    <div v-if="item.talker">
                        <div class="content-right" v-if="item.talker._id === accountId">
                            <div v-if="item.talker"><img
                            :src="item.talker.headImg"
                            style="width:3rem;height:3rem;border-radius:0.3rem"
                            @touchstart="$router.push({path:'/social/info',query:{id:item.talker._id,flag:false}})"
                            ></div>
                            <div class="right-word">{{item.content}}</div>
                        </div>
                    </div>
                    <div v-if="item.talker">
                        <div class="content-left" v-if="item.talker._id !== accountId">
                            <div><img
                            :src="item.talker.headImg"
                            @touchstart="$router.push({path:'/social/info',query:{id:item.talker._id,flag:false}})"
                            style="width:3rem;height:3rem;border-radius:0.3rem"></div>
                            <div class="left-word">{{item.content}}</div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
        <div class="sendBtn">
            <mt-field placeholder="请输入内容" type="textarea" rows="2" v-model="model.comcontent.content">
                <div>
                    <mt-button type="primary" @click="sendmessage" :disabled="model.comcontent.content===''?true:false">发送</mt-button>
                </div>
            </mt-field>
        </div>
    </div>
</template>

<script>
import api from '../../../api'
import { Toast } from 'mint-ui'
import BScroll from 'better-scroll'
export default {
    data(){
        return{
            privateinfo:'',
            accountId:'',
            model:{
                comcontent:{
                    content:''
                }
            },
            check:{
                sendrelative:null,
                receiverelative:null
            },
            sendFlag:null,
            sendFlag2:null,
            privateid:null,
            contentScroll:''
        }
    },
    methods:{
        getLetter(){
            // this.check.sendrelative = this.accountId
            this.accountId = window.sessionStorage.getItem('id')
            this.check.sendrelative = this.accountId
            this.check.receiverelative = this.$route.query.receiveid
            api.showPrivateLetter(this.check).then((res)=>{
                if(res.flag === 0){
                    this.sendFlag = res.flag
                } else {
                    // let temp = res[0].comcontent.reverse()
                    this.privateinfo = res[0]
                    // this.$set(this.privateinfo,'comcontent',temp)
                    this.privateid = res[0]._id
                }
            }).then(()=>{
                if(this.sendFlag===0){
                    this.check.sendrelative = this.$route.query.receiveid
                    this.check.receiverelative = this.accountId
                    api.showPrivateLetter(this.check).then((res)=>{
                        if(res.flag === 0){
                            this.sendFlag = res.flag
                        } else {
                            // let temp = res[0].comcontent.reverse()
                            this.privateinfo = res[0]
                            // this.$set(this.privateinfo,'comcontent',temp)
                            this.privateid = res[0]._id
                            this.sendFlag = 1
                        }
                    })
                }

            })
        },
        sendmessage(){
            // if(this.model.comcontent.content === '') Toast('内容不能为空') return;
            this.$set(this.model,'sendrelative',this.accountId)
            this.$set(this.model,'receiverelative',this.$route.query.receiveid)
            this.$set(this.model.comcontent,'talker',this.accountId)
            this.$set(this.model,'flag',this.sendFlag)
            this.$set(this.model,'id',this.privateid)
            api.sendPrivateLetter(this.model).then((res)=>{
                if(res){
                    this.model = {comcontent:{}}
                    this.getLetter()
                    // this.contentScroll.refresh()
                    this.$nextTick(()=>{
                        this.contentScroll.refresh()
                    })
                    setTimeout(() => {
                        if(this.contentScroll.scrollerHeight>this.contentScroll.wrapperHeight){
                            this.contentScroll.scrollTo(0,this.contentScroll.maxScrollY)
                        }         
                    }, 100);
                }
            })
        },
        refreshScroll(){
            setTimeout(() => {
                this.$nextTick(()=>{
                    this.contentScroll.refresh()
                    // console.log('101')
                })
            }, 1100);
        },
        _initScroll(){
            this.contentScroll=new BScroll(this.$refs.contentScroll,{});
            console.log(this.contentScroll)
            // this.refreshScroll()
        }
    },
    // watch:{
    //     data(){
    //         setTimeout(() => {
    //             console.log('123')
    //             this.$nextTick(()=>{
    //             this.contentScroll.refresh()
    //             })
    //             if(this.contentScroll.scrollerHeight>this.contentScroll.wrapperHeight){
    //             this.contentScroll.scrollTo(0,this.contentScroll.maxScrollY)
    //         }  
    //         }, 100);
    //     }
    // },
    mounted(){
        
        this.getLetter()
    
        setTimeout(() => {
            this.$nextTick(()=>{
                this._initScroll()
        })
        }, 100);
        // this.refreshScroll()
        
        setTimeout(() => {
            if(this.contentScroll.scrollerHeight>this.contentScroll.wrapperHeight){
                this.contentScroll.scrollTo(0,this.contentScroll.maxScrollY)
            }         
        }, 120);
    },
    created(){
        
    }
}
</script>

<style lang="scss" scoped>
.priTop{
    width: 100%;
    // height: 100%;
    position:fixed;
    top: 0;
    left: 0;
    z-index: 10;
}
.contentScroll{
    margin-bottom:5rem;
    overflow:hidden;
    height: calc(100% - 6rem);
    border-bottom: 0;
.center-content{
    // margin: 4rem 0;
    border-bottom: 0;

    width: 100%;
    // height: 100%;
    background-color: #fafafa;
    // display: flex;
    // flex-direction:column-reverse;
    .content-right{
        display: flex;
        flex-direction:row-reverse;
        padding: 0.5rem 1rem;
        width: 100%;
        height: auto;
        .right-word{
            margin-right: 0.8rem;
            margin-top: 0.5rem;
            // white-space:normal;
            // line-height: 3rem;
            max-width: 80%;
            height: 100%;
            background-color: 	#228B22;
            border-radius: 0.5rem;
            padding: 0.5rem 1rem 0.5rem 0.5rem;
            // display: inline-block;
            // text-align: justify;
            // text-justify: newspaper;
            word-break: break-all;
        }
    }
    .content-left{
        display: flex;
        // flex-direction:row-reverse;
        padding: 0.5rem 1rem;
        width: 100%;
        height: 100%;
        .left-word{
            margin-top: 0.5rem;
            margin-left: 0.8rem;
            max-width: 80%;
            height: 100%;
            background-color:#fff;
            border-radius: 0.5rem;
            padding: 0.5rem 1rem 0.5rem 0.5rem;
            word-break: break-all;
        }
    }
}
}

.sendBtn{
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    // height: 10%;
    border-top: 1px solid #eee;
    border-bottom: 1px solid #eee
    // height: 100%;
}
</style>
