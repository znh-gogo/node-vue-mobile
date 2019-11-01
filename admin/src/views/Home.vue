<template>
  <div class="home">
    <el-container style="height: 100vh; ">
      
  <el-aside width="200px" style="background-color: #EBEEF5">
    <div style="height:60px;line-height:60px;text-align:center;font-size:18px;padding:0 10px;color: #439057;">
      农商产品信息服务后台管理系统
    </div>
    <el-menu router :default-active="$route.path" unique-opened >
      <el-submenu index="0">
        <template slot="title"><i class="el-icon-eleme"></i>首页</template>
        <el-menu-item-group>
          <el-menu-item index="/homepage" v-if="authflag === 1">首页</el-menu-item>
          <el-menu-item index="/sellerpage" v-if="authflag === 0">首页</el-menu-item>
        </el-menu-item-group>
      </el-submenu>

      <el-submenu index="1" v-if="authflag === 1">
        <template slot="title"><i class="el-icon-user"></i>用户管理</template>
        <el-menu-item-group>
          <template slot="title">用户</template>
          <el-menu-item index="/userList">用户列表</el-menu-item>
          <el-menu-item index="/userAdd">添加用户</el-menu-item>
        </el-menu-item-group>
      </el-submenu>

      <el-submenu index="2"  v-if="authflag === 1">
        <template slot="title"><i class="el-icon-s-shop"></i>商品管理</template>
        <el-menu-item-group>
          <template slot="title">商品</template>
          <el-menu-item index="/goodsList">商品列表</el-menu-item>
          <el-menu-item index="/goodsAdd">商品类别</el-menu-item>
        </el-menu-item-group>
      </el-submenu>

      <el-submenu index="3"  v-if="authflag === 1">
        <template slot="title"><i class="el-icon-notebook-2"></i>文章管理</template>
        <el-menu-item-group>
          <template slot="title">文章</template>
          <el-menu-item index="/articleClassAdd">新建文章分类</el-menu-item>
          <el-menu-item index="/articleClassList">文章分类列表</el-menu-item>
          <el-menu-item index="/articleAdd">新建文章</el-menu-item>
          <el-menu-item index="/articleList">文章列表</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="4"  v-if="authflag === 1">
        <template slot="title"><i class="el-icon-collection"></i>计划管理</template>
        <el-menu-item-group>
          <template slot="title">计划</template>
          <el-menu-item index="/planAdd">添加计划</el-menu-item>
          <el-menu-item index="/planList">计划列表</el-menu-item>
          <el-menu-item index="/planmakerAdd">添加计划人</el-menu-item>
          <el-menu-item index="/planmakerList">计划人列表</el-menu-item>
        </el-menu-item-group>
      </el-submenu>

      <el-submenu index="5" v-if="authflag === 1">
        <template slot="title"><i class="el-icon-user-solid"></i>管理员管理</template>
        <el-menu-item-group>
          <template slot="title">管理员</template>
          <el-menu-item index="/adminList">管理员列表</el-menu-item>
          <el-menu-item index="/adminAdd">添加管理员</el-menu-item>
        </el-menu-item-group>
      </el-submenu>

      <el-submenu index="6"  v-if="authflag === 1">
        <template slot="title"><i class="el-icon-s-custom"></i>账户管理</template>
        <el-menu-item-group>
          <!-- <template slot="title">管理员</template> -->
          <el-menu-item index="/accountList">账户列表</el-menu-item>
          <!-- <el-menu-item index="/adminAdd">添加管理员</el-menu-item> -->
        </el-menu-item-group>
      </el-submenu>

      <el-submenu index="7"  v-if="authflag === 1">
        <template slot="title"><i class="el-icon-edit-outline"></i>反馈管理</template>
        <el-menu-item-group>
          <!-- <template slot="title">管理员</template> -->
          <el-menu-item index="/feedbackList">反馈列表</el-menu-item>
          <!-- <el-menu-item index="/adminAdd">添加管理员</el-menu-item> -->
        </el-menu-item-group>
      </el-submenu>

      <el-submenu index="8"  v-if="authflag === 0">
        <template slot="title"><i class="el-icon-s-shop"></i>商品管理</template>
        <el-menu-item-group>
          <!-- <template slot="title">管理员</template> -->
          <el-menu-item index="/selling">商品发售</el-menu-item>
          <el-menu-item index="/myprolist">商品列表</el-menu-item>
        </el-menu-item-group>
      </el-submenu>

    </el-menu>
  </el-aside>
    
     
  <el-container>
    <el-header style="text-align: right; font-size: 12px">
      <span style="margin-right:15px">{{username}}</span>
      <!-- <span  style="margin-left:15px">退出登陆</span> -->
      <el-dropdown>
        <i class="el-icon-setting" style="margin-right: 15px;color:#fff">设置<el-badge is-dot class="item" v-if="authflag === 0&&paybacknum!==0"/></i>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>查看</el-dropdown-item>
          <el-dropdown-item v-if="authflag === 0" @click.native="paybackapply">退款申请<el-badge class="mark" :value="paybacknum" v-if="paybacknum!==0" /></el-dropdown-item>
          <el-dropdown-item @click.native="logout">退出登陆</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-header>
    
    <el-main style="background-color:#f7f7f7">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/homepage' }">首页</el-breadcrumb-item>
        <!-- <el-breadcrumb-item><a href="/">活动管理</a></el-breadcrumb-item> -->
        <el-breadcrumb-item v-if="$route.meta.name">{{$route.meta.name}}</el-breadcrumb-item>
      </el-breadcrumb>
      <div style="padding:15px;">
        <router-view :key="$route.path" style="background-color:#fff"></router-view>
      </div>
      
    </el-main>
    <div style="height:50px;width:100%;background-color:#ccc;line-height:60px;text-align:center;color:#666;font-size:14px;">
      All informations from node.js. 
    </div>
  </el-container>
</el-container>
  </div>
</template>

<script>
// @ is an alias to /src

import {MOBILE} from '../api/globol'
export default {
  name: 'home',
  data() {
      return {
        username:'',
        authflag:'',
        paybacknum:0
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
        }
      }
    },
    mounted(){
      this.username = sessionStorage.username
      this.getInfo()
    }

}
</script>

<style scoped>
  .el-header {
    background-color:#606266;
    color: #fff;
    line-height: 60px;
  }
  
  .el-aside {
    color: #333;
    
  }
  .item {
  /* margin-top: 10px; */
  /* margin-right: 40px; */
}
</style>
