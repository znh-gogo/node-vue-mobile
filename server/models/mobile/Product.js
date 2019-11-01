const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  pro_description: { type: String },
  pro_categories:[{ type: mongoose.SchemaTypes.ObjectId, ref: 'GoodCategory' }],
  pro_imgs:[{ type:String }],
  pro_price:{ type:Number },
  pro_address:{type:String},
  paybackflag:{type:Number,default:0}, //退款申请标识 0正常1退款申请2同意退款3拒绝
  sendOrderList:{type:String},//快递订单
  buyflag:{type:Number,default:0}, //0未购买1已购买2交易完成3已下架
  buyer:{ type: mongoose.SchemaTypes.ObjectId, ref: 'Account' },
  seller: { type: mongoose.SchemaTypes.ObjectId, ref: 'Account' },
  pro_attention: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Account' }],
  comments:[
      {
        com_content:{type:String},
        com_time:{type:Date,default:Date.now},
        relative:{ type: mongoose.SchemaTypes.ObjectId, ref: 'Account' }
      }
  ]  
},{timestamps: true})

module.exports = mongoose.model('Product', schema)