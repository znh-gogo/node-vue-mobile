<template>
    <div class="login">
        <el-card header="请先登录" class="login-card">
            <el-form @submit.native.prevent="login">
                <el-form-item label="用户名">
                    <el-input v-model="model.adminName" placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input v-model="model.password" type="password" show-password placeholder="请输入密码"></el-input>
                </el-form-item>
                <el-form-item style="text-align:center">
                    <el-button type="primary" native-type="submit" style="width:80%">登陆</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script>
export default {
    data (){
        return{
            model:{}
        }
    },
    methods:{
        login(){
            this.$http.post('login',this.model).then((res)=>{
                sessionStorage.token=res.data.token
                sessionStorage.username = res.data.user.adminName
                this.$router.push('/')
                this.$message.success('登陆成功')
            })
        }
    }
}
</script>


<style scoped>
.login{
    width: 100%;
    min-height: 100%;
    /* height:100vh; */
    background: url(~@/assets/background.svg) no-repeat 100% center;
    background-size: 100%;
    padding: 2rem 0 2rem;
    position: relative;
}
.login-card{
    width: 25rem;
    margin: 10rem auto;
}
</style>

