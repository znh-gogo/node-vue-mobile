<template>
    <div style="width: 100%;height: 100vh;background-color: #fafafa;">
        <mt-header title="我的购物中心" style="background-color:#f1f1f1;color: #222222;font-size: 1.2rem;height:4rem">
            <router-link to="/mine" slot="left">
                <mt-button icon="back"></mt-button>
            </router-link>
            <!-- <div slot="right" style="font-size:1.3rem;color:#222222" @click="change">
                完成
            </div> -->
        </mt-header>
        <div style="text-align: center" v-if="!showflag">
            <img src="../../../assets/空购物车.png" alt="" style="margin:2rem auto">
            <div>亲，购物车还是空的哦</div>
            <div style="width: 100%;text-align: center;margin-top: 1rem;">
                <mt-button type="primary" @click="$router.push('/home')" style="width: 90%;">回到商城挑选商品</mt-button>
            </div>
        </div>
        <div v-if="showflag" style="width:100%">
            <div class="listbox" v-for="(item,index) in mybuylist" :key="index" @click="$router.push({path:'/order-detail',query:{gid:item._id}})">
                <div style="display:flex;width:100%;padding:1rem">
                    <div v-if="item.pro_imgs"><img :src="item.pro_imgs[0]" alt="" style="width:5rem;height:5rem"></div>
                    <div style="margin-left:1rem;width:100%">
                        <div style="font-weight:700;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;width:12rem;">{{item.pro_description}}</div>
                        <div style="color:red;font-weight:700;margin:0.8rem 0">{{item.pro_price}}元</div>
                        <div>交易成功</div>
                    </div>
                </div>
                <div style="width:90%;height:0.2rem;background:#ddd;margin:1rem auto"></div>
                <div v-if="item.seller" style="padding: 0 1rem">
                    <a style="color:#409EFF;margin-left:1rem">联系卖家</a>
                    <!-- <div style="display:inline-block"><img :src="item.seller.headImg" alt="" style="width:3rem;height:3rem"></div>
                    <div style="display:inline-block;font-weight:700;margin-left:1rem;margin-bottom:1rem">{{item.seller.nickname}}</div> -->
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import api from '../../../api'
export default {
    data(){
        return{
            mybuylist:[],
            showflag:true
        }
    },
    methods:{
        getmybuy(){
            let id = sessionStorage.id
            api.showMyBuy({id}).then(res=>{
                this.mybuylist = res
                if(res.length === 0){
                    this.showflag = false
                }
            })
        }
    },
    mounted(){
        this.getmybuy()
    }
}
</script>

<style lang="scss" scoped>
.listbox{
    width:90%;
    // height:10rem;
    // border:1px solid #aaa;
    margin:1rem auto;
    box-shadow:0 4px 8px #ccc;
    // margin:2rem;
    padding-bottom:1rem ;
}
</style>