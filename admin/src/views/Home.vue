<template>
  <div class="home">
    <el-container style="height: 100vh; ">
      
  <el-aside width="200px" style="background-color: #EBEEF5">
    <div style="height:60px;line-height:60px;text-align:center;font-size:18px;padding:0 10px;color: #439057;">
      农商产品信息服务后台管理系统
    </div>
    <el-menu router :default-active="$route.path" unique-opened >
      <el-submenu index="1">
        <template slot="title"><i class="el-icon-user"></i>用户管理</template>
        <el-menu-item-group>
          <template slot="title">用户</template>
          <el-menu-item index="/userList">用户列表</el-menu-item>
          <el-menu-item index="/userAdd">添加用户</el-menu-item>
        </el-menu-item-group>
      </el-submenu>

      <el-submenu index="2">
        <template slot="title"><i class="el-icon-s-shop"></i>商品管理</template>
        <el-menu-item-group>
          <template slot="title">商品</template>
          <el-menu-item index="/goodsList">商品列表</el-menu-item>
          <el-menu-item index="/goodsAdd">添加商品</el-menu-item>
        </el-menu-item-group>
      </el-submenu>

      <el-submenu index="3">
        <template slot="title"><i class="el-icon-notebook-2"></i>文章管理</template>
        <el-menu-item-group>
          <template slot="title">文章</template>
          <el-menu-item index="/articleClassAdd">新建文章分类</el-menu-item>
          <el-menu-item index="/articleClassList">文章分类列表</el-menu-item>
          <el-menu-item index="/articleAdd">新建文章</el-menu-item>
          <el-menu-item index="/articleList">文章列表</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="4">
        <template slot="title"><i class="el-icon-collection"></i>计划管理</template>
        <el-menu-item-group>
          <template slot="title">计划</template>
          <el-menu-item index="/planAdd">添加计划</el-menu-item>
          <el-menu-item index="/planList">计划列表</el-menu-item>
          <el-menu-item index="/planmakerAdd">添加计划人</el-menu-item>
          <el-menu-item index="/planmakerList">计划人列表</el-menu-item>
        </el-menu-item-group>
      </el-submenu>

      <el-submenu index="5">
        <template slot="title"><i class="el-icon-user-solid"></i>管理员管理</template>
        <el-menu-item-group>
          <template slot="title">管理员</template>
          <el-menu-item index="/adminList">管理员列表</el-menu-item>
          <el-menu-item index="/adminAdd">添加管理员</el-menu-item>
        </el-menu-item-group>
      </el-submenu>

      <el-submenu index="6">
        <template slot="title"><i class="el-icon-s-custom"></i>账户管理</template>
        <el-menu-item-group>
          <!-- <template slot="title">管理员</template> -->
          <el-menu-item index="/accountList">账户列表</el-menu-item>
          <!-- <el-menu-item index="/adminAdd">添加管理员</el-menu-item> -->
        </el-menu-item-group>
      </el-submenu>

      <el-submenu index="7">
        <template slot="title"><i class="el-icon-edit-outline"></i>反馈管理</template>
        <el-menu-item-group>
          <!-- <template slot="title">管理员</template> -->
          <el-menu-item index="/feedbackList">反馈列表</el-menu-item>
          <!-- <el-menu-item index="/adminAdd">添加管理员</el-menu-item> -->
        </el-menu-item-group>
      </el-submenu>

    </el-menu>
  </el-aside>
    
     
  <el-container>
    <el-header style="text-align: right; font-size: 12px">
      <span style="margin-right:15px">{{username}}</span>
      <!-- <span  style="margin-left:15px">退出登陆</span> -->
      <el-dropdown>
        <i class="el-icon-setting" style="margin-right: 15px;color:#fff"></i>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>查看</el-dropdown-item>
          <el-dropdown-item @click.native="logout">退出登陆</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-header>
    
    <el-main style="overflow:hidden">
      <div style="padding:20px;">
        <router-view :key="$route.path"></router-view>
      </div>
      
    </el-main>
    <div style="height:60px;width:100%;background-color:#eee;line-height:60px;text-align:center;color:#666;font-size:14px;">
      All informations from node.js. 
    </div>
  </el-container>
</el-container>
  </div>
</template>

<script>
// @ is an alias to /src


export default {
  name: 'home',
  data() {
      return {
        username:''
      }
    },
    methods:{
      logout(){
        sessionStorage.clear()
        this.$router.push('/login')
      }
    },
    mounted(){
      this.username = sessionStorage.username
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
</style>
