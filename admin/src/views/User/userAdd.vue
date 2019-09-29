<template>
    <div class="userAdd">
        <h1 style="margin-top:0">{{id?'编辑':'添加'}}用户</h1>
        <el-form @submit.native.prevent="save" label-width="120px">
            <el-form-item label="所属关系">
                <el-select v-model="model.relative" placeholder="请选择">
                    <el-option v-for="item in relativeOptions" :key="item._id"
                    :value="item._id" :label="item.name"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="用户名">
                <el-input style="width:300px" v-model="model.name"></el-input>
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
            relativeOptions:[]
        }
    },
    methods:{
       async save(){
           let res
            if(this.id){
                res= await this.$http.put(ADMIN+`/rest/users/${this.id}`,this.model)
                
            } else{
                res= await this.$http.post(ADMIN+'/rest/users',this.model)
             }
                this.$message.success('保存成功')
                this.$router.push('/userList')
           
        },
        fetchData(){
            this.$http.get(ADMIN+`/rest/users/${this.id}`).then((res)=>{
                this.model=res.data
                })
        },
        fetchRelativeData(){
            this.$http.get(ADMIN+`/rest/users`).then((res)=>{
            this.relativeOptions=res.data
        })
}
    },
    created(){
        
        this.id && this.fetchData()
        this.fetchRelativeData()
    }
}
</script>


<style scoped>

</style>
