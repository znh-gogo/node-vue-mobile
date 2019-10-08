<template>
<div style="overflow:scroll">
<mt-loadmore :top-method="loadTop" :top-status.sync="topStatus" :bottom-method="loadMore" :bottom-all-loaded="allLoaded" ref="loadmore">
    <div slot="top" class="mint-loadmore-top" style="text-align:center">
        <div v-show="topStatus !== 'loading'" :class="{ 'rotate': topStatus === 'drop' }">
                <div>下拉刷新 ↓</div>
        </div>
        <span style="display:flex;justify-content:space-around;">
        <mt-spinner v-show="topStatus == 'loading'" color="#26a2ff" style="margin-top:1rem"></mt-spinner>
        <span v-show="topStatus == 'loading'">加载中...</span>
        </span>
    </div>
    
  <div style="width:100%;min-height:100%;background:#eee;padding-bottom:6rem;">
    <div style="width:100%;padding:0.3rem 0" ref="homeWrap">
        <ul style="overflow:hidden;padding:0 1rem" ref="one">
          <li
          v-for="(item,index) in typelist"
          :key="index"
          @click="choosetype(item,index)"
          :class="{'current':typeIndex === index}"
          style="float:left;margin-right:1rem;font-size:1.2rem;padding:0.5rem;">{{item.goodcategory}}</li>
        </ul>
    </div>
  <div class="goodbox">
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
  <div v-if="allLoaded" style="wdith:100%;text-align:center">已经没有数据了</div>
  </div>
  <div slot="bottom" class="mint-loadmore-bottom">
      <span v-show="bottomStatus !== 'loading'"
      :class="{ 'is-rotate': bottomStatus === 'drop' }">↑ 上拉加载</span>
      <span v-show="bottomStatus === 'loading'">
      <mt-spinner type="snake"></mt-spinner>
      </span>
  </div>
  </mt-loadmore>
  </div>
</template>

<script>
// @ is an alias to /src
import api from '../../api'
import BScroll from 'better-scroll'
export default {
  name: 'HomeGood',
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
      numSize:4,
      loadflag:true
    }
  },
  methods:{
    choosetype(item,index){
      // console.log(item._id)
        this.typeIndex = index
        this.productList = []
        this.allLoaded = false
        if(item._id){
          this.difftype = item._id
          api.MobileProduct({id:item._id}).then(res=>{
            this.homeScroll()
            this.productList = res.reverse()
          })
        } else {
          this.difftype = ''
          this.homeScroll()
          this.getProList()
        }
    },
    getProList(id,p,s){
      if(id){
                console.log(123)
        api.MobileProduct({id,numPage:p,numSize:s}).then(res=>{
          if(res.length!==0){
            if(this.productList.length!==0){
              for(let i =0;i<res.length;i++){
                this.productList.push(res[i])
              }
            } else{
              this.productList = res.reverse()
            }
            } else{
            this.loadflag = false
          }
        })
      } else{
                console.log(456)
        api.MobileProduct({numPage:p,numSize:s}).then(res=>{
          if(res.length!==0){
            if(this.productList.length!==0){
              for(let i =0;i<res.length;i++){
                this.productList.push(res[i])
              }
            } else{
              this.productList = res.reverse()
            }
          } else{
            this.loadflag = false
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
      let count = this.typelist.length
      let width = 6*count
      // console.log(this.$refs.two.style.width)
      // console.log(count)
      this.$refs.one.style.width = width+ 1 + "rem";
      // this.$nextTick 是一个异步函数，为了确保 DOM 已经渲染
      this.$nextTick(() => {
          if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.homeWrap, {
              startX: 0,
              click: true,
              scrollX: true,
              // 忽略竖直方向的滚动
              scrollY: false,
              // eventPassthrough: "vertical"
          });
          console.log(this.scroll)
          } else {
          this.scroll.refresh();
          }
      });
    },
    handleTopChange(status) {
        this.topStatus = status;
    },
    handleBottomChange(status) {
        this.bottomStatus = status;
    },
    loadTop() {
        // load more data
        this.handleTopChange("loading");
        setTimeout(() => {
          // this.numPage=1
          // this.numSize=2
        this.productList = []
        this.loadflag = true
        this.allLoaded = false
          this.getProList(this.difftype)
          this.handleTopChange("loadingEnd")
          this.$refs.loadmore.onTopLoaded();
        },1500)
    },
    loadMore(){
      this.handleBottomChange("loading")
      setTimeout(() => {
        this.numPage+=1
        this.getProList(this.difftype,this.numPage,this.numSize)
        this.handleBottomChange("loadingEnd")
        
        if(this.loadflag === false){
          this.allLoaded = true; // 若数据已全部获取完毕
        }
        // this.$refs.loadmore.onTopLoaded();
        
        this.$refs.loadmore.onBottomLoaded();
        },1500)
       
    }
  },
  mounted (){
    this.proCategories()
    this.getProList()
    // console.log(this.$route.query)
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
</style>

