const express = require('express');
const Footer = require('../models/Footer');
const footerrouter = express.Router();

footerrouter.get('/', async (req, res) => {
  try {
    let data = await Footer.findOne();
    if (!data) {
      data = await new Footer({
        brand: 'YourBrand',
        description: 'Welcome...',
        quickLinks: [],
        openingHours: [],
        newsletterText: '',
        copyright: '',
        socialLinks: {}
      }).save();
    }
    res.json(data);
  } catch (err) {
    console.error("Error fetching footer:", err);
    res.status(500).json({ message: "Failed to fetch footer data" });
  }
});

footerrouter.put('/', async (req, res) => {
  try {
    const { body } = req;
    let footer = await Footer.findOne();

    if (!footer) {
      footer = new Footer(body);
    } else {
      Object.assign(footer, body);
    }

    await footer.save();
    res.json(footer);
  } catch (err) {
    console.error("Error saving footer:", err);
    res.status(500).json({ message: "Failed to update footer" });
  }
});

module.exports = footerrouter;
