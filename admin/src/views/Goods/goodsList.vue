<template>
<div style="padding:20px 10px;background:#fff">
  <h1 style="margin-top:0">商品列表</h1>
  <div style="text-align:right;">
      <el-form :inline="true" class="demo-form-inline">
          <el-form-item>
              <el-input placeholder="请输入商品描述" v-model="searchInfo"></el-input>
          </el-form-item>
          <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="fetchGoods" :disabled="searchInfo===''">查询</el-button>
          </el-form-item>
          <el-form-item>
              <el-button icon="el-icon-delete" @click="reset">重置</el-button>
          </el-form-item>
      </el-form>
  </div>
  <el-table
    height="500"
    :data="tableData.items"
    :header-cell-style="{background:'#eef1f6',color:'#606266'}"
    style="width: 100%">
    <el-table-column
      
      prop="pro_description"
      label="商品描述"
      >
    </el-table-column>
    <el-table-column
      prop="pro_price"
      label="商品价格"
      >
    </el-table-column>
    <el-table-column
      prop="buyflag"
      label="商品状态"
    >
    <template slot-scope="scope">
      <div style="font-weight:700">{{scope.row.buyflag === 0?'上架中':(scope.row.buyflag === 1)?'已售出':(scope.row.buyflag === 2?'交易完成':'已下架')}}</div>
    </template>
    </el-table-column>
    <el-table-column
      prop="seller.nickname"
      label="售卖人"
      
      >
      <!-- <template slot-scope="scope">
        <el-image :src="scope.row.icon" alt="" style="width: 100px; height: 100px;" >
        <div slot="error" class="image-slot" style="line-height:100px;text-align:center">
          未上传图片
         </div>
        </el-image>
      </template> -->
    </el-table-column>
    <el-table-column
      fixed="right"
      label="操作"
      width="150">
      <template slot-scope="scope">
        <el-button @click="getdetail(scope.row)" type="primary" plain size="small">查看</el-button>
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
  <el-dialog
    title="详情"
    :visible.sync="dialogVisible"
    width="30%"
    :before-close="handleClose">
    <div>
      <p v-if="model.seller">售卖人：<span style="font-weight:bold">{{model.seller.nickname}}</span></p>
      <p v-if="model.seller">售卖人账号：<span style="font-weight:bold">{{model.seller.account}}</span></p>
      <p>售卖类别：<span style="font-weight:bold" v-for="(item,index) in model.pro_categories" :key="index"> {{item.goodcategory}} </span></p>
      <p>售卖价格：<span style="font-weight:bold">￥{{model.pro_price}}</span></p>
      <p>售卖描述：<span style="font-weight:bold">{{model.pro_description}}</span></p>
      <p>发货地址：<span style="font-weight:bold">{{model.pro_address}}</span></p>
      <el-divider v-if="model.buyer"></el-divider>
      <p v-if="model.buyer">购买人：<span style="font-weight:bold">{{model.buyer.nickname}}</span></p>
      <p v-if="model.buyer">购买人账号：<span style="font-weight:bold">{{model.buyer.account}}</span></p>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
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
          this.$confirm(`是否删除用户"${row.name}"?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then( async() => {
            let res = await this.$http.post(ADMIN+`/delGood`,{id:row._id})
          this.$message({
            type: 'success',
            message: res.data.message
          });
          this.fetchGoods()
        })
      },
      fetchGoods(){
          this.$http.post(ADMIN+'/showAllProduct',{numSize:this.numSize,numPage:this.numPage,searchInfo:this.searchInfo}).then((res)=>{
              this.tableData=res.data
              // console.log(this.tableData)
          })
      },
      reset(){
        this.searchInfo = ''
        this.fetchGoods()
      },
      changePage(e){
        console.log(e)
        this.numPage=e
        this.fetchGoods()
      },
      getdetail(e){
        this.model = e
        this.dialogVisible = true
        
      },
      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      }
    },
    created(){
        this.fetchGoods()
    },

    data() {
      return {
        tableData: [],
        numSize: 4,
        numPage: 1,
        dialogVisible: false,
        model:{},
        searchInfo:''
      }
    }
  }
</script>