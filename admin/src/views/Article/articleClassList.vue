<template>
<div>
  <h1 style="margin-top:0">文章分类列表</h1>
  <el-table
    height="500"
    :data="tableData"
    border
    style="width: 100%">
    <el-table-column
      fixed
      prop="_id"
      label="id"
      >
    </el-table-column>
    <el-table-column
      prop="className"
      label="文章分类名称"
      >
    </el-table-column>
    <!-- <el-table-column
      prop="icon"
      label="图标"
      width="130px"
      >
      <template slot-scope="scope">
        <el-image :src="scope.row.icon" alt="" style="width: 100px; height: 100px;" >
        <div slot="error" class="image-slot" style="line-height:100px;text-align:center">
          未上传图片
         </div>
        </el-image>
      </template>
    </el-table-column> -->
    <el-table-column
      fixed="right"
      label="操作"
      width="150">
      <template slot-scope="scope">
        <el-button @click="$router.push(`/articleClassEdit/${scope.row._id}`)" type="primary" size="small">编辑</el-button>
        <el-button @click="remove(scope.row)" type="danger" size="small">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  </div>
</template>

<script>
  export default {
    methods: {
     async remove(row) {
          this.$confirm(`是否删除类名"${row.name}"?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then( async() => {
            let res = await this.$http.delete(`rest/articleClass/${row._id}`)
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.fetchGoods()
        })
      },
      fetchGoods(){
          this.$http.get('rest/articleClass').then((res)=>{
              
              this.tableData=res.data
              // console.log(this.tableData)
          })
      }
    },
    created(){
        this.fetchGoods()
    },

    data() {
      return {
        tableData: []
      }
    }
  }
</script>