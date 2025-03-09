const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    Username: { type: String, required: true },
    Email: { type: String, required: true, unique: true },
    img: { type: String } // Store image URL
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserData", UserSchema);
