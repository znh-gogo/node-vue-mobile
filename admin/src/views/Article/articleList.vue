<template>
<div style="padding:20px 10px;background:#fff">
  <h1 style="margin-top:0">文章列表</h1>
  <div style="padding:10px"><el-button @click="$router.push(`/articleAdd`)">新建文章</el-button></div>
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
      label="发布时间"
      >
      <template slot-scope="scope">
        {{format(scope.row.createdAt)}}
      </template>
    </el-table-column>
    
    <el-table-column
      prop="articleName"
      label="文章名称"
      >
    </el-table-column>
        <el-table-column
      prop="className"
      label="文章所属分类"
      >
    </el-table-column>
    <el-table-column
      fixed="right"
      label="操作"
      width="150">
      <template slot-scope="scope">
        <el-button @click="$router.push(`/articleEdit/${scope.row._id}`)" type="primary" size="small">编辑</el-button>
        <el-button @click="remove(scope.row)" type="danger" size="small">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination
  v-if="page"
    layout="sizes, prev, pager, next"
    @current-change="changePage"
    @size-change="handleSizeChange"
    :page-sizes="[4, 6, 10]"
    :page-size="numSize"
    :page-count="page.allPages"
    :total="page.count">
  </el-pagination>
  </div>
</template>

<script>
import {ADMIN} from '../../api/globol'
import format from '../../common/common'
  export default {
    methods: {
     async remove(row) {
          this.$confirm(`是否删除文章"${row.articleName}"?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then( async() => {
            let res = await this.$http.delete(ADMIN+`/rest/article/${row._id}`)
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.fetchArticle()
        })
      },
      fetchArticle(){
        this.$http.get(ADMIN+'/rest/articleClass').then(()=>{
            this.$http.get(ADMIN+'/rest/article'+`/${this.numPage}/${this.numSize}`).then((res)=>{
              this.page = res.data.BeanPage
              this.tableData=res.data.items
              let className = ''
              for (let j = 0; j<this.tableData.length;j++){
                className = ''
                for (let i = 0; i<this.tableData[j].relative.length; i++) {
                  className= `${this.tableData[j].relative[i].className}、` + className
                }
                this.$set(this.tableData[j],'className',className)
              }
          })
        })
          // .then(()=>{
          //   this.translate()
          // })
      },
      changePage(e){
        console.log(e)
        this.numPage=e
        this.fetchArticle()
      },
      handleSizeChange(e){
        this.numSize = e
        this.fetchArticle()
      }
    },
    created(){
         this.fetchArticle()
        
    },

    data() {
      return {
        tableData: [],
        temp:[],
        page:[],
        numSize: 4,
        numPage: 1,
        format
      }
    }
  }
</script>