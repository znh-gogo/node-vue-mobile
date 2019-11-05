<template>
    <div style="padding:20px 10px;">
        <div>
            <div style="text-align:right;">
                <el-form :inline="true" class="demo-form-inline">
                    <el-form-item>
                        <el-input placeholder="请输入广告名称"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary">查询</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <el-table
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
                label="广告时长">
                <template slot-scope="scope">
                    {{computedTime(scope.row.ad_timelong)}}
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
                    active-text="显示"
                    inactive-text="隐藏"
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
                    <el-button type="primary" v-if="scope.row.ad_flag===2" class="applying">请支付</el-button>
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
import {MOBILE} from '../../api/globol'
export default {
    data(){
        return{
            tableData: [],
            numPage:1,
            numSize:2,

        }
    },
    methods:{
        fetchData(){
            let id = sessionStorage.id
            this.$http.post(MOBILE+'/showAppliedAdList',{id,numPage:this.numPage,numSize:this.numSize}).then(res=>{
                this.tableData = res.data
            })
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
        changePage(e){
            console.log(e)
            this.numPage=e
            this.fetchData()
        },
        computedtimeline(time){
            if(time){
                //时间转字符串比较
                return time
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