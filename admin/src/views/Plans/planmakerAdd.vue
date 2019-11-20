<template>
    <div class="userAdd" style="background:#fff;padding:10px">
    <div style="text-align:right;padding:10px;" v-if="this.$route.params.id"><el-button type="primary" plain @click="$router.go(-1)">返回</el-button></div>
    <el-form @submit.native.prevent="save" label-width="120px">
    <!-- <el-form-item label="所属关系">
    <el-select v-model="model.relative" placeholder="请选择">
    <el-option v-for="item in relativeOptions" :key="item._id"
    :value="item._id" :label="item.name"></el-option>
    </el-select>
    </el-form-item> -->
        <el-form-item label="计划人名称">
            <el-input style="width:300px" v-model="model.makername"></el-input>
        </el-form-item>
        <el-form-item label="计划人名称">
            <el-radio v-model="model.makersex" :label=0>男</el-radio>
            <el-radio v-model="model.makersex" :label=1>女</el-radio>
        </el-form-item>
        <el-form-item label="计划人年龄">
            <el-input style="width:300px" v-model="model.makerage"></el-input>
        </el-form-item>
        <el-form-item label="计划人个人描述">
            <el-input style="width:300px"
            v-model="model.makerdescription"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="请输入内容">
            </el-input>
        </el-form-item>
        <el-form-item label="上传计划人图片">
            <el-upload
            class="avatar-uploader"
            :headers="getAuth()"
            :action="ADMIN+'/upload'"
            :show-file-list="false"
            :on-success="afterUpload"
            >
            <img v-if="model.makericon" :src="model.makericon" class="avatar">
            <div v-else  style="width:178px;height:178px;background:#eee;text-align:center;line-height:178px">
                    <i class="el-icon-plus avatar-uploader-icon"></i>
            </div>
            </el-upload>
        </el-form-item>
        <el-form-item>
             <el-button type="primary" native-type="submit">保存</el-button>
             <el-button type="default" v-if="id !== undefined" @click="$router.push('/planmakerList')">返回</el-button>
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
                ADMIN,
                model:{},
             // relativeOptions:[]
        }
    },
    methods:{
    getAuth(){
        return {
            Authorization:`Bearer ${sessionStorage.token || ''}`
        }
    },
    afterUpload(res){
        this.$set(this.model,'makericon',res.url)
    },
    async save(){
        let res
        if(this.$route.params.id){
            res= await this.$http.put(ADMIN+`/rest/planmaker/${this.$route.params.id}`,this.model)
        } else{
            res= await this.$http.post(ADMIN+'/rest/planmaker',this.model)
        }
        this.$message.success('保存成功')
        this.$router.push('/planmakerList')
    },
    fetchData(){
        this.$http.get(ADMIN+`/rest/planmaker/${this.$route.params.id}`).then((res)=>{
        this.model=res.data
        })
    },
    // fetchRelativeData(){
    // this.$http.get(`rest/users`).then((res)=>{
    // this.relativeOptions=res.data
    // })
    // }
    },
    created(){
        this.$route.params.id && this.fetchData()
        // this.fetchRelativeData()
    }
    }
</script>


<style scoped>
    .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    background:#eee;
}
.avatar-uploader .el-upload:hover {
    border-color: #409EFF;
}
.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
