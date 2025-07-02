const express = require("express");
const Product = require("../models/Product");
const { upload, cloudinary } = require("../config/cloudinaryUpload");
const productRouter = express.Router();
productRouter.post("/", upload.single("image"), async (req, res) => {
  try {
    const file = req.file;
    const { title, desc, category, image } = req.body;

    if ((!file && !image) || !title || !desc || !category) {
      return res.status(400).json({ error: "All fields are required" });
    }

    let imageUrl = "";

    if (file) {
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "product" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(file.buffer);
      });
      imageUrl = result.secure_url;
    } else {
      imageUrl = image; 
    }

    const newProduct = new Product({
      title,
      desc,
      image: imageUrl,
      category,
    });

    await newProduct.save();
    res.status(201).json({ message: "Product added successfully" });

  } catch (err) {
    console.error("Error creating product:", err);
    res.status(500).json({ error: "Server error while creating product" });
  }
});
productRouter.get("/", async (req, res) => {
  try {
    const products = await Product.find().populate("category");
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Server error while fetching products" });
  }
});

module.exports = productRouter;
