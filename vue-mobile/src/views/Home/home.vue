<template>
    <div>
        <div class="text-white py-2 px-3 d-flex ai-center jc-between" style="background:#4DA422">
            <div style="line-height:2rem">农商品信息服务交易平台</div>
            <button type="button" class="btn" style="background:#E8EB12">欢迎使用</button>
        </div>
        <div style="height:100%;width:100%;">
            <!-- <mt-search
            style="height:100%;display:inline-block;width:100%;border-radius:2rem"
            v-model="result"
            cancel-text="取消"
            placeholder="搜索">
            </mt-search> -->
            <van-search
            v-model="result"
            placeholder="请输入搜索关键词"
            show-action
            shape="round"
            @search="onSearch"
            >
            <div slot="action" @click="onSearch">搜索</div>
            </van-search>
            <!-- <mt-button type="primary" size="small" style="width:20%;height:100%;display:inline-block;vertical-align: top;">搜索</mt-button> -->
        </div>
        <div style="width:100%">
            <swiper :options="swiperOption">
                <swiper-slide >
                    <img class="w-100" style="height:180px" src="../../assets/n1.jpg" alt="">
                </swiper-slide>
                <swiper-slide>
                    <img class="w-100" style="height:180px" src="../../assets/n2.jpg" alt="">
                </swiper-slide>
                <swiper-slide>
                    <img class="w-100" style="height:180px" src="../../assets/n3.jpg" alt="">
                </swiper-slide>
                <div class="swiper-pagination pagination-home text-right" slot="pagination"></div>
            </swiper>
        </div>
        <div class=" pt-3 pb-2" style="background:#ccc">
            <div class="nav d-flex jc-around pb-1" style="font-size:1.5rem;line-height:1.5rem">
                <div :class="[{'nav-item':chooseflag===false},{'active':chooseflag===true}]">
                    <div class="p-2" @click="chooseflag = true">最新发布</div>
                </div>
                <div :class="[{'nav-item':chooseflag===true},{'active':chooseflag===false}]">
                    <div class="p-2" @click="chooseflag = false">我的关注</div>
                </div>
            </div> 
        </div>
        <!-- <router-view></router-view> -->
        <div v-if="chooseflag">
            <HomeGood :result="tflag"></HomeGood>
        </div>
        <div v-else>
            <About></About>
        </div>
    </div>
</template>

<script>
import { Toast } from 'mint-ui';
import HomeGood from './HomeGood'
import About from './About'
export default {
    data(){
        return{
             swiperOption:{
                autoplay:true,
                loop:true,
                pagination:{
                el:".pagination-home",
                }
            },
            chooseflag:true,
            result:'',
            tflag:''
        }
    },
    components:{
        HomeGood,
        About
    },
    methods:{
        onSearch(){
            if(this.result === ''){
                Toast('搜索的关键词为空')
                return
            }
            // this.$router.push({path:'/'})
            // this.$router.push({path:'/home/good',query:{key:this.result}})
            this.tflag = this.result
            this.result = ''
        }
    },
    mounted(){
        // this.$router.push({path:'/'})
    }
}
</script>

<style lang="scss" scoped>

.nav{

}
    .nav-item{
        border-bottom:2px solid transparent; 
        // padding: 3px;
        // padding-bottom: 0.2rem;
    }
    .active{
        // padding: 3px;
        font-weight: bold;
        border-bottom:2px solid rgb(48, 8, 121); 
    }
</style>