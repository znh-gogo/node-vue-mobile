const mongoose = require('mongoose')


const schema = new mongoose.Schema({
    adminName:{type:String},
    password:{type:String},
    authflag:{type:Number,default:1} //身份表面 0用户1管理员
})

module.exports = mongoose.model('AdminUser',schema)