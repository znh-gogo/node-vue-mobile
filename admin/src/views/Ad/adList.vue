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
            :data="tableData.items"
            :header-cell-style="{background:'#eef1f6',color:'#606266'}"
            style="width: 100%">
            <el-table-column
                label="商家名称"
                >
                <template slot-scope="scope">
                    <span style="color:#409EFF;text-decoration: underline;cursor:pointer;" @click="showInfo(scope.row.relative)">{{scope.row.relative.nickname}}</span>
                </template>
            </el-table-column>
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
                    <span>{{scope.row.ad_showflag===1?'显示':'隐藏'}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="广告申请状态">
                <template slot-scope="scope">
                    <span 
                    :class="[{'applying':scope.row.ad_flag===0},{'applysuccess':scope.row.ad_flag>=2},{'applyerror':scope.row.ad_flag===1}]">
                    {{scope.row.ad_flag===0?'申请中':(scope.row.ad_flag===1?'申请失败':(scope.row.ad_flag===2?'申请成功，待支付':'支付完成'))}}
                    </span>
                </template>
            </el-table-column>
            <el-table-column
                label="广告支付状态">
                <template slot-scope="scope">
                    <span v-if="scope.row.ad_flag<=1">未支付</span>
                    <span v-if="scope.row.ad_flag===3" class="applysuccess">已支付</span>
                    <span v-if="scope.row.ad_flag===2" class="applying">待支付</span>
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
            width="180">
            <template slot-scope="scope">
                <el-button
                :disabled="scope.row.ad_flag>=1"
                @click="agreeControl(scope.row)"
                style="text-decoration: underline;color:#409EFF"
                type="text"
                size="small">
                {{scope.row.ad_flag===0||scope.row.ad_flag===1?'通过':'已通过'}}
                </el-button>
                <el-button
                :disabled="scope.row.ad_flag>=1"
                @click="refuseControl(scope.row)"
                style="color:red;text-decoration: underline;"
                type="text"
                size="small">
                {{scope.row.ad_flag===1?'已拒绝':'拒绝'}}
                </el-button>
                <el-button
                :disabled="scope.row.ad_flag===3"
                style="text-decoration: underline;"
                @click="remarks(scope.row)"
                type="text"
                size="small">
                备注
                </el-button>
                <el-button
                :disabled="scope.row.ad_flag<=1"
                style="text-decoration: underline;"
                @click="frzoen(scope.row)"
                type="text"
                size="small">
                冻结
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
        <el-dialog
            title="账户信息"
            :visible.sync="dialogVisible"
            width="40%">
                <div style="display:flex">
                <div><img :src="userDetails.headImg" alt="" style="width:200px;height:auto"></div>
                <div class="dialogInfo">
                    <div>名称：{{userDetails.nickname}}</div>
                    <div>账号：{{userDetails.account}}</div>
                    <div>电话：{{userDetails.telephone}}</div>
                    <div>邮箱：{{userDetails.email}}</div>
                    <div>个性签名：{{userDetails.description}}</div>
                </div>
                </div>
                <span slot="footer" class="dialog-footer">
                <!-- <el-button @click="dialogVisible = false">取 消</el-button> -->
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
                </span>
        </el-dialog>
        <el-dialog
            title="广告备注"
            :visible.sync="dialogVisible1"
            width="30%">
            <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model="textarea">
            </el-input>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible1 = false">取 消</el-button>
                <el-button type="primary" @click="remarkHandle">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {ADMIN} from '../../api/globol'
import format from '../../common/common'
export default {
    data(){
        return{
            tableData: [],
            numPage:1,
            numSize:2,
            dialogVisible:false,
            dialogVisible1:false,
            userDetails:{},
            photoList:[],
            adids:'',
            textarea:'',
            searchInfo:''
        }
    },
    methods:{
        fetchData(){
            this.$http.post(ADMIN+'/showAllAd',{numPage:this.numPage,numSize:this.numSize,searchInfo:this.searchInfo}).then(res=>{
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
        agreeControl(e){
            this.$http.post(ADMIN+'/manageAdApply',{flag:2,id:e._id}).then(res=>{
                this.$message.success(res.data.message)
                this.fetchData()
            })
        },
        refuseControl(e){
            this.$http.post(ADMIN+'/manageAdApply',{flag:1,id:e._id}).then(res=>{
                this.$message.success(res.data.message)
                this.fetchData()
            })
        },
        showInfo(e){
            this.dialogVisible = true
            this.userDetails = e
        },
        remarks(e){
            this.adids = e._id
            this.dialogVisible1 = true
            this.textarea = ''
            if(e.ad_remarks){
                this.textarea = e.ad_remarks
            }
        },
        frzoen(e){
            this.$message.warning('此功能将冻结违规的广告位，暂未开放!')
        },
        remarkHandle(){
            this.$http.post(ADMIN+'/adRemarks',{id:this.adids,ad_remarks:this.textarea}).then(res=>{
                this.$message.success(res.data.message)
                this.dialogVisible1 = false
                this.textarea = ''
                this.fetchData()
            })
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
.dialogInfo{
  flex:1;
  margin-left:10px
}
.dialogInfo div{
  margin-bottom: 10px;
}
</style>