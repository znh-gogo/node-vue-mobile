const mongoose = require('mongoose')


const mpschema = new mongoose.Schema({
    makername: {type:String,index:{unique:true}},
    makerage:{type:Number},
    makersex:{type:Number}, //0男1女
    makerdescription:{type:String},
    makericon:{type:String}
})

module.exports = mongoose.model('PlanMaker',mpschema)