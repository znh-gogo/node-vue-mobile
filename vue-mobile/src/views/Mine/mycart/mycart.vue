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
        <div style="text-align: center">
            <img src="../../../assets/空购物车.png" alt="" style="margin:2rem auto">
            <div>亲，购物车还是空的哦</div>
            <div style="width: 100%;text-align: center;margin-top: 1rem;">
                <mt-button type="primary" @click="$router.push('/home')" style="width: 90%;">回到商城挑选商品</mt-button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    
}
</script>