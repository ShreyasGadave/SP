const mongoose = require("mongoose");

const UserDB = mongoose.Schema(
  {
    Username: { type: String },

    Email: { type: String },
  },
//   { timestamps: true }
);

const User = mongoose.model("UserData", UserDB);
module.exports = User;
