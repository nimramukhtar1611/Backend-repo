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

    if (typeof imageUrls === "string") {
      imageUrls = [imageUrls];
    }

    let uploaded = [];

    if (files?.length > 0) {
      uploaded = await Promise.all(
        files.map(
          (file) =>
            new Promise((resolve, reject) => {
              const stream = cloudinary.uploader.upload_stream(
                { folder: "carousel" },
                (err, result) => {
                  if (err) return reject(err);
                  resolve(result.secure_url);
                }
              );
              stream.end(file.buffer);
            })
        )
      );
    }

    let settings = await HomeSettings.findOne();

    if (settings) {
      // Append both URL and uploaded files
      if (imageUrls?.length > 0) {
        settings.carouselImages.push(...imageUrls);
      }
      if (uploaded.length > 0) {
        settings.carouselImages.push(...uploaded);
      }

      await settings.save();
    } else {
      settings = await HomeSettings.create({
        carouselImages: [...(imageUrls || []), ...uploaded],
      });
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


// DELETE an image from carousel
homerouter.put("/delete-image", async (req, res) => {
  try {
    const { imageUrl } = req.body;

    const settings = await HomeSettings.findOne();
    if (!settings) return res.status(404).json({ error: "HomeSettings not found" });

    settings.carouselImages = settings.carouselImages.filter((url) => url !== imageUrl);
    await settings.save();

    res.json({ message: "Image deleted", data: settings.carouselImages });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete image", details: err.message });
  }
});


module.exports = homerouter;
