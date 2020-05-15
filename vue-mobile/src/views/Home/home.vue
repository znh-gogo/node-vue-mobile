<template>
    <div>
    <van-pull-refresh v-model="vantLoading" @refresh="onRefresh">

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
        <div style="width:100%" v-show="swiperFlag">
            <swiper :options="swiperOption" v-if="adList.length>0" ref="mySwiper">
                <swiper-slide v-for="(item,index) in adList" :key="index" style="position:relative">
                    <img class="w-100" style="height:180px;" :src="item.ad_img" alt="">
                    <div class="swiper-text">
                        <div class="text-name">{{item.ad_name}}</div>
                        <div class="text-desc">{{item.ad_description}}</div>
                    </div>    
                </swiper-slide>
                <div class="swiper-pagination pagination-home text-right" slot="pagination"></div>
            </swiper>
            <swiper v-if="showdefault" :options="swiperOption">
                <swiper-slide>
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
        <!-- <div style="">
            <div style="width:80%;margin:0 auto;padding:0.5rem 0;display:flex;justify-content:space-between;">
                <div>如何成为商家?</div>
                <div style="color:#409EFF">→点这里</div>
            </div>
        </div> -->
        <div class="pt-3 pb-2 bg10">
            <div class="nav d-flex jc-around pb-1" style="font-size:1.5rem;line-height:1.5rem;">
                <div :class="[{'nav-item':chooseflag===false},{'active':chooseflag===true}]">
                    <div class="p-2" @click="chooseflag = true">最新发布</div>
                </div>
                <div :class="[{'nav-item':chooseflag===true},{'active':chooseflag===false}]">
                    <div class="p-2" @click="chooseflag = false">我的关注</div>
                </div>
            </div> 
        </div>
        </van-pull-refresh>

        <!-- <router-view></router-view> -->
        <div v-if="chooseflag">
            <HomeGood :result="tflag" @setFlag="setnull" @closeLoad="getLoad" ref="good"></HomeGood>
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
import api from '../../api'
var vm = null
export default {
    data(){
        return{
             swiperOption:{
                pagination:{
                el:".pagination-home",
                },
                autoplay:true,
                loop:true,
                observer:true,
                observeParents:true,
                on: {
                        slideChangeTransitionEnd: function() {
                            // console.log(this.activeIndex);
                            //切换结束时，告诉我现在是第几个slide
                            //                             const realIndex = this.activeIndex;
                            //                             vm.carousel(realIndex);
                        },
                        click: function() {
                          // 这里有坑，需要注意的是：this 指向的是 swpier 实例，而不是当前的 vue， 因此借助 vm，来调用 methods 里的方法 
                          // console.log(this); // -> Swiper
                          // 当前活动块的索引，与activeIndex不同的是，在loop模式下不会将 复制的块 的数量计算在内。
                          if(vm.showdefault){
                              return
                          }
                            console.log('ss'+this.realIndex)
                            const realIndex = this.realIndex;
                            vm.checkInfo(vm.adList[realIndex]);
                        }
                    },
            },
            chooseflag:true,
            result:'',
            tflag:'',
            adList:[],
            showdefault:false,
            vantLoading:false,
            swiperFlag:true
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
        },
        setnull(){
            this.tflag = ''
        },
        fetchAd(){
            api.showpayad().then(res=>{
                if(res.length!==0){
                    this.adList = res
                } else {
                    this.showdefault = true
                }
            })
        },
        onRefresh(){
            this.$refs.good.onRefresh();
        },
        getLoad(e){
            this.vantLoading = e
        },
        checkInfo(e){
            // console.log(e.relative)
            let id = sessionStorage.id
            this.$router.push({path:'/social/info',query:{id:e.relative,flag:e.relative===id?false:true}})
        }
    },
    mounted(){
        this.fetchAd()
        // console.log(this.$store.state.account)
        // this.$router.push({path:'/'})
    },
    computed: {
            swiper() {
                return this.$refs.mySwiper.swiper;
            }
        },
    created() {
        vm = this;
    },
    deactivated(){
        this.swiperFlag = false
        // console.log(123)
    },
    activated(){
        // console.log(456)
        setTimeout(()=>{
            this.swiperFlag = true
        },100)
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
        // opacity:1;
        color: #000;
    }
    .active{
        // padding: 3px;
        font-weight: bold;
        border-bottom:2px solid rgb(48, 8, 121); 
        color: #000;
    }
    .swiper-text{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 1rem;
        .text-name{
            text-shadow:5px 3px 5px #999;
            color:#000;
            font:18px/14px Georgia, "Times New Roman", Times, serif;
            font-size: 1.2rem;
            font-weight: 700;
        }
        .text-desc{
            width: 80%;
            padding: 0.3rem;
            background:rgba(255,255,255,0.5);
            border-radius:0.5rem; 
            // overflow:hidden; 
            // text-overflow:ellipsis;
            // display:-webkit-box; 
            // -webkit-box-orient:vertical;
            // -webkit-line-clamp:2; 
        }
    }
    .bg10{
        background:url('../../assets/bg10.jpg') no-repeat 100% top;
        background-size:100%; 
    }
</style>