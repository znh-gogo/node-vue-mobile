const mongoose = require('mongoose')


const articleschema = new mongoose.Schema({
    articleName:{type:String},
    articleContent:{type:String},
    relative:[{type:mongoose.SchemaTypes.ObjectId,ref:'ArticleClass'}],
    art_attention: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Account' }],
},{timestamps: true})

module.exports = mongoose.model('Article',articleschema)