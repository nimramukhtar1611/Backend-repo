const mongoose = require('mongoose');

const FooterSchema = new mongoose.Schema({
  brand: String,
  description: String,
  quickLinks: [String],
  openingHours: [{ day: String, time: String }],
  newsletterText: String,
  copyright: String,
  socialLinks: {
    instagram: String,
    facebook: String,
    twitter: String,
    youtube: String
  }
});

const Footer = mongoose.model('Footer', FooterSchema);
module.exports= Footer