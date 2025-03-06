const express = require("express");
const FormRouter = express.Router();
const User = require("../models/User");

FormRouter.get("/form", async (req, res) => {
  try {
    const users = await User.find({}); // Retrieve all users from MongoDB
    res.json(users); // Send retrieved users as JSON response
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" }); // Handle errors
  }
});

// POST: Add new user data to the database
FormRouter.post("/form", async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: "Request body is empty" }); // Return error if request body is empty
    }
    await User.create(req.body); // Create a new user document in the database
    const allUsers = await User.find({}); // Fetch updated list of users
    res.json(allUsers); // Send updated users list as response
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" }); // Handle errors
  }
});

// DELETE: Remove a user from the database using their ID
FormRouter.delete("/form/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id); // Find and delete user by ID
    if (!deletedUser) return res.status(404).json({ error: "User not found" }); // If user not found, return error
    const updatedUsers = await User.find({}); // Fetch updated list of users
    res.json(updatedUsers); // Send updated users list as response
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" }); // Handle errors
  }
});

// PUT: Update existing user data using their ID
FormRouter.put("/form/:id", async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: "Request body is empty" }); // Return error if request body is empty
    }
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }); // Find and update user
    if (!updatedUser) return res.status(404).json({ error: "User not found" }); // If user not found, return error
    res.json(updatedUser); // Send updated user data as response
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" }); // Handle errors
  }
});

module.exports = FormRouter;
