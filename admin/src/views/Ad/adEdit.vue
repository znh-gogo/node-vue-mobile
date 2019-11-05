<template>
    <div style="padding:10px">
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
            <el-tab-pane label="广告价格管理" name="first">
                <div style="display:flex;flex-wrap: wrap;">
                    <div v-for="(item,index) in priceList" :key="index" :class="[{'priceBox':nowIndex!==index},{'current':nowIndex === index}]" @click="chooseCurrent(item,index)">
                        <div class="priceTime">{{computedTime(item.ad_timeline)}}</div>
                        <div class="price">￥{{item.ad_price}}</div>
                    </div>
                </div>
                <div style="margin:10px;"><el-button type="danger" :disabled="nowIndex === -1" @click="delAdPrice">删除该价格</el-button>
                <el-button @click="nowIndex = -1">重置</el-button>
                </div>
            </el-tab-pane>
            <el-tab-pane label="设置广告价格" name="second">
                <el-form :model="ruleForm" status-icon ref="ruleForm" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="选择时长：" prop="ad_timeline">
                        <!-- <el-input type="text" v-model="ruleForm.checkPass" autocomplete="off"></el-input> -->
                        <el-select v-model="ruleForm.ad_timeline" placeholder="请选择"  style="width:300px">
                            <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="广告价格：" prop="ad_price">
                        <el-input type="text" v-model="ruleForm.ad_price" autocomplete="off" style="width:300px"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
                        <el-button @click="resetForm('ruleForm')">重置</el-button>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <!-- <el-tab-pane label="角色管理" name="third">角色管理</el-tab-pane>
            <el-tab-pane label="定时任务补偿" name="fourth">定时任务补偿</el-tab-pane> -->
        </el-tabs>
    </div>
</template>

<script>
import {ADMIN} from '../../api/globol'
export default {
    data(){
        return{
            activeName: 'first',
            tabsname:'first',
            nowIndex:-1,
            currentId:'',
            ruleForm: {
                        ad_price: '',
                        ad_timeline: ''
                    },
            options: [{
                value: 60*60*24,
                label: '一天'
                },{
                value: 60*60*24*15,
                label: '半个月'
                }, {
                value: 60*60*24*30,
                label: '一个月'
                }, {
                value: 60*60*24*90,
                label: '三个月'
                }, {
                value: 60*60*24*180,
                label: '半年'
                }, {
                value: 60*60*24*360,
                label: '一年'
                }],
                priceList:[]
        }
    },
    methods: {
      handleClick(tab) {
        console.log(tab.name);
        sessionStorage.tabsname = tab.name
      },
      submitForm(formName) {
        // console.log(this.ruleForm)
        this.$http.post(ADMIN+'/setAd',this.ruleForm).then(res=>{
            this.$message.success(res.data.message)
            this.$refs[formName].resetFields()
            this.activeName = 'first'
            sessionStorage.tabsname = 'first'
            this.showAdPrice()
        })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      showAdPrice(){
          this.$http.post(ADMIN+'/showAd').then(res=>{
              this.priceList = res.data
          })
      },
      delAdPrice(){
          this.$confirm('此操作将删除该价格标签, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.post(ADMIN+'/delAd',{id:this.currentId}).then(res=>{
              this.$message.success(res.data.message)
              this.showAdPrice()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
          
      },
      chooseCurrent(item,index){
          this.nowIndex = index
          this.currentId = item._id
      },
      computedTime(time){
          let day = 60*60*24
          let times = time/day
          switch(times){
                case 1:
                    return 1+' 天';
                    break;
                case 15:
                    return 2+' 周';
                    break;
                case 30:
                    return 1+'个月';
                    break;
                case 90:
                    return 3+'个月';
                    break;
                case 180:
                    return '半 年';
                    break;
                case 360:
                    return '一 年';
                    break;
          }
      }
    },
    mounted(){
        this.showAdPrice()
        if(sessionStorage.tabsname){
            this.activeName = sessionStorage.tabsname
        }
    }
}
</script>

<style scoped>
.priceBox{
    padding: 5px;
    border: 1px solid #cfcfcf;
    border-radius: 4px;
    text-align: center;
    margin-left: 10px;
    margin-top: 5px;
    width: 120px;
    cursor: pointer;
    
}
.priceTime{
    border-bottom: 1px solid #cfcfcf;
    padding-bottom: 5px;
    font-size: 20px;
}
.price{
    margin-top: 5px;
    font-size: 24px;
}
.current{
    border: 1px solid #409EFF;
    border-radius: 4px;
    text-align: center;
    margin-left: 10px;
    width: 120px;
    cursor: pointer;
    padding: 5px;
    margin-top: 5px;

}
</style>