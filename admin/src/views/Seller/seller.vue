<template>
    <div style="padding: 5px">
        <h1>{{id?'编辑':'出售'}}商品 <el-button v-if="id" style="float:right" type="primary" plain @click="$router.go(-1)">返回</el-button></h1>
        <el-form :model="model" ref="model" :rules="rules" label-width="120px">
            <el-form-item label="商品类别:" prop="pro_categories">
                <el-select v-model="model.pro_categories" placeholder="请选择" multiple>
                    <el-option v-for="(item,index) in productcategory" :key="index"
                    :value="item._id" :label="item.goodcategory"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="商品描述:" prop="pro_description">
                <el-input style="width:400px"
                    v-model="model.pro_description"
                    type="textarea"
                    :autosize="{ minRows: 4, maxRows: 6}"
                    placeholder="请输入描述内容">
                </el-input>
            </el-form-item>
            <el-form-item label="发货地址:" prop="pro_address">
                <el-input
                style="width:400px;"
                v-model="model.pro_address"
                placeholder="请输入发货地址"></el-input>
            </el-form-item>
            <el-form-item label="商品价格:" prop="pro_price">
                <el-input
                style="width:150px;"
                v-model="model.pro_price"
                maxlength="5"
                placeholder="请输入金额"
                show-word-limit></el-input>
            </el-form-item>
            <el-form-item label="售卖初始状态:" prop="buyflag">
                <el-select v-model="model.buyflag" placeholder="请选择">
                    <el-option label="上架中" :value="parseInt(0)" :key="parseInt(0)"></el-option>
                    <el-option label="下架中" :value="parseInt(2)" :key="parseInt(2)"></el-option>
                </el-select>
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
                <el-button type="primary" @click="save('model')">保存</el-button>
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
    props:{
        id:{}
    },
    data(){
        return {
            MOBILE,
            productcategory:[],
            model:{
                pro_imgs:[],
                pro_categories:'',
                pro_description:'',
                pro_address:'',
                pro_price:'',
                buyflag:0
            },
            dialogImageUrl: '',
            dialogVisible: false,
            nowIndex:-1,
            rules: {
            pro_categories: [
                { required: true, message: '请选择商品类别', trigger: 'blur' },
                // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
            ],
            pro_description: [
                { required: true, message: '请输入描述内容', trigger: 'blur' }
            ],
            pro_address: [
                { required: true,  message: '请输入发货地址', trigger: 'blur' }
            ],
            pro_price: [
                { required: true,  message: '请输入金额', trigger: 'blur' },
                // { min: 1, max: 5, message: '长度在 1 到 5 个字符', trigger: 'blur' }
            ],
            pro_imgs: [
                // { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
            ],
            }
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
        save(model){
            this.$refs[model].validate((valid) => {
                if (valid) {
                    // alert('submit!');
                    let id = sessionStorage.id
                    this.$set(this.model,'seller',id)
                    // if(this.model.pro_categories )
                    if(this.id){
                        this.$set(this.model,'id',this.id)
                        this.$http.post(MOBILE+'/editProduct',this.model).then(res=>{
                            if(res){
                                this.$message.success(res.data.message)
                                this.$refs[model].resetFields();
                                this.model.pro_imgs = []
                                this.$router.push('/myprolist')
                                // console.log(res)
                            }
                        })  
                    } else {
                        this.$http.post(MOBILE+'/saleProduct',this.model).then(res=>{
                            if(res){
                                this.$message.success(res.data.message)
                                this.$refs[model].resetFields();
                                this.model.pro_imgs = []
                                this.$router.push('/myprolist')
                                // console.log(res)
                            }
                        })
                    }
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        fetchData(){
            this.$http.post(MOBILE+'/showMyProdetail',{id:this.id}).then(res=>{
                this.model = res.data
            })
        }
    },
    mounted(){
        this.getcategory()
    },
    created(){
        this.id && this.fetchData()
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