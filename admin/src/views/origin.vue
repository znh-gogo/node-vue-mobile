<template>
    <div class="login">
        <el-card class="login-card">
            <div id="header" style="text-align:center;padding:20px 0;font-size:20px">初始管理员创建中心中心</div>
            <el-form @submit.native.prevent="login">
                <el-form-item label="超级管理员账号:">
                    <el-input v-model="model.adminName" placeholder="请输入超级管理员账号"></el-input>
                </el-form-item>
                <el-form-item label="密码:">
                    <el-input v-model="model.password" type="password" show-password placeholder="请输入密码"></el-input>
                </el-form-item>
                <el-form-item label="确认密码:">
                    <el-input v-model="model.password1" type="password" show-password placeholder="请再次输入密码"></el-input>
                </el-form-item>
                <el-form-item style="text-align:center">
                    <el-button type="primary" native-type="submit" style="width:80%">创建</el-button>
                </el-form-item>
                
            </el-form>
        </el-card>
    </div>
</template>

<script>
import {ADMIN,MOBILE} from '../api/globol'
export default {
    data (){
        return{
            model:{},
        }
    },
    methods:{
        login(){
            if(!this.model.adminName||!this.model.password||!this.model.password1){
                this.$message.error('内容不能为空')
                return;
            }
            if(this.model.password!==this.model.password1){
                this.$message.error('密码不一致，请重输！')
                return;
            }
            this.$http.post(ADMIN+'/origin',this.model).then(res=>{
                this.$message.success(res.data.message)
              this.$router.replace('/login')
            })
        }
    }
}
</script>


<style scoped>
.login{
    width: 100%;
    /* min-height: 100%; */
    height:100vh;
    background: url(~@/assets/background.svg) no-repeat;
    background-size: 100% 100%;
    /* padding: 2rem 0 2rem; */
    position: relative;
    overflow: hidden;
}
.login-card{
    width: 25rem;
    margin: 7rem auto;
    /* position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -12.5rem;
    margin-top: -15rem; */
}
</style>

