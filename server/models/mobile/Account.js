const mongoose = require('mongoose')


const schema = new mongoose.Schema({
    account:{type:String,required:true,index:{unique:true}},
    password:{type:String,required:true},
    email:{type:String},
    telephone:{type:Number},
    nickname:{type:String,default:'小萌新'},
    headImg:{type:String,default:'https://s2.ax1x.com/2019/08/24/my1zWR.jpg'},
    description:{type:String,default:'这个人比较懒，什么都没有...'},
    frozen:{type:Number,default:1}, //0冻结1解冻
})

module.exports = mongoose.model('Account',schema)