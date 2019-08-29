<template>
    <div>
        <mt-header style="background-color:#fafafa;color: #222222;font-size: 1.2rem;height:4rem">
            <router-link to="/social" slot="left">
                <mt-button icon="back"></mt-button>
            </router-link>
                <div slot="right" @click="sendInfo">发布</div>
        </mt-header>
        <mt-field placeholder="这一刻的想法..." type="textarea" rows="4" v-model="model.topiccontent">
        </mt-field>
        <div style="background:#fff;padding:1rem;display:flex;flex-wrap:wrap">
            <div style="display:inline-block" v-if="model.topicImg.length!==0">
                <img 
                :src="item"
                v-for="(item,index) in model.topicImg"
                :key="index"
                @click="delImg(index)"
                style="width:8rem;height:8rem;margin-right:0.5rem;maigin-bottom:0.5rem">
            </div>
            <label for="file" style="display:inline-block;font-size:5rem;width:8rem;height:8rem;line-height:8rem;
            background-color:#ddd;color:#ecf6fb;border-radius:1rem;text-align:center">+</label>
            <input type="file" name="file" id="file" @change="getfile" style="display:none">
        </div>
    </div>
</template>

<script>
import api from '../../../api'
import { Toast } from 'mint-ui'
export default {
    data(){
        return{
            model:{
                topicImg:[]
            }
        }
    },
    methods:{
        getfile(e){
            // console.log(e.target.files[0])
            let form = new FormData()
            form.append('file',e.target.files[0])
            api.uploadImg(form).then((res)=>{
                this.model.topicImg.push(res.url)
            })
        },
        sendInfo(){
            if(this.model.topiccontent === undefined || this.model.topiccontent === ''){
                Toast('值不能为空')
                return
            }
            this.$set(this.model,'relative',this.$route.query.id)
            api.sendTopic(this.model).then(res => {
                if(res){
                    this.$router.push('/social')
                }
            })
        },
        delImg(i){
            this.model.topicImg.splice(i,1)
        }
    }
}
</script>