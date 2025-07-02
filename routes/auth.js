const express = require("express");
const adminrouter = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/user");

adminrouter.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const adminUsername = "admin@restaurantevgo.com";
  const adminPassword = "Hygensdreadcup200";

  if (username !== adminUsername) return res.status(401).json({ msg: "Invalid Email" });

  if (password !== adminPassword) return res.status(401).json({ msg: "Invalid Password" });

  res.json({ success: true });
});
module.exports = adminrouter;