const mongoose = require("mongoose");

function ConnectDB(URL) {
  mongoose
    .connect(URL)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log(err));
}
module.exports = ConnectDB;
