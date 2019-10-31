<template>
    <div style="width: 100%;height: 100vh;background-color: #fafafa;">
        <mt-header title="修改地址" style="background-color:#f1f1f1;color: #222222;font-size: 1.2rem;height:4rem">
            <router-link to="/mine/myinfo" slot="left">
                <mt-button icon="back"></mt-button>
            </router-link>
            <div slot="right" style="font-size:1.3rem;color:#222222" @click="change">
                完成
            </div>
        </mt-header>
        <mt-field placeholder="请输入名称" type="textarea" rows="3" v-model="address"></mt-field>
        <div style="width:100%;text-align:center;margin-top:1.5rem;">
            <mt-button type="primary" @click="getLocation" style="width: 90%;">
                <img src="../../../assets/定位.png" alt="" slot="icon">
                获取当前定位
            </mt-button>
        </div>
        <div style="margin-top:2rem;width:100%;height:100%;">
              <div id="container" style="width:100%;height:20rem;"></div>
        </div>
    </div>
</template>
<script>
import api from '../../../api'
import { Toast,Indicator,MessageBox } from 'mint-ui'
import {location} from '../../../common/map'
import axios from 'axios'
export default {
    data (){
        return{
            address:'',
            lat:'',
            lng:'',
            province:'',
            city:'',
            district:''
        }
    },
    methods: {
        change(){
            api.changeAddress({id:this.$route.query.id,address:this.address}).then((res)=>{
                Toast(res.message)
                this.$router.go(-1)
            })
        },
        /**获取地图定位*/
        getLocation() {
        let _that = this;
        Indicator.open('加载中...')

        // this.test()
        // // console.log(location)

        let geolocation = location.initMap("map-container"); //定位
        AMap.event.addListener(geolocation, "complete", result => {
            _that.lat = result.position.lat;
            _that.lng = result.position.lng;
            _that.province = result.addressComponent.province;
            _that.city = result.addressComponent.city;
            _that.district = result.addressComponent.district;
            console.log(result)
            this.address = result.formattedAddress
            this.init()
            Indicator.close()
        });
        AMap.event.addListener(geolocation, 'error', err=>{
            // console.log(err)
            MessageBox('提示', err.message);
            Indicator.close()
        });
        },
        init() {
        //步骤：定义map变量 调用 qq.maps.Map() 构造函数   获取地图显示容器
        //设置地图中心点
        // var myLatlng = new qq.maps.LatLng(39.916527,116.397128);
        var myLatlng = new qq.maps.LatLng(this.lat,this.lng);
        // console.log(myLatlng)
        //定义工厂模式函数
        var myOptions = {
          zoom: 15,               //设置地图缩放级别
          center: myLatlng,      //设置中心点样式
          mapTypeId: qq.maps.MapTypeId.ROADMAP  //设置地图样式详情参见MapType
        }
        //获取dom元素添加地图信息
        var map = new qq.maps.Map(document.getElementById("container"), myOptions);
      },
      test(){
        //   var geolocation = new qq.maps.Geolocation("OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77", "myapp"); 
        // axios.get('https://apis.map.qq.com/ws/location/v1/ip?ip=10.52.176.86&key=ZPEBZ-5XI6I-EWPGT-5XMZS-CRE43-M3FYY',{headers:{'Access-Control-Allow-Origin': '*'}}).then(res=>{
        //     console.log(res)
        // })
        var geolocation = new qq.maps.Geolocation("ZPEBZ-5XI6I-EWPGT-5XMZS-CRE43-M3FYY", "test_map"); 
        
            var positionNum = 0;
            var options = {timeout: 18000};
            geolocation.getLocation(position=>{
                console.log(position)
                this.lat= position.lat
                this.lng=position.lng
                this.address = position.province + position.city
                this.init()
                Indicator.close()
            }, (err)=>{
                console.log(err)
            }, options);
      }
    },
    created (){
        this.address = this.$route.query.address
        // console.log(this.$route.query)
    }
}
</script>