<template>
  <div class="about">
    <div style="width:100%;text-align:center;margin:5rem 0rem;font-weight:700;line-height:1.5rem;min-height:30rem" v-if="mysaveList.length === 0">您暂时还没有关注任何商品哦，快去关注吧~</div>
    <div v-else>
      <div class="goodbox">
        <div v-for="(item,index) in mysaveList" :key="index">
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
  </div>
</template>

<script>
import api from '../../api'
export default {
  data (){
    return {
      mysaveList:[]
    }
  },
  methods:{
    getmysave(){
      let id = sessionStorage.id
      api.mySavePro({id}).then(res=>{
        this.mysaveList=res
      })
    }
  },
  mounted(){
    this.getmysave()
  }
}
</script>

<style lang="scss" scoped>
.about{
  width:100%;
  min-height:100%;
  background:#eee;
  padding-bottom:6rem;
  overflow: hidden;
}
.goodbox{
  padding:2%;
  width:100%;
  height:100%;
  min-height:30rem;
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
</style>
