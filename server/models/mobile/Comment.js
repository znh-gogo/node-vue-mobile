const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  comment: { type: String },
  commentuser: { type: mongoose.SchemaTypes.ObjectId, ref: 'Account' },
},{timestamps: true})

module.exports = mongoose.model('Comment', schema)