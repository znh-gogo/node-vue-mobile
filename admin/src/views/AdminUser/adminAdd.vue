<template>
    <div class="userAdd" style="padding: 10px;min-height:500px;background:#fff">
        <div style="text-align:right;padding:10px;"><el-button type="primary" plain @click="$router.go(-1)">返回</el-button></div>
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
            if(this.$route.params.id){
                res= await this.$http.put(ADMIN+`/rest/adminUser/${this.$route.params.id}`,this.model)
                
            } else{
                res= await this.$http.post(ADMIN+'/rest/adminUser',this.model)
             }
                this.$message.success('保存成功')
                this.$router.push('/adminList')
           
        },
        fetchData(){
            this.$http.get(ADMIN+`/rest/adminUser/${this.$route.params.id}`).then((res)=>{
                this.model=res.data
                })
        },

    },
    created(){
        
        if(this.$route.params.id!==undefined){
            this.flag=true
        }
        this.$route.params.id && this.fetchData()
        
    }
}
</script>


<style scoped>

</style>
