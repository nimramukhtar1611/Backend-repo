const express = require("express");
const Product = require("../models/Product");
const { upload, cloudinary } = require("../config/cloudinaryUpload");

const Productviewrouter = express.Router();
const multiUpload = upload.array("images", 10); // Upload up to 10 files

// ✅ Helper function to upload image from buffer using Cloudinary
const streamUpload = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "image" },
      (error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    );
    stream.end(buffer); // use file.buffer here
  });
};

// ✅ GET all products
Productviewrouter.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// ✅ DELETE product
Productviewrouter.delete("/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete product" });
  }
});

// ✅ UPDATE product
Productviewrouter.put("/:id", multiUpload, async (req, res) => {
  try {
    const { title, desc, price } = req.body;

    let existingImages = req.body.existingImages || [];
    let newImageUrls = req.body.imageUrls || [];

    // Normalize to arrays
    if (typeof existingImages === "string") existingImages = [existingImages];
    if (typeof newImageUrls === "string") newImageUrls = [newImageUrls];

    const finalImages = [...existingImages, ...newImageUrls];

    // ✅ Upload new files from memory buffer
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await streamUpload(file.buffer); // use buffer, not path
        finalImages.push(result.secure_url);
      }
    }

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      {
        title,
        desc,
        price,
        images: finalImages,
      },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ error: "Failed to update product" });
  }
});

module.exports = Productviewrouter;

