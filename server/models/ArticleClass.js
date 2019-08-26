const mongoose = require('mongoose')


const acschema = new mongoose.Schema({
    className:{type:String}
})

module.exports = mongoose.model('ArticleClass',acschema)