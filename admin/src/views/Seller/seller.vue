<template>
    <div>
        <h1>商品出售</h1>
        <el-form @submit.native.prevent="save" label-width="120px">
            <el-form-item label="商品类别:">
                <el-select v-model="model.pro_categories" placeholder="请选择" multiple>
                    <el-option v-for="(item,index) in productcategory" :key="index"
                    :value="item._id" :label="item.goodcategory"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="商品描述:">
                <el-input style="width:400px"
                    v-model="model.pro_description"
                    type="textarea"
                    :autosize="{ minRows: 4, maxRows: 6}"
                    placeholder="请输入描述内容">
                </el-input>
            </el-form-item>
            <el-form-item label="发货地址:">
                <el-input
                style="width:400px;"
                v-model="model.pro_address"
                placeholder="请输入发货地址"></el-input>
            </el-form-item>
            <el-form-item label="商品价格:">
                <el-input
                style="width:150px;"
                v-model="model.pro_price"
                maxlength="5"
                placeholder="请输入金额"
                show-word-limit></el-input>
            </el-form-item>
            <el-form-item label="上传商品图片:">
                <div style="display:inline-block;margin-right:10px;margin-bottom:10px;width:178px;height:178px;position:relative"
                    v-for="(item,index) in model.pro_imgs"
                    @mouseover="getIndex(index)"
                    :key="index">
                    <img
                    :src="item"
                    class="avatar">
                    <div class="blackbox" v-if="nowIndex === index" @click="remove(index)" @mouseout="nowIndex = -1">删除</div>
                </div>
                <el-upload
                style="display:inline-block;vertical-align: top;"
                class="avatar-uploader"
                :headers="getAuth()"
                :action="MOBILE+'/upload'"
                :show-file-list="false"
                :on-success="afterUpload"
                >
                <!-- <img v-if="model.makericon" :src="model.makericon" class="avatar"> -->
                <div style="width:178px;height:178px;background:#eee;text-align:center;line-height:178px">
                    <i class="el-icon-plus avatar-uploader-icon"></i>
                </div>
                </el-upload>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" native-type="submit">保存</el-button>
            </el-form-item>
        </el-form>
        
        <!-- <el-dialog :visible.sync="dialogVisible">
             <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog> -->
    </div>
</template>

<script>
import {MOBILE} from '../../api/globol'
export default {
    data(){
        return {
            MOBILE,
            productcategory:[],
            model:{
                pro_imgs:[]
            },
            dialogImageUrl: '',
            dialogVisible: false,
            nowIndex:-1
        }
    },
    methods:{
        getcategory(){
            this.$http.post(MOBILE+'/proCategory').then(res=>{
                this.productcategory = res.data
            })
        },
        remove(index) {
            this.model.pro_imgs.splice(index,1)
        },
        getIndex(i){
            this.nowIndex = i
        },
        // handlePictureCardPreview(file) {
        //     this.dialogImageUrl = file.url;
        //     this.dialogVisible = true;
        // },
        getAuth(){
            return {
                Authorization:`Bearer ${sessionStorage.token || ''}`
            }
        },
        afterUpload(res){
            // this.$set(this.model,'seller',res.url)
            this.model.pro_imgs.push(res.url)
        },
        save(){
            let id = sessionStorage.id
            this.$set(this.model,'seller',id)
            this.$http.post(MOBILE+'/saleProduct',this.model).then(res=>{
                if(res){
                    this.$message.success(res.message)
                }
            })
        }
    },
    mounted(){
        this.getcategory()
    }
}
</script>

<style scoped>
  .avatar {
    width: 178px;
    height: 178px;
    display: inline-block;
    
    /* position:relative; */
    /* z-index: -1; */
       /* position:absolute; */

  }
  .blackbox{
      /* overflow: hidden; */
      position:absolute;
      left:0;
      top:0;
      width:178px;
      height:178px;
      z-index: 10;
      background: rgba(0, 0, 0, 0.5);
      text-align: center;
      line-height: 178px;
      color: #fff;
      cursor: pointer;
      /* background: url('../../assets/删除.png') no-repeat fixed center; */
  }
      .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    display: inline-block;
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
</style>