<template>
<div style="padding:20px 10px;min-height:500px;background:#fff">
  <h1 style="margin-top:0">管理员列表</h1>
  <el-table
    height="500"
    :data="tableData"
    :header-cell-style="{background:'#eef1f6',color:'#606266'}"
    style="width: 100%">
    <el-table-column
      fixed
      prop="_id"
      label="id"
      >
    </el-table-column>
    <el-table-column
      prop="adminName"
      label="用户名"
      >
    </el-table-column>
    <el-table-column
      fixed="right"
      label="操作"
      width="150">
      <template slot-scope="scope">
        <el-button @click="$router.push(`/adminEdit/${scope.row._id}`)" type="primary" size="small">编辑</el-button>
        <el-button @click="remove(scope.row)" type="danger" size="small">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  </div>
</template>

<script>
import {ADMIN} from '../../api/globol'
  export default {
    methods: {
     async remove(row) {
          this.$confirm(`是否删除管理员"${row.adminName}"?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then( async() => {
            let res = await this.$http.delete(ADMIN+`/rest/adminUser/${row._id}`)
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.fetchUsers()
        })
      },
      fetchUsers(){
          this.$http.get(ADMIN+'/rest/adminUser').then((res)=>{
              
              this.tableData=res.data
              console.log(this.tableData)
          })
      }
    },
    created(){
        this.fetchUsers()
    },

    data() {
      return {
        tableData: []
      }
    }
  }
</script>