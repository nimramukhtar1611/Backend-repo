const mongoose = require("mongoose");

const homeSettingsSchema = new mongoose.Schema({
  carouselImages: [{ type: String, required: true }],
});

const HomeSettings = mongoose.model("HomeSettings", homeSettingsSchema);
module.exports = HomeSettings;
