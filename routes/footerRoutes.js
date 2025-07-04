const express = require('express');
const Footer = require('../models/Footer');

const footerrouter = express.Router();
footerrouter.get('/', async (req, res) => {
  try {
    let data = await Footer.findOne();

    if (!data) {
      data = await new Footer({
        brand: "Test Brand",
        description: "This is a test description.",
        quickLinks: ["Home", "Products"],
        openingHours: [{ day: "Mon-Fri", time: "9AM-5PM" }],
        newsletterText: "Sign up!",
        copyright: "© 2025 Test Brand",
        socialLinks: {
          instagram: "http://instagram.com/test",
          facebook: "http://facebook.com/test",
          twitter: "http://twitter.com/test",
          youtube: "http://youtube.com/test",
        },
      }).save();
    }

    res.json(data);
  } catch (err) {
    console.error("Error fetching footer:", err);
    res.status(500).json({ message: "Failed to fetch footer data", error: err.message });
  }
});
footerrouter.put('/', async (req, res) => {
  try {
    const body = req.body;

    if (!body) {
      return res.status(400).json({ message: "Request body is required" });
    }

    let footer = await Footer.findOne();

    if (!footer) {
      footer = new Footer(body);
    } else {
      Object.assign(footer, body);
    }

    const saved = await footer.save();
    res.json(saved);
  } catch (err) {
    console.error("Error saving footer:", err);
    res.status(500).json({ message: "Failed to update footer", error: err.message });
  }
});

module.exports = footerrouter;
