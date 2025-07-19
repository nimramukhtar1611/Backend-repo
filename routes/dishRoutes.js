const express = require("express");
const dishrouter = express.Router();
const Category = require("../models/Category");
const { upload, cloudinary } = require("../config/cloudinaryUpload");
const multiUpload = upload.array("images", 10); // allow up to 10 images

// Get all categories
dishrouter.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

// Add new category
dishrouter.post("/", multiUpload, async (req, res) => {
  try {
    const files = req.files;
    const { title, desc, price,metaTitle, metaDescription } = req.body;

    let imageUrls = req.body.imageUrls || [];
    if (typeof imageUrls === "string") {
      imageUrls = [imageUrls];
    }

    if ((!files || files.length === 0) && imageUrls.length === 0) {
      return res.status(400).json({ error: "At least one image required" });
    }

    const uploadedImages = [];

    if (files && files.length > 0) {
      for (const file of files) {
        const uploadResult = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "category",
              resource_type: "image",
            },
            (error, result) => {
              if (error) {
                console.error("Cloudinary upload error:", error);
                reject(error);
              } else {
                resolve(result);
              }
            }
          );
          stream.end(file.buffer);
        });

        if (uploadResult?.secure_url) {
          uploadedImages.push(uploadResult.secure_url);
        }
      }
    }

    uploadedImages.push(...imageUrls);

    const newCategory = new Category({
      title,
      desc,
      price,
      metaTitle,
       metaDescription,
      images: uploadedImages,
    });

    await newCategory.save();
    res.status(201).json({ message: "Category added successfully" });
  } catch (error) {
    console.error("Upload Error Stack:", error.stack);
    res.status(500).json({
      error: "Failed to add category",
      details: error.message,
    });
  }
});

module.exports = dishrouter;
