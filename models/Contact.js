const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true }
});

const Contact = mongoose.model('Contact', contactSchema);
module.exports = Contact;