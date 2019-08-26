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
                <el-form-item>
                    <el-button type="primary" native-type="submit">登陆</el-button>
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
                this.$router.push('/')
                this.$message.success('登陆成功')
            })
        }
    }
}
</script>


<style scoped>
.login-card{
    width: 25rem;
    margin: 10rem auto;
}
</style>

