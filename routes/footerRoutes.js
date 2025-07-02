const express = require('express');
const Footer = require('../models/Footer');
const footerrouter = express.Router();
footerrouter.get('/', async (req, res) => {
  const data = await Footer.findOne();
  res.json(data);
});
footerrouter.put('/', async (req, res) => {
  const { body } = req;
  let footer = await Footer.findOne();
  if (!footer) {
    footer = new Footer(body);
  } else {
    Object.assign(footer, body);
  }
  await footer.save();
  res.json(footer);
});

module.exports = footerrouter;