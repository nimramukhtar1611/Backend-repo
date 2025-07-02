const mongoose = require('mongoose');

const metaSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true }
}, { timestamps: true });

const Meta = mongoose.model('Meta', metaSchema);
module.exports=Meta
