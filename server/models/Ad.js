const mongoose = require('mongoose')


const schema = new mongoose.Schema({
    ad_name:{type:String},
    ad_description:{type:String},
    ad_img:{type:String},
    ad_price:{type:Number},
    ad_timeline:{type:Date},
    ad_timelong:{type:Number},
    ad_timestart:{type:Date},
    ad_flag:{type:Number,default:0},//0申请中1拒绝申请2通过申请请支付3支付成功可以展示
    ad_showflag:{type:Number,default:1},//1显示0不显示
    ad_remarks:{type:String},
    relative:{type:mongoose.SchemaTypes.ObjectId,ref:'Account'}
},{timestamps: true})

module.exports = mongoose.model('Ad',schema)