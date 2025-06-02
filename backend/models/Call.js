const mongoose = require('mongoose');

const callSchema = new mongoose.Schema({
  call_id: { type: String, required: true, unique: true },
  userId: { type: String },           
  transcript: String,
  summary: String,
  analysis: Object,
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Call', callSchema);