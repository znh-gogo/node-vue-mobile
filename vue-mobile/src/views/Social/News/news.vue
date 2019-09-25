<template>
    <div style="width: 100%;">
        <mt-header title="资讯列表" style="background-color:#f1f1f1;color: #222222;font-size: 1.2rem;height:4rem">
            <router-link to="/social" slot="left">
                <mt-button icon="back"></mt-button>
            </router-link>
            <!-- <div slot="right" style="font-size:1.3rem;color:#222222" @click="change">
                完成
            </div> -->
        </mt-header>
        <div style="padding:1rem">
            <div style="font-size:1.5rem;margin-bottom:1rem">最新资讯列表</div>
            <div
            v-for="(text,key) in newslist"
            :key="key"
            @click="$router.push({path:'/social/news-content',query:{id:text._id}})"
            style="text-decoration:underline;color:#000;display:flex;justify-content:space-between;padding:0 1rem;margin:0.5rem 0">
                    <span style="width:100%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" class="text-hidden">[资讯]{{text.articleName}}</span>
                    <span style="white-space:nowrap;">{{format(text.createdAt)}}</span>
            </div>
        </div>
    </div>    
</template>

<script>
import api from '../../../api'
import format from '../../../common/common'
export default {
    data(){
        return{
            newslist:[],
            format
        }
    },
    methods:{
        getnewslist(){
            api.getAllNews().then(res=>{
                this.newslist = res.reverse()
            })
        }
    },
    mounted(){
        this.getnewslist()
    }
}
</script>