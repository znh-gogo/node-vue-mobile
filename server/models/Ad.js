const mongoose = require('mongoose')


const schema = new mongoose.Schema({
    ad_name:{type:String},
    ad_description:{type:String},
    ad_img:{type:String},
    ad_money:{type:Number},
    ad_timeline:{type:Date},
    ad_timestart:{type:Date},
    ad_flag:{type:Number,default:0},//0申请中1通过申请2拒绝申请
    ad_remarks:{type:String},
    relative:{type:mongoose.SchemaTypes.ObjectId,ref:'Account'}
},{timestamps: true})

module.exports = mongoose.model('Ad',schema)