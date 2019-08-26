<template>
<div>
  <h1 style="margin-top:0">文章列表</h1>
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
      prop="articleName"
      label="文章名称"
      >
    </el-table-column>
        <el-table-column
      prop="className"
      label="文章所属分类"
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
        <el-button @click="$router.push(`/articleEdit/${scope.row._id}`)" type="primary" size="small">编辑</el-button>
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
          this.$confirm(`是否删除文章"${row.articleName}"?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then( async() => {
            let res = await this.$http.delete(`rest/article/${row._id}`)
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.fetchArticle()
        })
      },
      fetchArticle(){
        this.$http.get('rest/articleClass').then(()=>{
            this.$http.get('rest/article').then((res)=>{
              this.tableData=res.data
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
      translate(){
        this.$http.get('rest/articleClass').then((res)=>{
          this.temp=res.data
          let flag= 0
          let names  = ''
          for(let i=0;i<this.tableData.length;i++){
            flag=0
            names=''
            for(let j=0;j<this.temp.length;j++){
              if(this.tableData[i].relative[flag]===this.temp[j]._id){
                names = `${this.temp[j].className}、` + names
                flag++
                this.$set(this.tableData[i],'name',names)
              }
            }
          }
          
         })
      }
    },
    created(){
         this.fetchArticle()
        
    },

    data() {
      return {
        tableData: [],
        temp:[]
      }
    }
  }
</script>