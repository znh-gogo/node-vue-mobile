<template>
    <div style="padding:20px 10px;">
        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm">
            <el-form-item label="广告名称：" prop="ad_name">
                <el-input type="text" v-model="ruleForm.ad_name" autocomplete="off" style="width:400px"></el-input>
            </el-form-item>
            <el-form-item label="广告描述：" prop="ad_description">
                <el-input type="textarea" v-model="ruleForm.ad_description" autocomplete="off" style="width:400px"></el-input>
            </el-form-item>
            <el-form-item label="广告价格与期限：" prop="ad_price">
                <!-- <el-input v-model.number="ruleForm.ad_timelong" style="display:none"></el-input> -->
                <el-input v-model.number="ruleForm.ad_price" style="display:none"></el-input>
                <div style="display:flex;flex-wrap: wrap;">
                    <div v-for="(item,index) in priceList" :key="index" :class="[{'priceBox':nowIndex!==index},{'current':nowIndex === index}]" @click="chooseCurrent(item,index)">
                        <div class="priceTime">{{computedTime(item.ad_timeline)}}</div>
                        <div class="price">￥{{item.ad_price}}</div>
                    </div>
                </div>
            </el-form-item>
            <el-form-item label="首页显示选择：" prop="ad_showflag">
                <el-radio-group v-model="ruleForm.ad_showflag">
                    <el-radio :label="1">显示</el-radio>
                    <el-radio :label="0">不显示</el-radio>
                    <!-- <el-radio :label="9">备选项</el-radio> -->
                </el-radio-group>
            </el-form-item>
            <el-form-item label="上传广告位图片:" prop="ad_img">
                <div style="display:inline-block;margin-right:10px;margin-bottom:10px;width:auto;height:178px;position:relative"
                v-if="ruleForm.ad_img!==''"
                @mouseover="delflag = true" @mouseleave="delflag = false">
                    <img
                    :src="ruleForm.ad_img"
                    class="avatar">
                    <div class="blackbox" @click="remove" v-if="delflag">删除</div>
                </div>
                <el-upload
                v-if="ruleForm.ad_img===''"
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
                <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
                <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import {MOBILE} from '../../api/globol'
import format from '../../common/common'
export default {
    props:{
        id:{}
    },
    data(){
        return{
            MOBILE,
            format,
            delflag:false,
            ruleForm: {
                ad_name: '',
                ad_description: '',
                ad_price:'',
                ad_timelong:'',
                ad_showflag:1,
                ad_img:''
            },
            rules: {
            ad_name: [
                { required: true, message: '请输入广告名称', trigger: 'blur' }
            ],
            ad_description: [
                { required: true, message: '请输入广告描述', trigger: 'blur' }
            ],
            ad_price: [
                { required: true, message: '请选择广告价格期限', trigger: 'change' }
            ],
            ad_showflag: [
                { required: true, message: '请选择是否显示', trigger: 'change' }
            ],
            ad_img: [
                { required: true, message: '请上传广告位图片', trigger: 'change' }
            ]
            },
            nowIndex:-1,
            nowIndex1:-1,
            priceList:[]
        }
    },
    methods:{
          submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                if (valid) {
                    if(this.id){
                        this.$set(this.ruleForm,'id',this.id)
                        this.$http.post(MOBILE+'/editAd',this.ruleForm).then(res=>{
                            this.$message.success(res.data.message)
                            this.$router.replace('/myAdList')
                        })
                    } else {
                        let id = sessionStorage.id
                        this.$set(this.ruleForm,'relative',id)
                        this.$http.post(MOBILE+'/applyAd',this.ruleForm).then(res=>{
                            this.$message.success(res.data.message)
                            this.$refs[formName].resetFields();
                            this.nowIndex = -1
                            this.$router.push('/myAdList')
                        })
                    }
                } else {
                    console.log('error submit!!');
                    return false;
                }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
                this.nowIndex = -1
            },
            showAdPrice(){
                this.$http.post(MOBILE+'/showAdPrice').then(res=>{
                    this.priceList = res.data
                    this.id && this.fetchDatachange()
                })
            },
            chooseCurrent(item,index){
                this.nowIndex = index
                this.ruleForm.ad_price = item.ad_price
                this.ruleForm.ad_timelong = item.ad_timeline
                //   console.log(this.ruleForm,item)
            },
            remove(index) {
                    this.ruleForm.ad_img = ''
                },
                getAuth(){
                    return {
                        Authorization:`Bearer ${sessionStorage.token || ''}`
                    }
                },
                afterUpload(res){
                    // this.$set(this.model,'seller',res.url)
                    this.ruleForm.ad_img = res.url
                },
            computedTime(time){
                let day = 60*60*24
                let times = time/day
                switch(times){
                        case 1:
                            return 1+' 天';
                            break;
                        case 15:
                            return 2+' 周';
                            break;
                        case 30:
                            return 1+'个月';
                            break;
                        case 90:
                            return 3+'个月';
                            break;
                        case 180:
                            return '半 年';
                            break;
                        case 360:
                            return '一 年';
                            break;
                }
            },
            fetchDatachange(){
                this.$http.post(MOBILE+'/showAppliedAd',{id:this.id}).then(res=>{
                    this.ruleForm = res.data
                    for(let i =0;i<this.priceList.length;i++){
                        if(this.priceList[i].ad_price === this.ruleForm.ad_price){
                            this.nowIndex = i
                        }
                    }
                })
            }
    },
    mounted(){
        this.showAdPrice()
        
    }
}
</script>

<style scoped>
.priceBox{
    padding: 5px;
    border: 1px solid #cfcfcf;
    border-radius: 4px;
    text-align: center;
    margin-right: 10px;
    margin-top: 5px;
    width: 120px;
    cursor: pointer;
    
}
.priceTime{
    border-bottom: 1px solid #cfcfcf;
    padding-bottom: 5px;
    font-size: 20px;
}
.price{
    margin-top: 5px;
    font-size: 24px;
}
.current{
    border: 1px solid #409EFF;
    border-radius: 4px;
    text-align: center;
    margin-right: 10px;
    width: 120px;
    cursor: pointer;
    padding: 5px;
    margin-top: 5px;
}
  .avatar {
    width: auto;
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
      width:100%;
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