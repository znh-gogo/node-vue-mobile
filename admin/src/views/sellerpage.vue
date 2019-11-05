<template>
    <div style="padding: 5px;min-height:500px">
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
            <el-tab-pane label="商家信息" name="first">
                <div class="sellerinfo-box">
                    <div class="info-items one">
                        <div class="items-title">商品数</div>
                        <div class="items-content">{{model.productnum}}</div>
                    </div>
                    <div class="info-items two">
                        <div class="items-title">已售商品数</div>
                        <div class="items-content">{{model.soldnum}}</div>
                    </div>
                    <div class="info-items three">
                        <div class="items-title">商品总价值</div>
                        <div class="items-content">￥{{model.productallprice}}</div>
                    </div>  
                    <div class="info-items four">
                        <div class="items-title">营业额</div>
                        <div class="items-content">￥{{model.salary}}</div>
                    </div>
                </div>
                <div v-if="model.user" style="margin:10px;font-size:20px;">个人账户余额：{{model.user.money}}元</div>
                <div v-if="model.user" style="margin:10px;font-size:20px;">个人账户变动时间：{{format(model.user.updatedAt)}}</div>
            </el-tab-pane>
            <el-tab-pane label="基本信息" name="second">
                <div class="baseinfo-box">
                    <div class="info-left">
                        <p>账号：</p>
                        <p>用户名：</p>
                        <p>手机号：</p>
                        <p>邮箱地址：</p>
                        <p>个人地址：</p>
                        <p>账号创建时间：</p>
                        <p>个性签名：</p>
                    </div>
                    <div class="info-right" v-if="model.user">
                        <p>{{model.user.account}}</p>
                        <p>{{model.user.nickname}}</p>
                        <p>{{model.user.telephone}}</p>
                        <p>{{model.user.email}}</p>
                        <p>{{model.user.address}}</p>
                        <p v-if="model.user.createdAt">{{format(model.user.createdAt)}}</p>
                        <p v-else>暂无数据</p>
                        <p>{{model.user.description}}</p>
                    </div>
                    <div v-if="model.user" style="margin-left:60px"><img :src="model.user.headImg" alt="" style="width:200px;height:200px;"></div>
                </div>
            </el-tab-pane>
            <el-tab-pane label="广告位申请" name="third">
                <div style="">
                    
                </div>
            </el-tab-pane>
            <!-- <el-tab-pane label="定时任务补偿" name="fourth">定时任务补偿</el-tab-pane> -->
        </el-tabs>
    </div>
</template>

<script>
import {MOBILE} from '../api/globol'
import format from '../common/common'
export default {
    data() {
      return {
        MOBILE,
        activeName: 'first',
        model:{},
        format,
        delflag:false,
        ruleForm: {
          ad_name: '',
          ad_description: '',
          ad_price:'',
          ad_timelong:'',
          ad_showflag:1,
          ad_img:''
        },
        rules: {
          ad_name: [
            { required: true, message: '请输入广告名称', trigger: 'blur' }
          ],
          ad_description: [
            { required: true, message: '请输入广告描述', trigger: 'blur' }
          ],
          ad_price: [
            { required: true, message: '请选择广告价格期限', trigger: 'change' }
          ],
          ad_showflag: [
            { required: true, message: '请选择是否显示', trigger: 'change' }
          ],
          ad_img: [
            { required: true, message: '请上传广告位图片', trigger: 'change' }
          ]
        },
        nowIndex:-1,
        nowIndex1:-1,
        priceList:[]
      };
    },
    methods: {
      handleClick(tab) {
        // console.log(tab.name);
        sessionStorage.tabsname = tab.name
        // if(tab.name === 'third'){
        //     this.nowIndex = -1
        // }
      },
      getSeller(){
          let id = sessionStorage.id
          this.$http.post(MOBILE+'/showSellerInfo',{id}).then(res=>{
              this.model = res.data
          })
      },
    
    },
    mounted(){
        this.getSeller()
        if(sessionStorage.tabsname){
            this.activeName = sessionStorage.tabsname
        }
    }
}
</script>

<style scoped>
.sellerinfo-box{
    width: 100%;
    margin-top: 20px;
    display: flex;
    justify-content: space-around;
}
.one{
    background: linear-gradient(to top left, #3366FF,#CC99FF);
}
.two{
    background: linear-gradient(to top left, #FF0066,#FF99FF);
}
.three{
    background: linear-gradient(to top left, #FF6600,#FFFFaa);
}
.four{
    background: linear-gradient(to top left, green,#99FF99);
}
.info-items{
    width:18%;
    padding: 20px;
    border-radius: 8px;
}
.items-title{
    color: #fff;
    font-size: 22px;
    padding-bottom: 5px;
    border-bottom: 1px solid #fff;
    margin-bottom: 20px;
}
.items-content{
    font-size:30px;
    color: #fff;
}
.baseinfo-box{
    width:100%;
    padding: 20px 0 0 20px;
    display: flex;
}
.info-left{
    text-align: right;
}

</style>