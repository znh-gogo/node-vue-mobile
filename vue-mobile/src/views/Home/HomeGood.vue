<template>
<div style="overflow:scroll">
<!-- <mt-loadmore :top-method="loadTop" :top-status.sync="topStatus" ref="loadmore"> -->
  
   <!-- :bottom-method="loadMore" :bottom-all-loaded="allLoaded" -->
    <!-- <div slot="top" class="mint-loadmore-top" style="text-align:center">
        <div v-show="topStatus !== 'loading'" :class="{ 'rotate': topStatus === 'drop' }">
                <div>下拉刷新 ↓</div>
        </div>
        <span style="display:flex;justify-content:space-around;">
        <mt-spinner v-show="topStatus == 'loading'" color="#26a2ff" style="margin-top:1rem"></mt-spinner>
        <span v-show="topStatus == 'loading'" >加载中...</span>
        </span>
    </div> -->
    
  <div style="width:100%;min-height:100%;background:#eee;padding-bottom:6rem;">
    <div style="width:100%;padding:0.3rem 0;overflow:hidden" class="scrollbar" ref="homeWrap">
        <ul style="overflow-y:hidden;overflow-x:scroll;padding:1rem;display:flex;white-space:nowrap;" ref="one">
          <li
          v-for="(item,index) in typelist"
          :key="index"
          @click="choosetype(item,index)"
          :class="{'current':typeIndex === index}"
          style="margin-right:1rem;font-size:1.2rem;padding:0.5rem;">{{item.goodcategory}}</li>
        </ul>
    </div>
  
    <div style="overflow-y: auto;height:auto;">
    <div class="goodbox" >
      <div v-for="(item,index) in productList" :key="index">
        <div class="goodcontent" v-if="item.buyflag===0" @click="$router.push({path:'/good-detail',query:{gid:item._id}})">
          <img src="../../assets/lose.jpg" alt="" style="width:100%;height:auto;border-radius:0.8rem;" v-if="item.pro_imgs.length === 0">
          <img :src="item.pro_imgs[0]" alt=""  style="width:100%;height:auto;border-radius:0.8rem;" v-else>
          <div style="font-weight:bold;line-height:1.2rem;height:2.4rem;overflow:hidden;padding:0.2rem">{{item.pro_description}}</div>
          <div style="display:flex;justify-content:space-between;margin:1rem 0;padding:0 0.5rem;">
            <div style="color:red;">￥<span style="font-size:1.5rem">{{item.pro_price}}</span></div>
            <div v-if="item.pro_attention">{{item.pro_attention.length}}人关注</div>
          </div>
          <div style="width:90%;height:1px;background:#eee;margin:0 auto"></div>
          <div style="width:100%;padding:0.5rem;display:flex" v-if="item.seller">
            <img :src="item.seller.headImg" alt="" style="width:2rem;height:2rem;border-radius:0.3rem">
            <div style="margin-left:0.5rem;margin-top:0.2rem;">{{item.seller.nickname}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="loading-box tc" v-show="isLoading" style="display:flex;justify-content:space-around;">
    <mt-spinner type="snake" class="loading-more" color="#26a2ff"></mt-spinner>
    <span class="loading-more-txt" style="margin-top:0.5rem">加载中...</span>
 </div>
  <div v-show="loadflag1" style="wdith:100%;text-align:center">已经没有数据了</div>
  </div>
  <!-- <div slot="bottom" class="mint-loadmore-bottom">
      <span v-show="bottomStatus !== 'loading'"
      :class="{ 'is-rotate': bottomStatus === 'drop' }">↑ 上拉加载</span>
      <span v-show="bottomStatus === 'loading'">
      <mt-spinner type="snake"></mt-spinner>
      </span>
  </div> -->
  </div>
</template>

<script>
// @ is an alias to /src
import api from '../../api'
import BScroll from 'better-scroll'

// import Vue from 'vue'
import { Toast } from 'mint-ui'
// Vue.use(InfiniteScroll)
// Vue.component(Spinner.name, Spinner)
export default {
  name: 'HomeGood',
  props:{
    result:{
      type:String,
      default:''
    }
  },
  data(){
    return{
      typelist:['最新','水果','蔬菜','加工食品'],
      typeIndex:0,
      productList:[],
      scroll:'',
      topStatus:'',
      bottomStatus:'',
      difftype:'',
      allLoaded: false,
      numPage:1,
      numSize:5,
      loadflag:false,
      loading:false,
      isLoading : false,
      upflag:false,
      stopflag:true,
      loadflag1:false,
      
    }
  },
  watch:{
    result:'checkroute',
    $route:{
        handler:function(to,old){
          if(to.path == '/home'){
            this.listenScroll()
          } else {
            window.onscroll = null
            console.log(window.onscroll,"销毁了")
          }
        }
    }
  },
  methods:{
    choosetype(item,index){
      // console.log(item._id)
      // this.$router.push({path:'/home/good',query:{}})
        this.$emit('setFlag')
        this.typeIndex = index
        this.productList = []
        // this.allLoaded = false
        this.loading = false;
        this.loadflag = false
        this.loadflag1 = false
        this.numPage = 1
        if(item._id){
          this.difftype = item._id
          this.getProList(this.difftype,this.numPage,this.numSize)
          // api.MobileProduct({id:item._id}).then(res=>{
          //   this.homeScroll()
          //   this.productList = res.reverse()
          // })
        } else {
          this.difftype = ''
          this.homeScroll()
          this.getProList(this.difftype,this.numPage,this.numSize)
        }
    },
    checkroute(){
      if(this.result !== ''){
        console.log(this.result)
        // let result = sessionStorage.result
        api.searchProduct({key:this.result}).then(res=>{
          if(res.length!==0){
            this.productList = res
            
            // sessionStorage.removeItem('result')
          } else {
            Toast('搜索结果为空')
            // sessionStorage.removeItem('result')
          }
        })
      }
    },
    getProList(id,p,s){
      if(id){
        api.MobileProduct({id,numPage:p,numSize:s}).then(res=>{
          if(res.length!==0){
            if(this.productList.length!==0){
              for(let i =0;i<res.length;i++){
                this.productList.push(res[i])
              }
              if(res.length<this.numSize){
                this.loadflag = true
                this.loading = true
                if(this.loadflag === true){
                  this.loading = false;
                  this.loadflag1 = true
                }
              }
            } else{
              this.productList = res.reverse()
            }
            this.loading = false;
            } else{
            this.loadflag = true
            this.loading = true
            if(this.loadflag === true){
              this.loading = false;
              this.loadflag1 = true
            }
          }
        })
      } else{
        api.MobileProduct({numPage:p,numSize:s}).then(res=>{
          if(res.length!==0){
            if(this.productList.length!==0){
              for(let i =0;i<res.length;i++){
                this.productList.push(res[i])
              }
              if(res.length<this.numSize){
                this.loadflag = true
                this.loading = true
                if(this.loadflag === true){
                  this.loading = false;
                  this.loadflag1 = true
                }
              }
            } else{
              this.productList = res.reverse()
            }
            this.loading = false;
          } else{
            this.loadflag = true
            this.loading = true;
            if(this.loadflag === true){
              this.loading = false;
              this.loadflag1 = true
            }
          }
        })
      }
    },
    proCategories(){
      api.proCategory().then(res=>{
        this.typelist = res
        this.typelist.unshift({goodcategory:'最新'})
        this.homeScroll()
      })
    },
    homeScroll() {
      // 默认有六个li子元素，每个子元素的宽度为120px
      // let width = 6 * 120;
      // let count = this.typelist.length
      // let width = 6*count
      // console.log(this.$refs.one.offsetWidth)
      // console.log(count)

      // this.$refs.one.style.width = width+ 1 + "rem";
      // // this.$nextTick 是一个异步函数，为了确保 DOM 已经渲染
      // this.$nextTick(() => {
      //     if (!this.scroll) {
      //     this.scroll = new BScroll(this.$refs.homeWrap, {
      //         startX: 0,
      //         click: true,
      //         scrollX: true,
      //         // 忽略竖直方向的滚动
      //         scrollY: false,
      //         // eventPassthrough: "vertical"
      //     });
      //     console.log(this.scroll)
      //     } else {
      //     this.scroll.refresh();
      //     }
      // });
    },
    gotop(){
      window.scrollTo(0,0);
    },
    handleTopChange(status) {
        this.topStatus = status;
    },
    handleBottomChange(status) {
        this.bottomStatus = status;
    },
    onRefresh(){
      this.loadTop()
    },
    loadTop() {
        // load more data
        this.handleTopChange("loading");
        setTimeout(() => {
          // this.numPage=1
          // this.numSize=2
          this.$emit('setFlag')
        this.productList = []
        this.loadflag = false
        this.loadflag1 = false
        this.loading = false;
        this.numPage = 1  
        // this.allLoaded = false
          this.getProList(this.difftype,this.numPage,this.numSize)
          this.$emit('closeLoad',false)
          // this.vantLoading = false
          // this.handleTopChange("loadingEnd")
          // this.$refs.loadmore.onTopLoaded();
        },1500)
    },
    loadMore(){
      // this.handleBottomChange("loading")
      this.loadflag = false;//没有更多
      this.isLoading = true;//加载中
      this.loading = true;
      if(this.stopflag){
        
        this.stopflag = false
        setTimeout(() => {
        this.numPage+=1
        this.getProList(this.difftype,this.numPage,this.numSize)
        this.isLoading = false;
        this.stopflag = true
        // this.handleBottomChange("loadingEnd")
        
        // if(this.loadflag === false){
        //   this.allLoaded = true; // 若数据已全部获取完毕
        // }
        // // this.$refs.loadmore.onTopLoaded();
        // this.$refs.loadmore.onBottomLoaded();
        },1500)
      }
    },
    listenScroll(){
      setTimeout(()=>{
      window.onscroll = ()=>{
     		//变量scrollTop是滚动条滚动时，距离顶部的距离
     		var scrollTop = document.documentElement.scrollTop||document.body.scrollTop;
     		//变量windowHeight是可视区的高度
     		var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
     		//变量scrollHeight是滚动条的总高度
     		var scrollHeight = document.documentElement.scrollHeight||document.body.scrollHeight;

        //滚动条到底部的条件
        if(Math.ceil(scrollTop)+Math.ceil(windowHeight)>=scrollHeight){
        //写后台加载数据的函数
        console.log("距顶部"+scrollTop+"可视区高度"+windowHeight+"滚动条总高度"+scrollHeight);
          scrollTop = 0
          windowHeight = 0
          scrollHeight = 0
        // console.log(sessionStorage.result)
      if(this.result === ''){
          if(!this.loadflag1&&!this.isLoading){
          this.loadMore()
        }
      }
      }   else if(scrollTop>300){
        this.upflag = true
     } else {
       this.upflag = false
     }
    }
  // console.log(window.onscroll)
    },0)
    }
  },
  mounted (){
    this.proCategories()
    this.getProList(this.difftype,this.numPage,this.numSize)
    // console.log(this.$route.query)
  },
  created(){
    
            this.listenScroll()
     	
  
   },
  destroyed(){
    window.onscroll = null
    console.log(window.onscroll,"销毁了")
  }
}
</script>

<style lang="scss" scoped>
ul,li{list-style: none;}
ul{padding-left: 0;}
.goodbox{
  padding:2%;
  width:100%;
  height:100%;
  // display: flex;
  // flex-flow:row wrap;
  -moz-column-count:2; /* Firefox */
  -webkit-column-count:2; /* Safari 和 Chrome */
  column-count:2;
  -moz-column-gap: 1rem;
  -webkit-column-gap: 1rem;
  column-gap: 1rem;
  // margin: 0 auto;
  // white-space:wrap;
  // overflow: hidden;
  .goodcontent{
    // width:48%;
    // height:100%;
    // float:left;
    break-inside: avoid;
    -webkit-column-break-inside: avoid;
    -moz-page-break-inside: avoid;
    background: #fff;
    // margin-right:1%;
    border-radius:0.8rem;
    margin-bottom:1rem;
  }
}
.current{
  border-bottom: 0.2rem solid #4DA422;
  font-weight: bold;
}

.scrollbar{
  ::-webkit-scrollbar {
     width: 0 !important;
   }
   ::-webkit-scrollbar {
     width: 0 !important;height: 0;
   }
   ul{
     -webkit-overflow-scrolling: touch;
   }
}
</style>

