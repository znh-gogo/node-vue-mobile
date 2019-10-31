<template>
    <div style="width: 100%;height: 100vh;background-color: #fff;">
        <mt-header :title="title" style="background-color:#f1f1f1;color: #222222;font-size: 1.2rem;height:4rem">
            <mt-button icon="back" slot="left" @click="$router.go(-1)"></mt-button>
            <mt-button slot="right" @click="setting">完成</mt-button>
        </mt-header>
        <div v-if="!paypasswordflag">
            <div style="margin:1rem;">设置新的支付密码:</div>
        <van-password-input
        :value="value"
        info="密码为 6 位数字"
        :focused="showKeyboard"
        @focus="showKeyboard = true"
        />

        <!-- 数字键盘 -->
        <van-number-keyboard
        :show="showKeyboard"
        @input="onInput"
        @delete="onDelete"
        @blur="showKeyboard = false"
        />
        </div>
        <div v-else>
            <div style="margin:1rem;">修改支付密码:</div>
            <van-password-input
            :value="updateValue"
            info="请输入原密码"
            :focused="showKeyboard1"
            @focus="showKeyboard1 = true,showKeyboard2 = false"
            />

            <!-- 数字键盘 -->
            <van-number-keyboard
            :show="showKeyboard1"
            @input="onInput1"
            @delete="onDelete1"
            @blur="showKeyboard1 = false"
            />
            <van-password-input
            :value="updateValue1"
            :mask="false"
            info="请输入新密码"
            :focused="showKeyboard2"
            @focus="showKeyboard2 = true,showKeyboard1 = false"
            />

            <!-- 数字键盘 -->
            <van-number-keyboard
            :show="showKeyboard2"
            @input="onInput2"
            @delete="onDelete2"
            @blur="showKeyboard2 = false"
            />
        </div>
    </div>
</template>

<script>
import api from '../../../api'
import { MessageBox,Toast } from 'mint-ui';
export default {
    data(){
        return{
            value: '',
            showKeyboard: true,
            paypasswordflag:false,
            title:'设置支付密码',
            value1:'',
            updateValue:'',
            showKeyboard1:false,
            updateValue1:'',
            showKeyboard2:false
        }
    },
    watch:{
        value(){
            if(this.value1 ===''){
                if(this.value.length===6){
                    Toast('请再输入一遍密码')
                    // MessageBox('提示', '请再输入一遍密码')
                    this.value1 = this.value
                    this.value = ''
                }
            }
        }
    },
    methods:{
        onInput(key) {
            this.value = (this.value + key).slice(0, 6);
        },
        onDelete() {
            this.value = this.value.slice(0, this.value.length - 1);
        },
        onInput1(key) {
            this.updateValue = (this.updateValue + key).slice(0, 6);
        },
        onDelete1() {
            this.updateValue = this.updateValue.slice(0, this.updateValue.length - 1);
        },
        onInput2(key) {
            this.updateValue1 = (this.updateValue1 + key).slice(0, 6);
        },
        onDelete2() {
            this.updateValue1 = this.updateValue1.slice(0, this.updateValue1.length - 1);
        },
        setting(){
            let id = window.sessionStorage.getItem('id')
            if(!this.paypasswordflag){
                if(this.value.length!==6){
                    MessageBox('提示', '输入的密码不足6位');
                    return
                }
                if(this.value !== this.value1){
                    MessageBox('提示', '输入的密码不一致,请重输');
                    this.value1 = ''
                    this.value = ''
                    return
                }
                api.setPaypassword({id,paypassword:this.value}).then(res=>{
                    this.$router.go(-1)
                })
            } else {
                if(this.updateValue.length!==6||this.updateValue1.length!==6){
                    MessageBox('提示', '输入的密码不足6位');
                    return
                }
                api.updatePaypassword({id,oldpaypassword:this.updateValue,newpaypassword:this.updateValue1}).then(res=>{
                    if(res.status === 401){
                        Toast(res.message)
                    } else if(res.status === 200){
                        Toast(res.message)
                        this.$router.go(-1)
                    }
                })
            }
            
        },
        showIfPassword(){
            let id = window.sessionStorage.getItem('id')
            api.showIfPaypassword({id}).then(res=>{
                this.paypasswordflag = res.paypasswordflag
                if(!res.paypasswordflag){
                    this.title = '设置支付密码'
                } else{
                    this.title = '修改支付密码'
                }
            })
        }
    },
    mounted(){
        this.showIfPassword()
    }
}
</script>