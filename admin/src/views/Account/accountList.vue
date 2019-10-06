<template>
<div style="padding: 5px;min-height:500px">
  <h1 style="margin-top:0">账户列表</h1>
  <el-table
    height="500"
    :data="tableData.items"
    border
    style="width: 100%">
    <el-table-column
      prop="_id"
      label="id"
      width="240"
      >
    </el-table-column>
    <el-table-column
      prop="account"
      label="帐户名"
      >
    </el-table-column>
    <el-table-column
      prop="email"
      label="邮箱"
      >
    </el-table-column>
    <el-table-column
      prop="telephone"
      label="电话"
      >
    </el-table-column>
    <el-table-column
      prop="nickname"
      label="名称"
      >
    </el-table-column>
    <el-table-column
      fixed="right"
      label="操作"
      width="250">
      <template slot-scope="scope">
        <el-button @click="showDialog(scope.row)" type="default" size="small">查看</el-button>
        <el-button @click="frozenAccount(scope.row)" type="primary" size="small">{{scope.row.frozen === 1 ?'冻结':'解冻'}}</el-button>
        <el-button @click="remove(scope.row)" type="danger" size="small">删除</el-button>
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
  </div>
</template>

<script>
import {ADMIN} from '../../api/globol'
  export default {
    methods: {
     async remove(row) {
          this.$confirm(`是否删除用户"${row.account}"?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then( async() => {
            let res = await this.$http.delete(ADMIN+`/AccountDel/${row._id}`)
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.fetchUsers()
        })
      },
      fetchUsers(){
          this.$http.get(ADMIN+'/AccountList'+`/${this.numPage}/${this.numSize}`).then((res)=>{
              this.tableData=res.data
              // console.log(this.tableData)
          })
      },
      changePage(e){
        console.log(e)
        this.numPage=e
        this.fetchUsers()
      },
      showDialog(el){
        this.userDetails = el
        this.dialogVisible = true
      },
      frozenAccount(e){
        // console.log(e)
        if(e.frozen === 1){
          this.$http.post(ADMIN+'/frozenAccount',{
            frozen:0,
            id:e._id
          }).then((res)=>{
            this.fetchUsers()
            this.$message.success(res.message)
            
          })
        } else if(e.frozen === 0){
          this.$http.post(ADMIN+'/frozenAccount',{
            frozen:1,
            id:e._id
          }).then((res)=>{
            this.fetchUsers()
            this.$message.success(res.message)
            
          })
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
        userDetails: ''
      }
    }
  }
</script>

<style scoped>
.dialogInfo{
  flex:1;
  margin-left:10px
}
.dialogInfo div{
  margin-bottom: 10px;
}
</style>