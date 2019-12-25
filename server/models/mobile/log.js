const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  log_name: { type: String },
  log_desc: { type: String },
  log_status: { type: String },
  log_agent: { type: String },
  log_url: { type: String },
  log_method: { type: String },
  log_ip: { type: String },
},{timestamps: true})

module.exports = mongoose.model('Log', schema)