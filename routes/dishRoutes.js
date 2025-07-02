const express = require("express");
const dishrouter = express.Router();
const Category = require("../models/Category");
const { upload, cloudinary } = require("../config/cloudinaryUpload");
dishrouter.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});
dishrouter.post("/", upload.single("image"), async (req, res) => {
  try {
    const file = req.file;
    const { title, desc, price, image } = req.body;

    if ((!file && !image) || !title || !desc || !price) {
      return res.status(400).json({ error: "All fields are required" });
    }

    let imageUrl = "";

    if (file) {
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "category" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(file.buffer);
      });
      imageUrl = result.secure_url;
    } else {
      imageUrl = image; // direct URL from frontend
    }

    const newCategory = new Category({
      title,
      desc,
      price,
      image: imageUrl,
    });

    await newCategory.save();
    res.status(201).json({ message: "Category added successfully" });

  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ error: "Failed to add category" });
  }
});


module.exports = dishrouter;
