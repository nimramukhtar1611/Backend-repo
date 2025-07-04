const express = require('express');
const contactrouter = express.Router();
const Contact = require('../models/Contact');

// Get Contact Info
contactrouter.get('/', async (req, res) => {
  try {
    let contact = await Contact.findOne();
    if (!contact) {
      contact = new Contact({ 
        email: 'example@example.com', 
        phone: '000-0000000', 
        address: 'Your Address Here' 
      });
      await contact.save();
    }
    res.json(contact);
  } catch (err) {
    console.error("GET /api/contact Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Update Contact Info
contactrouter.put('/update', async (req, res) => {
  try {
    let contact = await Contact.findOne(); // define it first

    if (!contact) {
      contact = new Contact({ 
        email: req.body.email || 'example@example.com', 
        phone: req.body.phone || '000-0000000', 
        address: req.body.address || 'Your Address Here' 
      });
    } else {
      contact.email = req.body.email;
      contact.phone = req.body.phone;
      contact.address = req.body.address;
    }

    await contact.save();
    res.json({ message: 'Updated successfully', contact });
  } catch (err) {
    console.error("PUT /api/contact/update Error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = contactrouter;

