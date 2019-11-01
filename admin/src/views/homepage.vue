<template>
    <div class="container">
        <div class="top-info">
            <div class="top-item">
                <img src="../assets/home-user.png" alt="" style="width:64px;height:64px">
                <div style="text-align:center">
                    <div style="margin-bottom:10px;font-weight:700">用户量</div>
                    <div>{{model.usernum}}</div>
                </div>
            </div>
            <div class="top-item">
                <img src="../assets/home-product.png" alt="" style="width:64px;height:64px">
                <div style="text-align:center">
                    <div style="margin-bottom:10px;font-weight:700">商品量</div>
                    <div>{{model.productnum}}</div>
                </div>
            </div>
            <div class="top-item">
                <img src="../assets/home-article.png" alt="" style="width:64px;height:64px">
                <div style="text-align:center">
                    <div style="margin-bottom:10px;font-weight:700">文章量</div>
                    <div>{{model.articlenum}}</div>
                </div>
            </div>
            <div class="top-item">
                <img src="../assets/home-topic.png" alt="" style="width:64px;height:64px">
                <div style="text-align:center">
                    <div style="margin-bottom:10px;font-weight:700">话题量</div>
                    <div>{{model.topicnum}}</div>
                </div>
            </div>
            <div class="top-item">
                <img src="../assets/home-buy.png" alt="" style="width:64px;height:64px">
                <div style="text-align:center">
                    <div style="margin-bottom:10px;font-weight:700">交易量</div>
                    <div>{{model.buynum}}</div>
                </div>
            </div>
        </div>
        <div style="margin-top:20px;">
            <div id="chart" style="width: 600px;height:400px;"></div>
        </div>
    </div>
</template>

<script>
import {ADMIN} from '../api/globol'
import echarts from 'echarts'
export default {
    data(){
        return{
            model:{},
            myChart:'',
            echarts1_option:{
					backgroundColor: '#fff',
                    //标题
                    title: {
                        text: '商品分类',
                        subtext:'饼图',
                        left: 'center',
                        top: 20,
                        textStyle: {
                        color: '#ccc',
                        fontStyle:'italic'//标题字体
                        }
                    },
                    //弹窗，响应鼠标指向，显示具体细节
                    tooltip : {
                        trigger: 'item',//以具体项目触发弹窗
                        /*
                        内容格式器，一共有abcd四个代号，例如在饼图中，{a}指系列，即流量来源，{b}指数据项目，如搜索引擎，{c}指数值，如
                        value，{d}百分比。{x}本身代表了相应字符，可以和其他字符拼凑，在弹窗中显示
                        */
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    //图例，选择要显示的项目
                    legend:{
                        orient:'vertical',
                        left:'left',
                        textStyle:{
                        color:'#c8c8d0'
                        },
                        data:['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']  //注意要和数据的name相对应
                    },
                    //工具箱
                    toolbox:{
                        show:true,//显示工具箱
                        feature:{
                        dataView:{show:true}, //以文字形式显示数据
                        restore:{show:true},   //还原
                        //dataZoom:{show:true}, //区域缩放
                        saveAsImage:{show:true},  //保存图片
                        //magicType:{type:['line','bar']}//动态数据切换，数据显示可以在该规定内容中切换显示方式，
                        }
                    },
                    //视觉映射组件，将数据映射到视觉元素上
                    visualMap: {
                        show: false,
                        min: 0,
                        max: 50,
                        dimension: 0, //选取数据的维度，如人数据：[身高，体重]，则1代表将体重进行映射，默认值为数组的最后一位
                        // seriesIndex: 4, //选取数据集合中的哪个数组，如{一班}，{二班}，默认选取data中的所有数据集
                        inRange: {
                        //选定了要映射的对象，用inRange详细写要渲染的具体细节，[x，y]中x指最小值对应的量（亮度，饱和度等），y指最大值对应的量，其余的按各自value线性渲染
                        color:['red'],
                        colorLightness: [0,1],
                        colorSaturation:[0,1]
                        }
                    },
                    //数据
                    series : [
                        {
                        name:'访问来源',
                        type:'pie',
                        radius : '55%',
                        center: ['50%', '50%'],
                        data:[
                            {value:335, name:'直接访问'},
                            {value:310, name:'邮件营销'},
                            {value:274, name:'联盟广告'},
                            {value:235, name:'视频广告'},
                            {value:400, name:'搜索引擎'}
                        ].sort(function (a, b) { return a.value - b.value; }),
                        roseType: 'radius',//角度和半径展现百分比，'area'只用半径展现
                        label: { //饼图图形的文本标签
                            normal: {  //下同，normal指在普通情况下样式，而非高亮时样式
                            textStyle: {
                                color: 'rgba(255, 255, 255, 0.3)'
                            }
                            }
                        },
                        labelLine: {  //引导线样式
                            normal: {
                            lineStyle: {
                                color: 'rgba(255, 255, 255, 0.3)'
                            },
                            smooth: 0.5, //0-1，越大越平滑弯曲
                            length: 10,  //从块到文字的第一段长
                            length2: 20  //拐弯到文字的段长
                            }
                        },
                        itemStyle: { //图例样式
                            normal: {
                            color: '#97413c',
                            shadowBlur: 50,//阴影模糊程度
                            shadowColor: 'rgba(0, 0, 0, 0.3)'//阴影颜色，一般黑
                            }
                        },
                    
                        animationType: 'scale', //初始动画效果，scale是缩放，expansion是展开
                        animationEasing: 'elasticOut', //初始动画缓动效果
                        animationDelay: function (idx) {  //数据更新动画时长，idx限定了每个数据块从无到有的速度
                            return Math.random() * 200;
                        }
                        }
                    ]
				},
        }
    },
    methods:{
         compare(p){ //这是比较函数
            return function(m,n){
                var a = m[p];
                var b = n[p];
                return a - b; //升序
            }
        },
        getData(){
            this.$http.post(ADMIN+'/showData').then(res=>{
                this.model = res.data
                let max = 0
                let min = 0
                // this.model.productcharts.sort(compare("value"))
                // console.log(this.model.productcharts)
                this.echarts1_option.legend.data = this.model.categorycharts
                this.echarts1_option.series[0].data=this.model.productcharts
                this.myChart.setOption(this.echarts1_option);
            })
        },
    },
    mounted(){
        this.myChart = echarts.init(document.getElementById('chart'));
        this.getData()
         
    }
}
</script>

<style scoped>
.container{
    padding: 5px;
    min-height:500px;
    background-color:#f7f7f7!important;
}
.top-info{
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
    width:100%;
}
.top-item{
    width:18%;
    height: 100px;
    background: #fff;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-shadow: 0 2px 4px 2px #999;
}
</style>