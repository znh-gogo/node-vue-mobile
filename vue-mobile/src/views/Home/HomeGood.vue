<template>
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
          <div>11人关注</div>
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
      scroll:''
    }
  },
  methods:{
    choosetype(item,index){
      // console.log(item._id)
        this.typeIndex = index
        if(item._id){
          api.MobileProduct({id:item._id}).then(res=>{
            this.homeScroll()
            this.productList = res.reverse()
          })
        } else {
          this.homeScroll()
          this.getProList()
        }
    },
    getProList(){
      api.MobileProduct().then(res=>{
        this.productList = res.reverse()
      })
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

