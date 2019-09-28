<template>
    <div>
        <div class="text-white py-2 px-3 d-flex ai-center jc-between" style="background:#4DA422">
            <div style="line-height:2rem">农商品信息服务交易平台</div>
            <button type="button" class="btn" style="background:#E8EB12">欢迎使用</button>
        </div>
        <div style="height:100%;width:100%;">
            <mt-search
            style="height:100%;display:inline-block;width:100%;border-radius:2rem"
            v-model="result"
            cancel-text="取消"
            placeholder="搜索">
            </mt-search>
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
                <div class="nav-item">
                    <router-link class="nav-link p-2" tag="div" to="/home/good">最新发布</router-link>
                </div>
                <div class="nav-item">
                    <router-link class="nav-link p-2" tag="div" to="/about">我的关注</router-link>
                </div>
                <!-- <div class="nav-item">
                    <router-link class="nav-link" tag="div" to="/">赛事中心</router-link>
                </div> -->
            </div> 
        </div>
        <router-view></router-view>
    </div>
</template>

<script>
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
            result:''
        }
    }
}
</script>