<template>
<div style="padding: 5px;min-height:500px">
  <h1 style="margin-top:0">反馈列表</h1>
  <el-table
    height="500"
    :data="tableData.items"
    border
    style="width: 100%">
    <el-table-column
      prop="_id"
      label="反馈id"
      width="240"
      >
    </el-table-column>
    <el-table-column
      prop="relative.nickname"
      label="帐户名"
      >
    </el-table-column>
    <el-table-column
      prop="feedbacktopic"
      label="反馈类型"
      >
    </el-table-column>
    <el-table-column
      label="反馈时间"
      >
      <template slot-scope="scope">
        {{format(scope.row.createdAt)}}
      </template>
    </el-table-column>
    <el-table-column
      fixed="right"
      label="操作"
      width="200">
      <template slot-scope="scope">
        <el-button @click="showDialog(scope.row)" type="default" size="small">查看详情</el-button>
        <el-button @click="handleFeedback(scope.row)" :type="scope.row.feedbackflag === 0?'danger':'success'" size="small">{{scope.row.feedbackflag === 0 ?'未处理':'已处理'}}</el-button>
        <!-- <el-button @click="remove(scope.row)" type="danger" size="small">删除</el-button> -->
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

  <el-dialog
  title="反馈信息"
  :visible.sync="dialogVisible"
  width="40%">
    <div>
      <!-- <div><img :src="userDetails.headImg" alt="" style="width:200px;height:auto"></div> -->
      <div class="dialogInfo">
        <div>反馈类型：{{userDetails.feedbacktopic}}</div>
        <div>反馈内容：{{userDetails.feedbackcontent}}</div>
        <div>反馈截图：</div>
        <div v-for="(item,index) in userDetails.feedbackimg" :key="index" style="display:inline-block;margin-right:10px">
            <img :src="item" alt="" style="width:100px;height:auto">
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <!-- <el-button @click="dialogVisible = false">取 消</el-button> -->
      <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
    </span>
  </el-dialog>
  </div>
</template>

<script>
import {ADMIN} from '../../api/globol'
import format from '../../common/common'
  export default {
    methods: {
      fetchUsers(){
          this.$http.get(ADMIN+'/FeedbackList'+`/${this.numPage}/${this.numSize}`).then((res)=>{
              this.tableData=res.data
              this.tableData.items = this.tableData.items.reverse()
              // console.log(this.tableData)
          })
      },
      changePage(e){
        // console.log(e)
        this.numPage=e
        this.fetchUsers()
      },
      showDialog(el){
        this.userDetails = el
        // console.log(el)
        this.dialogVisible = true
      },
      handleFeedback(e){
        // console.log(e)
        if(e.feedbackflag === 0){
          this.$http.post(ADMIN+'/handleFeedback',{
            feedbackflag:1,
            id:e._id
          }).then((res)=>{
            this.fetchUsers()
            // console.log(res)
            this.$message.success(res.data.message)
          })
        } else if(e.feedbackflag === 1){
            this.$message.warning('该反馈已经处理完毕!')
        }
      }
    },
    created(){
        this.fetchUsers()
    },

    data() {
      return {
        tableData: [],
        numPage:1,
        numSize:5,
        dialogVisible: false,
        userDetails: '',
        format
      }
    }
  }
</script>

<style scoped>
.dialogInfo{
  /* flex:1; */
  margin-left:10px
}
.dialogInfo div{
  margin-bottom: 10px;
}
</style>