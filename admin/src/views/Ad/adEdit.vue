<template>
    <div style="padding:10px">
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
            <el-tab-pane label="广告价格管理" name="first">
                <div>
                    {{new Date('2019-11-04T10:09:10.063Z')}}
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
        })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      showAdPrice(){
          this.$http.post(ADMIN+'/showAd').then(res=>{

          })
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