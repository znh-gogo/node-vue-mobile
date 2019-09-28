<template>
  <div style="width:100%;min-height:100%;background:#eee;padding-bottom:6rem;">
    <div style="width:100%;padding:0.5rem 0.5rem;">
        <ul style="width:100%;overflow:hidden;padding:0 1rem">
          <li
          v-for="(item,index) in typelist"
          :key="index"
          @click="choosetype(item,index)"
          :class="{'current':typeIndex === index}"
          style="float:left;margin-right:1rem;font-size:1.2rem">{{item}}</li>
        </ul>
    </div>
  <div class="goodbox">
    <div class="goodcontent">
      <img src="../../assets/n2.jpg" alt="" style="width:100%;height:auto;border-radius:0.8rem;">
      <div style="font-weight:bold;line-height:1.2rem;height:2.4rem;overflow:hidden;">这里是白哦他内容藐视这里是白哦他内容藐视这里是白哦他内容藐视</div>
      <div style="display:flex;justify-content:space-between;margin:1rem 0;padding:0 0.5rem;">
        <div style="color:red;">￥<span style="font-size:1.5rem">120</span></div>
        <div>11人关注</div>
      </div>
      <div style="width:90%;height:1px;background:#eee;margin:0 auto"></div>
      <div style="width:100%;padding:0.5rem;display:flex">
        <img src="../../assets/123.png" alt="" style="width:2rem;height:2rem;border-radius:0.3rem">
        <div style="margin-left:0.5rem;margin-top:0.2rem;">大哥大</div>
      </div>
    </div>
        <div class="goodcontent">
      <img src="../../assets/n2.jpg" alt="" style="width:100%;height:auto;border-radius:0.8rem;">
      <div>123123</div>
      <div>123123</div>
      <div>123123</div>
      <div>123123</div>

      <div>123123</div>

    </div>
        <div class="goodcontent">
      <img src="../../assets/n3.jpg" alt="" style="width:100%;height:auto;border-radius:0.8rem;">
      <div>123123</div>
      <div>123123</div>
      <div>123123</div>
    </div>
            <!-- <div class="goodcontent">
      <img src="../../assets/n2.jpg" alt="" style="width:100%;height:auto;border-radius:0.8rem;">
      <div>123123</div>
      <div>123123</div>
      <div>123123</div>
    </div> -->
  </div>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'HomeGood',
  data(){
    return{
      typelist:['最新','水果','蔬菜','加工食品'],
      typeIndex:0
    }
  },
  methods:{
    choosetype(item,index){
        this.typeIndex = index
    }
  },
  mounted (){
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

