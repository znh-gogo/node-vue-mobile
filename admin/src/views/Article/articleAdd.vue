<template>
    <div class="userAdd" style="background:#fff;padding:10px">
        <div style="text-align:right;padding:10px;"><el-button type="primary" plain @click="$router.go(-1)">返回</el-button></div>
        <el-form @submit.native.prevent="save" label-width="120px">
            <el-form-item label="文章所属类型">
                <el-select v-model="model.relative" placeholder="请选择" multiple >
                    <el-option v-for="item in articleOptions" :key="item._id"
                    :value="item._id" :label="item.className"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="文章名称">
                <el-input style="width:300px" v-model="model.articleName"></el-input>
            </el-form-item>
            <!-- <el-form-item label="上传商品图片">
                <el-upload
                class="avatar-uploader"
                :action="$http.defaults.baseURL+'/upload'"
                :show-file-list="false"
                :on-success="afterUpload"
                >
                <img v-if="model.icon" :src="model.icon" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </el-form-item> -->
            <el-form-item label="文章内容">
                <vue-editor v-model="model.articleContent"
                useCustomImageHandler
                @image-added="handupload"></vue-editor>  
            </el-form-item>
            <el-form-item>
                <el-button type="primary" native-type="submit">保存</el-button>
            </el-form-item>
        </el-form>
        <!-- <div v-html="model.articleContent"></div> -->
    </div>
</template>
<script>
import {VueEditor} from 'vue2-editor'
import {ADMIN,MOBILE} from '../../api/globol'
export default {
    props:{
        id:{}
    },
    components:{
        VueEditor
    },
    data (){
        return{
            model:{
                
            },
            articleOptions:[]
        }
    },
    methods:{
        // afterUpload(res){
        //     this.$set(this.model,'icon',res.url)
        // },
       async handupload(file,Editor,cursorLocation,resetUploader){
            const form = new FormData()
            form.append('file',file)
            const res = await this.$http.post(ADMIN+'/upload',form)
            Editor.insertEmbed(cursorLocation,'image',res.data.url)
            resetUploader()

        },
       async save(){
           let res
            if(this.$route.params.id){
                res= await this.$http.put(ADMIN+`/rest/article/${this.$route.params.id}`,this.model)
                
            } else{
                res= await this.$http.post(ADMIN+'/rest/article',this.model)
             }
                this.$message.success('保存成功')
                this.$router.push('/articleList')
           
        },
        fetchData(){
            this.$http.get(ADMIN+`/rest/article/${this.$route.params.id}`).then((res)=>{
                this.model=res.data
                })
        },
        fetchArticleClassData(){
            this.$http.get(ADMIN+`/rest/articleClass`).then((res)=>{
            this.articleOptions=res.data
        })
        }
    },
    created(){
       
        this.$route.params.id && this.fetchData()
        this.fetchArticleClassData()
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
