<template>
<div style="padding:20px 10px;min-height:500px;background:#fff">
  <h1 style="margin-top:0">管理员操作日志管理列表</h1>
  <el-table
    :data="tableData.items"
    :header-cell-style="{background:'#eef1f6',color:'#606266'}"
    style="width: 100%">
    <el-table-column
      label="日期"
      >
      <template slot-scope="scope">
        <span>{{format(scope.row.createdAt)}}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="执行人"
      width="100"
      >
      <template slot-scope="scope">
        <el-tag>{{scope.row.log_name}}</el-tag>
      </template>
    </el-table-column>
    <el-table-column
      prop="log_ip"
      label="ip"
      >
    </el-table-column>
    <el-table-column
      label="设备"
      >
      <template slot-scope="scope">
        <el-popover
        placement="top-start"
        title="设备信息"
        width="200"
        trigger="hover"
        :content="scope.row.log_agent">
          <div slot="reference" class="text-hidden">{{scope.row.log_agent}}</div>
        </el-popover>
      </template>
  
    </el-table-column>
    <el-table-column
      label="方法"
      width="100"
      >
      <template slot-scope="scope">
        <el-tag type="warning">{{scope.row.log_method}}</el-tag>
      </template>
    </el-table-column>
    <el-table-column
      label="路径"
      >
      <template slot-scope="scope">
        <el-tag type="success">{{scope.row.log_url}}</el-tag>
      </template>
    </el-table-column>
    <el-table-column
      prop="log_desc"
      label="描述"
      fixed="right"
      width="180"
      >
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
</template>

<script>
import {ADMIN} from '../../api/globol'
import format from '../../common/common'
  export default {
    methods: {
     
      fetchLogs(){
          this.$http.post(ADMIN+'/logList',{numPage:this.numPage,numSize:this.numSize}).then((res)=>{
              this.tableData=res.data
              console.log(this.tableData)
          })
      },
      changePage(e){
        // console.log(e)
        this.numPage=e
        this.fetchLogs()
      },
    },
    created(){
        this.fetchLogs()
    },

    data() {
      return {
        tableData: [],
        format,
        numPage:1,
        numSize:10
      }
    }
  }
</script>

<style scoped>
.text-hidden{
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>