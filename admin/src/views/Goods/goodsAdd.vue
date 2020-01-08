<template>
    <div class="userAdd" style="padding: 10px;min-height:500px;background:#fff">
        <h1 style="margin-top:0">{{$route.params.id?'编辑':'添加'}}商品类别</h1>
        <div style="text-align:right;padding:10px;"><el-button type="primary" plain @click="$router.go(-1)">返回</el-button></div>
        
        <el-form @submit.native.prevent="save" label-width="120px">
            <!-- <el-form-item label="所属关系">
                <el-select v-model="model.relative" placeholder="请选择">
                    <el-option v-for="item in relativeOptions" :key="item._id"
                    :value="item._id" :label="item.name"></el-option>
                </el-select>
            </el-form-item> -->
            <el-form-item label="商品类别">
                <el-input style="width:300px;margin-right:20px" v-model="model.goodcategory"></el-input> <el-button type="primary" :disabled="model.goodcategory === '' || model.goodcategory === undefined" native-type="submit">添加</el-button>
            </el-form-item>
            <!-- <el-form-item label="上传商品图片">
                <el-upload
                class="avatar-uploader"
                :headers="getAuth()"
                :action="ADMIN+'/upload'"
                :show-file-list="false"
                :on-success="afterUpload"
                >
                <img v-if="model.icon" :src="model.icon" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </el-form-item> -->
            <!-- <el-form-item>
                <el-button type="primary" native-type="submit">保存</el-button>
            </el-form-item> -->
        </el-form>
        <div style="font-weight:bold">已有类别：</div>
        <div style="padding:0 50px;margin-top:20px">
            <el-tag
                v-for="(tag,index) in categoriesList"
                :key="index"
                closable
                @close="handleclose(tag._id)"
                >
                {{tag.goodcategory}}
                </el-tag>
        </div>
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
            categoriesList:[]
            // relativeOptions:[]
        }
    },
    methods:{
        getAuth(){
            return {
                Authorization:`Bearer ${sessionStorage.token || ''}`
            }
        },
        // afterUpload(res){
        //     this.$set(this.model,'icon',res.url)
        // },
       async save(){
                await this.$http.post(ADMIN+'/rest/goodCategory',this.model)
                this.$message.success('添加成功')
                this.model = {}
                this.fetchData()
                // this.$router.push('/goodsList')
           
        },
        fetchData(){
            this.$http.get(ADMIN+`/rest/goodCategory`).then((res)=>{
                this.categoriesList=res.data
                })
        },
        handleclose(id){
            this.$http.delete(ADMIN+`/rest/goodCategory/${id}`).then(res =>{
                if(res){
                    this.$message.success('删除成功')
                    this.fetchData()
                }
            })
        }
    },
    created(){
       
        this.fetchData()
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
  .el-tag + .el-tag {
    margin-left: 10px;
  }
</style>
