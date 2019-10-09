<template>
    <div style="width: 100%;height: 100vh;background-color: #fafafa;">
        <mt-header title="我的收货地址" style="background-color:#f1f1f1;color: #222222;font-size: 1.2rem;height:4rem">
            <router-link to="/mine/mysettings" slot="left">
                <mt-button icon="back"></mt-button>
            </router-link>
            <!-- <div slot="right" style="font-size:1.3rem;color:#222222" @click="change">
                完成
            </div> -->
        </mt-header>
        <div v-if="showflag">
            <div style="width:100%;text-align:center;margin-top:2rem;font-weight:700" v-if="myReAddressList.length === 0">您暂时还没有设置收货地址，快去设置吧！</div>
            <div v-else style="width:100%">
                <div v-for="(item,index) in myReAddressList" :key="index" @click="showAddress(item)">
                    <div style="width:100%;display:flex;justify-content:space-between;padding:0.5rem;white-space:nowrap">
                        <div style="width:60%;margin-left:1rem">
                            <div style="text-overflow:ellipsis;overflow:hidden;white-space:nowrap">地址:{{item.re_address}}</div>
                            <div>收货人:{{item.re_name}}</div>
                            <div>电话:{{item.re_phone}}</div>
                        </div>
                        <div style="width:30%;margin-top:0.5rem;margin-right:0.5rem">
                            <a style="color:#409EFF;margin-right:0.5rem" v-if="item.checked === 0" @click.stop="setDefault(item._id)">设为默认</a>
                            <a style="font-weight:700;margin-right:0.5rem;color:#000" v-if="item.checked === 1" @click.stop="quitDefault(item._id)">取消默认</a>
                            <a style="color:#F56C6C" @click="del(item._id)">删除</a>
                            <!-- <a style="font-weight:700" v-if="item.checked === 1">已为默认</a> -->
                            <!-- <mt-button type="primary" size="small" style="width:60%">设为默认</mt-button>
                            <mt-button type="danger" size="small" style="width:40%">删除</mt-button> -->
                        </div>
                    </div>
                    <div style="width:90%;height:0.2rem;background:#cfcfcf;margin:0 auto"></div>
                </div>
            </div>
        </div>
        <div v-if="!showflag">
            <mt-field placeholder="请输入收货人姓名" v-model="model.re_name"></mt-field>
            <mt-field placeholder="请输入收货人电话" v-model="model.re_phone"></mt-field>
            <mt-field placeholder="请输入您收货的具体位置如：广东省广州市海珠区仲恺路仲恺工程学院南区学生公寓" type="textarea" rows="4" v-model="model.re_address"></mt-field>
            <div style="width:100%;text-align:center;margin-top:1.5rem;">
                <mt-button type="primary" style="width: 90%;" @click.native="add" v-if="!updateflag">添加地址</mt-button>
                <mt-button type="primary" style="width: 90%;" @click.native="updateAddress" v-if="updateflag">修改地址</mt-button>
            </div>
        </div>


        <div style="width:100%;text-align:center;margin-top:1.5rem;position:fixed;bottom:5rem;">
            <mt-button type="danger" style="width: 90%;" @click.native="showflag = !showflag,updateflag = false,model={}">
                <!-- <img src="../../../assets/定位.png" alt="" slot="icon"> -->
                {{showflag?'添加管理地址':'返回地址列表'}}
            </mt-button>
        </div>
        <!-- <div style="margin-top:2rem;width:100%;height:100%;">
              <div id="container" style="width:100%;height:20rem;"></div>
        </div> -->
    </div>
</template>

<script>
import api from '../../../api'
import {Toast} from 'mint-ui'
export default {
    data (){
        return{
            model:{},
            accoundid:'',
            myReAddressList:[],
            showflag:true,
            updateflag:false
        }
    },
    methods: {
        add(){
            if(this.model.re_name===undefined||this.model.re_name===''
            ||this.model.re_phone===undefined||this.model.re_phone===''
            ||this.model.re_address===undefined||this.model.re_address===''){
                Toast('请输入完整的信息!')
                return
            }
            this.$set(this.model,'id',this.accoundid)
            api.addReAddress(this.model).then((res)=>{
                Toast(res.message)
                this.show()
                this.model={}
                // this.$router.go(-1)
            })
        },
        show(){
            this.accoundid = sessionStorage.id
            api.showReAddress({id:this.accoundid}).then(res=>{
                this.myReAddressList = res.rece_info
            })
        },
        del(rid){
            api.delReAddress({id:this.accoundid,rid}).then(res=>{
                Toast(res.message)
                this.show()
            })
        },
        setDefault(rid){
            api.defaultReAddress({id:this.accoundid,rid}).then(res=>{
                Toast(res.message)
                this.show()
            })
        },
        quitDefault(rid){
            api.defaultReAddress({id:this.accoundid,rid,flag:0}).then(res=>{
                Toast(res.message)
                this.show()
            })
        },
        updateAddress(){
            // this.model = item
            // this.showflag = false
            // this.$set(this.model,'rid',item._id)
            api.updateReAddress(this.model).then(res=>{
                Toast(res.message)
                this.show()
                this.model={}
                this.updateflag = false

            })
        },
        showAddress(item){
            this.model = item
            this.showflag = false
            this.updateflag = true
            this.$set(this.model,'rid',item._id)
        }
       
    },
    mounted (){
        this.show()
        // console.log(this.$route.query)
    }
}
</script>