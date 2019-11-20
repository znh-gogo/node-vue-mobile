<template>
<div style="padding:20px 10px;background:#fff">
  <h1 style="margin-top:0">计划人列表</h1>
  <el-table
    height="500"
    :data="tableData.items"
    :header-cell-style="{background:'#eef1f6',color:'#606266'}"
    style="width: 100%">
    <el-table-column
      fixed
      prop="makername"
      label="计划人名称"
      >
    </el-table-column>
    <el-table-column
      prop="makerage"
      label="计划人年龄"
      >
    </el-table-column>
    <el-table-column
      prop="makericon"
      label="图像"
      width="130px"
      >
      <template slot-scope="scope">
        <el-image :src="scope.row.makericon" alt="" style="width: 100px; height: 100px;" >
        <div slot="error" class="image-slot" style="line-height:100px;text-align:center">
          未上传图片
         </div>
        </el-image>
      </template>
    </el-table-column>
    <el-table-column
      fixed="right"
      label="操作"
      width="150">
      <template slot-scope="scope">
        <el-button @click="$router.push(`/planmakerEdit/${scope.row._id}`)" type="primary" size="small">编辑</el-button>
        <el-button @click="remove(scope.row)" type="danger" size="small">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
    <el-pagination
    v-if="tableData.BeanPage"
    layout="prev, pager, next"
    @current-change="changePage"
    :page-size="numSize"
    :page-count="tableData.BeanPage.allPages"
    :total="tableData.BeanPage.count">
    
  </el-pagination>
  </div>
</template>

<script>
import {ADMIN} from '../../api/globol'
  export default {
    methods: {
     async remove(row) {
          this.$confirm(`是否删除用户"${row.name}"?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then( async() => {
            let res = await this.$http.delete(ADMIN+`/rest/planmaker/${row._id}`)
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.fetchGoods()
        })
      },
      fetchGoods(){
          this.$http.get(ADMIN+'/rest/planmaker'+`/${this.numPage}/${this.numSize}`).then((res)=>{
              this.tableData=res.data
            //   console.log(this.tableData)
          })
      },
      changePage(e){
        console.log(e)
        this.numPage=e
        this.fetchGoods()
      }
    },
    created(){
        this.fetchGoods()
    },

    data() {
      return {
        tableData: [],
        numSize: 3,
        numPage: 1
      }
    }
  }
</script>