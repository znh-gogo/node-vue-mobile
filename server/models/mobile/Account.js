const mongoose = require('mongoose')


const schema = new mongoose.Schema({
    account:{type:String,required:true,index:{unique:true}},
    password:{type:String,required:true,select:false},
    email:{type:String},
    telephone:{type:Number},
    nickname:{type:String,default:'小萌新'},
    headImg:{type:String,default:'https://s2.ax1x.com/2019/08/24/my1zWR.jpg'},
    description:{type:String,default:'这个人比较懒，什么都没有...'},
    address:{type:String},
    frozen:{type:Number,default:1}, //0冻结1解冻
    money:{type:Number,default:parseFloat(0.00),select:false},
    authflag:{type:Number,default:0} //身份表面 0用户1管理员
    // autoLogin:{type:Boolean,default:false},//自动登陆
    // backgroundImg:{type:String,default:'https://s2.ax1x.com/2019/08/28/m7QXKf.jpg'}
})

module.exports = mongoose.model('Account',schema)