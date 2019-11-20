<template>
    <div class="userAdd" style="background:#fff;padding:10px">
    <div style="text-align:right;padding:10px;" v-if="this.$route.params.id"><el-button type="primary" plain @click="$router.go(-1)">返回</el-button></div>
    <div style="margin-bottom:20px">
        <span>
            计划执行者:
        </span>
        <el-select v-model="model.planmaker" @change="getData" filterable placeholder="请选择" v-if="id === undefined">
            <el-option
            v-for="item in selectData"
            :key="item._id"
            :label="item.makername"
            :value="item._id">
            </el-option>
        </el-select>
        <el-select v-model="model.planmaker" @change="getData" filterable placeholder="请选择" v-else disabled>
            <el-option
            v-for="item in selectData"
            :key="item._id"
            :label="item.makername"
            :value="item._id">
            </el-option>
        </el-select>
        <el-button type="primary" style="margin-left:20px" @click="model.plans.push({})">添加计划</el-button>
    </div>
    <div style="margin-bottom:20px;display:flex;" v-if="model.planmaker">
        <img :src="personDetail.makericon" alt="" style="width:100px;height:100px">
        <div style="margin:10px 20px">
            <div>年龄：{{personDetail.makerage}}</div>
            <div>性别: {{personDetail.makersex===0?'男':'女'}}</div>
            <div>个人描述: {{personDetail.makerdescription}}</div>
        </div>
    </div>
    <el-form @submit.native.prevent="save" label-width="120px;" >
        <div style="border:1px solid #eee;padding:10px;margin-bottom:10px;" v-for="(item,index) in model.plans" :key="index"> 
        <span style="font-size:24px;font-weight:700;margin:20px">第{{index+1}}个计划</span>
        <el-button type="danger" size="small" style="margin-bottom:20px;margin-left:20px" @click="model.plans.splice(index,1)">删除该计划</el-button>
        <el-form-item label="计划名称">
            <el-input style="width:300px" v-model="item.planname"></el-input>
        </el-form-item>
        <!-- <el-form-item label="计划人名称">
            <el-radio v-model="model.makersex" :label=0>男</el-radio>
            <el-radio v-model="model.makersex" :label=1>女</el-radio>
        </el-form-item> -->
        <el-form-item label="计划初步阶段">
            <el-input style="width:300px"
            v-model="item.start"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="请输入内容">
            </el-input>
        </el-form-item>
        <el-form-item label="计划实施过程">
            <el-input style="width:300px"
            v-model="item.progress"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="请输入内容">
            </el-input>
        </el-form-item>
        <el-form-item label="计划尾部阶段">
            <el-input style="width:300px"
            v-model="item.final"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="请输入内容">
            </el-input>
        </el-form-item>
        <el-form-item label="计划实施开始时间">
            <el-date-picker
            v-model="item.start_time"
            type="date"
            placeholder="选择日期">
            </el-date-picker>
        </el-form-item>
        <el-form-item label="预计计划结束时间">
            <el-date-picker
            v-model="item.end_time"
            type="date"
            placeholder="选择日期">
            </el-date-picker>
        </el-form-item>
        </div>
        <el-form-item>
             <el-button type="primary" native-type="submit" v-if="model.plans.length!==0">保存</el-button>
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
            model:{
                plans:[]
            },
            value1:'',
            selectData:[],
            personDetail:[]
             // relativeOptions:[]
        }
    },
    methods:{
        getData(e){
            for(let i = 0; i<this.selectData.length;i++){
                if(this.selectData[i]._id === e){
                    this.personDetail = this.selectData[i]
                }
            }
            console.log(this.personDetail)
        },
        getAuth(){
        return {
            Authorization:`Bearer ${sessionStorage.token || ''}`
        }
    },
    // afterUpload(res){
    //     this.$set(this.model,'makericon',res.url)
    // },
    async save(){
        let res
        if(this.$route.params.id){
            res= await this.$http.put(ADMIN+`/rest/plan/${this.$route.params.id}`,this.model)
        } else{
            res= await this.$http.post(ADMIN+'/rest/plan',this.model)
        }
        this.$message.success('保存成功')
        this.$router.push('/planList')
    },
    fetchData(){
        this.$http.get(ADMIN+`/rest/plan/${this.$route.params.id}`).then((res)=>{
        this.model=res.data
        }).then(()=>{
            this.fetchSelect()
        })
    },
      fetchSelect(){
          this.$http.get(ADMIN+'/rest/planmaker').then((res)=>{
              this.selectData=res.data
            //   console.log(this.selectData)
          }).then(()=>{
              this.model.planmaker && this.fetchDetail()
          })
      },
      fetchDetail(){
        for(let i = 0; i<this.selectData.length;i++){
            if(this.selectData[i]._id === this.model.planmaker){
                this.personDetail = this.selectData[i]
            }
        }
      }
    },
    created(){
        this.$route.params.id && this.fetchData()
       this.$route.params.id === undefined && this.fetchSelect()
        
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
