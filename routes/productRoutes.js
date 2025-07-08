const express = require("express");
const Product = require("../models/Product");
const { upload, cloudinary } = require("../config/cloudinaryUpload");
const productRouter = express.Router();
const multiUpload = upload.array("images", 10); // Support up to 10 uploads

// Create new product
productRouter.post("/", multiUpload, async (req, res) => {
  try {
    const files = req.files;
    const { title, desc, category, price } = req.body;

    let imageUrls = req.body.imageUrls || [];
    if (typeof imageUrls === "string") {
      imageUrls = [imageUrls];
    }

    if ((!files || files.length === 0) && imageUrls.length === 0) {
      return res.status(400).json({ error: "At least one image is required" });
    }

    const uploadedImages = [];

    // Upload desktop-uploaded images
    if (files && files.length > 0) {
      for (const file of files) {
        try {
          const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
              { folder: "products", resource_type: "image" },
              (error, result) => {
                if (error) {
                  console.error("Cloudinary Upload Error:", error);
                  reject(error);
                } else {
                  resolve(result);
                }
              }
            ).end(file.buffer);
          });

          if (uploadResult?.secure_url) {
            uploadedImages.push(uploadResult.secure_url);
          }
        } catch (err) {
          // Log which file failed
          console.error("Error uploading file:", file.originalname, err);
          return res.status(500).json({ error: "Failed to upload one or more images" });
        }
      }
    }

    // Merge with URL-based images
    uploadedImages.push(...imageUrls);

    const newProduct = new Product({
      title,
      desc,
      price,
      category,
      images: uploadedImages,
    });

    await newProduct.save();
    res.status(201).json({ message: "Product added successfully" });

  } catch (err) {
    console.error("Server Error in /products:", err);
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
