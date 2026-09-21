const express = require("express");

const app = express();

app.use(express.json());

app.get("/api", (req, res) => {
  res.status(200).json({
    message: "Backend is working!"
  });
});

module.exports = app;
