const express = require("express");
const Category = require ('../models/Category')
const dishviewrouter = express.Router();

dishviewrouter.get("/", async (req, res) => {
  const dishes = await Category.find();
  res.json(dishes);
});

dishviewrouter.delete("/:id", async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Failed to delete dish" });
  }
});

module.exports = dishviewrouter;