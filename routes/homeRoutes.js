const express = require("express");
const homerouter = express.Router();
const HomeSettings = require("../models/HomeSettings");
const { upload, cloudinary } = require("../config/cloudinaryUpload");

const multiUpload = upload.array("images", 10); // max 10 images

// Get Home Carousel Images
homerouter.get("/", async (req, res) => {
  try {
    const settings = await HomeSettings.findOne();
    res.json(settings || { carouselImages: [] });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch home settings" });
  }
});

// Update/Add Carousel Images
homerouter.post("/", multiUpload, async (req, res) => {
  try {
    let { imageUrls } = req.body;
    const files = req.files;

    // Normalize imageUrls
    if (typeof imageUrls === "string") {
      imageUrls = [imageUrls];
    }

    const uploaded = [];

    if (files && files.length > 0) {
      for (const file of files) {
        const uploadedImage = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "carousel" },
            (err, result) => {
              if (err) return reject(err);
              resolve(result.secure_url);
            }
          );
          stream.end(file.buffer);
        });

        uploaded.push(uploadedImage);
      }
    }

    const allImages = [...(imageUrls || []), ...uploaded];

    let settings = await HomeSettings.findOne();
    if (settings) {
      settings.carouselImages = allImages;
      await settings.save();
    } else {
      settings = await HomeSettings.create({ carouselImages: allImages });
    }

    res.json({ message: "Carousel updated successfully", data: settings });
  } catch (err) {
    console.error("Carousel update error:", err);
    res.status(500).json({
      error: "Failed to update carousel",
      details: err.message || err,
    });
  }
});


module.exports = homerouter;
