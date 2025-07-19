const express = require("express");
const dishviewrouter = express.Router();
const Category = require("../models/Category");
const { upload, cloudinary } = require("../config/cloudinaryUpload");

const multiUpload = upload.array("images", 5);
dishviewrouter.get("/", async (req, res) => {
  try {
    const dishes = await Category.find();
    res.json(dishes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});
dishviewrouter.put("/:id", multiUpload, async (req, res) => {
  try {
    const { title, desc, price, metaTitle,
       metaDescription, } = req.body;

    const existingImages = Array.isArray(req.body.existingImages)
      ? req.body.existingImages
      : req.body.existingImages ? [req.body.existingImages] : [];

    const newImageUrls = Array.isArray(req.body.imageUrls)
      ? req.body.imageUrls
      : req.body.imageUrls ? [req.body.imageUrls] : [];

    // Initialize finalImages with both existing and new URLs
    let finalImages = [...existingImages, ...newImageUrls];

    // streamUpload helper
    const streamUpload = (fileBuffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: "image" },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        stream.end(fileBuffer);
      });
    };

    // Upload any desktop-uploaded files (req.files) to Cloudinary
    for (const file of req.files) {
      const result = await streamUpload(file.buffer);
      finalImages.push(result.secure_url);
    }

    // Update category in DB
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      {
        title,
        desc,
        price,
         metaTitle,
       metaDescription,
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
