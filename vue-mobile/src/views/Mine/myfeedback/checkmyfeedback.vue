<template>
    <div style="width: 100%;height: 100vh;background-color: #fafafa;">
        <mt-header title="查看我的反馈" style="background-color:#f1f1f1;color: #222222;font-size: 1.2rem;height:4rem">
            <router-link to="/mine/myfeedback" slot="left">
                <mt-button icon="back"></mt-button>
            </router-link>
        </mt-header>
        <div style="margin:1rem;color:#666">反馈问题：</div>
        <mt-field placeholder="请输入您反馈的问题类型" v-model="showInfo.feedbacktopic" disabled></mt-field>
        <mt-field placeholder="请输入您反馈的问题内容" type="textarea" rows="4" v-model="showInfo.feedbackcontent" disabled></mt-field>
        <div style="margin:1rem;color:#666">反馈截图：</div>
        <div v-for="(item,index) in showInfo.feedbackimg" :key="index" style="margin-left:1rem;">
            <img :src="item" alt="" style="width:8rem;height:8rem;">
        </div>
        <div style="width: 100%;text-align: center;margin-top: 1rem;" v-if="showInfo.feedbackflag===0">
            <mt-button type="danger" @click="delfeedback" style="width: 90%;">撤回反馈</mt-button>
        </div>
    </div>
</template>

<script>
import api from '../../../api'
import { Toast } from 'mint-ui'
export default {
    data(){
        return{
            feedbackid:null,
            showInfo:{}
        }
    },
    methods:{
        getInfo(){
            api.showMyFeedbackDetail({id:this.feedbackid}).then(res=>{
                this.showInfo = res
                // console.log(res)
            })
        },
        delfeedback(){
            api.delMyfeedback({id:this.feedbackid}).then(res =>{
                Toast(res.message)
                this.$router.go(-1)
            })
        }
    },
    mounted(){
        this.getInfo()
    },
    created(){
        this.feedbackid = this.$route.query.id
    }
}
</script>