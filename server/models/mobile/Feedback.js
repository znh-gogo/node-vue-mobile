const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  feedbacktopic:{ type: String,required:true },
  feedbackcontent: { type: String,required:true },
  feedbackimg:[{type:String}],
  feedbackflag:{ type:Number,default:0 }, //0未处理1已处理
  relative: { type: mongoose.SchemaTypes.ObjectId, ref: 'Account' },
},{timestamps: true})

module.exports = mongoose.model('Feedback', schema)