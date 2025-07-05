const express = require("express");
const Product = require ('../models/Product')
const Productviewrouter = express.Router();

Productviewrouter.get("/", async (req, res) => {
  const Products = await Product.find();
  res.json(Products);
});

Productviewrouter.delete("/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
           console.error( error);
    res.status(500).json({ error: "Failed to delete dish" });
  }
});

module.exports = Productviewrouter;