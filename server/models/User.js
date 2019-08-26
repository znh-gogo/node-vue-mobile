const mongoose = require('mongoose')


const schema = new mongoose.Schema({
    name:{type:String},
    relative:{type:mongoose.SchemaTypes.ObjectId,ref:'User'}
})

module.exports = mongoose.model('User',schema)