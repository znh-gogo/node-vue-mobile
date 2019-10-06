<template>
    <div class="userAdd" style="padding: 5px;min-height:500px">
        <h1 style="margin-top:0">{{id?'编辑':'添加'}}管理员</h1>
        <el-form @submit.native.prevent="save" label-width="120px">

            <el-form-item label="用户名">
                <el-input style="width:300px" v-model="model.adminName"></el-input>
            </el-form-item>
            <el-form-item label="密码">
                <el-input style="width:300px" type="password" v-model="model.password" :disabled="flag"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" native-type="submit">保存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import {ADMIN} from '../../api/globol'
export default {
    props:{
        id:{}
    },
    data (){
        return{
            model:{
                
            },
         flag:null
        }
    },
    methods:{
       async save(){
           let res
            if(this.id){
                res= await this.$http.put(ADMIN+`/rest/adminUser/${this.id}`,this.model)
                
            } else{
                res= await this.$http.post(ADMIN+'/rest/adminUser',this.model)
             }
                this.$message.success('保存成功')
                this.$router.push('/adminList')
           
        },
        fetchData(){
            this.$http.get(ADMIN+`/rest/adminUser/${this.id}`).then((res)=>{
                this.model=res.data
                })
        },

    },
    created(){
        
        if(this.id!==undefined){
            this.flag=true
        }
        this.id && this.fetchData()
        
    }
}
</script>


<style scoped>

</style>
