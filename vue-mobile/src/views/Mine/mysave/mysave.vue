<template>
    <div style="width: 100%;height: 100vh;background-color: #fafafa;">
        <mt-header title="我的收藏" style="background-color:#f1f1f1;color: #222222;font-size: 1.2rem;height:4rem">
            <router-link to="/mine" slot="left">
                <mt-button icon="back"></mt-button>
            </router-link>
        </mt-header>
        <div style="width:100%;height:3rem;display:flex;border-bottom:1px solid #ccc">
            <div style="flex:1;text-align:center;line-height:3rem" :class="{'current':nowIndex === 1}" @click="nowIndex = 1">文章收藏</div>
            <div style="flex:1;text-align:center;line-height:3rem" :class="{'current':nowIndex === 2}" @click="showmyPro">商品收藏</div>
        </div>
        <div v-if="nowIndex ===1">
            <div style="width:100%;text-align:center;margin:1rem" v-if="articleList.length === 0">您暂时还没有收藏什么文章资讯哦</div>
            <div v-else style="width:100%">
                <div style="margin:0 1rem;border-bottom:0.1rem solid #ccc;padding:0.5rem 0;color:#666">您已经收藏 {{articleList.length}} 篇文章</div>
                <div v-for="(item,index) in articleList" :key="index" @click="$router.push({path:'/social/news-content',query:{id:item._id}})">
                    <div class="contentbox">
                        <div style="width:70%">
                            <div style="font-weight:700;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;margin-right:0.5rem">{{item.articleName}}</div>
                            <div style="margin-top:0.5rem;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;margin-right:0.5rem">
                                分类:<span v-for="(k,v) in item.relative" :key="v" style="font-weight:700">{{k.className}} </span>
                            </div>
                        </div>
                        <div style="white-space:nowrap;width:30%">{{format(item.createdAt)}}</div>
                    </div>
                    <div class="line"></div>
                </div>
            </div>
        </div>
        <div v-if="nowIndex === 2">
                <div style="width:100%;margin:2rem auto;text-align:center"><mt-button type="primary" @click="$router.push('/about')">去查看我的关注</mt-button></div>
        </div>
    </div>    
</template>

<script>
import api from '../../../api'
import format from '../../../common/common'
export default {
    data(){
        return{
            nowIndex:1,
            articleList:[],
            format
        }
    },
    methods:{
        showmyPro(){
            this.nowIndex = 2
        },
        getArtList(){
            let id = sessionStorage.id
            api.showmysaveNews({id}).then(res=>{
                this.articleList = res
            })
        }
    },
    mounted(){
        this.getArtList()
    }
}
</script>

<style scoped>
.current{
    color:#0399d3;
    border-bottom:0.2rem solid #0399d3;
}
.contentbox{
    width: 100%;
    padding: 1rem;
    display: flex;
    justify-content: space-between;
}
.line{
    width:100%;
    height:0.3rem;
    background:#eee;
}
</style>