<template>
    <div style="width: 100%;background-color: #fafafa;padding-bottom:1rem">
        <mt-header title="资讯详情" style="background-color:#f1f1f1;color: #222222;font-size: 1.2rem;height:4rem">
            <!-- <router-link to="/social" slot="left">
                <mt-button icon="back"></mt-button>
            </router-link> -->
                <mt-button icon="back" slot="left" @click="$router.go(-1)"></mt-button>

            <!-- <div slot="right" style="font-size:1.3rem;color:#222222" @click="change">
                完成
            </div> -->
        </mt-header>
        <div style="text-align:center;margin-top:1rem;font-size:1.5rem;line-height:1.5rem;padding:0 2rem">{{news.articleName}}</div>
        <div style="width:95%;text-align:right;margin-top:1rem;font-size:0.8rem" v-if="news.createdAt">{{format(news.createdAt)}}</div>
        <div v-html="news.articleContent" class="contents"></div>
        <div style="width:90%;height:0.1rem;background:#ccc;margin:1rem auto"></div>
        <div style="width:100%;text-align:center">如果喜欢请添加收藏~</div>
        <div style="width:100%;text-align:center" v-if="news.art_attention">当前已经有 {{news.art_attention.length}} 人收藏~</div>
        <div style="width:100%;text-align:center;margin-top:1rem;font-weight:700" v-if="saveText === '取消收藏'">收藏成功，可以在个人中心-我的收藏中查看</div>
        <div style="width:100%;text-align:center;margin-top:1rem;"><mt-button style="background:green;color:#fff" @click="addsave">{{saveText}}</mt-button></div>
    </div>
</template>

<script>
import api from '../../../api'
import format from '../../../common/common'
export default {
    data(){
        return{
            newsid:'',
            news:'',
            format,
            saveText:'添加收藏',
            accoundid:''
        }
    },
    methods:{
        getInfo(){
            this.accoundid = sessionStorage.id
            this.saveText = '添加收藏'
            api.newsInfo({id:this.newsid}).then(res=>{
                this.news = res
                for(let i =0;i<res.art_attention.length;i++){
                    if(res.art_attention[i]===this.accoundid){
                        this.saveText = '取消收藏'
                    }
                }
            })
        },
        addsave(){
            api.saveNews({id:this.newsid,uid:this.accoundid}).then(res=>{
                this.getInfo()
            })
        }
    },
    mounted(){
        this.getInfo()
    },
    created(){
        this.newsid = this.$route.query.id
    }
}
</script>

<style scoped>
.contents{
    padding:1rem;
    overflow:hidden;
}
.contents>>>img,p,span{
    width: 100%!important;
}
</style>