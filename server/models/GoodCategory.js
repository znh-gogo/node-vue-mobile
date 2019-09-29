const mongoose = require('mongoose')


const schema = new mongoose.Schema({
    goodcategory:{type:String},
    // icon:{type:String}
    
})

module.exports = mongoose.model('GoodCategory',schema)