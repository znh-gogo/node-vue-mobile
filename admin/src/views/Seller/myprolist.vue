<template>
    <div style="padding: 5px;min-height:500px">
        <h1>我的商品列表</h1>
        <div v-if="myproductlist.length === 0" style="text-align:center;margin-top:20px">
            您暂时还没有商品出售哦，<span style="color:#409EFF;cursor: pointer;" @click="$router.push('/selling')">去发售</span>
        </div>
        <el-row v-else>
            <el-col :span="5" v-for="(o, index) in myproductlist" :key="index" style="margin-bottom:10px;margin-left:30px">
                <el-card :body-style="{ padding: '0px' }" style="position:relative">
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
                        <div style="color:#67C23A" v-if="o.buyflag === 2">交易完成</div>
                        <div style="color:#F56C6C" v-if="o.buyflag === 3">已下架</div>
                    </div>
                    <div class="bottom clearfix">
                    <div class="time">{{ format(o.updatedAt) }}</div>
                    <div>
                        <el-button type="text" class="button" @click="$router.push(`/editseller/${o._id}`)" v-if="o.buyflag === 0||o.buyflag === 3">编辑</el-button>
                        <el-button type="text" style="color:red;margin-right:6px" class="button" @click="delproduct(o._id,o.buyflag)" v-if="o.buyflag === 0 ||o.buyflag === 3">删除</el-button>
                        <el-button type="text" class="button" @click="checkBuyer(o,o.buyer,o._id)" v-if="o.buyflag === 1||o.buyflag === 2">查看详情</el-button>
                    </div>
                    </div>
                </div>
                <div style="" class="paybackmask" v-if="o.paybackflag === 1">
                    <div>
                        <div style="text-align:center;margin-bottom:1rem;font-size:1.2rem;color:#fff;">买家申请退款</div>
                        <el-button type="danger" @click="surePay(o._id,2)">同意退款</el-button>
                        <el-button type="info" @click="surePay(o._id,3)">不同意退款</el-button>
                    </div>
                </div>
                </el-card>
            </el-col>
        </el-row>
        <el-dialog
            title="买家信息"
            :visible.sync="dialogVisible"
            width="30%"
            :before-close="handleClose">
            <div style="display:flex">
                <div style="width:7rem;text-align:right">
                    <p>买家账号：</p>
                    <p>买家用户名：</p>
                    <p>买家电话：</p>
                    <p>买家邮箱：</p>
                    <p style="font-weight:700">收货人姓名：</p>
                    <p style="font-weight:700">收货人电话：</p>
                    <p style="font-weight:700">收货人地址：</p>
                </div>
                <div style="flex:1">
                    <p>{{buyerInfo.account}}</p>
                    <p>{{buyerInfo.nickname}}</p>
                    <p>{{buyerInfo.telephone}}</p>
                    <p>{{buyerInfo.email}}</p>
                    <p v-if="buyerInfo.rece_info">{{buyerInfo.rece_info.re_name}}</p>
                    <p v-if="buyerInfo.rece_info">{{buyerInfo.rece_info.re_phone}}</p>
                    <p v-if="buyerInfo.rece_info">{{buyerInfo.rece_info.re_address}}</p>
                </div>
            </div>
            <el-divider></el-divider>
            <div style="margin-top:2rem;padding:0 2rem;"><span>快递运单号：</span><el-input style="width:70%" :disabled="buyerInfo.buyflag===2" v-model="buyerInfo.sendOrderList" placeholder="请输入运单号"></el-input></div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="sureSendingOrder">确 定</el-button>
            </span>
        </el-dialog>
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
            pageList:[],
            dialogVisible: false,
            buyerInfo:{},
            pid:''
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
        delproduct(id,buyflag){
            this.$confirm('删除该商品, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    if(buyflag === 0){
                        this.$message({
                            type: 'warning',
                            message: '该商品正在上架中，请下架后再作操作！'
                        });  
                        return;
                    }
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
        checkBuyer(o,e,id){
            this.dialogVisible = true
            this.pid = id
            this.buyerInfo = e
            this.$set(this.buyerInfo,'sendOrderList',o.sendOrderList)
            this.$set(this.buyerInfo,'buyflag',o.buyflag)
            for (let i =0;i<e.rece_info.length;i++){
                if(e.rece_info[i].checked === 1){
                    this.$set(this.buyerInfo,'rece_info',e.rece_info[i])
                }
            }
            console.log(this.buyerInfo)
        },
        sureSendingOrder(){
            this.$http.post(MOBILE+'/sendOrderList',{id:this.pid,sendOrderList:this.buyerInfo.sendOrderList}).then(res=>{
                this.getMyGoods()
                this.$message.success(res.data.message)
            })
            this.dialogVisible = false
        },
        surePay(gid,num){
            // console.log(id,num)
            this.$http.post(MOBILE+'/paybackApply',{paybackflag:num,gid}).then(res=>{
                this.$message.success('操作成功')
                this.getMyGoods()
            })
        },
        handleClose(done) {
            this.$confirm('确认关闭？')
            .then(_ => {
                done();
            })
            .catch(_ => {});
        },
        changePage(e){
            console.log(e)
            this.numPage=e
            this.getMyGoods()
      },
      showBuyer(b,id){
        this.buyerInfo = b
        this.$set(this.buyerInfo,'order',id)
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
    text-decoration: underline;
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
  .paybackmask{
      position:absolute;
      top:0;
      left:0;
      background: rgba(0, 0, 0, 0.5);
      width: 100%;
      height: 100%;
      z-index: 50;
      display: flex;
      justify-content: center;
      align-items: center;
  }
</style>