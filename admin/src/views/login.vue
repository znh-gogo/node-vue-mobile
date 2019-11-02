<template>
    <div class="login">
        <el-card class="login-card">
            <div id="header" style="text-align:center;padding:20px 0;font-size:20px">农商产品信息服务平台登陆中心</div>
            <el-form @submit.native.prevent="login">
                <el-form-item label="用户名:">
                    <el-input v-model="model.adminName" placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item label="密码:">
                    <el-input v-model="model.password" type="password" show-password placeholder="请输入密码"></el-input>
                </el-form-item>
                <el-form-item label="角色选择:">
                    <el-select v-model="value" placeholder="请选择" style="width:100%">
                        <el-option
                        v-for="(item,index) in options"
                        :key="index"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item style="text-align:center">
                    <el-button type="primary" native-type="submit" style="width:80%">登陆</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script>
import axios from 'axios'
import {ADMIN,MOBILE} from '../api/globol'
import { Notification } from 'element-ui';
export default {
    data (){
        return{
            model:{},
            value:1,
            options:[
                {
                    label: '管理员',
                    value: 1
                },
                {
                    label: '商家',
                    value: 0
                }
            ]
        }
    },
    methods:{
        login(){
            if(this.value === 0) {
                this.$http.post(MOBILE+'/login',{account:this.model.adminName,password:this.model.password,authflag:1}).then((res)=>{
                sessionStorage.token=res.data.token
                sessionStorage.username = res.data.user.nickname
                sessionStorage.authflag = res.data.user.authflag
                sessionStorage.id = res.data.user._id
                sessionStorage.headimg = res.data.user.headImg
                this.$router.push('/')
                // this.$message.success('登陆成功')
                Notification({
                    title:'您好,登陆成功',
                    message:'希望您能拥有美好的一天，加油！',
                    type:'success',
                    duration: 3000
                })
                })
            } else if(this.value === 1){
                this.$http.post(ADMIN+'/login',this.model).then((res)=>{
                sessionStorage.token=res.data.token
                sessionStorage.username = res.data.user.adminName
                sessionStorage.authflag = res.data.user.authflag
                // console.log(sessionStorage.authflag+'1')
                this.$router.push('/')
                // this.$message.success('登陆成功')
                Notification({
                        title:'您好,登陆成功',
                        message:'希望您能拥有美好的一天，加油！',
                        type:'success',
                        duration: 3000
                    })
                })
            }   
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

