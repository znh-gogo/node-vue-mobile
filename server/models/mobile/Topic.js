const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  // topicname: { type: String },
  topiccontent: { type: String },
  topicImg:[{type:String}],
  thinkgood:[{type: mongoose.SchemaTypes.ObjectId, ref: 'Account'}],
  relative: { type: mongoose.SchemaTypes.ObjectId, ref: 'Account' },
  topiccomment:[{type: mongoose.SchemaTypes.ObjectId, ref: 'Comment'}]
},{timestamps: true})

module.exports = mongoose.model('Topic', schema)