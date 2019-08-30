const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    comcontent:[
        {
        content:{type:String},
        talker:{type:mongoose.SchemaTypes.ObjectId,ref: 'Account'},
        createtime:{type:Date,default:Date.now}
        }
    ],
    sendrelative:{type:mongoose.SchemaTypes.ObjectId,ref: 'Account'},
    receiverelative:{type:mongoose.SchemaTypes.ObjectId,ref: 'Account'},
},{timestamps: true})

module.exports = mongoose.model('Communication', schema)