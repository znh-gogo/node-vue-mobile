<template>
<div>
  <h1 style="margin-top:0">用户列表</h1>
  <el-table
    height="500"
    :data="tableData.items"
    border
    style="width: 100%">
    <el-table-column
      fixed
      prop="_id"
      label="id"
      >
    </el-table-column>
    <el-table-column
      prop="name"
      label="用户名"
      >
    </el-table-column>
    <el-table-column
      prop="relative.name"
      label="所属关系"
      >
    </el-table-column>
    <el-table-column
      fixed="right"
      label="操作"
      width="150">
      <template slot-scope="scope">
        <el-button @click="$router.push(`/userEdit/${scope.row._id}`)" type="primary" size="small">编辑</el-button>
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
  </div>
</template>

<script>
  export default {
    methods: {
     async remove(row) {
          this.$confirm(`是否删除用户"${row.name}"?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then( async() => {
            let res = await this.$http.delete(`rest/users/${row._id}`)
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.fetchUsers()
        })
      },
      fetchUsers(){
          this.$http.get('rest/users'+`/${this.numPage}/${this.numSize}`).then((res)=>{
              
              this.tableData=res.data
              console.log(this.tableData)
          })
      },
      changePage(e){
        console.log(e)
        this.numPage=e
        this.fetchUsers()
      }
    },
    created(){
        this.fetchUsers()
    },

    data() {
      return {
        tableData: [],
        numPage:1,
        numSize:5
      }
    }
  }
</script>