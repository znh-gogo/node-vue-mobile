<template>
    <div style="width: 100%;height: 100vh;background-color: #fafafa;overflow:hidden">
        <mt-header title="添加会话" style="background-color:#f1f1f1;color: #222222;font-size: 1.2rem;height:4rem">
            <router-link to="/conversation" slot="left">
                <mt-button icon="back"></mt-button>
            </router-link>
            <div slot="right" style="font-size:1.3rem;color:#222222" @click="searchUser">
                搜索
            </div>
        </mt-header>
        <div style="width:100%;height:3rem;display:flex">
            <div style="flex:1;text-align:center;line-height:3rem" :class="{'current':nowIndex === 1}" @click="nowIndex = 1">根据账号查找</div>
            <div style="flex:1;text-align:center;line-height:3rem" :class="{'current':nowIndex === 2}" @click="nowIndex = 2">根据名称查找</div>
        </div>
        <!-- <mt-search
        v-model="account"
        cancel-text="取消"
        :placeholder="textword">
        </mt-search> -->
        <mt-field label="查找：" :placeholder="textword" v-model="account"></mt-field>
        <div style="width:100%;padding:2rem 0">
            <div v-if="nullsearch !== ''" style="width:100%;text-align:center">
                {{nullsearch}}
            </div>
            <div v-for="(item,index) in resultList" :key="index"
            @click="$router.push({path:'/social/info',query:{id:item._id,flag:item._id===accountId?false:true}})">
                <mt-cell
                :title="'名称:'+item.nickname"
                :value="'账号:'+item.account"
                style="margin: 1rem 0;"
                is-link>
                    <img slot="icon" :src="item.headImg" width="48" height="48">
                </mt-cell>
            </div>
            
        </div>
    </div>
</template>

<script>
import api from '../../api'
export default {
    data (){
        return{
            accountId:null,
            account:'',
            result:'123',
            nowIndex:1,
            textword:'请输入对话人账号',
            resultList:[],
            nullsearch:''
        }
    },
    watch:{
        nowIndex(e){
            if(e === 1){
                this.account = ''
                this.textword = '请输入对话人账号'
            } else if(e === 2){
                this.account = ''
                this.textword = '请输入对话人名称'
            }
        }
    },
    methods:{
        searchUser(){
            if(this.nowIndex === 1){
                if(!this.account){
                    return
                }
                api.searchConversation({account:this.account}).then(res => {
                    // console.log(res)
                    if(res.message){
                        this.nullsearch = res.message
                    } else {
                        this.nullsearch= ''
                        this.resultList = res
                    }
                })
            } else if(this.nowIndex === 2){
                if(!this.account){
                    return
                }
                api.searchConversation({nickname:this.account}).then(res => {
                    // console.log(res)
                    if(res.message){
                        this.nullsearch = res.message
                    } else {
                        this.nullsearch= ''
                        this.resultList = res
                    }
                })
            }

        }
    },
    created(){
        this.accountId = window.sessionStorage.getItem('id')
    }
}
</script>

<style scoped>
.current{
    color:#0399d3;
}
</style>