<template>
    <div style="width: 100%;height: 100vh;background-color: #fafafa;">
        <mt-header title="意见反馈" style="background-color:#f1f1f1;color: #222222;font-size: 1.2rem;height:4rem">
            <router-link to="/mine" slot="left">
                <mt-button icon="back"></mt-button>
            </router-link>
        </mt-header>
        <div style="width:100%;height:3rem;display:flex;border-bottom:1px solid #ccc">
            <div style="flex:1;text-align:center;line-height:3rem" :class="{'current':nowIndex === 1}" @click="nowIndex = 1">意见反馈</div>
            <div style="flex:1;text-align:center;line-height:3rem" :class="{'current':nowIndex === 2}" @click="showmyfeedback">我的反馈</div>
        </div>
        <div v-if="nowIndex === 1">
            <div style="margin:1rem;color:#666">反馈问题：</div>
            <mt-field placeholder="请输入您反馈的问题类型" v-model="model.feedbacktopic"></mt-field>
            <mt-field placeholder="请输入您反馈的问题内容" type="textarea" rows="4" v-model="model.feedbackcontent"></mt-field>
            <div style="margin:1rem;color:#666">反馈截图：</div>
            <div style="background:#fff;padding:1rem;display:flex;flex-wrap:wrap">
            <div style="display:inline-block" v-if="model.feedbackimg.length!==0">
                <img 
                :src="item"
                v-for="(item,index) in model.feedbackimg"
                :key="index"
                @click="delImg(index)"
                style="width:8rem;height:8rem;margin-right:0.5rem;maigin-bottom:0.5rem">
            </div>
            <label for="file" style="display:inline-block;font-size:5rem;width:8rem;height:8rem;line-height:8rem;
            background-color:#ddd;color:#ecf6fb;border-radius:1rem;text-align:center">+</label>
            <input type="file" name="file" id="file" @change="getfile" style="display:none">
            </div>
            <div style="width: 100%;text-align: center;margin-top: 1rem;">
                    <mt-button type="primary" @click="sendfeedback" style="width: 90%;">提交反馈</mt-button>
            </div>
        </div>
        <div v-if="nowIndex === 2">
            <div
            v-for="(item,index) in myfeedbacklist"
            :key="index"
            @click="$router.push({path:'/mine/checkmyfeedback',query:{id:item._id}})"
            style="width:100%;height:5rem;border-bottom:1px solid #eee;display:flex;justify-content:space-between;background:#f1f1f1">
                <div style="line-height:5rem;margin-left:1rem;font-size:1.4rem">{{item.feedbacktopic}}</div>
                <div style="line-height:5rem;margin-right:1rem;font-size:1rem">处理进度：<span :class="[{'warning':item.feedbackflag===0},{'success':item.feedbackflag===1}]">{{item.feedbackflag === 0?'处理中':'已处理'}}</span></div>
            </div>
            <div style="width:100%;text-align:center;margin-top:1rem" v-if="myfeedbacklist.length === 0">暂时没有发现您的反馈信息哦</div>
        </div>
    </div>
</template>

<script>
import api from '../../../api'
import { MessageBox } from 'mint-ui'
export default {
    data(){
        return{
            model:{
                feedbackimg:[]
            },
            nowIndex:1,
            myfeedbacklist:[]
        }
    },
    methods: {
        getfile(e){
            // console.log(e.target.files[0])
            let form = new FormData()
            form.append('file',e.target.files[0])
            api.uploadImg(form).then((res)=>{
                this.model.feedbackimg.push(res.url)
            })
        },
        delImg(i){
            this.model.feedbackimg.splice(i,1)
        },
        sendfeedback(){
            let id = window.sessionStorage.getItem('id')
            this.$set(this.model,'relative',id)
            api.Feedback(this.model).then(res => {
                if(res.message) {
                    MessageBox('提示',res.message)
                    this.model={
                        feedbackimg:[]
                    }
                }
            })
        },
        showmyfeedback(){
            this.nowIndex = 2
            let id = window.sessionStorage.getItem('id')
            api.showMyFeedback({id}).then(res=>{
                this.myfeedbacklist = res.reverse()
            })
        }
    },
    mounted() {
        
    }
}
</script>

<style scoped>
.current{
    color:#0399d3;
    border-bottom:0.2rem solid #0399d3;
}
.warning{
    color:#E6A23C;
    font-size: 1.4rem;
}
.success{
    color: #67C23A;
    font-size: 1.4rem;
}
</style>