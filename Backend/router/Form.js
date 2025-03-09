const express = require("express");
const FormRouter = express.Router();
const User = require("../models/User");
const upload = require("../models/multerConfig"); // Corrected path

// GET: Retrieve all users
FormRouter.get("/form", async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// POST: Add new user with image upload
FormRouter.post("/form", upload.single("img"), async (req, res) => {
  try {
    console.log("Uploaded Image:", req.file); // Log image details

    if (!req.body.Username || !req.body.Email) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newUser = new User({
      Username: req.body.Username,
      Email: req.body.Email,
      img: req.file ? req.file.path : "", // Save image path
    });

    await newUser.save();
    res.status(201).json({ message: "User added successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});

// DELETE: Remove user by ID
FormRouter.delete("/form/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ error: "User not found" });

    res.json({ message: "User deleted successfully", deletedUser });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// PUT: Update user details (including image)
FormRouter.put("/form/:id", upload.single("img"), async (req, res) => {
  try {
    console.log("Updated Image:", req.file); // Log image details

    const updatedFields = { ...req.body };
    if (req.file) {
      updatedFields.img = req.file.path; // Update image if a new one is uploaded
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, updatedFields, { new: true });

    if (!updatedUser) return res.status(404).json({ error: "User not found" });

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});

module.exports = FormRouter;
