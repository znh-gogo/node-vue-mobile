<template>
  <div class="home">
    <el-container style="min-height: 100vh; ">
      
  <el-aside style="background-color: #002140;width:auto;max-width:201px">
    
    <div style="height:60px;display:flex;align-items:center;justify-content:center" v-if="!isCollapse"><img src="../assets/title.jpg" style="width:90%;border-radius:10px;" alt=""></div>
    <div style="height:60px;line-height:60px;text-align:center;font-size:18px;padding:0 10px;color: #fff;" v-else>
      农产
    </div>

    <el-menu
    class="el-menu-vertical-demo"
    router
    :default-active="$route.path"
    unique-opened
    @open="handleOpen"
    @close="handleClose"
    :collapse="isCollapse"
    background-color="#001529"
    text-color="#fff"
    active-text-color="#ffd04b">
      <el-submenu index="0">
        <template slot="title"><i class="el-icon-s-home"></i><span>首页</span></template>
        <el-menu-item-group>
          <el-menu-item index="/homepage" v-if="authflag === 1">首页</el-menu-item>
          <el-menu-item index="/sellerpage" v-if="authflag === 0">首页</el-menu-item>
        </el-menu-item-group>
      </el-submenu>

      <el-submenu index="1" v-if="authflag === 2">
        <template slot="title"><i class="el-icon-user"></i><span>用户管理</span></template>
        <el-menu-item-group>
          <template slot="title">用户</template>
          <el-menu-item index="/userList">用户列表</el-menu-item>
          <el-menu-item index="/userAdd">添加用户</el-menu-item>
        </el-menu-item-group>
      </el-submenu>

      <el-submenu index="2"  v-if="authflag === 1">
        <template slot="title"><i class="el-icon-s-shop"></i><span>商品管理</span></template>
        <el-menu-item-group>
          <template slot="title">商品</template>
          <el-menu-item index="/goodsList">商品列表</el-menu-item>
          <el-menu-item index="/goodsAdd">商品类别</el-menu-item>
        </el-menu-item-group>
      </el-submenu>

      <el-submenu index="3"  v-if="authflag === 1">
        <template slot="title"><i class="el-icon-notebook-2"></i><span>文章管理</span></template>
        <el-menu-item-group>
          <template slot="title">文章</template>
          <el-menu-item index="/articleClassAdd">新建文章分类</el-menu-item>
          <el-menu-item index="/articleClassList">文章分类列表</el-menu-item>
          <el-menu-item index="/articleAdd">新建文章</el-menu-item>
          <el-menu-item index="/articleList">文章列表</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="4"  v-if="authflag === 1">
        <template slot="title"><i class="el-icon-collection"></i><span>计划管理</span></template>
        <el-menu-item-group>
          <template slot="title">计划</template>
          <el-menu-item index="/planAdd">添加计划</el-menu-item>
          <el-menu-item index="/planList">计划列表</el-menu-item>
          <el-menu-item index="/planmakerAdd">添加计划人</el-menu-item>
          <el-menu-item index="/planmakerList">计划人列表</el-menu-item>
        </el-menu-item-group>
      </el-submenu>

      <el-submenu index="5" v-if="authflag === 1">
        <template slot="title"><i class="el-icon-user"></i><span>管理员管理</span></template>
        <el-menu-item-group>
          <template slot="title">管理员</template>
          <el-menu-item index="/adminList">管理员列表</el-menu-item>
          <el-menu-item index="/adminAdd">添加管理员</el-menu-item>
        </el-menu-item-group>
      </el-submenu>

      <el-submenu index="6"  v-if="authflag === 1">
        <template slot="title"><i class="el-icon-s-custom"></i><span>账户管理</span></template>
        <el-menu-item-group>
          <!-- <template slot="title">管理员</template> -->
          <el-menu-item index="/accountList">账户列表</el-menu-item>
          <!-- <el-menu-item index="/adminAdd">添加管理员</el-menu-item> -->
        </el-menu-item-group>
      </el-submenu>

      <el-submenu index="7"  v-if="authflag === 1">
        <template slot="title"><i class="el-icon-edit-outline"></i><span>反馈管理</span></template>
        <el-menu-item-group>
          <!-- <template slot="title">管理员</template> -->
          <el-menu-item index="/feedbackList">反馈列表</el-menu-item>
          <!-- <el-menu-item index="/adminAdd">添加管理员</el-menu-item> -->
        </el-menu-item-group>
      </el-submenu>

      <el-submenu index="8"  v-if="authflag === 0">
        <template slot="title"><i class="el-icon-s-shop"></i><span>商品管理</span></template>
        <el-menu-item-group>
          <!-- <template slot="title">管理员</template> -->
          <el-menu-item index="/selling">商品发售</el-menu-item>
          <el-menu-item index="/myprolist">商品列表</el-menu-item>
        </el-menu-item-group>
      </el-submenu>

      <el-submenu index="9"  v-if="authflag === 1">
        <template slot="title"><i class="el-icon-s-marketing"></i><span>广告管理</span></template>
        <el-menu-item-group>
          <!-- <template slot="title">管理员</template> -->
          <el-menu-item index="/setAd">广告价格与时长</el-menu-item>
          <el-menu-item index="/Adlist">广告申请列表</el-menu-item>
        </el-menu-item-group>
      </el-submenu>

      <el-submenu index="10"  v-if="authflag === 0">
        <template slot="title"><i class="el-icon-s-platform"></i><span>商家广告管理</span></template>
        <el-menu-item-group>
          <!-- <template slot="title">管理员</template> -->
          <el-menu-item index="/Adapply">广告申请</el-menu-item>
          <el-menu-item index="/myAdList">广告列表</el-menu-item>
        </el-menu-item-group>
      </el-submenu>

      <el-submenu index="11"  v-if="authflag === 1">
        <template slot="title"><i class="el-icon-s-tools"></i><span>日志操作管理</span></template>
        <el-menu-item-group>
          <!-- <template slot="title">管理员</template> -->
          <el-menu-item index="/logList">日志操作列表</el-menu-item>
          <!-- <el-menu-item index="/myAdList">广告列表</el-menu-item> -->
        </el-menu-item-group>
      </el-submenu>

    </el-menu>
  </el-aside>
    
     
  <el-container style="position:relative;">
    <el-header class="header">
      <div style="align-items:center;display:flex;">
        <el-button type="text" :icon="isCollapse?'el-icon-s-unfold':'el-icon-s-fold'" @click="isCollapse = !isCollapse" style="font-size:28px;color:#666;outline:none"></el-button>
        <div style="margin-left:20px;font-size:20px;font-weight:700;">{{authflag === 0?'商家端':'管理端'}}</div>
      </div>
      <div style="align-items:center;display:flex;">
        <div class="header-dropdown">
            <i :class="{icon:true,'ion-md-expand':!isFullScreen,'ion-md-contract':isFullScreen}" style="font-size:20px;"
                @click.stop="handleChangeFullScreen"></i>
        </div>
        <img :src="headimg" style="width:30px;height:30px;border-radius:50%;" v-if="headimg!==''"/>
        <img src="../assets/head.jpg" style="width:30px;height:30px;border-radius:50%;" v-else/>
        <span style="margin:0 15px">{{username}}</span>
        <el-dropdown style="cursor: pointer;">
          <i class="el-icon-setting" style="margin-right: 15px;color:#666">设置<el-badge is-dot class="item" v-if="authflag === 0&&paybacknum!==0"/></i>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>查看</el-dropdown-item>
            <el-dropdown-item v-if="authflag === 0" @click.native="paybackapply">退款申请<el-badge class="mark" :value="paybacknum" v-if="paybacknum!==0" /></el-dropdown-item>
            <el-dropdown-item @click.native="logout">退出登陆</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-header>
      
    <div class="main-body-wrap">
        <slot name="main-body">
            <TabView :show-nav-tab="showNavTab"></TabView>
        </slot>
    </div>
    <div style="background-color:#f1f1f1;text-align:center;color:#666;font-size:14px;position:absolute;bottom:0;width:100%;padding:15px 0">
            Copyright © 2019 All informations from Vue.js. 
    </div>
    <!-- <el-main style="background-color:#f7f7f7">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path:authflag ===1? '/homepage':'sellerpage' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item v-if="$route.meta.name">{{$route.meta.name}}</el-breadcrumb-item>
      </el-breadcrumb>
      <div style="padding:15px;">
        <router-view :key="$route.path" style="background-color:#fff"></router-view>
      </div>
    </el-main> -->

    
  </el-container>
</el-container>
  </div>
</template>

<script>
// @ is an alias to /src
import TabView from '../components/tab-view/TabView'
import {MOBILE} from '../api/globol'
import screenfull from 'screenfull';
export default {
  name: 'home',
  components:{
    TabView
  },
  data() {
      return {
        username:'',
        authflag:'',
        paybacknum:0,
        isCollapse: false,
        headimg:'',
        showNavTab:true,
        isFullScreen: false,
      }
    },
    methods:{
      logout(){
        sessionStorage.clear()
        this.$router.push('/login')
      },
      getInfo(){
        this.authflag = parseInt(sessionStorage.authflag)
          let id = sessionStorage.id
          if(this.authflag ===0){
            this.$http.post(MOBILE+'/notifyPayback',{id}).then(res=>{
                this.paybacknum = res.data.paybacknum
                // console.log(res.data.paybacknum)
            })
          }
      },
      paybackapply(){
        if(this.paybacknum===0){
          this.$message.success('您未收到任何退款通知')
        } else {
          this.$message.warning(`您收到了${this.paybacknum}条退款通知，去商品列表中处理吧！`)
          this.$router.push('/myprolist')
        }
      },
      handleOpen(key, keyPath) {
        // console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        // console.log(key, keyPath);
      },
      handleChangeFullScreen() {
          if (screenfull.isEnabled) {
              screenfull.toggle();
              this.isFullScreen = !this.isFullScreen;
          }
      },
    },
    mounted(){
      this.username = sessionStorage.username
      this.getInfo()
      if(sessionStorage.headimg){
        this.headimg = sessionStorage.headimg
      }
    }

}
</script>

<style lang="scss" scoped>
  .el-header {
    background-color:#606266;
    color: #fff;
    line-height: 60px;
  }
  .header{
    font-size: 12px;
    background-color: #fff;
    color:#666;
    display: flex;
    justify-content: space-between;
  }
  .el-aside {
    color: #333;
    
  }
  .item {
  /* margin-top: 10px; */
  /* margin-right: 40px; */
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
    /* overflow-x: hidden; */
  }
  .main-body-wrap {
      height: calc(100% - 200px);
  }
  .header-dropdown {

            display: inline-block;
            margin-right: 16px;
            line-height: 64px;
            cursor: pointer;
            color: #515a6e;

            .icon {
                color: #515a6e;
            }

            &:last-child {
                margin-right: 0;
            }

        }
</style>
