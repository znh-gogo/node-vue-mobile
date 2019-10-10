<template>
    <div style="padding: 5px;min-height:500px">
        <h1>我的商品列表</h1>
        <div v-if="myproductlist.length === 0" style="text-align:center;margin-top:20px">
            您暂时还没有商品出售哦，<span style="color:#409EFF;cursor: pointer;" @click="$router.push('/selling')">去发售</span>
        </div>
        <el-row v-else>
            <el-col :span="5" v-for="(o, index) in myproductlist" :key="index" style="margin-bottom:10px;margin-left:30px">
                <el-card :body-style="{ padding: '0px' }">
                <!-- <img src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png" class="image"> -->
                <el-carousel indicator-position="none" height="220px" v-if="o.pro_imgs.length !== 0">
                    <el-carousel-item v-for="(item,index1) in o.pro_imgs" :key="index1" class="image">
                        <img :src="item" alt="" style="width:100%;height:100%">
                    </el-carousel-item>
                </el-carousel>
                <img src="../../assets/lose.jpg" style="height:220px" class="image" v-else>
                <div style="padding: 10px;">
                    <div style="height:42px;-webkit-box-orient: vertical;overflow:hidden;text-overflow:ellipsis;-webkit-line-clamp:2;display: -webkit-box;">{{o.pro_description}}</div>
                    <div>
                        <el-tag style="margin-right:5px;margin-bottom:5px" size="mini" v-for="(a,i) in o.pro_categories" :key="i">{{a.goodcategory}}</el-tag>
                    </div>
                    <div style="color:red;">￥{{o.pro_price}}</div>
                    <div style="display:flex;justify-content:space-between;font-size:13px;">
                        <div style="font-size:13px;color:#999">售卖状态</div>
                        <div style="color:#E6A23C" v-if="o.buyflag === 0">上架中</div>
                        <div style="color:#67C23A" v-if="o.buyflag === 1">已售出</div>
                        <div style="color:#F56C6C" v-if="o.buyflag === 2">已下架</div>
                    </div>
                    <div class="bottom clearfix">
                    <time class="time">{{ format(o.updatedAt) }}</time>
                    <div>
                        <el-button type="text" class="button" @click="$router.push(`/editseller/${o._id}`)">编辑</el-button>
                        <el-button type="text" style="color:red;margin-right:6px" class="button" @click="delproduct(o._id)">删除</el-button>
                    </div>
                    </div>
                </div>
                </el-card>
            </el-col>
        </el-row>
        <el-pagination
            v-if="pageList"
            layout="prev, pager, next"
            @current-change="changePage"
            :page-size="numSize"
            :page-count="pageList.allPages"
            :total="pageList.count">
        </el-pagination>
    </div>
</template>

<script>
import {MOBILE} from '../../api/globol'
import format from '../../common/common'
export default {
    data() {
        return {
            currentDate: new Date(),
            myproductlist:[],
            format,
            numSize: 4,
            numPage: 1,
            pageList:[]
        }
    },
    methods:{
        getMyGoods(){
            let id = sessionStorage.id
            this.$http.post(MOBILE+'/showMyProduct',{id,numSize:this.numSize,numPage:this.numPage}).then(res=>{
                this.myproductlist = res.data.items
                this.pageList = res.data.BeanPage
            })
        },
        delproduct(id){
            this.$confirm('删除该商品, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    this.$http.post(MOBILE+'/delProduct',{id}).then(res =>{
                    if(res){
                        this.$message.success(res.data.message)
                        this.getMyGoods()
                    }
                })
                }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
        changePage(e){
            console.log(e)
            this.numPage=e
            this.getMyGoods()
      },
    },
    mounted(){
        this.getMyGoods()
    }
}
</script>

<style scoped>
  .time {
    font-size: 13px;
    color: #999;
  }
  
  .bottom {
    margin-top: 13px;
    /* line-height: 12px; */
    display: flex;
    justify-content: space-between;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image {
    width: 100%;
    /* height: 100%; */
    display: block;
    
  }

  .clearfix:before,
  .clearfix:after {
      display: table;
      content: "";
  }
  
  .clearfix:after {
      clear: both
  }
</style>