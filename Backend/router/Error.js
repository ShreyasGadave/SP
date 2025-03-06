const express = require("express");
const ErrorRouter = express.Router();

ErrorRouter.get("/", (req, res) => {
    res.send("Server is running");
  });

  module.exports=ErrorRouter;