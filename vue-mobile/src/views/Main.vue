<template>
    <div style="height:100%">
        <router-view></router-view>
        <div class="footer">
        <router-link class="nav-link" tag="div" to="/home" style="flex:1">
            <img src="../assets/home.png" alt="" style="width:2.2rem;margin-top:0.5rem" v-if="$route.path !== '/home'">
            <img src="../assets/home-checked.png" alt="" style="width:2.2rem;margin-top:0.5rem" v-if="$route.path === '/home'">     
            <div  :class="{'current': $route.path === '/home'}">商品首页</div>
        </router-link>
        <router-link class="nav-link" tag="div" to="/social" style="flex:1">
            <img src="../assets/social.png" alt="" style="width:2.2rem;margin-top:0.5rem" v-if="$route.path !== '/social'">
            <img src="../assets/social-checked.png" alt="" style="width:2.2rem;margin-top:0.5rem" v-if="$route.path === '/social'">
            <div :class="{'current': $route.path === '/social'}">资讯中心</div>
        </router-link>
        <router-link class="nav-link" tag="div" to="/conversation" style="flex:1">
            <img src="../assets/chat.png" alt="" style="width:2.2rem;margin-top:0.5rem" v-if="$route.path !== '/conversation'">
            <img src="../assets/chat-checked.png" alt="" style="width:2.2rem;margin-top:0.5rem" v-if="$route.path === '/conversation'">
            <div :class="{'current': $route.path === '/conversation'}">会话列表</div>
        </router-link>
        <router-link class="nav-link" tag="div" to="/mine" style="flex:1">
            <img src="../assets/my.png" alt="" style="width:2.2rem;margin-top:0.5rem" v-if="$route.path !== '/mine'">
            <img src="../assets/my-checked.png" alt="" style="width:2.2rem;margin-top:0.5rem" v-if="$route.path === '/mine'">
            <div :class="{'current': $route.path === '/mine'}">个人中心</div>
        </router-link>
        </div>
    </div>
</template>

<script>
    export default {

    }
</script>

<style lang="scss" scoped>
    .footer{
        height: 5rem;
        width: 100%;
        position: fixed;
        left: 0;
        bottom: 0;
        border-top: 1px solid #ccc; 
        display: flex;
        background-color: #fff;
        div {
            text-align: center;
            color: #707070;
            // line-height: 5rem;
            // flex: 1;
            // cursor: pointer;
        }
    }
    .current {
        color: #3385ff !important;
    }
</style>
