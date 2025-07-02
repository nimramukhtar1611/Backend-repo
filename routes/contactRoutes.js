const express = require('express');
const contactrouter = express.Router();
const Contact = require('../models/Contact');

// Get Contact Info
contactrouter.get('/', async (req, res) => {
  try {
    let contact = await Contact.findOne();
    if (!contact) {
      contact = new Contact({ email: '', phone: '', address: '' });
      await contact.save();
    }
    res.json(contact);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Contact Info
contactrouter.put('/update', async (req, res) => {
  try {
    let contact = await Contact.findOne();
    if (!contact) {
      contact = new Contact(req.body);
    } else {
      contact.email = req.body.email;
      contact.phone = req.body.phone;
      contact.address = req.body.address;
    }
    await contact.save();
    res.json({ message: 'Updated successfully', contact });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = contactrouter;

