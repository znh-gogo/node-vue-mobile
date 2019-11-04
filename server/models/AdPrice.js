const mongoose = require('mongoose')


const schema = new mongoose.Schema({
    ad_price:{type:Number},
    ad_timeline:{type:Number}
},{timestamps: true})

module.exports = mongoose.model('AdPrice',schema)