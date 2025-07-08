const express = require("express");
const dishviewrouter = express.Router();
const Category = require("../models/Category");
const { upload, cloudinary } = require("../config/cloudinaryUpload");

const multiUpload = upload.array("images", 5); // Upload up to 5 files

// GET all categories
dishviewrouter.get("/", async (req, res) => {
  try {
    const dishes = await Category.find();
    res.json(dishes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

// UPDATE category
dishviewrouter.put("/:id", multiUpload, async (req, res) => {
  try {
    const { title, desc, price } = req.body;
    const existingImages = req.body.existingImages || [];
    const newImageUrls = req.body.imageUrls || [];
    let finalImages = [];

    // Add existing images
    if (typeof existingImages === "string") {
      finalImages.push(existingImages);
    } else {
      finalImages = [...existingImages];
    }

    // Add new image URLs
    if (typeof newImageUrls === "string") {
      finalImages.push(newImageUrls);
    } else {
      finalImages.push(...newImageUrls);
    }

    // Upload new files to Cloudinary
    for (const file of req.files) {
      const result = await cloudinary.uploader.upload(file.path);
      finalImages.push(result.secure_url);
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      {
        title,
        desc,
        price,
        images: finalImages,
      },
      { new: true }
    );

    res.json(updatedCategory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update category" });
  }
});

// DELETE category
dishviewrouter.delete("/:id", async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete category" });
  }
});

module.exports = dishviewrouter;
