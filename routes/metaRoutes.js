const express = require('express');
const router = express.Router();
const Meta = require('../models/Meta');

// GET Meta
router.get('/meta', async (req, res) => {
  try {
    const meta = await Meta.findOne();
    if (!meta) return res.status(404).json({ error: 'No meta found' });
    res.json(meta);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST/UPDATE Meta
router.post('/meta', async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || !description) return res.status(400).json({ error: 'Fields required' });

    const updatedMeta = await Meta.findOneAndUpdate(
      {},
      { title, description },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.json({ message: 'Meta updated successfully', meta: updatedMeta });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;