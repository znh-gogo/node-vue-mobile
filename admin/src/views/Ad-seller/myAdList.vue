<template>
    <div style="padding:20px 10px;background:#fff">
        <div>
            <div style="text-align:right;">
                <el-form :inline="true" class="demo-form-inline">
                    <el-form-item>
                        <el-input placeholder="请输入广告名称" v-model="searchInfo"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" @click="fetchData" :disabled="searchInfo===''">查询</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button icon="el-icon-delete" @click="reset">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <el-table
            v-loading="loading"
            element-loading-text="正在支付中"
            :data="tableData.items"
            :header-cell-style="{background:'#eef1f6',color:'#606266'}"
            style="width: 100%">
            <el-table-column
                prop="ad_name"
                label="广告名称"
                >
            </el-table-column>
            <el-table-column
                prop="ad_description"
                label="广告描述"
                >
            </el-table-column>
            <el-table-column
                label="广告时长及价格">
                <template slot-scope="scope">
                    {{computedTime(scope.row.ad_timelong)+'/￥'+scope.row.ad_price}}
                </template>
            </el-table-column>
            <el-table-column
                label="广告截至日期">
                <template slot-scope="scope">
                    <span>{{computedtimeline(scope.row.ad_timeline)}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="广告显示">
                <template slot-scope="scope">
                    <el-switch
                    v-model="scope.row.ad_showflag"
                    :disabled="scope.row.ad_flag===1"
                    @change="changeshowflag(scope.row)"
                    active-text="On"
                    inactive-text="Off"
                    :active-value="1"
                    :inactive-value="0"
                    >
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column
                label="广告申请状态">
                <template slot-scope="scope">
                    <span 
                    :class="[{'applying':scope.row.ad_flag===0},{'applysuccess':scope.row.ad_flag>=2},{'applyerror':scope.row.ad_flag===1}]">
                    {{scope.row.ad_flag===0?'申请中':(scope.row.ad_flag===1?'申请失败':(scope.row.ad_flag===2?'申请成功，请支付':'支付完成'))}}
                    </span>
                </template>
            </el-table-column>
            <el-table-column
                label="广告支付状态">
                <template slot-scope="scope">
                    <span v-if="scope.row.ad_flag<=1">未支付</span>
                    <span v-if="scope.row.ad_flag===3" class="applysuccess">已支付</span>
                    <!-- <el-button v-if="scope.row.ad_flag===2" @click="payAd(scope.row)">请支付</el-button> -->
                    <el-popover
                    v-if="scope.row.ad_flag===2"
                    placement="top-start"
                    title="请输入支付密码"
                    width="400"
                    v-model="showpay"
                    trigger="manual">
                    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                        <el-form-item label="密码" prop="pass">
                            <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="确认密码" prop="checkPass">
                            <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="submitForm('ruleForm',scope.row)">提交</el-button>
                            <el-button @click="resetForm('ruleForm')">重置</el-button>
                        </el-form-item>
                    </el-form>
                    <el-button slot="reference" @click="clickshowpay" size="medium" round>点击支付</el-button>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column
                label="备注">
                <template slot-scope="scope">
                    <el-popover
                        v-if="scope.row.ad_remarks"
                        placement="top-start"
                        title="备注"
                        width="200"
                        trigger="hover"
                        :content="scope.row.ad_remarks">
                        <span slot="reference">收到备注</span>
                    </el-popover>
                    <span v-else>暂无收到备注</span>
                </template>
            </el-table-column>
            <el-table-column
                label="广告图片"
                >
                <template slot-scope="scope">
                    <!-- <img :src="scope.row.ad_img" alt="" style="width:80px;height:60px;"> -->
                    <el-image 
                        style="width: 80px; height: 60px;cursor:pointer;"
                        :src="scope.row.ad_img"
                        @click="photoList = [],photoList.push(scope.row.ad_img)"
                        :preview-src-list="photoList">
                    </el-image>
                </template>    
            </el-table-column>
            <el-table-column
            fixed="right"
            label="操作"
            width="120">
            <template slot-scope="scope">
                <el-button
                @click="$router.push(`/Adapplyedit/${scope.row._id}`)"
                type="text"
                size="small">
                编辑
                </el-button>
                <el-button
                @click="delAd(scope.row._id)"
                style="color:red"
                type="text"
                size="small">
                删除
                </el-button>
            </template>
            </el-table-column>
            </el-table>
             <el-pagination
                layout="prev, pager, next"
                v-if="tableData.BeanPage"
                @current-change="changePage"
                :page-size="numSize"
                :page-count="tableData.BeanPage.allPages"
                :total="tableData.BeanPage.count">
            </el-pagination>
        </div>
    </div>
</template>

<script>
import {MOBILE, ADMIN} from '../../api/globol'
import format from '../../common/common'
export default {
    data(){
        return{
            tableData: [],
            numPage:1,
            numSize:2,
            photoList:[],
            showpay:false,
            loading:false,
            searchInfo:'',
            ruleForm: {
                    pass: '',
                    checkPass: '',
                },
            rules: {
                pass: [
                    { required: true,message: '密码不能为空', trigger: 'blur' }
                ],
                checkPass: [
                    { required: true,message: '确认密码不能为空', trigger: 'blur' }
                ],
            }
        }
    },
    methods:{
        fetchData(){
            let id = sessionStorage.id
            this.$http.post(MOBILE+'/showAppliedAdList',{id,numPage:this.numPage,numSize:this.numSize,searchInfo:this.searchInfo}).then(res=>{
                this.tableData = res.data
            })
        },
        reset(){
            this.searchInfo = ''
            this.fetchData()
        },
        changeshowflag(e){
            if(e.ad_showflag==0){
                this.$http.post(MOBILE+'/ifshowAd',{ad_showflag:0,id:e._id}).then(res=>{
                    this.$message.success(res.data.message)
                })
            } else {
                this.$http.post(MOBILE+'/ifshowAd',{ad_showflag:1,id:e._id}).then(res=>{
                    this.$message.success(res.data.message)
                })
            }
        },
        delAd(id){
            this.$confirm('此操作将永久删除该广告申请, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    this.$http.post(MOBILE+'/delAd',{id}).then(res=>{
                        this.$message.success(res.data.message)
                    })
                }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
        payAd(e){
            // console.log(e)
            let id = sessionStorage.id
            this.$http.post(MOBILE+'/payAd',{adid:e._id,id}).then(res=>{
                this.$message.success(res.data.message)
                this.fetchData()
            })
        },
        clickshowpay(){
            //验证是否有支付密码
            let id = sessionStorage.id
            this.$http.post(MOBILE+'/showIfPaypassword',{id}).then(res=>{
                if(!res.data.paypasswordflag){
                    this.$message.error('请先去移动端设置支付密码!')
                } else {
                    this.showpay = !this.showpay
                }
            })
        },
        submitForm(formName,e) {
            this.showpay = false
            this.$refs[formName].validate((valid) => {
            if (valid) {
                if(this.ruleForm.pass!==this.ruleForm.checkPass){
                    this.$message.error('两次输入的密码不一致');
                    return
                }
                let id = sessionStorage.id
                this.loading = true
                this.$http.post(MOBILE+'/checkPaypassword',{id,paypassword:this.ruleForm.pass}).then((res)=>{
                    if(res.data.status === 200){
                        this.$message.success(res.data.message)
                        setTimeout(()=>{
                            this.loading = false
                            this.payAd(e)
                            this.resetForm(formName)
                        },2000)
                    } else if(res.data.status === 401){
                        this.$message.error(res.data.message)
                        this.loading = false
                        this.resetForm(formName)
                    }
                })
                // this.payAd(e)
                // console.log(e)
                // alert('submit!');
            } else {
                console.log('error submit!!');
                return false;
            }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        changePage(e){
            console.log(e)
            this.numPage=e
            this.fetchData()
        },
        computedtimeline(time){
            if(time){
                //时间戳转字符串比较
                // console.log(Date.now())
                let now = Date.now()
                //new Date(Date.parse("2019-11-07T09:42:12.144Z")).getTime() utc转时间戳
                let timestamp = new Date(Date.parse(time)).getTime()
                if (now>timestamp){
                    return format(time)+'已过期';
                } else {
                    return format(time);
                }
            } else return '未开始'
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
            }
    },
    mounted(){
        this.fetchData()
    }
}
</script>

<style scoped>
.applying{
    color:#E6A23C;
    font-weight: bold;
}
.applysuccess{
    color: #67C23A;
    font-weight: bold;
}
.applyerror{
    color: #F56C6C;
    font-weight: bold;
}
</style>