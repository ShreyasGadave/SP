require("dotenv").config();
const express = require("express");
const cors = require("cors");
const ConnectDB = require("./ConnectDB");
const FormRouter = require("./router/Form");
const ErrorRouter = require("./router/Error");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Connect to MongoDB
ConnectDB(process.env.MONGOOSE_URL);

// Routes
app.use(FormRouter); // Use FormRouter for API routes

// Error Handling Middleware (MUST be last)
app.use(ErrorRouter);

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
