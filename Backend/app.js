require("dotenv").config(); // Load environment variables from .env file
const express = require("express"); // Import Express framework
const cors = require("cors"); // Import CORS to allow cross-origin requests
const ConnectDB = require("./ConnectDB"); // Import database connection function
const User = require("./User"); // Import User model for MongoDB operations

const app = express(); // Initialize Express app
const PORT = process.env.PORT

// Middleware
app.use(cors()); // Enable CORS to allow API access from different origins
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded data (used for form submissions)
app.use(express.json()); // Middleware to parse incoming JSON data

// Connect to MongoDB using environment variable URL
ConnectDB(process.env.MONGOOSE_URL);

app.get('/',(req,res)=>{
  res.send('Server is running')
})

// GET: Fetch all users from the database
app.get("/form", async (req, res) => {
  try {
    const users = await User.find({}); // Retrieve all users from MongoDB
    res.json(users); // Send retrieved users as JSON response
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" }); // Handle errors
  }
});

// POST: Add new user data to the database
app.post("/form", async (req, res) => {
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
app.delete("/form/:id", async (req, res) => {
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
app.put("/form/:id", async (req, res) => {
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

// Start the server and listen on the specified port
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
