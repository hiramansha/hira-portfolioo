const express = require("express");

const app = express();

app.use(express.json());
app.use(express.static("."));

app.get("/api", (req, res) => {
  res.json({ message: "Backend is working!" });
});

app.post("/api/contact", (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      message: "Please fill in all fields."
    });
  }

  res.json({
    message: `Thank you, ${name}! Your message has been received.`
  });
});

module.exports = app;
